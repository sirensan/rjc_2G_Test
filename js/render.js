/**
 * 現在の盤面の状態を描画する.
 */
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W = 300, H = 500;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

/**
 * 指定されたx軸、y軸の場所へブロックを描画.
 */
function drawBlock(x, y) {
	ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
	ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
}

/**
 * 盤面および操作ブロックを描画.
 */
function render() {
	ctx.clearRect(0, 0, W, H);
	ctx.strokeStyle = 'black';

	// 盤面を描画
	for (var x = 0; x < COLS; ++x) {
		for (var y = 0; y < ROWS; ++y) {
			if (board[y][x]) {
				ctx.fillStyle = colors[board[y][x] - 1];
				drawBlock(x, y);
			}
		}
	}

	// 操作ブロックを描画
	for (var y = 0; y < 4; ++y) {
		for (var x = 0; x < 4; ++x) {
			if (current[y][x]) {
				ctx.fillStyle = colors[current[y][x] - 1];
				drawBlock(currentX + x, currentY + y);
			}
		}
	}
}

setInterval(render, 30);