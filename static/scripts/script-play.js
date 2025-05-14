import { checkCol, checkRow, checkAllCol, checkAllRow, checkAction }  from "./functions.js"

let colDiv = document.querySelector('.colDiv');
let rowDiv = document.querySelector('.rowDiv');
let fields = document.querySelectorAll('.field');
let checkbox = document.getElementById('checkbox');
let endDiv = document.querySelector('.endDiv');
let endText = document.querySelector('.endText');
let imgDiv = document.querySelector('.imgDiv');

let jsonstr = document.querySelector('.data').innerText;
jsonstr = jsonstr.replaceAll("'", '"');

let json = JSON.parse(jsonstr);

let arr = json["arr"];
let mode = Math.sqrt(arr.length)
let targetAmount = 0;
let checkedAmount = 0;
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

let hearts = 3;
let wait = false;

//click actions
let isMouseDown = false;
let startX = null;
let startY = null;
let lockedDirection = null;

fields.forEach((field) => {
    field.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });

    field.addEventListener("mousedown", () => {
        isMouseDown = true;
        const { x, y } = field.dataset;
        startX = parseInt(x);
        startY = parseInt(y);
        lockedDirection = null;
        checkAction(field, mode, wait, arr, updateClicked, updateHearts, rows, cols);
    });

    field.addEventListener("mouseenter", () => {
        if (isMouseDown) {
            const { x, y } = field.dataset;
            const currX = parseInt(x);
            const currY = parseInt(y);

            if (lockedDirection === null) {
                if (currX !== startX) lockedDirection = "hor";
                else if (currY !== startY) lockedDirection = "ver";
            }

            if (
                (lockedDirection === "hor" && currY === startY) ||
                (lockedDirection === "ver" && currX === startX) ||
                lockedDirection === null
            ) {
                checkAction(field, mode, wait, arr, updateClicked, updateHearts, rows, cols);
            }
        }
    });

    field.addEventListener("mouseup", () => {
        isMouseDown = false;
    });
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
    startX = null;
    startY = null;
    lockedDirection = null;
});

document.addEventListener("selectstart", (event) => {
    event.preventDefault();
});


async function updateHearts(){
    wait = true;
    let heart = document.getElementById(`heart${hearts}`)
    heart.style.filter = 'grayscale(1)'
    hearts--;
    await new Promise(resolve => setTimeout(resolve, 1000));
    if(hearts<=0){
        endGame("You lost!!!")
    }
    wait = false;
}

async function updateClicked(){
    checkedAmount++;
    if(checkedAmount==targetAmount){
        await new Promise(resolve => setTimeout(resolve, 500));
        endGame("You win!!!")
    }
}

async function endGame(text){
    if(text==="You win!!!"){
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
        endText.innerText = text;
    }
    else{
        wait = true;
        endDiv.style.display = 'block';
        endText.innerText = text;
    }
}