var board: Array<Array<number>> = [[0,1,0,0,0,0,0,0,0,0],
																	 [0,0,1,0,0,0,0,0,0,0],
																	 [1,1,1,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0],
																	 [0,0,0,0,0,0,0,0,0,0]];

var time: number = 0;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

window.onload = function () {
  canvas = document.querySelector("#canvaas");
  canvas.width = 500;
  canvas.height = 500;
  ctx = canvas.getContext("2d");
	step();
}

function step(): void {
	draw_frame();
	board = calculate_new_board();

	setTimeout(() => {
		step();
	}, 1000)
}

function get_new_state(x: number, y: number): number {
	let alive: number = 0;
	let offset_x: number;
	let offset_y: number;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			offset_x = ((x-1+j)+10)%10;
			offset_y = ((y-1+i)+10)%10;

			if (offset_x == x && offset_y == y) {
				continue;
			}

			if (board[offset_y][offset_x] == 1) {
				alive += 1
			}
		}	
	}
	
	if (board[y][x] == 1) {
		if (alive == 2 || alive == 3) {
			return 1;
		}
	} else {
		if (alive == 3) {
			return 1;
		}
	}
	return 0;
}

function calculate_new_board(): Array<Array<number>> {
	var new_board: Array<Array<number>> = new Array;
	for (let y = 0, l = board.length; y < l; y++) {
		var row: Array<number> = new Array;
		for (let x = 0; x < l; x++) {
			row.push(get_new_state(x, y));
		}
		new_board.push(row);
	}
	return new_board;
}

function fill_white(): void {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 500, 500);
}

function draw_frame(): void {
	fill_white();
	for (let i = 0, l = board.length; i<l; i++) {
		for (let j = 0; j<l; j++) {
			if (board[i][j] == 1) {
				ctx.fillStyle = "white";
			} else {
				ctx.fillStyle = "black";
			}
			let x = j*50;
			let y = i*50;
			ctx.fillRect(x, y, 49, 49);
		}
	}
}
