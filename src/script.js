const GRID_WIDTH = 10;
const GRID_HEIGHT = 24;

const game1 = new Game(new GameBoard(document.querySelector("#board-0")));
const game2 = new Game(new GameBoard(document.querySelector("#board-1")));

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
		ArrowLeft: () => game1.moveLeft(),
		ArrowRight: () => game1.moveRight(),
		ArrowDown: () => game1.moveDown(),
		ArrowUp: () => game1.rotate(),
		"/": () => game1.drop(),
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
