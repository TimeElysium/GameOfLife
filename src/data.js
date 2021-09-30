class Grid {
    constructor() {
        this.svgns = "http://www.w3.org/2000/svg";
        this.cellSize = 50;
        this.cells = [];
        this.xPos = 0;
        this.yPos = 0;
        this.xShift = 12;
        this.yShift = 33;
    }



    drawGrid() {
        const svg = document.getElementById("container");
        svg.innerHTML = "";

        const svgWidth = parseInt(getComputedStyle(svg).width.replace("px",""), 10);
        const svgHeight = parseInt(getComputedStyle(svg).height.replace("px",""), 10);

        const xCells = Math.ceil(svgWidth / this.cellSize);
        const yCells = Math.ceil(svgHeight / this.cellSize);

        for (let x = -1; x <= xCells; x++) {
            for (let y = -1; y <= yCells; y++) {
                let cell = document.createElementNS(this.svgns, "rect");
                cell.setAttribute("id", x.toString() + ":" + y.toString());
                cell.setAttribute("width", this.cellSize.toString());
                cell.setAttribute("height", this.cellSize.toString());
                cell.setAttribute("x", (x * this.cellSize + this.xShift).toString());
                cell.setAttribute("y", (y * this.cellSize + this.yShift).toString());
                cell.setAttribute("fill", "#2D3943");
                cell.setAttribute("stroke", "#161c21");
                cell.setAttribute("onmousedown", "window.grid.changeState(" + x.toString() + ", " + y.toString() + ")");
                svg.appendChild(cell);
            }
        }

        let cell = document.createElementNS(this.svgns, "rect");
        cell.setAttribute("width", "50");
        cell.setAttribute("height", "50");
        cell.setAttribute("x", "50");
        cell.setAttribute("y", "50");
        cell.setAttribute("fill", "#f0f0f0");
        cell.setAttribute("stroke", "#161c21");
        svg.appendChild(cell);
    }

    changeState(x, y) {
        const cellToDestroy = document.getElementById(x.toString() + ":" + y.toString());
        const svg = document.getElementById("container");
        svg.removeChild(cellToDestroy);
        
        let cell = document.createElementNS(this.svgns, "rect");
        cell.setAttribute("id", x.toString() + ":" + y.toString());
        cell.setAttribute("width", this.cellSize.toString());
        cell.setAttribute("height", this.cellSize.toString());
        cell.setAttribute("x", (x * this.cellSize + this.xShift).toString());
        cell.setAttribute("y", (y * this.cellSize + this.yShift).toString());
        cell.setAttribute("fill", "#f0f0f0");
        cell.setAttribute("stroke", "#161c21");
        cell.setAttribute("onmousedown", "window.grid.changeState(" + x.toString() + ", " + y.toString() + ")");
        svg.appendChild(cell);
        console.log(x.toString() + ":" + y.toString());
    }
}

function redrawGrid() {
    window.grid.drawGrid();
}