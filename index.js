// Initialize color to white
let currentColor = "rgb(255, 255, 255)";

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
    const target = event.target;
    const color = target.style.backgroundColor;

    if (event.buttons === 1) {
        if (color) {
            changeBrightness(color, target);
        }
        else {
            // Randomize rgb values
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            let randomColor = `rgb(${r}, ${g}, ${b})`;

            // Apply color
            target.style.backgroundColor = currentColor;
        }  
    }
}

function changeBrightness(color, target) {        
    // Define an amount to decrease each RGB value by
    const decrementAmount = 10;

    // Use regex to check if background color is RGB format
    var rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/;
    if (!rgbRegex.test(color)) {
        console.log("Invalid color format! Must be RGB.");
        return;
    }

    // Get RGB values
    let rgbValues = color.split("(")[1].replace(")", "").split(",");

    // Decrease RGB values until 0
    let r = rgbValues[0] > decrementAmount ? rgbValues[0]-decrementAmount : 0;
    let g = rgbValues[1] > decrementAmount ? rgbValues[1]-decrementAmount : 0;
    let b = rgbValues[2] > decrementAmount ? rgbValues[2]-decrementAmount : 0;

    target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}