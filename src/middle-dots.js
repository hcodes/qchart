import Elems from './elems';
import {setStyle} from './tools';

export default class MiddleDots {
    constructor(main, options) {
        this._main = main;

        this.elems = new Elems(main);
        this.options = options;

        this._dots = [];
    }

    create(colors) {
        this.remove();

        for (let i = 0; i < colors.length; i++) {
            let dot = this.elems.create('middle-dot');
            this._main.appendChild(dot);
            this._dots.push(dot);
        }

        this.setStyle(colors);
    }

    setStyle(colors) {
        const
            size = this.options.get('middleDotSize'),
            margin = -this.options.get('middleDotSize') / 2 - this.options.get('middleDotBorderWidth'),
            backgroundColor = this.options.get('middleDotBackgroundColor'),
            borderWidth = this.options.get('middleDotBorderWidth');

        this._dots.forEach(function(dot, i) {
            setStyle(dot, {
                borderColor: colors[i] ||
                    this.options.get('middleDotBorderColor') ||
                    this.options.get('middleDotBorderColor' + i),
                borderWidth,
                backgroundColor,
                marginLeft: margin,
                marginTop: margin,
                width: size,
                height: size
            });
        }, this);
    }

    setTop(positions) {
        this._dots.forEach(function(dot, i) {
            setStyle(dot, 'top', positions[i]);
        });
    }

    remove() {
        this._dots.forEach(function(dot) {
            dot.parentNode.removeChild(dot);
        });

        this._dots = [];
    }

    destroy() {
        this.remove();

        this.elems.destroy();
        delete this.elems;

        delete this.options;

        delete this._main;
    }
}
