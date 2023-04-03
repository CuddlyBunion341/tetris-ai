const playButton = document.querySelector("#playbtn");

const gridContainer = document.querySelector("#grid");

const GRID_WIDTH = 10;
const GRID_HEIGHT = 24;

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
for (let j = GRID_HEIGHT - 1; j >= 0; j--) {
	const row = document.createElement("div");
	row.classList.add("row");
	for (let i = 0; i < GRID_WIDTH; i++) {
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
