export default class Options {
    constructor(options) {
        this._defaultOptions = {
            backgroundColor: 'black',
            color: 'yellow',
            height: 300,

            scale: 1,

            middleLineWidth: 2,
            middleLineBackgroundColor: 'yellow',

            middleDotBorderWidth: 2,
            middleDotBorderColor: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: 'black',
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
