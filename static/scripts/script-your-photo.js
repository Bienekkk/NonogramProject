function compareNumbers(a, b) {
  return a - b;
}

        colorsStr = document.getElementById('colors').innerText
        colorsStr = colorsStr.slice(2, -2)
        colorsArr = colorsStr.split("), (")
        colorsArr[0] = colorsArr[0].slice(1)
        //console.log(colorsArr)

        colorsArr = colorsArr.map((el) => {
            return el.split(", ")
        })
        //console.log(colorsArr)

        sumArr = colorsArr.map((el) => {
            let c = 0;
            el.map((e) => {
                c = parseInt(e) + c
            })
            return c
        })

        //console.log(sumArr)

        temp = [...sumArr]
        temp.sort(compareNumbers)
        console.log(temp[50])

        checkedArr = sumArr.map((el, index) => {
//            if(temp[99]==el ? el<temp[50] : el <= temp[50]){
            console.log("99: ", temp[99]==el)
            console.log("0: ", temp[0]==el)
            if(temp[99]==el ? el<temp[50] : el <= temp[50]){
                return 1;
            }
            else{
                return 0;
            }
        })

        //console.log(checkedArr)

//------------------------------------------------------------------------------------

let colDiv = document.querySelector('.colDiv');
let rowDiv = document.querySelector('.rowDiv');
let fields = document.querySelectorAll('.field');
let checkbox = document.getElementById('checkbox');
let endDiv = document.querySelector('.endDiv');
let endText = document.querySelector('.endText');
let imgDiv = document.querySelector('.imgDiv');

//let jsonstr = document.querySelector('.data').innerText;
//jsonstr = jsonstr.replaceAll("'", '"');

//let json = JSON.parse(jsonstr);
//console.log(json);

let mode = 10
let targetAmount = 0;
let checkedAmount = 0;
for (let i = 0; i < 100; i++){
    if(checkedArr[i]==1){
        targetAmount++;
    }
}

let cols = []
for (let i = 0; i<mode; i++){
    cols[i] = []
}
for (let i = 0; i<mode; i+=1){
    let counter = 0;
    let tmp = []
    for (let j = 0; j<mode*mode; j+=10){
        if(checkedArr[j+i] == 1){
            counter ++;
        }
        else{
            if (counter!=0){
                tmp.push(counter)
            }
            counter = 0
        }
    }
    if (counter!=0){
         tmp.push(counter)
    }
    //console.log(tmp)
    cols[i].push(tmp)
}

let rows = []
for (let i = 0; i<mode; i++){
    rows[i] = []
}

for (let i = 0; i<mode; i++){
    let counter = 0;
    let tmp = []
    for (let j = 0; j<mode; j++){
        if(checkedArr[i*mode+j] == 1){
            counter ++;
        }
        else{
            if (counter!=0){
                tmp.push(counter)
            }
            counter = 0
        }
    }
    if (counter!=0){
       tmp.push(counter)
    }
    rows[i].push(tmp)
}

//console.log(rows, cols)

//let cols = json["col"];
for (let i = 0; i < cols.length; i++) {
    const col = document.createElement("p");
    col.classList.add('col', `col${i}`);
    col.setAttribute('draggable', false);
    if (cols[i][0].length == 0){
        col.innerHTML += `<span class="col${i} colId0">0</span>`
    }
    cols[i][0].forEach((element, index) => col.innerHTML += `<span class="col${i} colId${index}">${element}</span>`);
    colDiv.appendChild(col);
}

//let rows = json["row"];
for (let i = 0; i < rows.length; i++) {
    const row = document.createElement("p");
    row.classList.add('row', `row${i}`);
    row.setAttribute('draggable', false);
    if (rows[i][0].length == 0){
        row.innerHTML += `<span class="row${i} rowId0">0</span>`
    }
    rows[i][0].forEach((element, index) => row.innerHTML += `<span class="row${i} rowId${index}">${element}</span>` + " ");
    rowDiv.appendChild(row);
}

let hearts = 0;
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
        checkAction(field);
        console.log("Start at:", x, y);
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
                checkAction(field);
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

