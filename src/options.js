export default class Options {
    constructor(options) {
        this._defaultOptions = {
            backgroundColor: '#000', // black
            height: 300,
            lineWidth: 1,

            scale: 1,

            middleLineWidth: 2,
            middleLineColor: '#FFD963', // yellow

            middleDotBorderWidth: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: '#000', // black
            color: '#FFF', // white
            color0: '#FFD963', // yellow
            color1: '#FD5A3E', // red'
            color2: '#97CC64', // green
            color3: '#77B6E7', // blue
            color4: '#A955B8', // pink

            dateFormater: function(timestamp) {
                const date = new Date(timestamp);

                function leadZero(num) {
                    return num > 9 ? num : '0' + num;
                }

                return [
                    date.getFullYear(),
                    leadZero(date.getMonth() + 1),
                    leadZero(date.getDate())
                ].join('-');
            },

            valueFormater: function(value) {
                return value;
            }
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
