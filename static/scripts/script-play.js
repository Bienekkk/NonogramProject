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
console.log(json);

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
    col.classList.add('col');
    col.setAttribute('draggable', false);
    cols[i].forEach((element, index) => col.innerHTML += `<div id="col${i}-${index}">${element}</div>` + '<br>'); //naprawić br
    colDiv.appendChild(col);
}

let rows = json["row"];
for (let i = 0; i < rows.length; i++) {
    const row = document.createElement("p");
    row.classList.add('row');
    row.setAttribute('draggable', false);
    rows[i].forEach((element) => row.innerText += (element + " "));
    rowDiv.appendChild(row);
}

let hearts = 3;
let wait = false;

//click actions
let isMouseDown = false;
fields.forEach((field) => {
    field.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });
    field.addEventListener("mousedown", () => {
        isMouseDown = true;
        checkAction(field)
    });
    field.addEventListener("mousemove", () => {
        if (isMouseDown) {
            checkAction(field)
        }
    });
    field.addEventListener("mouseup", () => {
        isMouseDown = false;
    });
});
document.addEventListener("mouseup", () => {
    isMouseDown = false;
});
document.addEventListener("selectstart", (event) => {
    event.preventDefault();
});

async function checkAction(field){
    if(wait || field.style.backgroundColor === 'rgb(30, 30, 30)' || field.hasChildNodes()){
        return;
    }

    if(arr[field.id] === 1){
        field.style.backgroundColor = "#1E1E1E";
        updateClicked();

        if(checkbox.checked===false){
            updateHearts();
        }
    }
    else if(arr[field.id] === 0){
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

    const col = field.id % mode;
    const row = Math.floor(field.id / mode);
    console.log(col, row);
    checkCol(col)
    //-------------------------------------------------------------------------------------------------
}

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

function reset(){
    window.location.reload();
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

async function checkCol(col){
    let counter = 0;
    let sequenceNr = 0;
    for(let i = col; i < mode*mode + col; i += mode){
        //console.log(i)
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            console.log(counter)
            //console.log(cols[col][sequenceNr])
            if(cols[col][sequenceNr] == counter){
                document.getElementById(`col${col}-${sequenceNr}`).style.color = 'lightgray';
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
}
