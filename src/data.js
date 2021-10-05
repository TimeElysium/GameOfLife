class Grid {
    /**
     * Creates new object of class Grid
     */
    constructor() {
        this.svgns = "http://www.w3.org/2000/svg";
        this.cellSize = 30;
        this.cells = [];
        this.maxCells = 2000;
        this.cells = this.generateGrid();
        this.xPos = Math.floor(this.maxCells / 2);
        this.yPos = Math.floor(this.maxCells / 2);
        this.xMax = 0;
        this.yMax = 0;
        this.enableDrawing = false;
        this.drawLife = true;
    }

    /**
     * Generate starting grid
     */
    generateGrid() {
        const cells = [];
        for (let x = 0; x < this.maxCells; x++) {
            const column = [];
            for (let y = 0; y < this.maxCells; y++) {
                column.push(0);
            }
            cells.push(column);
        }
        return cells;
    }

    /**
     * Return color of cell based on its "Life"-state
     * @param {number} x x-Position of cell
     * @param {number} y y-Position of cell
     */
    getColor(x, y) {
        if (x >= 0 && y >= 0 && x < this.maxCells && y < this.maxCells) {
            if (this.cells[x][y] == 0) {
                return "#2D3943";
            } else {
                return "#f0f0f0";
            }
        } else {
            return "#161c21";
        }
    }

    /**
     * Draw grid based on current position and cell states
     */
    drawGrid() {
        // Svg container
        const svg = document.getElementById("container");

        // Svg scales
        const svgWidth = parseInt(getComputedStyle(svg).width.replace("px",""), 10);
        const svgHeight = parseInt(getComputedStyle(svg).height.replace("px",""), 10);

        // Number of cells drawn on x-Axis and y-Axis
        const xCells = Math.ceil(svgWidth / this.cellSize);
        const yCells = Math.ceil(svgHeight / this.cellSize);
        
        // Create missing svg rects needed to draw
        if (xCells > this.xMax) {
            for (let x = this.xMax; x < xCells; x++) {
                for (let y = 0; y < this.yMax; y++) {
                    let cell = document.createElementNS(this.svgns, "rect");
                    cell.setAttribute("id", x.toString() + ":" + y.toString());
                    cell.setAttribute("width", this.cellSize.toString());
                    cell.setAttribute("height", this.cellSize.toString());
                    cell.setAttribute("x", (x * this.cellSize).toString());
                    cell.setAttribute("y", (y * this.cellSize).toString());
                    cell.setAttribute("fill", "#2D3943");
                    cell.setAttribute("stroke", "#161c21");
                    cell.setAttribute("onmousedown", "window.grid.changeState(" + x.toString() + "," + y.toString() + ")");
                    svg.appendChild(cell);
                }
            }
            this.xMax = xCells;
        }
        if (yCells > this.yMax) {
            for (let y = this.yMax; y < yCells; y++) {
                for (let x = 0; x < this.xMax; x++) {
                    let cell = document.createElementNS(this.svgns, "rect");
                    cell.setAttribute("id", x.toString() + ":" + y.toString());
                    cell.setAttribute("width", this.cellSize.toString());
                    cell.setAttribute("height", this.cellSize.toString());
                    cell.setAttribute("x", (x * this.cellSize).toString());
                    cell.setAttribute("y", (y * this.cellSize).toString());
                    cell.setAttribute("fill", "#2D3943");
                    cell.setAttribute("stroke", "#161c21");
                    cell.setAttribute("onmousedown", "window.grid.changeState(" + x.toString() + "," + y.toString() + ")");
                    cell.setAttribute("onmousemove", "if (window.grid.enableDrawing == true) { window.grid.drawCell(" + x.toString() + "," + y.toString() + ") }");
                    cell.setAttribute("onmouseup", "window.grid.enableDrawing = false;");
                    svg.appendChild(cell);
                }
            }
            this.yMax = yCells;
        }

        //draw cells
        for (let x = 0; x < xCells; x++) {
            for (let y = 0; y < yCells; y++) {
                let xPos = Math.ceil(this.xPos) + x;
                let yPos = Math.ceil(this.yPos) + y;

                let cell = document.getElementById(x.toString() + ":" + y.toString());
                cell.setAttribute("fill", this.getColor(xPos, yPos));
            }
        }
    }

    /**
     * Change drawing state from drawing -> not drawing and color clicked cell accordingly
     * @param {number} x x-Position of cell
     * @param {number} y y-Position of cell
     */
    changeState(x, y) {
        let xPos = x + this.xPos;
        let yPos = y + this.yPos;
        if (xPos >= 0 && yPos >= 0 && xPos < this.maxCells && yPos < this.maxCells) {
            if (this.cells[xPos][yPos] == 0) {
                this.cells[xPos][yPos] = 1;
                this.drawLife = true;
            } else {
                this.cells[xPos][yPos] = 0;
                this.drawLife = false;
            }
            this.enableDrawing = true;
        } 
        this.drawGrid();
    }

    /**
     * Change state of cell according to this.drawLife
     * @param {number} x x-Position of cell
     * @param {number} y y-Position of cell
     */
    drawCell(x, y) {
        let xPos = x + this.xPos;
        let yPos = y + this.yPos;
        if (xPos >= 0 && yPos >= 0 && xPos < this.maxCells && yPos < this.maxCells) {
            if (this.drawLife == true) {
                this.cells[xPos][yPos] = 1;
            } else {
                this.cells[xPos][yPos] = 0;
            }
        } 
        this.drawGrid();
    }

    /**
     * Calculate next generation based on previous one.
     */
    nextGeneration() {
        const nextGen = this.generateGrid();
        for (let x = 0; x < this.maxCells; x++) {
            for (let y = 0; y < this.maxCells; y++) {
                // Count neighbours that are alive
                let neighbours = 0;
                for (let j = -1; j <= 1; j++) {
                    for (let i = -1; i <= 1; i++) {
                        if (j != 0 || i != 0) {
                            if (x + j >= 0 && y + i >= 0 && x + j < this.maxCells && y + i < this.maxCells) {
                                if (this.cells[x + j][y + i] == 1) {
                                    neighbours++;
                                }  
                            }
                        }
                    }
                }
                // Set new cell state accordingly
                if (this.cells[x][y] == 0) {
                    if (neighbours == 3) {
                        nextGen[x][y] = 1;
                    } else {
                        nextGen[x][y] = 0;
                    }
                } else {
                    if (neighbours < 2 || neighbours > 3) {
                        nextGen[x][y] = 0;
                    } else {
                        nextGen[x][y] = 1;
                    }
                }
            }
        }
        // Update cells and grid
        this.cells = nextGen;
        this.drawGrid();
    }

    /**
     * Toggle running state of animation.
     * Modify button text accordingly.
     */
    startStopAnimation() {
        if (window.animationRunning == true) {
            window.animationRunning = false;
            document.getElementById("stopanim").innerHTML = "Start Animation";
            document.getElementById("stopanim").id = "startanim";
        } else {
            window.animationRunning = true;
            document.getElementById("startanim").innerHTML = "Stop Animation";
            document.getElementById("startanim").id = "stopanim";
            this.animateSteps();
        }
    }

    /**
     * Show next generation each 0.25 seconds when runnning
     */
    animateSteps() {
        let id = null;
        clearInterval(id);
        id = setInterval(animate, 250);
        function animate() {
            if (window.animationRunning == false) {
                clearInterval(id);
            } else {
                window.grid.nextGeneration();
            }
        }
    }

    /**
     * Reset the grid to dead
     */
    resetGrid() {
        for (let x = 0; x < this.maxCells; x++) {
            for (let y = 0; y < this.maxCells; y++) {
                this.cells[x][y] = 0;
            }
        }
        this.xPos = Math.floor(this.maxCells / 2);
        this.yPos = Math.floor(this.maxCells / 2);
        this.drawGrid();
    }

    /**
     * Invert the whole grid: Dead->Life , Life->Dead
     */
    invertGrid() {
        for (let x = 0; x < this.maxCells; x++) {
            for (let y = 0; y < this.maxCells; y++) {
                if (this.cells[x][y] == 0) {
                    this.cells[x][y] = 1;
                } else {
                    this.cells[x][y] = 0;
                }
            }
        }
        this.drawGrid();
    }
}

function redrawGrid() {
    window.grid.drawGrid();
}