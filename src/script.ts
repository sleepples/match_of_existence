const pixel_size: number = 25;
const board_size: number = 20;

var board: Array<Array<number>> = Array.from({length: board_size}, () => Array(board_size).fill(0));

var paused: boolean = true;

var canvas: HTMLCanvasElement;
var canvas_rect: DOMRect;
var border_width: number;
var ctx: CanvasRenderingContext2D;

var pause_signifier: HTMLSpanElement;
var control_bar: HTMLDivElement;

window.onload = function () {
  canvas = document.querySelector("#canvaas");
  canvas.width = board_size*pixel_size;
  canvas.height = board_size*pixel_size;
	canvas_rect = canvas.getBoundingClientRect();
	border_width = parseInt(getComputedStyle(canvas).getPropertyValue("border-width"));
  ctx = canvas.getContext("2d");

	control_bar = document.querySelector("#control_bar");
	control_bar.style.width = `${canvas.width}px`;

	pause_signifier = document.querySelector("#pause_signifier");

	draw_frame();
	canvas.addEventListener("mousedown", draw);

	step();
}

function draw(e: MouseEvent): void {
	let pos = {
		x: Math.floor((e.pageX - canvas_rect.left - border_width)/pixel_size),
		y: Math.floor((e.pageY - canvas_rect.top - border_width)/pixel_size),
	}

	board[pos.y][pos.x] = board[pos.y][pos.x] ? 0 : 1;
	draw_frame();
}

function stop_start(): void {
	paused = !paused;
	pause_signifier.innerHTML = paused ? ": Paused" : ": Playing";
}

function step(): void {
	if (!paused) {
		board = calculate_new_board();
		draw_frame();
	}

	setTimeout(() => {
		step();
	}, 100)
}

function get_new_state(x: number, y: number): number {
	let alive: number = 0;
	let offset_x: number;
	let offset_y: number;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			offset_x = ((x-1+j)+board_size)%board_size;
			offset_y = ((y-1+i)+board_size)%board_size;

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
	for (let y = 0, l = board_size; y < l; y++) {
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
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw_frame(): void {
	fill_white();
	for (let i = 0, l = board_size; i<l; i++) {
		for (let j = 0; j<l; j++) {
			if (board[i][j] == 1) {
				ctx.fillStyle = "white";
			} else {
				ctx.fillStyle = "black";
			}
			let x = j*pixel_size;
			let y = i*pixel_size;
			ctx.fillRect(x, y, pixel_size-1, pixel_size-1);
		}
	}
}
