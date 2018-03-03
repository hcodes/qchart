import Elems from './elems';
import Options from './options';
import MiddleDots from './middle-dots';
import {getMinMax, setStyle} from './tools';

export default class QChart {
    /**
     * @param {String|DOMElement} dom
     * @param {Object} options
     */
    constructor(dom, options) {
        dom = typeof dom === 'string' ?
            document.querySelector(dom) :
            dom;

        if (!dom) {
            return;
        }

        this._dom = dom;
        this._dom.classList.add('qchart');

        this.elems = new Elems(dom);
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

        this._width = this._manager.offsetWidth;
        this._height = this._manager.offsetHeight;

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

        this._manager.addEventListener('scroll', this._onscroll, false);
        window.addEventListener('resize', this._onresize, false);
    }

    unbindEvents() {
        this._manager.removeEventListener('scroll', this._onscroll, false);
        window.removeEventListener('resize', this._onresize, false);
    }

    createBody() {
        const elems = this.elems;

        this._info = elems.create('info');
        elems.append(this._info);

        const container = elems.create('container');
        elems.append(container);

        this._middleLine = elems.create('middle-line');
        setStyle(this._middleLine, {
            backgroundColor: this.options.get('middleLineColor'),
            width: this.options.get('middleLineWidth'),
            marginLeft: -this.options.get('middleLineWidth') / 2
        });
        elems.append(this._middleLine, container);

        const middleDots = elems.create('middle-dots');
        elems.append(middleDots, container);
        this._middleDots = new MiddleDots(middleDots, this.options);

        this._manager = elems.create('manager');
        setStyle(this._manager, 'height', this.options.get('height'));
        elems.append(this._manager, container);

        this._buffersContainer = elems.create('buffers-container');
        elems.append(this._buffersContainer, this._manager);

        this._controls = elems.create('controls');
        elems.append(this._controls);
    }

    clearData() {
        this._data = { series: [] };
    }

    redraw() {
        this.updateOptions();
        this.resize();
    }

    setData(data) {
        this.removeAllBuffers();

        if (!data || !Array.isArray(data.series) || !data.series.length) {
            this._dom.classList.remove('_has-data');
            this.clearData();
            this._middleDots.remove();

            return;
        } else {
            this._dom.classList.add('_has-data');
        }

        this._data = data;
        this._dataWidth = this._data.series[0].data.length * this.options.get('scale');
        this._buffersContainer.style.width = this._dataWidth + 'px';

        const colors = this._data.series.map(function(item, i) {
            return this.options.get('middleDotBorderColor' + i);
        }, this);

        this._middleDots.create(colors);

        this.addBuffers();

        this._minMax = getMinMax(this._data.series[0].data);

        this.draw();
    }

    draw() {
        const
            scrollLeft = this._manager.scrollLeft,
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
                !buffer.canvas && this.drawBuffer(buffer, num);
            } else {
                this.removeBuffer(buffer);
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

        this._middleDots.setTop(dots);
    }

    drawBuffer(buffer, num) {
        let canvas = buffer.canvas;
        if (!canvas) {
            buffer.canvas = canvas = this.elems.create('buffer', 'canvas');
            canvas.width = buffer.width;
            canvas.height = buffer.height;
            canvas.style.left = buffer.left + 'px';
            this._buffersContainer.appendChild(canvas);
        }

        const
            ctx = buffer.canvas.getContext('2d'),
            scale = this.options.get('scale'),
            series = this._data.series[0].data;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, buffer.width, buffer.height);
        ctx.beginPath();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;

        for (let i = 0; i < series.length; i++) {
            const
                x = i * scale - num * this._width,
                y = this._calcY(series[i][1]);

            if (i) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        }

        ctx.stroke();
    }

    _calcY(value) {
        return this._height - value * this._height / this._minMax.max;
    }

    addBuffers() {
        const count = this.getCountBuffers();
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

    removeBuffer(buffer) {
        if (buffer.canvas) {
            this._buffersContainer.removeChild(buffer.canvas);
            buffer.canvas = null;
        }
    }

    removeAllBuffers() {
        this._buffers.forEach(function(buffer) {
            this.removeBuffer(buffer);
        }, this);

        this._buffers = [];
    }

    getCountBuffers() {
        const
            value = this._dataWidth / this._manager.offsetWidth,
            flooredValue = Math.floor(value);

        return value === flooredValue ? value : flooredValue + 1;
    }

    updateOptions() {
        setStyle(this._dom, {
            backgroundColor: this.options.get('backgroundColor'),
            color: this.options.get('color')
        });

        setStyle(this._manager, 'height', this.options.get('height'));

        this._updatePadding();
    }

    scroll() {
        this.draw();
    }

    resize() {
        const
            width = this._manager.offsetWidth,
            height = this._manager.offsetHeight;

        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            this.update();
        }
    }

    update() {
        this._updatePadding();
        this.removeAllBuffers();
        this.addBuffers();
        this.draw();
    }

    _updatePadding() {
        this._padding = this._manager.offsetWidth / 2;
        this._buffersContainer.style.marginLeft = this._padding + 'px';
        this._buffersContainer.style.paddingRight = this._padding + 'px';
    }

    destroy() {
        this.removeAllBuffers();
        this.unbindEvents();

        this.elems.destroy();
        this.options.destroy();

        delete this._dom;
    }
}
