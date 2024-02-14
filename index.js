// Variable for size of grid
const GRID_SIZE = document.querySelector("#grid-size").value;   //(e.g. a size of 16 would create a 16x16 grid)

// Variables for tracking strokes (undo button functionality)
const UNDO_LIMIT = 10;
const strokes = [];
let strokeIndex = 0;

// Populate the "strokes" array with empty objects
for (let i = 0; i < UNDO_LIMIT; i++) {
    strokes.push({});
}

// Built the grid with default values
buildGrid(GRID_SIZE);

// Add event listener to build button
document.querySelector("#build-button").addEventListener("mousedown", () => {
    buildGrid(GRID_SIZE);
});

// Add event listener to rainbow button
const rainbowBtn = document.querySelector("#rainbow-button")
rainbowBtn.addEventListener("mousedown", toggleTool);

// Add event listener to darken button
const darkenBtn = document.querySelector("#darken-button")
darkenBtn.addEventListener("mousedown", toggleTool);

// Add event listener to undo button
const undoBtn = document.querySelector("#undo-button");
undoBtn.addEventListener("mousedown", undo);

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

    // Clear grid
    if (document.querySelector(".grid-container")) {
        document.querySelector(".grid-container").remove();
    }

    let gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");
    document.querySelector(".canvas").append(gridContainer);

    // Create grid columns and rows
    for (let column = 0; column < size; column++) {
        let gridColumn = document.createElement("div");
        gridColumn.classList.add("grid-column");
        gridContainer.appendChild(gridColumn);
    
        for (let row = 0; row < size; row++) {
            let gridRow = document.createElement("div");
            gridRow.classList.add("grid-row");
            gridRow.setAttribute("data-value", `${column*size+row+1}`);
            gridColumn.appendChild(gridRow);
            
            // Event listeners to change color of grid items
            gridRow.addEventListener("mouseover", changeTileColor);
            gridRow.addEventListener("mousedown", changeTileColor);
        }
    }
}

// Undo functionality
let tempStroke = {}; // For storing the most recent stroke
function strokeInsert() {
    strokes.unshift(tempStroke);  // Insert most recent stroke at beginning of array
    tempStroke = {}; // Empty to make room for next stroke
    strokes.pop();   // Remove oldest stroke from the end of the array
    document.removeEventListener("mouseup", strokeInsert);
}

function changeTileColor(event) {
    const target = event.target;
    const currentColor = target.style.backgroundColor;  // Color value of grid tile
    let selectedColor = document.querySelector("#color-picker").value;    // Color value of color picker

    if (event.buttons === 1) {  // Left mouse button
        // Store the current color of this element in tempStroke object
        if (tempStroke[event.target.getAttribute("data-value")] === undefined) {
            tempStroke[event.target.getAttribute("data-value")] = currentColor;
        }

        // Wait for user to stop drawing
        document.addEventListener("mouseup", strokeInsert, { once: true });

        if (rainbowBtn.classList.contains("active-tool")) {
            // Randomize rgb values
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            selectedColor = `rgb(${r}, ${g}, ${b})`;
        }
        if (darkenBtn.classList.contains("active-tool")) {
            selectedColor = changeTileBrightness(currentColor, target);
        }
        // Apply color
        target.style.backgroundColor = selectedColor;
    }
}

function changeTileBrightness(color) {        
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
            if (!color === null) {
                console.log("Color must be RGB or Hex value");
            }
            return;
        }
    }

    // Get RGB values
    let rgbValues = color.split("(")[1].replace(")", "").split(",");

    // Decrease RGB values until 0
    let r = rgbValues[0] > decrementAmount ? rgbValues[0]-decrementAmount : 0;
    let g = rgbValues[1] > decrementAmount ? rgbValues[1]-decrementAmount : 0;
    let b = rgbValues[2] > decrementAmount ? rgbValues[2]-decrementAmount : 0;

    return `rgb(${r}, ${g}, ${b})`;
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

function toggleTool(event) {
    // Disable current active tool
    if (!(event.target.classList.contains("active-tool"))) {
        if (document.querySelector(".active-tool")) {
            document.querySelector(".active-tool").style.backgroundColor = "";
            document.querySelector(".active-tool").classList.remove("active-tool");
        }
    }
    // Toggle tool as active
    event.target.classList.toggle("active-tool");
    if (!event.target.classList.contains("active-tool")) {
        event.target.style.backgroundColor = "";
    }
}

function undo() {
    // Assign the previous brush stroke to a variable (undo will apply this stroke)
    const prevstroke = strokes[0];

    // Handle empty strokes
    if (Object.keys(prevstroke).length < 1) {
        console.log("Undo limit reached!")
        return;
    }

    // Re-paint each tile to it's previous stroke
    for (const [key, value] of Object.entries(prevstroke)) {
        document.querySelector(`[data-value="${key}"]`).style.backgroundColor = value;
    }

    // Remove stroke from array
    strokes.shift();
    strokes.push({});
}