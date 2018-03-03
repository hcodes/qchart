export default class Options {
    constructor(options) {
        this._defaultOptions = {
            backgroundColor: '#000', // black
            color: '#FFD963', // yellow
            height: 300,

            scale: 1,

            middleLineWidth: 2,
            middleLineColor: '#FFD963', // yellow

            middleDotBorderWidth: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: '#000', // black
            middleDotBorderColor1: '#FFD963', // yellow
            middleDotBorderColor2: '#FD5A3E', // red'
            middleDotBorderColor3: '#97CC64', // green
            middleDotBorderColor4: '#77B6E7', // blue
            middleDotBorderColor5: '#A955B8' // pink
        };

        this._options = options || {};
    }

    get(name) {
        const value = this._options[name];
        return typeof value === 'undefined' ? this._defaultOptions[name] : value;
    }

    set(name, value) {
        this._options[name] = value;
    }

    destroy() {
        delete this._options;
    }
}
