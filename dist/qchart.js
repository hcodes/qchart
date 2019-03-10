/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.QChart = factory());
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

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
  if (_typeof(propertyName) === 'object') {
    Object.keys(propertyName).forEach(function (key) {
      setStyleForElem(dom, key, propertyName[key]);
    });
  } else {
    setStyleForElem(dom, propertyName, propertyValue);
  }
}

function getMinMax(arr, from, to) {
  var min, max;
  min = max = arr[from][1];

  for (var i = from; i < to; i++) {
    min = Math.min(min, arr[i][1]);
    max = Math.max(max, arr[i][1]);
  }

  return {
    min: min,
    max: max
  };
}
function getMinMaxForSomeSeries(series, from, to) {
  var firstMinMax = getMinMax(series[0].data, from, to);
  var min = firstMinMax.min,
      max = firstMinMax.max;

  if (series.length > 1) {
    for (var i = 0; i < series.length; i++) {
      var minMax = getMinMax(series[i].data, from, to);
      min = Math.min(minMax.min, min);
      max = Math.max(minMax.max, max);
    }
  }

  return {
    min: min,
    max: max
  };
}
function inRange(x11, x12, x21, x22) {
  return x11 > x21 && x11 < x22 || x12 > x21 && x12 < x22;
}

var Events =
/*#__PURE__*/
function () {
  function Events() {
    _classCallCheck(this, Events);

    this._eventBuffer = [];
  }
  /**
   * Attach a handler to an custom event.
   *
   * @param {string} type
   * @param {Function} callback
   *
   * @returns {Events} this
   */


  _createClass(Events, [{
    key: "on",
    value: function on(type, callback) {
      if (type && callback) {
        this._eventBuffer.push({
          type: type,
          callback: callback
        });
      }

      return this;
    }
    /**
     * Remove a previously-attached custom event handler.
     *
     * @param {string} type
     * @param {Function} callback
     *
     * @returns {Events} this
     */

  }, {
    key: "off",
    value: function off(type, callback) {
      var buffer = this._eventBuffer;

      for (var i = 0; i < buffer.length; i++) {
        if (callback === buffer[i].callback && type === buffer[i].type) {
          buffer.splice(i, 1);
          i--;
        }
      }

      return this;
    }
    /**
     * Execute all handlers for the given event type.
     * @param {string} type
     * @param {*} [data]
     *
     * @returns {Event} this
     */

  }, {
    key: "trigger",
    value: function trigger(type, data) {
      var buffer = this._eventBuffer;

      for (var i = 0; i < buffer.length; i++) {
        if (type === buffer[i].type) {
          buffer[i].callback.call(this, {
            type: type
          }, data);
        }
      }

      return this;
    }
    /**
     * Destroy.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      delete this._eventBuffer;
    }
  }]);

  return Events;
}();

var Options =
/*#__PURE__*/
function () {
  function Options(options) {
    _classCallCheck(this, Options);

    this._defaultOptions = {
      backgroundColor: '#000',
      // black
      height: 300,
      lineWidth: 1,
      scrollAlign: 'right',
      period: 'all',
      periods: [{
        value: 'all',
        text: 'All'
      }, {
        value: 'year',
        text: 'Year',
        days: 365
      }, {
        value: 'quarter',
        text: 'Quarter',
        days: 91
      }, {
        value: 'month',
        text: 'Month',
        days: 30
      }],
      middleLineWidth: 2,
      middleLineColor: '#FFD963',
      // yellow
      middleDotBorderWidth: 2,
      middleDotSize: 5,
      middleDotBackgroundColor: '#000',
      // black
      color: '#FFF',
      // white
      color0: '#FFD963',
      // yellow
      color1: '#FD5A3E',
      // red'
      color2: '#97CC64',
      // green
      color3: '#77B6E7',
      // blue
      color4: '#A955B8',
      // pink
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
    key: "get",
    value: function get(name) {
      var value = this._options[name];
      return typeof value === 'undefined' ? this._defaultOptions[name] : value;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this._options[name] = value;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      delete this._options;
    }
  }]);

  return Options;
}();

var MiddleDots =
/*#__PURE__*/
function () {
  function MiddleDots(main, options) {
    _classCallCheck(this, MiddleDots);

    this.$main = main;
    this.options = options;
    this.$dots = [];
  }

  _createClass(MiddleDots, [{
    key: "create",
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
    key: "setStyle",
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
    key: "setTop",
    value: function setTop(positions) {
      this.$dots.forEach(function (dot, i) {
        setStyle(dot, 'top', positions[i]);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      this.$dots.forEach(function (dot) {
        dot.parentNode.removeChild(dot);
      });
      this.$dots = [];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.remove();
      delete this.options;
      delete this.$main;
    }
  }]);

  return MiddleDots;
}();

var CurrentValues =
/*#__PURE__*/
function () {
  function CurrentValues(main, options) {
    _classCallCheck(this, CurrentValues);

    this.$main = main;
    this.options = options;
    this._values = [];
  }

  _createClass(CurrentValues, [{
    key: "create",
    value: function create(colors) {
      this.remove();
      this.$date = createElem('current-date');
      this.$main.appendChild(this.$date);
      var $values = createElem('current-values');
      this.$main.appendChild($values);

      for (var i = 0; i < colors.length; i++) {
        var value = createElem('current-value');
        $values.appendChild(value);

        this._values.push(value);
      }

      this.setStyle(colors);
    }
  }, {
    key: "setStyle",
    value: function setStyle$$1(colors) {
      var _this = this;

      this._values.forEach(function (value, i) {
        setStyle(value, 'color', colors[i] || _this.options.get('color' + i));
      });
    }
  }, {
    key: "setValues",
    value: function setValues(values, timestamp) {
      var _this2 = this;

      this._values.forEach(function (item, i) {
        item.innerHTML = _this2.options.get('valueFormater')(values[i], i);
      });

      this.$date.innerHTML = this.options.get('dateFormater')(timestamp);
    }
  }, {
    key: "remove",
    value: function remove() {
      this._values.forEach(function (value) {
        return value.parentNode.removeChild(value);
      });

      this._values = [];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.remove();
      delete this._values;
      delete this.options;
      delete this.$main;
    }
  }]);

  return CurrentValues;
}();

var QChart =
/*#__PURE__*/
function (_Events) {
  _inherits(QChart, _Events);

  /**
   * @param {String|DOMElement} dom
   * @param {Object} options
   * @see options.js
   */
  function QChart(dom, options) {
    var _this;

    _classCallCheck(this, QChart);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QChart).call(this));
    dom = typeof dom === 'string' ? document.querySelector(dom) : dom;

    if (!dom) {
      return _possibleConstructorReturn(_this);
    }

    _this.$dom = dom;

    _this.$dom.classList.add('qchart');

    _this.options = new Options(options);
    _this._period = _this.options.get('period');
    _this._periodsByValue = (_this.options.get('periods') || []).reduce(function (prev, item) {
      prev[item.value] = item;
      return prev;
    }, {});

    _this._createBody();

    _this.updateOptions();

    _this._data = _this._getEmptyData();
    _this._buffers = [];
    _this._buffersWidth = _this.$buffers.offsetWidth;
    _this._buffersHeight = _this.$buffers.offsetHeight;
    _this._cachedAreaWidth = _this._buffersWidth * 1.1;

    _this._bindEvents();

    return _this;
  }

  _createClass(QChart, [{
    key: "destroy",
    value: function destroy() {
      this._removeAllBuffers();

      this._unbindEvents();

      this.options.destroy();

      this._middleDots.destroy();

      this._currentValues.destroy();

      delete this.$periods;
      this.$dom.innerHTML = '';
      delete this.$dom;
    }
  }, {
    key: "_getEmptyData",
    value: function _getEmptyData() {
      return {
        series: []
      };
    }
  }, {
    key: "clearData",
    value: function clearData() {
      this.setData(this._getEmptyData());
    }
  }, {
    key: "setData",
    value: function setData(data) {
      var _this2 = this;

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

      var series = this._data.series;
      var colors = series.map(function (item, i) {
        return item.color || _this2.options.get('color' + i);
      });

      this._middleDots.create(colors);

      this._currentValues.create(colors);

      setStyle(this.$dom, 'color', this.options.get('color' + (series.length === 1 ? '0' : '')));

      this._addBuffers();

      this._minMax = getMinMaxForSomeSeries(series);
      this.draw();
    }
  }, {
    key: "setPeriod",
    value: function setPeriod(name) {
      if (name === this._period) {
        return;
      }

      this.trigger('changeperiod', name);
      this._period = name;
      var wasSelected = this.$periods.querySelector('._selected');
      wasSelected && wasSelected.classList.remove('_selected');
      var selected = this.$periods.querySelector('._value_' + name);
      selected && selected.classList.add('_selected');
      this.update();
    }
  }, {
    key: "resize",
    value: function resize() {
      var width = this.$buffers.offsetWidth,
          height = this.$buffers.offsetHeight;

      if (width !== this._buffersWidth || height !== this._buffersHeight) {
        this._buffersWidth = width;
        this._bufferHeight = height;
        this.update();
        this.trigger('resize');
      }
    }
  }, {
    key: "scroll",
    value: function scroll() {
      this.draw();
      this.trigger('scroll');
    }
  }, {
    key: "updateOptions",
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
      setStyle(this.$buffers, 'height', this.options.get('height'));

      this._updateBuffersPadding();
    }
  }, {
    key: "update",
    value: function update() {
      this._updateDataWidth();

      this._updateBuffersPadding();

      this._removeAllBuffers();

      this._addBuffers();

      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this3 = this;

      var scrollLeft = this.$buffers.scrollLeft,
          series = this._data.series;

      this._buffers.forEach(function (buffer, num) {
        if (inRange(buffer.left, buffer.left + this._buffersWidth, scrollLeft - this._cachedAreaWidth, scrollLeft + this._cachedAreaWidth)) {
          //!buffer.canvas && this._drawBuffer(buffer, num);
          this._drawBuffer(buffer, num);
        } else {
          this._removeBuffer(buffer);
        }
      }, this);

      var index = Math.floor((scrollLeft + this._buffersWidth / 2 - this._buffersPadding) / this._getScale());

      if (index < 0) {
        index = 0;
      }

      var timestamp;
      var values = series.map(function (item) {
        var lastIndex = item.data.length - 1;
        var itemIndex = index;

        if (itemIndex > lastIndex) {
          itemIndex = lastIndex;
        }

        timestamp = item.data[itemIndex][0];
        return item.data[itemIndex][1];
      });

      this._currentValues.setValues(values, timestamp);

      this._middleDots.setTop(values.map(function (item) {
        return _this3._calcY(item);
      }));
    }
  }, {
    key: "_drawBuffer",
    value: function _drawBuffer(buffer, bufferNum) {
      var canvas = buffer.canvas;

      if (!canvas) {
        buffer.canvas = canvas = createElem('buffer', 'canvas');
        canvas.width = buffer.width;
        canvas.height = buffer.height;
        setStyle(canvas, 'left', buffer.left);
        this.$buffersContainer.appendChild(canvas);
      }

      var ctx = buffer.canvas.getContext('2d'),
          scale = this._getScale();

      ctx.fillStyle = this.options.get('backgroundColor');
      ctx.fillRect(0, 0, buffer.width, buffer.height);
      ctx.lineWidth = this.options.get('lineWidth');
      var from = Math.floor((this.$buffers.scrollLeft - this.$buffers.offsetWidth / 2) / this._getScale()),
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

      for (var n = 0; n < this._data.series.length; n++) {
        var series = this._data.series[n].data;
        ctx.strokeStyle = series.color || this.options.get('color' + n);
        ctx.beginPath();

        for (var i = 0; i < series.length; i++) {
          var x = i * scale - bufferNum * this._buffersWidth,
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
  }, {
    key: "_createBody",
    value: function _createBody() {
      var current = createElem('current');
      this.$dom.appendChild(current);
      this._currentValues = new CurrentValues(current, this.options);
      var container = createElem('container');
      this.$dom.appendChild(container);
      this.$middleLine = createElem('middle-line');
      container.appendChild(this.$middleLine);
      var middleDots = createElem('middle-dots');
      container.appendChild(middleDots);
      this._middleDots = new MiddleDots(middleDots, this.options);
      this.$buffers = createElem('buffers');
      container.appendChild(this.$buffers);
      this.$buffersContainer = createElem('buffers-container');
      this.$buffers.appendChild(this.$buffersContainer);

      this._createPeriods();
    }
  }, {
    key: "_createPeriods",
    value: function _createPeriods() {
      var _this4 = this;

      var optionsPeriods = this.options.get('periods');

      if (optionsPeriods) {
        this.$periods = createElem('periods');
        optionsPeriods.forEach(function (item) {
          var elem = createElem('period');
          elem.dataset.value = item.value;
          elem.innerHTML = item.text;
          elem.classList.add('_value_' + item.value);

          if (_this4._period === item.value) {
            elem.classList.add('_selected');
          }

          _this4.$periods.appendChild(elem);
        });
        this.$dom.appendChild(this.$periods);
      }
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this5 = this;

      this._onresize = this.resize.bind(this);
      this._onscroll = this.scroll.bind(this);

      this._onclickperiod = function (e) {
        var period = e.target.dataset.value;
        period && _this5.setPeriod(period);
      };

      this.$periods && this.$periods.addEventListener('click', this._onclickperiod, false);
      this.$buffers.addEventListener('scroll', this._onscroll, false);
      window.addEventListener('resize', this._onresize, false);
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this.$periods && this.$periods.removeEventListener('click', this._onclickperiod, false);
      this.$buffers.removeEventListener('scroll', this._onscroll, false);
      window.removeEventListener('resize', this._onresize, false);
    }
  }, {
    key: "_calcY",
    value: function _calcY(value) {
      return this._buffersHeight - value * this._buffersHeight / this._minMax.max;
    }
  }, {
    key: "_addBuffers",
    value: function _addBuffers() {
      var count = this._getCountBuffers();

      for (var i = 0; i < count; i++) {
        this._buffers.push({
          left: i * this._buffersWidth,
          width: this._buffersWidth,
          height: this._buffersHeight,
          canvas: null
        });
      }

      this._buffers[count - 1].width = this._dataWidth - (count - 1) * this._buffersWidth;
    }
  }, {
    key: "_removeBuffer",
    value: function _removeBuffer(buffer) {
      if (buffer.canvas) {
        this.$buffersContainer.removeChild(buffer.canvas);
        buffer.canvas = null;
      }
    }
  }, {
    key: "_removeAllBuffers",
    value: function _removeAllBuffers() {
      this._buffers.forEach(function (buffer) {
        this._removeBuffer(buffer);
      }, this);

      this._buffers = [];
    }
  }, {
    key: "_getCountBuffers",
    value: function _getCountBuffers() {
      var value = this._dataWidth / this.$buffers.offsetWidth,
          flooredValue = Math.floor(value);
      return value === flooredValue ? value : flooredValue + 1;
    }
  }, {
    key: "_getScale",
    value: function _getScale() {
      var width = this.$buffers.offsetWidth;

      if (this._period === 'all') {
        return width / this._data.series[0].data.length;
      }

      return width / this._periodsByValue[this._period].days;
    }
  }, {
    key: "_updateBuffersPadding",
    value: function _updateBuffersPadding() {
      this._buffersPadding = this.$buffers.offsetWidth / 2;
      setStyle(this.$buffersContainer, {
        marginLeft: this._buffersPadding,
        paddingRight: this._buffersPadding
      });
    }
  }, {
    key: "_updateDataWidth",
    value: function _updateDataWidth() {
      this._dataWidth = (this._data.series[0].data.length - 1) * this._getScale() || 1;
      setStyle(this.$buffersContainer, 'width', this._dataWidth);
    }
  }, {
    key: "_updateScrollAlign",
    value: function _updateScrollAlign() {
      var align = this.options.get('scrollAlign');
      this.$buffers.scrollLeft = align === 'right' ? this.$buffersContainer.offsetWidth + this._buffersPadding * 2 - this.$buffers.offsetWidth : 0;
    }
  }]);

  return QChart;
}(Events);

return QChart;

})));
