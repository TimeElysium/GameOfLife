class Grid {
    /**
     * Creates new object of class Grid
     */
    constructor() {
        this.svgns = "http://www.w3.org/2000/svg";
        this.cellSize = 40;
        this.cells = [];
        this.maxCells = 2000;
        this.cells = this.generateGrid();
        this.xPos = this.maxCells / 2;
        this.yPos = this.maxCells / 2;
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
        svg.innerHTML = "";

        // Svg scales
        const svgWidth = parseInt(getComputedStyle(svg).width.replace("px",""), 10);
        const svgHeight = parseInt(getComputedStyle(svg).height.replace("px",""), 10);

        // Number of cells drawn on x-Axis and y-Axis
        const xCells = Math.ceil(svgWidth / this.cellSize);
        const yCells = Math.ceil(svgHeight / this.cellSize);

        // Additional shifting based on position
        const xShift = (Math.ceil(this.xPos) - this.xPos) * this.cellSize;
        const yShift = (Math.ceil(this.yPos) - this.yPos) * this.cellSize;
        
        //draw cells
        for (let x = -1; x <= xCells; x++) {
            for (let y = -1; y <= yCells; y++) {
                let xPos = Math.ceil(this.xPos) + x - 1;
                let yPos = Math.ceil(this.yPos) + y - 1;

                let cell = document.createElementNS(this.svgns, "rect");
                cell.setAttribute("id", xPos.toString() + ":" + yPos.toString());
                cell.setAttribute("width", this.cellSize.toString());
                cell.setAttribute("height", this.cellSize.toString());
                cell.setAttribute("x", (x * this.cellSize + xShift).toString());
                cell.setAttribute("y", (y * this.cellSize + yShift).toString());
                cell.setAttribute("fill", this.getColor(xPos, yPos));
                cell.setAttribute("stroke", "#161c21");
                cell.setAttribute("onmousedown", "window.grid.changeState(" + xPos.toString() + "," + yPos.toString() + ")");
                svg.appendChild(cell);
            }
        }
    }

    /**
     * Change cell state from Dead -> Alive or Alive -> Dead
     * @param {number} x x-Position of cell
     * @param {number} y y-Position of cell
     */
    changeState(x, y) {
        if (x >= 0 && y >= 0 && x < this.maxCells && y < this.maxCells) {
            if (this.cells[x][y] == 0) {
                this.cells[x][y] = 1;
            } else {
                this.cells[x][y] = 0;
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
            document.getElementById("anim").innerHTML = "Start Animation";
        } else {
            window.animationRunning = true;
            document.getElementById("anim").innerHTML = "Stop Animation";
            this.animateSteps();
        }
    }

    /**
     * Show next generation each 0.25 seconds when runnning
     */
    animateSteps() {
        let id = null;
        clearInterval(anim);
        id = setInterval(animate, 250);
        function animate() {
            if (window.animationRunning == false) {
                clearInterval(id);
            } else {
                window.grid.nextGeneration();
            }
        }
    }
}

function redrawGrid() {
    window.grid.drawGrid();
}