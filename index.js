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
}

// Добавляем обработчики событий на все ячейки и кнопку сброса
tiles.forEach((tile) => {
 tile.addEventListener("click", handleTileClick);
});

resetButton.addEventListener("click", resetGame);
