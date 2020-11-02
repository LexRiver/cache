"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedVariable = void 0;
var async_1 = require("@lexriver/async");
var type_event_1 = require("@lexriver/type-event");
var BoxedValue_1 = require("./BoxedValue");
/**
 * Returns cached value if available.
 * Cached value becomes undefined by timer after assign.
 * On `get` request it will be async updated if not assign
 */
var CachedVariable = /** @class */ (function () {
    function CachedVariable(p) {
        this.p = p;
        this.onDisposeEvent = new type_event_1.TypeEvent();
        this.valueB = new BoxedValue_1.BoxedValue();
        this.isUpdatingNow = false;
        if (p.maxAgeInMilliseconds <= 0)
            throw new Error("Wrong maxAgeInSeconds=" + p.maxAgeInMilliseconds);
        if (p.initialValue !== undefined) {
            this.valueB.set(p.initialValue);
        }
        //if(!p.updateFunction) throw new Error('No updateFunction')
        if (!p.useLazyUpdate) {
            this.startUpdateByTimer();
        }
    }
    CachedVariable.prototype.startUpdateByTimer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateAsync()
                        //await Async.waitMsAsync(this.p.maxAgeInMilliseconds-1)
                    ];
                    case 1:
                        _a.sent();
                        //await Async.waitMsAsync(this.p.maxAgeInMilliseconds-1)
                        setTimeout(function () {
                            _this.startUpdateByTimer();
                        }, this.p.maxAgeInMilliseconds - 1);
                        return [2 /*return*/];
                }
            });
        });
    };
    CachedVariable.prototype.setUpdateFunction = function (updateFunctionAsync) {
        this.p.updateFunction = updateFunctionAsync;
    };
    /**
     * returns cached value if possible or executes updateFunctionAsync to get a new value
     */
    CachedVariable.prototype.getAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.valueB.isEmpty) return [3 /*break*/, 4];
                        if (!!this.isUpdatingNow) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateAsync()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.waitForUpdate()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: 
                    //if(this.value === undefined) throw new Error('undefined result in cached variable')
                    return [2 /*return*/, this.valueB.getOrThrow()];
                }
            });
        });
    };
    CachedVariable.prototype.waitForUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var waitMs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waitMs = 2;
                        _a.label = 1;
                    case 1:
                        if (!this.isUpdatingNow) return [3 /*break*/, 3];
                        return [4 /*yield*/, async_1.Async.waitMsAsync(waitMs)];
                    case 2:
                        _a.sent();
                        if (waitMs < 10 * 1000) {
                            waitMs *= 2;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CachedVariable.prototype.updateAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, x_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.isUpdatingNow = true;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _b = (_a = this.valueB).set;
                        return [4 /*yield*/, this.p.updateFunction(this.valueB.getOrUndefined())];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        this.isUpdatingNow = false;
                        if (this.p.useLazyUpdate) {
                            this.disposeValueByTimer();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        x_1 = _c.sent();
                        console.error('CachedVariable: error while updating', x_1);
                        throw x_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CachedVariable.prototype.updateWithValueAsync = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitForUpdate()];
                    case 1:
                        _a.sent();
                        this.valueB.set(value);
                        this.disposeValueByTimer();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * clears cache and load new value (if not lazyUpdate)
     */
    CachedVariable.prototype.clearCacheAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitForUpdate()];
                    case 1:
                        _a.sent();
                        this.valueB.deleteValue();
                        this.onDisposeEvent.triggerAsync();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachedVariable.prototype.disposeValueByTimer = function () {
        var _this = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            //console.log('removing variable from memory by timeout')
            _this.clearCacheAsync();
        }, this.p.maxAgeInMilliseconds);
        //console.log('setting timer', this.timer)
    };
    Object.defineProperty(CachedVariable.prototype, "hasValue", {
        get: function () {
            return this.valueB.hasValue;
        },
        enumerable: false,
        configurable: true
    });
    return CachedVariable;
}());
exports.CachedVariable = CachedVariable;
