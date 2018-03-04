/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */
import {createElem, setStyle} from './dom';
import {getMinMaxForSomeSeries} from './tools';

import Options from './options';
import MiddleDots from './middle-dots';
import CurrentValues from './current-values';

export default class QChart {
    /**
     * @param {String|DOMElement} dom
     * @param {Object} options
     */
    constructor(dom, options) {
        dom = typeof dom === 'string' ?
            document.querySelector(dom) :
            dom;

        if (!dom) { return; }

        this.$dom = dom;
        this.$dom.classList.add('qchart');

        this.options = new Options(options);

        this._period = this.options.get('period');
        this._periods = this.options.get('periods');
        this._periodsByValue = {};
        this._periods.forEach(function(item) {
            this._periodsByValue[item.value] = item;
        }, this);

        this._createBody();
        this.updateOptions();

        this._data = { series: [] };
        this._buffers = [];

        this._width = this.$manager.offsetWidth;
        this._height = this.$manager.offsetHeight;

        this._cachedAreaWidth = this._width * 1.1;

        this.bindEvents();
    }

    destroy() {
        this._removeAllBuffers();
        this.unbindEvents();
        this.options.destroy();

        delete this.$dom;
    }

    bindEvents() {
        this._onresize = () => {
            this.resize();
        };

        this._onscroll = () => {
            this.scroll();
        };

        this._onclickperiod = (e) => {
            const period = e.target.dataset.value;
            period && this.setPeriod(period);
        };

        if (this.$periods) {
            this.$periods.addEventListener('click', this._onclickperiod, false);
        }

        this.$manager.addEventListener('scroll', this._onscroll, false);
        window.addEventListener('resize', this._onresize, false);
    }

    unbindEvents() {
        this.$manager.removeEventListener('scroll', this._onscroll, false);
        window.removeEventListener('resize', this._onresize, false);
    }

    _createBody() {
        const current = createElem('current');
        this.$dom.appendChild(current);
        this.$current = new CurrentValues(current, this.options);

        const container = createElem('container');
        this.$dom.appendChild(container);

        this.$middleLine = createElem('middle-line');
        container.appendChild(this.$middleLine);

        const middleDots = createElem('middle-dots');
        container.appendChild(middleDots);
        this.$middleDots = new MiddleDots(middleDots, this.options);

        this.$manager = createElem('manager');
        container.appendChild(this.$manager);

        this.$buffersContainer = createElem('buffers-container');
        this.$manager.appendChild(this.$buffersContainer);

        const optionsPeriods = this.options.get('periods');
        if (optionsPeriods) {
            this.$periods = createElem('periods');
            this.options.get('periods').forEach(function(item) {
                const elem = createElem('period');
                elem.dataset.value = item.value;
                elem.innerHTML = item.text;
                elem.classList.add('_value_' + item.value);
                if (this._period === item.value) {
                    elem.classList.add('_selected');
                }

                this.$periods.appendChild(elem);
            }, this);

            this.$dom.appendChild(this.$periods);
        }
    }

    clearData() {
        this.setData({ series: [] });
    }

    setData(data) {
        this._removeAllBuffers();

        if (!data || !Array.isArray(data.series) || !data.series.length) {
            this.$dom.classList.remove('_has-data');
            this.$middleDots.remove();
            this.$current.remove();

            this._data = { series: [] };

            return;
        } else {
            this.$dom.classList.add('_has-data');
        }

        this._data = data;

        this._updateDataWidth();

        const series = this._data.series;
        const colors = series.map(function(item, i) {
            return this.options.get('color' + i);
        }, this);

        this.$middleDots.create(colors);
        this.$current.create(colors);

        setStyle(
            this.$dom,
            'color',
            this.options.get('color' + (series.length === 1 ? '0' : ''))
        );

        this._addBuffers();

        this._minMax = getMinMaxForSomeSeries(series);

        this.draw();
    }

