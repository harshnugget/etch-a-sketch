// Variable for size of grid
const GRID_SIZE = 16;   //(e.g. a size of 16 would create a 16x16 grid)

// Select grid container
const gridContainer = document.querySelector(".grid-container");

// Build grid
buildGrid(GRID_SIZE);

function buildGrid(size) {
    // Create grid columns and rows
    for (let column = 0; column < size; column++) {
        let gridColumn = document.createElement("div");
        gridColumn.classList.add("grid_column");
        gridContainer.appendChild(gridColumn);
    
        for (let row = 0; row < size; row++) {
            let gridRow = document.createElement("div");
            gridRow.classList.add("grid_row");
            gridRow.setAttribute("data-value", `${column*16+row+1}`);
            gridColumn.appendChild(gridRow);
            
            // Event listeners to change color of grid items
            gridRow.addEventListener("mouseover", changeColor);
            gridRow.addEventListener("mousedown", changeColor);
        }
    }
}

function changeColor(event) {
    if (event.buttons === 1 || event.type === "mousedown") {
        this.style.backgroundColor = "red";
    }
}