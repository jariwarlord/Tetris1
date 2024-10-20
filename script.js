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
function moveTetrominoDown(){
    if(!checkCollision()){
        position.y += 1;
    } else {
        fixTetromino();
        currentTetro = getRandomTetro();
        position = {x: Math.floor(COLS/2) - 1, y: 0};
    }
    
};
function fixTetromino(){
    for(let row = 0; row < currentTetro.shape.length; row++){
        for(let col = 0; col < currentTetro.shape[row].length; col++){
            if(currentTetro.shape[row][col] !== 0){
                board[position.y + row][position.x + col] = currentTetro;
            }
        }
    }

}

function checkCollision(){
    if(position.y + tetromino.shape.length >= ROWS){
        return true;
    }
    return false;
};

function clearCanvas() {
    context.clearRect(0,0, canvas.width, canvas.height);
};

function startGame(){
    clearCanvas();
    currentTetro = getRandomTetro();
    position = {x: COLS/2 - 1, y: 0};
    requestAnimationFrame(gameLoop)
};



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