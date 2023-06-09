class ShapeTemplate {
	static count = 0;
	static colors = [null];

	static shapes = [
		new ShapeTemplate("O", "FFFF00", "0.0,0.1,1.0,1.1", { x: 1, y: 1 }),
		new ShapeTemplate(
			"T",
			"AA00AA",
			"-1.0,0.0,1.0,0.1;0.-1,0.0,1.0,0.1;-1.0,0.0,1.0,0.-1;0.-1,-1.0,0.0,0.1",
			{ x: 2, y: 1 }
		),
		new ShapeTemplate(
			"Z",
			"FF0000",
			"-1.1,0.1,0.0,1.0;1.1,0.0,1.0,0.-1;-1.0,0.0,0.-1,1.-1;0.1,0.0,-1.0,-1.-1",
			{ x: 2, y: 1 }
		),
		new ShapeTemplate(
			"I",
			"00FFFF",
			"-1.0,0.0,1.0,2.0;1.1,1.0,1.-1,1.-2;-1.-1,0.-1,1.-1,2.-1;0.1,0.0,0.-1,0.-2",
			{
				x: 1,
				y: 1,
			}
		),
		new ShapeTemplate(
			"L",
			"FFAA00",
			"-1.0,0.0,1.0,1.1;0.1,0.0,0.-1,1.-1;-1.-1,-1.0,0.0,1.0;-1.1,0.1,0.0,0.-1",
			{ x: 2, y: 1 }
		),
	];

	static {
		ShapeTemplate.shapes.push(
			ShapeTemplate.shapes[4].clone("J", "0000FF").mirror(),
			ShapeTemplate.shapes[2].clone("S", "00FF00").mirror()
		);

		ShapeTemplate.shapes.forEach((shape) => {
			ShapeTemplate.colors.push(shape.color);
		});
	}

	static getColor(id) {
		return ShapeTemplate.colors[id];
	}

	constructor(name, color, datastring, origin = { x: 0, y: 0 }) {
		this.id = ++ShapeTemplate.count;
		this.name = name;
		this.color = "#" + color;
		this.datastring = datastring;
		this.data = datastring.split(";").map((r) =>
			r.split(",").map((v) => {
				const [x, y] = v.split(".").map(Number);
				return { x, y };
			})
		);
		this.origin = origin;
	}

	clone(name, color = this.color) {
		return new ShapeTemplate(name, color, this.datastring, this.origin);
	}

	mirror() {
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
		return this;
	}
}

class Shape {
	constructor(template, game) {
		this.id = template.id;
		this.color = template.color;
		this.data = this.#deepCopy(template.data);
		this.game = game;
		this.board = game.board;

		this.reset();
	}

	#deepCopy(data) {
		const copy = [];
		for (let i = 0; i < data.length; i++) {
			const row = [];
			copy.push(row);
			for (let j = 0; j < data[i].length; j++) {
				const { x, y } = data[i][j];
				row.push({ x, y });
			}
		}
		return copy;
	}

	testCollision(dx, dy) {
		return this.cells.some((cell) => {
			const x = this.x + cell.x + dx;
			const y = this.y + cell.y + dy;

			if (y === -1) return true;
			if (x === -1) return true;
			if (x === GRID_WIDTH) return true;

			return this.board.getGrid(x, y) !== 0;
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
			this.board.setGrid(x, y, this.id);
		});
		this.reset();
		this.board.clearLines();
		this.game.nextShape();
	}

	reset() {
		this.lastData = [];
		this.rotation = 0;
		this.x = GRID_WIDTH / 2;
		this.y = GRID_HEIGHT - 2;
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

		if (this.testCollision(0, 0)) {
			this.x += 1;
			if (this.testCollision(0, 0)) {
				this.x -= 2;
				if (this.testCollision(0, 0)) {
					this.x += 1;
					this.rotation = rot;
					return;
				}
			}
		}

		this.place();
	}

	setTiles(reset = true, darken = false) {
		if (reset) {
			this.lastData.forEach(({ x, y }) => {
				this.board.setTile(x, y, null);
			});

			this.lastData = [];
		}
		this.cells.forEach((cell) => {
			const x = this.x + cell.x;
			const y = this.y + cell.y;
			this.board.setTile(x, y, this.color, darken);
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
