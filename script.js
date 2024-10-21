const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;

const BLOCK_SIZE = 20;

const TETRO = [
    {
        shape: [
            [1, 1, 1],
            [0, 1, 0]
        ],
        color: 'cyan' // T
    },
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'blue' // kare
    },
    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: 'red' // uzun yatay şekil
    },
    {
        shape: [
            [1, 1, 1],
            [0, 0, 1]
        ],
        color: 'yellow' // yatay l şekli
    },
];

let currentTetro;
let position = { x: 0, y: 0 };
let score = 0;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let dropInterval = 500;
let lastDropTime = 0;
let rowClearedTotal = 0;

function gameLoop(timestamp) {
    clearCanvas();
    drawGrid();
    drawTetro(currentTetro, position);
    drawBoard();
    drawScore();
    moveTetrominoDown(timestamp);
    requestAnimationFrame(gameLoop);
}

function getRandomTetro() {
    const index = Math.floor(Math.random() * TETRO.length);
    return TETRO[index];
}

context.scale(BLOCK_SIZE, BLOCK_SIZE);

function drawTetro(tetromino, position) {
    context.fillStyle = tetromino.color;

    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col] !== 0) {
                context.fillRect(position.x + col, position.y + row, 1, 1);
            }
        }
    }
}

// Hareket
function moveTetrominoDown(timestamp) {
    if (timestamp - lastDropTime >= dropInterval) {
        position.y += 1; // Tetrominoyu aşağı hareket ettir
        lastDropTime = timestamp; // Zamanı güncelle

        if (checkCollision(0, 0)) { // Çarpışma varsa
            position.y -= 1; // Bir önceki pozisyona geri al
            fixTetromino(); // Tetrominoyu tahtaya sabitle
            
            // Yeni tetrominoyu oluştur
            currentTetro = getRandomTetro();
            position = { x: Math.floor(COLS / 2) - 1, y: 0 }; // Yüksekten başlat

            // Eğer çarpışma varsa (yeni tetromino tahtanın üstünde başlarken)
            if (checkCollision(0, 0)) {
                alert("Game Over!"); // Oyun bitti
                resetGame(); // Oyunu sıfırla veya durdur
            }
        }
    }
}
function moveTetrominoLeft() {
    position.x -= 1;
    if (checkCollision()) {
        position.x += 1;
    }
}

function moveTetrominoRight() {
    position.x += 1;
    if (checkCollision()) {
        position.x -= 1;
    }
}
function rotateTetromino() {
    const originalShape = currentTetro.shape;
    const rotatedShape = originalShape[0].map((_, index) =>
        originalShape.map(row => row[index])
    ).reverse();

    currentTetro.shape = rotatedShape;

    // Eğer çarpışma olursa, çeşitli pozisyonlara iterek düzeltmeye çalış
    if (checkCollision(0, 0)) {
        position.x += 1; // Sağ duvardan çek
        if (checkCollision(0, 0)) {
            position.x -= 2; // Sol duvardan çek
            if (checkCollision(0, 0)) {
                // Hiçbir şekilde sığmıyorsa eski şekle geri dön
                position.x += 1;
                currentTetro.shape = originalShape;
            }
        }
    }
}

function fixTetromino() {
    currentTetro.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Eğer tetromino tahtanın dışında kalıyorsa çarpışmayı kontrol et
                if (board[position.y + y] && board[position.y + y][position.x + x] !== undefined) {
                    board[position.y + y][position.x + x] = value;
                }
            }
        });
    });
    clearFullRows()
}

// Klavye dinleme
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;    
    }
});
//Skor
function drawScore(){
    context.fillStyle = 'black';
    context.font = '1px Arial';
    context.fillText('Score: ' + score, 0.1, 1);
}
function clearFullRows() {
    let rowsCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        let isFull = true;

        for (let col = 0; col < COLS; col++) {
            if (!board[row][col]) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            score += 10;
        }
    }
    if(rowsCleared > 0){ 
        score += rowsCleared * 100;
        updateScoreDisplay();

        if(rowsClearedTotal >= 10){
            level++;
            rowsClearedTotal = 0;
            dropInterval -= 100;
            updateLevelDisplay();

        }
    }
}
//Skor
function updateScoreDisplay(){
    document.getElementById('score').innerText = `Score: ${score}`;
}
//Seviye
function updateLevelDisplay(){
    document.getElementById('level').innerText =  `Level: ${level}`;
}
function checkCollision(offsetX, offsetY) {
    return currentTetro.shape.some((row, y) => {
        return row.some((value, x) => {
            if (value !== 0) {
                let newX = position.x + x + offsetX;
                let newY = position.y + y + offsetY;
                
                // Eğer tetromino tahtanın dışına çıkıyorsa veya başka bir bloğa çarpıyorsa
                return (
                    newX < 0 || 
                    newX >= COLS || 
                    newY >= ROWS || 
                    (board[newY] && board[newY][newX] !== 0)
                );
            }
            return false;
        });
    });
}
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function startGame() {
    clearCanvas();
    currentTetro = getRandomTetro();
    position = { x: Math.floor(COLS / 2) - 1, y: 0 };
    requestAnimationFrame(gameLoop);
}
function resetgGame(){
    board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    score = 0;
    rowClearedTotal = 0;
    dropInterval = 500;
    updateScoreDisplay();
    updateLevelDisplay();
    startGame();
}
function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const color = board[row][col];
            if (color) {
                context.fillStyle = color;
                context.fillRect(col, row, 1, 1);
            }
        }
    }
}

function drawGrid() {
    const color = '#ccc';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            context.fillStyle = color;
            context.fillRect(col, row, 1, 1);
        }
    }
}

window.onload = function () {
    startGame();
};
