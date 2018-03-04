import {createElem, setStyle} from './dom';

export default class MiddleDots {
    constructor(main, options) {
        this.$main = main;

        this.options = options;

        this.$dots = [];
    }

    create(colors) {
        this.remove();

        for (let i = 0; i < colors.length; i++) {
            let dot = createElem('middle-dot');
            this.$main.appendChild(dot);
            this.$dots.push(dot);
        }

        this.setStyle(colors);
    }

    setStyle(colors) {
        const
            size = this.options.get('middleDotSize'),
            margin = -this.options.get('middleDotSize') / 2 - this.options.get('middleDotBorderWidth'),
            backgroundColor = this.options.get('middleDotBackgroundColor'),
            borderWidth = this.options.get('middleDotBorderWidth');

        this.$dots.forEach(function(dot, i) {
            setStyle(dot, {
                borderColor: colors[i] ||
                    this.options.get('color' + i),
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
        this.$dots.forEach(function(dot, i) {
            setStyle(dot, 'top', positions[i]);
        });
    }

    remove() {
        this.$dots.forEach(function(dot) {
            dot.parentNode.removeChild(dot);
        });

        this.$dots = [];
    }

    destroy() {
        this.remove();

        delete this.options;
        delete this.$main;
    }
}
