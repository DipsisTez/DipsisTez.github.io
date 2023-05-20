// Получаем элементы из html
const displayPlayer = document.querySelector(".display-player");
const tiles = document.querySelectorAll(".tile");
const announcer = document.querySelector(".announcer");
const resetButton = document.getElementById("reset");

// Объявляем переменные для игры
let currentPlayer = "X"; // Текущий игрок
let board = ["", "", "", "", "", "", "", "", ""]; // Состояние доски
let isGameActive = true; // Флаг активности игры
let winningMessage = `Игрок ${currentPlayer} выиграл!`; // Сообщение о победе
let drawMessage = "Ничья!"; // Сообщение о ничьей
let turnMessage = `Ход игрока ${currentPlayer}`; // Сообщение о ходе
let computerPlayer; // Символ бота

// Возможные выигрышные комбинации
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Функция для обработки клика по ячейке
function handleTileClick(event) {
  // Получаем индекс ячейки из атрибута data-cell-index
  const index = event.target.getAttribute("data-cell-index");

  // Проверяем, что ячейка пустая и игра активна
  if (board[index] !== "" || !isGameActive) {
    return;
  }

  // Записываем символ текущего игрока в ячейку и доску
  event.target.innerHTML = currentPlayer;
  board[index] = currentPlayer;

  // Проверяем, есть ли победитель или ничья
  checkResult();
}

// Функция для проверки результата игры
function checkResult() {
  // Перебираем все выигрышные комбинации и сравниваем с доской
  for (let i = 0; i < winningConditions.length; i++) {
    const condition = winningConditions[i];
    const a = board[condition[0]];
    const b = board[condition[1]];
    const c = board[condition[2]];

    // Если все три ячейки одинаковые и не пустые, то есть победитель
    if (a === b && b === c && a !== "") {
      // Объявляем победителя и останавливаем игру
      announcer.innerHTML = winningMessage;
      announcer.classList.remove("hide");
      isGameActive = false;
      return;
    }
  }

  // Если все ячейки заполнены и нет победителя, то есть ничья
  if (!board.includes("")) {
    // Объявляем ничью и останавливаем игру
    announcer.innerHTML = drawMessage;
    announcer.classList.remove("hide");
    isGameActive = false;
    return;
  }

  // Если нет победителя и нет ничьей, то меняем игрока
  changePlayer();
}

// Функция для смены игрока
function changePlayer() {
  // Меняем символ текущего игрока на противоположный
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Меняем сообщение о ходе и класс для цвета текста
  turnMessage = `Ход игрока ${currentPlayer}`;
  displayPlayer.innerHTML = turnMessage;
  
   if (currentPlayer === "X") {
    displayPlayer.classList.remove("playerO");
    displayPlayer.classList.add("playerX");
   } else {
    displayPlayer.classList.remove("playerX");
    displayPlayer.classList.add("playerO");
   }

   // Если текущий игрок совпадает с ботом, то вызываем функцию getComputerMove
   if (currentPlayer === computerPlayer) {
     let computerMove = getComputerMove();
     tiles[computerMove].click();
   }
}

// Функция для получения хода компьютера
function getComputerMove() {
  // Проверяем, может ли компьютер выиграть на следующем ходу
  for (let i = 0; i < board.length; i++) {
    // Если ячейка пустая, то делаем там ход
    if (board[i] === "") {
      board[i] = computerPlayer;
      // Если этот ход приводит к победе, то возвращаем его
      if (getResult(board) === computerPlayer) {
        return i;
      }
      // Иначе возвращаем ячейку в исходное состояние
      board[i] = "";
    }
  }

  // Проверяем, может ли человек выиграть на следующем ходу
  for (let i = 0; i < board.length; i++) {
    // Если ячейка пустая, то делаем там ход
    if (board[i] === "") {
      board[i] = currentPlayer;
      // Если этот ход приводит к победе человека, то блокируем его
      if (getResult(board) === currentPlayer) {
        board[i] = computerPlayer;
        return i;
      }
      // Иначе возвращаем ячейку в исходное состояние
      board[i] = "";
    }
  }

   // Если нет возможности выиграть или проиграть на следующем ходу, то выбираем случайную свободную ячейку
   let emptyCells = [];
   for (let i = 0; i < board.length; i++) {
     if (board[i] === "") {
       emptyCells.push(i);
     }
   }
   let randomIndex = Math.floor(Math.random() * emptyCells.length);
   let randomCell = emptyCells[randomIndex];
   board[randomCell] = computerPlayer;
   return randomCell;
}

// Функция для сброса игры
function resetGame() {
   // Возвращаем все переменные в исходное состояние
   currentPlayer = "X";
   board = ["", "", "", "", "", "", "", "", ""];
   isGameActive = true;
   announcer.classList.add("hide");

   // Очищаем содержимое всех ячеек
   tiles.forEach((tile) => {
     tile.innerHTML = "";
   });

   // Возвращаем сообщение о ходе и класс для цвета текста
   turnMessage = `Ход игрока ${currentPlayer}`;
   displayPlayer.innerHTML = turnMessage;
   
   displayPlayer.classList.remove("playerO");
   displayPlayer.classList.add("playerX");

   // Случайным образом выбираем символ бота ("O" или "X")
   let randomSymbolIndex = Math.floor(Math.random() * ["O", "X"].length);
   computerPlayer= ["O", "X"][randomSymbolIndex];

   // Если бот первый ходит, то запускаем его ход 
   if (computerPlayer === "X") {
     let computerMove= getComputerMove();
     tiles[computerMove].click();
   }
}

// Добавляем обработчики событий на все ячейки и кнопку сброса
tiles.forEach((tile) => {
 tile.addEventListener("click", handleTileClick);
});

resetButton.addEventListener("click", resetGame);
