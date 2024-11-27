const content = document.getElementById('content');

function showmodes() {
    console.log("gwaign")
    content.innerHTML = `
        <div class="modes p-3">
         <h2 class="mb-3">Choose your mode: </h2>
         <div class="d-flex gap-3 mt-2">
            <div class="mode p-2">
                <h3>Easy mode</h3>
                <p>Board size: 5x5</p>
                <button class="btn btn-success w-100">Play</button>
            </div>
            <div class="mode p-2">
                <h3>Medium mode</h3>
                <p>Board size: 10x10</p>
                <button class="btn btn-warning w-100">Play</button>
              </div>
            <div class="mode p-2">
                <h3>Hard mode</h3>
                <p>Board size: 15x15</p>
                <button class="btn btn-danger w-100">Play</button>
            </div>

            <button class='btn btn-outline-danger close-btn p-0 mode' onclick="showmenu()"><i class="bi bi-x"></i></button>
      </div>
    `
}

function showmenu() {
    content.innerHTML = `
        <button class="btn btn-light w-100">Tutorial</button>
        <button class="btn btn-outline-light w-100" onclick="showmodes()">Levels</button>
        <button class="btn btn-outline-light w-100">Your own photo</button>
    `
}