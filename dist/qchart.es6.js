/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */
import {createElem, setStyle} from './dom';
import {inRange, getMinMaxForSomeSeries} from './tools';

import Events from './events';
import Options from './options';
import MiddleDots from './middle-dots';
import CurrentValues from './current-values';

export default class QChart extends Events {
    /**
     * @param {String|DOMElement} dom
     * @param {Object} options
     * @see options.js
     */
    constructor(dom, options) {
        super();

        dom = typeof dom === 'string' ?
            document.querySelector(dom) :
            dom;

        if (!dom) { return; }

        this.$dom = dom;
        this.$dom.classList.add('qchart');

        this.options = new Options(options);

        this._period = this.options.get('period');
        this._periodsByValue = (this.options.get('periods') || []).reduce((prev, item) => {
            prev[item.value] = item;
            return prev;
        }, {});

        this._createBody();
        this.updateOptions();

        this._data = this._getEmptyData();
        this._buffers = [];

        this._buffersWidth = this.$buffers.offsetWidth;
        this._buffersHeight = this.$buffers.offsetHeight;

        this._cachedAreaWidth = this._buffersWidth * 1.1;

        this._bindEvents();
    }

    destroy() {
        this._removeAllBuffers();
        this._unbindEvents();

        this.options.destroy();
        this._middleDots.destroy();
        this._currentValues.destroy();

        delete this.$periods;

        this.$dom.innerHTML = '';
        delete this.$dom;
    }

    _getEmptyData() {
        return { series: [] };
    }

    clearData() {
        this.setData(this._getEmptyData());
    }

    setData(data) {
        this._removeAllBuffers();

        if (!data || !Array.isArray(data.series) || !data.series.length) {
            this.$dom.classList.remove('_has-data');
            this._middleDots.remove();
            this._currentValues.remove();

            this._data = this._getEmptyData();

            return;
        } else {
            this.$dom.classList.add('_has-data');
        }

        this._data = data;

        this._updateDataWidth();
        this._updateScrollAlign();

        const series = this._data.series;
        const colors = series.map((item, i) => item.color || this.options.get('color' + i));

        this._middleDots.create(colors);
        this._currentValues.create(colors);

        setStyle(
            this.$dom,
            'color',
            this.options.get('color' + (series.length === 1 ? '0' : ''))
        );

        this._addBuffers();

        this._minMax = getMinMaxForSomeSeries(series);

        this.draw();
    }

    setPeriod(name) {
        if (name === this._period) { return; }

        this.trigger('changeperiod', name);

        this._period = name;

        const wasSelected = this.$periods.querySelector('._selected');
        wasSelected && wasSelected.classList.remove('_selected');

        const selected = this.$periods.querySelector('._value_' + name);
        selected && selected.classList.add('_selected');

        this.update();
    }

    resize() {
        const
            width = this.$buffers.offsetWidth,
            height = this.$buffers.offsetHeight;

        if (width !== this._buffersWidth || height !== this._buffersHeight) {
            this._buffersWidth = width;
            this._bufferHeight = height;

            this.update();
            this.trigger('resize');
        }
    }

    scroll() {
        this.draw();
        this.trigger('scroll');
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

        setStyle(this.$buffers, 'height', this.options.get('height'));

        this._updateBuffersPadding();
    }

    update() {
        this._updateDataWidth();
        this._updateBuffersPadding();
        this._removeAllBuffers();
        this._addBuffers();
        this.draw();
    }

    draw() {
        const
            scrollLeft = this.$buffers.scrollLeft,
            series = this._data.series;

        this._buffers.forEach(function(buffer, num) {
            if (inRange(
                buffer.left,
                buffer.left + this._buffersWidth,
                scrollLeft - this._cachedAreaWidth,
                scrollLeft + this._cachedAreaWidth,
            )) {
                //!buffer.canvas && this._drawBuffer(buffer, num);
                this._drawBuffer(buffer, num);
            } else {
                this._removeBuffer(buffer);
            }
        }, this);

        let index = Math.floor((scrollLeft + this._buffersWidth / 2 - this._buffersPadding) / this._getScale());
        if (index < 0) {
            index = 0;
        }

        let timestamp;
        const values = series.map(item => {
            const lastIndex = item.data.length - 1;
            let itemIndex = index;
            if (itemIndex > lastIndex) {
                itemIndex = lastIndex;
            }

            timestamp = item.data[itemIndex][0];

            return item.data[itemIndex][1];
        });

        this._currentValues.setValues(values, timestamp);

        this._middleDots.setTop(values.map(item => this._calcY(item)));
    }

