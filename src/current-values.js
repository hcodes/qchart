import Elems from './elems';
import {setStyle} from './tools';

export default class CurrentValues {
    constructor(main, options) {
        this._main = main;

        this.elems = new Elems(main);
        this.options = options;

        this._values = [];
    }

    create(colors) {
        this.remove();

        const date = this.elems.create('current-date');
        this._date = date;
        this._main.appendChild(date);

        const values = this.elems.create('current-values');
        this._main.appendChild(values);

        for (let i = 0; i < colors.length; i++) {
            const value = this.elems.create('current-value');
            values.appendChild(value);
            this._values.push(value);
        }

        this.setStyle(colors);
    }

    setStyle(colors) {
        this._values.forEach(function(value, i) {
            setStyle(value, 'color', colors[i] || this.options.get('color' + i));
        }, this);
    }

    setValue(timestamp, values) {
        this._date.innerHTML = this.options.get('dateFormater')(timestamp);
        this._values.forEach(function(item, i) {
            item.innerHTML = this.options.get('valueFormater')(values[i], i);
        }, this);
    }

    remove() {
        this._values.forEach(function(value) {
            value.parentNode.removeChild(value);
        });

        this._values = [];
    }

    destroy() {
        this.remove();

        this.elems.destroy();
        delete this.elems;

        delete this.options;

        delete this._main;
    }
}
