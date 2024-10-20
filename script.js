const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;

const BLOCK_SIZE = 20;

const TETRO = [
    {
        shape:[
            [1, 1, 1],
            [0, 1, 0]
        ],
        color: 'cyan' //T
    },
    {
        shape:[
            [1,1],
            [1,1]
        ],
        color: 'blue' //kare
    },
    {
        shape:[
            [1,1,1,1]
        ],
        color: 'red' //uzun yatay şekil
    },
    {
        shape:[
            [1,1,1],
            [0,0,1] 
        ],
        color: 'yellow' // yatay l şekli
    },
]
let currentTetro;
let position = { x :0 , y: 0};

function gameLoop(){
    clearCanvas();
    drawGrid();
    drawTetro(currentTetro, position);
    requestAnimationFrame(gameLoop);
    moveTetrominoDown();
    drawBoard();
};

function getRandomTetro(){
    const index = Math.floor(Math.random() * TETRO.length); // rastgele sayı verir
    return TETRO[index];
}
context.scale(BLOCK_SIZE, BLOCK_SIZE);

function drawTetro(tetromino,position){
    context.fillStyle = tetromino.color;
    
    for(let row = 0; row < tetromino.shape.length; row++){
        for(let col = 0; col < tetromino.shape[row].length; col++){
            if(tetromino.shape[row][col] !== 0){
                context.fillRect(position.x + col, position.y + row, 1,1);
            }
        }
    }
}

//Hareket
function moveTetrominoDown(){
    if(!checkCollision()){
        position.y += 1;
    } else {
        fixTetromino();
        if(checkCollision(0,0)){
            alert("Game Over!");
    } else {
        currentTetro = getRandomTetro();
        position = {x: Math.floor(COLS/2) - 1, y: 0};
        }
    }
};
function moveTetrominoLeft(){
    position.x -= 1;
    if(checkCollision()){
        position.x += 1;
    }
}
function moveTetrominoRight(){
    position.x += 1;
    if(checkCollision()){
        position.x += 1;
    }
}
function fixTetromino(){
    for(let row = 0; row < currentTetro.shape.length; row++){
        for(let col = 0; col < currentTetro.shape[row].length; col++){
            if(currentTetro.shape[row][col] !== 0){
                board[position.y + row][position.x + col] = currentTetro;
            }
        }
    }
    clearFullRows();

}
function clearFullRows(){
    for(let row = ROWS -1; row >= 0; row--){
        let isFull = true;
    
    for (let col=0; col < COLS; col++){
        if(!board[row][col]){
            isFull = false;
            break;
        }
        
    }
    if(isFull){
        board.splice(row, 1);
        board.unshift(Array(COLS).fill(0));
    }

}

function checkCollision(offsetX = 0, offsetY = 0) {
    for (let row = 0; row < currentTetro.shape.length; row++) {
        for (let col = 0; col < currentTetro.shape[row].length; col++) {
            if (currentTetro.shape[row][col] !== 0) {
                const newX = position.x + col + offsetX;
                const newY = position.y + row + offsetY;

                // Oyun alanının dışına çıkma kontrolü
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                // Sabitlenen bloklarla çarpışma kontrolü
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function clearCanvas() {
    context.clearRect(0,0, canvas.width, canvas.height);
};

function startGame(){
    clearCanvas();
    currentTetro = getRandomTetro();
    position = {x: COLS/2 - 1, y: 0};
    requestAnimationFrame(gameLoop)
};

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


function drawGrid(){
    const color = '#ccc';
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            context.fillStyle = color;
            context.fillRect(col, row, 1, 1);
        }
    }
}
window.onload = function(){ 
    startGame();
 }