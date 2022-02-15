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
import { FetchClient, } from '@c8y/client';
import { extractValueFromJSON } from './util/extractValueFromJSON.util';
export class GpSmartEchartWidgetComponent {
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
            // const chartDom = document.getElementById('chart-container');
            // const myChart = echarts.init(chartDom);
            this.dataChart = echarts.init(this.chartDiv);
            // const myChart = echarts.init(this.chartDiv);
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
                this.dataChart.hideLoading();
                let axisFontSize = 0;
                if (userInput.fontSize === 0 || userInput.fontSize === '' || userInput.fontSize === null || userInput.fontSize === undefined) {
                    axisFontSize = 12;
                }
                else {
                    axisFontSize = userInput.fontSize;
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
        console.log('resize called', this.width, this.height);
        this.dataChart.resize({
            width: this.width,
            height: this.height
        });
    }
}
GpSmartEchartWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-gp-smart-echart-widget',
                template: "<div (resized)=\"onResized($event)\" style=\"height:100%;width:100%;\">\r\n   \r\n        <div echarts [options]=\"chartOption\" class=\"demo-chart\" #chartBox\r\n        [style.height.px]=\"height\" [style.width.px]=\"width\"\r\n        ></div>\r\n   \r\n</div>",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBNEIsS0FBSyxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUduQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxlQUFlLE1BQU0sMEJBQTBCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFdBQVcsR0FFWixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU94RSxNQUFNLE9BQU8sNEJBQTRCO0lBa0J2QyxZQUFvQixZQUF3QyxFQUNqRCxXQUF3QjtRQURmLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUNqRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQVRuQyxnQkFBVyxHQUFrQixFQUFFLENBQUM7UUFDdEIscUJBQWdCLEdBQVEsRUFBRSxDQUFDO1FBQ3JDLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVkLHNCQUFpQixHQUFHLEtBQUssQ0FBQztJQUlhLENBQUM7SUFDeEMsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFD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Q0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUMsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBamxFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsa1JBQXNEO3lCQUM3QyxzQ0FBc0M7YUFDaEQ7OztZQWJRLDBCQUEwQjtZQUlqQyxXQUFXOzs7d0JBV1YsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7cUJBQ3RDLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29weXJpZ2h0IChjKSAyMDIxIFNvZnR3YXJlIEFHLCBEYXJtc3RhZHQsIEdlcm1hbnkgYW5kL29yIGl0cyBsaWNlbnNvcnNcclxuICpcclxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgZWNoYXJ0cyBmcm9tICdlY2hhcnRzJztcclxuaW1wb3J0IHsgRUNoYXJ0c09wdGlvbiB9IGZyb20gJ2VjaGFydHMnO1xyXG5pbXBvcnQgeyBDaGFydENvbmZpZyB9IGZyb20gJy4vbW9kZWwvY29uZmlnLm1vZGFsJztcclxuaW1wb3J0IHsgR3BTbWFydEVjaGFydFdpZGdldFNlcnZpY2UgfSBmcm9tICcuL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuc2VydmljZSc7XHJcbmltcG9ydCB7IGlzRGV2TW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBzaW1wbGVUcmFuc2Zvcm0gZnJvbSAnZWNoYXJ0cy1zaW1wbGUtdHJhbnNmb3JtJztcclxuaW1wb3J0IHtcclxuICBGZXRjaENsaWVudCxcclxuICBSZWFsdGltZSxcclxufSBmcm9tICdAYzh5L2NsaWVudCc7XHJcbmltcG9ydCB7IGV4dHJhY3RWYWx1ZUZyb21KU09OIH0gZnJvbSAnLi91dGlsL2V4dHJhY3RWYWx1ZUZyb21KU09OLnV0aWwnO1xyXG5pbXBvcnQgeyBSZXNpemVkRXZlbnQgfSBmcm9tICdhbmd1bGFyLXJlc2l6ZS1ldmVudCc7XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLWdwLXNtYXJ0LWVjaGFydC13aWRnZXQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZXM6IFsnZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEdwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBWaWV3Q2hpbGQoJ2NoYXJ0Qm94JywgeyBzdGF0aWM6IHRydWUgfSkgcHJvdGVjdGVkIG1hcERpdlJlZjogRWxlbWVudFJlZjtcclxuICBASW5wdXQoKSBjb25maWc6IENoYXJ0Q29uZmlnO1xyXG4gIHNlcnZpY2VEYXRhO1xyXG4gIHNlcmllc0RhdGE7XHJcbiAgY2hhcnREYXRhO1xyXG4gIHVzZXJJbnB1dDtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICBjaGFydE9wdGlvbjogRUNoYXJ0c09wdGlvbiA9IHt9O1xyXG4gIHByb3RlY3RlZCBhbGxTdWJzY3JpcHRpb25zOiBhbnkgPSBbXTtcclxuICByZWFsdGltZSA9IHRydWU7XHJcbiAgZGV2aWNlSWQgPSAnJztcclxuICBwcm90ZWN0ZWQgY2hhcnREaXY6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGlzRGF0YWh1YlBvc3RDYWxsID0gZmFsc2U7XHJcbiAgZGF0YUNoYXJ0O1xyXG4gIGNvbG9yc0ZvckNoYXJ0O1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hhcnRTZXJ2aWNlOiBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSxcclxuICAgICBwcml2YXRlIGZldGNoQ2xpZW50OiBGZXRjaENsaWVudCkgeyB9XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0RGl2ID0gdGhpcy5tYXBEaXZSZWYubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodGhpcy5jb25maWcpO1xyXG4gIH1cclxuICBkYXRhRnJvbVVzZXIodXNlcklucHV0OiBDaGFydENvbmZpZykge1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCh1c2VySW5wdXQpO1xyXG4gIH0vLyBlbmQgb2YgZGF0YUZyb21Vc2VyKClcclxuICAvLyBjcmVhdGUgdmFyaWFibGVzIGZvciBhbGwgQ2hhcnRDb25maWcgbGlrZSB2YWx1ZSB0eXBlLCBhcGlkYXRhIGZyb20gdXJsIGV0YyB0byBzdG9yZSB0aGUgZGF0YSBmcm9tIHVzZXJcclxuICAvLyBjcmVhdGUgY2hhcnRcclxuICByZWxvYWREYXRhKHVzZXJJbnB1dDogQ2hhcnRDb25maWcpIHtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodXNlcklucHV0KTtcclxuICB9XHJcblxyXG5cclxuICAvLyBjcmVhdGVDaGFydCBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBjaGFydCB3aXRoIHRoZSBoZWxwIG9mIGVjaGFydCBsaWJyYXJ5XHJcbiAgYXN5bmMgY3JlYXRlQ2hhcnQodXNlcklucHV0PzogQ2hhcnRDb25maWcpIHtcclxuICAgIC8vIGNvbnN0IGNoYXJ0RG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJ0LWNvbnRhaW5lcicpO1xyXG4gICAgLy8gY29uc3QgbXlDaGFydCA9IGVjaGFydHMuaW5pdChjaGFydERvbSk7XHJcbiAgICB0aGlzLmRhdGFDaGFydCA9IGVjaGFydHMuaW5pdCh0aGlzLmNoYXJ0RGl2KTtcclxuICAgIC8vIGNvbnN0IG15Q2hhcnQgPSBlY2hhcnRzLmluaXQodGhpcy5jaGFydERpdik7XHJcbiAgICB0aGlzLmRhdGFDaGFydC5zaG93TG9hZGluZygpO1xyXG4gICAgaWYgKCF1c2VySW5wdXQuY29sb3JzKSB7XHJcbiAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnTm8gY29sb3JzIFNwZWNpZmllZCcpOyB9XHJcbiAgICAgIHRoaXMuY29sb3JzRm9yQ2hhcnQgPSBbXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29sb3JzRm9yQ2hhcnQgPSBbLi4udXNlcklucHV0LmNvbG9ycy5zcGxpdCgnLCcpXVxyXG4gICAgfVxyXG4gICAgaWYgKHVzZXJJbnB1dC5zaG93QXBpSW5wdXQpIHtcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IGF3YWl0IHRoaXMuY2hhcnRTZXJ2aWNlLmdldEFQSURhdGEodXNlcklucHV0LmFwaVVybCkudG9Qcm9taXNlKCk7XHJcbiAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5zaG93RGF0YWh1YklucHV0KSB7XHJcbiAgICAgIGNvbnN0IHNxbFJlcU9iamVjdCA9IHtcclxuICAgICAgICBzcWw6IHVzZXJJbnB1dC5zcWxRdWVyeSxcclxuICAgICAgICBsaW1pdDogMTAwLFxyXG4gICAgICAgIGZvcm1hdDogJ1BBTkRBUydcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZldGNoQ2xpZW50LmZldGNoKHVzZXJJbnB1dC5hcGlVcmwsIHtcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzcWxSZXFPYmplY3QpLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMuc2VydmljZURhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHRoaXMuaXNEYXRhaHViUG9zdENhbGwgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdObyBEYXRhc291cmNlIHNlbGVjdGVkJyk7IH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlcnZpY2VEYXRhKSB7XHJcbiAgICAgIHRoaXMuZGF0YUNoYXJ0LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgIGxldCBheGlzRm9udFNpemUgPSAwO1xyXG4gICAgICBpZih1c2VySW5wdXQuZm9udFNpemUgPT09IDAgfHwgdXNlcklucHV0LmZvbnRTaXplID09PSAnJyB8fCB1c2VySW5wdXQuZm9udFNpemUgPT09IG51bGwgfHwgdXNlcklucHV0LmZvbnRTaXplID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGF4aXNGb250U2l6ZSA9IDEyO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgYXhpc0ZvbnRTaXplID0gdXNlcklucHV0LmZvbnRTaXplO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VySW5wdXQuYWdnckxpc3QubGVuZ3RoID09PSAwICYmICF0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIEFQSSB3aXRob3V0IEFnZ3JlZ2F0aW9uXHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncGllJykge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRQaWVDaGFydFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUGllIENoYXJ0IEZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1BpZSBDaGFydCBGb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBwaWVjaGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwb2xhcicpIHtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9sYXI6IHt9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlQXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgc3RhcnRBbmdsZTogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRpdXNBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbWluOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1BvbGFyIENoYXJ0IEZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgUG9sYXIgQ0hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGxldCB4QXhpc09iamVjdDsgbGV0IHlBeGlzT2JqZWN0O1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdob3Jpem9udGFsU2NhdHRlcicpIHtcclxuICAgICAgICAgICAgeEF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeUF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHhBeGlzT2JqZWN0LFxyXG4gICAgICAgICAgICB5QXhpczogeUF4aXNPYmplY3QsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuYm94Wm9vbSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdTY2F0dGVyIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKSB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgU2NhdHRlciBDaGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdyYWRhcicpIHtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0UmFkYXJTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZTp7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDp1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJ1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRhcjoge1xyXG4gICAgICAgICAgICAgIGluZGljYXRvcjogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dIH07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgcmFkaXVzOiB1c2VySW5wdXQucmFkYXJDaGFydFJhZGl1c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdSYWRhciBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbikgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JhZGFyIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBSYWRhciBDSGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAoKHVzZXJJbnB1dC50eXBlID09PSAnbGluZScgfHwgdXNlcklucHV0LnR5cGUgPT09ICdiYXInKVxyXG4gICAgICAgICAgJiYgKHVzZXJJbnB1dC5sYXlvdXQgIT09ICdzaW1wbGVIb3Jpem9udGFsQmFyJyAmJiB1c2VySW5wdXQubGF5b3V0ICE9PSAnc3RhY2tlZEhvcml6b250YWxCYXInKSkge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lOyBsZXQgeUF4aXNOYW1lO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHhBeGlzTmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgLy8gbmFtZTogeUF4aXNOYW1lXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5ib3hab29tLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnU2ltcGxlIGJhciBvciBsaW5lIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgU2ltcGxlIExpbmUsU2ltcGxlIEJhcixTdGFja2VkIExpbmUgQW5kIFN0YWNrZWQgQmFyIGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgJiYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzaW1wbGVIb3Jpem9udGFsQmFyJyB8fCB1c2VySW5wdXQubGF5b3V0ID09PSAnc3RhY2tlZEhvcml6b250YWxCYXInKSkge1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZTsgbGV0IHlBeGlzTmFtZTtcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldEhvcml6b250YWxTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID1cclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgICBvdmVyZmxvdzogJ3RydW5jYXRlJyxcclxuICAgICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBvcmllbnQ6ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgLy8gbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICAvLyBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBleHRyYWN0VmFsdWVGcm9tSlNPTih1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdIb3Jpem9udGFsIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgSG9yaXpvbnRhbCBCYXIgJiBTdGFja2VkIEhvcml6b250YWwgQmFyXHJcbiAgICAgIH0gLy8gRW5kIG9mIEFQSSBjYWxscyB3aXRoIEpTT04gUmVzcG9uc2Ugd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICBlbHNlIGlmICh1c2VySW5wdXQuYWdnckxpc3QubGVuZ3RoID09PSAwICYmIHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAvLyBjYWxscyBmb3IgRGF0YWh1YiB3aXRob3V0IEFnZ3JlZ2F0aW9uXHJcbiAgICAgICAgY29uc3QgcmVzdWx0RGltZW5zaW9uID0gdGhpcy5nZXRSZXN1bHREaW1lc2lvbnModXNlcklucHV0LmFnZ3JMaXN0LCB1c2VySW5wdXQuZ3JvdXBCeSk7XHJcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICBsZXQgZW5jb2RlRGF0YTtcclxuICAgICAgICBjb25zdCBkYXRhc2V0SWQgPSBudWxsO1xyXG4gICAgICAgIC8vIEZvcm1hdCBvZiBEYXRhIGZyb20gZGF0YWh1YiBpc1xyXG4gICAgICAgIC8vIFJlc3VsdDpbXHJcbiAgICAgICAgLy8gICBcImNvbHVtbnNcIjpbJ2NvbEEnLCdjb2xCJywuLi4sJ2NvbE4nXSxcclxuICAgICAgICAvLyAgIFwiZGF0YVwiOltcclxuICAgICAgICAvLyAgICAgW1wiQTFcIixcIkIxXCIsLi4uLFwiTjFcIl0sXHJcbiAgICAgICAgLy8gICAgIFtcIkEyXCIsXCJCMlwiLC4uLixcIk4yXCJdLFxyXG4gICAgICAgIC8vICAgICAuLi4sXHJcbiAgICAgICAgLy8gICAgIFtcIkFOXCIsXCJCTlwiLC4uLixcIk5OXCJdXHJcbiAgICAgICAgLy8gICBdXHJcbiAgICAgICAgLy8gXVxyXG4gICAgICAgIC8vIHNvdXJjZSBvZiBEYXRhc2V0IHNob3VsZCBiZSBbW2NvbHVtbnNdLFtkYXRhcm93c11dXHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IFt0aGlzLnNlcnZpY2VEYXRhLmNvbHVtbnMsIC4uLnRoaXMuc2VydmljZURhdGEuZGF0YV1cclxuICAgICAgICAvLyBFbmQgb2YgUmVzcG9uc2UgRGF0YSBleHRyYWN0aW9uXHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5nZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBsZXQgeUF4aXNOYW1lID0gJyc7IGxldCB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCwgeERpbWVuc2lvbnMsIHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge30sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdCYXIgb3IgTGluZSBjaGFydCBmb3IgRGF0YWh1YiB3aXRob3V0IGFnZ3JlZ2F0aW9uJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9IC8vIEVuZCBvZiBCYXIsTGluZSBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lID0gJyc7IGxldCB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA1MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnU2NhdHRlciBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9IC8vIEVuZCBvZiBTY2F0dGVyIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSBbdXNlcklucHV0LnBpZVNsaWNlbk5hbWUsIHVzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLCBcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1BpZSBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdQaWUgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pO1xyXG4gICAgICAgIH0gLy8gRW5kIG9mIFBpZSBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwb2xhcicpIHtcclxuICAgICAgICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICBzdGFydEFuZ2xlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGl1c0F4aXM6IHtcclxuICAgICAgICAgICAgICBtaW46IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9sYXI6IHt9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUG9sYXIgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAgLy8gRW5kIG9mIFBvbGFyIENoYXJ0IFdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi51c2VySW5wdXQucmFkYXJEaW1lbnNpb25zXTtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0UmFkYXJTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBjb25zdCBpbmRleE9mWERpbWVuc2lvbiA9IHRoaXMuc2VydmljZURhdGFbMF0uaW5kZXhPZih1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgY29uc3QgaW5kaWNhdG9yRGF0YSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnNlcnZpY2VEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGluZGljYXRvckRhdGEucHVzaCh7IG5hbWU6IHRoaXMuc2VydmljZURhdGFbaV1baW5kZXhPZlhEaW1lbnNpb25dIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6e1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6dXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcidcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRhcjoge1xyXG4gICAgICAgICAgICAgIGluZGljYXRvcjogaW5kaWNhdG9yRGF0YSxcclxuICAgICAgICAgICAgICByYWRpdXM6IHVzZXJJbnB1dC5yYWRhckNoYXJ0UmFkaXVzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1JhZGFyIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JhZGFyIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBSYWRhciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgIH0gLy8gRU5kIG9mIERhdGFodWIgQ2FsbHMgUmVzcG9uc2Ugd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICBlbHNlIGlmICh1c2VySW5wdXQuYWdnckxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8vIGNhbGxzIGZvciBBUEkgJiBEYXRhaHViIHdpdGggQWdncmVnYXRpb25cclxuICAgICAgICBlY2hhcnRzLnJlZ2lzdGVyVHJhbnNmb3JtKHNpbXBsZVRyYW5zZm9ybS5hZ2dyZWdhdGUpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdERpbWVuc2lvbiA9IHRoaXMuZ2V0UmVzdWx0RGltZXNpb25zKHVzZXJJbnB1dC5hZ2dyTGlzdCwgdXNlcklucHV0Lmdyb3VwQnkpO1xyXG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgbGV0IGVuY29kZURhdGE7XHJcbiAgICAgICAgY29uc3QgZGF0YXNldElkID0gJ19hZ2dyZWdhdGUnO1xyXG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIHNlcnZpY2UgZGF0YSBiYXNlZCBvbiB0aGUgcmVzcG9uc2UgdHlwZSBvZiB3dGhlcmUgY2FsbCBpcyBtYWRlIHRvIERhdGFodWIgb3IgT3RoZXIgQVBJXHJcbiAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgIC8vIEZvcm1hdCBvZiBEYXRhIGZyb20gZGF0YWh1YiBpc1xyXG4gICAgICAgICAgLy8gUmVzdWx0OltcclxuICAgICAgICAgIC8vICAgXCJjb2x1bW5zXCI6Wydjb2xBJywnY29sQicsLi4uLCdjb2xOJ10sXHJcbiAgICAgICAgICAvLyAgIFwiZGF0YVwiOltcclxuICAgICAgICAgIC8vICAgICBbXCJBMVwiLFwiQjFcIiwuLi4sXCJOMVwiXSxcclxuICAgICAgICAgIC8vICAgICBbXCJBMlwiLFwiQjJcIiwuLi4sXCJOMlwiXSxcclxuICAgICAgICAgIC8vICAgICAuLi4sXHJcbiAgICAgICAgICAvLyAgICAgW1wiQU5cIixcIkJOXCIsLi4uLFwiTk5cIl1cclxuICAgICAgICAgIC8vICAgXVxyXG4gICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgLy8gc291cmNlIG9mIERhdGFzZXQgc2hvdWxkIGJlIFtbY29sdW1uc10sW2RhdGFyb3dzXV1cclxuICAgICAgICAgIHRoaXMuc2VydmljZURhdGEgPSBbdGhpcy5zZXJ2aWNlRGF0YS5jb2x1bW5zLCAuLi50aGlzLnNlcnZpY2VEYXRhLmRhdGFdXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIEZvcm1hdCBvZiBEYXRhIGZyb20gQVBpIGNhbGxzIGlzIEpTT04gb2JqZWN0IHdpdGgga2V5LHZhbHVlXHJcbiAgICAgICAgICAvLyBSZXN1bHQ6IFtcclxuICAgICAgICAgIC8vICAge1xyXG4gICAgICAgICAgLy8gICAgIFwia2V5MVwiOiBcInZhbDFcIixcclxuICAgICAgICAgIC8vICAgICBcImtleTJcIjogXCJ2YWwyXCIsXHJcbiAgICAgICAgICAvLyAgIH0sXHJcbiAgICAgICAgICAvLyAgIHtcclxuICAgICAgICAgIC8vICAgICBcImtleTFcIjogXCJ2YWwxLjFcIixcclxuICAgICAgICAgIC8vICAgICBcImtleTJcIjogXCJ2YWwyLjFcIixcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBSZXNwb25zZSBEYXRhIGV4dHJhY3Rpb25cclxuICAgICAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInIHx8IHVzZXJJbnB1dC50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZSA9ICcnOyBsZXQgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgICAgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIG5hbWU6IHlBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQWdncmVnYXRlIEJhciBvciBMaW5lIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9IC8vIEVuZCBvZiBCYXIsTGluZSBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3NjYXR0ZXInKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZSA9ICcnOyBsZXQgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczogcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDUwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBTY2F0dGVyIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9IC8vIEVuZCBvZiBTY2F0dGVyIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncGllJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lLCB1c2VySW5wdXQucGllU2xpY2VWYWx1ZV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiB7IGRldGFpbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIC8vIG5hbWUuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQWdncmVnYXRlIFBpZSBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnQWdncmVnYXRlIFBpZSBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pO1xyXG4gICAgICAgIH0gLy8gRW5kIG9mIFBpZSBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlQXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgc3RhcnRBbmdsZTogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRpdXNBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbWluOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvbGFyOiB7fSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHsgZGV0YWlsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQWdncmVnYXRlIFBvbGFyIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9ICAvLyBFbmQgb2YgUG9sYXIgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgIH0gIC8vIEVuZCBvZiBjYWxscyBmb3IgQVBJICYgRGF0YWh1YiB3aXRoIEFnZ3JlZ2F0aW9uXHJcbiAgICAgIC8vIEVuZCBvZiBjaGFydE9wdGlvbnNcclxuICAgIH0gLy8gRW5kIG9mIElGIGNvbmRpdGlvbiBjaGVja2luZyB3aGV0aGVyIHZhcmlhYmxlIHNlcnZpY2VEYXRhIGhhcyBzb21lIGRhdGEgb3Igbm90XHJcbiAgfVxyXG4gIGdldFhBeGlzVHlwZShpbnB1dCkge1xyXG4gICAgcmV0dXJuIGlucHV0LnhBeGlzO1xyXG4gIH1cclxuICBnZXRZQXhpc1R5cGUoaW5wdXQpIHtcclxuICAgIHJldHVybiBpbnB1dC55QXhpcztcclxuICB9XHJcbiAgZ2V0Q2hhcnRUeXBlKGlucHV0KSB7XHJcbiAgICByZXR1cm4gaW5wdXQudHlwZTtcclxuICB9XHJcbiAgZ2V0Rm9ybWF0dGVkTmFtZShpbnB1dCkge1xyXG4gICAgY29uc3QgdGVzdCA9IGlucHV0LnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgY29uc3QgYSA9IHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICByZXR1cm4gYS50cmltKCk7XHJcbiAgfVxyXG4gIGdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQ/LCB4RGltZW5zaW9ucz8sIHlEaW1lbnNpb25zPykge1xyXG4gICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW06ICdwb2xhcicsXHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC5sYXlvdXQsXHJcbiAgICAgICAgc2hvd1N5bWJvbDogdHJ1ZSxcclxuICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgIHJhZGl1czogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgYW5nbGU6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9XVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB4OiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKSxcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgY29uc3QgeEF4aXNEYXRhID0gW107XHJcbiAgICAgICAgICB4QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICB4OiB4QXhpc0RpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwOiBbeEF4aXNEaW1lbnNpb25zW2ldLCB1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSksXHJcbiAgICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICAgIH0vLyBFbmQgb2YgZWxzZSBwYXJ0IG9mIFhBeGlzRGltZW5zaW9uXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHg6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB0b29sdGlwOiBbdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLCB1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKDApLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHlBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICAgICAgeUF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICB4OiB5QXhpc0RpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwOiBbeUF4aXNEaW1lbnNpb25zW2ldLCB1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKSxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICAgIH0vLyBFbmQgb2YgZWxzZSBwYXJ0IG9mIFlBeGlzRGltZW5zaW9uXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB1c2VySW5wdXQucmFkYXJEaW1lbnNpb25zLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IGRpbWVuc2lvblJlY29yZCA9IGRpbWVuc2lvbnMucmVkdWNlKChhY2MsIGRpbWVuc2lvbikgPT4ge1xyXG4gICAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgfSwge30pO1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvblJlY29yZFtrZXldKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvblJlY29yZFtrZXldLnB1c2goaXRlbVtrZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgcmVzdWx0QVJSID0gT2JqZWN0LnZhbHVlcyhkaW1lbnNpb25SZWNvcmQpXHJcbiAgICAgIGNvbnN0IHJlc3VsdDEgPSBPYmplY3Qua2V5cyhkaW1lbnNpb25SZWNvcmQpLm1hcCgoa2V5LCBpKSA9PiAoe1xyXG4gICAgICAgIG5hbWU6IGtleSxcclxuICAgICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV0sXHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSkpO1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgJiYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzaW1wbGVCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkQmFyJykpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICBuYW1lOiB5RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHlEaW1lbnNpb25zLmFycmF5LmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHlEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgICAgbmFtZTogeURpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zW2ldXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInICYmICh1c2VySW5wdXQubGF5b3V0ID09PSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgfHwgdXNlcklucHV0LmxheW91dCA9PT0gJ3N0YWNrZWRIb3Jpem9udGFsQmFyJykpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICBuYW1lOiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG5cclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB4RGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB4RGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHhEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICBzbW9vdGg6IHVzZXJJbnB1dC5zbW9vdGhMaW5lLFxyXG4gICAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYSxcclxuICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zLFxyXG4gICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICB5OiB5RGltZW5zaW9uc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKDApXHJcblxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHlEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1tpXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncGllJykge1xyXG4gICAgICBjb25zdCBjb252cmFkaXVzID0gdXNlcklucHV0LnJhZGl1cy5zcGxpdCgnLCcpO1xyXG4gICAgICBsZXQgcm9zZVZhbHVlID0gJyc7IGxldCBzbGljZVN0eWxlO1xyXG4gICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ3Jvc2VNb2RlJykge1xyXG4gICAgICAgIHJvc2VWYWx1ZSA9ICdyb3NlJztcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHt9O1xyXG4gICAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA+IDAgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPiAwKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1c1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzLFxyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgIHJhZGl1czogY29udnJhZGl1cyxcclxuICAgICAgICByb3NlVHlwZTogcm9zZVZhbHVlLFxyXG4gICAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpdGVtU3R5bGU6IHNsaWNlU3R5bGUsXHJcbiAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQucGllU2xpY2VOYW1lLFxyXG4gICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgaXRlbU5hbWU6IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZV0sXHJcbiAgICAgICAgICB2YWx1ZTogdXNlcklucHV0LnBpZVNsaWNlVmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yc0ZvckNoYXJ0XHJcbiAgICAgIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBnZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIHNlcmllcyBkYXRhIGZvciBzY2F0dGVyIGNoYXJ0XHJcbiAgZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHhBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1beEF4aXNEaW1lbnNpb25zW2ldXTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGxvb3BcclxuICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBYQXhpc0RpbWVuc2lvblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeUF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgfS8vIEVuZCBvZiBlbHNlIHBhcnQgb2YgWUF4aXNEaW1lbnNpb25cclxuICAgIH1cclxuICB9XHJcbiAgLy8gZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgc2VyaWVzIGRhdGEgZm9yIHBvbGFyIGNoYXJ0XHJcbiAgZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgY3VycmVudFJlc3VsdCA9IFtdO1xyXG4gICAgICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dKTtcclxuICAgICAgY3VycmVudFJlc3VsdC5wdXNoKGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXSk7XHJcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRSZXN1bHQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gW3tcclxuICAgICAgY29vcmRpbmF0ZVN5c3RlbTogJ3BvbGFyJyxcclxuICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICB0eXBlOiB1c2VySW5wdXQubGF5b3V0LFxyXG4gICAgICBzaG93U3ltYm9sOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXN1bHQsXHJcbiAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICB9LFxyXG4gICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICB9LFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH1dXHJcbiAgfVxyXG4gIC8vIGdldFJhZGFyU2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGdldCB0aGUgZGF0YSBmcm9tIHNlcnZpY2UgYW5kIHN0b3JlIGl0IGluIHNlcmllc0RhdGEgdmFyaWFibGVcclxuICBnZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gdXNlcklucHV0LnJhZGFyRGltZW5zaW9ucy5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbiAgICBpZiAodXNlcklucHV0Lmxpc3ROYW1lIGluIHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25SZWNvcmRba2V5XSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25SZWNvcmRba2V5XS5wdXNoKGl0ZW1ba2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gdjtcclxuICAgICAgICByZXR1cm4geyBrZXk6IHZhbCwgdmFsdWU6IHRoaXMuc2VydmljZURhdGFbMF0uaW5kZXhPZih2KSB9O1xyXG4gICAgICB9KTtcclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnNlcnZpY2VEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaW5kZXhlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgZGltZW5zaW9uUmVjb3JkW2VsZW1lbnQua2V5XS5wdXNoKHRoaXMuc2VydmljZURhdGFbaV1bZWxlbWVudC52YWx1ZV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXN1bHQxID0gT2JqZWN0LmtleXMoZGltZW5zaW9uUmVjb3JkKS5tYXAoKGtleSwgaSkgPT4gKHtcclxuICAgICAgbmFtZToga2V5LFxyXG4gICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV0sXHJcbiAgICB9KSk7XHJcbiAgICBpZiAodXNlcklucHV0Lmxpc3ROYW1lIGluIHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0Lmxpc3ROYW1lLFxyXG4gICAgICAgIHR5cGU6ICdyYWRhcicsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzRm9yQ2hhcnQsXHJcbiAgICAgICAgZGF0YTogcmVzdWx0MVxyXG4gICAgICB9XVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgfVxyXG4gIGNyZWF0ZU9iamVjdChkYXRhRGltLCBhcnIsIGRpbWVuKSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gZGltZW4uc3BsaXQoJywnKTtcclxuICAgIGNvbnN0IGRpbWVuc2lvblJlY29yZCA9IGRpbWVuc2lvbnMucmVkdWNlKChhY2MsIGRpbWVuc2lvbikgPT4ge1xyXG4gICAgICBhY2NbZGltZW5zaW9uXSA9IFtdO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwge30pO1xyXG4gICAgY29uc3QgaW5kZXhlcyA9IGRpbWVuc2lvbnMubWFwKCh2LCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCB2YWwgPSB2O1xyXG4gICAgICByZXR1cm4geyBrZXk6IHZhbCwgdmFsdWU6IGRhdGFEaW0uaW5kZXhPZih2KSB9O1xyXG4gICAgfSk7XHJcbiAgICBhcnIubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICBpbmRleGVzLmtleXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBkaW1lbnNpb25SZWNvcmRbZWxlbWVudC5rZXldLnB1c2goaXRlbVtlbGVtZW50LnZhbHVlXSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vIGdldFBpZUNoYXJ0U2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBzZXJpZXMgZGF0YSBmb3IgcGllIGNoYXJ0XHJcbiAgZ2V0UGllQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCkge1xyXG4gICAgLy8gY29udmVydCBjb21tYSBzZXBhcmF0ZWQgc3RyaW5nIHVzZXJJbnB1dC5yYWRpdXMgdG8gYXJyYXlcclxuICAgIGNvbnN0IGNvbnZyYWRpdXMgPSB1c2VySW5wdXQucmFkaXVzLnNwbGl0KCcsJyk7XHJcbiAgICBsZXQgcm9zZVZhbHVlID0gJyc7IGxldCBzbGljZVN0eWxlO1xyXG4gICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdyb3NlTW9kZScpIHtcclxuICAgICAgcm9zZVZhbHVlID0gJ3Jvc2UnO1xyXG4gICAgfVxyXG4gICAgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzbGljZVN0eWxlID0ge31cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA+IDAgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA+IDApIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXNcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMsXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbe1xyXG4gICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICByYWRpdXM6IGNvbnZyYWRpdXMsXHJcbiAgICAgIHJvc2VUeXBlOiByb3NlVmFsdWUsXHJcbiAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgbGFiZWw6IHtcclxuICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcclxuICAgICAgfSxcclxuICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXRlbVN0eWxlOiBzbGljZVN0eWxlLFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgc2hhZG93Qmx1cjogMTAsXHJcbiAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIC8vIHRha2UgdmFsIGZyb20gdXNlcmlucHV0LnBpZXNsaWNlIHZhbHVlIGFuZCByZXR1cm4gaXRcclxuICAgICAgICBjb25zdCB2YWwgPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuICAgICAgICBsZXQgbmFtO1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQucGllU2xpY2VWYWx1ZSA9PT0gdXNlcklucHV0LnBpZVNsaWNlbk5hbWUpIHtcclxuICAgICAgICAgIG5hbSA9IHVzZXJJbnB1dC5waWVTbGljZW5OYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuYW0gPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgIG5hbWU6IG5hbSxcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgfV1cclxuICB9XHJcbiAgLy8gZ2V0c2VyaWVzZGF0YSByZWNpZXZlcyB1c2VyaW5wdXQgYW5kIHJldHVybnMgc2VyaWVzZGF0YVxyXG4gIC8vIHNlcmllc2RhdGEgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0c1xyXG4gIGdldFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9XHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICBsZXQgYWIgPSB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2tMaXN0LCB5QXhpc0RpbWVuc2lvbnNbaV0pO1xyXG4gICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgIG5hbWU6IHlBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2tMaXN0LCB5QXhpc0RpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuICBnZXRDaGFydEl0ZW1Db2xvcihpbmRleCkge1xyXG4gICAgaWYgKHRoaXMuY29sb3JzRm9yQ2hhcnRbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb2xvcnNGb3JDaGFydFtpbmRleF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEdldHMgdGhlIGRpbWVuc2lvbnMgZm9yIGRhdGFzZXRcclxuICBnZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpIHtcclxuICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zOyBsZXQgZGltZW5zaW9uQXJyID0gW107XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi55RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi54RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGltZW5zaW9uQXJyO1xyXG4gIH1cclxuICAvLyBpZiBzdGFja2RhdGEgaXMgZW1wdHkgdGhlbiByZXR1cm4gZGltZW5zaW9uTmFtZVxyXG4gIC8vIGVsc2UgaWYgc3RhY2tkYXRhIGlzIG5vdCBlbXB0eSB0aGVuIGNoZWNrIGlmIGRpbWVuc2lvbk5hbWUgaXMgcHJlc2VudCBpbiBzdGFja2RhdGFcclxuICAvLyBpZiBwcmVzZW50IHRoZW4gcmV0dXJuIHN0YWNrbmFtZVxyXG4gIC8vIGVsc2UgcmV0dXJuIGRpbWVuc2lvbk5hbWVcclxuICBnZXRTdGFja05hbWUoc3RhY2tEYXRhLCBkaW1lbnNpb25OYW1lKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBzdGFja0RhdGEuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcclxuICAgICAgY29uc3QgdmFsdWVzID0gc3RhY2tEYXRhW3hdLnN0YWNrVmFsdWVzLnNwbGl0KCcsJyk7XHJcbiAgICAgIHZhbHVlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlc1tpXSA9PT0gZGltZW5zaW9uTmFtZSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gc3RhY2tEYXRhW3hdLnN0YWNrTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBmb3IgbG9vcCBvZiBzdGFja2RhdGFcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIC8vIEdldCB0aGUgZGltZW5zaW9ucyBhbmQgbWV0aG9kIGFycmF5IGZvciBhZ2dyZWdhdGlvblxyXG4gIC8vIExpc3QgY29tZXMgZnJvbSBhZ2dyZWdhdGUgY29uZmlnIGFuZCBjb25hdGlucyBib3RoIG1ldGhvZCBhbmQgZGltZW5zaW9uIG5hbWVcclxuICAvLyBXZSBhbHNvIG5lZWQgZ3JvdXAgYnkgdG8gYmUgaW5jbHVkZWQgYXMgYSBkaW1lbnNpb24gYnV0IHdpdGhvdXQgYSBtZXRob2RcclxuICBnZXRSZXN1bHREaW1lc2lvbnMobGlzdCwgZ3JvdXBieSkge1xyXG4gICAgY29uc3QgY2hhbmdlZE5hbWVzRm9yUmVzdWx0ID0gbGlzdC5tYXAoKHtcclxuICAgICAgYWdnckRpbWVzbmlvbjogZnJvbSxcclxuICAgICAgYWdnck1ldGhvZDogbWV0aG9kXHJcbiAgICB9KSA9PiAoe1xyXG4gICAgICBmcm9tLFxyXG4gICAgICBtZXRob2RcclxuICAgIH0pKTtcclxuICAgIGNoYW5nZWROYW1lc0ZvclJlc3VsdC5wdXNoKHsgZnJvbTogZ3JvdXBieSB9KTtcclxuICAgIHJldHVybiBjaGFuZ2VkTmFtZXNGb3JSZXN1bHQ7XHJcbiAgfVxyXG4gIC8vIE1ldGhvZCBmb3Igc2hvd2luZyB0aGUgU2xpZGVyL1BpbmNoIFpvb21cclxuICBzaG93Wm9vbUZlYXR1cmUodmFsKSB7XHJcbiAgICBpZiAodmFsKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2luc2lkZScsXHJcbiAgICAgICAgICB4QXhpc0luZGV4OiAwLFxyXG4gICAgICAgICAgbWluU3BhbjogNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NsaWRlcicsXHJcbiAgICAgICAgICB4QXhpc0luZGV4OiAwLFxyXG4gICAgICAgICAgbWluU3BhbjogNSxcclxuICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICBoZWlnaHQ6IDIwLFxyXG4gICAgICAgICAgdG9wOiAnOTAlJyxcclxuICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhleFRvUmdiKGhleCkge1xyXG4gICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuIFwiMDNGXCIpIHRvIGZ1bGwgZm9ybSAoZS5nLiBcIjAwMzNGRlwiKVxyXG4gICAgdmFyIHNob3J0aGFuZFJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcclxuICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XHJcbiAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICB9KTtcclxuICBcclxuICAgIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHJlc3VsdCA/IFwicmdiYShcIiArIHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpICsgXCIsIFwiICsgcGFyc2VJbnQocmVzdWx0WzJdLCAxNikgKyBcIiwgXCIgKyBwYXJzZUludChyZXN1bHRbM10sIDE2KSArIFwiLCBcIiArIDAuOCArIFwiKVwiIDogbnVsbDtcclxuICB9XHJcbiAgLy8gR2V0IGRhdGEgZm9yIGhvcml6b250YWwgQmFyIGNoYXJ0XHJcbiAgZ2V0SG9yaXpvbnRhbFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgaXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYVxyXG4gICAgICB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgeEF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgbmFtZTogeEF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFjaywgeEF4aXNEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHhBeGlzRGltZW5zaW9uc1tpXSwgaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWFcclxuICAgICAgICB9XHJcbiAgICAgIH0pOy8vIGVuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxyXG4gIC8vICBvblJlc2l6ZSgpIHtcclxuICAvLyAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGFDaGFydClcclxuICAvLyAgICBpZiAodGhpcy5kYXRhQ2hhcnQpIHtcclxuICAvLyAgICAgIHRoaXMuZGF0YUNoYXJ0LnJlc2l6ZSgpO1xyXG4gIC8vICAgIH1cclxuICAvLyAgfVxyXG5cclxuICBvblJlc2l6ZWQoZXZlbnQ6IFJlc2l6ZWRFdmVudCkge1xyXG4gICAgdGhpcy53aWR0aCA9IGV2ZW50Lm5ld1dpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBldmVudC5uZXdIZWlnaHQ7XHJcbiAgICBjb25zb2xlLmxvZygncmVzaXplIGNhbGxlZCcsdGhpcy53aWR0aCx0aGlzLmhlaWdodCk7XHJcbiAgICB0aGlzLmRhdGFDaGFydC5yZXNpemUoe1xyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OnRoaXMuaGVpZ2h0XHJcbiAgICB9KTtcclxuICB9XHJcbn0iXX0=