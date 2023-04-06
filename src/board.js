class GameBoard {
	static count = 0;
	matrix = null;
	constructor(container) {
		this.id = ++GameBoard.count;
		this.container = container;

		this.matrix = Array(GRID_HEIGHT)
			.fill(0)
			.map(() => Array(GRID_WIDTH).fill(0));

		this.fillHTML();
	}

	fillHTML() {
		for (let j = GRID_HEIGHT - 1; j >= 0; j--) {
			const row = document.createElement("div");
			row.classList.add("row");
			this.container.appendChild(row);
			for (let i = 0; i < GRID_WIDTH; i++) {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.id = `G${this.id}_${i}-${j}`;

				row.appendChild(cell);
			}
		}
	}

	setGrid(x, y, value) {
		this.matrix[y][x] = value;
	}

	getGrid(x, y) {
		return this.matrix[y][x];
	}

	setTile(x, y, color, outline = false) {
		const element = document.querySelector(`#G${this.id}_${x}-${y}`);
		if (!element) return;
		if (color === null) {
			element.classList.remove("full");
			element.style.setProperty("--color", "");
			return;
		}

		if (outline) {
			element.classList.add("outline");
			element.classList.remove("full");
		} else {
			element.classList.remove("outline");
			element.classList.add("full");
		}
		element.style.setProperty("--color", color);
	}

	moveLines(minY) {
		for (let y = minY; y < GRID_HEIGHT - 1; y++) {
			for (let x = 0; x < GRID_WIDTH; x++) {
				const above = this.getGrid(x, y + 1);
				this.setGrid(x, y, above);
				this.setTile(x, y, ShapeTemplate.getColor(above));
			}
		}
	}

	clearLines() {
		for (let i = 0; i < GRID_HEIGHT; i++) {
			const row = this.matrix[i];
			if (row.every((c) => c != 0)) {
				this.moveLines(i);
				i--;
			}
		}
	}
}