    draw() {
        const
            scrollLeft = this.$manager.scrollLeft,
            x21 = scrollLeft - this._cachedAreaWidth,
            x22 = scrollLeft + this._cachedAreaWidth;

        this._buffers.forEach(function(buffer, num) {
            const
                x11 = buffer.left,
                x12 = buffer.left + this._width;

            if (
                (x11 > x21 && x11 < x22) ||
                (x12 > x21 && x12 < x22)
            ) {
                !buffer.canvas && this._drawBuffer(buffer, num);
            } else {
                this._removeBuffer(buffer);
            }
        }, this);

        let index = Math.floor((scrollLeft + this._width / 2 - this._padding) / this._getScale());
        if (index < 0) {
            index = 0;
        }

        const dots = this._data.series.map(function(item) {
            const lastIndex = item.data.length - 1;
            let itemIndex = index;
            if (itemIndex > lastIndex) {
                itemIndex = lastIndex;
            }

            return this._calcY(item.data[itemIndex][1]);
        }, this);

        this.$middleDots.setTop(dots);

        let timestamp;
        const values = this._data.series.map(function(item) {
            const lastIndex = item.data.length - 1;
            let itemIndex = index;
            if (itemIndex > lastIndex) {
                itemIndex = lastIndex;
            }

            timestamp = item.data[itemIndex][0];

            return item.data[itemIndex][1];
        }, this);


        this.$current.setValue(timestamp, values);
    }

    _drawBuffer(buffer, bufferNum) {
        let canvas = buffer.canvas;
        if (!canvas) {
            buffer.canvas = canvas = createElem('buffer', 'canvas');
            canvas.width = buffer.width;
            canvas.height = buffer.height;
            canvas.style.left = buffer.left + 'px';
            this.$buffersContainer.appendChild(canvas);
        }

        const
            ctx = buffer.canvas.getContext('2d'),
            scale = this._getScale();

        ctx.fillStyle = this.options.get('backgroundColor');
        ctx.fillRect(0, 0, buffer.width, buffer.height);
        ctx.lineWidth = this.options.get('lineWidth');

        for (let n = 0; n < this._data.series.length; n++) {
            const series = this._data.series[n].data;

            ctx.strokeStyle = series.color || this.options.get('color' + n);
            ctx.beginPath();

            for (let i = 0; i < series.length; i++) {
                const
                    x = i * scale - bufferNum * this._width,
                    y = this._calcY(series[i][1]);

                if (i) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }

                if (x > this._width) {
                    break;
                }
            }

            ctx.stroke();
        }
    }

    _calcY(value) {
        return this._height - value * this._height / this._minMax.max;
    }

    _addBuffers() {
        const count = this._getCountBuffers();
        for (let i = 0; i < count; i++) {
            this._buffers.push({
                left: i * this._width,
                width: this._width,
                height: this._height,
                canvas: null
            });
        }

        this._buffers[count - 1].width = this._dataWidth - (count - 1) * this._width;
    }

    _removeBuffer(buffer) {
        if (buffer.canvas) {
            this.$buffersContainer.removeChild(buffer.canvas);
            buffer.canvas = null;
        }
    }

    _removeAllBuffers() {
        this._buffers.forEach(function(buffer) {
            this._removeBuffer(buffer);
        }, this);

        this._buffers = [];
    }

    _getCountBuffers() {
        const
            value = this._dataWidth / this.$manager.offsetWidth,
            flooredValue = Math.floor(value);

        return value === flooredValue ? value : flooredValue + 1;
    }

    updateOptions() {
        setStyle(this.$dom, {
            backgroundColor: this.options.get('backgroundColor'),
            color: this.options.get('color')
        });

        setStyle(this.$middleLine, {
            backgroundColor: this.options.get('middleLineColor'),
            width: this.options.get('middleLineWidth'),
            marginLeft: -this.options.get('middleLineWidth') / 2
        });

        setStyle(this.$manager, 'height', this.options.get('height'));

        this._updatePadding();
    }

    setPeriod(name) {
        if (name === this._period) { return; }

        this._period = name;

        const wasSelected = this.$periods.querySelector('._selected');
        wasSelected && wasSelected.classList.remove('_selected');

        const selected = this.$periods.querySelector('._value_' + name);
        selected && selected.classList.add('_selected');

        this._updateDataWidth();
        this.update();
    }

    scroll() {
        this.draw();
    }

    resize() {
        const
            width = this.$manager.offsetWidth,
            height = this.$manager.offsetHeight;

        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            this.update();
        }
    }

    update() {
        this._updatePadding();
        this._removeAllBuffers();
        this._addBuffers();
        this.draw();
    }

    _getScale() {
        const width = this.$manager.offsetWidth;
        if (this._period === 'all') {
            return width / this._data.series[0].data.length;
        }

        return width / this._periodsByValue[this._period].days;
    }

    _updatePadding() {
        this._padding = this.$manager.offsetWidth / 2;
        this.$buffersContainer.style.marginLeft = this._padding + 'px';
        this.$buffersContainer.style.paddingRight = this._padding + 'px';
    }

    _updateDataWidth() {
        this._dataWidth = this._data.series[0].data.length * this._getScale();
        this.$buffersContainer.style.width = this._dataWidth + 'px';
    }
}
