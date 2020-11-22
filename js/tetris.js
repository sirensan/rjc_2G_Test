var COLS = 10, ROWS = 20;  // 横10×縦20マス
var board = []; // 基盤
var lose;  
var interval;  
var current;
var currentX, currentY;

// 操作ブロックパターン
var shapes = [
	[ 1, 1, 1, 1 ],
	[ 1, 1, 1, 0, 1 ],
	[ 1, 1, 1, 0, 0, 0, 1 ],
	[ 1, 1, 0, 0, 1, 1 ],
	[ 1, 1, 0, 0, 0, 1, 1 ],
	[ 0, 1, 1, 0, 1, 1 ],
	[ 0, 1, 0, 0, 1, 1, 1 ]
];
// ブロック色パターン
var colors = [
	'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

/**
 *  shapesからブロックパターンをランダムに選択、基盤の上部にセットする.
 */
function newShape() {
	var id = Math.floor(Math.random() * shapes.length);
	var shape = shapes[id];

	current = [];
	for (var y = 0; y < 4; ++y) {
		current[y] = [];
		for (var x = 0; x < 4; ++x) {
			var i = 4 * y + x;
			if (typeof shape[i] != 'undefined' && shape[i]) {
				current[y][x] = id + 1;
			}
			else {
				current[y][x] = 0;
			}
		}
	}
	// ブロックを基盤上部にセット
	currentX = 5;
	currentY = 0;
}

/**
 * 基盤をクリアする.
 */
function init() {
	for ( var y = 0; y < ROWS; ++y ) {
		board[y] = [];
		for ( var x = 0; x < COLS; ++x ) {
			board[y][x] = 0;
		}
	}
}

/**
 * 操作ブロックの降下処理およびゲームオーバー処理.
 */
function tick() {
	if (valid(0, 1)) {
		++currentY;
	}
	// ブロックが着地した場合(直下にブロックあり)
	else {
		freeze();
		clearLines();
		// ゲームオーバーかを判定
		if (lose) {
			if(confirm('再チャレンジしますか？')){
				newGame();
				return false;
			} else {
				closeGame();
			}
		}
		newShape();
	}
}

/**
 * 操作ブロックを盤面上に固定する.
 */
function freeze() {
	for (var y = 0; y < 4; ++y) {
		for (var x = 0; x < 4; ++x) {
			if (current[y][x]) {
				board[y + currentY][x + currentX] = current[y][x];
			}
		}
	}
}

/**
 * 操作ブロックの回転処理.
 */
function rotate( current ) {
	var newCurrent = [];
	for ( var y = 0; y < 4; ++y ) {
		newCurrent[y] = [];
		for ( var x = 0; x < 4; ++x ) {
			newCurrent[y][x] = current[3 - x][y];
		}
	}
    return newCurrent;
}

/**
 * 横一行揃っているものを削除する.
 */
function clearLines() {
	for (var y = ROWS - 1; y >= 0; --y) {
		var rowFilled = true;
		for (var x = 0; x < COLS; ++x) {
			if (board[y][x] == 0) {
				rowFilled = false;
				break;
			}
		}
		if (rowFilled) {
			document.getElementById('clearsound').play();
			for (var yy = y; yy > 0; --yy) {
				for (var x = 0; x < COLS; ++x) {
					board[yy][x] = board[yy - 1][x];
				}
			}
			++y;
		}
	}
}

/**
 * キーボード押下時の処理.
 */
function keyPress(key) {
	switch (key) {
		case 'left':
			if (valid(-1) ) {
				--currentX;
			}
			break;
		case 'right':
			if (valid(1)) {
				++currentX;
			}
			break;
		case 'down':
			if (valid(0, 1) ) {
				++currentY;
			}
			break;
		case 'rotate':
			var rotated = rotate(current);
			// ブロックが回転させられるか判定
			if (valid(0, 0, rotated)) {
				current = rotated;
			}
			break;
	}
}

/**
 * 指定方向への移動が可能かを判定する.
 * また、ゲームオーバー判定も実施する.
 *
 * @param {number} offsetX X軸方向へ動かす量
 * @param {number} offsetY Y軸方向へ動かす量
 * @param {object} newCurrent 操作ブロックオブジェクトの位置情報の連想配列
 */
function valid(offsetX, offsetY, newCurrent) {
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	offsetX = currentX + offsetX;
	offsetY = currentY + offsetY;
	newCurrent = newCurrent || current;

	for (var y = 0; y < 4; ++y) {
		for (var x = 0; x < 4; ++x) {
			if (newCurrent[y][x]) {
				if (typeof board[y + offsetY] == 'undefined'
				  || typeof board[y + offsetY][x + offsetX] == 'undefined'
				  || board[ y + offsetY ][ x + offsetX ]
				  || x + offsetX < 0
				  || y + offsetY >= ROWS
				  || x + offsetX >= COLS ) {
					// 操作ブロックが盤面の上部を超えている場合
					if (offsetY == 1 && offsetX - currentX == 0 && offsetY - currentY == 1) {
						lose = true;
					}
					return false;
				}
			}
		}
	}
	return true;
}

/**
 * ゲーム開始メインロジック.
 */
function newGame() {
	clearInterval(interval);
	init();
	newShape();
	lose = false;
	interval = setInterval(tick, 250);
}

/**
 * ゲームの終了.
 */
function closeGame() {
	clearInterval(interval);
}


$(function(){
	$('#gameStart').on('click', function(){
		newGame();
	});
});