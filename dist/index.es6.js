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

        this.clearData();
        this.createBody();
        this.updateOptions();

        this.scales = {
            year: 2.5,
            month: 5,
            day: 10
        };

        this._buffers = [];

        this._width = this.$manager.offsetWidth;
        this._height = this.$manager.offsetHeight;

        this._cachedAreaWidth = this._width * 1.5;

        this.bindEvents();
    }

    bindEvents() {
        this._onresize = () => {
            this.resize();
        };

        this._onscroll = () => {
            this.scroll();
        };

        this.$manager.addEventListener('scroll', this._onscroll, false);
        window.addEventListener('resize', this._onresize, false);
    }

    unbindEvents() {
        this.$manager.removeEventListener('scroll', this._onscroll, false);
        window.removeEventListener('resize', this._onresize, false);
    }

    createBody() {
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

        this.$controls = createElem('controls');
        this.$dom.appendChild(this.$controls);
    }

    clearData() {
        this._data = { series: [] };
    }

    redraw() {
        this.updateOptions();
        this.resize();
    }

    setData(data) {
        this._removeAllBuffers();

        if (!data || !Array.isArray(data.series) || !data.series.length) {
            this.$dom.classList.remove('_has-data');
            this.clearData();
            this.$middleDots.remove();
            this.$current.remove();

            return;
        } else {
            this.$dom.classList.add('_has-data');
        }

        this._data = data;
        this._dataWidth = this._data.series[0].data.length * this.options.get('scale');
        this.$buffersContainer.style.width = this._dataWidth + 'px';

        const colors = this._data.series.map(function(item, i) {
            return this.options.get('color' + i);
        }, this);

        this.$middleDots.create(colors);
        this.$current.create(colors);

        this._addBuffers();

        this._minMax = getMinMaxForSomeSeries(this._data.series);

        this.draw();
    }

    draw() {
        console.time('a');
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

        let index = Math.floor((scrollLeft + this._width / 2 - this._padding) / this.options.get('scale'));
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

        console.timeEnd('a');
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
            scale = this.options.get('scale');

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

    _updatePadding() {
        this._padding = this.$manager.offsetWidth / 2;
        this.$buffersContainer.style.marginLeft = this._padding + 'px';
        this.$buffersContainer.style.paddingRight = this._padding + 'px';
    }

    destroy() {
        this._removeAllBuffers();
        this.unbindEvents();
        this.options.destroy();

        delete this.$dom;
    }
}
