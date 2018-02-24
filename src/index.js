import Elems from './elems';
import Options from './options';
import Manager from './manager';

export default class QChart {
    /**
     *
     * @param {String|DOMElement} dom
     * @param {Object} options
     * @param {string} [options.height=300]
     * @param {string} [options.backgroundColor='#000']
     * @param {string} [options.color='#fff']
     */
    constructor(dom, options) {
        dom = typeof dom === 'string' ?
            document.querySelector(dom) :
            dom;

        if (!dom) {
            return;
        }

        this._dom = dom;

        this.elems = new Elems(dom);
        this.options = new Options(options);

        this.createBody();
        this.updateOptions();

        this.scales = {
            year: 2.5,
            month: 5,
            day: 10
        };

        this.manager = new Manager(this._manager, this.options);
    }

    setStyle(dom, propertyName, propertyValue) {
        if (typeof propertyValue === 'number') {
            propertyValue += 'px';
        }

        dom.style[propertyName] = propertyValue;
    }

    createBody() {
        this._info = this.elems.create('info');
        this.elems.append(this._info);

        const container = this.elems.create('container');
        this.elems.append(container);

        this._middleLine = this.elems.create('middle-line');
        this.setStyle(this._middleLine, 'backgroundColor', this.options.get('middleLineBackgroundColor'));
        this.setStyle(this._middleLine, 'width', this.options.get('middleLineWidth'));
        this.setStyle(this._middleLine, 'marginLeft', -this.options.get('middleLineWidth') / 2);
        this.elems.append(this._middleLine, container);

        this._middleDot = this.elems.create('middle-dot');
        this.setStyle(this._middleDot, 'borderWidth', this.options.get('middleDotBorderWidth'));
        this.setStyle(this._middleDot, 'borderColor', this.options.get('middleDotBorderColor'));
        this.setStyle(this._middleDot, 'backgroundColor', this.options.get('middleDotBackgroundColor'));
        this.setStyle(this._middleDot, 'width', this.options.get('middleDotSize'));
        this.setStyle(this._middleDot, 'marginLeft', -this.options.get('middleDotSize') / 2 - this.options.get('middleDotBorderWidth'));
        this.setStyle(this._middleDot, 'height', this.options.get('middleDotSize'));

        this.elems.append(this._middleDot, container);

        this._manager = this.elems.create('manager');
        this.setStyle(this._manager, 'height', this.options.get('height'));
        this.elems.append(this._manager, container);

        this._controls = this.elems.create('controls');
        this.elems.append(this._controls);
    }

    setData(data) {
        if (data.series.length) {
            this._dom.classList.remove('_has-data');
        } else {
            this._dom.classList.add('_has-data');
        }

        this.manager.setData(data);
    }

    redraw() {
        this.updateOptions();
        this.resize();
    }

    updateOptions() {
        ['backgroundColor', 'color'].forEach(function(option) {
            this.setStyle(this._dom, option, this.options.get(option));
        }, this);

        this.setStyle(this._manager, 'height', this.options.get('height'));
    }

    destroy() {
        this.elems.destroy();
        this.options.destroy();

        delete this._dom;
    }
}
