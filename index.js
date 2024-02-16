let gridSize = document.querySelector("#grid-size").value;   //(e.g. a size of 16 would create a 16x16 grid)
document.querySelector(".slider").value = gridSize;
document.querySelector("#grid-size").addEventListener("change", (event) => {
    if (event.target.value < 1) {
        event.target.value = 1;
    }
    if (event.target.value > 100) {
        event.target.value = 100;
    }
    document.querySelector(".slider").value = event.target.value;
});

document.querySelector(".slider").addEventListener("input", (event) => {
    document.querySelector("#grid-size").value = event.target.value;
});

// Variables for undo button funcionality
const UNDO_LIMIT = 10;
const undoArray = [];

for (let i = 0; i < UNDO_LIMIT; i++) {
    undoArray.push({});
}

// Variables for redo button functionality
const redoArray = [];

for (let i = 0; i < UNDO_LIMIT; i++) {
    redoArray.push({});
}

// Build the grid with default values
buildGrid(gridSize);

document.querySelector("#build-button").addEventListener("mousedown", () => {
    gridSize = document.querySelector("#grid-size").value;
    buildGrid(gridSize);
});

document.querySelector("#clear-button").addEventListener("mousedown", () => {
    buildGrid(gridSize);
});

// Set color picker value
const colorPicker = document.querySelector("#color-picker");
document.querySelector(".color-picker-container").style.backgroundColor = colorPicker.value;
colorPicker.addEventListener("input", updateFirst);
colorPicker.addEventListener("input", updateAll);

const eraseBtn = document.querySelector("#erase-button");
eraseBtn.addEventListener("mousedown", toggleTool);

const blendBtn = document.querySelector("#blend-button");
blendBtn.addEventListener("mousedown", toggleTool);

const rainbowBtn = document.querySelector("#rainbow-button");
rainbowBtn.addEventListener("mousedown", toggleTool);

const darkenBtn = document.querySelector("#darken-button");
darkenBtn.addEventListener("mousedown", toggleTool);

const lightenBtn = document.querySelector("#lighten-button");
lightenBtn.addEventListener("mousedown", toggleTool);

const undoBtn = document.querySelector("#undo-button");
undoBtn.addEventListener("mousedown", function() {
    executeUndoRedo("undo");
});

const redoBtn = document.querySelector("#redo-button");
redoBtn.addEventListener("mousedown", function() {
    executeUndoRedo("redo");
});

