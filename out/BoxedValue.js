"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxedValue = void 0;
var BoxedValue = /** @class */ (function () {
    function BoxedValue(initialValue) {
        this._lastModificationDate = new Date();
        this._valueContainer = {};
        //this.lastDate = new Date()
        if (initialValue !== undefined) {
            this._valueContainer = { value: initialValue };
        }
    }
    Object.defineProperty(BoxedValue.prototype, "hasValue", {
        get: function () {
            //console.log('BoxedValue hasValue=', 'value' in this._valueContainer, this._valueContainer)
            return 'value' in this._valueContainer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoxedValue.prototype, "isEmpty", {
        get: function () {
            return !this.hasValue;
        },
        enumerable: false,
        configurable: true
    });
    BoxedValue.prototype.set = function (value) {
        this._valueContainer = { value: value };
        this._lastModificationDate = new Date();
    };
    BoxedValue.prototype.setByPrevious = function (action) {
        this.set(action(this.getOrUndefined()));
    };
    /**
     * Returns value if exists else throws error
     */
    BoxedValue.prototype.getOrThrow = function () {
        if ('value' in this._valueContainer) {
            return this._valueContainer.value;
        }
        throw new Error('no value in BoxedValue');
    };
    /**
     * Returns value if exists else undefined
     */
    BoxedValue.prototype.getOrUndefined = function () {
        if ('value' in this._valueContainer) {
            return this._valueContainer.value;
        }
        return undefined;
    };
    BoxedValue.prototype.deleteValue = function () {
        this._valueContainer = {};
    };
    Object.defineProperty(BoxedValue.prototype, "lastModifactionDate", {
        get: function () {
            return this._lastModificationDate;
        },
        enumerable: false,
        configurable: true
    });
    return BoxedValue;
}());
exports.BoxedValue = BoxedValue;
