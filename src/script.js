const gridContainer = document.querySelector("#grid-0");

const GRID_WIDTH = 10;
const GRID_HEIGHT = 24;

const board = new GameBoard(gridContainer);
const game = new Game(board);

// add AI games
const wrapper = document.querySelector(".grid-wrapper");
for (let i = 1; i < 12; i++) {
	const grid = document.createElement("div");
	grid.classList.add("grid");
	grid.id = `grid-${i}`;
	wrapper.appendChild(grid);
	new Game(new GameBoard(grid));
}

document.addEventListener("keydown", (e) => {
	const keyActions = {
		ArrowLeft: () => game.moveLeft(),
		ArrowRight: () => game.moveRight(),
		ArrowDown: () => game.moveDown(),
		ArrowUp: () => game.rotate(),
		" ": () => game.drop(),
	};

	const action = keyActions[e.key];
	if (action) action();
});

Game.loop();
