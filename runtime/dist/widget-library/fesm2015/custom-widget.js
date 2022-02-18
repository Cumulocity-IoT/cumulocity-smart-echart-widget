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
        const sessionStorageData = this.getDataFromSessionStorage('Chartsession');
        if (sessionStorageData && sessionStorageData !== 'true') {
            this.dataChart = echarts.init(this.chartDiv);
            this.dataChart.showLoading();
            this.createChart(this.config);
        }
        else if (sessionStorageData === 'true') {
            this.dataChart = echarts.init(this.chartDiv);
            this.dataChart.showLoading();
            this.waitForServiceToComplete();
        }
        else {
            this.dataChart = echarts.init(this.chartDiv);
            this.dataChart.showLoading();
            this.createChart(this.config);
        }
    }
    dataFromUser(userInput) {
        this.dataChart = echarts.init(this.chartDiv);
        this.dataChart.showLoading();
        this.createChart(userInput);
    } // end of dataFromUser()
    // create variables for all ChartConfig like value type, apidata from url etc to store the data from user
    // create chart
    reloadData(userInput) {
        this.dataChart = echarts.init(this.chartDiv);
        this.dataChart.showLoading();
        this.createChart(userInput);
    }
    // createChart function is used to create chart with the help of echart library
    createChart(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.dataChart = echarts.init(this.chartDiv);
            // this.dataChart.showLoading();
            if (userInput.showApiInput || userInput.showDatahubInput) {
                let chartsessionData = [];
                if (this.getDataFromSessionStorage('Chartsession')) {
                    chartsessionData = JSON.parse(sessionStorage.getItem('Chartsession'));
                    let matchingURL = false;
                    chartsessionData.forEach((element, index) => {
                        if ((userInput.apiUrl === element.url) || (userInput.datahubUrl === element.url)) {
                            if (userInput.apiUrl) {
                                this.isDatahubPostCall = false;
                            }
                            if (userInput.datahubUrl) {
                                this.isDatahubPostCall = true;
                            }
                            matchingURL = true;
                            this.serviceData = element.response;
                        }
                    });
                    if (!matchingURL) {
                        if (this.getDataFromSessionStorage('serviceRunning') === 'false') {
                            this.setDataInSessionStorage('serviceRunning', 'true');
                            // tslint:disable-next-line: prefer-const
                            let getDataFromSession = JSON.parse(sessionStorage.getItem('Chartsession'));
                            //  Service call for E chart
                            if (userInput.showApiInput) {
                                this.serviceData = yield this.chartService.getAPIData(userInput.apiUrl).toPromise();
                                if (this.serviceData != null) {
                                    getDataFromSession.push({ response: this.serviceData, url: userInput.apiUrl });
                                    sessionStorage.setItem('Chartsession', JSON.stringify(getDataFromSession));
                                    sessionStorage.setItem('serviceRunning', JSON.stringify('false'));
                                }
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
                                if (this.serviceData != null) {
                                    getDataFromSession.push({ response: this.serviceData, url: userInput.datahubUrl });
                                    sessionStorage.setItem('Chartsession', JSON.stringify(getDataFromSession));
                                    sessionStorage.setItem('serviceRunning', JSON.stringify('false'));
                                }
                            }
                            else {
                                if (isDevMode()) {
                                    console.log('No Datasource selected');
                                }
                            }
                        }
                        else {
                            this.waitForServiceToComplete();
                        }
                    }
                }
                // if there is no key as ChartSession in sessionStroage
                else {
                    this.setDataInSessionStorage('Chartsession', 'true');
                    const temp = [];
                    //  Service call for E chart
                    if (userInput.showApiInput) {
                        this.serviceData = yield this.chartService.getAPIData(userInput.apiUrl).toPromise();
                        if (this.serviceData !== null) {
                            temp.push({ response: this.serviceData, url: this.config.apiUrl });
                            this.setDataInSessionStorage('Chartsession', temp);
                            this.setDataInSessionStorage('serviceRunning', 'false');
                        }
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
                        if (this.serviceData !== null) {
                            temp.push({ response: this.serviceData, url: this.config.datahubUrl });
                            this.setDataInSessionStorage('Chartsession', temp);
                            this.setDataInSessionStorage('serviceRunning', 'false');
                        }
                    }
                    else {
                        if (isDevMode()) {
                            console.log('No Datasource selected');
                        }
                    }
                }
            }
            if (!userInput.colors) {
                if (isDevMode()) {
                    console.log('No colors Specified');
                }
                this.colorsForChart = [];
            }
            else {
                this.colorsForChart = [...userInput.colors.split(',')];
            }
            // if (userInput.showApiInput) {
            //   this.serviceData = await this.chartService.getAPIData(userInput.apiUrl).toPromise();
            // } else if (userInput.showDatahubInput) {
            //   const sqlReqObject = {
            //     sql: userInput.sqlQuery,
            //     limit: userInput.sqlLimit,
            //     format: 'PANDAS'
            //   };
            //   const response = await this.fetchClient.fetch(userInput.datahubUrl, {
            //     body: JSON.stringify(sqlReqObject),
            //     method: 'POST'
            //   })
            //   this.serviceData = await response.json();
            //   this.isDatahubPostCall = true;
            // } else {
            //   if (isDevMode()) { console.log('No Datasource selected'); }
            // }
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
                        console.log('Simple bar or line chart for API', this.chartOption);
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
                                // name: userInput.xAxisDimension,
                                // nameLocation: 'middle',
                                // nameGap: 30,
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
                        console.log('Bar or Line chart for Datahub without aggregation', this.chartOption);
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
                        console.log('Aggregate Bar or Line chart', this.chartOption);
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
    getDataFromSessionStorage(key) {
        let data = sessionStorage.getItem(key);
        if (data) {
            data = JSON.parse(data);
        }
        return data;
    }
    setDataInSessionStorage(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    }
    waitForServiceToComplete() {
        setTimeout(() => {
            const sessionStorageData = this.getDataFromSessionStorage('Chartsession');
            if (sessionStorageData && sessionStorageData !== 'true' && this.getDataFromSessionStorage('serviceRunning') === 'false') {
                this.createChart(this.config);
            }
            else {
                this.waitForServiceToComplete();
            }
        }, 2000);
    }
    ngOnDestroy() {
        if (sessionStorage.getItem('Chartsession')) {
            sessionStorage.removeItem('Chartsession');
        }
        if (sessionStorage.getItem('serviceRunning')) {
            sessionStorage.removeItem('serviceRunning');
        }
    }
    onResized(event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        if (this.dataChart) {
            this.dataChart.resize({
                width: this.width,
                height: this.height
            });
        }
    }
}
GpSmartEchartWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-gp-smart-echart-widget',
                template: "\r\n<div (resized)=\"onResized($event)\" style=\"height:100%;width:100%;\">\r\n\r\n        <div echarts [options]=\"chartOption\" class=\"demo-chart\" #chartBox [style.height.px]=\"height\"\r\n                [style.width.px]=\"width\"></div>\r\n\r\n</div>",
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
const previewImage = 'data:image/png;base64,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';

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
