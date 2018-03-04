/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.QChart = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function createElem(elemName, tag) {
    var elem = document.createElement(tag || 'div');
    elem.className = 'qchart__' + elemName;

    return elem;
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

function getMinMaxForSomeSeries(series) {
    var firstMinMax = getMinMax(series[0].data);
    var min = firstMinMax.min,
        max = firstMinMax.max;

    if (series.length > 1) {
        for (var i = 0; i < series.length; i++) {
            var minMax = getMinMax(series[i].data);
            min = Math.min(minMax.min, min);
            max = Math.max(minMax.max, max);
        }
    }

    return { min: min, max: max };
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Options = function () {
    function Options(options) {
        _classCallCheck(this, Options);

        this._defaultOptions = {
            backgroundColor: '#000', // black
            height: 300,
            lineWidth: 1,

            period: 'all',
            periods: [{ value: 'all', text: 'All' }, { value: 'year', text: 'Year', days: 365 }, { value: 'quarter', text: 'Quarter', days: 91 }, { value: 'month', text: 'Month', days: 30 }],

            middleLineWidth: 2,
            middleLineColor: '#FFD963', // yellow

            middleDotBorderWidth: 2,
            middleDotSize: 5,
            middleDotBackgroundColor: '#000', // black

            color: '#FFF', // white
            color0: '#FFD963', // yellow
            color1: '#FD5A3E', // red'
            color2: '#97CC64', // green
            color3: '#77B6E7', // blue
            color4: '#A955B8', // pink

            dateFormater: function dateFormater(timestamp) {
                var date = new Date(timestamp);

                function leadZero(num) {
                    return num > 9 ? num : '0' + num;
                }

                return [date.getFullYear(), leadZero(date.getMonth() + 1), leadZero(date.getDate())].join('-');
            },

            valueFormater: function valueFormater(value) {
                return value;
            }
        };

        this._options = options || {};
    }

    _createClass(Options, [{
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

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiddleDots = function () {
    function MiddleDots(main, options) {
        _classCallCheck$1(this, MiddleDots);

        this.$main = main;

        this.options = options;

        this.$dots = [];
    }

    _createClass$1(MiddleDots, [{
        key: 'create',
        value: function create(colors) {
            this.remove();

            for (var i = 0; i < colors.length; i++) {
                var dot = createElem('middle-dot');
                this.$main.appendChild(dot);
                this.$dots.push(dot);
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

            this.$dots.forEach(function (dot, i) {
                setStyle(dot, {
                    borderColor: colors[i] || this.options.get('color' + i),
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
            this.$dots.forEach(function (dot, i) {
                setStyle(dot, 'top', positions[i]);
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$dots.forEach(function (dot) {
                dot.parentNode.removeChild(dot);
            });

            this.$dots = [];
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.remove();

            delete this.options;
            delete this.$main;
        }
    }]);

    return MiddleDots;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CurrentValues = function () {
    function CurrentValues(main, options) {
        _classCallCheck$2(this, CurrentValues);

        this.$main = main;

        this.options = options;

        this.$values = [];
    }

    _createClass$2(CurrentValues, [{
        key: 'create',
        value: function create(colors) {
            this.remove();

            this.$date = createElem('current-date');
            this.$main.appendChild(this.$date);

            var values = createElem('current-values');
            this.$main.appendChild(values);

            for (var i = 0; i < colors.length; i++) {
                var value = createElem('current-value');
                values.appendChild(value);
                this.$values.push(value);
            }

            this.setStyle(colors);
        }
    }, {
        key: 'setStyle',
        value: function setStyle$$1(colors) {
            this.$values.forEach(function (value, i) {
                setStyle(value, 'color', colors[i] || this.options.get('color' + i));
            }, this);
        }
    }, {
        key: 'setValue',
        value: function setValue(timestamp, values) {
            this.$date.innerHTML = this.options.get('dateFormater')(timestamp);
            this.$values.forEach(function (item, i) {
                item.innerHTML = this.options.get('valueFormater')(values[i], i);
            }, this);
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$values.forEach(function (value) {
                value.parentNode.removeChild(value);
            });

            this.$values = [];
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.remove();

            delete this.options;
            delete this.$main;
        }
    }]);

    return CurrentValues;
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

        this.$dom = dom;
        this.$dom.classList.add('qchart');

        this.options = new Options(options);

        this._period = this.options.get('period');
        this._periods = this.options.get('periods');
        this._periodsByValue = {};
        this._periods.forEach(function (item) {
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

    _createClass$3(QChart, [{
        key: 'destroy',
        value: function destroy() {
            this._removeAllBuffers();
            this.unbindEvents();
            this.options.destroy();

            delete this.$dom;
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this = this;

            this._onresize = function () {
                _this.resize();
            };

            this._onscroll = function () {
                _this.scroll();
            };

            this._onclickperiod = function (e) {
                var period = e.target.dataset.value;
                period && _this.setPeriod(period);
            };

            if (this.$periods) {
                this.$periods.addEventListener('click', this._onclickperiod, false);
            }

            this.$manager.addEventListener('scroll', this._onscroll, false);
            window.addEventListener('resize', this._onresize, false);
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            this.$manager.removeEventListener('scroll', this._onscroll, false);
            window.removeEventListener('resize', this._onresize, false);
        }
    }, {
        key: '_createBody',
        value: function _createBody() {
            var current = createElem('current');
            this.$dom.appendChild(current);
            this.$current = new CurrentValues(current, this.options);

            var container = createElem('container');
            this.$dom.appendChild(container);

            this.$middleLine = createElem('middle-line');
            container.appendChild(this.$middleLine);

            var middleDots = createElem('middle-dots');
            container.appendChild(middleDots);
            this.$middleDots = new MiddleDots(middleDots, this.options);

            this.$manager = createElem('manager');
            container.appendChild(this.$manager);

            this.$buffersContainer = createElem('buffers-container');
            this.$manager.appendChild(this.$buffersContainer);

            var optionsPeriods = this.options.get('periods');
            if (optionsPeriods) {
                this.$periods = createElem('periods');
                this.options.get('periods').forEach(function (item) {
                    var elem = createElem('period');
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
    }, {
        key: 'clearData',
        value: function clearData() {
            this.setData({ series: [] });
        }
    }, {
        key: 'setData',
        value: function setData(data) {
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

            var series = this._data.series;
            var colors = series.map(function (item, i) {
                return this.options.get('color' + i);
            }, this);

            this.$middleDots.create(colors);
            this.$current.create(colors);

            setStyle(this.$dom, 'color', this.options.get('color' + (series.length === 1 ? '0' : '')));

            this._addBuffers();

            this._minMax = getMinMaxForSomeSeries(series);

            this.draw();
        }
    }, {
        key: 'draw',
        value: function draw() {
            var scrollLeft = this.$manager.scrollLeft,
                x21 = scrollLeft - this._cachedAreaWidth,
                x22 = scrollLeft + this._cachedAreaWidth;

            this._buffers.forEach(function (buffer, num) {
                var x11 = buffer.left,
                    x12 = buffer.left + this._width;

                if (x11 > x21 && x11 < x22 || x12 > x21 && x12 < x22) {
                    !buffer.canvas && this._drawBuffer(buffer, num);
                } else {
                    this._removeBuffer(buffer);
                }
            }, this);

            var index = Math.floor((scrollLeft + this._width / 2 - this._padding) / this._getScale());
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

            this.$middleDots.setTop(dots);

            var timestamp = void 0;
            var values = this._data.series.map(function (item) {
                var lastIndex = item.data.length - 1;
                var itemIndex = index;
                if (itemIndex > lastIndex) {
                    itemIndex = lastIndex;
                }

                timestamp = item.data[itemIndex][0];

                return item.data[itemIndex][1];
            }, this);

            this.$current.setValue(timestamp, values);
        }
    }, {
        key: '_drawBuffer',
        value: function _drawBuffer(buffer, bufferNum) {
            var canvas = buffer.canvas;
            if (!canvas) {
                buffer.canvas = canvas = createElem('buffer', 'canvas');
                canvas.width = buffer.width;
                canvas.height = buffer.height;
                canvas.style.left = buffer.left + 'px';
                this.$buffersContainer.appendChild(canvas);
            }

            var ctx = buffer.canvas.getContext('2d'),
                scale = this._getScale();

            ctx.fillStyle = this.options.get('backgroundColor');
            ctx.fillRect(0, 0, buffer.width, buffer.height);
            ctx.lineWidth = this.options.get('lineWidth');

            for (var n = 0; n < this._data.series.length; n++) {
                var series = this._data.series[n].data;

                ctx.strokeStyle = series.color || this.options.get('color' + n);
                ctx.beginPath();

                for (var i = 0; i < series.length; i++) {
                    var x = i * scale - bufferNum * this._width,
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
    }, {
        key: '_calcY',
        value: function _calcY(value) {
            return this._height - value * this._height / this._minMax.max;
        }
    }, {
        key: '_addBuffers',
        value: function _addBuffers() {
            var count = this._getCountBuffers();
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
        key: '_removeBuffer',
        value: function _removeBuffer(buffer) {
            if (buffer.canvas) {
                this.$buffersContainer.removeChild(buffer.canvas);
                buffer.canvas = null;
            }
        }
    }, {
        key: '_removeAllBuffers',
        value: function _removeAllBuffers() {
            this._buffers.forEach(function (buffer) {
                this._removeBuffer(buffer);
            }, this);

            this._buffers = [];
        }
    }, {
        key: '_getCountBuffers',
        value: function _getCountBuffers() {
            var value = this._dataWidth / this.$manager.offsetWidth,
                flooredValue = Math.floor(value);

            return value === flooredValue ? value : flooredValue + 1;
        }
    }, {
        key: 'updateOptions',
        value: function updateOptions() {
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
    }, {
        key: 'setPeriod',
        value: function setPeriod(name) {
            if (name === this._period) {
                return;
            }

            this._period = name;

            var wasSelected = this.$periods.querySelector('._selected');
            wasSelected && wasSelected.classList.remove('_selected');

            var selected = this.$periods.querySelector('._value_' + name);
            selected && selected.classList.add('_selected');

            this._updateDataWidth();
            this.update();
        }
    }, {
        key: 'scroll',
        value: function scroll() {
            this.draw();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = this.$manager.offsetWidth,
                height = this.$manager.offsetHeight;

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
            this._removeAllBuffers();
            this._addBuffers();
            this.draw();
        }
    }, {
        key: '_getScale',
        value: function _getScale() {
            var width = this.$manager.offsetWidth;
            if (this._period === 'all') {
                return width / this._data.series[0].data.length;
            }

            return width / this._periodsByValue[this._period].days;
        }
    }, {
        key: '_updatePadding',
        value: function _updatePadding() {
            this._padding = this.$manager.offsetWidth / 2;
            this.$buffersContainer.style.marginLeft = this._padding + 'px';
            this.$buffersContainer.style.paddingRight = this._padding + 'px';
        }
    }, {
        key: '_updateDataWidth',
        value: function _updateDataWidth() {
            this._dataWidth = this._data.series[0].data.length * this._getScale();
            this.$buffersContainer.style.width = this._dataWidth + 'px';
        }
    }]);

    return QChart;
}();

return QChart;

})));
