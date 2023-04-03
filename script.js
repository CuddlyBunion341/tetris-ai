console.log("Hello World!");
const playButton = document.querySelector("#playbtn");

const gridContainer = document.querySelector("#grid");

const gridWidth = 10;
const gridHeight = 24;

const matrix = Array(gridHeight)
	.fill(0)
	.map(() => Array(gridWidth).fill(0));

const game = {
	time: 0,
	score: 0,
	paused: true,
};

class Shape {
	static count = 0;
	static colors = [null];

	constructor(color, data) {
		this.id = ++Shape.count;
		this.color = color;
		this.rotation = 0;
		this.datastring = data;

		// data in format of x1.y1,x2.y2,x3.y3;x1.y1,x2.y2,x3.y3;x1.y1,x2.y2,x3.y3
		// where x1,y1 is the first cell, x2,y2 is the second cell, etc.
		// and ; is the next rotation

		// parse data from string
		this.data = data.split(";").map((r) =>
			r.split(",").map((v) => {
				const [x, y] = v.split(".").map(Number);
				return { x, y };
			})
		);

		console.log(this.data);

		this.source = this.#deepCopy(data);
		this.lastData = [];

		this.reset();
	}

	clone() {
		const clone = new Shape(this.color - 1, this.datastring);
		clone.rotation = this.rotation;
		clone.x = this.x;
		clone.y = this.y;
		clone.lastData = this.lastData;
		return clone;
	}

	mirror() {
		// rotations are following:
		// data: [rotation0, rotation1, rotation2, rotation3]
		// at rotation0, the shape is facing up
		// at rotation1, the shape is facing right
		// at rotation2, the shape is facing down
		// at rotation3, the shape is facing left

		// the shape has to be mirrored at every rotation, but with a different axis
		// if rotation is 0 or 2, the axis is the x axis
		// if rotation is 1 or 3, the axis is the y axis

		// the axis is the middle of the shape

		this.data.forEach((rotation, index) => {
			if (index % 2 == 0) {
				rotation.forEach((cell) => {
					cell.x *= -1;
				});
			} else {
				rotation.forEach((cell) => {
					cell.y *= -1;
				});
			}
		});
	}

	#deepCopy(data) {
		const copy = [];
		for (let i = 0; i < data.length; i++) {
			const { x, y } = data[i];
			copy.push({ x, y });
		}
		return copy;
	}

	testCollision(dx, dy) {
		return this.cells.some((cell) => {
			const x = this.x + cell.x + dx;
			const y = this.y + cell.y + dy;

			if (y === -1) return true;
			if (x === -1) return true;
			if (x === gridWidth) return true;

			return matrix[y][x] !== 0;
		});
	}

	moveDown() {
		if (this.testCollision(0, -1)) {
			this.stamp();
			return;
		}

		this.y -= 1;
		this.place();
	}

	stamp() {
		this.place();
		this.cells.forEach((cell) => {
			const x = this.x + cell.x;
			const y = this.y + cell.y;
			matrix[y][x] = this.id;
		});
		this.reset();
		Game.clearLines();
		Game.setRandomShape();
	}

	reset() {
		this.lastData = [];
		this.rotation = 0;
		this.x = gridWidth / 2;
		this.y = gridHeight - 2;
	}

	moveRight() {
		if (this.testCollision(1, 0)) return;
		this.x += 1;
		this.place();
	}

	moveLeft() {
		if (this.testCollision(-1, 0)) return;
		this.x -= 1;
		this.place();
	}

	drop() {
		this.y = this.#lowestY();
		this.stamp();
	}

	#lowestY() {
		let lowestY = 0;
		while (!this.testCollision(0, --lowestY));
		return this.y + lowestY + 1;
	}

	rotate() {
		const rot = this.rotation;

		this.rotation += 1;
		if (this.rotation == 4) this.rotation = 0;
		// test collision
		const collides = this.cells.some((cell) => {
			const x = cell.x + this.x;
			const y = cell.y + this.y;
			return matrix?.[y]?.[x] !== 0;
		});

		if (collides) {
			this.rotation = rot;
			return;
		}

		this.place();
	}

	setTiles(reset = true, darken = false) {
		if (reset) {
			this.lastData.forEach(({ x, y }) => {
				setTile(x, y, 0);
			});

			this.lastData = [];
		}
		this.cells.forEach((cell) => {
			const x = this.x + cell.x;
			const y = this.y + cell.y;
			setTile(x, y, this.color, darken);
			this.lastData.push({ x, y });
		});
	}

	place() {
		if (this.y != this.#lowestY()) {
			this.placeHelper();
			this.setTiles(false);
		} else {
			this.setTiles();
		}
	}

	placeHelper() {
		const y = this.y;
		this.y = this.#lowestY();
		this.setTiles(true, true);
		this.y = y;
	}

	get cells() {
		return this.data[this.rotation] || this.data[0];
	}
}

