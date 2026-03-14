(function() {
    //Состояние игры
    let size = 3;
    let board = [];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameOver = false;

    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const sizeInput = document.getElementById('size');
    const newGameBtn = document.getElementById('newGame');
    const resetBtn = document.getElementById('reset');

    //Создание пустой доски
    function createBoard(s) {
        return Array(s).fill().map(() => Array(s).fill(null));
    }

    //Проверка победы
    function checkWin() {
        const s = size;

        //Проверка строк
        for (let i = 0; i < s; i++) {
            if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
                return board[i][0];
            }
        }

        //Проверка колонок
        for (let j = 0; j < s; j++) {
            let first = board[0][j];
            if (first) {
                let win = true;
                for (let i = 1; i < s; i++) {
                    if (board[i][j] !== first) {
                        win = false;
                        break;
                    }
                }
                if (win) return first;
            }
        }

        //Главная диагональ
        let first = board[0][0];
        if (first) {
            let win = true;
            for (let i = 1; i < s; i++) {
                if (board[i][i] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) return first;
        }

        //Побочная диагональ
        first = board[0][s-1];
        if (first) {
            let win = true;
            for (let i = 1; i < s; i++) {
                if (board[i][s-1-i] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) return first;
        }

        //Проверка на ничью
        for (let i = 0; i < s; i++) {
            for (let j = 0; j < s; j++) {
                if (board[i][j] === null) return null;
            }
        }
        return 'draw';
    }

    // Обработка клика по клетке
    function handleClick(row, col) {
        if (!gameActive || gameOver || board[row][col]) return;

        //Ставим символ
        board[row][col] = currentPlayer;
        
        //Проверяем результат
        const result = checkWin();
        
        if (result) {
            gameOver = true;
            gameActive = false;
            if (result === 'draw') {
                statusEl.textContent = 'Ничья!';
            } else {
                statusEl.textContent = `Победитель ${result}!`;
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusEl.textContent = `Ход: ${currentPlayer}`;
        }
        
        renderBoard();
    }

    //Отрисовка доски
    function renderBoard() {
        boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        boardEl.innerHTML = '';

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[i][j] === 'X') {
                    cell.textContent = 'X';
                    cell.classList.add('x');
                } else if (board[i][j] === 'O') {
                    cell.textContent = 'O';
                    cell.classList.add('o');
                }
                cell.addEventListener('click', () => handleClick(i, j));
                boardEl.appendChild(cell);
            }
        }
    }

    //Сброс игры
    function reset(useNewSize = false) {
        if (useNewSize) {
            let newSize = parseInt(sizeInput.value);
            if (isNaN(newSize) || newSize < 3) newSize = 3;
            if (newSize > 8) newSize = 8;
            size = newSize;
            sizeInput.value = size;
        }
        
        board = createBoard(size);
        currentPlayer = 'X';
        gameActive = true;
        gameOver = false;
        statusEl.textContent = 'Ход: X';
        renderBoard();
    }

    //Инициализация
    sizeInput.value = 3;
    reset();

    //События кнопок
    newGameBtn.addEventListener('click', () => reset(true));
    resetBtn.addEventListener('click', () => reset(false));

    //Валидация ввода
    sizeInput.addEventListener('change', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 3) this.value = 3;
        if (val > 8) this.value = 8;
    });
})();