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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBNEIsS0FBSyxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUduQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxlQUFlLE1BQU0sMEJBQTBCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFdBQVcsR0FFWixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU94RSxNQUFNLE9BQU8sNEJBQTRCO0lBaUJ2QyxZQUFvQixZQUF3QyxFQUNqRCxXQUF3QjtRQURmLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUNqRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQVRuQyxnQkFBVyxHQUFrQixFQUFFLENBQUM7UUFDdEIscUJBQWdCLEdBQVEsRUFBRSxDQUFDO1FBQ3JDLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVkLHNCQUFpQixHQUFHLEtBQUssQ0FBQztJQUlhLENBQUM7SUFDeEMsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFD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Q0FBa0M7SUFDbEMsZ0JBQWdCO0lBQ2hCLGlDQUFpQztJQUNqQywyQkFBMkI7SUFDM0IsZ0NBQWdDO0lBQ2hDLE9BQU87SUFDUCxLQUFLO0lBQ0wsU0FBUyxDQUFDLEtBQW1CO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBQyxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUEva0VGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxzUkFBc0Q7eUJBQzdDLHNDQUFzQzthQUNoRDs7O1lBYlEsMEJBQTBCO1lBSWpDLFdBQVc7Ozt3QkFXVixTQUFTLFNBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtxQkFDdEMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBlY2hhcnRzIGZyb20gJ2VjaGFydHMnO1xyXG5pbXBvcnQgeyBFQ2hhcnRzT3B0aW9uIH0gZnJvbSAnZWNoYXJ0cyc7XHJcbmltcG9ydCB7IENoYXJ0Q29uZmlnIH0gZnJvbSAnLi9tb2RlbC9jb25maWcubW9kYWwnO1xyXG5pbXBvcnQgeyBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSB9IGZyb20gJy4vZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIHNpbXBsZVRyYW5zZm9ybSBmcm9tICdlY2hhcnRzLXNpbXBsZS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQge1xyXG4gIEZldGNoQ2xpZW50LFxyXG4gIFJlYWx0aW1lLFxyXG59IGZyb20gJ0BjOHkvY2xpZW50JztcclxuaW1wb3J0IHsgZXh0cmFjdFZhbHVlRnJvbUpTT04gfSBmcm9tICcuL3V0aWwvZXh0cmFjdFZhbHVlRnJvbUpTT04udXRpbCc7XHJcbmltcG9ydCB7IFJlc2l6ZWRFdmVudCB9IGZyb20gJ2FuZ3VsYXItcmVzaXplLWV2ZW50JztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdsaWItZ3Atc21hcnQtZWNoYXJ0LXdpZGdldCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlczogWydncC1zbWFydC1lY2hhcnQtd2lkZ2V0LmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQFZpZXdDaGlsZCgnY2hhcnRCb3gnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcm90ZWN0ZWQgbWFwRGl2UmVmOiBFbGVtZW50UmVmO1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogQ2hhcnRDb25maWc7XHJcbiAgc2VydmljZURhdGE7XHJcbiAgc2VyaWVzRGF0YTtcclxuICBjaGFydERhdGE7XHJcbiAgdXNlcklucHV0O1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgY2hhcnRPcHRpb246IEVDaGFydHNPcHRpb24gPSB7fTtcclxuICBwcm90ZWN0ZWQgYWxsU3Vic2NyaXB0aW9uczogYW55ID0gW107XHJcbiAgcmVhbHRpbWUgPSB0cnVlO1xyXG4gIGRldmljZUlkID0gJyc7XHJcbiAgcHJvdGVjdGVkIGNoYXJ0RGl2OiBIVE1MRGl2RWxlbWVudDtcclxuICBpc0RhdGFodWJQb3N0Q2FsbCA9IGZhbHNlO1xyXG4gIGRhdGFDaGFydDtcclxuICBjb2xvcnNGb3JDaGFydDtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoYXJ0U2VydmljZTogR3BTbWFydEVjaGFydFdpZGdldFNlcnZpY2UsXHJcbiAgICAgcHJpdmF0ZSBmZXRjaENsaWVudDogRmV0Y2hDbGllbnQpIHsgfVxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5jaGFydERpdiA9IHRoaXMubWFwRGl2UmVmLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICB0aGlzLmNyZWF0ZUNoYXJ0KHRoaXMuY29uZmlnKTtcclxuICB9XHJcbiAgZGF0YUZyb21Vc2VyKHVzZXJJbnB1dDogQ2hhcnRDb25maWcpIHtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodXNlcklucHV0KTtcclxuICB9Ly8gZW5kIG9mIGRhdGFGcm9tVXNlcigpXHJcbiAgLy8gY3JlYXRlIHZhcmlhYmxlcyBmb3IgYWxsIENoYXJ0Q29uZmlnIGxpa2UgdmFsdWUgdHlwZSwgYXBpZGF0YSBmcm9tIHVybCBldGMgdG8gc3RvcmUgdGhlIGRhdGEgZnJvbSB1c2VyXHJcbiAgLy8gY3JlYXRlIGNoYXJ0XHJcbiAgcmVsb2FkRGF0YSh1c2VySW5wdXQ6IENoYXJ0Q29uZmlnKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNoYXJ0KHVzZXJJbnB1dCk7XHJcbiAgfVxyXG4gIC8vIGNyZWF0ZUNoYXJ0IGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIGNoYXJ0IHdpdGggdGhlIGhlbHAgb2YgZWNoYXJ0IGxpYnJhcnlcclxuICBhc3luYyBjcmVhdGVDaGFydCh1c2VySW5wdXQ/OiBDaGFydENvbmZpZykge1xyXG4gICAgLy8gY29uc3QgY2hhcnREb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcnQtY29udGFpbmVyJyk7XHJcbiAgICAvLyBjb25zdCBteUNoYXJ0ID0gZWNoYXJ0cy5pbml0KGNoYXJ0RG9tKTtcclxuICAgIHRoaXMuZGF0YUNoYXJ0ID0gZWNoYXJ0cy5pbml0KHRoaXMuY2hhcnREaXYpO1xyXG4gICAgLy8gY29uc3QgbXlDaGFydCA9IGVjaGFydHMuaW5pdCh0aGlzLmNoYXJ0RGl2KTtcclxuICAgIHRoaXMuZGF0YUNoYXJ0LnNob3dMb2FkaW5nKCk7XHJcbiAgICBpZiAoIXVzZXJJbnB1dC5jb2xvcnMpIHtcclxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdObyBjb2xvcnMgU3BlY2lmaWVkJyk7IH1cclxuICAgICAgdGhpcy5jb2xvcnNGb3JDaGFydCA9IFtdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2xvcnNGb3JDaGFydCA9IFsuLi51c2VySW5wdXQuY29sb3JzLnNwbGl0KCcsJyldXHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnNob3dBcGlJbnB1dCkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhID0gYXdhaXQgdGhpcy5jaGFydFNlcnZpY2UuZ2V0QVBJRGF0YSh1c2VySW5wdXQuYXBpVXJsKS50b1Byb21pc2UoKTtcclxuICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnNob3dEYXRhaHViSW5wdXQpIHtcclxuICAgICAgY29uc3Qgc3FsUmVxT2JqZWN0ID0ge1xyXG4gICAgICAgIHNxbDogdXNlcklucHV0LnNxbFF1ZXJ5LFxyXG4gICAgICAgIGxpbWl0OiAxMDAsXHJcbiAgICAgICAgZm9ybWF0OiAnUEFOREFTJ1xyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hDbGllbnQuZmV0Y2godXNlcklucHV0LmFwaVVybCwge1xyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNxbFJlcU9iamVjdCksXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgfSlcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgdGhpcy5pc0RhdGFodWJQb3N0Q2FsbCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ05vIERhdGFzb3VyY2Ugc2VsZWN0ZWQnKTsgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgdGhpcy5kYXRhQ2hhcnQuaGlkZUxvYWRpbmcoKTtcclxuICAgICAgbGV0IGF4aXNGb250U2l6ZSA9IDA7XHJcbiAgICAgIGlmKHVzZXJJbnB1dC5mb250U2l6ZSA9PT0gMCB8fCB1c2VySW5wdXQuZm9udFNpemUgPT09ICcnIHx8IHVzZXJJbnB1dC5mb250U2l6ZSA9PT0gbnVsbCB8fCB1c2VySW5wdXQuZm9udFNpemUgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgYXhpc0ZvbnRTaXplID0gMTI7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBheGlzRm9udFNpemUgPSB1c2VySW5wdXQuZm9udFNpemU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXJJbnB1dC5hcmVhID09PSB0cnVlKSB7XHJcbiAgICAgICAgaWYodXNlcklucHV0LmFyZWFPcGFjaXR5ID09IG51bGwpe1xyXG4gICAgICAgICAgdXNlcklucHV0LmFyZWEgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcklucHV0LmFyZWEgPSB7XHJcbiAgICAgICAgICAgICdvcGFjaXR5JzogdXNlcklucHV0LmFyZWFPcGFjaXR5XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIHVzZXJJbnB1dC5hcmVhID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgIC8vIGNhbGxzIGZvciBBUEkgd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0UGllQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1BpZSBDaGFydCBGb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdQaWUgQ2hhcnQgRm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgcGllY2hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFBvbGFyQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvbGFyOiB7fSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQb2xhciBDaGFydCBGb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIFBvbGFyIENIYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3NjYXR0ZXInKSB7XHJcbiAgICAgICAgICBsZXQgeEF4aXNPYmplY3Q7IGxldCB5QXhpc09iamVjdDtcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgICAgICAgIHhBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB4QXhpc09iamVjdCxcclxuICAgICAgICAgICAgeUF4aXM6IHlBeGlzT2JqZWN0LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LmJveFpvb20sXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnU2NhdHRlciBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbikgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFNjYXR0ZXIgQ2hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6e1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6dXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcidcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkYXI6IHtcclxuICAgICAgICAgICAgICBpbmRpY2F0b3I6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXSB9O1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHJhZGl1czogdXNlcklucHV0LnJhZGFyQ2hhcnRSYWRpdXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUmFkYXIgY2hhcnQgZm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pIH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdSYWRhciBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUmFkYXIgQ0hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKCh1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnIHx8IHVzZXJJbnB1dC50eXBlID09PSAnYmFyJylcclxuICAgICAgICAgICYmICh1c2VySW5wdXQubGF5b3V0ICE9PSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgJiYgdXNlcklucHV0LmxheW91dCAhPT0gJ3N0YWNrZWRIb3Jpem9udGFsQmFyJykpIHtcclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZTsgbGV0IHlBeGlzTmFtZTtcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAvLyBuYW1lOiB4QXhpc05hbWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHlBeGlzTmFtZVxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuYm94Wm9vbSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1NpbXBsZSBiYXIgb3IgbGluZSBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIFNpbXBsZSBMaW5lLFNpbXBsZSBCYXIsU3RhY2tlZCBMaW5lIEFuZCBTdGFja2VkIEJhciBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInICYmICh1c2VySW5wdXQubGF5b3V0ID09PSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgfHwgdXNlcklucHV0LmxheW91dCA9PT0gJ3N0YWNrZWRIb3Jpem9udGFsQmFyJykpIHtcclxuICAgICAgICAgIGxldCB4QXhpc05hbWU7IGxldCB5QXhpc05hbWU7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRIb3Jpem9udGFsU2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAvLyAgICAgb3ZlcmZsb3c6ICd0cnVuY2F0ZScsXHJcbiAgICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgb3JpZW50OiAnaG9yaXpvbnRhbCcsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHhBeGlzTmFtZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgLy8gbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZXh0cmFjdFZhbHVlRnJvbUpTT04odXNlcklucHV0LnlBeGlzRGltZW5zaW9uLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnSG9yaXpvbnRhbCBjaGFydCBmb3IgQVBJJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIEhvcml6b250YWwgQmFyICYgU3RhY2tlZCBIb3Jpem9udGFsIEJhclxyXG4gICAgICB9IC8vIEVuZCBvZiBBUEkgY2FsbHMgd2l0aCBKU09OIFJlc3BvbnNlIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgZWxzZSBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIERhdGFodWIgd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdERpbWVuc2lvbiA9IHRoaXMuZ2V0UmVzdWx0RGltZXNpb25zKHVzZXJJbnB1dC5hZ2dyTGlzdCwgdXNlcklucHV0Lmdyb3VwQnkpO1xyXG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgbGV0IGVuY29kZURhdGE7XHJcbiAgICAgICAgY29uc3QgZGF0YXNldElkID0gbnVsbDtcclxuICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIGRhdGFodWIgaXNcclxuICAgICAgICAvLyBSZXN1bHQ6W1xyXG4gICAgICAgIC8vICAgXCJjb2x1bW5zXCI6Wydjb2xBJywnY29sQicsLi4uLCdjb2xOJ10sXHJcbiAgICAgICAgLy8gICBcImRhdGFcIjpbXHJcbiAgICAgICAgLy8gICAgIFtcIkExXCIsXCJCMVwiLC4uLixcIk4xXCJdLFxyXG4gICAgICAgIC8vICAgICBbXCJBMlwiLFwiQjJcIiwuLi4sXCJOMlwiXSxcclxuICAgICAgICAvLyAgICAgLi4uLFxyXG4gICAgICAgIC8vICAgICBbXCJBTlwiLFwiQk5cIiwuLi4sXCJOTlwiXVxyXG4gICAgICAgIC8vICAgXVxyXG4gICAgICAgIC8vIF1cclxuICAgICAgICAvLyBzb3VyY2Ugb2YgRGF0YXNldCBzaG91bGQgYmUgW1tjb2x1bW5zXSxbZGF0YXJvd3NdXVxyXG4gICAgICAgIHRoaXMuc2VydmljZURhdGEgPSBbdGhpcy5zZXJ2aWNlRGF0YS5jb2x1bW5zLCAuLi50aGlzLnNlcnZpY2VEYXRhLmRhdGFdXHJcbiAgICAgICAgLy8gRW5kIG9mIFJlc3BvbnNlIERhdGEgZXh0cmFjdGlvblxyXG4gICAgICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgfHwgdXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgbGV0IHlBeGlzTmFtZSA9ICcnOyBsZXQgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBzY2FsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQmFyIG9yIExpbmUgY2hhcnQgZm9yIERhdGFodWIgd2l0aG91dCBhZ2dyZWdhdGlvbicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgQmFyLExpbmUgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZSA9ICcnOyBsZXQgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHlBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1NjYXR0ZXIgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgU2NhdHRlciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lLCB1c2VySW5wdXQucGllU2xpY2VWYWx1ZV07XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJywgXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQaWUgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUGllIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBQaWUgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnM7IGxldCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnlEaW1lbnNpb25zXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlQXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgc3RhcnRBbmdsZTogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByYWRpdXNBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbWluOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvbGFyOiB7fSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1BvbGFyIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gIC8vIEVuZCBvZiBQb2xhciBDaGFydCBXaXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdyYWRhcicpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4udXNlcklucHV0LnJhZGFyRGltZW5zaW9uc107XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgY29uc3QgaW5kZXhPZlhEaW1lbnNpb24gPSB0aGlzLnNlcnZpY2VEYXRhWzBdLmluZGV4T2YodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIGNvbnN0IGluZGljYXRvckRhdGEgPSBbXTtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5zZXJ2aWNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpbmRpY2F0b3JEYXRhLnB1c2goeyBuYW1lOiB0aGlzLnNlcnZpY2VEYXRhW2ldW2luZGV4T2ZYRGltZW5zaW9uXSB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOntcclxuICAgICAgICAgICAgLy8gICB0ZXh0OnVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkYXI6IHtcclxuICAgICAgICAgICAgICBpbmRpY2F0b3I6IGluZGljYXRvckRhdGEsXHJcbiAgICAgICAgICAgICAgcmFkaXVzOiB1c2VySW5wdXQucmFkYXJDaGFydFJhZGl1c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdSYWRhciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdSYWRhciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUmFkYXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICB9IC8vIEVOZCBvZiBEYXRhaHViIENhbGxzIFJlc3BvbnNlIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgZWxzZSBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyBjYWxscyBmb3IgQVBJICYgRGF0YWh1YiB3aXRoIEFnZ3JlZ2F0aW9uXHJcbiAgICAgICAgZWNoYXJ0cy5yZWdpc3RlclRyYW5zZm9ybShzaW1wbGVUcmFuc2Zvcm0uYWdncmVnYXRlKTtcclxuICAgICAgICBjb25zdCByZXN1bHREaW1lbnNpb24gPSB0aGlzLmdldFJlc3VsdERpbWVzaW9ucyh1c2VySW5wdXQuYWdnckxpc3QsIHVzZXJJbnB1dC5ncm91cEJ5KTtcclxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xyXG4gICAgICAgIGxldCBlbmNvZGVEYXRhO1xyXG4gICAgICAgIGNvbnN0IGRhdGFzZXRJZCA9ICdfYWdncmVnYXRlJztcclxuICAgICAgICAvLyBFeHRyYWN0IHRoZSBzZXJ2aWNlIGRhdGEgYmFzZWQgb24gdGhlIHJlc3BvbnNlIHR5cGUgb2Ygd3RoZXJlIGNhbGwgaXMgbWFkZSB0byBEYXRhaHViIG9yIE90aGVyIEFQSVxyXG4gICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIGRhdGFodWIgaXNcclxuICAgICAgICAgIC8vIFJlc3VsdDpbXHJcbiAgICAgICAgICAvLyAgIFwiY29sdW1uc1wiOlsnY29sQScsJ2NvbEInLC4uLiwnY29sTiddLFxyXG4gICAgICAgICAgLy8gICBcImRhdGFcIjpbXHJcbiAgICAgICAgICAvLyAgICAgW1wiQTFcIixcIkIxXCIsLi4uLFwiTjFcIl0sXHJcbiAgICAgICAgICAvLyAgICAgW1wiQTJcIixcIkIyXCIsLi4uLFwiTjJcIl0sXHJcbiAgICAgICAgICAvLyAgICAgLi4uLFxyXG4gICAgICAgICAgLy8gICAgIFtcIkFOXCIsXCJCTlwiLC4uLixcIk5OXCJdXHJcbiAgICAgICAgICAvLyAgIF1cclxuICAgICAgICAgIC8vIF1cclxuICAgICAgICAgIC8vIHNvdXJjZSBvZiBEYXRhc2V0IHNob3VsZCBiZSBbW2NvbHVtbnNdLFtkYXRhcm93c11dXHJcbiAgICAgICAgICB0aGlzLnNlcnZpY2VEYXRhID0gW3RoaXMuc2VydmljZURhdGEuY29sdW1ucywgLi4udGhpcy5zZXJ2aWNlRGF0YS5kYXRhXVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIEFQaSBjYWxscyBpcyBKU09OIG9iamVjdCB3aXRoIGtleSx2YWx1ZVxyXG4gICAgICAgICAgLy8gUmVzdWx0OiBbXHJcbiAgICAgICAgICAvLyAgIHtcclxuICAgICAgICAgIC8vICAgICBcImtleTFcIjogXCJ2YWwxXCIsXHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkyXCI6IFwidmFsMlwiLFxyXG4gICAgICAgICAgLy8gICB9LFxyXG4gICAgICAgICAgLy8gICB7XHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkxXCI6IFwidmFsMS4xXCIsXHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkyXCI6IFwidmFsMi4xXCIsXHJcbiAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgIC8vIF1cclxuICAgICAgICAgIHRoaXMuc2VydmljZURhdGEgPSB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV07XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUmVzcG9uc2UgRGF0YSBleHRyYWN0aW9uXHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnM7IGxldCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGxldCB4QXhpc05hbWUgPSAnJzsgbGV0IHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBzY2FsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBCYXIgb3IgTGluZSBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgQmFyLExpbmUgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5nZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCB4QXhpc05hbWUgPSAnJzsgbGV0IHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6IHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA1MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgU2NhdHRlciBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgU2NhdHRlciBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BpZScpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZSwgdXNlcklucHV0LnBpZVNsaWNlVmFsdWVdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzZWxlY3RlZDogeyBkZXRhaWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBQaWUgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBQaWUgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBQaWUgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwb2xhcicpIHtcclxuICAgICAgICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiB7IGRldGFpbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0FnZ3JlZ2F0ZSBQb2xhciBjaGFydCcsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfSAgLy8gRW5kIG9mIFBvbGFyIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICB9ICAvLyBFbmQgb2YgY2FsbHMgZm9yIEFQSSAmIERhdGFodWIgd2l0aCBBZ2dyZWdhdGlvblxyXG4gICAgICAvLyBFbmQgb2YgY2hhcnRPcHRpb25zXHJcbiAgICB9IC8vIEVuZCBvZiBJRiBjb25kaXRpb24gY2hlY2tpbmcgd2hldGhlciB2YXJpYWJsZSBzZXJ2aWNlRGF0YSBoYXMgc29tZSBkYXRhIG9yIG5vdFxyXG4gIH1cclxuICBnZXRYQXhpc1R5cGUoaW5wdXQpIHtcclxuICAgIHJldHVybiBpbnB1dC54QXhpcztcclxuICB9XHJcbiAgZ2V0WUF4aXNUeXBlKGlucHV0KSB7XHJcbiAgICByZXR1cm4gaW5wdXQueUF4aXM7XHJcbiAgfVxyXG4gIGdldENoYXJ0VHlwZShpbnB1dCkge1xyXG4gICAgcmV0dXJuIGlucHV0LnR5cGU7XHJcbiAgfVxyXG4gIGdldEZvcm1hdHRlZE5hbWUoaW5wdXQpIHtcclxuICAgIGNvbnN0IHRlc3QgPSBpbnB1dC5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgIGNvbnN0IGEgPSB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgcmV0dXJuIGEudHJpbSgpO1xyXG4gIH1cclxuICBnZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkPywgeERpbWVuc2lvbnM/LCB5RGltZW5zaW9ucz8pIHtcclxuICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBjb29yZGluYXRlU3lzdGVtOiAncG9sYXInLFxyXG4gICAgICAgIG5hbWU6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICB0eXBlOiB1c2VySW5wdXQubGF5b3V0LFxyXG4gICAgICAgIHNob3dTeW1ib2w6IHRydWUsXHJcbiAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICByYWRpdXM6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgIGFuZ2xlOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICB0b29sdGlwOiBbdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLCB1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzRm9yQ2hhcnQsXHJcbiAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfV1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdob3Jpem9udGFsU2NhdHRlcicpIHtcclxuICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgeDogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMCksXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB4QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgICAgeEF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHhBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgeDogeEF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogW3hBeGlzRGltZW5zaW9uc1tpXSwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpLFxyXG4gICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBYQXhpc0RpbWVuc2lvblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB4OiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB5QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgICAgeUF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgeDogeUF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogW3lBeGlzRGltZW5zaW9uc1tpXSwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSksXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBZQXhpc0RpbWVuc2lvblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICBjb25zdCBkaW1lbnNpb25zID0gdXNlcklucHV0LnJhZGFyRGltZW5zaW9ucy5zcGxpdCgnLCcpO1xyXG4gICAgICBjb25zdCBkaW1lbnNpb25SZWNvcmQgPSBkaW1lbnNpb25zLnJlZHVjZSgoYWNjLCBkaW1lbnNpb24pID0+IHtcclxuICAgICAgICBhY2NbZGltZW5zaW9uXSA9IFtdO1xyXG4gICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgIH0sIHt9KTtcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25SZWNvcmRba2V5XSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25SZWNvcmRba2V5XS5wdXNoKGl0ZW1ba2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHJlc3VsdEFSUiA9IE9iamVjdC52YWx1ZXMoZGltZW5zaW9uUmVjb3JkKVxyXG4gICAgICBjb25zdCByZXN1bHQxID0gT2JqZWN0LmtleXMoZGltZW5zaW9uUmVjb3JkKS5tYXAoKGtleSwgaSkgPT4gKHtcclxuICAgICAgICBuYW1lOiBrZXksXHJcbiAgICAgICAgdmFsdWU6IGRpbWVuc2lvblJlY29yZFtrZXldLFxyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pKTtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0Lmxpc3ROYW1lLFxyXG4gICAgICAgIHR5cGU6ICdyYWRhcicsXHJcbiAgICAgICAgZGF0YTogcmVzdWx0MVxyXG4gICAgICB9XVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInICYmICh1c2VySW5wdXQubGF5b3V0ID09PSAnc2ltcGxlQmFyJyB8fCB1c2VySW5wdXQubGF5b3V0ID09PSAnc3RhY2tlZEJhcicpKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgbmFtZTogeURpbWVuc2lvbnMsXHJcbiAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB5RGltZW5zaW9ucy5hcnJheS5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeUF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB5RGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1tpXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInICYmICh1c2VySW5wdXQubGF5b3V0ID09PSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgfHwgdXNlcklucHV0LmxheW91dCA9PT0gJ3N0YWNrZWRIb3Jpem9udGFsQmFyJykpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICBuYW1lOiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHhEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB4QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHhEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgICAgbmFtZTogeERpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IC8vIGVuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICBuYW1lOiB5RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHlEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1tpXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgIGNvbnN0IGNvbnZyYWRpdXMgPSB1c2VySW5wdXQucmFkaXVzLnNwbGl0KCcsJyk7XHJcbiAgICAgIGxldCByb3NlVmFsdWUgPSAnJzsgbGV0IHNsaWNlU3R5bGU7XHJcbiAgICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAncm9zZU1vZGUnKSB7XHJcbiAgICAgICAgcm9zZVZhbHVlID0gJ3Jvc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzbGljZVN0eWxlID0ge307XHJcbiAgICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID4gMCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA+IDApIHtcclxuICAgICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMsXHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICBkYXRhc2V0SWQsXHJcbiAgICAgICAgcmFkaXVzOiBjb252cmFkaXVzLFxyXG4gICAgICAgIHJvc2VUeXBlOiByb3NlVmFsdWUsXHJcbiAgICAgICAgYXZvaWRMYWJlbE92ZXJsYXA6IGZhbHNlLFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiBmYWxzZSxcclxuICAgICAgICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsTGluZToge1xyXG4gICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGl0ZW1TdHlsZTogc2xpY2VTdHlsZSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgIHNoYWRvd0JsdXI6IDEwLFxyXG4gICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hbWU6IHVzZXJJbnB1dC5waWVTbGljZU5hbWUsXHJcbiAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICBpdGVtTmFtZTogW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lXSxcclxuICAgICAgICAgIHZhbHVlOiB1c2VySW5wdXQucGllU2xpY2VWYWx1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzRm9yQ2hhcnRcclxuICAgICAgfV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGdldFNjYXR0ZXJDaGFydFNlcmllc0RhdGEgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgc2VyaWVzIGRhdGEgZm9yIHNjYXR0ZXIgY2hhcnRcclxuICBnZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCkge1xyXG4gICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdob3Jpem9udGFsU2NhdHRlcicpIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeEF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgY29uc3QgeEF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeEF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB4QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gaXRlbVt4QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IC8vIGVuZCBvZiBmb3IgbG9vcFxyXG4gICAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICAgIH0vLyBFbmQgb2YgZWxzZSBwYXJ0IG9mIFhBeGlzRGltZW5zaW9uXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfV1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBpdGVtW3lBeGlzRGltZW5zaW9uc1tpXV07XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBZQXhpc0RpbWVuc2lvblxyXG4gICAgfVxyXG4gIH1cclxuICAvLyBnZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBzZXJpZXMgZGF0YSBmb3IgcG9sYXIgY2hhcnRcclxuICBnZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50UmVzdWx0ID0gW107XHJcbiAgICAgIGN1cnJlbnRSZXN1bHQucHVzaChpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl0pO1xyXG4gICAgICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dKTtcclxuICAgICAgcmVzdWx0LnB1c2goY3VycmVudFJlc3VsdCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBbe1xyXG4gICAgICBjb29yZGluYXRlU3lzdGVtOiAncG9sYXInLFxyXG4gICAgICBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgIHR5cGU6IHVzZXJJbnB1dC5sYXlvdXQsXHJcbiAgICAgIHNob3dTeW1ib2w6IHRydWUsXHJcbiAgICAgIGRhdGE6IHJlc3VsdCxcclxuICAgICAgbGFiZWw6IHtcclxuICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgIH0sXHJcbiAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKDApXHJcbiAgICAgIH0sXHJcbiAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfV1cclxuICB9XHJcbiAgLy8gZ2V0UmFkYXJTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gZ2V0IHRoZSBkYXRhIGZyb20gc2VydmljZSBhbmQgc3RvcmUgaXQgaW4gc2VyaWVzRGF0YSB2YXJpYWJsZVxyXG4gIGdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB1c2VySW5wdXQucmFkYXJEaW1lbnNpb25zLnNwbGl0KCcsJyk7XHJcbiAgICBjb25zdCBkaW1lbnNpb25SZWNvcmQgPSBkaW1lbnNpb25zLnJlZHVjZSgoYWNjLCBkaW1lbnNpb24pID0+IHtcclxuICAgICAgYWNjW2RpbWVuc2lvbl0gPSBbXTtcclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIHt9KTtcclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvblJlY29yZFtrZXldKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvblJlY29yZFtrZXldLnB1c2goaXRlbVtrZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSBkaW1lbnNpb25zLm1hcCgodiwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB2YWwgPSB2O1xyXG4gICAgICAgIHJldHVybiB7IGtleTogdmFsLCB2YWx1ZTogdGhpcy5zZXJ2aWNlRGF0YVswXS5pbmRleE9mKHYpIH07XHJcbiAgICAgIH0pO1xyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuc2VydmljZURhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpbmRleGVzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBkaW1lbnNpb25SZWNvcmRbZWxlbWVudC5rZXldLnB1c2godGhpcy5zZXJ2aWNlRGF0YVtpXVtlbGVtZW50LnZhbHVlXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3VsdDEgPSBPYmplY3Qua2V5cyhkaW1lbnNpb25SZWNvcmQpLm1hcCgoa2V5LCBpKSA9PiAoe1xyXG4gICAgICBuYW1lOiBrZXksXHJcbiAgICAgIHZhbHVlOiBkaW1lbnNpb25SZWNvcmRba2V5XSxcclxuICAgIH0pKTtcclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICB0eXBlOiAncmFkYXInLFxyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yc0ZvckNoYXJ0LFxyXG4gICAgICAgIGRhdGE6IHJlc3VsdDFcclxuICAgICAgfV1cclxuICAgIH1cclxuICB9XHJcbiAgY3JlYXRlT2JqZWN0KGRhdGFEaW0sIGFyciwgZGltZW4pIHtcclxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBkaW1lbi5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbiAgICBjb25zdCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHZhbCA9IHY7XHJcbiAgICAgIHJldHVybiB7IGtleTogdmFsLCB2YWx1ZTogZGF0YURpbS5pbmRleE9mKHYpIH07XHJcbiAgICB9KTtcclxuICAgIGFyci5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGluZGV4ZXMua2V5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGRpbWVuc2lvblJlY29yZFtlbGVtZW50LmtleV0ucHVzaChpdGVtW2VsZW1lbnQudmFsdWVdKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8gZ2V0UGllQ2hhcnRTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIHNlcmllcyBkYXRhIGZvciBwaWUgY2hhcnRcclxuICBnZXRQaWVDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICAvLyBjb252ZXJ0IGNvbW1hIHNlcGFyYXRlZCBzdHJpbmcgdXNlcklucHV0LnJhZGl1cyB0byBhcnJheVxyXG4gICAgY29uc3QgY29udnJhZGl1cyA9IHVzZXJJbnB1dC5yYWRpdXMuc3BsaXQoJywnKTtcclxuICAgIGxldCByb3NlVmFsdWUgPSAnJzsgbGV0IHNsaWNlU3R5bGU7XHJcbiAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ3Jvc2VNb2RlJykge1xyXG4gICAgICByb3NlVmFsdWUgPSAncm9zZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7fVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID4gMCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID4gMCkge1xyXG4gICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1c1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyxcclxuICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFt7XHJcbiAgICAgIG5hbWU6IHVzZXJJbnB1dC5saXN0TmFtZSxcclxuICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgIHJhZGl1czogY29udnJhZGl1cyxcclxuICAgICAgcm9zZVR5cGU6IHJvc2VWYWx1ZSxcclxuICAgICAgYXZvaWRMYWJlbE92ZXJsYXA6IGZhbHNlLFxyXG4gICAgICBsYWJlbDoge1xyXG4gICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgcG9zaXRpb246ICdjZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpdGVtU3R5bGU6IHNsaWNlU3R5bGUsXHJcbiAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yc0ZvckNoYXJ0LFxyXG4gICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgLy8gdGFrZSB2YWwgZnJvbSB1c2VyaW5wdXQucGllc2xpY2UgdmFsdWUgYW5kIHJldHVybiBpdFxyXG4gICAgICAgIGNvbnN0IHZhbCA9IGl0ZW1bdXNlcklucHV0LnBpZVNsaWNlVmFsdWVdO1xyXG4gICAgICAgIGxldCBuYW07XHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC5waWVTbGljZVZhbHVlID09PSB1c2VySW5wdXQucGllU2xpY2VuTmFtZSkge1xyXG4gICAgICAgICAgbmFtID0gdXNlcklucHV0LnBpZVNsaWNlbk5hbWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5hbSA9IGl0ZW1bdXNlcklucHV0LnBpZVNsaWNlbk5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB2YWx1ZTogdmFsLFxyXG4gICAgICAgICAgbmFtZTogbmFtLFxyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICB9XVxyXG4gIH1cclxuICAvLyBnZXRzZXJpZXNkYXRhIHJlY2lldmVzIHVzZXJpbnB1dCBhbmQgcmV0dXJucyBzZXJpZXNkYXRhXHJcbiAgLy8gc2VyaWVzZGF0YSBpcyBhbiBhcnJheSBvZiBvYmplY3RzXHJcbiAgZ2V0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICB9KSxcclxuICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICBzbW9vdGg6IHVzZXJJbnB1dC5zbW9vdGhMaW5lLFxyXG4gICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgIH1cclxuICAgICAgfV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB5QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgIHlBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgIGxldCBhYiA9IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFja0xpc3QsIHlBeGlzRGltZW5zaW9uc1tpXSk7XHJcbiAgICAgICAgeUF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgbmFtZTogeUF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFja0xpc3QsIHlBeGlzRGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3lBeGlzRGltZW5zaW9uc1tpXV07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldENoYXJ0SXRlbUNvbG9yKGluZGV4KSB7XHJcbiAgICBpZiAodGhpcy5jb2xvcnNGb3JDaGFydFtpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gJydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yc0ZvckNoYXJ0W2luZGV4XTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gR2V0cyB0aGUgZGltZW5zaW9ucyBmb3IgZGF0YXNldFxyXG4gIGdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCkge1xyXG4gICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7IGxldCBkaW1lbnNpb25BcnIgPSBbXTtcclxuICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgIGRpbWVuc2lvbkFyci5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGRpbWVuc2lvbkFyciA9IFsuLi5kaW1lbnNpb25BcnIsIC4uLnlEaW1lbnNpb25zXTtcclxuICAgIH1cclxuICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgIGRpbWVuc2lvbkFyci5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGRpbWVuc2lvbkFyciA9IFsuLi5kaW1lbnNpb25BcnIsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaW1lbnNpb25BcnI7XHJcbiAgfVxyXG4gIC8vIGlmIHN0YWNrZGF0YSBpcyBlbXB0eSB0aGVuIHJldHVybiBkaW1lbnNpb25OYW1lXHJcbiAgLy8gZWxzZSBpZiBzdGFja2RhdGEgaXMgbm90IGVtcHR5IHRoZW4gY2hlY2sgaWYgZGltZW5zaW9uTmFtZSBpcyBwcmVzZW50IGluIHN0YWNrZGF0YVxyXG4gIC8vIGlmIHByZXNlbnQgdGhlbiByZXR1cm4gc3RhY2tuYW1lXHJcbiAgLy8gZWxzZSByZXR1cm4gZGltZW5zaW9uTmFtZVxyXG4gIGdldFN0YWNrTmFtZShzdGFja0RhdGEsIGRpbWVuc2lvbk5hbWUpIHtcclxuICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgIHN0YWNrRGF0YS5mb3JFYWNoKCh2YWx1ZSwgeCkgPT4ge1xyXG4gICAgICBjb25zdCB2YWx1ZXMgPSBzdGFja0RhdGFbeF0uc3RhY2tWYWx1ZXMuc3BsaXQoJywnKTtcclxuICAgICAgdmFsdWVzLmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcclxuICAgICAgICBpZiAodmFsdWVzW2ldID09PSBkaW1lbnNpb25OYW1lKSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBzdGFja0RhdGFbeF0uc3RhY2tOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTsgLy8gZW5kIG9mIGZvciBsb29wIG9mIHN0YWNrZGF0YVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgLy8gR2V0IHRoZSBkaW1lbnNpb25zIGFuZCBtZXRob2QgYXJyYXkgZm9yIGFnZ3JlZ2F0aW9uXHJcbiAgLy8gTGlzdCBjb21lcyBmcm9tIGFnZ3JlZ2F0ZSBjb25maWcgYW5kIGNvbmF0aW5zIGJvdGggbWV0aG9kIGFuZCBkaW1lbnNpb24gbmFtZVxyXG4gIC8vIFdlIGFsc28gbmVlZCBncm91cCBieSB0byBiZSBpbmNsdWRlZCBhcyBhIGRpbWVuc2lvbiBidXQgd2l0aG91dCBhIG1ldGhvZFxyXG4gIGdldFJlc3VsdERpbWVzaW9ucyhsaXN0LCBncm91cGJ5KSB7XHJcbiAgICBjb25zdCBjaGFuZ2VkTmFtZXNGb3JSZXN1bHQgPSBsaXN0Lm1hcCgoe1xyXG4gICAgICBhZ2dyRGltZXNuaW9uOiBmcm9tLFxyXG4gICAgICBhZ2dyTWV0aG9kOiBtZXRob2RcclxuICAgIH0pID0+ICh7XHJcbiAgICAgIGZyb20sXHJcbiAgICAgIG1ldGhvZFxyXG4gICAgfSkpO1xyXG4gICAgY2hhbmdlZE5hbWVzRm9yUmVzdWx0LnB1c2goeyBmcm9tOiBncm91cGJ5IH0pO1xyXG4gICAgcmV0dXJuIGNoYW5nZWROYW1lc0ZvclJlc3VsdDtcclxuICB9XHJcbiAgLy8gTWV0aG9kIGZvciBzaG93aW5nIHRoZSBTbGlkZXIvUGluY2ggWm9vbVxyXG4gIHNob3dab29tRmVhdHVyZSh2YWwpIHtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnaW5zaWRlJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2xpZGVyJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1LFxyXG4gICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgIGhlaWdodDogMjAsXHJcbiAgICAgICAgICB0b3A6ICc5MCUnLFxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICBoZXhUb1JnYihoZXgpIHtcclxuICAgIC8vIEV4cGFuZCBzaG9ydGhhbmQgZm9ybSAoZS5nLiBcIjAzRlwiKSB0byBmdWxsIGZvcm0gKGUuZy4gXCIwMDMzRkZcIilcclxuICAgIHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XHJcbiAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGhhbmRSZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xyXG4gICAgICByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICByZXR1cm4gcmVzdWx0ID8gXCJyZ2JhKFwiICsgcGFyc2VJbnQocmVzdWx0WzFdLCAxNikgKyBcIiwgXCIgKyBwYXJzZUludChyZXN1bHRbMl0sIDE2KSArIFwiLCBcIiArIHBhcnNlSW50KHJlc3VsdFszXSwgMTYpICsgXCIsIFwiICsgMC44ICsgXCIpXCIgOiBudWxsO1xyXG4gIH1cclxuICAvLyBHZXQgZGF0YSBmb3IgaG9yaXpvbnRhbCBCYXIgY2hhcnRcclxuICBnZXRIb3Jpem9udGFsU2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdmFsID0gZXh0cmFjdFZhbHVlRnJvbUpTT04odXNlcklucHV0LnhBeGlzRGltZW5zaW9uLCBpdGVtKTtcclxuICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeEF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICB4QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICB4QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICBuYW1lOiB4QXhpc0RpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB4QXhpc0RpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdmFsID0gZXh0cmFjdFZhbHVlRnJvbUpTT04oeEF4aXNEaW1lbnNpb25zW2ldLCBpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzbW9vdGg6IHVzZXJJbnB1dC5zbW9vdGhMaW5lLFxyXG4gICAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7Ly8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXHJcbiAgLy8gIG9uUmVzaXplKCkge1xyXG4gIC8vICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YUNoYXJ0KVxyXG4gIC8vICAgIGlmICh0aGlzLmRhdGFDaGFydCkge1xyXG4gIC8vICAgICAgdGhpcy5kYXRhQ2hhcnQucmVzaXplKCk7XHJcbiAgLy8gICAgfVxyXG4gIC8vICB9XHJcbiAgb25SZXNpemVkKGV2ZW50OiBSZXNpemVkRXZlbnQpIHtcclxuICAgIHRoaXMud2lkdGggPSBldmVudC5uZXdXaWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gZXZlbnQubmV3SGVpZ2h0O1xyXG4gICAgY29uc29sZS5sb2coJ3Jlc2l6ZSBjYWxsZWQnLHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpO1xyXG4gICAgdGhpcy5kYXRhQ2hhcnQucmVzaXplKHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDp0aGlzLmhlaWdodFxyXG4gICAgfSk7XHJcbiAgfVxyXG59Il19