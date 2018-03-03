export default class Elems {
    constructor(main) {
        this.name = 'qchart';
        this._main = main;
    }

    create(elemName, tag) {
        const elem = document.createElement(tag || 'div');
        elem.className = this.name + (elemName ? '__' + elemName : '');

        return elem;
    }

    append(elem, to) {
        if (to) {
            to.appendChild(elem);
        } else {
            this._main.appendChild(elem);
        }
    }

    destroy() {
        this._main.innerHTML = '';
        delete this._main;
    }
}
