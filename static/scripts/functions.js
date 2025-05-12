export function checkCol(col, cols, mode){
    let counter = 0;
    let sequenceNr = 0;
    for(let i = col; i < mode*mode + col; i += mode){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(cols[col][sequenceNr] == counter){
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
    sequenceNr = cols[col].length - 1;
    for(let i = mode*mode + col - mode; i > 0; i -= mode){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(cols[col][sequenceNr] == counter){
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

export function checkRow(row, rows, mode){
    let counter = 0;
    let sequenceNr = 0;
    for(let i = row * mode; i < row * mode + mode; i += 1){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(rows[row][sequenceNr] == counter){
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
    sequenceNr = rows[row].length - 1;
    for(let i = row * mode + mode - 1; i > row * mode; i -= 1){
        let field = document.getElementById(i);
        if(field.style.backgroundColor === 'rgb(30, 30, 30)'){
            counter ++;
            if(rows[row][sequenceNr] == counter){
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

export function checkAllRow(row, rows, mode){
    let counter = 0;
    let checked = 0;
    rows[row].map((e) => {
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

export function checkAllCol(col, cols, mode){
    let counter = 0;
    let checked = 0;
    cols[col].map((e) => {
        checked += e;
    })
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

export function checkAction(field, mode, wait, checkedArr, updateClicked, updateHearts, rows, cols){
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
        checkAllRow(row, rows, mode)
        checkAllCol(col, cols, mode)
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

    checkCol(col, cols, mode)
    checkRow(row, rows, mode)
}