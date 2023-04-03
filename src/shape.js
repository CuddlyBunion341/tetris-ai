class ShapeTemplate {
	static count = 0;
	static colors = [null];

	static shapes = [
		new ShapeTemplate("O", "FFFF00", "0.0,0.1,1.0,1.1"),
		new ShapeTemplate(
			"T",
			"AA00AA",
			"-1.0,0.0,1.0,0.1;0.-1,0.0,1.0,0.1;-1.0,0.0,1.0,0.-1;0.-1,-1.0,0.0,0.1"
		),
		new ShapeTemplate(
			"Z",
			"FF0000",
			"-1.1,0.1,0.0,1.0;1.1,0.0,1.0,0.-1;-1.0,0.0,0.-1,1.-1;0.1,0.0,-1.0,-1.-1"
		),
		new ShapeTemplate(
			"I",
			"00FFFF",
			"-1.0,0.0,1.0,2.0;1.1,1.0,1.-1,1.-2;-1.-1,0.-1,1.-1,2.-1;0.1,0.0,0.-1,0.-2"
		),
		new ShapeTemplate(
			"L",
			"FFAA00",
			"-1.0,0.0,1.0,1.1;0.1,0.0,0.-1,1.-1;-1.-1,-1.0,0.0,1.0;-1.1,0.1,0.0,0.-1"
		),
	];

	static {
		ShapeTemplate.shapes.push(
			ShapeTemplate.shapes[4].clone("0000FF").mirror()
		);
		ShapeTemplate.shapes.push(
			ShapeTemplate.shapes[2].clone("FF0000").mirror()
		);
	}

	constructor(name, color, datastring) {
		this.id = ++ShapeTemplate.count;
		this.name = name;
		this.color = color;
		this.datastring = datastring;
		this.data = datastring.split(";").map((r) =>
			r.split(",").map((v) => {
				const [x, y] = v.split(".").map(Number);
				return { x, y };
			})
		);
	}

	clone(color = this.color) {
		return new ShapeTemplate(color, this.datastring);
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
		this.color = template.color;
		this.data = this.#deepCopy(template.data);
		this.game = game;
		this.board = game.gameBoard;

		this.reset();
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
			if (x === GRID_WIDTH) return true;

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
