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
var CachedMap_1 = require("./CachedMap");
var async_1 = require("@lexriver/async");
function waitMsAsync(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
test('CachedMap', function () { return __awaiter(void 0, void 0, void 0, function () {
    var counter, cm, _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                counter = 100;
                cm = new CachedMap_1.CachedMap({
                    maxAgeInMilliseconds: 500,
                    updateFunction: function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, async_1.Async.waitMsAsync(200)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, Promise.resolve("" + key + ++counter)];
                            }
                        });
                    }); },
                    useLazyUpdate: true
                });
                _a = expect;
                return [4 /*yield*/, cm.getAsync('a')];
            case 1:
                _a.apply(void 0, [_f.sent()]).toEqual('a101');
                _b = expect;
                return [4 /*yield*/, cm.getAsync('a')];
            case 2:
                _b.apply(void 0, [_f.sent()]).toEqual('a101');
                _c = expect;
                return [4 /*yield*/, cm.getAsync('b')];
            case 3:
                _c.apply(void 0, [_f.sent()]).toEqual('b102');
                return [4 /*yield*/, waitMsAsync(505)];
            case 4:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, cm.getAsync('a')];
            case 5:
                _d.apply(void 0, [_f.sent()]).toEqual('a103');
                _e = expect;
                return [4 /*yield*/, cm.getAsync('b')];
            case 6:
                _e.apply(void 0, [_f.sent()]).toEqual('b104');
                return [2 /*return*/];
        }
    });
}); });
test('CachedMap', function () { return __awaiter(void 0, void 0, void 0, function () {
    var counter, cm, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                counter = 100;
                cm = new CachedMap_1.CachedMap({
                    maxAgeInMilliseconds: 500,
                    updateFunction: function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            counter++;
                            return [2 /*return*/, key + counter];
                        });
                    }); }
                });
                _a = expect;
                return [4 /*yield*/, cm.getAsync('a')];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual('a101');
                return [2 /*return*/];
        }
    });
}); });
// test('CachedMap by key object', async () => {
//     let counter:number = 100
//     interface InterfaceKey{
//         n:number
//         s:string
//     }
//     let cm = new CachedMap<InterfaceKey, string>(500, (key:InterfaceKey) => Promise.resolve(`${key.n},${key.s},${++counter}`))
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,101`)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,101`)
//     await waitMsAsync(501)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,102`)
//     expect(await cm.getAsync({n:10, s:'some string'})).toEqual(`10,some string,102`)
// })
// test('CachedMap clearCache', async () => {
//     let counter:number = 100
//     let cm = new CachedMap<string, string>(500, (key:string)=>{
//         return Promise.resolve(`${key}${++counter}`)
//     })
//     expect(await cm.getAsync('a')).toEqual('a101')
//     expect(await cm.getAsync('a')).toEqual('a101')
//     expect(await cm.getAsync('b')).toEqual('b102')
//     cm.clearCache()
//     expect(await cm.getAsync('a')).toEqual('a103')
//     expect(await cm.getAsync('b')).toEqual('b104')
// })
