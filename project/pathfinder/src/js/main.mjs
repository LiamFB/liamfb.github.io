import SetupPathFinder from "./PathFinderBuilder.mjs";
import Board from "./views/board.mjs";

export default class main {
    constructor() {

        this.board = new Board(5, 5);
        this.board.setBoard(
            [
                [1, 1, 6, 3, 7, 5, 1, 7, 4, 2],
                [1, 3, 8, 1, 3, 7, 3, 6, 7, 2],
                [2, 1, 3, 6, 5, 1, 1, 3, 2, 8],
                [3, 6, 9, 4, 9, 3, 1, 5, 6, 9],
                [7, 4, 6, 3, 4, 1, 7, 1, 1, 1],
                [1, 3, 1, 9, 1, 2, 8, 1, 3, 7],
                [1, 3, 5, 9, 9, 1, 2, 4, 2, 1],
                [3, 1, 2, 5, 4, 2, 1, 6, 3, 9],
                [1, 2, 9, 3, 1, 3, 8, 5, 2, 1],
                [2, 3, 1, 1, 9, 4, 4, 5, 8, 1],
            ]);
        this.drawBoard(this.board);

        document.getElementsByClassName('save')[0].onclick = () => this.drawBoard(this.board);
        document.getElementsByClassName('calc')[0].onclick = () => this.calcPath(
            this.board
        );
        document.getElementsByClassName('increaseSize')[0].onclick = () => {
            this.board = this.increaseSize(this.board);
            this.drawBoard(this.board);
        };
        document.getElementsByClassName('loadFile')[0].onclick = () => {
            document.getElementsByClassName('loadFileActual')[0].click();
        }
        document.getElementsByClassName('loadFileActual')[0].addEventListener('change', (evnt) => {
            const fileList = evnt.target.files;
            fileList[0]
            console.log(fileList);
            this.readFileInput(fileList[0]);
        }, false)
    }

    readFileInput(file) {
        const reader = new FileReader();
        reader.addEventListener('load', (evnt) => {
            this.board = this.loadBoard(evnt.target.result);
            this.drawBoard(this.board);
        })
        reader.readAsText(file);
    }

    increaseSize(board) {
        console.log('loading increase size');
        board.increaseSize();
        console.log('Done increase size');
        return board;
    }

    startCalc(pathFinder, board) {
        console.log('starting calc');
        let path;
        let finished = false;
        pathFinder.calcPath().then((value) => {
            console.log('Done Calc');
            path = value;
            if (finished) {
                board.setPath(value);
                document.getElementsByClassName('endValue')[0].value = board.getEndValue();
            }

        });

        console.log("doing Something else");
        let timeOut;
        const timer = window.setInterval(() => {
            let msg = pathFinder.getVistedQurdates();
            if (msg) {
                board.visitElm(msg);
                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    clearInterval(timer);
                    pathFinder.delete();
                }, 1000);
            } else {
                finished = true;
                console.log("Done I think");
                board.setPath(path);
                document.getElementsByClassName('endValue')[0].value = board.getEndValue();
                clearInterval(timer);
            }
        }, 1 / 1000);
        timeOut = setTimeout(() => {
            clearInterval(timer);
            pathFinder.delete();
        }, 1000);
        return timer;
    }

    drawBoard(board) {
        document.getElementsByClassName('board')[0].innerHTML = '';
        const boardView = board.draw();
        document.getElementsByClassName('board')[0].appendChild(boardView);
    }

    async calcPath(board) {
        document.querySelectorAll('.square').forEach(elm => {
            elm.classList.remove('visted');
            elm.classList.remove('path');
        })
        console.log('Importing path data');
        const pathFinder = await SetupPathFinder.build();
        board.getBoard().forEach(row => pathFinder.addRow(row));
        console.log('done importing');
        const timer = this.startCalc(pathFinder, board);
    }


    loadBoard(rawInputBoard) {
        const inputValue = rawInputBoard.trim().replace(/\r/g, '').split('\n');
        let newInput = [];
        let rowLen;
        inputValue.forEach((row, i) => {
            if (i === 0) {
                rowLen = row.length;
            } else if (row.length !== rowLen) {
                console.log('Input is not in the correct format, please make sure all row and column lengths are the same.');
            }
            if (row.includes(',')) {
                row.replace(/,/g, '');
            }
            if (!/^\d+$/.test(row)) {
                throw Error('File contains non numerical data');
            }
            if (!(row.length > 1)) {
                return;
            }
            let newRow = [];
            for (let i = 0; i < rowLen; i++) {
                const elm = parseInt(row[i]);
                newRow.push(elm);
            }
            newInput.push(newRow);
        })
        console.log(newInput);
        const board = new Board();
        board.setBoard(newInput);
        return board;
    }

}

