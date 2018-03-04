import {createElem, setStyle} from './dom';

export default class CurrentValues {
    constructor(main, options) {
        this.$main = main;

        this.options = options;

        this.$values = [];
    }

    create(colors) {
        this.remove();

        this.$date = createElem('current-date');
        this.$main.appendChild(this.$date);

        const values = createElem('current-values');
        this.$main.appendChild(values);

        for (let i = 0; i < colors.length; i++) {
            const value = createElem('current-value');
            values.appendChild(value);
            this.$values.push(value);
        }

        this.setStyle(colors);
    }

    setStyle(colors) {
        this.$values.forEach(function(value, i) {
            setStyle(value, 'color', colors[i] || this.options.get('color' + i));
        }, this);
    }

    setValue(timestamp, values) {
        this.$date.innerHTML = this.options.get('dateFormater')(timestamp);
        this.$values.forEach(function(item, i) {
            item.innerHTML = this.options.get('valueFormater')(values[i], i);
        }, this);
    }

    remove() {
        this.$values.forEach(function(value) {
            value.parentNode.removeChild(value);
        });

        this.$values = [];
    }

    destroy() {
        this.remove();

        delete this.options;
        delete this.$main;
    }
}
