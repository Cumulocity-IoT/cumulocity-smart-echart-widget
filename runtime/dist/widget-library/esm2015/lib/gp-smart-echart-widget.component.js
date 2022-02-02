import { __awaiter } from "tslib";
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
import { Component, Input, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
import { isDevMode } from '@angular/core';
import * as simpleTransform from 'echarts-simple-transform';
import { FetchClient, Realtime, } from '@c8y/client';
import { extractValueFromJSON } from './util/extractValueFromJSON.util';
export class GpSmartEchartWidgetComponent {
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
            // const chartDom = document.getElementById('chart-container');
            // const myChart = echarts.init(chartDom);
            const myChart = echarts.init(this.chartDiv);
            myChart.showLoading();
            if (userInput.showApiInput) {
                this.serviceData = yield this.chartService.getAPIData(userInput.apiUrl).toPromise();
            }
            else if (userInput.showDatahubInput) {
                const sqlReqObject = {
                    sql: userInput.sqlQuery,
                    limit: 100,
                    format: 'PANDAS'
                };
                const response = yield this.fetchClient.fetch(userInput.apiUrl, {
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
                myChart.hideLoading();
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
                            };
                            yAxisObject = {
                                name: this.getFormattedName(userInput.yAxisDimension),
                                nameLocation: 'middle',
                                nameGap: 70,
                                data: this.serviceData[userInput.listName].map((item) => {
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
                                data: this.serviceData[userInput.listName].map((item) => {
                                    return item[userInput.xAxisDimension];
                                }),
                                type: this.getXAxisType(userInput),
                                boundaryGap: false,
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
                                radius: 100
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
                                },
                                yAxis: {
                                    // name: yAxisName,
                                    type: this.getYAxisType(userInput),
                                    data: this.serviceData[userInput.listName].map((item) => {
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
                            console.log('Baror Line chart for Datahub without aggregation', this.chartOption);
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
                                radius: 100
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
        else if (userInput.type === 'bar' && (userInput.layout === 'simpleBar' || userInput.layout === 'stackedBar')) {
            if (userInput.yAxisDimension.split(',').length === 1) {
                return [{
                        type: userInput.type,
                        datasetId,
                        name: yDimensions,
                        encode: {
                            x: xDimensions,
                            y: yDimensions
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                    }
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
                data: this.serviceData[userInput.listName].map((item) => {
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
                        name: nam
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
                    areaStyle: userInput.area
                }];
        }
        else {
            const yAxisDimensions = userInput.yAxisDimension.split(',');
            const yAxisData = [];
            yAxisDimensions.forEach((value, i) => {
                yAxisData[i] = {
                    name: yAxisDimensions[i],
                    stack: this.getStackName(userInput.stack, yAxisDimensions[i]),
                    emphasis: {
                        focus: 'series'
                    },
                    data: this.serviceData[userInput.listName].map((item) => {
                        console.log(item[yAxisDimensions[i]]);
                        // return val;
                        return item[yAxisDimensions[i]];
                    }),
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                };
            }); // end of for block
            return yAxisData;
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
            for (const i in values) {
                if (values[i] === dimensionName) {
                    result = stackData[x].stackName;
                    return result;
                }
            }
        }); // end of for loop of stackdata
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
    // Get data for horizontal Bar chart
    getHorizontalSeriesData(userInput) {
        if (userInput.xAxisDimension.split(',').length === 1) {
            return [{
                    name: this.getFormattedName(userInput.xAxisDimension),
                    data: this.serviceData[userInput.listName].map((item) => {
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
                    type: userInput.type,
                    smooth: userInput.smoothLine,
                    areaStyle: userInput.area
                };
            }); // end of for block
            return xAxisData;
        }
    }
}
GpSmartEchartWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-gp-smart-echart-widget',
                template: "\r\n\r\n\r\n    <div class=\"row col-xs-12 col-md-12\" style=\"display: block\">\r\n\r\n        <div  echarts [options]=\"chartOption\" class=\"demo-chart\"\r\n        #chartBox></div>\r\n\r\n    </div>\r\n",
                styles: ['gp-smart-echart-widget.component.css']
            },] }
];
GpSmartEchartWidgetComponent.ctorParameters = () => [
    { type: GpSmartEchartWidgetService },
    { type: Realtime },
    { type: FetchClient }
];
GpSmartEchartWidgetComponent.propDecorators = {
    mapDivRef: [{ type: ViewChild, args: ['chartBox', { static: true },] }],
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBNEIsS0FBSyxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUduQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxlQUFlLE1BQU0sMEJBQTBCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFdBQVcsRUFDWCxRQUFRLEdBQ1QsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFNeEUsTUFBTSxPQUFPLDRCQUE0QjtJQWF2QyxZQUFvQixZQUF3QyxFQUNsRCxlQUF5QixFQUFVLFdBQXdCO1FBRGpELGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUNsRCxvQkFBZSxHQUFmLGVBQWUsQ0FBVTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBUHJFLGdCQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUN0QixxQkFBZ0IsR0FBUSxFQUFFLENBQUM7UUFDckMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBRWQsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO0lBRStDLENBQUM7SUFDMUUsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENB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SyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUztxQkFDMUI7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLEtBQUssRUFBRTs0QkFDTCxJQUFJLEVBQUUsSUFBSTt5QkFDWDtxQkFDRjtvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ3RELE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0QsT0FBTyxHQUFHLENBQUM7b0JBQ2IsQ0FBQyxDQUFDO29CQUNGLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDcEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVO29CQUM1QixTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUk7aUJBQzFCLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBLG1CQUFtQjtZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtJQUNILENBQUM7OztZQXA1REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLDBOQUFzRDt5QkFDN0Msc0NBQXNDO2FBQ2hEOzs7WUFaUSwwQkFBMEI7WUFLakMsUUFBUTtZQURSLFdBQVc7Ozt3QkFVVixTQUFTLFNBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztxQkFDckMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBlY2hhcnRzIGZyb20gJ2VjaGFydHMnO1xyXG5pbXBvcnQgeyBFQ2hhcnRzT3B0aW9uIH0gZnJvbSAnZWNoYXJ0cyc7XHJcbmltcG9ydCB7IENoYXJ0Q29uZmlnIH0gZnJvbSAnLi9tb2RlbC9jb25maWcubW9kYWwnO1xyXG5pbXBvcnQgeyBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSB9IGZyb20gJy4vZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIHNpbXBsZVRyYW5zZm9ybSBmcm9tICdlY2hhcnRzLXNpbXBsZS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQge1xyXG4gIEZldGNoQ2xpZW50LFxyXG4gIFJlYWx0aW1lLFxyXG59IGZyb20gJ0BjOHkvY2xpZW50JztcclxuaW1wb3J0IHsgZXh0cmFjdFZhbHVlRnJvbUpTT04gfSBmcm9tICcuL3V0aWwvZXh0cmFjdFZhbHVlRnJvbUpTT04udXRpbCc7XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLWdwLXNtYXJ0LWVjaGFydC13aWRnZXQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZXM6IFsnZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEdwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBWaWV3Q2hpbGQoJ2NoYXJ0Qm94JywgeyBzdGF0aWM6IHRydWV9KSBwcm90ZWN0ZWQgbWFwRGl2UmVmOiBFbGVtZW50UmVmO1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogQ2hhcnRDb25maWc7XHJcbiAgc2VydmljZURhdGE7XHJcbiAgc2VyaWVzRGF0YTtcclxuICBjaGFydERhdGE7XHJcbiAgdXNlcklucHV0O1xyXG4gIGNoYXJ0T3B0aW9uOiBFQ2hhcnRzT3B0aW9uID0ge307XHJcbiAgcHJvdGVjdGVkIGFsbFN1YnNjcmlwdGlvbnM6IGFueSA9IFtdO1xyXG4gIHJlYWx0aW1lID0gdHJ1ZTtcclxuICBkZXZpY2VJZCA9ICcnO1xyXG4gIHByb3RlY3RlZCBjaGFydERpdjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgaXNEYXRhaHViUG9zdENhbGwgPSBmYWxzZTtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoYXJ0U2VydmljZTogR3BTbWFydEVjaGFydFdpZGdldFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWxUaW1lU2VydmljZTogUmVhbHRpbWUsIHByaXZhdGUgZmV0Y2hDbGllbnQ6IEZldGNoQ2xpZW50KSB7IH1cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuY2hhcnREaXYgPSB0aGlzLm1hcERpdlJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCh0aGlzLmNvbmZpZyk7XHJcbiAgICBcclxuICB9XHJcbiAgZGF0YUZyb21Vc2VyKHVzZXJJbnB1dDogQ2hhcnRDb25maWcpIHtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodXNlcklucHV0KTtcclxuICB9Ly8gZW5kIG9mIGRhdGFGcm9tVXNlcigpXHJcbiAgLy8gY3JlYXRlIHZhcmlhYmxlcyBmb3IgYWxsIENoYXJ0Q29uZmlnIGxpa2UgdmFsdWUgdHlwZSwgYXBpZGF0YSBmcm9tIHVybCBldGMgdG8gc3RvcmUgdGhlIGRhdGEgZnJvbSB1c2VyXHJcbiAgLy8gY3JlYXRlIGNoYXJ0XHJcbiAgcmVsb2FkRGF0YSh1c2VySW5wdXQ6IENoYXJ0Q29uZmlnKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNoYXJ0KHVzZXJJbnB1dCk7XHJcbiAgfVxyXG4gIC8vIGNyZWF0ZUNoYXJ0IGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIGNoYXJ0IHdpdGggdGhlIGhlbHAgb2YgZWNoYXJ0IGxpYnJhcnlcclxuICBhc3luYyBjcmVhdGVDaGFydCh1c2VySW5wdXQ/OiBDaGFydENvbmZpZykge1xyXG4gICAgLy8gY29uc3QgY2hhcnREb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcnQtY29udGFpbmVyJyk7XHJcbiAgICAvLyBjb25zdCBteUNoYXJ0ID0gZWNoYXJ0cy5pbml0KGNoYXJ0RG9tKTtcclxuICAgIGNvbnN0IG15Q2hhcnQgPSBlY2hhcnRzLmluaXQodGhpcy5jaGFydERpdik7XHJcbiAgICBteUNoYXJ0LnNob3dMb2FkaW5nKCk7XHJcbiAgICBpZiAodXNlcklucHV0LnNob3dBcGlJbnB1dCkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhID0gYXdhaXQgdGhpcy5jaGFydFNlcnZpY2UuZ2V0QVBJRGF0YSh1c2VySW5wdXQuYXBpVXJsKS50b1Byb21pc2UoKTtcclxuICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnNob3dEYXRhaHViSW5wdXQpIHtcclxuICAgICAgY29uc3Qgc3FsUmVxT2JqZWN0ID0ge1xyXG4gICAgICAgIHNxbDogdXNlcklucHV0LnNxbFF1ZXJ5LFxyXG4gICAgICAgIGxpbWl0OiAxMDAsXHJcbiAgICAgICAgZm9ybWF0OiAnUEFOREFTJ1xyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hDbGllbnQuZmV0Y2godXNlcklucHV0LmFwaVVybCwge1xyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNxbFJlcU9iamVjdCksXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgfSlcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgdGhpcy5pc0RhdGFodWJQb3N0Q2FsbCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ05vIERhdGFzb3VyY2Ugc2VsZWN0ZWQnKTsgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgbXlDaGFydC5oaWRlTG9hZGluZygpO1xyXG4gICAgICBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgIC8vIGNhbGxzIGZvciBBUEkgd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0UGllQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1BpZSBDaGFydCBGb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIHBpZWNoYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICBzdGFydEFuZ2xlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGl1c0F4aXM6IHtcclxuICAgICAgICAgICAgICBtaW46IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUG9sYXIgQ2hhcnQgRm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBQb2xhciBDSGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgbGV0IHhBeGlzT2JqZWN0OyBsZXQgeUF4aXNPYmplY3Q7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgICAgICB4QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB4QXhpc09iamVjdCxcclxuICAgICAgICAgICAgeUF4aXM6IHlBeGlzT2JqZWN0LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LmJveFpvb20sXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnU2NhdHRlciBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbikgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFNjYXR0ZXIgQ2hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6e1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6dXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcidcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgY29uZmluZTp0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRhcjoge1xyXG4gICAgICAgICAgICAgIGluZGljYXRvcjogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dIH07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgcmFkaXVzOjEwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdSYWRhciBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbikgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFJhZGFyIENIYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICgodXNlcklucHV0LnR5cGUgPT09ICdsaW5lJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicpXHJcbiAgICAgICAgICAmJiAodXNlcklucHV0LmxheW91dCAhPT0gJ3NpbXBsZUhvcml6b250YWxCYXInICYmIHVzZXJJbnB1dC5sYXlvdXQgIT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIGxldCB4QXhpc05hbWU7IGxldCB5QXhpc05hbWU7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICAvLyBuYW1lOiB4QXhpc05hbWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHlBeGlzTmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5ib3hab29tLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnU2ltcGxlIGJhciBvciBsaW5lIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgU2ltcGxlIExpbmUsU2ltcGxlIEJhcixTdGFja2VkIExpbmUgQW5kIFN0YWNrZWQgQmFyIGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgJiYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzaW1wbGVIb3Jpem9udGFsQmFyJyB8fCB1c2VySW5wdXQubGF5b3V0ID09PSAnc3RhY2tlZEhvcml6b250YWxCYXInKSkge1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZTsgbGV0IHlBeGlzTmFtZTtcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldEhvcml6b250YWxTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID1cclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgICBvdmVyZmxvdzogJ3RydW5jYXRlJyxcclxuICAgICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBvcmllbnQ6ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgLy8gbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHlBeGlzTmFtZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnSG9yaXpvbnRhbCBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIEhvcml6b250YWwgQmFyICYgU3RhY2tlZCBIb3Jpem9udGFsIEJhclxyXG4gICAgICB9IC8vIEVuZCBvZiBBUEkgY2FsbHMgd2l0aCBKU09OIFJlc3BvbnNlIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgZWxzZSBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIERhdGFodWIgd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdERpbWVuc2lvbiA9IHRoaXMuZ2V0UmVzdWx0RGltZXNpb25zKHVzZXJJbnB1dC5hZ2dyTGlzdCwgdXNlcklucHV0Lmdyb3VwQnkpO1xyXG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgbGV0IGVuY29kZURhdGE7XHJcbiAgICAgICAgY29uc3QgZGF0YXNldElkID0gbnVsbDtcclxuICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIGRhdGFodWIgaXNcclxuICAgICAgICAvLyBSZXN1bHQ6W1xyXG4gICAgICAgIC8vICAgXCJjb2x1bW5zXCI6Wydjb2xBJywnY29sQicsLi4uLCdjb2xOJ10sXHJcbiAgICAgICAgLy8gICBcImRhdGFcIjpbXHJcbiAgICAgICAgLy8gICAgIFtcIkExXCIsXCJCMVwiLC4uLixcIk4xXCJdLFxyXG4gICAgICAgIC8vICAgICBbXCJBMlwiLFwiQjJcIiwuLi4sXCJOMlwiXSxcclxuICAgICAgICAvLyAgICAgLi4uLFxyXG4gICAgICAgIC8vICAgICBbXCJBTlwiLFwiQk5cIiwuLi4sXCJOTlwiXVxyXG4gICAgICAgIC8vICAgXVxyXG4gICAgICAgIC8vIF1cclxuICAgICAgICAvLyBzb3VyY2Ugb2YgRGF0YXNldCBzaG91bGQgYmUgW1tjb2x1bW5zXSxbZGF0YXJvd3NdXVxyXG4gICAgICAgIHRoaXMuc2VydmljZURhdGEgPSBbdGhpcy5zZXJ2aWNlRGF0YS5jb2x1bW5zLCAuLi50aGlzLnNlcnZpY2VEYXRhLmRhdGFdXHJcbiAgICAgICAgLy8gRW5kIG9mIFJlc3BvbnNlIERhdGEgZXh0cmFjdGlvblxyXG4gICAgICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgfHwgdXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgbGV0IHlBeGlzTmFtZSA9ICcnOyBsZXQgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBzY2FsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0Jhcm9yIExpbmUgY2hhcnQgZm9yIERhdGFodWIgd2l0aG91dCBhZ2dyZWdhdGlvbicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgQmFyLExpbmUgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZSA9ICcnOyBsZXQgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1NjYXR0ZXIgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgU2NhdHRlciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lLCB1c2VySW5wdXQucGllU2xpY2VWYWx1ZV07XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJywgXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQaWUgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUGllIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCwgeERpbWVuc2lvbnMsIHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQb2xhciBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9ICAvLyBFbmQgb2YgUG9sYXIgQ2hhcnQgV2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLnVzZXJJbnB1dC5yYWRhckRpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4T2ZYRGltZW5zaW9uID0gdGhpcy5zZXJ2aWNlRGF0YVswXS5pbmRleE9mKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICBjb25zdCBpbmRpY2F0b3JEYXRhID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuc2VydmljZURhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW5kaWNhdG9yRGF0YS5wdXNoKHsgbmFtZTogdGhpcy5zZXJ2aWNlRGF0YVtpXVtpbmRleE9mWERpbWVuc2lvbl0gfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZTp7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDp1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJ1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGFyOiB7XHJcbiAgICAgICAgICAgICAgaW5kaWNhdG9yOiBpbmRpY2F0b3JEYXRhLFxyXG4gICAgICAgICAgICAgIHJhZGl1czoxMDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUmFkYXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUmFkYXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICB9IC8vIEVOZCBvZiBEYXRhaHViIENhbGxzIFJlc3BvbnNlIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgZWxzZSBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyBjYWxscyBmb3IgQVBJICYgRGF0YWh1YiB3aXRoIEFnZ3JlZ2F0aW9uXHJcbiAgICAgICAgZWNoYXJ0cy5yZWdpc3RlclRyYW5zZm9ybShzaW1wbGVUcmFuc2Zvcm0uYWdncmVnYXRlKTtcclxuICAgICAgICBjb25zdCByZXN1bHREaW1lbnNpb24gPSB0aGlzLmdldFJlc3VsdERpbWVzaW9ucyh1c2VySW5wdXQuYWdnckxpc3QsIHVzZXJJbnB1dC5ncm91cEJ5KTtcclxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xyXG4gICAgICAgIGxldCBlbmNvZGVEYXRhO1xyXG4gICAgICAgIGNvbnN0IGRhdGFzZXRJZCA9ICdfYWdncmVnYXRlJztcclxuICAgICAgICAvLyBFeHRyYWN0IHRoZSBzZXJ2aWNlIGRhdGEgYmFzZWQgb24gdGhlIHJlc3BvbnNlIHR5cGUgb2Ygd3RoZXJlIGNhbGwgaXMgbWFkZSB0byBEYXRhaHViIG9yIE90aGVyIEFQSVxyXG4gICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIGRhdGFodWIgaXNcclxuICAgICAgICAgIC8vIFJlc3VsdDpbXHJcbiAgICAgICAgICAvLyAgIFwiY29sdW1uc1wiOlsnY29sQScsJ2NvbEInLC4uLiwnY29sTiddLFxyXG4gICAgICAgICAgLy8gICBcImRhdGFcIjpbXHJcbiAgICAgICAgICAvLyAgICAgW1wiQTFcIixcIkIxXCIsLi4uLFwiTjFcIl0sXHJcbiAgICAgICAgICAvLyAgICAgW1wiQTJcIixcIkIyXCIsLi4uLFwiTjJcIl0sXHJcbiAgICAgICAgICAvLyAgICAgLi4uLFxyXG4gICAgICAgICAgLy8gICAgIFtcIkFOXCIsXCJCTlwiLC4uLixcIk5OXCJdXHJcbiAgICAgICAgICAvLyAgIF1cclxuICAgICAgICAgIC8vIF1cclxuICAgICAgICAgIC8vIHNvdXJjZSBvZiBEYXRhc2V0IHNob3VsZCBiZSBbW2NvbHVtbnNdLFtkYXRhcm93c11dXHJcbiAgICAgICAgICB0aGlzLnNlcnZpY2VEYXRhID0gW3RoaXMuc2VydmljZURhdGEuY29sdW1ucywgLi4udGhpcy5zZXJ2aWNlRGF0YS5kYXRhXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIEFQaSBjYWxscyBpcyBKU09OIG9iamVjdCB3aXRoIGtleSx2YWx1ZVxyXG4gICAgICAgICAgLy8gUmVzdWx0OiBbXHJcbiAgICAgICAgICAvLyAgIHtcclxuICAgICAgICAgIC8vICAgICBcImtleTFcIjogXCJ2YWwxXCIsXHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkyXCI6IFwidmFsMlwiLFxyXG4gICAgICAgICAgLy8gICB9LFxyXG4gICAgICAgICAgLy8gICB7XHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkxXCI6IFwidmFsMS4xXCIsXHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkyXCI6IFwidmFsMi4xXCIsXHJcbiAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgIC8vIF1cclxuICAgICAgICAgIHRoaXMuc2VydmljZURhdGEgPSB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV07XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUmVzcG9uc2UgRGF0YSBleHRyYWN0aW9uXHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnM7IGxldCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGxldCB4QXhpc05hbWUgPSAnJzsgbGV0IHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBzY2FsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHlBeGlzTmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBCYXIgb3IgTGluZSBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgQmFyLExpbmUgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5nZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCB4QXhpc05hbWUgPSAnJzsgbGV0IHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6IHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA1MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgU2NhdHRlciBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgU2NhdHRlciBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZSwgdXNlcklucHV0LnBpZVNsaWNlVmFsdWVdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzZWxlY3RlZDogeyBkZXRhaWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBQaWUgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFBpZSBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlQXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgc3RhcnRBbmdsZTogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRpdXNBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbWluOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvbGFyOiB7fSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHsgZGV0YWlsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQWdncmVnYXRlIFBvbGFyIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9ICAvLyBFbmQgb2YgUG9sYXIgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgIH0gIC8vIEVuZCBvZiBjYWxscyBmb3IgQVBJICYgRGF0YWh1YiB3aXRoIEFnZ3JlZ2F0aW9uXHJcbiAgICAgIC8vIEVuZCBvZiBjaGFydE9wdGlvbnNcclxuICAgIH0gLy8gRW5kIG9mIElGIGNvbmRpdGlvbiBjaGVja2luZyB3aGV0aGVyIHZhcmlhYmxlIHNlcnZpY2VEYXRhIGhhcyBzb21lIGRhdGEgb3Igbm90XHJcbiAgfVxyXG4gIGdldFhBeGlzVHlwZShpbnB1dCkge1xyXG4gICAgcmV0dXJuIGlucHV0LnhBeGlzO1xyXG4gIH1cclxuICBnZXRZQXhpc1R5cGUoaW5wdXQpIHtcclxuICAgIHJldHVybiBpbnB1dC55QXhpcztcclxuICB9XHJcbiAgZ2V0Q2hhcnRUeXBlKGlucHV0KSB7XHJcbiAgICByZXR1cm4gaW5wdXQudHlwZTtcclxuICB9XHJcbiAgZ2V0Rm9ybWF0dGVkTmFtZShpbnB1dCkge1xyXG4gICAgY29uc3QgdGVzdCA9IGlucHV0LnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgY29uc3QgYSA9IHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICByZXR1cm4gYS50cmltKCk7XHJcbiAgfVxyXG4gIGdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQ/LCB4RGltZW5zaW9ucz8sIHlEaW1lbnNpb25zPykge1xyXG4gICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW06ICdwb2xhcicsXHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC5sYXlvdXQsXHJcbiAgICAgICAgc2hvd1N5bWJvbDogdHJ1ZSxcclxuICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgIHJhZGl1czogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgYW5nbGU6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9XVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB4OiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgeEF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICAgIHhBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSxpKSA9PiB7XHJcbiAgICAgICAgICAgIHhBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgeDogeEF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogW3hBeGlzRGltZW5zaW9uc1tpXSwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBYQXhpc0RpbWVuc2lvblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB4OiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHlBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsaSkgPT4ge1xyXG4gICAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgIHg6IHlBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IFt5QXhpc0RpbWVuc2lvbnNbaV0sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgICAgfS8vIEVuZCBvZiBlbHNlIHBhcnQgb2YgWUF4aXNEaW1lbnNpb25cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdyYWRhcicpIHtcclxuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHVzZXJJbnB1dC5yYWRhckRpbWVuc2lvbnMuc3BsaXQoJywnKTtcclxuICAgICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgYWNjW2RpbWVuc2lvbl0gPSBbXTtcclxuICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICB9LCB7fSk7XHJcbiAgICAgIHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9uUmVjb3JkW2tleV0pIHtcclxuICAgICAgICAgICAgZGltZW5zaW9uUmVjb3JkW2tleV0ucHVzaChpdGVtW2tleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCByZXN1bHRBUlIgPSBPYmplY3QudmFsdWVzKGRpbWVuc2lvblJlY29yZClcclxuICAgICAgY29uc3QgcmVzdWx0MSA9IE9iamVjdC5rZXlzKGRpbWVuc2lvblJlY29yZCkubWFwKGtleSA9PiAoe1xyXG4gICAgICAgIG5hbWU6IGtleSxcclxuICAgICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV1cclxuICAgICAgfSkpO1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgJiYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzaW1wbGVCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkQmFyJykpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICBuYW1lOiB5RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB5RGltZW5zaW9ucy5hcnJheS5mb3JFYWNoKCh2YWx1ZSxpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHlEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgICAgbmFtZTogeURpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgbmFtZTogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeEF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeERpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB4RGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHhEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IC8vIGVuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICBuYW1lOiB5RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB5RGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSxpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1tpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IC8vIGVuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgY29uc3QgY29udnJhZGl1cyA9IHVzZXJJbnB1dC5yYWRpdXMuc3BsaXQoJywnKTtcclxuICAgICAgbGV0IHJvc2VWYWx1ZSA9ICcnOyBsZXQgc2xpY2VTdHlsZTtcclxuICAgICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdyb3NlTW9kZScpIHtcclxuICAgICAgICByb3NlVmFsdWUgPSAncm9zZSc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7fTtcclxuICAgICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPiAwICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID4gMCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXNcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyxcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICByYWRpdXM6IGNvbnZyYWRpdXMsXHJcbiAgICAgICAgcm9zZVR5cGU6IHJvc2VWYWx1ZSxcclxuICAgICAgICBhdm9pZExhYmVsT3ZlcmxhcDogZmFsc2UsXHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgICAgcG9zaXRpb246ICdjZW50ZXInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXRlbVN0eWxlOiBzbGljZVN0eWxlLFxyXG4gICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgc2hhZG93Qmx1cjogMTAsXHJcbiAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0LnBpZVNsaWNlTmFtZSxcclxuICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgIGl0ZW1OYW1lOiBbdXNlcklucHV0LnBpZVNsaWNlbk5hbWVdLFxyXG4gICAgICAgICAgdmFsdWU6IHVzZXJJbnB1dC5waWVTbGljZVZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBzZXJpZXMgZGF0YSBmb3Igc2NhdHRlciBjaGFydFxyXG4gIGdldFNjYXR0ZXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfV1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB4QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB4QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1beEF4aXNEaW1lbnNpb25zW2ldXTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGxvb3BcclxuICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBYQXhpc0RpbWVuc2lvblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeUF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLGkpID0+IHtcclxuICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBpdGVtW3lBeGlzRGltZW5zaW9uc1tpXV07XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBZQXhpc0RpbWVuc2lvblxyXG4gICAgfVxyXG4gIH1cclxuICAvLyBnZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBzZXJpZXMgZGF0YSBmb3IgcG9sYXIgY2hhcnRcclxuICBnZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50UmVzdWx0ID0gW107XHJcbiAgICAgIGN1cnJlbnRSZXN1bHQucHVzaChpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl0pO1xyXG4gICAgICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dKTtcclxuICAgICAgcmVzdWx0LnB1c2goY3VycmVudFJlc3VsdCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBbe1xyXG4gICAgICBjb29yZGluYXRlU3lzdGVtOiAncG9sYXInLFxyXG4gICAgICBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgIHR5cGU6IHVzZXJJbnB1dC5sYXlvdXQsXHJcbiAgICAgIHNob3dTeW1ib2w6IHRydWUsXHJcbiAgICAgIGRhdGE6IHJlc3VsdCxcclxuICAgICAgbGFiZWw6IHtcclxuICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgIH0sXHJcbiAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfV1cclxuICB9XHJcbiAgLy8gZ2V0UmFkYXJTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gZ2V0IHRoZSBkYXRhIGZyb20gc2VydmljZSBhbmQgc3RvcmUgaXQgaW4gc2VyaWVzRGF0YSB2YXJpYWJsZVxyXG4gIGdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB1c2VySW5wdXQucmFkYXJEaW1lbnNpb25zLnNwbGl0KCcsJyk7XHJcbiAgICBjb25zdCBkaW1lbnNpb25SZWNvcmQgPSBkaW1lbnNpb25zLnJlZHVjZSgoYWNjLCBkaW1lbnNpb24pID0+IHtcclxuICAgICAgYWNjW2RpbWVuc2lvbl0gPSBbXTtcclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIHt9KTtcclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvblJlY29yZFtrZXldKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvblJlY29yZFtrZXldLnB1c2goaXRlbVtrZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSBkaW1lbnNpb25zLm1hcCgodiwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB2YWwgPSB2O1xyXG4gICAgICAgIHJldHVybiB7IGtleTogdmFsLCB2YWx1ZTogdGhpcy5zZXJ2aWNlRGF0YVswXS5pbmRleE9mKHYpIH07XHJcbiAgICAgIH0pO1xyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuc2VydmljZURhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpbmRleGVzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBkaW1lbnNpb25SZWNvcmRbZWxlbWVudC5rZXldLnB1c2godGhpcy5zZXJ2aWNlRGF0YVtpXVtlbGVtZW50LnZhbHVlXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3VsdDEgPSBPYmplY3Qua2V5cyhkaW1lbnNpb25SZWNvcmQpLm1hcChrZXkgPT4gKHtcclxuICAgICAgbmFtZToga2V5LFxyXG4gICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV1cclxuICAgIH0pKTtcclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICB0eXBlOiAncmFkYXInLFxyXG4gICAgICAgIGRhdGE6IHJlc3VsdDFcclxuICAgICAgfV1cclxuICAgIH1cclxuICB9XHJcbiAgY3JlYXRlT2JqZWN0KGRhdGFEaW0sIGFyciwgZGltZW4pIHtcclxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBkaW1lbi5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbiAgICBjb25zdCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHZhbCA9IHY7XHJcbiAgICAgIHJldHVybiB7IGtleTogdmFsLCB2YWx1ZTogZGF0YURpbS5pbmRleE9mKHYpIH07XHJcbiAgICB9KTtcclxuICAgIGFyci5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGluZGV4ZXMua2V5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGRpbWVuc2lvblJlY29yZFtlbGVtZW50LmtleV0ucHVzaChpdGVtW2VsZW1lbnQudmFsdWVdKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8gZ2V0UGllQ2hhcnRTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIHNlcmllcyBkYXRhIGZvciBwaWUgY2hhcnRcclxuICBnZXRQaWVDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICAvLyBjb252ZXJ0IGNvbW1hIHNlcGFyYXRlZCBzdHJpbmcgdXNlcklucHV0LnJhZGl1cyB0byBhcnJheVxyXG4gICAgY29uc3QgY29udnJhZGl1cyA9IHVzZXJJbnB1dC5yYWRpdXMuc3BsaXQoJywnKTtcclxuICAgIGxldCByb3NlVmFsdWUgPSAnJzsgbGV0IHNsaWNlU3R5bGU7XHJcbiAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ3Jvc2VNb2RlJykge1xyXG4gICAgICByb3NlVmFsdWUgPSAncm9zZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7fVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID4gMCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID4gMCkge1xyXG4gICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1c1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyxcclxuICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFt7XHJcbiAgICAgIG5hbWU6IHVzZXJJbnB1dC5saXN0TmFtZSxcclxuICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgIHJhZGl1czogY29udnJhZGl1cyxcclxuICAgICAgcm9zZVR5cGU6IHJvc2VWYWx1ZSxcclxuICAgICAgYXZvaWRMYWJlbE92ZXJsYXA6IGZhbHNlLFxyXG4gICAgICBsYWJlbDoge1xyXG4gICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgcG9zaXRpb246ICdjZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpdGVtU3R5bGU6IHNsaWNlU3R5bGUsXHJcbiAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAvLyB0YWtlIHZhbCBmcm9tIHVzZXJpbnB1dC5waWVzbGljZSB2YWx1ZSBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgY29uc3QgdmFsID0gaXRlbVt1c2VySW5wdXQucGllU2xpY2VWYWx1ZV07XHJcbiAgICAgICAgbGV0IG5hbTtcclxuICAgICAgICBpZiAodXNlcklucHV0LnBpZVNsaWNlVmFsdWUgPT09IHVzZXJJbnB1dC5waWVTbGljZW5OYW1lKSB7XHJcbiAgICAgICAgICBuYW0gPSB1c2VySW5wdXQucGllU2xpY2VuTmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmFtID0gaXRlbVt1c2VySW5wdXQucGllU2xpY2VuTmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgICAgICBuYW1lOiBuYW1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgfV1cclxuICB9XHJcbiAgLy8gZ2V0c2VyaWVzZGF0YSByZWNpZXZlcyB1c2VyaW5wdXQgYW5kIHJldHVybnMgc2VyaWVzZGF0YVxyXG4gIC8vIHNlcmllc2RhdGEgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0c1xyXG4gIGdldFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsaSkgPT4ge1xyXG4gICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgIG5hbWU6IHlBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHlBeGlzRGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1beUF4aXNEaW1lbnNpb25zW2ldXSk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3lBeGlzRGltZW5zaW9uc1tpXV07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWFcclxuICAgICAgICB9XHJcbiAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEdldHMgdGhlIGRpbWVuc2lvbnMgZm9yIGRhdGFzZXRcclxuICBnZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpIHtcclxuICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zOyBsZXQgZGltZW5zaW9uQXJyID0gW107XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi55RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi54RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGltZW5zaW9uQXJyO1xyXG4gIH1cclxuICAvLyBpZiBzdGFja2RhdGEgaXMgZW1wdHkgdGhlbiByZXR1cm4gZGltZW5zaW9uTmFtZVxyXG4gIC8vIGVsc2UgaWYgc3RhY2tkYXRhIGlzIG5vdCBlbXB0eSB0aGVuIGNoZWNrIGlmIGRpbWVuc2lvbk5hbWUgaXMgcHJlc2VudCBpbiBzdGFja2RhdGFcclxuICAvLyBpZiBwcmVzZW50IHRoZW4gcmV0dXJuIHN0YWNrbmFtZVxyXG4gIC8vIGVsc2UgcmV0dXJuIGRpbWVuc2lvbk5hbWVcclxuICBnZXRTdGFja05hbWUoc3RhY2tEYXRhLCBkaW1lbnNpb25OYW1lKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBzdGFja0RhdGEuZm9yRWFjaCgodmFsdWUseCkgPT4ge1xyXG4gICAgICBjb25zdCB2YWx1ZXMgPSBzdGFja0RhdGFbeF0uc3RhY2tWYWx1ZXMuc3BsaXQoJywnKTtcclxuICAgICAgZm9yIChjb25zdCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgIGlmICh2YWx1ZXNbaV0gPT09IGRpbWVuc2lvbk5hbWUpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IHN0YWNrRGF0YVt4XS5zdGFja05hbWU7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7IC8vIGVuZCBvZiBmb3IgbG9vcCBvZiBzdGFja2RhdGFcclxuICB9XHJcbiAgLy8gR2V0IHRoZSBkaW1lbnNpb25zIGFuZCBtZXRob2QgYXJyYXkgZm9yIGFnZ3JlZ2F0aW9uXHJcbiAgLy8gTGlzdCBjb21lcyBmcm9tIGFnZ3JlZ2F0ZSBjb25maWcgYW5kIGNvbmF0aW5zIGJvdGggbWV0aG9kIGFuZCBkaW1lbnNpb24gbmFtZVxyXG4gIC8vIFdlIGFsc28gbmVlZCBncm91cCBieSB0byBiZSBpbmNsdWRlZCBhcyBhIGRpbWVuc2lvbiBidXQgd2l0aG91dCBhIG1ldGhvZFxyXG4gIGdldFJlc3VsdERpbWVzaW9ucyhsaXN0LCBncm91cGJ5KSB7XHJcbiAgICBjb25zdCBjaGFuZ2VkTmFtZXNGb3JSZXN1bHQgPSBsaXN0Lm1hcCgoe1xyXG4gICAgICBhZ2dyRGltZXNuaW9uOiBmcm9tLFxyXG4gICAgICBhZ2dyTWV0aG9kOiBtZXRob2RcclxuICAgIH0pID0+ICh7XHJcbiAgICAgIGZyb20sXHJcbiAgICAgIG1ldGhvZFxyXG4gICAgfSkpO1xyXG4gICAgY2hhbmdlZE5hbWVzRm9yUmVzdWx0LnB1c2goeyBmcm9tOiBncm91cGJ5IH0pO1xyXG4gICAgcmV0dXJuIGNoYW5nZWROYW1lc0ZvclJlc3VsdDtcclxuICB9XHJcbiAgLy8gTWV0aG9kIGZvciBzaG93aW5nIHRoZSBTbGlkZXIvUGluY2ggWm9vbVxyXG4gIHNob3dab29tRmVhdHVyZSh2YWwpIHtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnaW5zaWRlJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2xpZGVyJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1LFxyXG4gICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgIGhlaWdodDogMjAsXHJcbiAgICAgICAgICB0b3A6ICc5MCUnLFxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBHZXQgZGF0YSBmb3IgaG9yaXpvbnRhbCBCYXIgY2hhcnRcclxuICBnZXRIb3Jpem9udGFsU2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdmFsID0gZXh0cmFjdFZhbHVlRnJvbUpTT04odXNlcklucHV0LnhBeGlzRGltZW5zaW9uLCBpdGVtKTtcclxuICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeEF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICB4QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsaSkgPT4ge1xyXG4gICAgICAgIHhBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgIG5hbWU6IHhBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHhBeGlzRGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2YWwgPSBleHRyYWN0VmFsdWVGcm9tSlNPTih4QXhpc0RpbWVuc2lvbnNbaV0sIGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTsvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcclxuICAvLyBvblJlc2l6ZSgpIHtcclxuICAvLyAgICAgaWYodGhpcy5teWNoYXJ0KSB7XHJcbiAgLy8gICAgICAgdGhpcy5teWNoYXJ0LnJlc2l6ZSgpO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gfVxyXG59Il19