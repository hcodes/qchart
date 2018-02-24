export default class Chart {
    constructor(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
    }

    draw() {

    }

    setData(data) {
        this._data = data;
    }

    update() {
        this._canvas.width = this._options.width;
        this._canvas.height = this._options.height;
    }

    destroy() {
        delete this._canvas;
        delete this._ctx;
    }
}
