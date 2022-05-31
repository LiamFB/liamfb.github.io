export default class Square {
    constructor(value) {
        this.value = value;
        this.htmlELm = null;
    }

    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = parseInt(value);
    }
    setHtmlElm(htmlELm) {
        this.htmlELm = htmlELm;
    }
    getHtmlElm() {
        return this.htmlELm;
    }

}