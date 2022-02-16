import * as i1 from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as i0 from '@angular/core';
import { Injectable, isDevMode, Component, ViewChild, Input, EventEmitter, Output, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { __awaiter } from 'tslib';
import * as echarts from 'echarts';
import * as simpleTransform from 'echarts-simple-transform';
import { FetchClient } from '@c8y/client';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { NgxEchartsModule } from 'ngx-echarts';
import { AngularResizedEventModule } from 'angular-resize-event';

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
class GpSmartEchartWidgetService {
    constructor(http) {
        this.http = http;
    }
    getAPIData(apiUrl) {
        return this.http.get(apiUrl);
    }
}
GpSmartEchartWidgetService.ɵprov = i0.ɵɵdefineInjectable({ factory: function GpSmartEchartWidgetService_Factory() { return new GpSmartEchartWidgetService(i0.ɵɵinject(i1.HttpClient)); }, token: GpSmartEchartWidgetService, providedIn: "root" });
GpSmartEchartWidgetService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
GpSmartEchartWidgetService.ctorParameters = () => [
    { type: HttpClient }
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
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function extractValueFromJSON(keyArr, parent) {
    const keysArray = Array.isArray(keyArr) ? keyArr : [keyArr];
    const resultArray = [];
    for (const keyStr of keysArray) {
        const keys = keyStr.split('.');
        let parentRef = parent;
        if (keys.length === 1) {
            resultArray.push(parentRef[keys[0]]);
        }
        else {
            let result;
            for (let idx = 0; idx < keys.length; idx++) {
                const key = keys[idx];
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
    if (keysArray.length > 1) {
        return resultArray.join(' ');
    }
    return resultArray[0];
}

class GpSmartEchartWidgetComponent {
    constructor(chartService, fetchClient) {
        this.chartService = chartService;
        this.fetchClient = fetchClient;
        this.chartOption = {};
        this.allSubscriptions = [];
        this.realtime = true;
        this.deviceId = '';
        this.isDatahubPostCall = false;
    }
    ngOnInit() {
        this.chartDiv = this.mapDivRef.nativeElement;
        this.createChart(this.config);
    }
    dataFromUser(userInput) {
        this.createChart(userInput);
    } // end of dataFromUser()
    // create variables for all ChartConfig like value type, apidata from url etc to store the data from user
    // create chart
    reloadData(userInput) {
        this.createChart(userInput);
    }
    // createChart function is used to create chart with the help of echart library
    createChart(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataChart = echarts.init(this.chartDiv);
            this.dataChart.showLoading();
            if (!userInput.colors) {
                if (isDevMode()) {
                    console.log('No colors Specified');
                }
                this.colorsForChart = [];
            }
            else {
                this.colorsForChart = [...userInput.colors.split(',')];
            }
            if (userInput.showApiInput) {
                this.serviceData = yield this.chartService.getAPIData(userInput.apiUrl).toPromise();
            }
            else if (userInput.showDatahubInput) {
                const sqlReqObject = {
                    sql: userInput.sqlQuery,
                    limit: userInput.sqlLimit,
                    format: 'PANDAS'
                };
                const response = yield this.fetchClient.fetch(userInput.datahubUrl, {
                    body: JSON.stringify(sqlReqObject),
                    method: 'POST'
                });
                this.serviceData = yield response.json();
                this.isDatahubPostCall = true;
            }
            else {
                if (isDevMode()) {
                    console.log('No Datasource selected');
                }
            }
            if (this.serviceData) {
                this.dataChart.hideLoading();
                let axisFontSize = 0;
                if (userInput.fontSize === 0 || userInput.fontSize === '' || userInput.fontSize === null || userInput.fontSize === undefined) {
                    axisFontSize = 12;
                }
                else {
                    axisFontSize = userInput.fontSize;
                }
                if (userInput.area === true) {
                    if (userInput.areaOpacity == null) {
                        userInput.area = {};
                    }
                    else {
                        userInput.area = {
                            'opacity': userInput.areaOpacity
                        };
                    }
                }
                else {
                    userInput.area = null;
                }
                if (userInput.aggrList.length === 0 && !this.isDatahubPostCall) {
                    // calls for API without Aggregation
                    if (userInput.type === 'pie') {
                        this.seriesData = this.getPieChartSeriesData(userInput);
                        this.chartOption = {
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            xAxis: {
                                show: false,
                                boundaryGap: false,
                                data: this.serviceData[userInput.listName].map((item) => {
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
                        if (isDevMode()) {
                            console.log('Pie Chart For API', this.chartOption);
                        }
                        console.log('Pie Chart For API', this.chartOption);
                    }
                    // End of piechart for API
                    else if (userInput.type === 'polar') {
                        this.seriesData = this.getPolarChartSeriesData(userInput);
                        this.chartOption = {
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Polar Chart For API', this.chartOption);
                        }
                    }
                    // End of Polar CHart for API
                    else if (userInput.type === 'scatter') {
                        let xAxisObject;
                        let yAxisObject;
                        if (userInput.layout === 'horizontalScatter') {
                            xAxisObject = {
                                name: this.getFormattedName(userInput.xAxisDimension),
                                nameLocation: 'middle',
                                nameGap: 30,
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            };
                            yAxisObject = {
                                name: this.getFormattedName(userInput.yAxisDimension),
                                nameLocation: 'middle',
                                nameGap: 70,
                                data: this.serviceData[userInput.listName].map((item) => {
                                    return item[userInput.yAxisDimension];
                                }),
                                type: this.getYAxisType(userInput),
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
                                }
                            };
                        }
                        else {
                            xAxisObject = {
                                name: this.getFormattedName(userInput.xAxisDimension),
                                nameLocation: 'middle',
                                nameGap: 30,
                                data: this.serviceData[userInput.listName].map((item) => {
                                    return item[userInput.xAxisDimension];
                                }),
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
                                axisLabel: {
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            };
                            yAxisObject = {
                                name: this.getFormattedName(userInput.yAxisDimension),
                                nameLocation: 'middle',
                                nameGap: 70,
                                type: this.getYAxisType(userInput),
                                axisLabel: {
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
                                }
                            };
                        }
                        this.seriesData = this.getScatterChartSeriesData(userInput);
                        this.chartOption = {
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                            series: this.seriesData
                        };
                        if (isDevMode()) {
                            console.log('Scatter chart for API', this.chartOption);
                        }
                    } // End of Scatter Chart for API
                    else if (userInput.type === 'radar') {
                        this.seriesData = this.getRadarSeriesData(userInput);
                        this.chartOption = {
                            // title:{
                            //   text:userInput.title,
                            //   left:'center'
                            // },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                                indicator: this.serviceData[userInput.listName].map((item) => {
                                    return { name: item[userInput.xAxisDimension] };
                                }),
                                radius: userInput.radarChartRadius
                            },
                            series: this.seriesData,
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            }
                        };
                        if (isDevMode()) {
                            console.log('Radar chart for API', this.chartOption);
                        }
                        console.log('Radar chart for API', this.chartOption);
                    } // End of Radar CHart for API
                    else if ((userInput.type === 'line' || userInput.type === 'bar')
                        && (userInput.layout !== 'simpleHorizontalBar' && userInput.layout !== 'stackedHorizontalBar')) {
                        this.seriesData = this.getSeriesData(userInput);
                        let xAxisName;
                        let yAxisName;
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                                data: this.serviceData[userInput.listName].map((item) => {
                                    return item[userInput.xAxisDimension];
                                }),
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                                // name: xAxisName
                            },
                            yAxis: {
                                type: this.getYAxisType(userInput),
                                // name: yAxisName
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
                                }
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
                        if (isDevMode()) {
                            console.log('Simple bar or line chart for API', this.chartOption);
                        }
                    }
                    // End of Simple Line,Simple Bar,Stacked Line And Stacked Bar for API
                    else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
                        let xAxisName;
                        let yAxisName;
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
                                // title: {
                                //   text: userInput.title,
                                //   left: 'center',
                                //   textStyle: {
                                //     overflow: 'truncate',
                                //   }
                                // },
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
                                    // top: '10%',
                                    formatter(name) {
                                        const test = name.split('.').slice(-1);
                                        const a = test[0].replace(/([A-Z])/g, ' $1')
                                            // uppercase the first character
                                            .replace(/^./, (str) => { return str.toUpperCase(); });
                                        return a;
                                    },
                                    type: 'scroll',
                                },
                                dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                xAxis: {
                                    // name: xAxisName,
                                    type: this.getXAxisType(userInput),
                                    boundaryGap: false,
                                    axisLabel: {
                                        interval: 0,
                                        fontSize: axisFontSize,
                                        rotate: userInput.xAxisRotateLabels
                                    }
                                },
                                yAxis: {
                                    // name: yAxisName,
                                    type: this.getYAxisType(userInput),
                                    data: this.serviceData[userInput.listName].map((item) => {
                                        const val = extractValueFromJSON(userInput.yAxisDimension, item);
                                        return val;
                                    }),
                                    axisLabel: {
                                        interval: 0,
                                        fontSize: axisFontSize,
                                        rotate: userInput.yAxisRotateLabels
                                    }
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
                        if (isDevMode()) {
                            console.log('Horizontal chart for API', this.chartOption);
                        }
                    }
                    // End of Horizontal Bar & Stacked Horizontal Bar
                } // End of API calls with JSON Response without Aggregation
                else if (userInput.aggrList.length === 0 && this.isDatahubPostCall) {
                    // calls for Datahub without Aggregation
                    const resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                    let dimensions = [];
                    let encodeData;
                    const datasetId = null;
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
                    this.serviceData = [this.serviceData.columns, ...this.serviceData.data];
                    // End of Response Data extraction
                    if (userInput.type === 'bar' || userInput.type === 'line') {
                        dimensions = this.getDatasetDimensions(userInput);
                        let yDimensions;
                        let xDimensions;
                        let yAxisName = '';
                        let xAxisName = '';
                        if (userInput.yAxisDimension.split(',').length === 1) {
                            yDimensions = userInput.yAxisDimension;
                            dimensions.push(yDimensions);
                            yAxisName = this.getFormattedName(userInput.yAxisDimension);
                        }
                        else {
                            yDimensions = userInput.yAxisDimension.split(',');
                            dimensions = [...dimensions, ...yDimensions];
                            yAxisName = '';
                        }
                        if (userInput.xAxisDimension.split(',').length === 1) {
                            xDimensions = userInput.xAxisDimension;
                            dimensions.push(xDimensions);
                            xAxisName = this.getFormattedName(userInput.xAxisDimension);
                        }
                        else {
                            xDimensions = userInput.xAxisDimension.split(',');
                            dimensions = [...dimensions, ...xDimensions];
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            },
                            yAxis: {
                                type: this.getYAxisType(userInput),
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
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
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Bar or Line chart for Datahub without aggregation', this.chartOption);
                        }
                    } // End of Bar,Line Chart without Aggregation for Datahub
                    else if (userInput.type === 'scatter') {
                        dimensions = this.getDatasetDimensions(userInput);
                        if (dimensions.indexOf(userInput.groupBy) === -1) {
                            dimensions.push(userInput.groupBy);
                        }
                        let xAxisName = '';
                        let yAxisName = '';
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            xAxis: {
                                name: xAxisName,
                                nameLocation: 'middle',
                                nameGap: 50,
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            },
                            yAxis: {
                                name: yAxisName,
                                nameLocation: 'middle',
                                nameGap: 70,
                                type: this.getYAxisType(userInput),
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
                                }
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
                        if (isDevMode()) {
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%', 
                                left: 'left',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Pie chart without Aggregation for Datahub', this.chartOption);
                        }
                        console.log('Pie chart without Aggregation for Datahub', this.chartOption);
                    } // End of Pie chart without Aggregation for Datahub
                    else if (userInput.type === 'polar') {
                        let yDimensions;
                        let xDimensions;
                        if (userInput.yAxisDimension.split(',').length === 1) {
                            yDimensions = userInput.yAxisDimension;
                            dimensions.push(yDimensions);
                        }
                        else {
                            yDimensions = userInput.yAxisDimension.split(',');
                            dimensions = [...dimensions, ...yDimensions];
                        }
                        if (userInput.xAxisDimension.split(',').length === 1) {
                            xDimensions = userInput.xAxisDimension;
                            dimensions.push(xDimensions);
                        }
                        else {
                            xDimensions = userInput.xAxisDimension.split(',');
                            dimensions = [...dimensions, ...xDimensions];
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%',
                                left: 'left',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Polar chart without Aggregation for Datahub', this.chartOption);
                        }
                    } // End of Polar Chart Without Aggregation for Datahub
                    else if (userInput.type === 'radar') {
                        dimensions = [...userInput.radarDimensions];
                        this.seriesData = this.getRadarSeriesData(userInput);
                        const indexOfXDimension = this.serviceData[0].indexOf(userInput.xAxisDimension);
                        const indicatorData = [];
                        for (let i = 1; i < this.serviceData.length; i++) {
                            indicatorData.push({ name: this.serviceData[i][indexOfXDimension] });
                        }
                        this.chartOption = {
                            // title:{
                            //   text:userInput.title,
                            //   left:'center'
                            // },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                left: 'left',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            tooltip: {
                                trigger: 'item',
                            },
                            radar: {
                                indicator: indicatorData,
                                radius: userInput.radarChartRadius
                            },
                            series: this.seriesData,
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            }
                        };
                        if (isDevMode()) {
                            console.log('Radar Chart without Aggregation for Datahub', this.chartOption);
                        }
                        console.log('Radar Chart without Aggregation for Datahub', this.chartOption);
                    } // End of Radar Chart without Aggregation for Datahub
                } // ENd of Datahub Calls Response without Aggregation
                else if (userInput.aggrList.length > 0) {
                    // calls for API & Datahub with Aggregation
                    echarts.registerTransform(simpleTransform.aggregate);
                    const resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                    let dimensions = [];
                    let encodeData;
                    const datasetId = '_aggregate';
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
                        this.serviceData = [this.serviceData.columns, ...this.serviceData.data];
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
                        let yDimensions;
                        let xDimensions;
                        let xAxisName = '';
                        let yAxisName = '';
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
                                dimensions = [...dimensions, ...yDimensions];
                                yAxisName = '';
                            }
                            if (userInput.xAxisDimension.split(',').length === 1) {
                                xDimensions = userInput.xAxisDimension;
                                dimensions.push(xDimensions);
                                xAxisName = this.getFormattedName(userInput.xAxisDimension);
                            }
                            else {
                                xDimensions = userInput.xAxisDimension.split(',');
                                dimensions = [...dimensions, ...xDimensions];
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
                                    dimensions,
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            },
                            yAxis: {
                                type: this.getYAxisType(userInput),
                                name: yAxisName,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
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
                                icon: userInput.legend.icon,
                                width: 330,
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
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
                        let xAxisName = '';
                        let yAxisName = '';
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
                                    dimensions,
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.xAxisRotateLabels
                                }
                            },
                            yAxis: {
                                name: yAxisName,
                                nameLocation: 'middle',
                                nameGap: 70,
                                type: this.getYAxisType(userInput),
                                axisLabel: {
                                    interval: 0,
                                    fontSize: axisFontSize,
                                    rotate: userInput.yAxisRotateLabels
                                }
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
                                // top: '10%',
                                type: 'scroll',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
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
                                    dimensions,
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Aggregate Pie chart', this.chartOption);
                        }
                        console.log('Aggregate Pie chart', this.chartOption);
                    } // End of Pie Chart with Aggregation for datahub and API
                    else if (userInput.type === 'polar') {
                        let yDimensions;
                        let xDimensions;
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
                                dimensions = [...dimensions, ...yDimensions];
                            }
                            if (userInput.xAxisDimension.split(',').length === 1) {
                                xDimensions = userInput.xAxisDimension;
                                dimensions.push(xDimensions);
                            }
                            else {
                                xDimensions = userInput.xAxisDimension.split(',');
                                dimensions = [...dimensions, ...xDimensions];
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
                                    dimensions,
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
                            // title: {
                            //   text: userInput.title,
                            //   left:'center',
                            // },
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
                                // top: '10%',
                                formatter(name) {
                                    const test = name.split('.').slice(-1);
                                    const a = test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, (str) => { return str.toUpperCase(); });
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
                        if (isDevMode()) {
                            console.log('Aggregate Polar chart', this.chartOption);
                        }
                    } // End of Polar Chart with Aggregation for datahub and API
                } // End of calls for API & Datahub with Aggregation
                // End of chartOptions
            } // End of IF condition checking whether variable serviceData has some data or not
        });
    }
    getXAxisType(input) {
        return input.xAxis;
    }
    getYAxisType(input) {
        return input.yAxis;
    }
    getChartType(input) {
        return input.type;
    }
    getFormattedName(input) {
        const test = input.split('.').slice(-1);
        const a = test[0].replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, (str) => { return str.toUpperCase(); });
        return a.trim();
    }
    getEncodeData(userInput, datasetId, xDimensions, yDimensions) {
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
                    color: this.colorsForChart,
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
                            datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: userInput.xAxisDimension,
                                tooltip: [userInput.xAxisDimension, userInput.yAxisDimension]
                            },
                            color: this.getChartItemColor(0),
                        }];
                }
                else {
                    const xAxisDimensions = userInput.xAxisDimension.split(',');
                    const xAxisData = [];
                    xAxisDimensions.forEach((value, i) => {
                        xAxisData[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: xAxisDimensions[i],
                                tooltip: [xAxisDimensions[i], userInput.yAxisDimension]
                            },
                            label: {
                                show: userInput.showLabel
                            },
                            color: this.getChartItemColor(i),
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
                    return xAxisData;
                } // End of else part of XAxisDimension
            }
            else {
                if (userInput.yAxisDimension.split(',').length === 1) {
                    return [{
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: userInput.xAxisDimension,
                                tooltip: [userInput.xAxisDimension, userInput.yAxisDimension]
                            },
                            color: this.getChartItemColor(0),
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
                    const yAxisDimensions = userInput.yAxisDimension.split(',');
                    const yAxisData = [];
                    yAxisDimensions.forEach((value, i) => {
                        yAxisData[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: yAxisDimensions[i],
                                tooltip: [yAxisDimensions[i], userInput.yAxisDimension]
                            },
                            color: this.getChartItemColor(i),
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
                    return yAxisData;
                } // End of else part of YAxisDimension
            }
        }
        else if (userInput.type === 'radar') {
            const dimensions = userInput.radarDimensions.split(',');
            const dimensionRecord = dimensions.reduce((acc, dimension) => {
                acc[dimension] = [];
                return acc;
            }, {});
            this.serviceData[userInput.listName].map((item) => {
                Object.keys(item).forEach(key => {
                    if (dimensionRecord[key]) {
                        dimensionRecord[key].push(item[key]);
                    }
                });
            });
            const resultARR = Object.values(dimensionRecord);
            const result1 = Object.keys(dimensionRecord).map((key, i) => ({
                name: key,
                value: dimensionRecord[key],
                itemStyle: {
                    color: this.getChartItemColor(i)
                }
            }));
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
                        datasetId,
                        name: yDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                        },
                        color: this.getChartItemColor(0)
                    }];
            }
            else {
                const yAxisData = [];
                yDimensions.array.forEach((value, i) => {
                    yAxisData[i] = {
                        type: userInput.type,
                        datasetId,
                        stack: this.getStackName(userInput.stack, yDimensions[i]),
                        name: yDimensions[i],
                        encode: {
                            x: xDimensions,
                            y: yDimensions[i]
                        },
                        color: this.getChartItemColor(i)
                    };
                }); // end of for block
                return yAxisData;
            }
        }
        else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
            if (userInput.xAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId,
                        name: xDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                        },
                        color: this.getChartItemColor(0)
                    }];
            }
            else {
                const xAxisData = [];
                xDimensions.forEach((value, i) => {
                    xAxisData[i] = {
                        type: userInput.type,
                        datasetId,
                        stack: this.getStackName(userInput.stack, xDimensions[i]),
                        name: xDimensions[i],
                        encode: {
                            x: xDimensions[i],
                            y: yDimensions
                        },
                        color: this.getChartItemColor(i)
                    };
                }); // end of for block
                return xAxisData;
            }
        }
        else if (userInput.type === 'line') {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area,
                        name: yDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                        },
                        color: this.getChartItemColor(0)
                    }];
            }
            else {
                const yAxisData = [];
                yDimensions.forEach((value, i) => {
                    yAxisData[i] = {
                        type: userInput.type,
                        datasetId,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area,
                        name: yDimensions[i],
                        encode: {
                            x: xDimensions,
                            y: yDimensions[i]
                        },
                        color: this.getChartItemColor(i)
                    };
                }); // end of for block
                return yAxisData;
            }
        }
        else if (userInput.type === 'pie') {
            const convradius = userInput.radius.split(',');
            let roseValue = '';
            let sliceStyle;
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
                    datasetId,
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
                    },
                    color: this.colorsForChart
                }];
        }
    }
    // getScatterChartSeriesData function is used to create series data for scatter chart
    getScatterChartSeriesData(userInput) {
        if (userInput.layout === 'horizontalScatter') {
            if (userInput.xAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        data: this.serviceData[userInput.listName].map((item) => {
                            return item[userInput.xAxisDimension];
                        }),
                        itemStyle: {
                            color: this.getChartItemColor(0)
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
                const xAxisDimensions = userInput.xAxisDimension.split(',');
                const xAxisData = [];
                xAxisDimensions.forEach((value, i) => {
                    xAxisData[i] = {
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        data: this.serviceData[userInput.listName].map((item) => {
                            return item[xAxisDimensions[i]];
                        }),
                        label: {
                            show: userInput.showLabel
                        },
                        itemStyle: {
                            color: this.getChartItemColor(i)
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
                return xAxisData;
            } // End of else part of XAxisDimension
        }
        else {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        data: this.serviceData[userInput.listName].map((item) => {
                            return item[userInput.yAxisDimension];
                        }),
                        label: {
                            show: userInput.showLabel
                        },
                        itemStyle: {
                            color: this.getChartItemColor(0)
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
                const yAxisDimensions = userInput.yAxisDimension.split(',');
                const yAxisData = [];
                yAxisDimensions.forEach((value, i) => {
                    yAxisData[i] = {
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        data: this.serviceData[userInput.listName].map((item) => {
                            return item[yAxisDimensions[i]];
                        }),
                        label: {
                            show: userInput.showLabel
                        },
                        itemStyle: {
                            color: this.getChartItemColor(i)
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
                return yAxisData;
            } // End of else part of YAxisDimension
        }
    }
    // getPolarChartSeriesData function is used to create series data for polar chart
    getPolarChartSeriesData(userInput) {
        const result = [];
        this.serviceData[userInput.listName].map((item) => {
            const currentResult = [];
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
                itemStyle: {
                    color: this.getChartItemColor(0)
                },
                emphasis: {
                    label: {
                        show: true
                    },
                },
            }];
    }
    // getRadarSeriesData function is used to get the data from service and store it in seriesData variable
    getRadarSeriesData(userInput) {
        const dimensions = userInput.radarDimensions.split(',');
        const dimensionRecord = dimensions.reduce((acc, dimension) => {
            acc[dimension] = [];
            return acc;
        }, {});
        if (userInput.listName in this.serviceData) {
            this.serviceData[userInput.listName].map((item) => {
                Object.keys(item).forEach(key => {
                    if (dimensionRecord[key]) {
                        dimensionRecord[key].push(item[key]);
                    }
                });
            });
        }
        else {
            const indexes = dimensions.map((v, index) => {
                const val = v;
                return { key: val, value: this.serviceData[0].indexOf(v) };
            });
            for (let i = 1; i < this.serviceData.length; i++) {
                indexes.forEach(element => {
                    dimensionRecord[element.key].push(this.serviceData[i][element.value]);
                });
            }
        }
        const result1 = Object.keys(dimensionRecord).map((key, i) => ({
            name: key,
            value: dimensionRecord[key],
        }));
        if (userInput.listName in this.serviceData) {
            return [{
                    name: userInput.listName,
                    type: 'radar',
                    color: this.colorsForChart,
                    data: result1
                }];
        }
        else {
            return [{
                    type: 'radar',
                    color: this.colorsForChart,
                    data: result1
                }];
        }
    }
    createObject(dataDim, arr, dimen) {
        const dimensions = dimen.split(',');
        const dimensionRecord = dimensions.reduce((acc, dimension) => {
            acc[dimension] = [];
            return acc;
        }, {});
        const indexes = dimensions.map((v, index) => {
            const val = v;
            return { key: val, value: dataDim.indexOf(v) };
        });
        arr.map((item, index) => {
            indexes.keys.forEach(element => {
                dimensionRecord[element.key].push(item[element.value]);
            });
        });
    }
    // getPieChartSeriesData function is used to create series data for pie chart
    getPieChartSeriesData(userInput) {
        // convert comma separated string userInput.radius to array
        const convradius = userInput.radius.split(',');
        let roseValue = '';
        let sliceStyle;
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
                color: this.colorsForChart,
                data: this.serviceData[userInput.listName].map((item, i) => {
                    // take val from userinput.pieslice value and return it
                    const val = item[userInput.pieSliceValue];
                    let nam;
                    if (userInput.pieSliceValue === userInput.pieSlicenName) {
                        nam = userInput.pieSlicenName;
                    }
                    else {
                        nam = item[userInput.pieSlicenName];
                    }
                    return {
                        value: val,
                        name: nam,
                    };
                }),
            }];
    }
    // getseriesdata recieves userinput and returns seriesdata
    // seriesdata is an array of objects
    getSeriesData(userInput) {
        if (userInput.yAxisDimension.split(',').length === 1) {
            return [{
                    name: this.getFormattedName(userInput.yAxisDimension),
                    data: this.serviceData[userInput.listName].map((item) => {
                        return item[userInput.yAxisDimension];
                    }),
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area,
                    itemStyle: {
                        color: this.getChartItemColor(0)
                    }
                }];
        }
        else {
            const yAxisDimensions = userInput.yAxisDimension.split(',');
            const yAxisData = [];
            yAxisDimensions.forEach((value, i) => {
                let ab = this.getStackName(userInput.stackList, yAxisDimensions[i]);
                yAxisData[i] = {
                    name: yAxisDimensions[i],
                    stack: this.getStackName(userInput.stackList, yAxisDimensions[i]),
                    emphasis: {
                        focus: 'series'
                    },
                    data: this.serviceData[userInput.listName].map((item) => {
                        // return val;
                        return item[yAxisDimensions[i]];
                    }),
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area,
                    itemStyle: {
                        color: this.getChartItemColor(i)
                    }
                };
            }); // end of for block
            return yAxisData;
        }
    }
    getChartItemColor(index) {
        if (this.colorsForChart[index] === undefined) {
            return '';
        }
        else {
            return this.colorsForChart[index];
        }
    }
    // Gets the dimensions for dataset
    getDatasetDimensions(userInput) {
        let yDimensions;
        let xDimensions;
        let dimensionArr = [];
        if (userInput.yAxisDimension.split(',').length === 1) {
            yDimensions = userInput.yAxisDimension;
            dimensionArr.push(yDimensions);
        }
        else {
            yDimensions = userInput.yAxisDimension.split(',');
            dimensionArr = [...dimensionArr, ...yDimensions];
        }
        if (userInput.xAxisDimension.split(',').length === 1) {
            xDimensions = userInput.xAxisDimension;
            dimensionArr.push(xDimensions);
        }
        else {
            xDimensions = userInput.xAxisDimension.split(',');
            dimensionArr = [...dimensionArr, ...xDimensions];
        }
        return dimensionArr;
    }
    // if stackdata is empty then return dimensionName
    // else if stackdata is not empty then check if dimensionName is present in stackdata
    // if present then return stackname
    // else return dimensionName
    getStackName(stackData, dimensionName) {
        let result = '';
        stackData.forEach((value, x) => {
            const values = stackData[x].stackValues.split(',');
            values.forEach((element, i) => {
                if (values[i] === dimensionName) {
                    result = stackData[x].stackName;
                }
            });
        }); // end of for loop of stackdata
        return result;
    }
    // Get the dimensions and method array for aggregation
    // List comes from aggregate config and conatins both method and dimension name
    // We also need group by to be included as a dimension but without a method
    getResultDimesions(list, groupby) {
        const changedNamesForResult = list.map(({ aggrDimesnion: from, aggrMethod: method }) => ({
            from,
            method
        }));
        changedNamesForResult.push({ from: groupby });
        return changedNamesForResult;
    }
    // Method for showing the Slider/Pinch Zoom
    showZoomFeature(val) {
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
    }
    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + 0.8 + ")" : null;
    }
    // Get data for horizontal Bar chart
    getHorizontalSeriesData(userInput) {
        if (userInput.xAxisDimension.split(',').length === 1) {
            return [{
                    name: this.getFormattedName(userInput.xAxisDimension),
                    data: this.serviceData[userInput.listName].map((item) => {
                        const val = extractValueFromJSON(userInput.xAxisDimension, item);
                        return val;
                    }),
                    itemStyle: {
                        color: this.getChartItemColor(0)
                    },
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
            const xAxisDimensions = userInput.xAxisDimension.split(',');
            const xAxisData = [];
            xAxisDimensions.forEach((value, i) => {
                xAxisData[i] = {
                    name: xAxisDimensions[i],
                    stack: this.getStackName(userInput.stack, xAxisDimensions[i]),
                    label: {
                        show: userInput.showLabel
                    },
                    emphasis: {
                        label: {
                            show: true
                        },
                    },
                    data: this.serviceData[userInput.listName].map((item) => {
                        const val = extractValueFromJSON(xAxisDimensions[i], item);
                        return val;
                    }),
                    itemStyle: {
                        color: this.getChartItemColor(i)
                    },
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                };
            }); // end of for block
            return xAxisData;
        }
    }
    //  @HostListener('window:resize')
    //  onResize() {
    //    console.log(this.dataChart)
    //    if (this.dataChart) {
    //      this.dataChart.resize();
    //    }
    //  }
    onResized(event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        this.dataChart.resize({
            width: this.width,
            height: this.height
        });
    }
}
GpSmartEchartWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-gp-smart-echart-widget',
                template: "\r\n<div (resized)=\"onResized($event)\" style=\"height:100%;width:100%;\">\r\n   \r\n        <div echarts [options]=\"chartOption\" class=\"demo-chart\" #chartBox\r\n        [style.height.px]=\"height\" [style.width.px]=\"width\"\r\n        ></div>\r\n   \r\n</div>",
                styles: ['gp-smart-echart-widget.component.css']
            },] }
];
GpSmartEchartWidgetComponent.ctorParameters = () => [
    { type: GpSmartEchartWidgetService },
    { type: FetchClient }
];
GpSmartEchartWidgetComponent.propDecorators = {
    mapDivRef: [{ type: ViewChild, args: ['chartBox', { static: true },] }],
    config: [{ type: Input }]
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
const previewImage = '';

class Emphasis {
}
class Label {
}
class ItemStyle {
}
class YAxis {
}
class Tooltip {
}
// To show symbol,color and name of series
class Legend {
}
class Toolbox {
}
class Stack {
}
class AggregateData {
}
class Feature {
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
const chartValues = {
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
class SmartChartConfigComponent {
    constructor() {
        this.flag = false;
        this.userSelectedColor = [];
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
            fontSize: 12,
            xAxisRotateLabels: 0,
            yAxisRotateLabels: 0,
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
        this.configData = new EventEmitter();
    }
    ngOnInit() {
        this.aggregationMethods = chartValues.aggregateMethod;
        this.config.aggrList = [];
        this.config.legend = {};
        // Default value for datahub sql query
        if (this.config.datahubUrl === null || this.config.datahubUrl === undefined) {
            this.config.datahubUrl = "service/datahub/sql?version=v1";
        }
        if (this.config.sqlLimit === null || this.config.sqlLimit === undefined) {
            this.config.sqlLimit = 100;
        }
        // To initialize the chart layout dropdown
        this.onSelection(this.config.type);
    }
    // add another stack to the stackList
    // if stackList is empty, add total to the stackList
    // if stackList is not empty, add another stack to the stackList
    stackAdded(stack) {
        this.config.stackList = [];
        if (stack) {
            this.config.stackList.push(new Stack());
            this.config.stackList.push(new Stack());
        }
        else {
            this.config.stackList.length = 0;
        }
    }
    yAxisDimensionUpdate(val) {
        // console.log(val, this.config.yAxisDimension)
    }
    deleteStackValue(stack, index) {
        this.config.stackList.splice(index, 1);
    }
    addAnotherStack() {
        this.config.stackList.push(new Stack());
    }
    addAnotherAggregate() {
        this.isAggrAdded = true;
        this.config.aggrList.push(new AggregateData());
    }
    deleteAggrValue(aggr, index) {
        this.config.aggrList.splice(index, 1);
        if (this.config.aggrList.length === 0) {
            this.isAggrAdded = false;
        }
    }
    colorUpdate(colorSelected) {
        this.userSelectedColor = [...this.userSelectedColor, colorSelected];
        this.config.colors = this.userSelectedColor.join(',');
    }
    colorUpdateByTyping(colorTyped) {
        let joinedArr = [...this.userSelectedColor, ...colorTyped.split(',')];
        this.userSelectedColor = [...new Set([...joinedArr])];
    }
    onSelection(value) {
        this.chartData.chartLayout.filter(val => {
            if (value === val.id) {
                this.chartLayoutData = val.layout;
            }
        });
        this.config.addStack = false;
    }
    onLayoutSelection(value) {
        if (value === 'simpleBar' || value === 'stackedBar' || value === 'simple' || value === 'stacked' || value === 'simpleScatter') {
            for (const val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = true;
                }
            }
            for (const val of this.chartData.xAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
        }
        else if (value === 'simpleHorizontalBar' || value === 'stackedHorizontalBar' || value === 'horizontalScatter') {
            for (const val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
            for (const val of this.chartData.xAxisType) {
                if (val.id === 'category') {
                    val.disabled = true;
                }
            }
        }
    }
    dataSourceSelection(value) {
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
    }
}
SmartChartConfigComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-smart-chart-config',
                template: "<div class=\"configSection\">\r\n    <h4 translate>DataSource</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                <span></span>\r\n                <span>API URL</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                    placeholder=\"Enter Relative URL\">\r\n                <span></span>\r\n                <span>DataHub</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\"></div>\r\n        <div class=\"col-xs-4 col-md-4 \">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- ENd of DataSource Radio Button Selection -->\r\n    <div class=\"row\">\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n            </div>\r\n        </ng-container>\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.datahubUrl\">\r\n                <div>\r\n                    <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                        [(ngModel)]=\"config.sqlQuery\">\r\n                    </textarea>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <label for=\"sqlLimit\">Sql Result Limit</label>\r\n                <div>\r\n                    <input name=\"sqlLimit\" [(ngModel)]=\"config.sqlLimit\" type=\"number\" min=\"100\" max=\"20000\" step=\"1\" />\r\n                </div>\r\n            </div>\r\n\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n<div class=\"configSection\">\r\n    <h4 translate>Chart Config</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">\r\n                        {{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-3 col-md-3\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">\r\n                        {{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"fontSize\">Font Size</label>\r\n            <div>\r\n                <output>{{config.fontSize}}</output>\r\n                <input name=\"fontSize\" [(ngModel)]=\"config.fontSize\" type=\"range\" min=\"8\" max=\"20\" step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type=='pie'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type==='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"xrotateLabels\">X-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.xAxisRotateLabels}}</output>\r\n                <input name=\"xrotateLabels\" [(ngModel)]=\"config.xAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of X axis Config -->\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"yrotateLabels\">Y-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.yAxisRotateLabels}}</output>\r\n                <input name=\"yrotateLabels\" [(ngModel)]=\"config.yAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of y axis Config -->\r\n    <!-- Start of Radar config -->\r\n    <div class=\"row\" *ngIf=\"config.type=='radar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radarDimensions\">Radar Dimensions</label>\r\n            <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"RadarRadius\">Radar Chart radius</label>\r\n            <input class=\"form-control\" name=\"RadarRadius\" type=\"text\" [(ngModel)]=\"config.radarChartRadius\">\r\n        </div>\r\n    </div>\r\n    <!-- End of Radar config -->\r\n</div>\r\n<!-- End of General Chart Config Section -->\r\n<!-- Pie Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='pie'\">\r\n    <h4 translate>Pie Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radius\">Pie Radius</label>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderRadius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Pie Chart Config Section -->\r\n<!-- Scatter Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.type==='scatter'\">\r\n    <h4 translate>Scatter Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n            <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Stack Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n    <h4 translate>Stack Config</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                    (click)=\"stackAdded($event.target.checked)\">\r\n                <span></span>\r\n                <span>Add Stack</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackName\">Stack Name</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackValues\">Stack Values</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Line Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='line'\">\r\n    <h4 translate>Line Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Area Opacity\" for=\"lineAreaOpacity\">Area Opacity</label>\r\n            <input class=\"form-control\" type=\"number\" name=\"lineAreaOpacity\" [(ngModel)]=\"config.areaOpacity\" min=\"0\"\r\n                max=\"1\" step=\"0.1\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Area\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                <span></span>\r\n                <span>Area</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Smooth Line\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                <span></span>\r\n                <span>Smooth Line</span>\r\n            </label>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<!-- End of Line Chart Config Section -->\r\n<!-- Aggregate Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type!=='radar'\">\r\n    <!-- *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \"> -->\r\n    <h4 translate>Aggregate Config</h4>\r\n    <div class=\"col-xs-3 col-md-3\">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button style=\"margin-left: 10px;\" type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n    </div>\r\n    <div class=\"col-xs-12 col-md-12 col-lg-12\">\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregateDimension\">Dimension </label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                        [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                </div>\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregation\">Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                        <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2 \">\r\n                    <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n            <div class=\"col-xs-1 col-md-1\">\r\n                <label for=\"groupByDimension\">GroupBy</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Aggregate Section -->\r\n<!-- Legend Config Section -->\r\n<div class=\"configSection\">\r\n    <h4>Appearance Config</h4>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"legend\">Legend Shape</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                    <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                        {{legendType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Slider Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                <span></span>\r\n                <span>Slider Zoom</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Box Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                <span></span>\r\n                <span>Box Zoom</span>\r\n            </label>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Chart Color\" for=\"chartColor\">Chart Color</label>\r\n            <input type=\"text\" name=\"chartColor\" [(ngModel)]=\"config.colors\"\r\n                (change)=\"colorUpdateByTyping($event.target.value)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <input class=\"form-control\" type=\"color\" placeholder=\"Enter color HEX\"\r\n                (change)=\"colorUpdate($event.target.value)\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End Of Legend Config Section -->",
                styles: [".alertInput{border:2px solid red}.configSection{display:grid;border:1px solid rgba(0,0,0,.3);border-radius:4px;margin:.25em;padding:.25em}.row{padding:.5em}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
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
const ɵ0 = {
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
class GpSmartEchartWidgetModule {
}
GpSmartEchartWidgetModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GpSmartEchartWidgetComponent, SmartChartConfigComponent],
                imports: [
                    CoreModule,
                    NgxEchartsModule.forRoot({
                        echarts
                    }),
                    AngularResizedEventModule
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    GpSmartEchartWidgetService,
                    {
                        provide: HOOK_COMPONENTS,
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

export { GpSmartEchartWidgetComponent, GpSmartEchartWidgetModule, GpSmartEchartWidgetService, ɵ0, SmartChartConfigComponent as ɵa, previewImage as ɵb };
//# sourceMappingURL=custom-widget.js.map