const shapes = {
	o: new Shape("FFFF00", "0.0,0.1,1.0,1.1"),
	t: new Shape(
		"AA00AA",
		"-1.0,0.0,1.0,0.1;0.-1,0.0,1.0,0.1;-1.0,0.0,1.0,0.-1;0.-1,-1.0,0.0,0.1"
	),
	z: new Shape(
		"FF0000",
		"-1.1,0.1,0.0,1.0;1.1,0.0,1.0,0.-1;-1.0,0.0,0.-1,1.-1;0.1,0.0,-1.0,-1.-1"
	),
	i: new Shape(
		"00FFFF",
		"-1.0,0.0,1.0,2.0;1.1,1.0,1.-1,1.-2;-1.-1,0.-1,1.-1,2.-1;0.1,0.0,0.-1,0.-2"
	),
	l: new Shape(
		"FFAA00",
		"-1.0,0.0,1.0,1.1;0.1,0.0,0.-1,1.-1;-1.-1,-1.0,0.0,1.0;-1.1,0.1,0.0,0.-1"
	),
};

shapes.j = shapes.l.clone();
shapes.j.color = "0000FF";
shapes.j.mirror();

shapes.s = shapes.z.clone();
shapes.s.color = "00FF00";
shapes.s.mirror();

class Game {
	static shape = shapes.l;
	static randomShape() {
		const shapeNames = Object.keys(shapes);
		const randomName =
			shapeNames[Math.floor(Math.random() * shapeNames.length)];

		return shapes[randomName];
	}
	static setRandomShape() {
		Game.shape = Game.randomShape();
		Game.shape.place();
	}
	static loop() {
		console.log(Game.shape);
		Game.shape.moveDown();
		setTimeout(Game.loop, 500);
	}
	static clearLines() {
		const moveLines = (minY) => {
			for (let y = minY; y < gridHeight - 1; y++) {
				for (let x = 0; x < gridWidth; x++) {
					matrix[y][x] = matrix[y + 1][x];
					setTile(x, y, matrix[y][x]);
				}
			}
		};

		for (let i = 0; i < gridHeight; i++) {
			const row = matrix[i];
			if (row.every((c) => c != 0)) {
				moveLines(i);
				i--;
			}
		}
	}
}
Game.loop();

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") {
		Game.shape.moveLeft();
	}
	if (e.key === "ArrowRight") {
		Game.shape.moveRight();
	}
	if (e.key === "ArrowDown") {
		Game.shape.moveDown();
	}
	if (e.key === "ArrowUp") {
		Game.shape.rotate();
	}
	if (e.key === " ") {
		Game.shape.drop();
	}
});

function setTile(x, y, color, darken = false) {
	const element = document.querySelector(`#C${x}-${y}`);
	if (!element) return;
	if (color === 0) {
		element.classList.remove("full");
		element.classList.remove("dark");
		element.style.backgroundColor = "";
		return;
	}

	if (typeof color === "number") {
		color = Shape.colors[color];
	}

	element.classList.add("full");
	if (darken) {
		element.classList.add("dark");
	} else {
		element.classList.remove("dark");
	}
	element.style.backgroundColor = `#${color}`;
}

// load html
for (let j = gridHeight - 1; j >= 0; j--) {
	const row = document.createElement("div");
	row.classList.add("row");
	for (let i = 0; i < gridWidth; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.id = `C${i}-${j}`;

		const value = matrix[j][i];
		if (value !== 0) {
			const color = Shape.colors[matrix[j][i]];
			cell.style.backgroundColor = `#${color}`;
			cell.classList.add("full");
		}

		row.appendChild(cell);
	}
	gridContainer.appendChild(row);
}
