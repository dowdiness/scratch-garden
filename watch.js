// sourced from https://github.com/pmndrs/valtio

// MIT License

// Copyright (c) 2020 Poimandres

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.watch = watch;
var valtio_js_1 = require("./valtio.js");
var currentCleanups;
/**
 * watch
 *
 * Creates a reactive effect that automatically tracks proxy objects and
 * reevaluates everytime one of the tracked proxy objects updates. It returns
 * a cleanup function to stop the reactive effect from reevaluating.
 *
 * Callback is invoked immediately to detect the tracked objects.
 *
 * Callback passed to `watch` receives a `get` function that "tracks" the
 * passed proxy object.
 *
 * Watch callbacks may return an optional cleanup function, which is evaluated
 * whenever the callback reevaluates or when the cleanup function returned by
 * `watch` is evaluated.
 *
 * `watch` calls inside `watch` are also automatically tracked and cleaned up
 * whenever the parent `watch` reevaluates.
 *
 * @param callback
 * @returns A cleanup function that stops the callback from reevaluating and
 * also performs cleanups registered into `watch`.
 */
function watch(callback, options) {
    var _this = this;
    var alive = true;
    var cleanups = new Set();
    var subscriptions = new Map();
    var cleanup = function () {
        if (alive) {
            alive = false;
            cleanups.forEach(function (clean) { return clean(); });
            cleanups.clear();
            subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
            subscriptions.clear();
        }
    };
    var revalidate = function () { return __awaiter(_this, void 0, void 0, function () {
        var proxiesToSubscribe, parent, promiseOrPossibleCleanup, couldBeCleanup, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!alive) {
                        return [2 /*return*/];
                    }
                    // run own cleanups before re-subscribing
                    cleanups.forEach(function (clean) { return clean(); });
                    cleanups.clear();
                    proxiesToSubscribe = new Set();
                    parent = currentCleanups;
                    currentCleanups = cleanups;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 5, 6]);
                    promiseOrPossibleCleanup = callback(function (proxyObject) {
                        proxiesToSubscribe.add(proxyObject);
                        // in case the callback is a promise and the watch has ended
                        if (alive && !subscriptions.has(proxyObject)) {
                            // subscribe to new proxy immediately -> this fixes problems when Promises are used due to the callstack
                            var unsubscribe = (0, valtio_js_1.subscribe)(proxyObject, revalidate, options === null || options === void 0 ? void 0 : options.sync);
                            subscriptions.set(proxyObject, unsubscribe);
                        }
                        return proxyObject;
                    });
                    if (!(promiseOrPossibleCleanup && promiseOrPossibleCleanup instanceof Promise)) return [3 /*break*/, 3];
                    return [4 /*yield*/, promiseOrPossibleCleanup];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = promiseOrPossibleCleanup;
                    _b.label = 4;
                case 4:
                    couldBeCleanup = _a;
                    // If there's a cleanup, we add this to the cleanups set
                    if (couldBeCleanup) {
                        if (alive) {
                            cleanups.add(couldBeCleanup);
                        }
                        else {
                            cleanup();
                        }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    currentCleanups = parent;
                    return [7 /*endfinally*/];
                case 6:
                    // Unsubscribe old subscriptions
                    subscriptions.forEach(function (unsubscribe, proxyObject) {
                        if (!proxiesToSubscribe.has(proxyObject)) {
                            subscriptions.delete(proxyObject);
                            unsubscribe();
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    // If there's a parent watch call, we attach this watch's
    // cleanup to the parent.
    if (currentCleanups) {
        currentCleanups.add(cleanup);
    }
    // Invoke effect to create subscription list
    revalidate();
    return cleanup;
}