async function checkAction(field){
    if(wait || field.style.backgroundColor === 'rgb(30, 30, 30)' || field.hasChildNodes()){
        return;
    }

    const col = field.id % mode;
    const row = Math.floor(field.id / mode);

    if(checkedArr[field.id] === 1){
        field.style.backgroundColor = "#1E1E1E";
        field.classList.add("checked");
        updateClicked();

        if(checkbox.checked===false){
            updateHearts();
        }
        checkAllRow(row)
        checkAllCol(col)
    }
    else if(checkedArr[field.id] === 0){
        const x = document.createElement('i');
        x.classList.add('bi');
        x.classList.add('bi-x-lg');
        field.appendChild(x);

        if(checkbox.checked===true){
            updateHearts();
        }
    }
    else{
        updateHearts();
    }

    checkCol(col)
    checkRow(row)
}

async function updateHearts(){
    wait = true;
    let fails = document.getElementById(`fails`)
    hearts++;
    fails.innerText = `fails: ${hearts}`
    await new Promise(resolve => setTimeout(resolve, 1000));
    wait = false;
}

async function updateClicked(){
    checkedAmount++;
    if(checkedAmount==targetAmount){
        await new Promise(resolve => setTimeout(resolve, 500));
        endGame("You win!!!")
    }
}

function reset(){
    window.location.reload();
}

async function endGame(text){
    if(text==="You win!!!"){
        wait = true;
        imgDiv.style.display = "block";
        imgDiv.style.opacity = 1;
        const img = document.getElementById('img');
        img.style.animation = "opacity 1s linear 1 forwards";

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

async function checkCol(col){
    let counter = 0;
    let sequenceNr = 0;
    for(let i = col; i < mode*mode + col; i += mode){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(cols[col][0][sequenceNr] == counter){
                document.querySelector(`.col${col}.colId${sequenceNr}`).style.color = 'lightgray';
                sequenceNr++;
            }
        }
        else if(field.hasChildNodes()){
            counter = 0;
        }
        else{
            break;
        }
    }
    counter = 0;
    sequenceNr = cols[col][0].length - 1;
    for(let i = mode*mode + col - mode; i > 0; i -= mode){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(cols[col][0][sequenceNr] == counter){
                document.querySelector(`.col${col}.colId${sequenceNr}`).style.color = 'lightgray';
                sequenceNr--;
            }
        }
        else if(field.hasChildNodes()){
            counter = 0;
        }
        else{
            break;
        }
    }
}
async function checkRow(row){
    let counter = 0;
    let sequenceNr = 0;
    for(let i = row * mode; i < row * mode + mode; i += 1){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(rows[row][0][sequenceNr] == counter){
                document.querySelector(`.row${row}.rowId${sequenceNr}`).style.color = 'lightgray';
                sequenceNr++;
            }
        }
        else if(field.hasChildNodes()){
            counter = 0;
        }
        else{
            break;
        }
    }
    counter = 0;
    sequenceNr = rows[row][0].length - 1;
    for(let i = row * mode + mode - 1; i > row * mode; i -= 1){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(rows[row][0][sequenceNr] == counter){
                document.querySelector(`.row${row}.rowId${sequenceNr}`).style.color = 'lightgray';
                sequenceNr--;
            }
        }
        else if(field.hasChildNodes()){
            counter = 0;
        }
        else{
            break;
        }
    }
}
async function checkAllRow(row){
    let counter = 0;
    let checked = 0;
    rows[row][0].map((e) => {
        checked += e;
    })
    //console.log(checked)
    for(let i = row * mode; i < row * mode + mode; i += 1){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
        }
    }
    if(counter == checked){
        document.querySelector(`.row${row}`).style.color = "lightgray";
    }
}

async function checkAllCol(col){
    let counter = 0;
    let checked = 0;
    cols[col][0].map((e) => {
        checked += e;
    })
    console.log(checked)
    for(let i = col; i < mode*mode + col; i += mode){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
        }
    }
    if(counter == checked){
        document.querySelector(`.col${col}`).style.color = "lightgray";
    }
}
