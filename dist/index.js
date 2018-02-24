/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.QChart = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Elems = function () {
    function Elems(main) {
        _classCallCheck(this, Elems);

        this.name = 'qchart';

        this._elems = { main: main };
        this._main = main;
    }

    _createClass(Elems, [{
        key: 'create',
        value: function create(elemName, tag) {
            var elem = document.createElement(tag || 'div');
            elem.className = this.name + '__' + elemName;

            return elem;
        }
    }, {
        key: 'append',
        value: function append(elem, to) {
            if (to) {
                to.appendChild(elem);
            } else {
                this._main.appendChild(elem);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._main.innerHTML = '';
            delete this._main;
        }
    }]);

    return Elems;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Options = function () {
    function Options(options) {
        _classCallCheck$1(this, Options);

        this._defaultOptions = {
            backgroundColor: 'black',
            color: 'yellow',
            height: 300,

            scale: 1,

            middleLineWidth: 2,
            middleLineBackgroundColor: 'yellow',

            middleDotBorderWidth: 2,
            middleDotBorderColor: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: 'black'
        };

        this._options = options || {};
    }

    _createClass$1(Options, [{
        key: 'get',
        value: function get(name) {
            var value = this._options[name];
            return typeof value === 'undefined' ? this._defaultOptions[name] : value;
        }
    }, {
        key: 'set',
        value: function set(name, value) {
            this._options[name] = value;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            delete this._options;
        }
    }]);

    return Options;
}();

function getMinMax(arr) {
    var min = void 0,
        max = void 0;
    min = max = arr[0][1];
    for (var i = 0; i < arr.length; i++) {
        min = Math.min(min, arr[i][1]);
        max = Math.max(max, arr[i][1]);
    }

    return { min: min, max: max };
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
    function Manager(elem, options) {
        _classCallCheck$2(this, Manager);

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

    _createClass$2(Manager, [{
        key: 'bindEvents',
        value: function bindEvents() {
            var _this = this;

            this._onresize = function () {
                _this.resize();
            };

            this._onscroll = function () {
                _this.scroll();
            };

            this._elem.addEventListener('scroll', this._onscroll, false);
            window.addEventListener('resize', this._onresize, false);
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            this._elem.removeEventListener('scroll', this._onscroll, false);
            window.removeEventListener('resize', this._onresize, false);
        }
    }, {
        key: 'clearData',
        value: function clearData() {
            this._data = { series: [] };
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            this.removeAllBuffers();

            if (!data || !Array.isArray(data.series) || !data.series.length) {
                this.clearData();

                return;
            }

            this._data = data;
            this._dataWidth = this._data.series[0].length * this.options.get('scale');
            this._buffersContainer.style.width = this._dataWidth + 'px';

            var count = this.getCountBuffers();
            for (var i = 0; i < count; i++) {
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
    }, {
        key: 'draw',
        value: function draw() {
            var scrollLeft = this._elem.scrollLeft,
                x21 = scrollLeft - this._cachedAreaWidth,
                x22 = scrollLeft + this._cachedAreaWidth;

            this._buffers.forEach(function (buffer, num) {
                var x11 = buffer.left,
                    x12 = buffer.left + this._width;

                if (x11 > x21 && x11 < x22 || x12 > x21 && x12 < x22) {
                    !buffer.canvas && this.drawBuffer(buffer, num);
                } else {
                    this.removeBuffer(buffer);
                }
            }, this);
        }
    }, {
        key: 'drawBuffer',
        value: function drawBuffer(buffer, num) {
            var canvas = buffer.canvas;
            if (!canvas) {
                buffer.canvas = canvas = this.elems.create('buffer', 'canvas');
                canvas.width = buffer.width;
                canvas.height = buffer.height;
                canvas.style.left = buffer.left + 'px';
                this._buffersContainer.appendChild(canvas);
            }

            var ctx = buffer.canvas.getContext('2d'),
                scale = this.options.get('scale'),
                series = this._data.series[0];

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, buffer.width, buffer.height);
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 1;

            for (var i = 0; i < series.length; i++) {
                var x = i * scale - num * this._width,
                    y = this._height - series[i][1] * this._height / this._minMax.max;

                if (i) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }
            }

            ctx.stroke();
        }
    }, {
        key: 'removeBuffer',
        value: function removeBuffer(buffer) {
            if (buffer.canvas) {
                this._buffersContainer.removeChild(buffer.canvas);
                buffer.canvas = null;
            }
        }
    }, {
        key: 'removeAllBuffers',
        value: function removeAllBuffers() {
            this._buffers.forEach(function (buffer) {
                this.removeBuffer(buffer);
            }, this);

            this._buffers = [];
        }
    }, {
        key: 'getCountBuffers',
        value: function getCountBuffers() {
            var value = this._dataWidth / this._elem.offsetWidth,
                flooredValue = Math.floor(value);

            return value === flooredValue ? value : flooredValue + 1;
        }
    }, {
        key: 'scroll',
        value: function scroll() {
            this.draw();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = this._elem.offsetWidth,
                height = this._elem.offsetHeight;

            if (width !== this._width || height !== this._height) {
                this._width = width;
                this._height = height;
                this.update();
            }
        }
    }, {
        key: 'update',
        value: function update() {
            this.removeAllBuffers();
            this.draw();

            var padding = this._elem.offsetWidth / 2;
            this._buffersContainer.style.marginLeft = padding + 'px';
            this._buffersContainer.style.paddingRight = padding + 'px';
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.removeAllBuffers();
            this.unbindEvents();
        }
    }]);

    return Manager;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QChart = function () {
    /**
     *
     * @param {String|DOMElement} dom
     * @param {Object} options
     * @param {string} [options.height=300]
     * @param {string} [options.backgroundColor='#000']
     * @param {string} [options.color='#fff']
     */
    function QChart(dom, options) {
        _classCallCheck$3(this, QChart);

        dom = typeof dom === 'string' ? document.querySelector(dom) : dom;

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

    _createClass$3(QChart, [{
        key: 'setStyle',
        value: function setStyle(dom, propertyName, propertyValue) {
            if (typeof propertyValue === 'number') {
                propertyValue += 'px';
            }

            dom.style[propertyName] = propertyValue;
        }
    }, {
        key: 'createBody',
        value: function createBody() {
            this._info = this.elems.create('info');
            this.elems.append(this._info);

            var container = this.elems.create('container');
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
    }, {
        key: 'setData',
        value: function setData(data) {
            if (data.series.length) {
                this._dom.classList.remove('_has-data');
            } else {
                this._dom.classList.add('_has-data');
            }

            this.manager.setData(data);
        }
    }, {
        key: 'redraw',
        value: function redraw() {
            this.updateOptions();
            this.resize();
        }
    }, {
        key: 'updateOptions',
        value: function updateOptions() {
            ['backgroundColor', 'color'].forEach(function (option) {
                this.setStyle(this._dom, option, this.options.get(option));
            }, this);

            this.setStyle(this._manager, 'height', this.options.get('height'));
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.elems.destroy();
            this.options.destroy();

            delete this._dom;
        }
    }]);

    return QChart;
}();

return QChart;

})));
