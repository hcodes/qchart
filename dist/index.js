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
        this._main = main;
    }

    _createClass(Elems, [{
        key: 'create',
        value: function create(elemName, tag) {
            var elem = document.createElement(tag || 'div');
            elem.className = this.name + (elemName ? '__' + elemName : '');

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
            backgroundColor: '#000', // black
            color: '#FFD963', // yellow
            height: 300,

            scale: 1,

            middleLineWidth: 2,
            middleLineColor: '#FFD963', // yellow

            middleDotBorderWidth: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: '#000', // black
            middleDotBorderColor1: '#FFD963', // yellow
            middleDotBorderColor2: '#FD5A3E', // red'
            middleDotBorderColor3: '#97CC64', // green
            middleDotBorderColor4: '#77B6E7', // blue
            middleDotBorderColor5: '#A955B8' // pink
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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



function setStyleForElem(dom, propertyName, propertyValue) {
    if (typeof propertyValue === 'number') {
        propertyValue += 'px';
    }

    dom.style[propertyName] = propertyValue;
}

function setStyle(dom, propertyName, propertyValue) {
    if ((typeof propertyName === 'undefined' ? 'undefined' : _typeof(propertyName)) === 'object') {
        Object.keys(propertyName).forEach(function (key) {
            setStyleForElem(dom, key, propertyName[key]);
        });
    } else {
        setStyleForElem(dom, propertyName, propertyValue);
    }
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiddleDots = function () {
    function MiddleDots(main, options) {
        _classCallCheck$2(this, MiddleDots);

        this._main = main;

        this.elems = new Elems(main);
        this.options = options;

        this._dots = [];
    }

    _createClass$2(MiddleDots, [{
        key: 'create',
        value: function create(colors) {
            this.remove();

            for (var i = 0; i < colors.length; i++) {
                var dot = this.elems.create('middle-dot');
                this._main.appendChild(dot);
                this._dots.push(dot);
            }

            this.setStyle(colors);
        }
    }, {
        key: 'setStyle',
        value: function setStyle$$1(colors) {
            var size = this.options.get('middleDotSize'),
                margin = -this.options.get('middleDotSize') / 2 - this.options.get('middleDotBorderWidth'),
                backgroundColor = this.options.get('middleDotBackgroundColor'),
                borderWidth = this.options.get('middleDotBorderWidth');

            this._dots.forEach(function (dot, i) {
                setStyle(dot, {
                    borderColor: colors[i] || this.options.get('middleDotBorderColor') || this.options.get('middleDotBorderColor' + i),
                    borderWidth: borderWidth,
                    backgroundColor: backgroundColor,
                    marginLeft: margin,
                    marginTop: margin,
                    width: size,
                    height: size
                });
            }, this);
        }
    }, {
        key: 'setTop',
        value: function setTop(positions) {
            this._dots.forEach(function (dot, i) {
                setStyle(dot, 'top', positions[i]);
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            this._dots.forEach(function (dot) {
                dot.parentNode.removeChild(dot);
            });

            this._dots = [];
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.remove();

            this.elems.destroy();
            delete this.elems;

            delete this.options;

            delete this._main;
        }
    }]);

    return MiddleDots;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QChart = function () {
    /**
     * @param {String|DOMElement} dom
     * @param {Object} options
     */
    function QChart(dom, options) {
        _classCallCheck$3(this, QChart);

        dom = typeof dom === 'string' ? document.querySelector(dom) : dom;

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

    _createClass$3(QChart, [{
        key: 'bindEvents',
        value: function bindEvents() {
            var _this = this;

            this._onresize = function () {
                _this.resize();
            };

            this._onscroll = function () {
                _this.scroll();
            };

            this._manager.addEventListener('scroll', this._onscroll, false);
            window.addEventListener('resize', this._onresize, false);
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            this._manager.removeEventListener('scroll', this._onscroll, false);
            window.removeEventListener('resize', this._onresize, false);
        }
    }, {
        key: 'createBody',
        value: function createBody() {
            var elems = this.elems;

            this._info = elems.create('info');
            elems.append(this._info);

            var container = elems.create('container');
            elems.append(container);

            this._middleLine = elems.create('middle-line');
            setStyle(this._middleLine, {
                backgroundColor: this.options.get('middleLineColor'),
                width: this.options.get('middleLineWidth'),
                marginLeft: -this.options.get('middleLineWidth') / 2
            });
            elems.append(this._middleLine, container);

            var middleDots = elems.create('middle-dots');
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
    }, {
        key: 'clearData',
        value: function clearData() {
            this._data = { series: [] };
        }
    }, {
        key: 'redraw',
        value: function redraw() {
            this.updateOptions();
            this.resize();
        }
    }, {
        key: 'setData',
        value: function setData(data) {
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

            var colors = this._data.series.map(function (item, i) {
                return this.options.get('middleDotBorderColor' + i);
            }, this);

            this._middleDots.create(colors);

            this.addBuffers();

            this._minMax = getMinMax(this._data.series[0].data);

            this.draw();
        }
    }, {
        key: 'draw',
        value: function draw() {
            var scrollLeft = this._manager.scrollLeft,
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

            var index = Math.floor((scrollLeft + this._width / 2 - this._padding) / this.options.get('scale'));
            if (index < 0) {
                index = 0;
            }

            var dots = this._data.series.map(function (item) {
                var lastIndex = item.data.length - 1;
                var itemIndex = index;
                if (itemIndex > lastIndex) {
                    itemIndex = lastIndex;
                }

                return this._calcY(item.data[itemIndex][1]);
            }, this);

            this._middleDots.setTop(dots);
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
                series = this._data.series[0].data;

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, buffer.width, buffer.height);
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 1;

            for (var i = 0; i < series.length; i++) {
                var x = i * scale - num * this._width,
                    y = this._calcY(series[i][1]);

                if (i) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }
            }

            ctx.stroke();
        }
    }, {
        key: '_calcY',
        value: function _calcY(value) {
            return this._height - value * this._height / this._minMax.max;
        }
    }, {
        key: 'addBuffers',
        value: function addBuffers() {
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
            var value = this._dataWidth / this._manager.offsetWidth,
                flooredValue = Math.floor(value);

            return value === flooredValue ? value : flooredValue + 1;
        }
    }, {
        key: 'updateOptions',
        value: function updateOptions() {
            setStyle(this._dom, {
                backgroundColor: this.options.get('backgroundColor'),
                color: this.options.get('color')
            });

            setStyle(this._manager, 'height', this.options.get('height'));

            this._updatePadding();
        }
    }, {
        key: 'scroll',
        value: function scroll() {
            this.draw();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = this._manager.offsetWidth,
                height = this._manager.offsetHeight;

            if (width !== this._width || height !== this._height) {
                this._width = width;
                this._height = height;
                this.update();
            }
        }
    }, {
        key: 'update',
        value: function update() {
            this._updatePadding();
            this.removeAllBuffers();
            this.addBuffers();
            this.draw();
        }
    }, {
        key: '_updatePadding',
        value: function _updatePadding() {
            this._padding = this._manager.offsetWidth / 2;
            this._buffersContainer.style.marginLeft = this._padding + 'px';
            this._buffersContainer.style.paddingRight = this._padding + 'px';
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.removeAllBuffers();
            this.unbindEvents();

            this.elems.destroy();
            this.options.destroy();

            delete this._dom;
        }
    }]);

    return QChart;
}();

return QChart;

})));
