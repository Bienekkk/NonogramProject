import { checkCol, checkRow, checkAllCol, checkAllRow }  from "./functions.js"

let colDiv = document.querySelector('.colDiv');
let rowDiv = document.querySelector('.rowDiv');
let fields = document.querySelectorAll('.field');
let checkbox = document.getElementById('checkbox');
let endDiv = document.querySelector('.endDiv');
let endText = document.querySelector('.endText');
let imgDiv = document.querySelector('.imgDiv');


let fieldArr = Array.prototype.slice.call(fields)
let blue;
checkbox.disabled = true;


let stage = 1;
let checkedAmount = 0;
let targetAmount = 0;
let toNext = 0;
let toClick = [];
let clickedCounter = 0;


const stageData = {
    1: {
        toClick: fieldArr.filter(el => el.id >= 5 && el.id <= 9),
        rowHighlight: '.row1',
        colHighlight: null,
        requiredChecks: 5,
        enableCheckbox: false,
        text: "Your task is to check as many boxes as it writes next to this row. Click all 5 boxes in the 2nd row."
    },
    2: {
        toClick: fieldArr.filter(el => el.id >= 10 && el.id <= 14),
        rowHighlight: '.row2',
        colHighlight: null,
        requiredChecks: 5,
        enableCheckbox: false,
        text: "Now, complete the 3rd row in the same way."
    },
    3: {
        toClick: [],
        rowHighlight: null,
        colHighlight: null,
        requiredChecks: 1,
        enableCheckbox: true,
        text: 'Change mode to "X"s by checking the box bellow.'
    },
    4: {
        toClick: fieldArr.filter(el => el.id == 0 || el.id == 15 || el.id == 20),
        rowHighlight: null,
        colHighlight: '.col0',
        requiredChecks: 3,
        enableCheckbox: false,
        text: "You can fill in the 1st column because there is nothing left to check (number above this column changed color to gray)."
    },
    5: {
        toClick: fieldArr.filter(el => el.id == 4 || el.id == 19 || el.id == 24),
        rowHighlight: null,
        colHighlight: '.col4',
        requiredChecks: 3,
        enableCheckbox: false,
        text: "Same situation in the last column. You know what to do!"
    },
    6: {
        toClick: [],
        rowHighlight: null,
        colHighlight: null,
        requiredChecks: 1,
        enableCheckbox: true,
        text: "Now go back to checking mode (click the checkbox bellow)."
    },
    7: {
        toClick: fieldArr.filter(el => el.id >= 16 && el.id <= 18),
        rowHighlight: '.row3',
        colHighlight: null,
        requiredChecks: 3,
        enableCheckbox: false,
        text: "There are only 3 empty boxes in 4th row and the number on the left says 3. Check all these boxes!"
    },
    8: {
        toClick: fieldArr.filter(el => el.id == 1 || el.id == 3),
        rowHighlight: '.row0',
        colHighlight: null,
        requiredChecks: 2,
        enableCheckbox: false,
        text: "In the 1st row there are two numbers. That means it needs to be at least one space between them. Check the outside boxes in 1st row!"
    },
    9: {
        toClick: [],
        rowHighlight: null,
        colHighlight: null,
        requiredChecks: 1,
        enableCheckbox: true,
        text: 'Change mode to "X"s because you completed 1st row.'
    },
    10: {
        toClick: fieldArr.filter(el => el.id == 2),
        rowHighlight: '.row0',
        colHighlight: null,
        requiredChecks: 1,
        enableCheckbox: false,
        text: "Mark the remaining empty box in the 1st row."
    },
    11: {
        toClick: [],
        rowHighlight: null,
        colHighlight: null,
        requiredChecks: 1,
        enableCheckbox: true,
        text: "Change the mode to check the last box."
    },
    12: {
        toClick: fieldArr.filter(el => el.id == 22),
        rowHighlight: '.col2',
        colHighlight: '.row4',
        requiredChecks: 1,
        enableCheckbox: false,
        text: "Finish by filling the 4th box in 3rd column."
    }
};
checkbox.addEventListener("click", () => {
    if (!checkbox.disabled) {
        checkAction(null);
    }
});

let json = {
          "img": "serce.png",
          "col": [[2],[4],[4],[4],[2]],
          "row": [[1,1],[5],[5],[3],[1]],
          "arr":
          [0,1,0,1,0,
          1,1,1,1,1,
          1,1,1,1,1,
          0,1,1,1,0,
          0,0,1,0,0]
      };

let arr = json["arr"];
let mode = Math.sqrt(arr.length)

for (let i = 0; i < arr.length; i++){
    if(arr[i]==1){
        targetAmount++;
    }
}
let cols = json["col"];
for (let i = 0; i < cols.length; i++) {
    const col = document.createElement("p");
    col.classList.add('col', `col${i}`);
    col.setAttribute('draggable', false);
    cols[i].forEach((element, index) => col.innerHTML += `<span class="col${i} colId${index}">${element}</span>`);
    colDiv.appendChild(col);
}

let rows = json["row"];
for (let i = 0; i < rows.length; i++) {
    const row = document.createElement("p");
    row.classList.add('row', `row${i}`);
    row.setAttribute('draggable', false);
    rows[i].forEach((element, index) => row.innerHTML += `<span class="row${i} rowId${index}">${element}</span>` + " ");
    rowDiv.appendChild(row);
}

blue = document.querySelector('.row1')
colors()


let hearts = 3;
let wait = false;

