// Variable for size of grid
const GRID_SIZE = document.querySelector("#grid-size").value;   //(e.g. a size of 16 would create a 16x16 grid)

// Select canvas
const canvas = document.querySelector(".canvas");

// Build grid with default size of 16
buildGrid(16);

// Add event listener to build button
document.querySelector("#build-button").addEventListener("mousedown", () => {
    const GRID_SIZE = document.querySelector("#grid-size").value;   //(e.g. a size of 16 would create a 16x16 grid)
    buildGrid(GRID_SIZE);
});

function buildGrid(size) {
    // Handle invalid sizes
    if (size <= 0) {
        console.log("Grid size must be greater than size 0");
        return;
    }
    if (size > 100) {
        console.log("Grid must be less than size 100");
        return;
    }

    let gridContainer;
    
    // Clear grid
    if (document.querySelector(".grid-container")) {
        document.querySelector(".grid-container").remove();
    }

    gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");
    canvas.append(gridContainer);

    // Create grid columns and rows
    for (let column = 0; column < size; column++) {
        let gridColumn = document.createElement("div");
        gridColumn.classList.add("grid-column");
        gridContainer.appendChild(gridColumn);
    
        for (let row = 0; row < size; row++) {
            let gridRow = document.createElement("div");
            gridRow.classList.add("grid-row");
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
    let currentColor = document.querySelector("#color-picker").value;

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
    const rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/;
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (!rgbRegex.test(color)) {
        if (hexRegex.test(color)) {
            // Convert hex value to RGB
            color = hexToRGB(color);
        }
        else {
            console.log("Color must be RGB or Hex value");
            return;
        }
    }

    // Get RGB values
    let rgbValues = color.split("(")[1].replace(")", "").split(",");

    // Decrease RGB values until 0
    let r = rgbValues[0] > decrementAmount ? rgbValues[0]-decrementAmount : 0;
    let g = rgbValues[1] > decrementAmount ? rgbValues[1]-decrementAmount : 0;
    let b = rgbValues[2] > decrementAmount ? rgbValues[2]-decrementAmount : 0;

    target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function hexToRGB(hexValue) {
    let r = hexValue.slice(1, 3);
    let g = hexValue.slice(3, 5);
    let b = hexValue.slice(5, 7);

    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);

    return `rgb(${r}, ${g}, ${b})`
}