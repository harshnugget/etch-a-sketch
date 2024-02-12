const GRID_SIZE = 16;

// Select grid container
const gridContainer = document.querySelector(".grid-container");

// Create grid columns and rows
for (let column = 0; column < GRID_SIZE; column++) {
    let gridColumn = document.createElement("div");
    gridColumn.classList.add("grid_column");
    gridContainer.appendChild(gridColumn);

    for (let row = 0; row < GRID_SIZE; row++) {
        let gridRow = document.createElement("div");
        gridRow.classList.add("grid_row");
        gridRow.textContent = `${column*16+row+1}`;
        gridColumn.appendChild(gridRow);
    }
}