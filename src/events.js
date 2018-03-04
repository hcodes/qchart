export default class Events {
    constructor() {
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
    on(type, callback) {
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
    off(type, callback) {
        const buffer = this._eventBuffer;

        for (let i = 0; i < buffer.length; i++) {
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
    trigger(type, data) {
        const buffer = this._eventBuffer;

        for (let i = 0; i < buffer.length; i++) {
            if (type === buffer[i].type) {
                buffer[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    }

    /**
     * Destroy.
     */
    destroy() {
        delete this._eventBuffer;
    }
}
