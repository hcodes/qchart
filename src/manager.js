import {getMinMax} from './tools';
import Elems from './elems';

export default class Manager {
    constructor(elem, options) {
        this._elem = elem;

        this._buffers = [];

        this.clearData();

        this.options = options;
        this.elems = new Elems(elem);

        this._width = elem.offsetWidth;
        this._height = elem.offsetHeight;

        this._cachedAreaWidth = this._width * 1.5;

        this._buffersContainer = this.elems.create('buffers-container');
        this.elems.append(this._buffersContainer);

        this.bindEvents();
        this.update();
    }

    bindEvents() {
        this._onresize = () => {
            this.resize();
        };

        this._onscroll = () => {
            this.scroll();
        };

        this._elem.addEventListener('scroll', this._onscroll, false);
        window.addEventListener('resize', this._onresize, false);
    }

    unbindEvents() {
        this._elem.removeEventListener('scroll', this._onscroll, false);
        window.removeEventListener('resize', this._onresize, false);
    }

    clearData() {
        this._data = { series: [] };
    }

    setData(data) {
        this.removeAllBuffers();

        if (!data || !Array.isArray(data.series) || !data.series.length) {
            this.clearData();

            return;
        }

        this._data = data;
        this._dataWidth = this._data.series[0].length * this.options.get('scale');
        this._buffersContainer.style.width = this._dataWidth + 'px';

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
        this._minMax = getMinMax(this._data.series[0]);

        this.draw();
    }

    draw() {
        const
            scrollLeft = this._elem.scrollLeft,
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
            series = this._data.series[0];

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, buffer.width, buffer.height);
        ctx.beginPath();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;

        for (let i = 0; i < series.length; i++) {
            const
                x = i * scale - num * this._width,
                y = this._height - series[i][1] * this._height / this._minMax.max;

            if (i) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        }

        ctx.stroke();
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
            value = this._dataWidth / this._elem.offsetWidth,
            flooredValue = Math.floor(value);

        return value === flooredValue ? value : flooredValue + 1;
    }

    scroll() {
        this.draw();
    }

    resize() {
        const
            width = this._elem.offsetWidth,
            height = this._elem.offsetHeight;

        if (width !== this._width || height !== this._height) {
            this._width = width;
            this._height = height;
            this.update();
        }
    }

    update() {
        this.removeAllBuffers();
        this.draw();

        const padding = this._elem.offsetWidth / 2;
        this._buffersContainer.style.marginLeft = padding + 'px';
        this._buffersContainer.style.paddingRight = padding + 'px';
    }

    destroy() {
        this.removeAllBuffers();
        this.unbindEvents();
    }
}
