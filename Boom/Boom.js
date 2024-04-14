const grid = document.getElementById("grid");
let lockGame = false;
//Set test mode"to true if you want see mines location
const testMode = false;
generateGrid();

function generateGrid() {
  lockGame = false;
  grid.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    row = grid.insertRow(i);
    for (let j = 0; j < 10; j++) {
      cell = row.insertCell(j);
      cell.onclick = function () {
        init(this);
      };
      cell.oncontextmenu = function (e) {
        e.stopPropagation();
        e.preventDefault();
        const node = document.querySelector(
          `#grid tbody tr:nth-child(${i + 1}) td:nth-child(${j + 1})`
        );

        node.classList.toggle("flagged");
      };
      let mine = document.createAttribute("mine");
      mine.value = "false";
      cell.setAttributeNode(mine);
    }
  }
  generateMines();
}

//Generate mines randomly
function generateMines() {
  //add 20 mines to game
  for (let i = 0; i < 20; i++) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let cell = grid.rows[row].cells[col];
    cell.setAttribute("mine", "true");
    if (testMode) {
      cell.innerHTML = "!";
    }
  }
}

//Hightlight all mines red
function revealMines() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute("mine") == "true") {
        cell.className = "mine";
      }
    }
  }
}

function checkGameComplete() {
  let gameComplete = true;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (
        grid.rows[i].cells[j].getAttribute("mine") == "false" &&
        grid.rows[i].cells[j].innerHTML == ""
      ) {
        gameComplete = false;
      }
    }
  }
  if (gameComplete) {
    alert("Bạn dò hết ùi <3");
    revealMines();
  }
}

function init(cell) {
  //check game completed or no
  if (lockGame) {
    return;
  } else {
    //Check user clicked on mine
    if (cell.getAttribute("mine") == "true") {
      alert("Chạm mìn òi@@");
      revealMines();
      lockGame = true;
    } else {
      cell.className = "active";

      //Display number of mines around cell
      let mineCount = 0;
      let cellRow = cell.parentNode.rowIndex;
      let cellCol = cell.cellIndex;
      for (
        let i = Math.max(cellRow - 1, 0);
        i <= Math.min(cellRow + 1, 9);
        i++
      ) {
        for (
          let j = Math.max(cellCol - 1, 0);
          j <= Math.min(cellCol + 1, 9);
          j++
        ) {
          if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
            mineCount++;
          }
        }
      }
      cell.innerHTML = mineCount;
      if (mineCount == 0) {
        //if cell don't have mine
        for (
          let i = Math.max(cellRow - 1, 0);
          i <= Math.min(cellRow + 1, 9);
          i++
        ) {
          for (
            let j = Math.max(cellCol - 1, 0);
            j <= Math.min(cellCol + 1, 9);
            j++
          ) {
            if (grid.rows[i].cells[j].innerHTML == "") {
              init(grid.rows[i].cells[j]);
            }
          }
        }
      }
      checkGameComplete();
    }
  }
}
