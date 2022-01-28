import '~styles/index.css';
import * as i1 from '@angular/common/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as i0 from '@angular/core';
import { Injectable, Component, Input, EventEmitter, Output, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { __awaiter } from 'tslib';
import * as echarts from 'echarts';
import * as simpleTransform from 'echarts-simple-transform';
import { Realtime, FetchClient } from '@c8y/client';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { NgxEchartsModule } from 'ngx-echarts';

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
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        this.options = {
            headers: this.httpHeaders,
        };
        this.token = 'bmVlcnUuYXJvcmFAc29mdHdhcmVhZy5jb206TWFuYWdlQDA5ODc=';
        this.httpHeaders.append("Authorization", "Bearer " + this.token);
    }
    getAPIData(apiUrl) {
        console.log('options', this.options);
        // if(apiUrl.indexOf('smart-equipment.eu-latest.cumulocity.com')!=-1){
        //   return this.http.get(apiUrl,this.options);
        // } else {
        return this.http.get(apiUrl);
        // }
        // const response = await this.fetchClient.fetch('service/datahub/dremio/api/v3/job/1e1826e5-0e7d-f38c-61b7-ce059c715700/results');
        // const data = await response.json();
        // return this.fetchClient.fetch('service/datahub/dremio/api/v3/job/1e1826e5-0e7d-f38c-61b7-ce059c715700/results');
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

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function extractValueFromJSON(keyArr, parent) {
    let keysArray = Array.isArray(keyArr) ? keyArr : [keyArr];
    let resultArray = [];
    for (let keyStr of keysArray) {
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
    constructor(chartService, realTimeService, fetchClient) {
        this.chartService = chartService;
        this.realTimeService = realTimeService;
        this.fetchClient = fetchClient;
        this.chartOption = {};
        this.allSubscriptions = [];
        this.realtime = true;
        this.deviceId = '';
        this.isDatahubPostCall = false;
    }
    ngOnInit() {
        // this.createChart(this.config);
        // this.createChart();
    }
    dataFromUser(userInput) {
        this.createChart(userInput);
    } // end of dataFromUser()
    //create variables for all ChartConfig like value type, apidata from url etc to store the data from user
    // create chart
    reloadData(userInput) {
        this.createChart(userInput);
    }
    //createChart function is used to create chart with the help of echart library
    createChart(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            let chartDom = document.getElementById('chart-container');
            let myChart = echarts.init(chartDom);
            myChart.showLoading();
            // let d = this.realtTimeMeasurements(6889031);
            // const response = await this.fetchClient.fetch('service/datahub/dremio/api/v3/job/1e1826e5-0e7d-f38c-61b7-ce059c715700/results');
            if (userInput.showApiInput) {
                this.serviceData = yield this.chartService.getAPIData(userInput.apiUrl).toPromise();
            }
            else if (userInput.showDatahubInput) {
                const sqlReqObject = {
                    "sql": userInput.sqlQuery,
                    "limit": 100,
                    "format": "PANDAS"
                };
                const response = yield this.fetchClient.fetch(userInput.apiUrl, {
                    body: JSON.stringify(sqlReqObject),
                    method: 'POST'
                });
                this.serviceData = yield response.json();
                this.isDatahubPostCall = true;
            }
            else {
                console.log('No Datasource selected');
            }
            if (this.serviceData) {
                console.log('data from API', this.serviceData);
                console.log('datahub post', this.isDatahubPostCall);
                // }
                // this.chartService.getAPIData(userInput.apiUrl).subscribe((response) => {
                myChart.hideLoading();
                // this.serviceData = response;
                // this.serviceData = data;
                console.log('userInput', userInput);
                if (userInput.aggrList.length === 0 && !this.isDatahubPostCall) {
                    //calls for API without Aggregation
                    if (userInput.type === 'pie') {
                        this.seriesData = this.getPieChartSeriesData(userInput);
                        this.chartOption = {
                            title: {
                                text: userInput.title
                            },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                top: '10%',
                                type: 'scroll',
                                formatter: function (name) {
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                        console.log('pie without aggr', this.chartOption);
                    }
                    // End of piechart for API
                    else if (userInput.type === 'polar') {
                        this.seriesData = this.getPolarChartSeriesData(userInput);
                        this.chartOption = {
                            title: {
                                text: userInput.title
                            },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                top: '10%',
                                type: 'scroll',
                                formatter: function (name) {
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                        // console.log("NORMAL POLAR CHart Option ", this.chartOption)
                    }
                    // End of Polar CHart for API
                    else if (userInput.type === 'scatter') {
                        let xAxisObject, yAxisObject;
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
                                text: userInput.title
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            dataZoom: this.showZoomFeature(userInput.sliderZoom),
                            series: this.seriesData
                        };
                        console.log('scatter option', this.chartOption);
                    } //End of Scatter Chart for API
                    else if (userInput.type === 'radar') {
                        this.seriesData = this.getRadarSeriesData(userInput);
                        this.chartOption = {
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                top: '10%',
                                type: 'scroll',
                                formatter: function (name) {
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
                                        // uppercase the first character
                                        .replace(/^./, function (str) { return str.toUpperCase(); });
                                    a.trim();
                                    return a;
                                },
                            },
                            tooltip: {
                                trigger: 'item',
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
                            },
                            series: this.seriesData,
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            }
                        };
                        console.log(this.chartOption);
                    } // End of Radar CHart for API
                    else if ((userInput.type === 'line' || userInput.type === 'bar') && (userInput.layout != 'simpleHorizontalBar' && userInput.layout != 'stackedHorizontalBar')) {
                        this.seriesData = this.getSeriesData(userInput);
                        let xAxisName, yAxisName;
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
                            },
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                top: '10%',
                                type: 'scroll',
                                formatter: function (name) {
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                                name: xAxisName
                            },
                            yAxis: {
                                type: this.getYAxisType(userInput),
                                name: yAxisName
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
                        console.log('Simple bar or line', this.chartOption);
                    }
                    // End of Simple Line,Simple Bar,Stacked Line And Stacked Bar for API
                    else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
                        console.log('horizontal chart chosen!!', userInput.aggrList.length);
                        let xAxisName, yAxisName;
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
                                        let test = name.split('.').slice(-1);
                                        let a = 
                                        // name.split(/(?=[A-Z])/).join(' ');
                                        test[0].replace(/([A-Z])/g, ' $1')
                                            // uppercase the first character
                                            .replace(/^./, function (str) { return str.toUpperCase(); });
                                        return a;
                                    },
                                    type: 'scroll',
                                },
                                dataZoom: this.showZoomFeature(userInput.sliderZoom),
                                xAxis: {
                                    name: xAxisName,
                                    // nameLocation: 'middle',
                                    // nameGap: 50,
                                    type: this.getXAxisType(userInput),
                                },
                                yAxis: {
                                    name: yAxisName,
                                    // nameLocation: 'middle',
                                    // nameGap: 150,
                                    type: this.getYAxisType(userInput),
                                    data: this.serviceData[userInput.listName].map(function (item) {
                                        const val = extractValueFromJSON(userInput.yAxisDimension, item);
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
                        console.log('horizontal chart options', this.chartOption);
                    }
                    // End of Horizontal Bar & Stacked Horizontal Bar
                } // End of API calls with JSON Response without Aggregation
                else if (userInput.aggrList.length === 0 && this.isDatahubPostCall) {
                    // calls for Datahub without Aggregation
                    const resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                    console.log('resultDeimenions', resultDimension);
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
                    //End of Response Data extraction
                    console.log('Extracted Service Data', this.serviceData);
                    if (userInput.type === 'bar' || userInput.type === 'line') {
                        dimensions = this.getDatasetDimensions(userInput);
                        let yDimensions, xDimensions;
                        let yAxisName = '', xAxisName = '';
                        // if (userInput.type === 'bar' || userInput.type === 'line') {
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
                                    // dimensions: dimensions,
                                    source: this.serviceData
                                }
                            ],
                            title: {
                                text: userInput.title
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                        console.log('encode data', encodeData);
                        console.log('datahub bar without aggregation', this.chartOption);
                    } // End of Bar,Line Chart without Aggregation for Datahub
                    else if (userInput.type === 'scatter') {
                        dimensions = this.getDatasetDimensions(userInput);
                        if (dimensions.indexOf(userInput.groupBy) === -1) {
                            dimensions.push(userInput.groupBy);
                        }
                        let xAxisName = '', yAxisName = '';
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
                                    // dimensions: dimensions,
                                    source: this.serviceData
                                }
                            ],
                            title: {
                                text: userInput.title
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                                // data: this.serviceData[userInput.listName].map(function (item) {
                                //   return item[userInput.xAxisDimension];
                                // }),
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
                        console.log('scatter option transformation', this.chartOption);
                    } //End of Scatter Chart without Aggregation for Datahub
                    else if (userInput.type === 'pie') {
                        dimensions = [userInput.pieSlicenName, userInput.pieSliceValue];
                        encodeData = this.getEncodeData(userInput, datasetId);
                        this.chartOption = {
                            dataset: [
                                {
                                    id: 'raw_data',
                                    // dimensions: dimensions,
                                    source: this.serviceData
                                },
                            ],
                            title: {
                                text: userInput.title
                            },
                            tooltip: {
                                trigger: "item",
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
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
                    } // End of Pie chart without Aggregation for Datahub
                    else if (userInput.type === 'polar') {
                        let yDimensions, xDimensions;
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
                                    // dimensions: dimensions,
                                    source: this.serviceData
                                },
                            ],
                            title: {
                                text: userInput.title
                            },
                            // legend: {},
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
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
                        // console.log("Aggregate POLAR CHart Option ", this.chartOption)
                    } // End of Polar Chart Without Aggregation for Datahub
                    else if (userInput.type === 'radar') {
                        dimensions = [...userInput.radarDimensions];
                        this.seriesData = this.getRadarSeriesData(userInput);
                        let indexOfXDimension = this.serviceData[0].indexOf(userInput.xAxisDimension);
                        let indicatorData = [];
                        for (let i = 1; i < this.serviceData.length; i++) {
                            indicatorData.push({ name: this.serviceData[i][indexOfXDimension] });
                        }
                        // encodeData = this.getEncodeData(userInput, datasetId);
                        this.chartOption = {
                            legend: {
                                icon: userInput.legend.icon,
                                width: 330,
                                top: '10%', left: 'left',
                                type: 'scroll',
                                formatter: function (name) {
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                                indicator: indicatorData
                            },
                            series: this.seriesData,
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            }
                        };
                        console.log('datahub radar without aggregation', this.chartOption);
                    } // End of Radar Chart without Aggregation for Datahub
                } // ENd of Datahub Calls Response without Aggregation
                else if (userInput.aggrList.length > 0) {
                    // calls for API & Datahub with Aggregation
                    echarts.registerTransform(simpleTransform.aggregate);
                    const resultDimension = this.getResultDimesions(userInput.aggrList, userInput.groupBy);
                    console.log('resultDeimenions', resultDimension);
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
                    } //End of Response Data extraction
                    console.log('Extracted Service Data', this.serviceData);
                    if (userInput.type === 'bar' || userInput.type === 'line') {
                        // dimensions = this.getDatasetDimensions(userInput);
                        let yDimensions, xDimensions;
                        let xAxisName = '', yAxisName = '';
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
                                text: userInput.title
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
                                //   axisLine: {
                                //     onZero: false // This is important, so x axis can start from non-zero number
                                // },import { element } from 'protractor';
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                        console.log('encode data', encodeData);
                        console.log('aggregate bar', this.chartOption);
                    } //End of Bar,Line Chart with Aggregation for datahub and API
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
                        let xAxisName = '', yAxisName = '';
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
                                text: userInput.title
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
                                // data: this.serviceData[userInput.listName].map(function (item) {
                                //   return item[userInput.xAxisDimension];
                                // }),
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
                                    // name.split(/(?=[A-Z])/).join(' ');
                                    test[0].replace(/([A-Z])/g, ' $1')
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
                        console.log('scatter option transformation', this.chartOption);
                    } //End of Scatter Chart with Aggregation for datahub and API
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
                                text: userInput.title
                            },
                            tooltip: {
                                trigger: "item",
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
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
                    } //End of Pie Chart with Aggregation for datahub and API
                    else if (userInput.type === 'polar') {
                        let yDimensions, xDimensions;
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
                                text: userInput.title
                            },
                            // legend: {},
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
                                    let test = name.split('.').slice(-1);
                                    let a = 
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
                        // console.log("Aggregate POLAR CHart Option ", this.chartOption)
                    } // End of Polar Chart with Aggregation for datahub and API
                    // else if (userInput.type === 'radar') {
                    //   // this code will not work as Apache does not support aggregation with radar
                    //   if (this.isDatahubPostCall) {
                    //     dimensions = null;
                    //   } else {
                    //     dimensions = [...userInput.radarDimensions];
                    //   }
                    //   encodeData = this.getEncodeData(userInput, datasetId);
                    //   this.chartOption = {
                    //     dataset: [
                    //       {
                    //         id: 'raw_data',
                    //         dimensions: dimensions,
                    //         source: this.serviceData
                    //       },
                    //       {
                    //         id: '_aggregate',
                    //         fromDatasetId: 'raw_data',
                    //         transform: [
                    //           {
                    //             type: 'ecSimpleTransform:aggregate',
                    //             config: {
                    //               resultDimensions:
                    //                 resultDimension,
                    //               groupBy: userInput.groupBy
                    //             },
                    //             print: true
                    //           }
                    //         ]
                    //       }
                    //     ],
                    //     legend: {
                    //       icon: userInput.legend.icon,
                    //       width: 330,
                    //       type: 'scroll'
                    //     },
                    //     tooltip: {
                    //       trigger: 'item',
                    //     },
                    //     radar: {
                    //       indicator: this.serviceData[userInput.listName].map(function (item) {
                    //         return { name: item[userInput.xAxisDimension] };
                    //       }),
                    //     },
                    //     series: this.seriesData,
                    //     toolbox: {
                    //       feature: {
                    //         saveAsImage: {}
                    //       }
                    //     }
                    //   }
                    // } // End of Radar Chart with Aggregation for datahub and API
                } // End of calls for API & Datahub with Aggregation
                // End of chartOptions
                // })
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
        let test = input.split('.').slice(-1);
        let a = test[0].replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function (str) { return str.toUpperCase(); });
        return a.trim();
    }
    getEncodeData(userInput, datasetId, xDimensions, yDimensions) {
        if (userInput.type === "polar") {
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
                            // name: userInput.xAxisDimension,
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
                    const xAxisDimensions = userInput.xAxisDimension.split(',');
                    let xAxisData = [];
                    for (let i in xAxisDimensions) {
                        xAxisData[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            datasetId: datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: xAxisDimensions[i],
                                tooltip: [xAxisDimensions[i], userInput.yAxisDimension]
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
                    }
                    return xAxisData;
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
                    const yAxisDimensions = userInput.yAxisDimension.split(',');
                    let yAxisData = [];
                    for (let i in yAxisDimensions) {
                        yAxisData[i] = {
                            type: userInput.type,
                            symbolSize: userInput.scatterSymbolSize,
                            datasetId: datasetId,
                            encode: {
                                y: userInput.yAxisDimension,
                                x: yAxisDimensions[i],
                                tooltip: [yAxisDimensions[i], userInput.yAxisDimension]
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
                    }
                    return yAxisData;
                } // End of else part of YAxisDimension
            }
            // return [{
            //   // name: userInput.xAxisDimension,
            //   type: userInput.type,
            //   symbolSize: userInput.scatterSymbolSize,
            //   datasetId: datasetId,
            //   encode: {
            //     y: userInput.yAxisDimension,
            //     x: userInput.xAxisDimension,
            //     tooltip: [userInput.xAxisDimension, userInput.yAxisDimension]
            //   },
            // }]
        }
        else if (userInput.type === 'radar') {
            const dimensions = userInput.radarDimensions.split(',');
            const dimensionRecord = dimensions.reduce((acc, dimension) => {
                acc[dimension] = [];
                return acc;
            }, {});
            this.serviceData[userInput.listName].map(function (item) {
                Object.keys(item).forEach(key => {
                    if (dimensionRecord[key]) {
                        dimensionRecord[key].push(item[key]);
                    }
                });
            });
            let resultARR = Object.values(dimensionRecord);
            const result1 = Object.keys(dimensionRecord).map(key => ({
                name: key,
                value: dimensionRecord[key]
            }));
            return [{
                    name: userInput.listName,
                    type: 'radar',
                    data: result1
                }];
        }
        else if (userInput.type === "bar" && (userInput.layout === 'simpleBar' || userInput.layout === 'stackedBar')) {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId: datasetId,
                        // stack:'a',
                        name: yDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                            // itemName: ['productName']
                        }
                    }];
            }
            else {
                let yAxisData = [];
                for (let i in yDimensions) {
                    yAxisData[i] = {
                        type: userInput.type,
                        datasetId: datasetId,
                        stack: this.getStackName(userInput.stack, yDimensions[i]),
                        name: yDimensions[i],
                        encode: {
                            x: xDimensions,
                            y: yDimensions[i]
                            // itemName: ['productName']
                        }
                    };
                } //end of for block
                return yAxisData;
            }
        }
        else if (userInput.type === "bar" && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
            if (userInput.xAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId: datasetId,
                        // stack:'a',
                        name: xDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                            // itemName: ['productName']
                        }
                    }];
            }
            else {
                let xAxisData = [];
                for (let i in xDimensions) {
                    xAxisData[i] = {
                        type: userInput.type,
                        datasetId: datasetId,
                        stack: this.getStackName(userInput.stack, xDimensions[i]),
                        name: xDimensions[i],
                        encode: {
                            x: xDimensions[i],
                            y: yDimensions
                            // itemName: ['productName']
                        }
                    };
                } //end of for block
                return xAxisData;
            }
        }
        else if (userInput.type === "line") {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId: datasetId,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area,
                        // stack:'a',
                        name: yDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                            // itemName: ['productName']
                        }
                    }];
            }
            else {
                let yAxisData = [];
                for (let i in yDimensions) {
                    yAxisData[i] = {
                        type: userInput.type,
                        datasetId: datasetId,
                        smooth: userInput.smoothLine,
                        areaStyle: userInput.area,
                        name: yDimensions[i],
                        encode: {
                            x: xDimensions,
                            y: yDimensions[i]
                            // itemName: ['productName']
                        }
                    };
                } //end of for block
                return yAxisData;
            }
        }
        else if (userInput.type === "pie") {
            let convradius = userInput.radius.split(',');
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
    }
    // getScatterChartSeriesData function is used to create series data for scatter chart
    getScatterChartSeriesData(userInput) {
        // const result = [];
        // this.serviceData[userInput.listName].map(function (item) {
        //   const currentResult = [];
        //   currentResult.push(item[userInput.xAxisDimension]);
        //   currentResult.push(item[userInput.yAxisDimension]);
        //   result.push(currentResult);
        // });
        if (userInput.layout === 'horizontalScatter') {
            if (userInput.xAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        // data: result,
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
                const xAxisDimensions = userInput.xAxisDimension.split(',');
                let xAxisData = [];
                for (let i in xAxisDimensions) {
                    xAxisData[i] = {
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        // data: result,
                        data: this.serviceData[userInput.listName].map(function (item) {
                            return item[xAxisDimensions[i]];
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
                }
                return xAxisData;
            } // End of else part of XAxisDimension
        }
        else {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        // data: result,
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
                const yAxisDimensions = userInput.yAxisDimension.split(',');
                let yAxisData = [];
                for (let i in yAxisDimensions) {
                    yAxisData[i] = {
                        type: userInput.type,
                        symbolSize: userInput.scatterSymbolSize,
                        // data: result,
                        data: this.serviceData[userInput.listName].map(function (item) {
                            return item[yAxisDimensions[i]];
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
                }
                return yAxisData;
            } // End of else part of YAxisDimension
        }
    }
    // getPolarChartSeriesData function is used to create series data for polar chart
    getPolarChartSeriesData(userInput) {
        const result = [];
        this.serviceData[userInput.listName].map(function (item) {
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
        console.log('dimensions', dimensions);
        if (userInput.listName in this.serviceData) {
            this.serviceData[userInput.listName].map(function (item) {
                Object.keys(item).forEach(key => {
                    if (dimensionRecord[key]) {
                        dimensionRecord[key].push(item[key]);
                    }
                });
            });
        }
        else {
            let indexes = dimensions.map((v, index) => {
                let val = v;
                return { key: val, value: this.serviceData[0].indexOf(v) };
            });
            for (let i = 1; i < this.serviceData.length; i++) {
                indexes.forEach(element => {
                    dimensionRecord[element.key].push(this.serviceData[i][element.value]);
                });
            }
        }
        // let resultARR = Object.values(dimensionRecord)
        const result1 = Object.keys(dimensionRecord).map(key => ({
            name: key,
            value: dimensionRecord[key]
        }));
        if (userInput.listName in this.serviceData) {
            return [{
                    name: userInput.listName,
                    type: 'radar',
                    data: result1
                }];
        }
        else {
            return [{
                    // name: userInput.,
                    type: 'radar',
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
        let indexes = dimensions.map((v, index) => {
            let val = v;
            return { key: val, value: dataDim.indexOf(v) };
        });
        arr.map(function (item, index) {
            console.log('item ', item, '   index ', index);
            indexes.keys.forEach(element => {
                dimensionRecord[element.key].push(item[element.value]);
            });
        });
    }
    //getPieChartSeriesData function is used to create series data for pie chart
    getPieChartSeriesData(userInput) {
        //convert comma separated string userInput.radius to array
        let convradius = userInput.radius.split(',');
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
                    // label: {
                    //   show: true,
                    //   fontSize: '30',
                    //   fontWeight: 'bold'
                    // }
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: this.serviceData[userInput.listName].map(function (item) {
                    //take val from userinput.pieslice value and return it
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
                        name: nam
                    };
                }),
            }];
    }
    //getseriesdata recieves userinput and returns seriesdata
    //seriesdata is an array of objects
    getSeriesData(userInput) {
        if (userInput.yAxisDimension.split(',').length === 1) {
            return [{
                    name: userInput.listName,
                    // data as servicedata's userInput.listName from userinput yaxis dimension without using map function
                    data: this.serviceData[userInput.listName].map(function (item) {
                        return item[userInput.yAxisDimension];
                    }),
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                }];
        }
        else {
            const yAxisDimensions = userInput.yAxisDimension.split(',');
            let yAxisData = [];
            for (let i in yAxisDimensions) {
                yAxisData[i] = {
                    name: yAxisDimensions[i],
                    stack: this.getStackName(userInput.stack, yAxisDimensions[i]),
                    emphasis: {
                        focus: 'series'
                    },
                    data: this.serviceData[userInput.listName].map(function (item) {
                        return item[yAxisDimensions[i]];
                    }),
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                };
            } //end of for block
            return yAxisData;
        }
    }
    // Gets the dimensions for dataset
    getDatasetDimensions(userInput) {
        let yDimensions, xDimensions, dimensionArr = [];
        // if (userInput.type === 'bar' || userInput.type === 'line') {
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
        for (let x in stackData) {
            let values = stackData[x].stackValues.split(',');
            for (let i in values) {
                if (values[i] === dimensionName) {
                    result = stackData[x].stackName;
                    return result;
                }
            }
        }
    }
    //Get the dimensions and method array for aggregation
    // List comes from aggregate config and conatins both method and dimension name
    //We also need group by to be included as a dimension but without a method
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
    // Get data for horizontal Bar chart
    getHorizontalSeriesData(userInput) {
        if (userInput.xAxisDimension.split(',').length === 1) {
            return [{
                    name: userInput.listName,
                    data: this.serviceData[userInput.listName].map(function (item) {
                        const val = extractValueFromJSON(userInput.xAxisDimension, item);
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
            const xAxisDimensions = userInput.xAxisDimension.split(',');
            let xAxisData = [];
            for (let i in xAxisDimensions) {
                xAxisData[i] = {
                    name: xAxisDimensions[i],
                    stack: this.getStackName(userInput.stack, xAxisDimensions[i]),
                    label: {
                        show: userInput.showLabel
                    },
                    emphasis: {
                        // focus:'series',
                        label: {
                            show: true
                        },
                    },
                    data: this.serviceData[userInput.listName].map(function (item) {
                        // return item[yAxisDimensions[i]];
                        const val = extractValueFromJSON(xAxisDimensions[i], item);
                        return val;
                    }),
                    // markPoint: {
                    //   data: [
                    //     { type: 'max', name: 'Max' },
                    //     { type: 'min', name: 'Min' }
                    //   ]
                    // },
                    // markLine: {
                    //   data: [{ type: 'average', name: 'Avg' }]
                    // }
                    // ,
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                };
            } //end of for block
            return xAxisData;
        }
    }
}
GpSmartEchartWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-gp-smart-echart-widget',
                template: "<!-- <p> -->\r\n\r\n    <!-- <lib-gp-smart-echart-widget (configData)=\"dataFromUser($event)\"></lib-gp-smart-echart-widget> -->\r\n\r\n     <!-- <app-smart-chart-config (configData)=\"dataFromUser($event)\"></app-smart-chart-config> -->\r\n\r\n<!--</p> -->\r\n\r\n<!-- <div> -->\r\n\r\n    <div style=\"display: block\">\r\n\r\n        <div id=\"chart-container\" echarts [options]=\"chartOption\" class=\"demo-chart\"\r\n        ></div>\r\n\r\n    </div>\r\n\r\n<!-- </div> -->",
                styles: ['gp-smart-echart-widget.component.css']
            },] }
];
GpSmartEchartWidgetComponent.ctorParameters = () => [
    { type: GpSmartEchartWidgetService },
    { type: Realtime },
    { type: FetchClient }
];
GpSmartEchartWidgetComponent.propDecorators = {
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
        this.config = {
            listName: '',
            title: 'DATA CHART',
            pieSlicenName: 'Date',
            pieSliceValue: 'PhoneSales',
            type: '',
            layout: '',
            dataSource: '',
            dataSourceValue: '',
            xAxis: '',
            yAxis: '',
            smoothLine: false,
            apiUrl: '',
            area: false,
            yAxisDimension: 'QuarterSales',
            radarDimensions: 'count,costOfRepair',
            addStack: false,
            showApiInput: false,
            stack: [],
            stackList: Stack[''],
            aggrArr: [],
            aggrList: AggregateData[''],
            // groupBy: '',
            legend: {
                icon: '',
                width: 330,
                type: 'scroll'
            },
            radius: []
        };
        // @Input() config: ChartConfig = {
        //   listName: '',
        //   title: 'DATA CHART',
        //   pieSlicenName: '',
        //   pieSliceValue: '',
        //   type: '',
        //   layout: '',
        //   dataSource: '',
        //   dataSourceValue: '',
        //   xAxis: '',
        //   yAxis: '',
        //   smoothLine: false,
        //   apiUrl: '',
        //   area: false,
        //   yAxisDimension: 'Temperature',
        //   radarDimensions: '',
        //   addStack: false,
        //   showApiInput: false,
        //   showDatahubInput: false,
        //   stack: [],
        //   stackList: Stack[''],
        //   aggrArr:[],
        //   aggrList: AggregateData[''],
        //   // groupBy: '',
        //   legend: {
        //     icon: '',
        //     width: 330,
        //     type: 'scroll'
        //   },
        //   radius: []
        // };
        //create output decorator to emit data
        this.chartData = chartValues;
        this.isGroupByInAggregate = false;
        this.isAggrAdded = false;
        this.configData = new EventEmitter();
    }
    ngOnInit() {
        this.aggregationMethods = chartValues.aggregateMethod;
        this.config.xAxis = 'Date';
        this.config.xAxis = 'value';
        this.config.xAxisDimension = 'PhoneSales';
        this.config.yAxisDimension = 'QuarterSales';
        this.config.apiUrl = 'https://democenter.gateway.webmethodscloud.com/gateway/ConnectedStoreAPIs/1.0/ConnectedStoreAPIs/getQuarterlySales';
        this.config.legend = {
            icon: 'diamond',
            top: '10%',
            type: 'scroll'
        };
        this.config.listName = 'SalesData';
        this.config.aggrList = [];
        // this.config.xAxisDimension = 'time';
        // this.config.yAxisDimension = 'c8y_Temperature.T.value';
        // this.config.sqlQuery = 'select * from t664142085Space.temperature';
        // this.config.apiUrl = 'service/datahub/sql?version=v1';
        // this.config.legend = {
        //   icon: 'diamond',
        //   top: '10%',
        //   type: 'scroll'
        // }
        // this.config.listName = 'rows';
        // this.config.aggrList = [];
    }
    //add another stack to the stackList
    //if stackList is empty, add total to the stackList
    //if stackList is not empty, add another stack to the stackList
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
    deleteStackValue(stack, index) {
        this.config.stackList.splice(index, 1);
    }
    //updateStack is called when the user changes the type of chart
    //updateStack is called when the user changes the layout of the chart
    //updateStack is called when the user changes the data source of the chart
    updateStack() {
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
    onSelection(value) {
        this.chartData.chartLayout.filter(val => {
            if (value === val.id) {
                this.chartLayoutData = val.layout;
            }
        });
        this.config.addStack = false;
    }
    onLayoutSelection(value) {
        if (value === 'simpleBar' || value === 'stackedBar' || value === 'simple' || value === "stacked" || value === 'simpleScatter') {
            for (let val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = true;
                }
            }
            for (let val of this.chartData.xAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
        }
        else if (value === 'simpleHorizontalBar' || value === 'stackedHorizontalBar' || value === 'horizontalScatter') {
            for (let val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
            for (let val of this.chartData.xAxisType) {
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
    // if onSelection, onLayoutSelection, dataSourceSelection is called, then submit data and emit config
    SubmitData() {
        // console.log('config', this.config);
        this.config.aggrList.filter(element => {
            if (element.aggrDimesnion === this.config.groupBy) {
                this.isGroupByInAggregate = true;
            }
            else {
                this.isGroupByInAggregate = false;
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
    }
}
SmartChartConfigComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-smart-chart-config',
                template: "<div class=\"form-group\">\r\n    <div class=\"form-group\">\r\n        <label for=\"title\">Chart Title</label>\r\n        <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        <div >\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- <div class=\"form-group\">\r\n\r\n        <label for=\"xAxisName\">X-Axis Name</label>\r\n        <input class=\"form-control\" name=\"xAxisName\" type=\"text\" [(ngModel)]=\"config.xAxisName\">\r\n        <label for=\"yAxisName\">Y-Axis Name</label>\r\n        <input class=\"form-control\" name=\"yAxisName\" type=\"text\" [(ngModel)]=\"config.yAxisName\">\r\n    </div> -->\r\n    <div class=\"form-group\">\r\n        <form>\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                \r\n            </label>\r\n            <!-- <label for=\"device\" title=\"Device\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"device\" name=\"dataSource\" value=\"device\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>Device</span>\r\n\r\n            </label> -->\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\" placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n\r\n            </label>\r\n        </form>\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            &nbsp;&nbsp;<input class=\"form-control\" type=\"text\" [(ngModel)]=\"config.apiUrl\">\r\n        </ng-container>\r\n        <!-- <ng-container *ngIf=\"!config.showApiInput\">\r\n            &nbsp;&nbsp;\r\n        </ng-container> -->\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n            <div><textarea class=\"form-control\" placeholder=\"Sql Query\"  rows=\"3\" cols=\"30\" [(ngModel)]=\"config.sqlQuery\"></textarea>\r\n            </div>\r\n        </ng-container>\r\n      \r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"type\">Chart Type</label>\r\n        <div class=\"c8y-select-wrapper\">\r\n            <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                [(ngModel)]=\"config.type\">\r\n                <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type=='pie'\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n\r\n    <div *ngIf=\"config.type==='line'\">\r\n        <label title=\"Area\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n            <span></span>\r\n            <span>Area</span>\r\n        </label>\r\n        <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n            <span></span>\r\n            <span>Smooth Line</span>\r\n        </label><br>\r\n    </div>\r\n    <!-- dont show div if config.type is pie or radar -->\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type=='radar'\">\r\n        <label for=\"radarDimensions\">Radar Dimensions</label>\r\n        <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n    </div>\r\n    <!-- Dropdown for Aggregation / group by methods  -->\r\n    <div *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"form-group\">\r\n                <label for=\"aggregateDimension\">Dimension </label>\r\n                <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                    [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n\r\n                <label for=\"aggregation\">Method</label>\r\n                <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                    <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                    </option>\r\n                </select>\r\n\r\n\r\n                <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <div class=\"form-group\" *ngIf=\"isAggrAdded\">\r\n            <label for=\"groupByDimension\">Group By</label>\r\n            <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Dropdown for Legend Icon -->\r\n    <label for=\"legend\">Legend config</label>\r\n    <div class=\"c8y-select-wrapper\">\r\n        <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n            <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">{{legendType.value}}\r\n            </option>\r\n        </select>\r\n    </div>\r\n    <!-- Pie chart options -->\r\n    <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\">\r\n        <!-- <div id=\"pie-option-conatiner\" *ngIf=\"config.layout==='roseMode'\">\r\n            <label for=\"roseType\">RoseType</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select class=\"form-control\" name=\"roseType\" [(ngModel)]=\"config.roseType\">\r\n                    <option value=\"radius\">Radius\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div> -->\r\n        \r\n        <label for=\"radius\">Pie Radius</label>\r\n        <div>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"pieConfig\">Pie Slice Config</label>\r\n        <div>\r\n        <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\" [(ngModel)]=\"config.pieBorderRadius\">\r\n       \r\n        <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\"  value=\"0\"[(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n     </div>\r\n\r\n    <!-- For scatter bubble size -->\r\n    <div *ngIf=\"config.type==='scatter'\">\r\n        <label title=\"Bubble Size\"for=\"symbolSize\">Bubble Size</label>\r\n        <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n            [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n\r\n    </div>\r\n    <!-- stack container -->\r\n    <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\">\r\n        <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div style=\"margin-right: 0px;\">\r\n                <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                    <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                        (click)=\"stackAdded($event.target.checked)\">\r\n                    <span></span>\r\n                    <span>Add Stack</span>\r\n                </label>\r\n            </div>\r\n            <div *ngIf=\"config.addStack\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n        <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\" >\r\n            <span></span>\r\n            <span>Slider Zoom</span>\r\n        </label>\r\n        <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n            <span></span>\r\n            <span>Box Zoom</span>\r\n        </label>\r\n    </div>\r\n    <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"stackName\">Stack Name</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <label for=\"stackValues\">Stack Values</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div>\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n<!-- <div>\r\n    <input type=\"submit\" (click)=\"SubmitData()\" value=\"Submit\" />\r\n</div> -->",
                styles: ["div{margin-top:5px;margin-right:5px;margin-bottom:5px}.alertInput{border:2px solid red}"]
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