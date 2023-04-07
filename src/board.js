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
		// Add header
		const header = document.createElement("div");
		header.classList.add("header");
		this.container.appendChild(header);

		// Add score
		const scoreContainer = document.createElement("div");
		scoreContainer.classList.add("score-container");
		scoreContainer.id = `S${this.id}`;
		header.appendChild(scoreContainer);

		const scoreLabel = document.createElement("div");
		scoreLabel.classList.add("score-label");
		scoreLabel.innerText = "Score: 0";
		scoreContainer.appendChild(scoreLabel);

		// add main container

		const mainContainer = document.createElement("div");
		mainContainer.classList.add("main-container");
		this.container.appendChild(mainContainer);

		// Add hold
		const holdContainer = document.createElement("div");
		holdContainer.classList.add("hold-container");
		holdContainer.id = `H${this.id}`;
		mainContainer.appendChild(holdContainer);

		const holdShape = document.createElement("div");
		holdShape.classList.add("hold-shape", "shape-container");
		holdContainer.appendChild(holdShape);

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const holdCell = document.createElement("div");
				holdCell.classList.add("hold-cell", "cell");
				holdCell.id = `H${this.id}_${i}-${j}`;
				holdShape.appendChild(holdCell);
			}
		}

		// Create grid
		const grid = document.createElement("div");
		grid.classList.add("grid");

		mainContainer.appendChild(grid);

		for (let j = GRID_HEIGHT - 1; j >= 0; j--) {
			for (let i = 0; i < GRID_WIDTH; i++) {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.id = `G${this.id}_${i}-${j}`;
				grid.appendChild(cell);
			}
		}

		// Add queue
		const queueContainer = document.createElement("div");
		queueContainer.classList.add("queue-container");
		queueContainer.id = `Q${this.id}`;

		const queueWrapper = document.createElement("div");
		queueWrapper.classList.add("queue-wrapper");
		mainContainer.appendChild(queueWrapper);
		queueWrapper.appendChild(queueContainer);

		for (let i = 0; i < 3; i++) {
			const queueShape = document.createElement("div");
			queueShape.classList.add("queue-shape", "shape-container");
			queueShape.id = `Q${this.id}_${i}`;
			queueContainer.appendChild(queueShape);

			for (let k = 3; k >= 0; k--) {
				for (let j = 0; j < 4; j++) {
					const queueCell = document.createElement("div");
					queueCell.classList.add("queue-cell", "cell");
					queueCell.id = `Q${this.id}_${i}-${j}-${k}`;
					queueShape.appendChild(queueCell);
				}
			}
		}
	}

	setGrid(x, y, value) {
		this.matrix[y][x] = value;
	}

	getGrid(x, y) {
		return this.matrix[y][x];
	}

	setQueue(index, shape) {
		// clear specified queue
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const element = document.querySelector(
					`#Q${this.id}_${index}-${i}-${j}`
				);
				if (!element) return;
				element.classList.remove("full");
				element.style.setProperty("--color", "");
			}
		}

		if (!shape?.data) return;

		shape?.data[0].forEach((cell) => {
			const x = shape.origin.x + cell.x;
			const y = shape.origin.y + cell.y;
			const element = document.querySelector(
				`#Q${this.id}_${index}-${x}-${y}`
			);
			if (!element) return;
			element.classList.add("full");
			element.style.setProperty("--color", shape.color);
		});
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
		let cleared = 0;
		for (let i = 0; i < GRID_HEIGHT; i++) {
			const row = this.matrix[i];
			if (row.every((c) => c != 0)) {
				cleared++;
				this.moveLines(i);
				i--;
			}
		}

		return cleared;
	}
}