    _drawBuffer(buffer, bufferNum) {
        let canvas = buffer.canvas;
        if (!canvas) {
            buffer.canvas = canvas = createElem('buffer', 'canvas');
            canvas.width = buffer.width;
            canvas.height = buffer.height;
            setStyle(canvas, 'left', buffer.left);
            this.$buffersContainer.appendChild(canvas);
        }

        const
            ctx = buffer.canvas.getContext('2d'),
            scale = this._getScale();

        ctx.fillStyle = this.options.get('backgroundColor');
        ctx.fillRect(0, 0, buffer.width, buffer.height);
        ctx.lineWidth = this.options.get('lineWidth');

        let
            from = Math.floor((this.$buffers.scrollLeft - this.$buffers.offsetWidth / 2) / this._getScale()),
            to = from + Math.floor(this.$buffers.offsetWidth / this._getScale()),
            maxLen = this._data.series[0].data.length - 1;

        if (from < 0) {
            from = 0;
        }

        if (from > maxLen) {
            from = maxLen;
        }

        if (to < 0) {
            to = 0;
        }

        if (to > maxLen) {
            to = maxLen;
        }

        this._minMax = getMinMaxForSomeSeries(this._data.series, from, to);

        for (let n = 0; n < this._data.series.length; n++) {
            const series = this._data.series[n].data;

            ctx.strokeStyle = series.color || this.options.get('color' + n);
            ctx.beginPath();

            for (let i = 0; i < series.length; i++) {
                const
                    x = i * scale - bufferNum * this._buffersWidth,
                    y = this._calcY(series[i][1]);

                if (i) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }

                if (x > this._buffersWidth) {
                    break;
                }
            }

            ctx.stroke();
        }
    }

    _createBody() {
        const current = createElem('current');
        this.$dom.appendChild(current);
        this._currentValues = new CurrentValues(current, this.options);

        const container = createElem('container');
        this.$dom.appendChild(container);

        this.$middleLine = createElem('middle-line');
        container.appendChild(this.$middleLine);

        const middleDots = createElem('middle-dots');
        container.appendChild(middleDots);
        this._middleDots = new MiddleDots(middleDots, this.options);

        this.$buffers = createElem('buffers');
        container.appendChild(this.$buffers);

        this.$buffersContainer = createElem('buffers-container');
        this.$buffers.appendChild(this.$buffersContainer);

        this._createPeriods();
    }

    _createPeriods() {
        const optionsPeriods = this.options.get('periods');
        if (optionsPeriods) {
            this.$periods = createElem('periods');
            optionsPeriods.forEach(item => {
                const elem = createElem('period');
                elem.dataset.value = item.value;
                elem.innerHTML = item.text;
                elem.classList.add('_value_' + item.value);
                if (this._period === item.value) {
                    elem.classList.add('_selected');
                }

                this.$periods.appendChild(elem);
            });

            this.$dom.appendChild(this.$periods);
        }
    }

    _bindEvents() {
        this._onresize = this.resize.bind(this);
        this._onscroll = this.scroll.bind(this);
        this._onclickperiod = (e) => {
            const period = e.target.dataset.value;
            period && this.setPeriod(period);
        };

        this.$periods && this.$periods.addEventListener('click', this._onclickperiod, false);

        this.$buffers.addEventListener('scroll', this._onscroll, false);
        window.addEventListener('resize', this._onresize, false);
    }

    _unbindEvents() {
        this.$periods && this.$periods.removeEventListener('click', this._onclickperiod, false);

        this.$buffers.removeEventListener('scroll', this._onscroll, false);
        window.removeEventListener('resize', this._onresize, false);
    }

    _calcY(value) {
        return this._buffersHeight - value * this._buffersHeight / this._minMax.max;
    }

    _addBuffers() {
        const count = this._getCountBuffers();
        for (let i = 0; i < count; i++) {
            this._buffers.push({
                left: i * this._buffersWidth,
                width: this._buffersWidth,
                height: this._buffersHeight,
                canvas: null
            });
        }

        this._buffers[count - 1].width = this._dataWidth - (count - 1) * this._buffersWidth;
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
            value = this._dataWidth / this.$buffers.offsetWidth,
            flooredValue = Math.floor(value);

        return value === flooredValue ? value : flooredValue + 1;
    }

    _getScale() {
        const width = this.$buffers.offsetWidth;
        if (this._period === 'all') {
            return width / this._data.series[0].data.length;
        }

        return width / this._periodsByValue[this._period].days;
    }

    _updateBuffersPadding() {
        this._buffersPadding = this.$buffers.offsetWidth / 2;
        setStyle(this.$buffersContainer, {
            marginLeft: this._buffersPadding,
            paddingRight: this._buffersPadding
        });
    }

    _updateDataWidth() {
        this._dataWidth = ((this._data.series[0].data.length - 1) * this._getScale()) || 1;
        setStyle(this.$buffersContainer, 'width', this._dataWidth);
    }

    _updateScrollAlign() {
        const align = this.options.get('scrollAlign');
        this.$buffers.scrollLeft = align === 'right' ?
            this.$buffersContainer.offsetWidth + this._buffersPadding * 2 - this.$buffers.offsetWidth :
            0;
    }
}
