"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoxedValue_1 = require("./BoxedValue");
test('initial value', function () {
    var x = new BoxedValue_1.BoxedValue(0);
    var hasValue = x.hasValue;
    //console.log('hasValue=', hasValue)
    expect(hasValue).toBeTruthy();
});
test('no initial value', function () {
    var x = new BoxedValue_1.BoxedValue();
    expect(x.hasValue).toBeFalsy();
    expect(function () { x.getOrThrow(); }).toThrow();
    expect(x.getOrUndefined()).toBeUndefined();
});
test('undefined value', function () {
    var x = new BoxedValue_1.BoxedValue();
    expect(x.hasValue).toBeFalsy();
    x.set(undefined);
    expect(x.hasValue).toBeTruthy();
    expect(x.getOrThrow()).toBeUndefined();
    x.set(100);
    expect(x.getOrThrow()).toEqual(100);
});
test('check value', function () {
    var x = new BoxedValue_1.BoxedValue();
    x.set(100);
    expect(x.getOrThrow()).toEqual(100);
    expect(x.getOrUndefined()).toEqual(100);
});
test('set by previous', function () {
    var x = new BoxedValue_1.BoxedValue(100);
    x.setByPrevious(function (prev) { return prev ? prev + 10 : 10; });
    expect(x.getOrThrow()).toEqual(110);
});
test('delete value', function () {
    var x = new BoxedValue_1.BoxedValue(100);
    x.deleteValue();
    expect(x.getOrUndefined()).toBeUndefined();
});
