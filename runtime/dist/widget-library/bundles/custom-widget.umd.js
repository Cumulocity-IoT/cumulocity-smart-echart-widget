(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common/http'), require('@angular/core'), require('echarts'), require('echarts-simple-transform'), require('@c8y/client'), require('@c8y/ngx-components'), require('ngx-echarts')) :
    typeof define === 'function' && define.amd ? define('smart-echart-runtime-widget', ['exports', '@angular/common/http', '@angular/core', 'echarts', 'echarts-simple-transform', '@c8y/client', '@c8y/ngx-components', 'ngx-echarts'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["smart-echart-runtime-widget"] = {}, global.ng.common.http, global.ng.core, global.echarts, global.simpleTransform, global.client, global["@c8y/ngx-components"], global.ngxEcharts));
})(this, (function (exports, i1, i0, echarts, simpleTransform, client, ngxComponents, ngxEcharts) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);
    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var echarts__namespace = /*#__PURE__*/_interopNamespace(echarts);
    var simpleTransform__namespace = /*#__PURE__*/_interopNamespace(simpleTransform);

    /**
     * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
     *
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var GpSmartEchartWidgetService = /** @class */ (function () {
        function GpSmartEchartWidgetService(http) {
            this.http = http;
        }
        GpSmartEchartWidgetService.prototype.getAPIData = function (apiUrl) {
            return this.http.get(apiUrl);
        };
        return GpSmartEchartWidgetService;
    }());
    GpSmartEchartWidgetService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function GpSmartEchartWidgetService_Factory() { return new GpSmartEchartWidgetService(i0__namespace.ɵɵinject(i1__namespace.HttpClient)); }, token: GpSmartEchartWidgetService, providedIn: "root" });
    GpSmartEchartWidgetService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    GpSmartEchartWidgetService.ctorParameters = function () { return [
        { type: i1.HttpClient }
    ]; };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /**
     * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
     *
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    function extractValueFromJSON(keyArr, parent) {
        var e_1, _a;
        var keysArray = Array.isArray(keyArr) ? keyArr : [keyArr];
        var resultArray = [];
        try {
            for (var keysArray_1 = __values(keysArray), keysArray_1_1 = keysArray_1.next(); !keysArray_1_1.done; keysArray_1_1 = keysArray_1.next()) {
                var keyStr = keysArray_1_1.value;
                var keys = keyStr.split('.');
                var parentRef = parent;
                if (keys.length === 1) {
                    resultArray.push(parentRef[keys[0]]);
                }
                else {
                    var result = void 0;
                    for (var idx = 0; idx < keys.length; idx++) {
                        var key = keys[idx];
                        result = parentRef[key];
                        if (isObject(result)) {
                            parentRef = result;
                        }
                        else if (idx < keys.length - 1) {
                        }
                    }
                    resultArray.push(result);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keysArray_1_1 && !keysArray_1_1.done && (_a = keysArray_1.return)) _a.call(keysArray_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (keysArray.length > 1) {
            return resultArray.join(' ');
        }
        return resultArray[0];
    }

    var GpSmartEchartWidgetComponent = /** @class */ (function () {
        function GpSmartEchartWidgetComponent(chartService, realTimeService, fetchClient) {
            this.chartService = chartService;
            this.realTimeService = realTimeService;
            this.fetchClient = fetchClient;
            this.chartOption = {};
            this.allSubscriptions = [];
            this.realtime = true;
            this.deviceId = '';
            this.isDatahubPostCall = false;
        }
        GpSmartEchartWidgetComponent.prototype.ngOnInit = function () {
            this.chartDiv = this.mapDivRef.nativeElement;
            this.createChart(this.config);
        };
        GpSmartEchartWidgetComponent.prototype.dataFromUser = function (userInput) {
            this.createChart(userInput);
        }; // end of dataFromUser()
        // create variables for all ChartConfig like value type, apidata from url etc to store the data from user
        // create chart
        GpSmartEchartWidgetComponent.prototype.reloadData = function (userInput) {
            this.createChart(userInput);
        };
        // createChart function is used to create chart with the help of echart library
        GpSmartEchartWidgetComponent.prototype.createChart = function (userInput) {
            return __awaiter(this, void 0, void 0, function () {
                var myChart, _a, sqlReqObject, response, _b, xAxisObject, yAxisObject, xAxisName, yAxisName, xAxisName, yAxisName, resultDimension, dimensions, encodeData, datasetId, yDimensions, xDimensions, yAxisName, xAxisName, xAxisName, yAxisName, yDimensions, xDimensions, indexOfXDimension, indicatorData, i, resultDimension, dimensions, encodeData, datasetId, yDimensions, xDimensions, xAxisName, yAxisName, xAxisName, yAxisName, yDimensions, xDimensions;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            myChart = echarts__namespace.init(this.chartDiv);
                            myChart.showLoading();
                            if (!userInput.showApiInput) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.chartService.getAPIData(userInput.apiUrl).toPromise()];
                        case 1:
                            _a.serviceData = _c.sent();
                            return [3 /*break*/, 6];
                        case 2:
                            if (!userInput.showDatahubInput) return [3 /*break*/, 5];
                            sqlReqObject = {
                                sql: userInput.sqlQuery,
                                limit: 100,
                                format: 'PANDAS'
                            };
                            return [4 /*yield*/, this.fetchClient.fetch(userInput.apiUrl, {
                                    body: JSON.stringify(sqlReqObject),
                                    method: 'POST'
                                })];
                        case 3:
                            response = _c.sent();
                            _b = this;
                            return [4 /*yield*/, response.json()];
                        case 4:
                            _b.serviceData = _c.sent();
                            this.isDatahubPostCall = true;
                            return [3 /*break*/, 6];
                        case 5:
                            if (i0.isDevMode()) {
                                console.log('No Datasource selected');
                            }
                            _c.label = 6;
                        case 6:
                            if (this.serviceData) {
                                myChart.hideLoading();
                                if (userInput.aggrList.length === 0 && !this.isDatahubPostCall) {
                                    // calls for API without Aggregation
                                    if (userInput.type === 'pie') {
                                        this.seriesData = this.getPieChartSeriesData(userInput);
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            xAxis: {
                                                show: false,
                                                data: this.serviceData[userInput.listName].map(function (item) {
                                                    return item[userInput.xAxisDimension];
                                                }),
                                            },
                                            yAxis: {
                                                type: 'value',
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                            },
                                            series: this.seriesData,
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            }
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Pie Chart For API', this.chartOption);
                                        }
                                    }
                                    // End of piechart for API
                                    else if (userInput.type === 'polar') {
                                        this.seriesData = this.getPolarChartSeriesData(userInput);
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            polar: {},
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                },
                                                confine: true
                                            },
                                            angleAxis: {
                                                type: 'value',
                                                startAngle: 0
                                            },
                                            radiusAxis: {
                                                min: 0
                                            },
                                            series: this.seriesData,
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            }
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Polar Chart For API', this.chartOption);
                                        }
                                    }
                                    // End of Polar CHart for API
                                    else if (userInput.type === 'scatter') {
                                        xAxisObject = void 0;
                                        yAxisObject = void 0;
                                        if (userInput.layout === 'horizontalScatter') {
                                            xAxisObject = {
                                                name: this.getFormattedName(userInput.xAxisDimension),
                                                nameLocation: 'middle',
                                                nameGap: 30,
                                                type: this.getXAxisType(userInput)
                                            };
                                            yAxisObject = {
                                                name: this.getFormattedName(userInput.yAxisDimension),
                                                nameLocation: 'middle',
                                                nameGap: 70,
                                                data: this.serviceData[userInput.listName].map(function (item) {
                                                    return item[userInput.yAxisDimension];
                                                }),
                                                type: this.getYAxisType(userInput)
                                            };
                                        }
                                        else {
                                            xAxisObject = {
                                                name: this.getFormattedName(userInput.xAxisDimension),
                                                nameLocation: 'middle',
                                                nameGap: 30,
                                                data: this.serviceData[userInput.listName].map(function (item) {
                                                    return item[userInput.xAxisDimension];
                                                }),
                                                type: this.getXAxisType(userInput)
                                            };
                                            yAxisObject = {
                                                name: this.getFormattedName(userInput.yAxisDimension),
                                                nameLocation: 'middle',
                                                nameGap: 70,
                                                type: this.getYAxisType(userInput)
                                            };
                                        }
                                        this.seriesData = this.getScatterChartSeriesData(userInput);
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            xAxis: xAxisObject,
                                            yAxis: yAxisObject,
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                }
                                            },
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: userInput.boxZoom,
                                                        yAxisIndex: 'none'
                                                    },
                                                    restore: {},
                                                    saveAsImage: {}
                                                }
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            series: this.seriesData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Scatter chart for API', this.chartOption);
                                        }
                                    } // End of Scatter Chart for API
                                    else if (userInput.type === 'radar') {
                                        this.seriesData = this.getRadarSeriesData(userInput);
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center'
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                                confine: true
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            radar: {
                                                indicator: this.serviceData[userInput.listName].map(function (item) {
                                                    return { name: item[userInput.xAxisDimension] };
                                                }),
                                                radius: 100
                                            },
                                            series: this.seriesData,
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            }
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Radar chart for API', this.chartOption);
                                        }
                                    } // End of Radar CHart for API
                                    else if ((userInput.type === 'line' || userInput.type === 'bar')
                                        && (userInput.layout !== 'simpleHorizontalBar' && userInput.layout !== 'stackedHorizontalBar')) {
                                        this.seriesData = this.getSeriesData(userInput);
                                        xAxisName = void 0;
                                        yAxisName = void 0;
                                        if (userInput.xAxisDimension.split(',').length > 1) {
                                            xAxisName = '';
                                        }
                                        else {
                                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                        }
                                        if (userInput.yAxisDimension.split(',').length > 1) {
                                            yAxisName = '';
                                        }
                                        else {
                                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                        }
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                },
                                                confine: true
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            xAxis: {
                                                data: this.serviceData[userInput.listName].map(function (item) {
                                                    return item[userInput.xAxisDimension];
                                                }),
                                                type: this.getXAxisType(userInput),
                                            },
                                            yAxis: {
                                                type: this.getYAxisType(userInput),
                                            },
                                            series: this.seriesData,
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: userInput.boxZoom,
                                                        yAxisIndex: 'none'
                                                    },
                                                    restore: {},
                                                    saveAsImage: {}
                                                }
                                            }
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Simple bar or line chart for API', this.chartOption);
                                        }
                                    }
                                    // End of Simple Line,Simple Bar,Stacked Line And Stacked Bar for API
                                    else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
                                        xAxisName = void 0;
                                        yAxisName = void 0;
                                        if (userInput.xAxisDimension.split(',').length > 1) {
                                            xAxisName = '';
                                        }
                                        else {
                                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                        }
                                        if (userInput.yAxisDimension.split(',').length > 1) {
                                            yAxisName = '';
                                        }
                                        else {
                                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                        }
                                        this.seriesData = this.getHorizontalSeriesData(userInput);
                                        this.chartOption =
                                            {
                                                title: {
                                                    text: userInput.title,
                                                    left: 'center',
                                                    textStyle: {
                                                        overflow: 'truncate',
                                                    }
                                                },
                                                grid: {
                                                    left: '10%',
                                                    top: '20%',
                                                    right: '10%',
                                                    bottom: '15%',
                                                    containLabel: true
                                                },
                                                legend: {
                                                    show: true,
                                                    icon: userInput.legend.icon,
                                                    orient: 'horizontal',
                                                    top: '10%',
                                                    formatter: function (name) {
                                                        var test = name.split('.').slice(-1);
                                                        var a = test[0].replace(/([A-Z])/g, ' $1')
                                                            // uppercase the first character
                                                            .replace(/^./, function (str) { return str.toUpperCase(); });
                                                        return a;
                                                    },
                                                    type: 'scroll',
                                                },
                                                dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                                xAxis: {
                                                    // name: xAxisName,
                                                    type: this.getXAxisType(userInput),
                                                },
                                                yAxis: {
                                                    // name: yAxisName,
                                                    type: this.getYAxisType(userInput),
                                                    data: this.serviceData[userInput.listName].map(function (item) {
                                                        var val = extractValueFromJSON(userInput.yAxisDimension, item);
                                                        return val;
                                                    }),
                                                },
                                                series: this.seriesData,
                                                toolbox: {
                                                    feature: {
                                                        dataZoom: {
                                                            show: true,
                                                            yAxisIndex: 'none'
                                                        },
                                                        restore: {},
                                                        saveAsImage: {}
                                                    }
                                                },
                                            };
                                        if (i0.isDevMode()) {
                                            console.log('Horizontal chart for API', this.chartOption);
                                        }
                                    }
                                    // End of Horizontal Bar & Stacked Horizontal Bar
                                } // End of API calls with JSON Response without Aggregation
                                else if (userInput.aggrList.length === 0 && this.isDatahubPostCall) {
                                    resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                                    dimensions = [];
                                    encodeData = void 0;
                                    datasetId = null;
                                    // Format of Data from datahub is
                                    // Result:[
                                    //   "columns":['colA','colB',...,'colN'],
                                    //   "data":[
                                    //     ["A1","B1",...,"N1"],
                                    //     ["A2","B2",...,"N2"],
                                    //     ...,
                                    //     ["AN","BN",...,"NN"]
                                    //   ]
                                    // ]
                                    // source of Dataset should be [[columns],[datarows]]
                                    this.serviceData = __spread([this.serviceData.columns], this.serviceData.data);
                                    // End of Response Data extraction
                                    if (userInput.type === 'bar' || userInput.type === 'line') {
                                        dimensions = this.getDatasetDimensions(userInput);
                                        yDimensions = void 0;
                                        xDimensions = void 0;
                                        yAxisName = '';
                                        xAxisName = '';
                                        if (userInput.yAxisDimension.split(',').length === 1) {
                                            yDimensions = userInput.yAxisDimension;
                                            dimensions.push(yDimensions);
                                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                        }
                                        else {
                                            yDimensions = userInput.yAxisDimension.split(',');
                                            dimensions = __spread(dimensions, yDimensions);
                                            yAxisName = '';
                                        }
                                        if (userInput.xAxisDimension.split(',').length === 1) {
                                            xDimensions = userInput.xAxisDimension;
                                            dimensions.push(xDimensions);
                                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                        }
                                        else {
                                            xDimensions = userInput.xAxisDimension.split(',');
                                            dimensions = __spread(dimensions, xDimensions);
                                            xAxisName = '';
                                        }
                                        if (dimensions.indexOf(userInput.groupBy) === -1) {
                                            dimensions.push(userInput.groupBy);
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId, xDimensions, yDimensions);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    source: this.serviceData
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                },
                                                confine: true
                                            },
                                            xAxis: {
                                                name: userInput.xAxisDimension,
                                                nameLocation: 'middle',
                                                nameGap: 30,
                                                scale: true,
                                                type: this.getXAxisType(userInput),
                                            },
                                            yAxis: {
                                                type: this.getYAxisType(userInput),
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: true,
                                                    },
                                                    saveAsImage: {},
                                                    restore: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Baror Line chart for Datahub without aggregation', this.chartOption);
                                        }
                                    } // End of Bar,Line Chart without Aggregation for Datahub
                                    else if (userInput.type === 'scatter') {
                                        dimensions = this.getDatasetDimensions(userInput);
                                        if (dimensions.indexOf(userInput.groupBy) === -1) {
                                            dimensions.push(userInput.groupBy);
                                        }
                                        xAxisName = '';
                                        yAxisName = '';
                                        if (userInput.xAxisDimension.split(',').length > 1) {
                                            xAxisName = '';
                                        }
                                        else {
                                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                        }
                                        if (userInput.yAxisDimension.split(',').length > 1) {
                                            yAxisName = '';
                                        }
                                        else {
                                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    source: this.serviceData
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            xAxis: {
                                                name: xAxisName,
                                                nameLocation: 'middle',
                                                nameGap: 50,
                                                type: this.getXAxisType(userInput)
                                            },
                                            yAxis: {
                                                name: yAxisName,
                                                nameLocation: 'middle',
                                                nameGap: 70,
                                                type: this.getYAxisType(userInput)
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                },
                                                confine: true
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: true,
                                                        yAxisIndex: 'none'
                                                    },
                                                    restore: {},
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Scatter chart without Aggregation for Datahub', this.chartOption);
                                        }
                                    } // End of Scatter Chart without Aggregation for Datahub
                                    else if (userInput.type === 'pie') {
                                        dimensions = [userInput.pieSlicenName, userInput.pieSliceValue];
                                        encodeData = this.getEncodeData(userInput, datasetId);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    source: this.serviceData
                                                },
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                                confine: true
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%', left: 'left',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Pie chart without Aggregation for Datahub', this.chartOption);
                                        }
                                    } // End of Pie chart without Aggregation for Datahub
                                    else if (userInput.type === 'polar') {
                                        yDimensions = void 0;
                                        xDimensions = void 0;
                                        if (userInput.yAxisDimension.split(',').length === 1) {
                                            yDimensions = userInput.yAxisDimension;
                                            dimensions.push(yDimensions);
                                        }
                                        else {
                                            yDimensions = userInput.yAxisDimension.split(',');
                                            dimensions = __spread(dimensions, yDimensions);
                                        }
                                        if (userInput.xAxisDimension.split(',').length === 1) {
                                            xDimensions = userInput.xAxisDimension;
                                            dimensions.push(xDimensions);
                                        }
                                        else {
                                            xDimensions = userInput.xAxisDimension.split(',');
                                            dimensions = __spread(dimensions, xDimensions);
                                        }
                                        if (dimensions.indexOf(userInput.groupBy) === -1) {
                                            dimensions.push(userInput.groupBy);
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId, xDimensions, yDimensions);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    source: this.serviceData
                                                },
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                }
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            angleAxis: {
                                                type: 'value',
                                                startAngle: 0
                                            },
                                            radiusAxis: {
                                                min: 0
                                            },
                                            polar: {},
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%', left: 'left',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Polar chart without Aggregation for Datahub', this.chartOption);
                                        }
                                    } // End of Polar Chart Without Aggregation for Datahub
                                    else if (userInput.type === 'radar') {
                                        dimensions = __spread(userInput.radarDimensions);
                                        this.seriesData = this.getRadarSeriesData(userInput);
                                        indexOfXDimension = this.serviceData[0].indexOf(userInput.xAxisDimension);
                                        indicatorData = [];
                                        for (i = 1; i < this.serviceData.length; i++) {
                                            indicatorData.push({ name: this.serviceData[i][indexOfXDimension] });
                                        }
                                        this.chartOption = {
                                            title: {
                                                text: userInput.title,
                                                left: 'center'
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%', left: 'left',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                            },
                                            radar: {
                                                indicator: indicatorData,
                                                radius: 100
                                            },
                                            series: this.seriesData,
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            }
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Radar Chart without Aggregation for Datahub', this.chartOption);
                                        }
                                    } // End of Radar Chart without Aggregation for Datahub
                                } // ENd of Datahub Calls Response without Aggregation
                                else if (userInput.aggrList.length > 0) {
                                    // calls for API & Datahub with Aggregation
                                    echarts__namespace.registerTransform(simpleTransform__namespace.aggregate);
                                    resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                                    dimensions = [];
                                    encodeData = void 0;
                                    datasetId = '_aggregate';
                                    // Extract the service data based on the response type of wthere call is made to Datahub or Other API
                                    if (this.isDatahubPostCall) {
                                        // Format of Data from datahub is
                                        // Result:[
                                        //   "columns":['colA','colB',...,'colN'],
                                        //   "data":[
                                        //     ["A1","B1",...,"N1"],
                                        //     ["A2","B2",...,"N2"],
                                        //     ...,
                                        //     ["AN","BN",...,"NN"]
                                        //   ]
                                        // ]
                                        // source of Dataset should be [[columns],[datarows]]
                                        this.serviceData = __spread([this.serviceData.columns], this.serviceData.data);
                                    }
                                    else {
                                        // Format of Data from APi calls is JSON object with key,value
                                        // Result: [
                                        //   {
                                        //     "key1": "val1",
                                        //     "key2": "val2",
                                        //   },
                                        //   {
                                        //     "key1": "val1.1",
                                        //     "key2": "val2.1",
                                        //   }
                                        // ]
                                        this.serviceData = this.serviceData[userInput.listName];
                                    } // End of Response Data extraction
                                    if (userInput.type === 'bar' || userInput.type === 'line') {
                                        yDimensions = void 0;
                                        xDimensions = void 0;
                                        xAxisName = '';
                                        yAxisName = '';
                                        if (this.isDatahubPostCall) {
                                            dimensions = null;
                                        }
                                        else {
                                            if (userInput.yAxisDimension.split(',').length === 1) {
                                                yDimensions = userInput.yAxisDimension;
                                                dimensions.push(yDimensions);
                                                yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                            }
                                            else {
                                                yDimensions = userInput.yAxisDimension.split(',');
                                                dimensions = __spread(dimensions, yDimensions);
                                                yAxisName = '';
                                            }
                                            if (userInput.xAxisDimension.split(',').length === 1) {
                                                xDimensions = userInput.xAxisDimension;
                                                dimensions.push(xDimensions);
                                                xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                            }
                                            else {
                                                xDimensions = userInput.xAxisDimension.split(',');
                                                dimensions = __spread(dimensions, xDimensions);
                                                xAxisName = '';
                                            }
                                            if (dimensions.indexOf(userInput.groupBy) === -1) {
                                                dimensions.push(userInput.groupBy);
                                            }
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId, xDimensions, yDimensions);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    dimensions: dimensions,
                                                    source: this.serviceData
                                                },
                                                {
                                                    id: '_aggregate',
                                                    fromDatasetId: 'raw_data',
                                                    transform: [
                                                        {
                                                            type: 'ecSimpleTransform:aggregate',
                                                            config: {
                                                                resultDimensions: resultDimension,
                                                                groupBy: userInput.groupBy
                                                            },
                                                            print: true
                                                        }
                                                    ]
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                },
                                                confine: true
                                            },
                                            xAxis: {
                                                name: xAxisName,
                                                nameLocation: 'middle',
                                                nameGap: 30,
                                                scale: true,
                                                type: this.getXAxisType(userInput),
                                            },
                                            yAxis: {
                                                type: this.getYAxisType(userInput),
                                                name: yAxisName
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: true,
                                                    },
                                                    saveAsImage: {},
                                                    restore: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Aggregate Bar or Line chart', this.chartOption);
                                        }
                                    } // End of Bar,Line Chart with Aggregation for datahub and API
                                    else if (userInput.type === 'scatter') {
                                        if (this.isDatahubPostCall) {
                                            dimensions = null;
                                        }
                                        else {
                                            dimensions = this.getDatasetDimensions(userInput);
                                            if (dimensions.indexOf(userInput.groupBy) === -1) {
                                                dimensions.push(userInput.groupBy);
                                            }
                                        }
                                        xAxisName = '';
                                        yAxisName = '';
                                        if (userInput.xAxisDimension.split(',').length > 1) {
                                            xAxisName = '';
                                        }
                                        else {
                                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                                        }
                                        if (userInput.yAxisDimension.split(',').length > 1) {
                                            yAxisName = '';
                                        }
                                        else {
                                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    dimensions: dimensions,
                                                    source: this.serviceData
                                                },
                                                {
                                                    id: '_aggregate',
                                                    fromDatasetId: 'raw_data',
                                                    transform: [
                                                        {
                                                            type: 'ecSimpleTransform:aggregate',
                                                            config: {
                                                                resultDimensions: resultDimension,
                                                                groupBy: userInput.groupBy
                                                            },
                                                            print: true
                                                        }
                                                    ]
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            xAxis: {
                                                name: xAxisName,
                                                nameLocation: 'middle',
                                                nameGap: 50,
                                                type: this.getXAxisType(userInput)
                                            },
                                            yAxis: {
                                                name: yAxisName,
                                                nameLocation: 'middle',
                                                nameGap: 70,
                                                type: this.getYAxisType(userInput)
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                }
                                            },
                                            legend: {
                                                icon: userInput.legend.icon,
                                                width: 330,
                                                top: '10%',
                                                type: 'scroll',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                            toolbox: {
                                                feature: {
                                                    dataZoom: {
                                                        show: true,
                                                        yAxisIndex: 'none'
                                                    },
                                                    restore: {},
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Aggregate Scatter chart', this.chartOption);
                                        }
                                    } // End of Scatter Chart with Aggregation for datahub and API
                                    else if (userInput.type === 'pie') {
                                        if (this.isDatahubPostCall) {
                                            dimensions = null;
                                        }
                                        else {
                                            dimensions = [userInput.pieSlicenName, userInput.pieSliceValue];
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    dimensions: dimensions,
                                                    source: this.serviceData
                                                },
                                                {
                                                    id: '_aggregate',
                                                    fromDatasetId: 'raw_data',
                                                    transform: [
                                                        {
                                                            type: 'ecSimpleTransform:aggregate',
                                                            config: {
                                                                resultDimensions: resultDimension,
                                                                groupBy: userInput.groupBy
                                                            },
                                                            print: true
                                                        }
                                                    ]
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'item',
                                                confine: true
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            legend: {
                                                selected: { detail: false },
                                                type: 'scroll',
                                                icon: userInput.legend.icon,
                                                left: 'left',
                                                top: '10%',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = 
                                                    // name.split(/(?=[A-Z])/).join(' ');
                                                    test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Aggregate Pie chart', this.chartOption);
                                        }
                                    } // End of Pie Chart with Aggregation for datahub and API
                                    else if (userInput.type === 'polar') {
                                        yDimensions = void 0;
                                        xDimensions = void 0;
                                        if (this.isDatahubPostCall) {
                                            dimensions = null;
                                        }
                                        else {
                                            if (userInput.yAxisDimension.split(',').length === 1) {
                                                yDimensions = userInput.yAxisDimension;
                                                dimensions.push(yDimensions);
                                            }
                                            else {
                                                yDimensions = userInput.yAxisDimension.split(',');
                                                dimensions = __spread(dimensions, yDimensions);
                                            }
                                            if (userInput.xAxisDimension.split(',').length === 1) {
                                                xDimensions = userInput.xAxisDimension;
                                                dimensions.push(xDimensions);
                                            }
                                            else {
                                                xDimensions = userInput.xAxisDimension.split(',');
                                                dimensions = __spread(dimensions, xDimensions);
                                            }
                                            if (dimensions.indexOf(userInput.groupBy) === -1) {
                                                dimensions.push(userInput.groupBy);
                                            }
                                        }
                                        encodeData = this.getEncodeData(userInput, datasetId, xDimensions, yDimensions);
                                        this.chartOption = {
                                            dataset: [
                                                {
                                                    id: 'raw_data',
                                                    dimensions: dimensions,
                                                    source: this.serviceData
                                                },
                                                {
                                                    id: '_aggregate',
                                                    fromDatasetId: 'raw_data',
                                                    transform: [
                                                        {
                                                            type: 'ecSimpleTransform:aggregate',
                                                            config: {
                                                                resultDimensions: resultDimension,
                                                                groupBy: userInput.groupBy
                                                            },
                                                            print: true
                                                        }
                                                    ]
                                                }
                                            ],
                                            title: {
                                                text: userInput.title,
                                                left: 'center',
                                            },
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross'
                                                }
                                            },
                                            grid: {
                                                left: '10%',
                                                top: '20%',
                                                right: '10%',
                                                bottom: '15%',
                                                containLabel: true
                                            },
                                            angleAxis: {
                                                type: 'value',
                                                startAngle: 0
                                            },
                                            radiusAxis: {
                                                min: 0
                                            },
                                            polar: {},
                                            legend: {
                                                selected: { detail: false },
                                                type: 'scroll',
                                                icon: userInput.legend.icon,
                                                left: 'left',
                                                top: '10%',
                                                formatter: function (name) {
                                                    var test = name.split('.').slice(-1);
                                                    var a = test[0].replace(/([A-Z])/g, ' $1')
                                                        // uppercase the first character
                                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                                    a.trim();
                                                    return a;
                                                },
                                            },
                                            toolbox: {
                                                feature: {
                                                    saveAsImage: {}
                                                }
                                            },
                                            series: encodeData
                                        };
                                        if (i0.isDevMode()) {
                                            console.log('Aggregate Polar chart', this.chartOption);
                                        }
                                    } // End of Polar Chart with Aggregation for datahub and API
                                } // End of calls for API & Datahub with Aggregation
                                // End of chartOptions
                            } // End of IF condition checking whether variable serviceData has some data or not
                            return [2 /*return*/];
                    }
                });
            });
        };
        GpSmartEchartWidgetComponent.prototype.getXAxisType = function (input) {
            return input.xAxis;
        };
        GpSmartEchartWidgetComponent.prototype.getYAxisType = function (input) {
            return input.yAxis;
        };
        GpSmartEchartWidgetComponent.prototype.getChartType = function (input) {
            return input.type;
        };
        GpSmartEchartWidgetComponent.prototype.getFormattedName = function (input) {
            var test = input.split('.').slice(-1);
            var a = test[0].replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) { return str.toUpperCase(); });
            return a.trim();
        };
        GpSmartEchartWidgetComponent.prototype.getEncodeData = function (userInput, datasetId, xDimensions, yDimensions) {
            var _this = this;
            if (userInput.type === 'polar') {
                return [{
                        coordinateSystem: 'polar',
                        name: userInput.xAxisDimension,
                        type: userInput.layout,
                        showSymbol: true,
                        encode: {
                            radius: userInput.yAxisDimension,
                            angle: userInput.xAxisDimension,
                            tooltip: [userInput.yAxisDimension, userInput.xAxisDimension]
                        },
                        label: {
                            show: userInput.showLabel
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                        },
                    }];
            }
            else if (userInput.type === 'scatter') {
                if (userInput.layout === 'horizontalScatter') {
                    if (userInput.xAxisDimension.split(',').length === 1) {
                        return [{
                                type: userInput.type,
                                symbolSize: userInput.scatterSymbolSize,
                                datasetId: datasetId,
                                encode: {
                                    y: userInput.yAxisDimension,
                                    x: userInput.xAxisDimension,
                                    tooltip: [userInput.xAxisDimension, userInput.yAxisDimension]
                                },
                            }];
                    }
                    else {
                        var xAxisDimensions_1 = userInput.xAxisDimension.split(',');
                        var xAxisData_1 = [];
                        xAxisDimensions_1.forEach(function (value, i) {
                            xAxisData_1[i] = {
                                type: userInput.type,
                                symbolSize: userInput.scatterSymbolSize,
                                datasetId: datasetId,
                                encode: {
                                    y: userInput.yAxisDimension,
                                    x: xAxisDimensions_1[i],
                                    tooltip: [xAxisDimensions_1[i], userInput.yAxisDimension]
                                },
                                label: {
                                    show: userInput.showLabel
                                },
                                emphasis: {
                                    focus: 'series',
                                    label: {
                                        show: true
                                    },
                                    itemStyle: {
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            };
                        });
                        return xAxisData_1;
                    } // End of else part of XAxisDimension
                }
                else {
                    if (userInput.yAxisDimension.split(',').length === 1) {
                        return [{
                                type: userInput.type,
                                symbolSize: userInput.scatterSymbolSize,
                                datasetId: datasetId,
                                encode: {
                                    y: userInput.yAxisDimension,
                                    x: userInput.xAxisDimension,
                                    tooltip: [userInput.xAxisDimension, userInput.yAxisDimension]
                                },
                                label: {
                                    show: userInput.showLabel
                                },
                                emphasis: {
                                    focus: 'series',
                                    label: {
                                        show: true
                                    },
                                    itemStyle: {
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            }];
                    }
                    else {
                        var yAxisDimensions_1 = userInput.yAxisDimension.split(',');
                        var yAxisData_1 = [];
                        yAxisDimensions_1.forEach(function (value, i) {
                            yAxisData_1[i] = {
                                type: userInput.type,
                                symbolSize: userInput.scatterSymbolSize,
                                datasetId: datasetId,
                                encode: {
                                    y: userInput.yAxisDimension,
                                    x: yAxisDimensions_1[i],
                                    tooltip: [yAxisDimensions_1[i], userInput.yAxisDimension]
                                },
                                label: {
                                    show: userInput.showLabel
                                },
                                emphasis: {
                                    focus: 'series',
                                    label: {
                                        show: true
                                    },
                                    itemStyle: {
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            };
                        });
                        return yAxisData_1;
                    } // End of else part of YAxisDimension
                }
            }
            else if (userInput.type === 'radar') {
                var dimensions = userInput.radarDimensions.split(',');
                var dimensionRecord_1 = dimensions.reduce(function (acc, dimension) {
                    acc[dimension] = [];
                    return acc;
                }, {});
                this.serviceData[userInput.listName].map(function (item) {
                    Object.keys(item).forEach(function (value, key) {
                        if (dimensionRecord_1[key]) {
                            dimensionRecord_1[key].push(item[key]);
                        }
                    });
                });
                var resultARR = Object.values(dimensionRecord_1);
                var result1 = Object.keys(dimensionRecord_1).map(function (key) { return ({
                    name: key,
                    value: dimensionRecord_1[key]
                }); });
                return [{
                        name: userInput.listName,
                        type: 'radar',
                        data: result1
                    }];
            }
            else if (userInput.type === 'bar' && (userInput.layout === 'simpleBar' || userInput.layout === 'stackedBar')) {
                if (userInput.yAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            datasetId: datasetId,
                            name: yDimensions,
                            encode: {
                                x: xDimensions,
                                y: yDimensions
                            }
                        }];
                }
                else {
                    var yAxisData_2 = [];
                    yDimensions.array.forEach(function (value, i) {
                        yAxisData_2[i] = {
                            type: userInput.type,
                            datasetId: datasetId,
                            stack: _this.getStackName(userInput.stack, yDimensions[i]),
                            name: yDimensions[i],
                            encode: {
                                x: xDimensions,
                                y: yDimensions[i]
                            }
                        };
                    }); // end of for block
                    return yAxisData_2;
                }
            }
            else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
                if (userInput.xAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            datasetId: datasetId,
                            name: xDimensions,
                            encode: {
                                x: xDimensions,
                                y: yDimensions
                            }
                        }];
                }
                else {
                    var xAxisData_2 = [];
                    xDimensions.forEach(function (value, i) {
                        xAxisData_2[i] = {
                            type: userInput.type,
                            datasetId: datasetId,
                            stack: _this.getStackName(userInput.stack, xDimensions[i]),
                            name: xDimensions[i],
                            encode: {
                                x: xDimensions[i],
                                y: yDimensions
                            }
                        };
                    }); // end of for block
                    return xAxisData_2;
                }
            }
            else if (userInput.type === 'line') {
                if (userInput.yAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            datasetId: datasetId,
                            smooth: userInput.smoothLine,
                            areaStyle: userInput.area,
                            name: yDimensions,
                            encode: {
                                x: xDimensions,
                                y: yDimensions
                            }
                        }];
                }
                else {
                    var yAxisData_3 = [];
                    yDimensions.forEach(function (value, i) {
                        yAxisData_3[i] = {
                            type: userInput.type,
                            datasetId: datasetId,
                            smooth: userInput.smoothLine,
                            areaStyle: userInput.area,
                            name: yDimensions[i],
                            encode: {
                                x: xDimensions,
                                y: yDimensions[i]
                            }
                        };
                    }); // end of for block
                    return yAxisData_3;
                }
            }
            else if (userInput.type === 'pie') {
                var convradius = userInput.radius.split(',');
                var roseValue = '';
                var sliceStyle = void 0;
                if (userInput.layout === 'roseMode') {
                    roseValue = 'rose';
                }
                if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius === undefined) {
                    sliceStyle = {};
                }
                else if (userInput.pieBorderWidth > 0 && userInput.pieBorderRadius === undefined) {
                    sliceStyle = {
                        borderColor: '#fff',
                        borderWidth: userInput.pieBorderWidth
                    };
                }
                else if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius > 0) {
                    sliceStyle = {
                        borderRadius: userInput.pieBorderRadius
                    };
                }
                else {
                    sliceStyle = {
                        borderRadius: userInput.pieBorderRadius,
                        borderColor: '#fff',
                        borderWidth: userInput.pieBorderWidth
                    };
                }
                return [{
                        type: userInput.type,
                        datasetId: datasetId,
                        radius: convradius,
                        roseType: roseValue,
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        labelLine: {
                            show: false
                        },
                        itemStyle: sliceStyle,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        name: userInput.pieSliceName,
                        encode: {
                            itemName: [userInput.pieSlicenName],
                            value: userInput.pieSliceValue
                        }
                    }];
            }
        };
        // getScatterChartSeriesData function is used to create series data for scatter chart
        GpSmartEchartWidgetComponent.prototype.getScatterChartSeriesData = function (userInput) {
            var _this = this;
            if (userInput.layout === 'horizontalScatter') {
                if (userInput.xAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            data: this.serviceData[userInput.listName].map(function (item) {
                                return item[userInput.xAxisDimension];
                            }),
                            label: {
                                show: userInput.showLabel
                            },
                            emphasis: {
                                focus: 'series',
                                label: {
                                    show: true
                                },
                                itemStyle: {
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }];
                }
                else {
                    var xAxisDimensions_2 = userInput.xAxisDimension.split(',');
                    var xAxisData_3 = [];
                    xAxisDimensions_2.forEach(function (value, i) {
                        xAxisData_3[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            data: _this.serviceData[userInput.listName].map(function (item) {
                                return item[xAxisDimensions_2[i]];
                            }),
                            label: {
                                show: userInput.showLabel
                            },
                            emphasis: {
                                focus: 'series',
                                label: {
                                    show: true
                                },
                                itemStyle: {
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        };
                    }); // end of for loop
                    return xAxisData_3;
                } // End of else part of XAxisDimension
            }
            else {
                if (userInput.yAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            data: this.serviceData[userInput.listName].map(function (item) {
                                return item[userInput.yAxisDimension];
                            }),
                            label: {
                                show: userInput.showLabel
                            },
                            emphasis: {
                                focus: 'series',
                                label: {
                                    show: true
                                },
                                itemStyle: {
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }];
                }
                else {
                    var yAxisDimensions_2 = userInput.yAxisDimension.split(',');
                    var yAxisData_4 = [];
                    yAxisDimensions_2.forEach(function (value, i) {
                        yAxisData_4[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            data: _this.serviceData[userInput.listName].map(function (item) {
                                return item[yAxisDimensions_2[i]];
                            }),
                            label: {
                                show: userInput.showLabel
                            },
                            emphasis: {
                                focus: 'series',
                                label: {
                                    show: true
                                },
                                itemStyle: {
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        };
                    });
                    return yAxisData_4;
                } // End of else part of YAxisDimension
            }
        };
        // getPolarChartSeriesData function is used to create series data for polar chart
        GpSmartEchartWidgetComponent.prototype.getPolarChartSeriesData = function (userInput) {
            var result = [];
            this.serviceData[userInput.listName].map(function (item) {
                var currentResult = [];
                currentResult.push(item[userInput.xAxisDimension]);
                currentResult.push(item[userInput.yAxisDimension]);
                result.push(currentResult);
            });
            return [{
                    coordinateSystem: 'polar',
                    name: userInput.xAxisDimension,
                    type: userInput.layout,
                    showSymbol: true,
                    data: result,
                    label: {
                        show: userInput.showLabel
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                    },
                }];
        };
        // getRadarSeriesData function is used to get the data from service and store it in seriesData variable
        GpSmartEchartWidgetComponent.prototype.getRadarSeriesData = function (userInput) {
            var _this = this;
            var dimensions = userInput.radarDimensions.split(',');
            var dimensionRecord = dimensions.reduce(function (acc, dimension) {
                acc[dimension] = [];
                return acc;
            }, {});
            if (userInput.listName in this.serviceData) {
                this.serviceData[userInput.listName].map(function (item) {
                    Object.keys(item).forEach(function (value, key) {
                        if (dimensionRecord[key]) {
                            dimensionRecord[key].push(item[key]);
                        }
                    });
                });
            }
            else {
                var indexes = dimensions.map(function (v, index) {
                    var val = v;
                    return { key: val, value: _this.serviceData[0].indexOf(v) };
                });
                var _loop_1 = function (i) {
                    indexes.forEach(function (element) {
                        dimensionRecord[element.key].push(_this.serviceData[i][element.value]);
                    });
                };
                for (var i = 1; i < this.serviceData.length; i++) {
                    _loop_1(i);
                }
            }
            var result1 = Object.keys(dimensionRecord).map(function (key) { return ({
                name: key,
                value: dimensionRecord[key]
            }); });
            if (userInput.listName in this.serviceData) {
                return [{
                        name: userInput.listName,
                        type: 'radar',
                        data: result1
                    }];
            }
            else {
                return [{
                        type: 'radar',
                        data: result1
                    }];
            }
        };
        GpSmartEchartWidgetComponent.prototype.createObject = function (dataDim, arr, dimen) {
            var dimensions = dimen.split(',');
            var dimensionRecord = dimensions.reduce(function (acc, dimension) {
                acc[dimension] = [];
                return acc;
            }, {});
            var indexes = dimensions.map(function (v, index) {
                var val = v;
                return { key: val, value: dataDim.indexOf(v) };
            });
            arr.map(function (item, index) {
                indexes.keys.forEach(function (element) {
                    dimensionRecord[element.key].push(item[element.value]);
                });
            });
        };
        // getPieChartSeriesData function is used to create series data for pie chart
        GpSmartEchartWidgetComponent.prototype.getPieChartSeriesData = function (userInput) {
            // convert comma separated string userInput.radius to array
            var convradius = userInput.radius.split(',');
            var roseValue = '';
            var sliceStyle;
            if (userInput.layout === 'roseMode') {
                roseValue = 'rose';
            }
            if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius === undefined) {
                sliceStyle = {};
            }
            else if (userInput.pieBorderWidth > 0 && userInput.pieBorderRadius === undefined) {
                sliceStyle = {
                    borderColor: '#fff',
                    borderWidth: userInput.pieBorderWidth
                };
            }
            else if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius > 0) {
                sliceStyle = {
                    borderRadius: userInput.pieBorderRadius
                };
            }
            else {
                sliceStyle = {
                    borderRadius: userInput.pieBorderRadius,
                    borderColor: '#fff',
                    borderWidth: userInput.pieBorderWidth
                };
            }
            return [{
                    name: userInput.listName,
                    type: 'pie',
                    radius: convradius,
                    roseType: roseValue,
                    avoidLabelOverlap: false,
                    label: {
                        show: true,
                        position: 'center',
                    },
                    labelLine: {
                        show: false
                    },
                    itemStyle: sliceStyle,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    data: this.serviceData[userInput.listName].map(function (item) {
                        // take val from userinput.pieslice value and return it
                        var val = item[userInput.pieSliceValue];
                        var nam;
                        if (userInput.pieSliceValue === userInput.pieSlicenName) {
                            nam = userInput.pieSlicenName;
                        }
                        else {
                            nam = item[userInput.pieSlicenName];
                        }
                        return {
                            value: val,
                            name: nam
                        };
                    }),
                }];
        };
        // getseriesdata recieves userinput and returns seriesdata
        // seriesdata is an array of objects
        GpSmartEchartWidgetComponent.prototype.getSeriesData = function (userInput) {
            var _this = this;
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        name: this.getFormattedName(userInput.yAxisDimension),
                        data: this.serviceData[userInput.listName].map(function (item) {
                            return item[userInput.yAxisDimension];
                        }),
                        type: userInput.type,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area
                    }];
            }
            else {
                var yAxisDimensions_3 = userInput.yAxisDimension.split(',');
                var yAxisData_5 = [];
                yAxisDimensions_3.forEach(function (value, i) {
                    yAxisData_5[i] = {
                        name: yAxisDimensions_3[i],
                        stack: _this.getStackName(userInput.stack, yAxisDimensions_3[i]),
                        emphasis: {
                            focus: 'series'
                        },
                        data: _this.serviceData[userInput.listName].map(function (item) {
                            console.log(item[yAxisDimensions_3[i]]);
                            // return val;
                            return item[yAxisDimensions_3[i]];
                        }),
                        type: userInput.type,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area
                    };
                }); // end of for block
                return yAxisData_5;
            }
        };
        // Gets the dimensions for dataset
        GpSmartEchartWidgetComponent.prototype.getDatasetDimensions = function (userInput) {
            var yDimensions;
            var xDimensions;
            var dimensionArr = [];
            if (userInput.yAxisDimension.split(',').length === 1) {
                yDimensions = userInput.yAxisDimension;
                dimensionArr.push(yDimensions);
            }
            else {
                yDimensions = userInput.yAxisDimension.split(',');
                dimensionArr = __spread(dimensionArr, yDimensions);
            }
            if (userInput.xAxisDimension.split(',').length === 1) {
                xDimensions = userInput.xAxisDimension;
                dimensionArr.push(xDimensions);
            }
            else {
                xDimensions = userInput.xAxisDimension.split(',');
                dimensionArr = __spread(dimensionArr, xDimensions);
            }
            return dimensionArr;
        };
        // if stackdata is empty then return dimensionName
        // else if stackdata is not empty then check if dimensionName is present in stackdata
        // if present then return stackname
        // else return dimensionName
        GpSmartEchartWidgetComponent.prototype.getStackName = function (stackData, dimensionName) {
            var result = '';
            stackData.forEach(function (value, x) {
                var values = stackData[x].stackValues.split(',');
                for (var i in values) {
                    if (values[i] === dimensionName) {
                        result = stackData[x].stackName;
                        return result;
                    }
                }
            }); // end of for loop of stackdata
        };
        // Get the dimensions and method array for aggregation
        // List comes from aggregate config and conatins both method and dimension name
        // We also need group by to be included as a dimension but without a method
        GpSmartEchartWidgetComponent.prototype.getResultDimesions = function (list, groupby) {
            var changedNamesForResult = list.map(function (_a) {
                var from = _a.aggrDimesnion, method = _a.aggrMethod;
                return ({
                    from: from,
                    method: method
                });
            });
            changedNamesForResult.push({ from: groupby });
            return changedNamesForResult;
        };
        // Method for showing the Slider/Pinch Zoom
        GpSmartEchartWidgetComponent.prototype.showZoomFeature = function (val) {
            if (val) {
                return [
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        minSpan: 5
                    },
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        minSpan: 5,
                        show: true,
                        height: 20,
                        top: '90%',
                    }
                ];
            }
            else {
                return [];
            }
        };
        // Get data for horizontal Bar chart
        GpSmartEchartWidgetComponent.prototype.getHorizontalSeriesData = function (userInput) {
            var _this = this;
            if (userInput.xAxisDimension.split(',').length === 1) {
                return [{
                        name: this.getFormattedName(userInput.xAxisDimension),
                        data: this.serviceData[userInput.listName].map(function (item) {
                            var val = extractValueFromJSON(userInput.xAxisDimension, item);
                            return val;
                        }),
                        label: {
                            show: userInput.showLabel
                        },
                        emphasis: {
                            focus: 'series',
                            label: {
                                show: true
                            },
                        },
                        type: userInput.type,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area
                    }];
            }
            else {
                var xAxisDimensions_3 = userInput.xAxisDimension.split(',');
                var xAxisData_4 = [];
                xAxisDimensions_3.forEach(function (value, i) {
                    xAxisData_4[i] = {
                        name: xAxisDimensions_3[i],
                        stack: _this.getStackName(userInput.stack, xAxisDimensions_3[i]),
                        label: {
                            show: userInput.showLabel
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                        },
                        data: _this.serviceData[userInput.listName].map(function (item) {
                            var val = extractValueFromJSON(xAxisDimensions_3[i], item);
                            return val;
                        }),
                        type: userInput.type,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area
                    };
                }); // end of for block
                return xAxisData_4;
            }
        };
        return GpSmartEchartWidgetComponent;
    }());
    GpSmartEchartWidgetComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'lib-gp-smart-echart-widget',
                    template: "\r\n\r\n\r\n    <div style=\"display: block\">\r\n\r\n        <div  echarts [options]=\"chartOption\" class=\"demo-chart\"\r\n        #chartBox></div>\r\n\r\n    </div>\r\n",
                    styles: ['gp-smart-echart-widget.component.css']
                },] }
    ];
    GpSmartEchartWidgetComponent.ctorParameters = function () { return [
        { type: GpSmartEchartWidgetService },
        { type: client.Realtime },
        { type: client.FetchClient }
    ]; };
    GpSmartEchartWidgetComponent.propDecorators = {
        mapDivRef: [{ type: i0.ViewChild, args: ['chartBox', { static: true },] }],
        config: [{ type: i0.Input }]
    };

    /**
     * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
     *
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var previewImage = '';

    var Emphasis = /** @class */ (function () {
        function Emphasis() {
        }
        return Emphasis;
    }());
    var Label = /** @class */ (function () {
        function Label() {
        }
        return Label;
    }());
    var ItemStyle = /** @class */ (function () {
        function ItemStyle() {
        }
        return ItemStyle;
    }());
    var YAxis = /** @class */ (function () {
        function YAxis() {
        }
        return YAxis;
    }());
    var Tooltip = /** @class */ (function () {
        function Tooltip() {
        }
        return Tooltip;
    }());
    // To show symbol,color and name of series
    var Legend = /** @class */ (function () {
        function Legend() {
        }
        return Legend;
    }());
    var Toolbox = /** @class */ (function () {
        function Toolbox() {
        }
        return Toolbox;
    }());
    var Stack = /** @class */ (function () {
        function Stack() {
        }
        return Stack;
    }());
    var AggregateData = /** @class */ (function () {
        function AggregateData() {
        }
        return AggregateData;
    }());
    var Feature = /** @class */ (function () {
        function Feature() {
        }
        return Feature;
    }());

    var chartValues = {
        chartType: [
            {
                id: 'bar',
                value: 'Bar Chart'
            },
            {
                id: 'line',
                value: 'Line Chart',
            },
            {
                id: 'pie',
                value: 'Pie Chart'
            },
            {
                id: 'radar',
                value: 'Radar Chart'
            },
            {
                id: 'polar',
                value: 'Polar chart'
            },
            {
                id: 'scatter',
                value: 'Scatter Chart'
            }
        ],
        chartLayout: [
            {
                id: 'line',
                layout: [
                    {
                        id: 'simple',
                        value: 'Simple Line Chart'
                    },
                    {
                        id: 'stacked',
                        value: 'Stacked Line Chart'
                    }
                ]
            },
            {
                id: 'polar',
                layout: [
                    {
                        id: 'line',
                        value: 'Line'
                    },
                    {
                        id: 'bar',
                        value: 'Bar'
                    }
                ]
            },
            {
                id: 'bar',
                layout: [
                    {
                        id: 'simpleBar',
                        value: 'Simple Bar Chart'
                    },
                    {
                        id: 'stackedBar',
                        value: 'Stacked Bar Chart'
                    },
                    {
                        id: 'simpleHorizontalBar',
                        value: 'Simple Horizontal Bar Chart'
                    },
                    {
                        id: 'stackedHorizontalBar',
                        value: 'Stacked Horizontal Bar Chart'
                    }
                ]
            },
            {
                id: 'pie',
                layout: [
                    {
                        id: 'simplePie',
                        value: 'Simple Pie Chart'
                    },
                    {
                        id: 'roseMode',
                        value: 'Rose Chart'
                    }
                ]
            },
            {
                id: 'scatter',
                layout: [
                    {
                        id: 'simpleScatter',
                        value: 'Simple Scatter Chart'
                    },
                    {
                        id: 'horizontalScatter',
                        value: 'Horizontal Scatter Chart'
                    }
                ]
            }
        ],
        yAxisType: [
            {
                id: 'value',
                value: 'Value',
                disabled: false
            },
            {
                id: 'category',
                value: 'Category',
                disabled: false
            },
            {
                id: 'time',
                value: 'Time',
                disabled: false
            },
        ],
        xAxisType: [
            {
                id: 'value',
                value: 'Value',
                disabled: false
            },
            {
                id: 'category',
                value: 'Category',
                disabled: false
            },
            {
                id: 'time',
                value: 'Time',
                disabled: false
            },
        ],
        legendType: [
            {
                icon: 'circle',
                value: 'Circle'
            },
            {
                icon: 'rect',
                value: 'Rectangle'
            },
            {
                icon: 'roundRect',
                value: 'Round Rectangle'
            },
            {
                icon: 'triangle',
                value: 'Triangle'
            },
            {
                icon: 'diamond',
                value: 'Diamond'
            },
            {
                icon: 'arrow',
                value: 'Arrow'
            }
        ],
        aggregateMethod: [
            {
                id: 'sum',
                value: 'Sum'
            },
            {
                id: 'count',
                value: 'Count'
            },
            {
                id: 'Q1',
                value: 'Q1'
            },
            {
                id: 'median',
                value: 'Q2 / Median'
            },
            {
                id: 'Q3',
                value: 'Q3'
            },
            {
                id: 'first',
                value: 'First'
            },
            {
                id: 'average',
                value: 'Average'
            },
            {
                id: 'min',
                value: 'Min'
            },
            {
                id: 'max',
                value: 'Max'
            },
        ],
        listName: '',
    };
    var SmartChartConfigComponent = /** @class */ (function () {
        function SmartChartConfigComponent() {
            this.flag = false;
            this.config = {
                listName: '',
                title: '',
                pieSlicenName: '',
                pieSliceValue: '',
                type: '',
                layout: '',
                dataSource: '',
                dataSourceValue: '',
                xAxis: '',
                yAxis: '',
                smoothLine: false,
                apiUrl: '',
                area: false,
                yAxisDimension: '',
                radarDimensions: '',
                addStack: false,
                showApiInput: false,
                stack: [],
                stackList: Stack[''],
                aggrArr: [],
                aggrList: AggregateData[''],
                legend: {
                    icon: '',
                    width: 330,
                    type: 'scroll'
                },
                radius: []
            };
            this.chartData = chartValues;
            this.isGroupByInAggregate = false;
            this.isAggrAdded = false;
            this.configData = new i0.EventEmitter();
        }
        SmartChartConfigComponent.prototype.ngOnInit = function () {
            this.aggregationMethods = chartValues.aggregateMethod;
            this.config.aggrList = [];
            this.config.legend = {};
        };
        // add another stack to the stackList
        // if stackList is empty, add total to the stackList
        // if stackList is not empty, add another stack to the stackList
        SmartChartConfigComponent.prototype.stackAdded = function (stack) {
            this.config.stackList = [];
            if (stack) {
                this.config.stackList.push(new Stack());
                this.config.stackList.push(new Stack());
            }
            else {
                this.config.stackList.length = 0;
            }
        };
        SmartChartConfigComponent.prototype.deleteStackValue = function (stack, index) {
            this.config.stackList.splice(index, 1);
        };
        // updateStack is called when the user changes the type of chart
        // updateStack is called when the user changes the layout of the chart
        // updateStack is called when the user changes the data source of the chart
        SmartChartConfigComponent.prototype.updateStack = function () {
            if (this.config.apiUrl) {
                if (this.config.type === 'bar') {
                    if (this.config.layout === 'stackedBar') {
                        if (this.config.stackList.length === 0) {
                            this.config.stack = 'total';
                        }
                        else if (this.config.stackList.length > 0) {
                            this.config.stack = this.config.stackList;
                        }
                        else {
                            this.config.stack = '';
                        }
                    }
                }
                if (this.config.type === 'line') {
                    if (this.config.layout === 'stackedLine') {
                        if (this.config.stackList.length === 0) {
                            this.config.stack = 'total';
                        }
                        else if (this.config.stackList.length > 0) {
                            this.config.stack = this.config.stackList;
                        }
                        else {
                            this.config.stack = '';
                        }
                    }
                }
            }
        };
        SmartChartConfigComponent.prototype.addAnotherStack = function () {
            this.config.stackList.push(new Stack());
        };
        SmartChartConfigComponent.prototype.addAnotherAggregate = function () {
            this.isAggrAdded = true;
            this.config.aggrList.push(new AggregateData());
        };
        SmartChartConfigComponent.prototype.deleteAggrValue = function (aggr, index) {
            this.config.aggrList.splice(index, 1);
            if (this.config.aggrList.length === 0) {
                this.isAggrAdded = false;
            }
        };
        SmartChartConfigComponent.prototype.onSelection = function (value) {
            var _this = this;
            this.chartData.chartLayout.filter(function (val) {
                if (value === val.id) {
                    _this.chartLayoutData = val.layout;
                }
            });
            this.config.addStack = false;
        };
        SmartChartConfigComponent.prototype.onLayoutSelection = function (value) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
            if (value === 'simpleBar' || value === 'stackedBar' || value === 'simple' || value === 'stacked' || value === 'simpleScatter') {
                try {
                    for (var _e = __values(this.chartData.yAxisType), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var val = _f.value;
                        if (val.id === 'category') {
                            val.disabled = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (var _g = __values(this.chartData.xAxisType), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var val = _h.value;
                        if (val.id === 'category') {
                            val.disabled = false;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            else if (value === 'simpleHorizontalBar' || value === 'stackedHorizontalBar' || value === 'horizontalScatter') {
                try {
                    for (var _j = __values(this.chartData.yAxisType), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var val = _k.value;
                        if (val.id === 'category') {
                            val.disabled = false;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    for (var _l = __values(this.chartData.xAxisType), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var val = _m.value;
                        if (val.id === 'category') {
                            val.disabled = true;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        };
        SmartChartConfigComponent.prototype.dataSourceSelection = function (value) {
            if (value === 'API') {
                this.config.showApiInput = true;
                this.config.showDatahubInput = false;
            }
            else if (value === 'datahub') {
                this.config.showDatahubInput = true;
                this.config.showApiInput = false;
            }
            else {
                this.config.showApiInput = false;
                this.config.showDatahubInput = false;
            }
        };
        // if onSelection, onLayoutSelection, dataSourceSelection is called, then submit data and emit config
        SmartChartConfigComponent.prototype.SubmitData = function () {
            var _this = this;
            this.config.aggrList.filter(function (element) {
                if (element.aggrDimesnion === _this.config.groupBy) {
                    _this.isGroupByInAggregate = true;
                }
                else {
                    _this.isGroupByInAggregate = false;
                }
            });
            if (this.config.area === true) {
                this.config.area = {};
            }
            else {
                this.config.area = null;
            }
            if (!this.isGroupByInAggregate) {
                this.configData.emit(this.config);
            }
        };
        return SmartChartConfigComponent;
    }());
    SmartChartConfigComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'lib-smart-chart-config',
                    template: "<div class=\"form-group\">\r\n    <div class=\"form-group\">\r\n        <label for=\"title\">Chart Title</label>\r\n        <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        <div >\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n  \r\n    <div class=\"form-group\">\r\n        <form>\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                \r\n            </label>\r\n            \r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\" placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n\r\n            </label>\r\n        </form>\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            &nbsp;&nbsp;<input class=\"form-control\" type=\"text\" [(ngModel)]=\"config.apiUrl\">\r\n        </ng-container>\r\n     \r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n            <div><textarea class=\"form-control\" placeholder=\"Sql Query\"  rows=\"3\" cols=\"30\" [(ngModel)]=\"config.sqlQuery\"></textarea>\r\n            </div>\r\n        </ng-container>\r\n      \r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"type\">Chart Type</label>\r\n        <div class=\"c8y-select-wrapper\">\r\n            <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                [(ngModel)]=\"config.type\">\r\n                <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type=='pie'\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n\r\n    <div *ngIf=\"config.type==='line'\">\r\n        <label title=\"Area\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n            <span></span>\r\n            <span>Area</span>\r\n        </label>\r\n        <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n            <span></span>\r\n            <span>Smooth Line</span>\r\n        </label><br>\r\n    </div>\r\n    <!-- dont show div if config.type is pie or radar -->\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type=='radar'\">\r\n        <label for=\"radarDimensions\">Radar Dimensions</label>\r\n        <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n    </div>\r\n    <!-- Dropdown for Aggregation / group by methods  -->\r\n    <div *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"form-group\">\r\n                <label for=\"aggregateDimension\">Dimension </label>\r\n                <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                    [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n\r\n                <label for=\"aggregation\">Method</label>\r\n                <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                    <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                    </option>\r\n                </select>\r\n\r\n\r\n                <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <div class=\"form-group\" *ngIf=\"isAggrAdded\">\r\n            <label for=\"groupByDimension\">Group By</label>\r\n            <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Dropdown for Legend Icon -->\r\n    <label for=\"legend\">Legend config</label>\r\n    <div class=\"c8y-select-wrapper\">\r\n        <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n            <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">{{legendType.value}}\r\n            </option>\r\n        </select>\r\n    </div>\r\n    <!-- Pie chart options -->\r\n    <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"radius\">Pie Radius</label>\r\n        <div>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"pieConfig\">Pie Slice Config</label>\r\n        <div>\r\n        <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\" [(ngModel)]=\"config.pieBorderRadius\">\r\n       \r\n        <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\"  value=\"0\"[(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n     </div>\r\n\r\n    <!-- For scatter bubble size -->\r\n    <div *ngIf=\"config.type==='scatter'\">\r\n        <label title=\"Bubble Size\"for=\"symbolSize\">Bubble Size</label>\r\n        <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n            [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n\r\n    </div>\r\n    <!-- stack container -->\r\n    <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\">\r\n        <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div style=\"margin-right: 0px;\">\r\n                <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                    <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                        (click)=\"stackAdded($event.target.checked)\">\r\n                    <span></span>\r\n                    <span>Add Stack</span>\r\n                </label>\r\n            </div>\r\n            <div *ngIf=\"config.addStack\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n        <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\" >\r\n            <span></span>\r\n            <span>Slider Zoom</span>\r\n        </label>\r\n        <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n            <span></span>\r\n            <span>Box Zoom</span>\r\n        </label>\r\n    </div>\r\n    <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"stackName\">Stack Name</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <label for=\"stackValues\">Stack Values</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div>\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n",
                    styles: ["div{margin-top:5px;margin-right:5px;margin-bottom:5px}.alertInput{border:2px solid red}"]
                },] }
    ];
    SmartChartConfigComponent.ctorParameters = function () { return []; };
    SmartChartConfigComponent.propDecorators = {
        config: [{ type: i0.Input }],
        configData: [{ type: i0.Output }]
    };

    /**
     * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
     *
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var ɵ0 = {
        id: 'smart.echart',
        label: 'Smart eChart',
        description: 'linechart derived from api data',
        previewImage: previewImage,
        component: GpSmartEchartWidgetComponent,
        configComponent: SmartChartConfigComponent,
        data: {
            ng1: {
                options: { noDeviceTarget: false,
                    noNewWidgets: false,
                    deviceTargetNotRequired: true,
                    groupsSelectable: true
                },
            }
        }
    };
    var GpSmartEchartWidgetModule = /** @class */ (function () {
        function GpSmartEchartWidgetModule() {
        }
        return GpSmartEchartWidgetModule;
    }());
    GpSmartEchartWidgetModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [GpSmartEchartWidgetComponent, SmartChartConfigComponent],
                    imports: [
                        ngxComponents.CoreModule,
                        ngxEcharts.NgxEchartsModule.forRoot({
                            echarts: echarts__namespace
                        }),
                    ],
                    schemas: [i0.CUSTOM_ELEMENTS_SCHEMA],
                    providers: [
                        GpSmartEchartWidgetService,
                        {
                            provide: ngxComponents.HOOK_COMPONENTS,
                            multi: true,
                            useValue: ɵ0
                        }
                    ],
                    exports: [GpSmartEchartWidgetComponent, SmartChartConfigComponent],
                    entryComponents: [GpSmartEchartWidgetComponent, SmartChartConfigComponent]
                },] }
    ];

    /**
     * Copyright (c) 2021 Software AG, Darmstadt, Germany and/or its licensors
     *
     * SPDX-License-Identifier: Apache-2.0
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *    http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.GpSmartEchartWidgetComponent = GpSmartEchartWidgetComponent;
    exports.GpSmartEchartWidgetModule = GpSmartEchartWidgetModule;
    exports.GpSmartEchartWidgetService = GpSmartEchartWidgetService;
    exports["ɵ0"] = ɵ0;
    exports["ɵa"] = SmartChartConfigComponent;
    exports["ɵb"] = previewImage;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=custom-widget.umd.js.map
