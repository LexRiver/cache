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
var CachedVariable_1 = require("./CachedVariable");
var async_1 = require("@lexriver/async");
test('CachedVariable', function () { return __awaiter(void 0, void 0, void 0, function () {
    var c, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                c = new CachedVariable_1.CachedVariable({
                    maxAgeInMilliseconds: 500,
                    initialValue: 'a',
                    updateFunction: function (x) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                //console.log('-- calling updateFunction')
                                return [4 /*yield*/, async_1.Async.waitMsAsync(200)];
                                case 1:
                                    //console.log('-- calling updateFunction')
                                    _a.sent();
                                    x = x + '!';
                                    //console.log('-- returning new value:', x)
                                    return [2 /*return*/, x];
                            }
                        });
                    }); },
                });
                _a = expect;
                return [4 /*yield*/, c.getAsync()];
            case 1:
                _a.apply(void 0, [_e.sent()]).toEqual('a');
                _b = expect;
                return [4 /*yield*/, c.getAsync()];
            case 2:
                _b.apply(void 0, [_e.sent()]).toEqual('a');
                return [4 /*yield*/, async_1.Async.waitMsAsync(501)];
            case 3:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, c.getAsync()];
            case 4:
                _c.apply(void 0, [_e.sent()]).toEqual('a!');
                return [4 /*yield*/, async_1.Async.waitMsAsync(503)];
            case 5:
                _e.sent();
                _d = expect;
                return [4 /*yield*/, c.getAsync()];
            case 6:
                _d.apply(void 0, [_e.sent()]).toEqual('a!!');
                return [2 /*return*/];
        }
    });
}); });
test('CachedVariable without lazyUpdate - clear cache', function () { return __awaiter(void 0, void 0, void 0, function () {
    var x, c, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                x = 5;
                c = new CachedVariable_1.CachedVariable({ maxAgeInMilliseconds: 500, updateFunction: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        x = x + 1;
                        return [2 /*return*/, x];
                    }); }); } });
                _a = expect;
                return [4 /*yield*/, c.getAsync()];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual(6);
                return [4 /*yield*/, c.clearCacheAsync()];
            case 2:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, c.getAsync()];
            case 3:
                _b.apply(void 0, [_c.sent()]).toEqual(7);
                return [2 /*return*/];
        }
    });
}); });
test('CachedVariable clear cache (2)', function () { return __awaiter(void 0, void 0, void 0, function () {
    var c, _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                c = new CachedVariable_1.CachedVariable({
                    maxAgeInMilliseconds: 500,
                    updateFunction: function (prev) {
                        //console.log('updating dates...', 'prev=', prev)
                        prev = prev ? prev : [];
                        prev.push(new Date().toISOString());
                        //console.log('result=', prev)
                        return prev;
                    },
                    useLazyUpdate: false
                });
                c.onDisposeEvent.subscribe(function () {
                    console.log('disposing');
                });
                _a = expect;
                return [4 /*yield*/, c.getAsync()];
            case 1:
                _a.apply(void 0, [(_h.sent()).length]).toEqual(1);
                return [4 /*yield*/, async_1.Async.waitMsAsync(700)];
            case 2:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, c.getAsync()];
            case 3:
                _b.apply(void 0, [(_h.sent()).length]).toEqual(2);
                return [4 /*yield*/, c.clearCacheAsync()];
            case 4:
                _h.sent();
                _c = expect;
                return [4 /*yield*/, c.getAsync()];
            case 5:
                _c.apply(void 0, [(_h.sent()).length]).toEqual(1);
                return [4 /*yield*/, async_1.Async.waitMsAsync(700)];
            case 6:
                _h.sent();
                _d = expect;
                return [4 /*yield*/, c.getAsync()];
            case 7:
                _d.apply(void 0, [(_h.sent()).length]).toEqual(2);
                _f = (_e = console).log;
                _g = ['at end values='];
                return [4 /*yield*/, c.getAsync()];
            case 8:
                _f.apply(_e, _g.concat([_h.sent()]));
                return [2 /*return*/];
        }
    });
}); });
