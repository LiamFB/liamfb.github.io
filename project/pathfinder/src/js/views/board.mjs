import Square from "./square.mjs";

export default class Board {
    constructor() {
        this.endValue = 0;
        this.squares = [];
    }

    /**
     * 
     * @param {int[][]} board 
     */
    setBoard(board) {
        this.squares = [];
        board.forEach((row, i) => {
            this.squares.push([]);
            row.forEach((cell, j) => {
                this.squares[i].push(new Square(cell));
            })
        })
    }
    draw(mergeFactor) {
        if (mergeFactor === undefined) {
            mergeFactor = this.calcMergeFactor();
        }
        console.log('starting the merge');
        let mergedBoardELm = this.mergeSquares(mergeFactor);
        console.log('Done the merge');
        return mergedBoardELm;
    }
    calcMergeFactor() {
        const mergeFactorHorizontal = this.squares.length / 10;
        const mergeFactorVertical = this.squares[0].length / 10;
        const mergeFactor = Math.floor(Math.max(mergeFactorHorizontal, mergeFactorVertical));
        return Math.max(mergeFactor, 1);
    }
    mergeSquares(mergeFactor) {
        let boardElm = document.createElement('div');
        boardElm.className = 'board';
        let rowElm;
        let newSqr;
        for (let rowCount = 0; rowCount < this.squares.length; rowCount++) {
            let mergeRow = rowCount % mergeFactor === 0;
            if (mergeRow) {
                rowElm = this.createRow();
                boardElm.appendChild(rowElm);
            }
            const row = this.squares[rowCount];
            for (let colCount = 0; colCount < row.length; colCount++) {
                const sqr = row[colCount];
                if (colCount % mergeFactor === 0) {
                    if (mergeRow) {
                        newSqr = this.drawSqr(sqr);
                        rowElm.appendChild(newSqr);
                    } else {
                        //if a hidden row merge with sqr already created.
                        let mergedSqrIndex = Math.floor(colCount / mergeFactor);
                        newSqr = rowElm.children[mergedSqrIndex];
                        newSqr.value = parseInt(newSqr.value) + sqr.getValue();
                        sqr.setHtmlElm(newSqr);
                    }
                } else {
                    newSqr.value = parseInt(newSqr.value) + sqr.getValue();
                    sqr.setHtmlElm(newSqr);
                }
            }
        }

        return boardElm;

    }

    createRow() {
        let rowElm = document.createElement('div');
        rowElm.className = `row`;
        return rowElm;
    }

    drawSqr(sqr) {
        let squareElm = document.createElement('input');
        //squareElm.style.width = `${rowLenPercent}%`;
        squareElm.type = "number";
        squareElm.className = `square`;
        squareElm.value = sqr.getValue();
        squareElm.addEventListener('change', (ev) => {
            sqr.setValue(ev.target.value);
        });
        sqr.setHtmlElm(squareElm);
        return squareElm;
    }

    getBoard() {
        return this.squares;
    }

    visitElm({ x, y }) {
        let htmlELm = this.squares[y][x].getHtmlElm();
        if (!htmlELm.className.includes('path')) {
            htmlELm.className += ' visted ';
        }
    }
    setPath(pathArray) {
        this.endValue = 0;
        const startPoint = { x: 0, y: 0 }
        pathArray.forEach((elm, i) => {
            let htmlElm = this.squares[elm.y][elm.x].getHtmlElm();
            if (!(elm.y === startPoint.y && elm.x === startPoint.x)) {
                this.endValue += this.squares[elm.y][elm.x].getValue();
            }

            console.log(`Total: ${this.endValue} as of index: ${i}`);

            if (!htmlElm) {
                return;
            }
            if (!htmlElm.className.includes('visted')) {
                htmlElm.className.replace("visted", "");
            }
            if (!htmlElm.className.includes('path')) {
                htmlElm.className += ' path '
            }

        })
    }
    getEndValue() {
        return this.endValue;
    }

    increaseSize(numberOfRepeated = 4) {
        // 5 repeats for advent challenge
        this.squares.forEach((row) => {
            const ordinalLen = row.length;
            for (let i = 0; i < numberOfRepeated; i++) {
                for (let j = 0; j < ordinalLen; j++) {
                    const oldSquare = row[j];
                    let newValue = (((oldSquare.value) + (i)) % 9) + 1;
                    const newSquare = new Square(newValue);
                    row.push(newSquare);
                }
            }
        })



        const ordinalHeight = this.squares.length;
        for (let repeaterCount = 0; repeaterCount < numberOfRepeated; repeaterCount++) {
            for (let heightIndex = 0; heightIndex < ordinalHeight; heightIndex++) {
                const row = this.squares[heightIndex];
                let rowElm = [];
                row.forEach(oldSquare => {
                    let newValue = (((oldSquare.value) + (repeaterCount)) % 9) + 1;
                    newValue = newValue > 9 ? 1 : newValue;
                    const newSquare = new Square(newValue);
                    rowElm.push(newSquare);
                })

                this.squares.push(rowElm);
            }
        }






    }
}