//click actions
let isMouseDown = false;
let startX = null;
let startY = null;
let lockedDirection = null;

function handles() {
    toClick.forEach((field) => {
        field.addEventListener("dragstart", (event) => event.preventDefault());

        field.addEventListener("mousedown", () => {
            isMouseDown = true;
            const { x, y } = field.dataset;
            startX = parseInt(x);
            startY = parseInt(y);
            lockedDirection = null;
            checkAction(field);
        });

        field.addEventListener("mouseenter", () => {
            if (isMouseDown) {
                const { x, y } = field.dataset;
                const currX = parseInt(x);
                const currY = parseInt(y);

                if (!lockedDirection) {
                    if (currX !== startX) lockedDirection = "hor";
                    else if (currY !== startY) lockedDirection = "ver";
                }

                if (
                    (lockedDirection === "hor" && currY === startY) ||
                    (lockedDirection === "ver" && currX === startX) ||
                    lockedDirection === null
                ) {
                    checkAction(field);
                }
            }
        });

        field.addEventListener("mouseup", () => {
            isMouseDown = false;
        });
    });
}

document.addEventListener("mouseup", () => {
    isMouseDown = false;
    startX = null;
    startY = null;
    lockedDirection = null;
});

document.addEventListener("selectstart", (event) => {
    event.preventDefault();
});

function checkAction(field) {
    if (!field) {
        updateClicked(false);
        return;
    }

    if (wait || field.style.backgroundColor === 'rgb(30, 30, 30)' || field.hasChildNodes()) return;

    const col = field.id % mode;
    const row = Math.floor(field.id / mode);

    if (arr[field.id] === 1) {
        field.style.backgroundColor = "#1E1E1E";
        field.classList.add("checked");
        checkAllRow(row, rows, mode);
        checkAllCol(col, cols, mode);
        updateClicked(true);
    } else {
        const x = document.createElement('i');
        x.classList.add('bi', 'bi-x-lg');
        field.appendChild(x);
        updateClicked(false);
    }

    checkCol(col, cols, mode);
    checkRow(row, rows, mode);
}

async function updateClicked(increment = true) {
    checkedAmount++;

    if(increment){
        clickedCounter++
    }


    if (checkedAmount >= toNext) {
        stage++;
        loadStage(stage);
    }

    if (clickedCounter === targetAmount) {
        await new Promise(resolve => setTimeout(resolve, 500));
        endGame();
    }
}

function loadStage(stageNumber) {
    const stageConfig = stageData[stageNumber];
    if (!stageConfig) return;

    offColors();

    toClick = stageConfig.toClick;
    toNext = stageConfig.requiredChecks;
    checkedAmount = 0;
    checkbox.disabled = !stageConfig.enableCheckbox;

    blue = null
    if (stageConfig.rowHighlight) {
        blue = document.querySelector(stageConfig.rowHighlight);
    }
    if (stageConfig.colHighlight) {
        blue = document.querySelector(stageConfig.colHighlight);
    }

    handles();
    colors();

    document.getElementById("cloud").innerText = stageConfig.text || "";
}

function colors() {
    if (blue) blue.style.border = "3px solid aqua";

    if (toClick.length === 0) return;

    const isColumn = blue && blue.classList.contains("col");

    const sortedFields = [...toClick].sort((a, b) => a.id - b.id);

    const groups = [];
    let currentGroup = [sortedFields[0]];

    for (let i = 1; i < sortedFields.length; i++) {
        const prev = parseInt(sortedFields[i - 1].id);
        const curr = parseInt(sortedFields[i].id);

        const expectedDiff = isColumn ? 5 : 1;
        if (curr - prev === expectedDiff) {
            currentGroup.push(sortedFields[i]);
        } else {
            groups.push(currentGroup);
            currentGroup = [sortedFields[i]];
        }
    }
    groups.push(currentGroup);

    groups.forEach(group => {
        group.forEach((el, idx) => {
            el.style.border = "none";

            if (isColumn) {
                el.style.borderLeft = "3px solid red";
                el.style.borderRight = "3px solid red";
                el.style.borderTop = "1px solid black";
                el.style.borderBottom = "1px solid black";
                if (idx === 0) el.style.borderTop = "3px solid red";
                if (idx === group.length - 1) el.style.borderBottom = "3px solid red";
            } else {
                el.style.borderTop = "3px solid red";
                el.style.borderBottom = "3px solid red";
                el.style.borderLeft = "1px solid black";
                el.style.borderRight = "1px solid black";
                if (idx === 0) el.style.borderLeft = "3px solid red";
                if (idx === group.length - 1) el.style.borderRight = "3px solid red";
            }
        });
    });
}

function offColors() {
    fieldArr.forEach(field => {
        field.style.borderTop = "1px solid black";
        field.style.borderBottom = "1px solid black";
        field.style.borderLeft = "1px solid black";
        field.style.borderRight = "1px solid black";
    });

    if (blue) blue.style.border = "";
}

async function endGame(){
        wait = true;
        imgDiv.style.display = "block";
        imgDiv.style.opacity = 1;
        const img = document.createElement('img');
        img.classList.add('img');
        img.style.animation = "opacity 1s linear 1 forwards";
        let imgSrc = './static/src/img/' + json['img'];
        img.src = imgSrc;
        imgDiv.appendChild(img);

        await new Promise(resolve => setTimeout(resolve, 2000));
        endDiv.style.display = 'block';
        endText.innerText = "Thanks for playing the tutorial!";
}

loadStage(stage);