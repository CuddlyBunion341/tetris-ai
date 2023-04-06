const gridContainer = document.querySelector("#grid-0");

const GRID_WIDTH = 10;
const GRID_HEIGHT = 24;

const board = new GameBoard(gridContainer);
const game = new Game(board);

const game2 = new Game(new GameBoard(document.querySelector("#grid-1")));

// // add AI games
// const wrapper = document.querySelector(".grid-wrapper");
// for (let i = 1; i < 2; i++) {
// 	const grid = document.createElement("div");
// 	grid.classList.add("grid");
// 	grid.id = `grid-${i}`;
// 	wrapper.appendChild(grid);
// 	new Game(new GameBoard(grid));
// }

document.addEventListener("keydown", (e) => {
	console.log(e.key);
	const keyActions = {
		ArrowLeft: () => game.moveLeft(),
		ArrowRight: () => game.moveRight(),
		ArrowDown: () => game.moveDown(),
		ArrowUp: () => game.rotate(),
		"/": () => game.drop(),
		w: () => game2.rotate(),
		a: () => game2.moveLeft(),
		s: () => game2.moveDown(),
		d: () => game2.moveRight(),
		x: () => game2.drop(),
	};

	const action = keyActions[e.key];
	if (action) action();
});

Game.loop();