function buildGrid(size) {
    // Clear arrays
    for (let i = 0; i < UNDO_LIMIT; i++) {
        redoArray.unshift({});
        undoArray.unshift({});
        redoArray.pop();
        undoArray.pop();
    }

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

function changeTileColor(event) {
    const target = event.target;
    const currentColor = target.style.backgroundColor;  // Color value of grid tile
    let selectedColor = document.querySelector("#color-picker").value;    // Color value of color picker

    if (event.buttons === 1) {  // Left mouse button
        // Clear redoArray
        for (let i = 0; i < UNDO_LIMIT; i++) {
            redoArray.unshift({});
            redoArray.pop();
        }

        // Store the current color of this element in tempStroke object
        if (tempStroke[event.target.getAttribute("data-value")] === undefined) {
            tempStroke[event.target.getAttribute("data-value")] = currentColor;
        }

        // Get active tool
        if (eraseBtn.classList.contains("active-tool")) {
            if (!currentColor) {
                return;
            }
            selectedColor = "";
        }

        if (blendBtn.classList.contains("active-tool")) {
            if (currentColor) {
                selectedColor = blendColors(currentColor, selectedColor);
            }
        }

        if (rainbowBtn.classList.contains("active-tool")) {
            // Randomize rgb values
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            selectedColor = `rgb(${r}, ${g}, ${b})`;
        }

        if (darkenBtn.classList.contains("active-tool")) {
            if (!currentColor) {
                return;
            }
            selectedColor = changeTileBrightness(currentColor, "dark");
        }

        if (lightenBtn.classList.contains("active-tool")) {
            if (!currentColor) {
                return;
            }
            selectedColor = changeTileBrightness(currentColor, "light");
        }

        // Wait for user to stop drawing before saving stroke to undo array
        document.addEventListener("mouseup", strokeTracker, { once: true });

        // Apply color
        target.style.backgroundColor = selectedColor;
    }
}

// Undo functionality
let tempStroke = {}; // For storing previous stroke
function strokeTracker() {
    undoArray.unshift(tempStroke);  // Insert most recent stroke at beginning of array
    undoArray.pop();   // Remove oldest stroke from the end of the array
    tempStroke = {}; // Empty to make room for next stroke
    document.removeEventListener("mouseup", strokeTracker);
}

function blendColors(currentColor, selectedColor) {
    let incrementAmount = 10;

    // Use regex to check if background color is RGB format
    const rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/;
    const hexRegex = /^[0-9A-Fa-f]+$/;
    
    if (!rgbRegex.test(currentColor)) {
        if (hexRegex.test(currentColor)) {
            // Convert hex value to RGB
            currentColor = hexToRGB(currentColor);
        } else {
            if (currentColor !== null && currentColor !== "") {
                console.log("Color must be RGB or Hex value: " + currentColor);
            }
            return;
        }
    }

    // Convert selected color to RGB format
    selectedColor = hexToRGB(selectedColor);
    
    // Get RGB values
    let currentColorRGBValues = currentColor.split("(")[1].replace(")", "").split(",");
    let selectedColorRGBValues = selectedColor.split("(")[1].replace(")", "").split(",");

    let r = +currentColorRGBValues[0];
    let g = +currentColorRGBValues[1];
    let b = +currentColorRGBValues[2];

    let selectedColorR = +selectedColorRGBValues[0];
    let selectedColorG = +selectedColorRGBValues[1];
    let selectedColorB = +selectedColorRGBValues[2]; 
    
    r = r > selectedColorR ? Math.max(selectedColorR, r - incrementAmount) : Math.min(selectedColorR, r + incrementAmount);
    g = g > selectedColorG ? Math.max(selectedColorG, g - incrementAmount) : Math.min(selectedColorG, g + incrementAmount);
    b = b > selectedColorB ? Math.max(selectedColorB, b - incrementAmount) : Math.min(selectedColorB, b + incrementAmount);

    return `rgb(${r}, ${g}, ${b})`;
}


function changeTileBrightness(color, type) {        
    let incrementAmount;

    // Define an amount to decrease each RGB value by
    if (type === "dark") {
        incrementAmount = -10;
    } else if (type === "light") {
        incrementAmount = 10;
    }

    // Use regex to check if background color is RGB format
    const rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/;
    const hexRegex = /^[0-9A-Fa-f]+$/;
    
    if (!rgbRegex.test(color)) {
        if (hexRegex.test(color)) {
            // Convert hex value to RGB
            color = hexToRGB(color);
        } else {
            if (color !== null && color !== "") {
                console.log("Color must be RGB or Hex value: " + color);
            }
            return;
        }
    }

    // Get RGB values
    let rgbValues = color.split("(")[1].replace(")", "").split(",");

    // Decrease RGB values within the specified range
    let r = Math.min(255, Math.max(0, +rgbValues[0] + incrementAmount));
    let g = Math.min(255, Math.max(0, +rgbValues[1] + incrementAmount));
    let b = Math.min(255, Math.max(0, +rgbValues[2] + incrementAmount));

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

function executeUndoRedo(action) {
    let sourceArray = [];
    let destinationArray = [];

    switch (action) {
        case "redo":
            sourceArray = redoArray;
            destinationArray = undoArray;
            break;
        case "undo":
            sourceArray = undoArray;
            destinationArray = redoArray;
            break;
        default:
            console.error("Invalid action. Use 'undo' or 'redo'.");
            return;
    }

    // Define an object to store tile data-values and background colours
    const stroke = {};

    // Handle empty strokes
    if (Object.keys(sourceArray[0]).length < 1) {
        console.log("Limit reached!")
        return;
    }

    for (const [key, value] of Object.entries(sourceArray[0])) {
        // Store the next stroke to be inserted in redoArray
        stroke[key] = document.querySelector(`[data-value="${key}"]`).style.backgroundColor;
        // Re-paint each tile to it's previous stroke
        document.querySelector(`[data-value="${key}"]`).style.backgroundColor = value;
    }    
    
    // Remove the first stroke from sourceArray
    sourceArray.shift();
    sourceArray.push({}); 

    // Insert the stroke object into destinationArray
    destinationArray.unshift(stroke);
    destinationArray.pop(); 
}

// Color picker functionality
// Continuously updates the background color of the color-picker container to match the color-picker
function updateFirst(event) {
    const div = document.querySelector(".color-picker-container");
    if (div) {
      div.style.backgroundColor = event.target.value;
    }
}

// Resorts to previous color value if color-picker is cancelled
function updateAll(event) {
    document.querySelectorAll(".color-picker-container").forEach((div) => {
      div.style.backgroundColor = event.target.value;
    });
}