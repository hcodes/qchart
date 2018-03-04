import {createElem, setStyle} from './dom';

export default class CurrentValues {
    constructor(main, options) {
        this.$main = main;

        this.options = options;

        this._values = [];
    }

    create(colors) {
        this.remove();

        this.$date = createElem('current-date');
        this.$main.appendChild(this.$date);

        const $values = createElem('current-values');
        this.$main.appendChild($values);

        for (let i = 0; i < colors.length; i++) {
            const value = createElem('current-value');
            $values.appendChild(value);
            this._values.push(value);
        }

        this.setStyle(colors);
    }

    setStyle(colors) {
        this._values.forEach((value, i) => {
            setStyle(value, 'color', colors[i] || this.options.get('color' + i));
        });
    }

    setValues(values, timestamp) {
        this._values.forEach((item, i) => {
            item.innerHTML = this.options.get('valueFormater')(values[i], i);
        });

        this.$date.innerHTML = this.options.get('dateFormater')(timestamp);
    }

    remove() {
        this._values.forEach(value => value.parentNode.removeChild(value));
        this._values = [];
    }

    destroy() {
        this.remove();

        delete this._values;
        delete this.options;
        delete this.$main;
    }
}
