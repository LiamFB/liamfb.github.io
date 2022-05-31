export default class PathFinder {
    constructor(module) {
        this.instance = new module.ChitonPathCalc();
        this.intList = module.IntList;
    }
    /**
     * 
     * @param {int[]} arrayInt 
     */
    addRow(arrayInt) {
        const row = new this.intList();
        arrayInt.forEach(intValueObj => {
            row.push_back(intValueObj.value);
        });
        this.instance.addRowToMap(row)
    }

    async calcPath() {
        return new Promise((resolve, reject) => {
            const results = [];
            const tmpResults = this.instance.calcPath();
            console.log("Actually Done");
            for (let i = 0; i < tmpResults.size(); i++) {
                const element = tmpResults.get(i);
                results.push(element);
            }
            resolve(results);
        })
    }

    getMessage() {
        return this.instance.getMessage();
    }

    getVistedQurdates() {
        const msg = this.getMessage();
        if (!msg) {
            return null;
        }
        let q = msg.split(',');
        return { x: q[0], y: q[1] };
    }

    totalValue() {
        return this.instance.sumArray();
    }
    delete() {
        this.instance.delete();
    }
}
