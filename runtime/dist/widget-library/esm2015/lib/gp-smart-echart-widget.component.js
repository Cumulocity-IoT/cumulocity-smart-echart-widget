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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBNEIsS0FBSyxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUduQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxlQUFlLE1BQU0sMEJBQTBCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFdBQVcsR0FFWixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU94RSxNQUFNLE9BQU8sNEJBQTRCO0lBaUJ2QyxZQUFvQixZQUF3QyxFQUNqRCxXQUF3QjtRQURmLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUNqRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQVRuQyxnQkFBVyxHQUFrQixFQUFFLENBQUM7UUFDdEIscUJBQWdCLEdBQVEsRUFBRSxDQUFDO1FBQ3JDLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVkLHNCQUFpQixHQUFHLEtBQUssQ0FBQztJQUlhLENBQUM7SUFDeEMsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELFlBQVksQ0FBQyxTQUFzQjtRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQSx3QkFBd0I7SUFDekIseUdBQXlHO0lBQ3pHLGVBQWU7SUFDZixVQUFVLENBQUMsU0FBc0I7UUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsK0VBQStFO0lBQ3pFLFdBQVcsQ0FBQyxTQUF1Qjs7WUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNyQixJQUFJLFNBQVMsRUFBRSxFQUFFO29CQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFBRTtnQkFDeEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUN2RDtZQUNELElBQUksU0FBUyxDQUFDLFlBQVksRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNyRjtpQkFBTSxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDckMsTUFBTSxZQUFZLEdBQUc7b0JBQ25CLEdBQUcsRUFBRSxTQUFTLENBQUMsUUFBUTtvQkFDdkIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxRQUFRO29CQUN6QixNQUFNLEVBQUUsUUFBUTtpQkFDakIsQ0FBQztnQkFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7b0JBQ2xFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztvQkFDbEMsTUFBTSxFQUFFLE1BQU07aUJBQ2YsQ0FBQyxDQUFBO2dCQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7YUFDL0I7aUJBQU07Z0JBQ0wsSUFBSSxTQUFTLEVBQUUsRUFBRTtvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7aUJBQUU7YUFDNUQ7WUFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzdCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBRyxTQUFTLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBQztvQkFDMUgsWUFBWSxHQUFHLEVBQUUsQ0FBQztpQkFDbkI7cUJBQUs7b0JBQ0osWUFBWSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25DO2dCQUNELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQzNCLElBQUcsU0FBUyxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUM7d0JBQy9CLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO3FCQUNyQjt5QkFBTTt3QkFDTCxTQUFTLENBQUMsSUFBSSxHQUFHOzRCQUNmLFNBQVMsRUFBRSxTQUFTLENBQUMsV0FBVzt5QkFDakMsQ0FBQztxQkFDSDtpQkFDRjtxQkFBSztvQkFDSixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDdkI7Z0JBQ0QsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7b0JBQzlELG9DQUFvQztvQkFDcEMsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTt3QkFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3hELElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsTUFBTSxFQUFFO2dDQUNOLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUk7Z0NBQzNCLEtBQUssRUFBRSxHQUFHO2dDQUNWLGNBQWM7Z0NBQ2QsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsU0FBUyxDQUFDLElBQUk7b0NBQ1osTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO3dDQUMxQyxnQ0FBZ0M7eUNBQy9CLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7b0NBQ3hELENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQ0FDVCxPQUFPLENBQUMsQ0FBQztnQ0FDWCxDQUFDOzZCQUNGOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsS0FBSztnQ0FDWCxXQUFXLEVBQUUsS0FBSztnQ0FDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUN0RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7Z0NBQ3hDLENBQUMsQ0FBQzs2QkFDSDs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLE9BQU87NkJBQ2Q7NEJBQ0QsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRSxNQUFNOzZCQUNoQjs0QkFDRCxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7NEJBQ3ZCLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUU7b0NBQ1AsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGO3lCQUNGLENBQUE7d0JBQ0QsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTt3QkFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3BEO29CQUNELDBCQUEwQjt5QkFDckIsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTt3QkFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzFELElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsTUFBTSxFQUFFO2dDQUNOLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUk7Z0NBQzNCLEtBQUssRUFBRSxHQUFHO2dDQUNWLGNBQWM7Z0NBQ2QsSUFBSSxFQUFFLFFBQVE7Z0NBQ2QsU0FBUyxDQUFDLElBQUk7b0NBQ1osTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDdkMsTUFBTSxDQUFDLEdBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO3dDQUNoQyxnQ0FBZ0M7eUNBQy9CLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7b0NBQzFELENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQ0FDVCxPQUFPLENBQUMsQ0FBQztnQ0FDWCxDQUFDOzZCQUNGOzRCQUNELElBQUksRUFBRTtnQ0FDSixJQUFJLEVBQUUsS0FBSztnQ0FDWCxHQUFHLEVBQUUsS0FBSztnQ0FDVixLQUFLLEVBQUUsS0FBSztnQ0FDWixNQUFNLEVBQUUsS0FBSztnQ0FDYixZQUFZLEVBQUUsSUFBSTs2QkFDbkI7NEJBQ0QsS0FBSyxFQUFFLEVBQUU7NEJBQ1QsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRSxNQUFNO2dDQUNmLFdBQVcsRUFBRTtvQ0FDWCxJQUFJLEVBQUUsT0FBTztpQ0FDZDtnQ0FDRCxPQUFPLEVBQUUsSUFBSTs2QkFDZDs0QkFDRCxTQUFTLEVBQUU7Z0NBQ1QsSUFBSSxFQUFFLE9BQU87Z0NBQ2IsVUFBVSxFQUFFLENBQUM7NkJBQ2Q7NEJBQ0QsVUFBVSxFQUFFO2dDQUNWLEdBQUcsRUFBRSxDQUFDOzZCQUNQOzRCQUNELE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVTs0QkFDdkIsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRTtvQ0FDUCxXQUFXLEVBQUUsRUFBRTtpQ0FDaEI7NkJBQ0Y7eUJBQ0YsQ0FBQTt3QkFDRCxJQUFJLFNBQVMsRUFBRSxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUFFO3FCQUMzRTtvQkFDRCw2QkFBNkI7eUJBQ3hCLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7d0JBQ3JDLElBQUksV0FBVyxDQUFDO3dCQUFDLElBQUksV0FBVyxDQUFDO3dCQUNqQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssbUJBQW1CLEVBQUU7NEJBQzVDLFdBQVcsR0FBRztnQ0FDWixJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0NBQ3JELFlBQVksRUFBRSxRQUFRO2dDQUN0QixPQUFPLEVBQUUsRUFBRTtnQ0FDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0NBQ2xDLFdBQVcsRUFBRSxLQUFLO2dDQUNsQixTQUFTLEVBQUM7b0NBQ1IsUUFBUSxFQUFDLENBQUM7b0NBQ1YsUUFBUSxFQUFDLFlBQVk7b0NBQ3JCLE1BQU0sRUFBQyxTQUFTLENBQUMsaUJBQWlCO2lDQUNuQzs2QkFDRixDQUFDOzRCQUNGLFdBQVcsR0FBRztnQ0FDWixJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0NBQ3JELFlBQVksRUFBRSxRQUFRO2dDQUN0QixPQUFPLEVBQUUsRUFBRTtnQ0FDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0NBQ3RELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQ0FDeEMsQ0FBQyxDQUFDO2dDQUNGLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQ0FDbEMsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0YsQ0FBQzt5QkFDSDs2QkFBTTs0QkFDTCxXQUFXLEdBQUc7Z0NBQ1osSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO2dDQUNyRCxZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsT0FBTyxFQUFFLEVBQUU7Z0NBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUN0RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7Z0NBQ3hDLENBQUMsQ0FBQztnQ0FDRixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0NBQ2xDLFdBQVcsRUFBRSxLQUFLO2dDQUNsQixTQUFTLEVBQUM7b0NBQ1IsUUFBUSxFQUFDLFlBQVk7b0NBQ3JCLE1BQU0sRUFBQyxTQUFTLENBQUMsaUJBQWlCO2lDQUNuQzs2QkFDRixDQUFDOzRCQUNGLFdBQVcsR0FBRztnQ0FDWixJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0NBQ3JELFlBQVksRUFBRSxRQUFRO2dDQUN0QixPQUFPLEVBQUUsRUFBRTtnQ0FDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0NBQ2xDLFNBQVMsRUFBQztvQ0FDUixRQUFRLEVBQUMsWUFBWTtvQ0FDckIsTUFBTSxFQUFDLFNBQVMsQ0FBQyxpQkFBaUI7aUNBQ25DOzZCQUNGLENBQUM7eUJBQ0g7d0JBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzVELElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxLQUFLLEVBQUUsV0FBVzs0QkFDbEIsS0FBSyxFQUFFLFdBQVc7NEJBQ2xCLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUUsTUFBTTtnQ0FDZixXQUFXLEVBQUU7b0NBQ1gsSUFBSSxFQUFFLE9BQU87aUNBQ2Q7NkJBQ0Y7NEJBQ0QsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRTtvQ0FDUCxRQUFRLEVBQUU7d0NBQ1IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPO3dDQUN2QixVQUFVLEVBQUUsTUFBTTtxQ0FDbkI7b0NBQ0QsT0FBTyxFQUFFLEVBQUU7b0NBQ1gsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGOzRCQUNELE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixjQUFjO2dDQUNkLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDOzRCQUNwRCxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7eUJBQ3hCLENBQUE7d0JBQ0QsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTt5QkFBRTtxQkFDNUUsQ0FBQywrQkFBK0I7eUJBQzVCLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHOzRCQUNqQixVQUFVOzRCQUNWLDBCQUEwQjs0QkFDMUIsa0JBQWtCOzRCQUNsQixLQUFLOzRCQUNMLE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixjQUFjO2dDQUNkLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFLE1BQU07Z0NBQ2YsT0FBTyxFQUFFLElBQUk7NkJBQ2Q7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29DQUMzRCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztnQ0FDbEQsQ0FBQyxDQUFDO2dDQUNGLE1BQU0sRUFBRSxTQUFTLENBQUMsZ0JBQWdCOzZCQUNuQzs0QkFDRCxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7NEJBQ3ZCLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUU7b0NBQ1AsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGO3lCQUNGLENBQUE7d0JBQ0QsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTt5QkFBRTt3QkFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3RELENBQUMsNkJBQTZCO3lCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUM7MkJBQzNELENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxxQkFBcUIsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLHNCQUFzQixDQUFDLEVBQUU7d0JBQ2hHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDaEQsSUFBSSxTQUFTLENBQUM7d0JBQUMsSUFBSSxTQUFTLENBQUM7d0JBQzdCLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs0QkFDbEQsU0FBUyxHQUFHLEVBQUUsQ0FBQTt5QkFDZjs2QkFBTTs0QkFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQTt5QkFDNUQ7d0JBQ0QsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUNsRCxTQUFTLEdBQUcsRUFBRSxDQUFBO3lCQUNmOzZCQUFNOzRCQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFBO3lCQUM1RDt3QkFDRCxJQUFJLENBQUMsV0FBVyxHQUFHOzRCQUNqQixXQUFXOzRCQUNYLDJCQUEyQjs0QkFDM0IsbUJBQW1COzRCQUNuQixLQUFLOzRCQUNMLE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixjQUFjO2dDQUNkLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFLE1BQU07Z0NBQ2YsV0FBVyxFQUFFO29DQUNYLElBQUksRUFBRSxPQUFPO2lDQUNkO2dDQUNELE9BQU8sRUFBRSxJQUFJOzZCQUNkOzRCQUNELFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7NEJBQ3BELElBQUksRUFBRTtnQ0FDSixJQUFJLEVBQUUsS0FBSztnQ0FDWCxHQUFHLEVBQUUsS0FBSztnQ0FDVixLQUFLLEVBQUUsS0FBSztnQ0FDWixNQUFNLEVBQUUsS0FBSztnQ0FDYixZQUFZLEVBQUUsSUFBSTs2QkFDbkI7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQ0FDdEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dDQUN4QyxDQUFDLENBQUM7Z0NBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxXQUFXLEVBQUUsS0FBSztnQ0FDbEIsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7Z0NBQ0Qsa0JBQWtCOzZCQUNuQjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxrQkFBa0I7Z0NBQ2xCLFNBQVMsRUFBQztvQ0FDUixRQUFRLEVBQUMsQ0FBQztvQ0FDVixRQUFRLEVBQUMsWUFBWTtvQ0FDckIsTUFBTSxFQUFDLFNBQVMsQ0FBQyxpQkFBaUI7aUNBQ25DOzZCQUNGOzRCQUNELE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVTs0QkFDdkIsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRTtvQ0FDUCxRQUFRLEVBQUU7d0NBQ1IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPO3dDQUN2QixVQUFVLEVBQUUsTUFBTTtxQ0FDbkI7b0NBQ0QsT0FBTyxFQUFFLEVBQUU7b0NBQ1gsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGO3lCQUNGLENBQUM7d0JBQ0YsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTtxQkFDeEY7b0JBQ0QscUVBQXFFO3lCQUNoRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxxQkFBcUIsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLHNCQUFzQixDQUFDLEVBQUU7d0JBQ2hJLElBQUksU0FBUyxDQUFDO3dCQUFDLElBQUksU0FBUyxDQUFDO3dCQUM3QixJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ2xELFNBQVMsR0FBRyxFQUFFLENBQUE7eUJBQ2Y7NkJBQU07NEJBQ0wsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUE7eUJBQzVEO3dCQUNELElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs0QkFDbEQsU0FBUyxHQUFHLEVBQUUsQ0FBQTt5QkFDZjs2QkFBTTs0QkFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQTt5QkFDNUQ7d0JBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzFELElBQUksQ0FBQyxXQUFXOzRCQUNoQjtnQ0FDRSxXQUFXO2dDQUNYLDJCQUEyQjtnQ0FDM0Isb0JBQW9CO2dDQUNwQixpQkFBaUI7Z0NBQ2pCLDRCQUE0QjtnQ0FDNUIsTUFBTTtnQ0FDTixLQUFLO2dDQUNMLElBQUksRUFBRTtvQ0FDSixJQUFJLEVBQUUsS0FBSztvQ0FDWCxHQUFHLEVBQUUsS0FBSztvQ0FDVixLQUFLLEVBQUUsS0FBSztvQ0FDWixNQUFNLEVBQUUsS0FBSztvQ0FDYixZQUFZLEVBQUUsSUFBSTtpQ0FDbkI7Z0NBQ0QsTUFBTSxFQUFFO29DQUNOLElBQUksRUFBRSxJQUFJO29DQUNWLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUk7b0NBQzNCLE1BQU0sRUFBRSxZQUFZO29DQUNwQixjQUFjO29DQUNkLFNBQVMsQ0FBQyxJQUFJO3dDQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzs0Q0FDaEMsZ0NBQWdDOzZDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dDQUMxRCxPQUFPLENBQUMsQ0FBQztvQ0FDWCxDQUFDO29DQUNELElBQUksRUFBRSxRQUFRO2lDQUNmO2dDQUNELFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0NBQ3BELEtBQUssRUFBRTtvQ0FDTCxtQkFBbUI7b0NBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztvQ0FDbEMsV0FBVyxFQUFFLEtBQUs7b0NBQ2xCLFNBQVMsRUFBQzt3Q0FDUixRQUFRLEVBQUMsQ0FBQzt3Q0FDVixRQUFRLEVBQUMsWUFBWTt3Q0FDckIsTUFBTSxFQUFDLFNBQVMsQ0FBQyxpQkFBaUI7cUNBQ25DO2lDQUNGO2dDQUNELEtBQUssRUFBRTtvQ0FDTCxtQkFBbUI7b0NBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztvQ0FDbEMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dDQUN0RCxNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO3dDQUNqRSxPQUFPLEdBQUcsQ0FBQztvQ0FDYixDQUFDLENBQUM7b0NBQ0YsU0FBUyxFQUFDO3dDQUNSLFFBQVEsRUFBQyxDQUFDO3dDQUNWLFFBQVEsRUFBQyxZQUFZO3dDQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtxQ0FDbkM7aUNBQ0Y7Z0NBQ0QsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVO2dDQUN2QixPQUFPLEVBQUU7b0NBQ1AsT0FBTyxFQUFFO3dDQUNQLFFBQVEsRUFBRTs0Q0FDUixJQUFJLEVBQUUsSUFBSTs0Q0FDVixVQUFVLEVBQUUsTUFBTTt5Q0FDbkI7d0NBQ0QsT0FBTyxFQUFFLEVBQUU7d0NBQ1gsV0FBVyxFQUFFLEVBQUU7cUNBQ2hCO2lDQUNGOzZCQUNGLENBQUM7d0JBQ0YsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTtxQkFDaEY7b0JBQ0QsaURBQWlEO2lCQUNsRCxDQUFDLDBEQUEwRDtxQkFDdkQsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO29CQUNsRSx3Q0FBd0M7b0JBQ3hDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdkYsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNwQixJQUFJLFVBQVUsQ0FBQztvQkFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ3ZCLGlDQUFpQztvQkFDakMsV0FBVztvQkFDWCwwQ0FBMEM7b0JBQzFDLGFBQWE7b0JBQ2IsNEJBQTRCO29CQUM1Qiw0QkFBNEI7b0JBQzVCLFdBQVc7b0JBQ1gsMkJBQTJCO29CQUMzQixNQUFNO29CQUNOLElBQUk7b0JBQ0oscURBQXFEO29CQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUN2RSxrQ0FBa0M7b0JBQ2xDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7d0JBQ3pELFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2xELElBQUksV0FBVyxDQUFDO3dCQUFDLElBQUksV0FBVyxDQUFDO3dCQUNqQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBQUMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDOzRCQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDN0Q7NkJBQU07NEJBQ0wsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNsRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDOzRCQUM3QyxTQUFTLEdBQUcsRUFBRSxDQUFDO3lCQUNoQjt3QkFDRCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDOzRCQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDN0Q7NkJBQU07NEJBQ0wsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNsRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDOzRCQUM3QyxTQUFTLEdBQUcsRUFBRSxDQUFDO3lCQUNoQjt3QkFDRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUNoRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTt5QkFDbkM7d0JBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7d0JBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLE9BQU8sRUFBRTtnQ0FDUDtvQ0FDRSxFQUFFLEVBQUUsVUFBVTtvQ0FDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUNBQ3pCOzZCQUNGOzRCQUNELFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRSxNQUFNO2dDQUNmLFdBQVcsRUFBRTtvQ0FDWCxJQUFJLEVBQUUsT0FBTztpQ0FDZDtnQ0FDRCxPQUFPLEVBQUUsSUFBSTs2QkFDZDs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dDQUM5QixZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsT0FBTyxFQUFFLEVBQUU7Z0NBQ1gsS0FBSyxFQUFFLElBQUk7Z0NBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxXQUFXLEVBQUUsS0FBSztnQ0FDbEIsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQ0FDbEMsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxNQUFNLEVBQUU7Z0NBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSTtnQ0FDM0IsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsY0FBYztnQ0FDZCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxTQUFTLENBQUMsSUFBSTtvQ0FDWixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2QyxNQUFNLENBQUMsR0FDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7d0NBQ2hDLGdDQUFnQzt5Q0FDL0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQ0FDMUQsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29DQUNULE9BQU8sQ0FBQyxDQUFDO2dDQUNYLENBQUM7NkJBQ0Y7NEJBQ0QsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzs0QkFDcEQsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRTtvQ0FDUCxRQUFRLEVBQUU7d0NBQ1IsSUFBSSxFQUFFLElBQUk7cUNBQ1g7b0NBQ0QsV0FBVyxFQUFFLEVBQUU7b0NBQ2YsT0FBTyxFQUFFLEVBQUU7aUNBQ1o7NkJBQ0Y7NEJBQ0QsTUFBTSxFQUFFLFVBQVU7eUJBQ25CLENBQUM7d0JBQ0YsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1EQUFtRCxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTtxQkFDekcsQ0FBQyx3REFBd0Q7eUJBQ3JELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7d0JBQ3JDLFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2xELElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7NEJBQ2hELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lCQUNuQzt3QkFDRCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBQUMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ2xELFNBQVMsR0FBRyxFQUFFLENBQUM7eUJBQ2hCOzZCQUFNOzRCQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3lCQUM3RDt3QkFDRCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ2xELFNBQVMsR0FBRyxFQUFFLENBQUM7eUJBQ2hCOzZCQUFNOzRCQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3lCQUM3RDt3QkFDRCxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLE9BQU8sRUFBRTtnQ0FDUDtvQ0FDRSxFQUFFLEVBQUUsVUFBVTtvQ0FDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUNBQ3pCOzZCQUNGOzRCQUNELFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxNQUFNLEVBQUU7Z0NBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSTtnQ0FDM0IsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsY0FBYztnQ0FDZCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxTQUFTLENBQUMsSUFBSTtvQ0FDWixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2QyxNQUFNLENBQUMsR0FDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7d0NBQ2hDLGdDQUFnQzt5Q0FDL0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQ0FDMUQsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29DQUNULE9BQU8sQ0FBQyxDQUFDO2dDQUNYLENBQUM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxTQUFTO2dDQUNmLFlBQVksRUFBRSxRQUFRO2dDQUN0QixPQUFPLEVBQUUsRUFBRTtnQ0FDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7Z0NBQ2xDLFdBQVcsRUFBRSxLQUFLO2dDQUNsQixTQUFTLEVBQUM7b0NBQ1IsUUFBUSxFQUFDLENBQUM7b0NBQ1YsUUFBUSxFQUFDLFlBQVk7b0NBQ3JCLE1BQU0sRUFBQyxTQUFTLENBQUMsaUJBQWlCO2lDQUNuQzs2QkFDRjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsWUFBWSxFQUFFLFFBQVE7Z0NBQ3RCLE9BQU8sRUFBRSxFQUFFO2dDQUNYLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQ0FDbEMsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0Y7NEJBQ0QsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRSxNQUFNO2dDQUNmLFdBQVcsRUFBRTtvQ0FDWCxJQUFJLEVBQUUsT0FBTztpQ0FDZDtnQ0FDRCxPQUFPLEVBQUUsSUFBSTs2QkFDZDs0QkFDRCxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDOzRCQUNwRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFFBQVEsRUFBRTt3Q0FDUixJQUFJLEVBQUUsSUFBSTt3Q0FDVixVQUFVLEVBQUUsTUFBTTtxQ0FDbkI7b0NBQ0QsT0FBTyxFQUFFLEVBQUU7b0NBQ1gsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGOzRCQUNELE1BQU0sRUFBRSxVQUFVO3lCQUNuQixDQUFBO3dCQUNELElBQUksU0FBUyxFQUFFLEVBQUU7NEJBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQUU7cUJBQ3JHLENBQUMsdURBQXVEO3lCQUNwRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO3dCQUNqQyxVQUFVLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDaEUsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHOzRCQUNqQixPQUFPLEVBQUU7Z0NBQ1A7b0NBQ0UsRUFBRSxFQUFFLFVBQVU7b0NBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2lDQUN6Qjs2QkFDRjs0QkFDRCxXQUFXOzRCQUNYLDJCQUEyQjs0QkFDM0IsbUJBQW1COzRCQUNuQixLQUFLOzRCQUNMLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUUsTUFBTTtnQ0FDZixPQUFPLEVBQUUsSUFBSTs2QkFDZDs0QkFDRCxJQUFJLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsR0FBRyxFQUFFLEtBQUs7Z0NBQ1YsS0FBSyxFQUFFLEtBQUs7Z0NBQ1osTUFBTSxFQUFFLEtBQUs7Z0NBQ2IsWUFBWSxFQUFFLElBQUk7NkJBQ25COzRCQUNELE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixlQUFlO2dDQUNmLElBQUksRUFBRSxNQUFNO2dDQUNaLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFdBQVcsRUFBRSxFQUFFO2lDQUNoQjs2QkFDRjs0QkFDRCxNQUFNLEVBQUUsVUFBVTt5QkFDbkIsQ0FBQzt3QkFDRixJQUFJLFNBQVMsRUFBRSxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUFFO3dCQUNoRyxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDNUUsQ0FBQyxtREFBbUQ7eUJBQ2hELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7d0JBQ25DLElBQUksV0FBVyxDQUFDO3dCQUFDLElBQUksV0FBVyxDQUFDO3dCQUNqQyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDOzRCQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUM5Qjs2QkFBTTs0QkFDTCxXQUFXLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2xELFVBQVUsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7eUJBQzlDO3dCQUNELElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDcEQsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUM7NEJBQ3ZDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQzlCOzZCQUFNOzRCQUNMLFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbEQsVUFBVSxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQzt5QkFDOUM7d0JBQ0QsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTs0QkFDaEQsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7eUJBQ25DO3dCQUNELFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO3dCQUNoRixJQUFJLENBQUMsV0FBVyxHQUFHOzRCQUNqQixPQUFPLEVBQUU7Z0NBQ1A7b0NBQ0UsRUFBRSxFQUFFLFVBQVU7b0NBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2lDQUN6Qjs2QkFDRjs0QkFDRCxXQUFXOzRCQUNYLDJCQUEyQjs0QkFDM0IsbUJBQW1COzRCQUNuQixLQUFLOzRCQUNMLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUUsTUFBTTtnQ0FDZixXQUFXLEVBQUU7b0NBQ1gsSUFBSSxFQUFFLE9BQU87aUNBQ2Q7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxTQUFTLEVBQUU7Z0NBQ1QsSUFBSSxFQUFFLE9BQU87Z0NBQ2IsVUFBVSxFQUFFLENBQUM7NkJBQ2Q7NEJBQ0QsVUFBVSxFQUFFO2dDQUNWLEdBQUcsRUFBRSxDQUFDOzZCQUNQOzRCQUNELEtBQUssRUFBRSxFQUFFOzRCQUNULE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixjQUFjO2dDQUNkLElBQUksRUFBRSxNQUFNO2dDQUNaLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFdBQVcsRUFBRSxFQUFFO2lDQUNoQjs2QkFDRjs0QkFDRCxNQUFNLEVBQUUsVUFBVTt5QkFDbkIsQ0FBQzt3QkFDRixJQUFJLFNBQVMsRUFBRSxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUFFO3FCQUNuRyxDQUFFLHFEQUFxRDt5QkFDbkQsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTt3QkFDbkMsVUFBVSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNyRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDaEYsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO3dCQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ2hELGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDdEU7d0JBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRzs0QkFDakIsVUFBVTs0QkFDViwwQkFBMEI7NEJBQzFCLGtCQUFrQjs0QkFDbEIsS0FBSzs0QkFDTCxNQUFNLEVBQUU7Z0NBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSTtnQ0FDM0IsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsY0FBYztnQ0FDZCxJQUFJLEVBQUUsTUFBTTtnQ0FDWixJQUFJLEVBQUUsUUFBUTtnQ0FDZCxTQUFTLENBQUMsSUFBSTtvQ0FDWixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2QyxNQUFNLENBQUMsR0FDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7d0NBQ2hDLGdDQUFnQzt5Q0FDL0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQ0FDMUQsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29DQUNULE9BQU8sQ0FBQyxDQUFDO2dDQUNYLENBQUM7NkJBQ0Y7NEJBQ0QsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRSxNQUFNOzZCQUNoQjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsU0FBUyxFQUFFLGFBQWE7Z0NBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsZ0JBQWdCOzZCQUNuQzs0QkFDRCxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7NEJBQ3ZCLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUU7b0NBQ1AsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGO3lCQUNGLENBQUE7d0JBQ0QsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTt3QkFDbEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQzlFLENBQUMscURBQXFEO2lCQUN4RCxDQUFDLG9EQUFvRDtxQkFDakQsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3RDLDJDQUEyQztvQkFDM0MsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDckQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2RixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLElBQUksVUFBVSxDQUFDO29CQUNmLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQztvQkFDL0IscUdBQXFHO29CQUNyRyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTt3QkFDMUIsaUNBQWlDO3dCQUNqQyxXQUFXO3dCQUNYLDBDQUEwQzt3QkFDMUMsYUFBYTt3QkFDYiw0QkFBNEI7d0JBQzVCLDRCQUE0Qjt3QkFDNUIsV0FBVzt3QkFDWCwyQkFBMkI7d0JBQzNCLE1BQU07d0JBQ04sSUFBSTt3QkFDSixxREFBcUQ7d0JBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7cUJBQ3hFO3lCQUFNO3dCQUNMLDhEQUE4RDt3QkFDOUQsWUFBWTt3QkFDWixNQUFNO3dCQUNOLHNCQUFzQjt3QkFDdEIsc0JBQXNCO3dCQUN0QixPQUFPO3dCQUNQLE1BQU07d0JBQ04sd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLE1BQU07d0JBQ04sSUFBSTt3QkFDSixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUN6RCxDQUFDLGtDQUFrQztvQkFDcEMsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTt3QkFDekQsSUFBSSxXQUFXLENBQUM7d0JBQUMsSUFBSSxXQUFXLENBQUM7d0JBQ2pDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzt3QkFBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBQ3ZDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFOzRCQUMxQixVQUFVLEdBQUcsSUFBSSxDQUFDO3lCQUNuQjs2QkFBTTs0QkFDTCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0NBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO2dDQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dDQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzs2QkFDN0Q7aUNBQU07Z0NBQ0wsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNsRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dDQUM3QyxTQUFTLEdBQUcsRUFBRSxDQUFDOzZCQUNoQjs0QkFDRCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0NBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO2dDQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dDQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzs2QkFDN0Q7aUNBQU07Z0NBQ0wsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNsRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dDQUM3QyxTQUFTLEdBQUcsRUFBRSxDQUFDOzZCQUNoQjs0QkFDRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dDQUNoRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTs2QkFDbkM7eUJBQ0Y7d0JBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7d0JBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUc7NEJBQ2pCLE9BQU8sRUFBRTtnQ0FDUDtvQ0FDRSxFQUFFLEVBQUUsVUFBVTtvQ0FDZCxVQUFVO29DQUNWLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVztpQ0FDekI7Z0NBQ0Q7b0NBQ0UsRUFBRSxFQUFFLFlBQVk7b0NBQ2hCLGFBQWEsRUFBRSxVQUFVO29DQUN6QixTQUFTLEVBQUU7d0NBQ1Q7NENBQ0UsSUFBSSxFQUFFLDZCQUE2Qjs0Q0FDbkMsTUFBTSxFQUFFO2dEQUNOLGdCQUFnQixFQUNkLGVBQWU7Z0RBQ2pCLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTzs2Q0FDM0I7NENBQ0QsS0FBSyxFQUFFLElBQUk7eUNBQ1o7cUNBQ0Y7aUNBQ0Y7NkJBQ0Y7NEJBQ0QsV0FBVzs0QkFDWCwyQkFBMkI7NEJBQzNCLG1CQUFtQjs0QkFDbkIsS0FBSzs0QkFDTCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFLE1BQU07Z0NBQ2YsV0FBVyxFQUFFO29DQUNYLElBQUksRUFBRSxPQUFPO2lDQUNkO2dDQUNELE9BQU8sRUFBRSxJQUFJOzZCQUNkOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsU0FBUztnQ0FDZixZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsT0FBTyxFQUFFLEVBQUU7Z0NBQ1gsS0FBSyxFQUFFLElBQUk7Z0NBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxXQUFXLEVBQUUsS0FBSztnQ0FDbEIsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQ0FDbEMsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsU0FBUyxFQUFDO29DQUNSLFFBQVEsRUFBQyxDQUFDO29DQUNWLFFBQVEsRUFBQyxZQUFZO29DQUNyQixNQUFNLEVBQUMsU0FBUyxDQUFDLGlCQUFpQjtpQ0FDbkM7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxNQUFNLEVBQUU7Z0NBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSTtnQ0FDM0IsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsY0FBYztnQ0FDZCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxTQUFTLENBQUMsSUFBSTtvQ0FDWixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2QyxNQUFNLENBQUMsR0FDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUM7d0NBQ2hDLGdDQUFnQzt5Q0FDL0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQ0FDMUQsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29DQUNULE9BQU8sQ0FBQyxDQUFDO2dDQUNYLENBQUM7NkJBQ0Y7NEJBQ0QsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzs0QkFDcEQsT0FBTyxFQUFFO2dDQUNQLE9BQU8sRUFBRTtvQ0FDUCxRQUFRLEVBQUU7d0NBQ1IsSUFBSSxFQUFFLElBQUk7cUNBQ1g7b0NBQ0QsV0FBVyxFQUFFLEVBQUU7b0NBQ2YsT0FBTyxFQUFFLEVBQUU7aUNBQ1o7NkJBQ0Y7NEJBQ0QsTUFBTSxFQUFFLFVBQVU7eUJBQ25CLENBQUM7d0JBQ0YsSUFBSSxTQUFTLEVBQUUsRUFBRTs0QkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFBRTtxQkFDbkYsQ0FBQyw2REFBNkQ7eUJBQzFELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7d0JBQ3JDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFOzRCQUMxQixVQUFVLEdBQUcsSUFBSSxDQUFDO3lCQUNuQjs2QkFBTTs0QkFDTCxVQUFVLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUNsRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dDQUNoRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTs2QkFDbkM7eUJBQ0Y7d0JBQ0QsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO3dCQUFDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzt3QkFDdkMsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUNsRCxTQUFTLEdBQUcsRUFBRSxDQUFDO3lCQUNoQjs2QkFBTTs0QkFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDN0Q7d0JBQ0QsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUNsRCxTQUFTLEdBQUcsRUFBRSxDQUFDO3lCQUNoQjs2QkFBTTs0QkFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDN0Q7d0JBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHOzRCQUNqQixPQUFPLEVBQUU7Z0NBQ1A7b0NBQ0UsRUFBRSxFQUFFLFVBQVU7b0NBQ2QsVUFBVTtvQ0FDVixNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUNBQ3pCO2dDQUNEO29DQUNFLEVBQUUsRUFBRSxZQUFZO29DQUNoQixhQUFhLEVBQUUsVUFBVTtvQ0FDekIsU0FBUyxFQUFFO3dDQUNUOzRDQUNFLElBQUksRUFBRSw2QkFBNkI7NENBQ25DLE1BQU0sRUFBRTtnREFDTixnQkFBZ0IsRUFBRSxlQUFlO2dEQUNqQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU87NkNBQzNCOzRDQUNELEtBQUssRUFBRSxJQUFJO3lDQUNaO3FDQUNGO2lDQUNGOzZCQUNGOzRCQUNELFdBQVc7NEJBQ1gsMkJBQTJCOzRCQUMzQixtQkFBbUI7NEJBQ25CLEtBQUs7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLFNBQVM7Z0NBQ2YsWUFBWSxFQUFFLFFBQVE7Z0NBQ3RCLE9BQU8sRUFBRSxFQUFFO2dDQUNYLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQ0FDbEMsV0FBVyxFQUFFLEtBQUs7Z0NBQ2xCLFNBQVMsRUFBQztvQ0FDUixRQUFRLEVBQUMsQ0FBQztvQ0FDVixRQUFRLEVBQUMsWUFBWTtvQ0FDckIsTUFBTSxFQUFDLFNBQVMsQ0FBQyxpQkFBaUI7aUNBQ25DOzZCQUNGOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsU0FBUztnQ0FDZixZQUFZLEVBQUUsUUFBUTtnQ0FDdEIsT0FBTyxFQUFFLEVBQUU7Z0NBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxTQUFTLEVBQUM7b0NBQ1IsUUFBUSxFQUFDLENBQUM7b0NBQ1YsUUFBUSxFQUFDLFlBQVk7b0NBQ3JCLE1BQU0sRUFBQyxTQUFTLENBQUMsaUJBQWlCO2lDQUNuQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFLE1BQU07Z0NBQ2YsV0FBVyxFQUFFO29DQUNYLElBQUksRUFBRSxPQUFPO2lDQUNkOzZCQUNGOzRCQUNELE1BQU0sRUFBRTtnQ0FDTixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixLQUFLLEVBQUUsR0FBRztnQ0FDVixjQUFjO2dDQUNkLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDOzRCQUNwRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFFBQVEsRUFBRTt3Q0FDUixJQUFJLEVBQUUsSUFBSTt3Q0FDVixVQUFVLEVBQUUsTUFBTTtxQ0FDbkI7b0NBQ0QsT0FBTyxFQUFFLEVBQUU7b0NBQ1gsV0FBVyxFQUFFLEVBQUU7aUNBQ2hCOzZCQUNGOzRCQUNELE1BQU0sRUFBRSxVQUFVO3lCQUNuQixDQUFBO3dCQUNELElBQUksU0FBUyxFQUFFLEVBQUU7NEJBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQUU7cUJBQy9FLENBQUMsNERBQTREO3lCQUN6RCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO3dCQUNqQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTs0QkFDMUIsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDbkI7NkJBQU07NEJBQ0wsVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7eUJBQ2pFO3dCQUNELFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLFdBQVcsR0FBRzs0QkFDakIsT0FBTyxFQUFFO2dDQUNQO29DQUNFLEVBQUUsRUFBRSxVQUFVO29DQUNkLFVBQVU7b0NBQ1YsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2lDQUN6QjtnQ0FDRDtvQ0FDRSxFQUFFLEVBQUUsWUFBWTtvQ0FDaEIsYUFBYSxFQUFFLFVBQVU7b0NBQ3pCLFNBQVMsRUFBRTt3Q0FDVDs0Q0FDRSxJQUFJLEVBQUUsNkJBQTZCOzRDQUNuQyxNQUFNLEVBQUU7Z0RBQ04sZ0JBQWdCLEVBQ2QsZUFBZTtnREFDakIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPOzZDQUMzQjs0Q0FDRCxLQUFLLEVBQUUsSUFBSTt5Q0FDWjtxQ0FDRjtpQ0FDRjs2QkFDRjs0QkFDRCxXQUFXOzRCQUNYLDJCQUEyQjs0QkFDM0IsbUJBQW1COzRCQUNuQixLQUFLOzRCQUNMLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUUsTUFBTTtnQ0FDZixPQUFPLEVBQUUsSUFBSTs2QkFDZDs0QkFDRCxJQUFJLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsR0FBRyxFQUFFLEtBQUs7Z0NBQ1YsS0FBSyxFQUFFLEtBQUs7Z0NBQ1osTUFBTSxFQUFFLEtBQUs7Z0NBQ2IsWUFBWSxFQUFFLElBQUk7NkJBQ25COzRCQUNELE1BQU0sRUFBRTtnQ0FDTixRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUMzQixJQUFJLEVBQUUsUUFBUTtnQ0FDZCxJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixJQUFJLEVBQUUsTUFBTTtnQ0FDWixjQUFjO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQztvQ0FDTCxxQ0FBcUM7b0NBQ3JDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFdBQVcsRUFBRSxFQUFFO2lDQUNoQjs2QkFDRjs0QkFDRCxNQUFNLEVBQUUsVUFBVTt5QkFDbkIsQ0FBQzt3QkFDRixJQUFJLFNBQVMsRUFBRSxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUFFO3dCQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDdEQsQ0FBQyx3REFBd0Q7eUJBQ3JELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7d0JBQ25DLElBQUksV0FBVyxDQUFDO3dCQUFDLElBQUksV0FBVyxDQUFDO3dCQUNqQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTs0QkFDMUIsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDbkI7NkJBQU07NEJBQ0wsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dDQUNwRCxXQUFXLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztnQ0FDdkMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs2QkFDOUI7aUNBQU07Z0NBQ0wsV0FBVyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNsRCxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDOzZCQUM5Qzs0QkFDRCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0NBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO2dDQUN2QyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOzZCQUM5QjtpQ0FBTTtnQ0FDTCxXQUFXLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ2xELFVBQVUsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7NkJBQzlDOzRCQUNELElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0NBQ2hELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBOzZCQUNuQzt5QkFDRjt3QkFDRCxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQzt3QkFDaEYsSUFBSSxDQUFDLFdBQVcsR0FBRzs0QkFDakIsT0FBTyxFQUFFO2dDQUNQO29DQUNFLEVBQUUsRUFBRSxVQUFVO29DQUNkLFVBQVU7b0NBQ1YsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2lDQUN6QjtnQ0FDRDtvQ0FDRSxFQUFFLEVBQUUsWUFBWTtvQ0FDaEIsYUFBYSxFQUFFLFVBQVU7b0NBQ3pCLFNBQVMsRUFBRTt3Q0FDVDs0Q0FDRSxJQUFJLEVBQUUsNkJBQTZCOzRDQUNuQyxNQUFNLEVBQUU7Z0RBQ04sZ0JBQWdCLEVBQ2QsZUFBZTtnREFDakIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPOzZDQUMzQjs0Q0FDRCxLQUFLLEVBQUUsSUFBSTt5Q0FDWjtxQ0FDRjtpQ0FDRjs2QkFDRjs0QkFDRCxXQUFXOzRCQUNYLDJCQUEyQjs0QkFDM0IsbUJBQW1COzRCQUNuQixLQUFLOzRCQUNMLE9BQU8sRUFBRTtnQ0FDUCxPQUFPLEVBQUUsTUFBTTtnQ0FDZixXQUFXLEVBQUU7b0NBQ1gsSUFBSSxFQUFFLE9BQU87aUNBQ2Q7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxLQUFLO2dDQUNYLEdBQUcsRUFBRSxLQUFLO2dDQUNWLEtBQUssRUFBRSxLQUFLO2dDQUNaLE1BQU0sRUFBRSxLQUFLO2dDQUNiLFlBQVksRUFBRSxJQUFJOzZCQUNuQjs0QkFDRCxTQUFTLEVBQUU7Z0NBQ1QsSUFBSSxFQUFFLE9BQU87Z0NBQ2IsVUFBVSxFQUFFLENBQUM7NkJBQ2Q7NEJBQ0QsVUFBVSxFQUFFO2dDQUNWLEdBQUcsRUFBRSxDQUFDOzZCQUNQOzRCQUNELEtBQUssRUFBRSxFQUFFOzRCQUNULE1BQU0sRUFBRTtnQ0FDTixRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUMzQixJQUFJLEVBQUUsUUFBUTtnQ0FDZCxJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJO2dDQUMzQixJQUFJLEVBQUUsTUFBTTtnQ0FDWixjQUFjO2dDQUNkLFNBQVMsQ0FBQyxJQUFJO29DQUNaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU0sQ0FBQyxHQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3Q0FDaEMsZ0NBQWdDO3lDQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUMxRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0NBQ1QsT0FBTyxDQUFDLENBQUM7Z0NBQ1gsQ0FBQzs2QkFDRjs0QkFDRCxPQUFPLEVBQUU7Z0NBQ1AsT0FBTyxFQUFFO29DQUNQLFdBQVcsRUFBRSxFQUFFO2lDQUNoQjs2QkFDRjs0QkFDRCxNQUFNLEVBQUUsVUFBVTt5QkFDbkIsQ0FBQzt3QkFDRixJQUFJLFNBQVMsRUFBRSxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3lCQUFFO3FCQUM3RSxDQUFFLDBEQUEwRDtpQkFDOUQsQ0FBRSxrREFBa0Q7Z0JBQ3JELHNCQUFzQjthQUN2QixDQUFDLGlGQUFpRjtRQUNyRixDQUFDO0tBQUE7SUFDRCxZQUFZLENBQUMsS0FBSztRQUNoQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUNELFlBQVksQ0FBQyxLQUFLO1FBQ2hCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBQ0QsWUFBWSxDQUFDLEtBQUs7UUFDaEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxLQUFLO1FBQ3BCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO1lBQzFDLGdDQUFnQzthQUMvQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hELE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxhQUFhLENBQUMsU0FBUyxFQUFFLFNBQVUsRUFBRSxXQUFZLEVBQUUsV0FBWTtRQUM3RCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQzlCLE9BQU8sQ0FBQztvQkFDTixnQkFBZ0IsRUFBRSxPQUFPO29CQUN6QixJQUFJLEVBQUUsU0FBUyxDQUFDLGNBQWM7b0JBQzlCLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTTtvQkFDdEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE1BQU0sRUFBRTt3QkFDTixNQUFNLEVBQUUsU0FBUyxDQUFDLGNBQWM7d0JBQ2hDLEtBQUssRUFBRSxTQUFTLENBQUMsY0FBYzt3QkFDL0IsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDO3FCQUM5RDtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO3FCQUMxQjtvQkFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWM7b0JBQzFCLFFBQVEsRUFBRTt3QkFDUixLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLElBQUk7eUJBQ1g7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFBO1NBQ0g7YUFDSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3JDLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxtQkFBbUIsRUFBRTtnQkFDNUMsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNwRCxPQUFPLENBQUM7NEJBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJOzRCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjs0QkFDdkMsU0FBUzs0QkFDVCxNQUFNLEVBQUU7Z0NBQ04sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dDQUMzQixDQUFDLEVBQUUsU0FBUyxDQUFDLGNBQWM7Z0NBQzNCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQzs2QkFDOUQ7NEJBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7eUJBQ2pDLENBQUMsQ0FBQTtpQkFDSDtxQkFBTTtvQkFDTCxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDNUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO29CQUNyQixlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNuQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUc7NEJBQ2IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJOzRCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjs0QkFDdkMsU0FBUzs0QkFDVCxNQUFNLEVBQUU7Z0NBQ04sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dDQUMzQixDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztnQ0FDckIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUM7NkJBQ3hEOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVM7NkJBQzFCOzRCQUNELEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDOzRCQUNoQyxRQUFRLEVBQUU7Z0NBQ1IsS0FBSyxFQUFFLFFBQVE7Z0NBQ2YsS0FBSyxFQUFFO29DQUNMLElBQUksRUFBRSxJQUFJO2lDQUNYO2dDQUNELFNBQVMsRUFBRTtvQ0FDVCxhQUFhLEVBQUUsQ0FBQztvQ0FDaEIsV0FBVyxFQUFFLG9CQUFvQjtpQ0FDbEM7NkJBQ0Y7eUJBQ0YsQ0FBQTtvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFDSCxPQUFPLFNBQVMsQ0FBQztpQkFDbEIsQ0FBQSxxQ0FBcUM7YUFDdkM7aUJBQU07Z0JBQ0wsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNwRCxPQUFPLENBQUM7NEJBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJOzRCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjs0QkFDdkMsU0FBUzs0QkFDVCxNQUFNLEVBQUU7Z0NBQ04sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dDQUMzQixDQUFDLEVBQUUsU0FBUyxDQUFDLGNBQWM7Z0NBQzNCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQzs2QkFDOUQ7NEJBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7NEJBQ2hDLEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVM7NkJBQzFCOzRCQUNELFFBQVEsRUFBRTtnQ0FDUixLQUFLLEVBQUUsUUFBUTtnQ0FDZixLQUFLLEVBQUU7b0NBQ0wsSUFBSSxFQUFFLElBQUk7aUNBQ1g7Z0NBQ0QsU0FBUyxFQUFFO29DQUNULGFBQWEsRUFBRSxDQUFDO29DQUNoQixXQUFXLEVBQUUsb0JBQW9CO2lDQUNsQzs2QkFDRjt5QkFDRixDQUFDLENBQUE7aUJBQ0g7cUJBQU07b0JBQ0wsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVELE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztvQkFDckIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHOzRCQUNiLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTs0QkFDcEIsVUFBVSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUI7NEJBQ3ZDLFNBQVM7NEJBQ1QsTUFBTSxFQUFFO2dDQUNOLENBQUMsRUFBRSxTQUFTLENBQUMsY0FBYztnQ0FDM0IsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3JCLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDOzZCQUN4RDs0QkFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQzs0QkFDaEMsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUzs2QkFDMUI7NEJBQ0QsUUFBUSxFQUFFO2dDQUNSLEtBQUssRUFBRSxRQUFRO2dDQUNmLEtBQUssRUFBRTtvQ0FDTCxJQUFJLEVBQUUsSUFBSTtpQ0FDWDtnQ0FDRCxTQUFTLEVBQUU7b0NBQ1QsYUFBYSxFQUFFLENBQUM7b0NBQ2hCLFdBQVcsRUFBRSxvQkFBb0I7aUNBQ2xDOzZCQUNGO3lCQUNGLENBQUE7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsT0FBTyxTQUFTLENBQUM7aUJBQ2xCLENBQUEscUNBQXFDO2FBQ3ZDO1NBQ0Y7YUFDSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ25DLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQzNELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLE9BQU8sR0FBRyxDQUFDO1lBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDeEIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtxQkFDckM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDaEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLEVBQUUsR0FBRztnQkFDVCxLQUFLLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsU0FBUyxFQUFFO29CQUNULEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2lCQUNqQzthQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osT0FBTyxDQUFDO29CQUNOLElBQUksRUFBRSxTQUFTLENBQUMsUUFBUTtvQkFDeEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQyxDQUFBO1NBQ0g7YUFDSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsRUFBRTtZQUM1RyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3BELE9BQU8sQ0FBQzt3QkFDTixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7d0JBQ3BCLFNBQVM7d0JBQ1QsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE1BQU0sRUFBRTs0QkFDTixDQUFDLEVBQUUsV0FBVzs0QkFDZCxDQUFDLEVBQUUsV0FBVzt5QkFDZjt3QkFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDakMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHO3dCQUNiLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDcEIsU0FBUzt3QkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sRUFBRTs0QkFDTixDQUFDLEVBQUUsV0FBVzs0QkFDZCxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQzt5QkFDbEI7d0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7cUJBQ2pDLENBQUE7Z0JBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7Z0JBQ3ZCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7YUFDSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxxQkFBcUIsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLHNCQUFzQixDQUFDLEVBQUU7WUFDaEksSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNwRCxPQUFPLENBQUM7d0JBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO3dCQUNwQixTQUFTO3dCQUNULElBQUksRUFBRSxXQUFXO3dCQUNqQixNQUFNLEVBQUU7NEJBQ04sQ0FBQyxFQUFFLFdBQVc7NEJBQ2QsQ0FBQyxFQUFFLFdBQVc7eUJBQ2Y7d0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7cUJBQ2pDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDckIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDL0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHO3dCQUNiLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDcEIsU0FBUzt3QkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sRUFBRTs0QkFDTixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDakIsQ0FBQyxFQUFFLFdBQVc7eUJBQ2Y7d0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7cUJBQ2pDLENBQUE7Z0JBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7Z0JBQ3ZCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7YUFDSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1lBQ2xDLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEQsT0FBTyxDQUFDO3dCQUNOLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDcEIsU0FBUzt3QkFDVCxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVU7d0JBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDekIsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE1BQU0sRUFBRTs0QkFDTixDQUFDLEVBQUUsV0FBVzs0QkFDZCxDQUFDLEVBQUUsV0FBVzt5QkFDZjt3QkFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDakMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMvQixTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUc7d0JBQ2IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO3dCQUNwQixTQUFTO3dCQUNULE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVTt3QkFDNUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxJQUFJO3dCQUN6QixJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxFQUFFOzRCQUNOLENBQUMsRUFBRSxXQUFXOzRCQUNkLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO3lCQUNsQjt3QkFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDakMsQ0FBQTtnQkFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtnQkFDdkIsT0FBTyxTQUFTLENBQUM7YUFDbEI7U0FDRjthQUNJLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7WUFDakMsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQUMsSUFBSSxVQUFVLENBQUM7WUFDbkMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDbkMsU0FBUyxHQUFHLE1BQU0sQ0FBQzthQUNwQjtZQUNELElBQUksU0FBUyxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3JGLFVBQVUsR0FBRyxFQUFFLENBQUM7YUFDakI7aUJBQU0sSUFBSSxTQUFTLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtnQkFDbEYsVUFBVSxHQUFHO29CQUNYLFdBQVcsRUFBRSxNQUFNO29CQUNuQixXQUFXLEVBQUUsU0FBUyxDQUFDLGNBQWM7aUJBQ3RDLENBQUE7YUFDRjtpQkFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxFQUFFO2dCQUNsRixVQUFVLEdBQUc7b0JBQ1gsWUFBWSxFQUFFLFNBQVMsQ0FBQyxlQUFlO2lCQUN4QyxDQUFBO2FBQ0Y7aUJBQU07Z0JBQ0wsVUFBVSxHQUFHO29CQUNYLFlBQVksRUFBRSxTQUFTLENBQUMsZUFBZTtvQkFDdkMsV0FBVyxFQUFFLE1BQU07b0JBQ25CLFdBQVcsRUFBRSxTQUFTLENBQUMsY0FBYztpQkFDdEMsQ0FBQTthQUNGO1lBQ0QsT0FBTyxDQUFDO29CQUNOLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDcEIsU0FBUztvQkFDVCxNQUFNLEVBQUUsVUFBVTtvQkFDbEIsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLGlCQUFpQixFQUFFLEtBQUs7b0JBQ3hCLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsS0FBSzt3QkFDWCxRQUFRLEVBQUUsUUFBUTtxQkFDbkI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULElBQUksRUFBRSxLQUFLO3FCQUNaO29CQUNELFNBQVMsRUFBRSxVQUFVO29CQUNyQixRQUFRLEVBQUU7d0JBQ1IsU0FBUyxFQUFFOzRCQUNULFVBQVUsRUFBRSxFQUFFOzRCQUNkLGFBQWEsRUFBRSxDQUFDOzRCQUNoQixXQUFXLEVBQUUsb0JBQW9CO3lCQUNsQztxQkFDRjtvQkFDRCxJQUFJLEVBQUUsU0FBUyxDQUFDLFlBQVk7b0JBQzVCLE1BQU0sRUFBRTt3QkFDTixRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO3dCQUNuQyxLQUFLLEVBQUUsU0FBUyxDQUFDLGFBQWE7cUJBQy9CO29CQUNELEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYztpQkFDM0IsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBQ0QscUZBQXFGO0lBQ3JGLHlCQUF5QixDQUFDLFNBQVM7UUFDakMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLG1CQUFtQixFQUFFO1lBQzVDLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEQsT0FBTyxDQUFDO3dCQUNOLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDcEIsVUFBVSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUI7d0JBQ3ZDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs0QkFDdEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUN4QyxDQUFDLENBQUM7d0JBQ0YsU0FBUyxFQUFFOzRCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3lCQUNqQzt3QkFDRCxLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO3lCQUMxQjt3QkFDRCxRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFLFFBQVE7NEJBQ2YsS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSxJQUFJOzZCQUNYOzRCQUNELFNBQVMsRUFBRTtnQ0FDVCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsV0FBVyxFQUFFLG9CQUFvQjs2QkFDbEM7eUJBQ0Y7cUJBQ0YsQ0FBQyxDQUFBO2FBQ0g7aUJBQU07Z0JBQ0wsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDckIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHO3dCQUNiLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTt3QkFDcEIsVUFBVSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUI7d0JBQ3ZDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs0QkFDdEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLENBQUMsQ0FBQzt3QkFDRixLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO3lCQUMxQjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7eUJBQ2pDO3dCQUNELFFBQVEsRUFBRTs0QkFDUixLQUFLLEVBQUUsUUFBUTs0QkFDZixLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLElBQUk7NkJBQ1g7NEJBQ0QsU0FBUyxFQUFFO2dDQUNULGFBQWEsRUFBRSxDQUFDO2dDQUNoQixXQUFXLEVBQUUsb0JBQW9COzZCQUNsQzt5QkFDRjtxQkFDRixDQUFBO2dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCO2dCQUN0QixPQUFPLFNBQVMsQ0FBQzthQUNsQixDQUFBLHFDQUFxQztTQUN2QzthQUFNO1lBQ0wsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNwRCxPQUFPLENBQUM7d0JBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO3dCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjt3QkFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFOzRCQUN0RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQ3hDLENBQUMsQ0FBQzt3QkFDRixLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO3lCQUMxQjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7eUJBQ2pDO3dCQUNELFFBQVEsRUFBRTs0QkFDUixLQUFLLEVBQUUsUUFBUTs0QkFDZixLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLElBQUk7NkJBQ1g7NEJBQ0QsU0FBUyxFQUFFO2dDQUNULGFBQWEsRUFBRSxDQUFDO2dDQUNoQixXQUFXLEVBQUUsb0JBQW9COzZCQUNsQzt5QkFDRjtxQkFDRixDQUFDLENBQUE7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUc7d0JBQ2IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO3dCQUNwQixVQUFVLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjt3QkFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFOzRCQUN0RCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsQ0FBQyxDQUFDO3dCQUNGLEtBQUssRUFBRTs0QkFDTCxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVM7eUJBQzFCO3dCQUNELFNBQVMsRUFBRTs0QkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQzt5QkFDakM7d0JBQ0QsUUFBUSxFQUFFOzRCQUNSLEtBQUssRUFBRSxRQUFROzRCQUNmLEtBQUssRUFBRTtnQ0FDTCxJQUFJLEVBQUUsSUFBSTs2QkFDWDs0QkFDRCxTQUFTLEVBQUU7Z0NBQ1QsYUFBYSxFQUFFLENBQUM7Z0NBQ2hCLFdBQVcsRUFBRSxvQkFBb0I7NkJBQ2xDO3lCQUNGO3FCQUNGLENBQUE7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxTQUFTLENBQUM7YUFDbEIsQ0FBQSxxQ0FBcUM7U0FDdkM7SUFDSCxDQUFDO0lBQ0QsaUZBQWlGO0lBQ2pGLHVCQUF1QixDQUFDLFNBQVM7UUFDL0IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2hELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN6QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDO2dCQUNOLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLElBQUksRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDOUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNO2dCQUN0QixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUztpQkFDMUI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2lCQUNqQztnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxJQUFJO3FCQUNYO2lCQUNGO2FBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELHVHQUF1RztJQUN2RyxrQkFBa0IsQ0FBQyxTQUFTO1FBQzFCLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDM0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNwQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNQLElBQUksU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDOUIsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ3hCLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7cUJBQ3JDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN4QixlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUQsSUFBSSxFQUFFLEdBQUc7WUFDVCxLQUFLLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQztTQUM1QixDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzFDLE9BQU8sQ0FBQztvQkFDTixJQUFJLEVBQUUsU0FBUyxDQUFDLFFBQVE7b0JBQ3hCLElBQUksRUFBRSxPQUFPO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYztvQkFDMUIsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLE9BQU8sQ0FBQztvQkFDTixJQUFJLEVBQUUsT0FBTztvQkFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWM7b0JBQzFCLElBQUksRUFBRSxPQUFPO2lCQUNkLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUs7UUFDOUIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQzNELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDcEIsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDUCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNkLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM3QixlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCw2RUFBNkU7SUFDN0UscUJBQXFCLENBQUMsU0FBUztRQUM3QiwyREFBMkQ7UUFDM0QsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQUMsSUFBSSxVQUFVLENBQUM7UUFDbkMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUNuQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxTQUFTLENBQUMsY0FBYyxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtZQUNyRixVQUFVLEdBQUcsRUFBRSxDQUFBO1NBQ2hCO2FBQ0ksSUFBSSxTQUFTLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtZQUNoRixVQUFVLEdBQUc7Z0JBQ1gsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFdBQVcsRUFBRSxTQUFTLENBQUMsY0FBYzthQUN0QyxDQUFBO1NBQ0Y7YUFBTSxJQUFJLFNBQVMsQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxFQUFFO1lBQ2xGLFVBQVUsR0FBRztnQkFDWCxZQUFZLEVBQUUsU0FBUyxDQUFDLGVBQWU7YUFDeEMsQ0FBQTtTQUNGO2FBQU07WUFDTCxVQUFVLEdBQUc7Z0JBQ1gsWUFBWSxFQUFFLFNBQVMsQ0FBQyxlQUFlO2dCQUN2QyxXQUFXLEVBQUUsTUFBTTtnQkFDbkIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxjQUFjO2FBQ3RDLENBQUE7U0FDRjtRQUNELE9BQU8sQ0FBQztnQkFDTixJQUFJLEVBQUUsU0FBUyxDQUFDLFFBQVE7Z0JBQ3hCLElBQUksRUFBRSxLQUFLO2dCQUNYLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixRQUFRLEVBQUUsU0FBUztnQkFDbkIsaUJBQWlCLEVBQUUsS0FBSztnQkFDeEIsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO29CQUNWLFFBQVEsRUFBRSxRQUFRO2lCQUNuQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLEtBQUs7aUJBQ1o7Z0JBQ0QsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLFFBQVEsRUFBRTtvQkFDUixTQUFTLEVBQUU7d0JBQ1QsVUFBVSxFQUFFLEVBQUU7d0JBQ2QsYUFBYSxFQUFFLENBQUM7d0JBQ2hCLFdBQVcsRUFBRSxvQkFBb0I7cUJBQ2xDO2lCQUNGO2dCQUNELEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekQsdURBQXVEO29CQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLEdBQUcsQ0FBQztvQkFDUixJQUFJLFNBQVMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLGFBQWEsRUFBRTt3QkFDdkQsR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUM7cUJBQy9CO3lCQUFNO3dCQUNMLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO3FCQUNwQztvQkFDRCxPQUFPO3dCQUNMLEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxHQUFHO3FCQUNWLENBQUE7Z0JBQ0gsQ0FBQyxDQUFDO2FBQ0gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELDBEQUEwRDtJQUMxRCxvQ0FBb0M7SUFDcEMsYUFBYSxDQUFDLFNBQVM7UUFDckIsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQztvQkFDTixJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7b0JBQ3JELElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDdEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN4QyxDQUFDLENBQUM7b0JBQ0YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUNwQixNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDekIsU0FBUyxFQUFFO3dCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3FCQUNqQztpQkFDRixDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHO29CQUNiLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakUsUUFBUSxFQUFFO3dCQUNSLEtBQUssRUFBRSxRQUFRO3FCQUNoQjtvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ3RELGNBQWM7d0JBQ2QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLENBQUMsQ0FBQztvQkFDRixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7b0JBQ3BCLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVTtvQkFDNUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUN6QixTQUFTLEVBQUU7d0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7cUJBQ2pDO2lCQUNGLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtZQUN2QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxLQUFLO1FBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDNUMsT0FBTyxFQUFFLENBQUE7U0FDVjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUNELGtDQUFrQztJQUNsQyxvQkFBb0IsQ0FBQyxTQUFTO1FBQzVCLElBQUksV0FBVyxDQUFDO1FBQUMsSUFBSSxXQUFXLENBQUM7UUFBQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEQsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO1lBQ3ZDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsRCxZQUFZLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BELFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO1lBQ3ZDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLFdBQVcsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsRCxZQUFZLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUNELGtEQUFrRDtJQUNsRCxxRkFBcUY7SUFDckYsbUNBQW1DO0lBQ25DLDRCQUE0QjtJQUM1QixZQUFZLENBQUMsU0FBUyxFQUFFLGFBQWE7UUFDbkMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUIsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssYUFBYSxFQUFFO29CQUMvQixNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztpQkFDakM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsK0JBQStCO1FBQ25DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxzREFBc0Q7SUFDdEQsK0VBQStFO0lBQy9FLDJFQUEyRTtJQUMzRSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTztRQUM5QixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUN0QyxhQUFhLEVBQUUsSUFBSSxFQUNuQixVQUFVLEVBQUUsTUFBTSxFQUNuQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ0wsSUFBSTtZQUNKLE1BQU07U0FDUCxDQUFDLENBQUMsQ0FBQztRQUNKLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE9BQU8scUJBQXFCLENBQUM7SUFDL0IsQ0FBQztJQUNELDJDQUEyQztJQUMzQyxlQUFlLENBQUMsR0FBRztRQUNqQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU87Z0JBQ0w7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLENBQUM7b0JBQ2IsT0FBTyxFQUFFLENBQUM7aUJBQ1g7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLENBQUM7b0JBQ2IsT0FBTyxFQUFFLENBQUM7b0JBQ1YsSUFBSSxFQUFFLElBQUk7b0JBQ1YsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEtBQUs7aUJBQ1g7YUFDRixDQUFBO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ1g7SUFDSCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEdBQUc7UUFDVixrRUFBa0U7UUFDbEUsSUFBSSxjQUFjLEdBQUcsa0NBQWtDLENBQUM7UUFDeEQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxNQUFNLEdBQUcsMkNBQTJDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hKLENBQUM7SUFDRCxvQ0FBb0M7SUFDcEMsdUJBQXVCLENBQUMsU0FBUztRQUMvQixJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEQsT0FBTyxDQUFDO29CQUNOLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDckQsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO3dCQUN0RCxNQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNqRSxPQUFPLEdBQUcsQ0FBQztvQkFDYixDQUFDLENBQUM7b0JBQ0YsU0FBUyxFQUFFO3dCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3FCQUNqQztvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTO3FCQUMxQjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsS0FBSyxFQUFFOzRCQUNMLElBQUksRUFBRSxJQUFJO3lCQUNYO3FCQUNGO29CQUNELElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDcEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxVQUFVO29CQUM1QixTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUk7aUJBQzFCLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1RCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDckIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHO29CQUNiLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUztxQkFDMUI7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLEtBQUssRUFBRTs0QkFDTCxJQUFJLEVBQUUsSUFBSTt5QkFDWDtxQkFDRjtvQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ3RELE1BQU0sR0FBRyxHQUFHLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0QsT0FBTyxHQUFHLENBQUM7b0JBQ2IsQ0FBQyxDQUFDO29CQUNGLFNBQVMsRUFBRTt3QkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztxQkFDakM7b0JBQ0QsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUNwQixNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVU7b0JBQzVCLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSTtpQkFDMUIsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFDLENBQUEsbUJBQW1CO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUNELGtDQUFrQztJQUNsQyxnQkFBZ0I7SUFDaEIsaUNBQWlDO0lBQ2pDLDJCQUEyQjtJQUMzQixnQ0FBZ0M7SUFDaEMsT0FBTztJQUNQLEtBQUs7SUFDTCxTQUFTLENBQUMsS0FBbUI7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsTUFBTSxFQUFDLElBQUksQ0FBQyxNQUFNO1NBQ25CLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTNrRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLHNSQUFzRDt5QkFDN0Msc0NBQXNDO2FBQ2hEOzs7WUFiUSwwQkFBMEI7WUFJakMsV0FBVzs7O3dCQVdWLFNBQVMsU0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO3FCQUN0QyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBTb2Z0d2FyZSBBRywgRGFybXN0YWR0LCBHZXJtYW55IGFuZC9vciBpdHMgbGljZW5zb3JzXHJcbiAqXHJcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSAnZWNoYXJ0cyc7XHJcbmltcG9ydCB7IEVDaGFydHNPcHRpb24gfSBmcm9tICdlY2hhcnRzJztcclxuaW1wb3J0IHsgQ2hhcnRDb25maWcgfSBmcm9tICcuL21vZGVsL2NvbmZpZy5tb2RhbCc7XHJcbmltcG9ydCB7IEdwU21hcnRFY2hhcnRXaWRnZXRTZXJ2aWNlIH0gZnJvbSAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgc2ltcGxlVHJhbnNmb3JtIGZyb20gJ2VjaGFydHMtc2ltcGxlLXRyYW5zZm9ybSc7XHJcbmltcG9ydCB7XHJcbiAgRmV0Y2hDbGllbnQsXHJcbiAgUmVhbHRpbWUsXHJcbn0gZnJvbSAnQGM4eS9jbGllbnQnO1xyXG5pbXBvcnQgeyBleHRyYWN0VmFsdWVGcm9tSlNPTiB9IGZyb20gJy4vdXRpbC9leHRyYWN0VmFsdWVGcm9tSlNPTi51dGlsJztcclxuaW1wb3J0IHsgUmVzaXplZEV2ZW50IH0gZnJvbSAnYW5ndWxhci1yZXNpemUtZXZlbnQnO1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2xpYi1ncC1zbWFydC1lY2hhcnQtd2lkZ2V0JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVzOiBbJ2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcFNtYXJ0RWNoYXJ0V2lkZ2V0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAVmlld0NoaWxkKCdjaGFydEJveCcsIHsgc3RhdGljOiB0cnVlIH0pIHByb3RlY3RlZCBtYXBEaXZSZWY6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgY29uZmlnOiBDaGFydENvbmZpZztcclxuICBzZXJ2aWNlRGF0YTtcclxuICBzZXJpZXNEYXRhO1xyXG4gIGNoYXJ0RGF0YTtcclxuICB1c2VySW5wdXQ7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICBjaGFydE9wdGlvbjogRUNoYXJ0c09wdGlvbiA9IHt9O1xyXG4gIHByb3RlY3RlZCBhbGxTdWJzY3JpcHRpb25zOiBhbnkgPSBbXTtcclxuICByZWFsdGltZSA9IHRydWU7XHJcbiAgZGV2aWNlSWQgPSAnJztcclxuICBwcm90ZWN0ZWQgY2hhcnREaXY6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGlzRGF0YWh1YlBvc3RDYWxsID0gZmFsc2U7XHJcbiAgZGF0YUNoYXJ0O1xyXG4gIGNvbG9yc0ZvckNoYXJ0O1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hhcnRTZXJ2aWNlOiBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSxcclxuICAgICBwcml2YXRlIGZldGNoQ2xpZW50OiBGZXRjaENsaWVudCkgeyB9XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0RGl2ID0gdGhpcy5tYXBEaXZSZWYubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodGhpcy5jb25maWcpO1xyXG4gIH1cclxuICBkYXRhRnJvbVVzZXIodXNlcklucHV0OiBDaGFydENvbmZpZykge1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCh1c2VySW5wdXQpO1xyXG4gIH0vLyBlbmQgb2YgZGF0YUZyb21Vc2VyKClcclxuICAvLyBjcmVhdGUgdmFyaWFibGVzIGZvciBhbGwgQ2hhcnRDb25maWcgbGlrZSB2YWx1ZSB0eXBlLCBhcGlkYXRhIGZyb20gdXJsIGV0YyB0byBzdG9yZSB0aGUgZGF0YSBmcm9tIHVzZXJcclxuICAvLyBjcmVhdGUgY2hhcnRcclxuICByZWxvYWREYXRhKHVzZXJJbnB1dDogQ2hhcnRDb25maWcpIHtcclxuICAgIHRoaXMuY3JlYXRlQ2hhcnQodXNlcklucHV0KTtcclxuICB9XHJcbiAgLy8gY3JlYXRlQ2hhcnQgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgY2hhcnQgd2l0aCB0aGUgaGVscCBvZiBlY2hhcnQgbGlicmFyeVxyXG4gIGFzeW5jIGNyZWF0ZUNoYXJ0KHVzZXJJbnB1dD86IENoYXJ0Q29uZmlnKSB7XHJcbiAgICB0aGlzLmRhdGFDaGFydCA9IGVjaGFydHMuaW5pdCh0aGlzLmNoYXJ0RGl2KTtcclxuICAgIHRoaXMuZGF0YUNoYXJ0LnNob3dMb2FkaW5nKCk7XHJcbiAgICBpZiAoIXVzZXJJbnB1dC5jb2xvcnMpIHtcclxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdObyBjb2xvcnMgU3BlY2lmaWVkJyk7IH1cclxuICAgICAgdGhpcy5jb2xvcnNGb3JDaGFydCA9IFtdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2xvcnNGb3JDaGFydCA9IFsuLi51c2VySW5wdXQuY29sb3JzLnNwbGl0KCcsJyldXHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnNob3dBcGlJbnB1dCkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhID0gYXdhaXQgdGhpcy5jaGFydFNlcnZpY2UuZ2V0QVBJRGF0YSh1c2VySW5wdXQuYXBpVXJsKS50b1Byb21pc2UoKTtcclxuICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnNob3dEYXRhaHViSW5wdXQpIHtcclxuICAgICAgY29uc3Qgc3FsUmVxT2JqZWN0ID0ge1xyXG4gICAgICAgIHNxbDogdXNlcklucHV0LnNxbFF1ZXJ5LFxyXG4gICAgICAgIGxpbWl0OiB1c2VySW5wdXQuc3FsTGltaXQsXHJcbiAgICAgICAgZm9ybWF0OiAnUEFOREFTJ1xyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hDbGllbnQuZmV0Y2godXNlcklucHV0LmRhdGFodWJVcmwsIHtcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzcWxSZXFPYmplY3QpLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMuc2VydmljZURhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHRoaXMuaXNEYXRhaHViUG9zdENhbGwgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdObyBEYXRhc291cmNlIHNlbGVjdGVkJyk7IH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlcnZpY2VEYXRhKSB7XHJcbiAgICAgIHRoaXMuZGF0YUNoYXJ0LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgIGxldCBheGlzRm9udFNpemUgPSAwO1xyXG4gICAgICBpZih1c2VySW5wdXQuZm9udFNpemUgPT09IDAgfHwgdXNlcklucHV0LmZvbnRTaXplID09PSAnJyB8fCB1c2VySW5wdXQuZm9udFNpemUgPT09IG51bGwgfHwgdXNlcklucHV0LmZvbnRTaXplID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGF4aXNGb250U2l6ZSA9IDEyO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgYXhpc0ZvbnRTaXplID0gdXNlcklucHV0LmZvbnRTaXplO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VySW5wdXQuYXJlYSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGlmKHVzZXJJbnB1dC5hcmVhT3BhY2l0eSA9PSBudWxsKXtcclxuICAgICAgICAgIHVzZXJJbnB1dC5hcmVhID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJJbnB1dC5hcmVhID0ge1xyXG4gICAgICAgICAgICAnb3BhY2l0eSc6IHVzZXJJbnB1dC5hcmVhT3BhY2l0eVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICB1c2VySW5wdXQuYXJlYSA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXJJbnB1dC5hZ2dyTGlzdC5sZW5ndGggPT09IDAgJiYgIXRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAvLyBjYWxscyBmb3IgQVBJIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFBpZUNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQaWUgQ2hhcnQgRm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUGllIENoYXJ0IEZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIHBpZWNoYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRQb2xhckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICBzdGFydEFuZ2xlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGl1c0F4aXM6IHtcclxuICAgICAgICAgICAgICBtaW46IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUG9sYXIgQ2hhcnQgRm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBQb2xhciBDSGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgbGV0IHhBeGlzT2JqZWN0OyBsZXQgeUF4aXNPYmplY3Q7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgICAgICB4QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeUF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiAzMCxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB5QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFNjYXR0ZXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczogeEF4aXNPYmplY3QsXHJcbiAgICAgICAgICAgIHlBeGlzOiB5QXhpc09iamVjdCxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5ib3hab29tLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1NjYXR0ZXIgY2hhcnQgZm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pIH1cclxuICAgICAgICB9IC8vIEVuZCBvZiBTY2F0dGVyIENoYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIC8vIHRpdGxlOntcclxuICAgICAgICAgICAgLy8gICB0ZXh0OnVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGFyOiB7XHJcbiAgICAgICAgICAgICAgaW5kaWNhdG9yOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl0gfTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICByYWRpdXM6IHVzZXJJbnB1dC5yYWRhckNoYXJ0UmFkaXVzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ1JhZGFyIGNoYXJ0IGZvciBBUEknLCB0aGlzLmNoYXJ0T3B0aW9uKSB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmFkYXIgY2hhcnQgZm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pO1xyXG4gICAgICAgIH0gLy8gRW5kIG9mIFJhZGFyIENIYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICgodXNlcklucHV0LnR5cGUgPT09ICdsaW5lJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicpXHJcbiAgICAgICAgICAmJiAodXNlcklucHV0LmxheW91dCAhPT0gJ3NpbXBsZUhvcml6b250YWxCYXInICYmIHVzZXJJbnB1dC5sYXlvdXQgIT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIGxldCB4QXhpc05hbWU7IGxldCB5QXhpc05hbWU7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnlBeGlzRGltZW5zaW9uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueEF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLy8gbmFtZTogeEF4aXNOYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICAvLyBuYW1lOiB5QXhpc05hbWVcclxuICAgICAgICAgICAgICBheGlzTGFiZWw6e1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6MCxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOmF4aXNGb250U2l6ZSxcclxuICAgICAgICAgICAgICAgIHJvdGF0ZTp1c2VySW5wdXQueUF4aXNSb3RhdGVMYWJlbHNcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LmJveFpvb20sXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdTaW1wbGUgYmFyIG9yIGxpbmUgY2hhcnQgZm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBTaW1wbGUgTGluZSxTaW1wbGUgQmFyLFN0YWNrZWQgTGluZSBBbmQgU3RhY2tlZCBCYXIgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lOyBsZXQgeUF4aXNOYW1lO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2VyaWVzRGF0YSA9IHRoaXMuZ2V0SG9yaXpvbnRhbFNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgLy8gICAgIG92ZXJmbG93OiAndHJ1bmNhdGUnLFxyXG4gICAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIG9yaWVudDogJ2hvcml6b250YWwnLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICAvLyBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIC8vIG5hbWU6IHlBeGlzTmFtZSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0hvcml6b250YWwgY2hhcnQgZm9yIEFQSScsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBIb3Jpem9udGFsIEJhciAmIFN0YWNrZWQgSG9yaXpvbnRhbCBCYXJcclxuICAgICAgfSAvLyBFbmQgb2YgQVBJIGNhbGxzIHdpdGggSlNPTiBSZXNwb25zZSB3aXRob3V0IEFnZ3JlZ2F0aW9uXHJcbiAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC5hZ2dyTGlzdC5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgIC8vIGNhbGxzIGZvciBEYXRhaHViIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgICBjb25zdCByZXN1bHREaW1lbnNpb24gPSB0aGlzLmdldFJlc3VsdERpbWVzaW9ucyh1c2VySW5wdXQuYWdnckxpc3QsIHVzZXJJbnB1dC5ncm91cEJ5KTtcclxuICAgICAgICBsZXQgZGltZW5zaW9ucyA9IFtdO1xyXG4gICAgICAgIGxldCBlbmNvZGVEYXRhO1xyXG4gICAgICAgIGNvbnN0IGRhdGFzZXRJZCA9IG51bGw7XHJcbiAgICAgICAgLy8gRm9ybWF0IG9mIERhdGEgZnJvbSBkYXRhaHViIGlzXHJcbiAgICAgICAgLy8gUmVzdWx0OltcclxuICAgICAgICAvLyAgIFwiY29sdW1uc1wiOlsnY29sQScsJ2NvbEInLC4uLiwnY29sTiddLFxyXG4gICAgICAgIC8vICAgXCJkYXRhXCI6W1xyXG4gICAgICAgIC8vICAgICBbXCJBMVwiLFwiQjFcIiwuLi4sXCJOMVwiXSxcclxuICAgICAgICAvLyAgICAgW1wiQTJcIixcIkIyXCIsLi4uLFwiTjJcIl0sXHJcbiAgICAgICAgLy8gICAgIC4uLixcclxuICAgICAgICAvLyAgICAgW1wiQU5cIixcIkJOXCIsLi4uLFwiTk5cIl1cclxuICAgICAgICAvLyAgIF1cclxuICAgICAgICAvLyBdXHJcbiAgICAgICAgLy8gc291cmNlIG9mIERhdGFzZXQgc2hvdWxkIGJlIFtbY29sdW1uc10sW2RhdGFyb3dzXV1cclxuICAgICAgICB0aGlzLnNlcnZpY2VEYXRhID0gW3RoaXMuc2VydmljZURhdGEuY29sdW1ucywgLi4udGhpcy5zZXJ2aWNlRGF0YS5kYXRhXVxyXG4gICAgICAgIC8vIEVuZCBvZiBSZXNwb25zZSBEYXRhIGV4dHJhY3Rpb25cclxuICAgICAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInIHx8IHVzZXJJbnB1dC50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnM7IGxldCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGxldCB5QXhpc05hbWUgPSAnJzsgbGV0IHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnlEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgc2NhbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHsgY29uc29sZS5sb2coJ0JhciBvciBMaW5lIGNoYXJ0IGZvciBEYXRhaHViIHdpdGhvdXQgYWdncmVnYXRpb24nLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIEJhcixMaW5lIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3NjYXR0ZXInKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5nZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCB4QXhpc05hbWUgPSAnJzsgbGV0IHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDUwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC54QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdTY2F0dGVyIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFNjYXR0ZXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncGllJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZSwgdXNlcklucHV0LnBpZVNsaWNlVmFsdWVdO1xyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgIGNvbmZpbmU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsIFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUGllIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWInLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1BpZSBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUGllIGNoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCwgeERpbWVuc2lvbnMsIHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdQb2xhciBjaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViJywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICB9ICAvLyBFbmQgb2YgUG9sYXIgQ2hhcnQgV2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLnVzZXJJbnB1dC5yYWRhckRpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4T2ZYRGltZW5zaW9uID0gdGhpcy5zZXJ2aWNlRGF0YVswXS5pbmRleE9mKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICBjb25zdCBpbmRpY2F0b3JEYXRhID0gW107XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuc2VydmljZURhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaW5kaWNhdG9yRGF0YS5wdXNoKHsgbmFtZTogdGhpcy5zZXJ2aWNlRGF0YVtpXVtpbmRleE9mWERpbWVuc2lvbl0gfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICAvLyB0aXRsZTp7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDp1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJ1xyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4geyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGFyOiB7XHJcbiAgICAgICAgICAgICAgaW5kaWNhdG9yOiBpbmRpY2F0b3JEYXRhLFxyXG4gICAgICAgICAgICAgIHJhZGl1czogdXNlcklucHV0LnJhZGFyQ2hhcnRSYWRpdXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnUmFkYXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmFkYXIgQ2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YicsIHRoaXMuY2hhcnRPcHRpb24pO1xyXG4gICAgICAgIH0gLy8gRW5kIG9mIFJhZGFyIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgfSAvLyBFTmQgb2YgRGF0YWh1YiBDYWxscyBSZXNwb25zZSB3aXRob3V0IEFnZ3JlZ2F0aW9uXHJcbiAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC5hZ2dyTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIEFQSSAmIERhdGFodWIgd2l0aCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGVjaGFydHMucmVnaXN0ZXJUcmFuc2Zvcm0oc2ltcGxlVHJhbnNmb3JtLmFnZ3JlZ2F0ZSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RGltZW5zaW9uID0gdGhpcy5nZXRSZXN1bHREaW1lc2lvbnModXNlcklucHV0LmFnZ3JMaXN0LCB1c2VySW5wdXQuZ3JvdXBCeSk7XHJcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICBsZXQgZW5jb2RlRGF0YTtcclxuICAgICAgICBjb25zdCBkYXRhc2V0SWQgPSAnX2FnZ3JlZ2F0ZSc7XHJcbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgc2VydmljZSBkYXRhIGJhc2VkIG9uIHRoZSByZXNwb25zZSB0eXBlIG9mIHd0aGVyZSBjYWxsIGlzIG1hZGUgdG8gRGF0YWh1YiBvciBPdGhlciBBUElcclxuICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgLy8gRm9ybWF0IG9mIERhdGEgZnJvbSBkYXRhaHViIGlzXHJcbiAgICAgICAgICAvLyBSZXN1bHQ6W1xyXG4gICAgICAgICAgLy8gICBcImNvbHVtbnNcIjpbJ2NvbEEnLCdjb2xCJywuLi4sJ2NvbE4nXSxcclxuICAgICAgICAgIC8vICAgXCJkYXRhXCI6W1xyXG4gICAgICAgICAgLy8gICAgIFtcIkExXCIsXCJCMVwiLC4uLixcIk4xXCJdLFxyXG4gICAgICAgICAgLy8gICAgIFtcIkEyXCIsXCJCMlwiLC4uLixcIk4yXCJdLFxyXG4gICAgICAgICAgLy8gICAgIC4uLixcclxuICAgICAgICAgIC8vICAgICBbXCJBTlwiLFwiQk5cIiwuLi4sXCJOTlwiXVxyXG4gICAgICAgICAgLy8gICBdXHJcbiAgICAgICAgICAvLyBdXHJcbiAgICAgICAgICAvLyBzb3VyY2Ugb2YgRGF0YXNldCBzaG91bGQgYmUgW1tjb2x1bW5zXSxbZGF0YXJvd3NdXVxyXG4gICAgICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IFt0aGlzLnNlcnZpY2VEYXRhLmNvbHVtbnMsIC4uLnRoaXMuc2VydmljZURhdGEuZGF0YV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gRm9ybWF0IG9mIERhdGEgZnJvbSBBUGkgY2FsbHMgaXMgSlNPTiBvYmplY3Qgd2l0aCBrZXksdmFsdWVcclxuICAgICAgICAgIC8vIFJlc3VsdDogW1xyXG4gICAgICAgICAgLy8gICB7XHJcbiAgICAgICAgICAvLyAgICAgXCJrZXkxXCI6IFwidmFsMVwiLFxyXG4gICAgICAgICAgLy8gICAgIFwia2V5MlwiOiBcInZhbDJcIixcclxuICAgICAgICAgIC8vICAgfSxcclxuICAgICAgICAgIC8vICAge1xyXG4gICAgICAgICAgLy8gICAgIFwia2V5MVwiOiBcInZhbDEuMVwiLFxyXG4gICAgICAgICAgLy8gICAgIFwia2V5MlwiOiBcInZhbDIuMVwiLFxyXG4gICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAvLyBdXHJcbiAgICAgICAgICB0aGlzLnNlcnZpY2VEYXRhID0gdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdO1xyXG4gICAgICAgIH0gLy8gRW5kIG9mIFJlc3BvbnNlIERhdGEgZXh0cmFjdGlvblxyXG4gICAgICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgfHwgdXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zOyBsZXQgeERpbWVuc2lvbnM7XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lID0gJyc7IGxldCB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnlEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgICB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgICB4QXhpc05hbWUgPSB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCwgeERpbWVuc2lvbnMsIHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgc2NhbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDowLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6YXhpc0ZvbnRTaXplLFxyXG4gICAgICAgICAgICAgICAgcm90YXRlOnVzZXJJbnB1dC55QXhpc1JvdGF0ZUxhYmVsc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIC8vIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge30sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgQmFyIG9yIExpbmUgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIEJhcixMaW5lIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lID0gJyc7IGxldCB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB5QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOiByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gdGl0bGU6IHtcclxuICAgICAgICAgICAgLy8gICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgIC8vICAgbGVmdDonY2VudGVyJyxcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBib3VuZGFyeUdhcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnhBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHlBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDcwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgYXhpc0xhYmVsOntcclxuICAgICAgICAgICAgICAgIGludGVydmFsOjAsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTpheGlzRm9udFNpemUsXHJcbiAgICAgICAgICAgICAgICByb3RhdGU6dXNlcklucHV0LnlBeGlzUm90YXRlTGFiZWxzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0Rldk1vZGUoKSkgeyBjb25zb2xlLmxvZygnQWdncmVnYXRlIFNjYXR0ZXIgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFNjYXR0ZXIgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbdXNlcklucHV0LnBpZVNsaWNlbk5hbWUsIHVzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIC8vIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIC8vICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICAvLyAgIGxlZnQ6J2NlbnRlcicsXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHsgZGV0YWlsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgLy8gdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXIobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgUGllIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgUGllIGNoYXJ0JywgdGhpcy5jaGFydE9wdGlvbik7XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgUGllIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnM7IGxldCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnlEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCwgeERpbWVuc2lvbnMsIHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyB0aXRsZToge1xyXG4gICAgICAgICAgICAvLyAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZSxcclxuICAgICAgICAgICAgLy8gICBsZWZ0OidjZW50ZXInLFxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5nbGVBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICBzdGFydEFuZ2xlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJhZGl1c0F4aXM6IHtcclxuICAgICAgICAgICAgICBtaW46IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9sYXI6IHt9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzZWxlY3RlZDogeyBkZXRhaWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAvLyB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcihuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPVxyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7IGNvbnNvbGUubG9nKCdBZ2dyZWdhdGUgUG9sYXIgY2hhcnQnLCB0aGlzLmNoYXJ0T3B0aW9uKTsgfVxyXG4gICAgICAgIH0gIC8vIEVuZCBvZiBQb2xhciBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgfSAgLy8gRW5kIG9mIGNhbGxzIGZvciBBUEkgJiBEYXRhaHViIHdpdGggQWdncmVnYXRpb25cclxuICAgICAgLy8gRW5kIG9mIGNoYXJ0T3B0aW9uc1xyXG4gICAgfSAvLyBFbmQgb2YgSUYgY29uZGl0aW9uIGNoZWNraW5nIHdoZXRoZXIgdmFyaWFibGUgc2VydmljZURhdGEgaGFzIHNvbWUgZGF0YSBvciBub3RcclxuICB9XHJcbiAgZ2V0WEF4aXNUeXBlKGlucHV0KSB7XHJcbiAgICByZXR1cm4gaW5wdXQueEF4aXM7XHJcbiAgfVxyXG4gIGdldFlBeGlzVHlwZShpbnB1dCkge1xyXG4gICAgcmV0dXJuIGlucHV0LnlBeGlzO1xyXG4gIH1cclxuICBnZXRDaGFydFR5cGUoaW5wdXQpIHtcclxuICAgIHJldHVybiBpbnB1dC50eXBlO1xyXG4gIH1cclxuICBnZXRGb3JtYXR0ZWROYW1lKGlucHV0KSB7XHJcbiAgICBjb25zdCB0ZXN0ID0gaW5wdXQuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICBjb25zdCBhID0gdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgIHJldHVybiBhLnRyaW0oKTtcclxuICB9XHJcbiAgZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZD8sIHhEaW1lbnNpb25zPywgeURpbWVuc2lvbnM/KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwb2xhcicpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgY29vcmRpbmF0ZVN5c3RlbTogJ3BvbGFyJyxcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LmxheW91dCxcclxuICAgICAgICBzaG93U3ltYm9sOiB0cnVlLFxyXG4gICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgcmFkaXVzOiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICBhbmdsZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yc0ZvckNoYXJ0LFxyXG4gICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3NjYXR0ZXInKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHg6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICB0b29sdGlwOiBbdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLCB1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKDApLFxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgeEF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICAgIHhBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB4QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgIHg6IHhBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IFt4QXhpc0RpbWVuc2lvbnNbaV0sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKSxcclxuICAgICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICAgICAgfS8vIEVuZCBvZiBlbHNlIHBhcnQgb2YgWEF4aXNEaW1lbnNpb25cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgeDogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMCksXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICAgIHlBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgIHg6IHlBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IFt5QXhpc0RpbWVuc2lvbnNbaV0sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgICAgfS8vIEVuZCBvZiBlbHNlIHBhcnQgb2YgWUF4aXNEaW1lbnNpb25cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdyYWRhcicpIHtcclxuICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHVzZXJJbnB1dC5yYWRhckRpbWVuc2lvbnMuc3BsaXQoJywnKTtcclxuICAgICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgYWNjW2RpbWVuc2lvbl0gPSBbXTtcclxuICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICB9LCB7fSk7XHJcbiAgICAgIHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGltZW5zaW9uUmVjb3JkW2tleV0pIHtcclxuICAgICAgICAgICAgZGltZW5zaW9uUmVjb3JkW2tleV0ucHVzaChpdGVtW2tleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCByZXN1bHRBUlIgPSBPYmplY3QudmFsdWVzKGRpbWVuc2lvblJlY29yZClcclxuICAgICAgY29uc3QgcmVzdWx0MSA9IE9iamVjdC5rZXlzKGRpbWVuc2lvblJlY29yZCkubWFwKChrZXksIGkpID0+ICh7XHJcbiAgICAgICAgbmFtZToga2V5LFxyXG4gICAgICAgIHZhbHVlOiBkaW1lbnNpb25SZWNvcmRba2V5XSxcclxuICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KSk7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHVzZXJJbnB1dC5saXN0TmFtZSxcclxuICAgICAgICB0eXBlOiAncmFkYXInLFxyXG4gICAgICAgIGRhdGE6IHJlc3VsdDFcclxuICAgICAgfV1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUJhcicgfHwgdXNlcklucHV0LmxheW91dCA9PT0gJ3N0YWNrZWRCYXInKSkge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgIG5hbWU6IHlEaW1lbnNpb25zLFxyXG4gICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICB5OiB5RGltZW5zaW9uc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKDApXHJcbiAgICAgICAgfV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeURpbWVuc2lvbnMuYXJyYXkuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFjaywgeURpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgICBuYW1lOiB5RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgeTogeURpbWVuc2lvbnNbaV1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgbmFtZTogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB4RGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB4RGltZW5zaW9uc1tpXSksXHJcbiAgICAgICAgICAgIG5hbWU6IHhEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB4OiB4RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICB5OiB5RGltZW5zaW9uc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGJsb2NrXHJcbiAgICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIGRhdGFzZXRJZCxcclxuICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgICAgbmFtZTogeURpbWVuc2lvbnMsXHJcbiAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICB5RGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeUF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgICAgICBzbW9vdGg6IHVzZXJJbnB1dC5zbW9vdGhMaW5lLFxyXG4gICAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgICAgICBuYW1lOiB5RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgeTogeURpbWVuc2lvbnNbaV1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoaSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB5QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncGllJykge1xyXG4gICAgICBjb25zdCBjb252cmFkaXVzID0gdXNlcklucHV0LnJhZGl1cy5zcGxpdCgnLCcpO1xyXG4gICAgICBsZXQgcm9zZVZhbHVlID0gJyc7IGxldCBzbGljZVN0eWxlO1xyXG4gICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ3Jvc2VNb2RlJykge1xyXG4gICAgICAgIHJvc2VWYWx1ZSA9ICdyb3NlJztcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHt9O1xyXG4gICAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA+IDAgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPiAwKSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1c1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzLFxyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIGJvcmRlcldpZHRoOiB1c2VySW5wdXQucGllQm9yZGVyV2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgZGF0YXNldElkLFxyXG4gICAgICAgIHJhZGl1czogY29udnJhZGl1cyxcclxuICAgICAgICByb3NlVHlwZTogcm9zZVZhbHVlLFxyXG4gICAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpdGVtU3R5bGU6IHNsaWNlU3R5bGUsXHJcbiAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQucGllU2xpY2VOYW1lLFxyXG4gICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgaXRlbU5hbWU6IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZV0sXHJcbiAgICAgICAgICB2YWx1ZTogdXNlcklucHV0LnBpZVNsaWNlVmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yc0ZvckNoYXJ0XHJcbiAgICAgIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBnZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIHNlcmllcyBkYXRhIGZvciBzY2F0dGVyIGNoYXJ0XHJcbiAgZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgIHhBeGlzRGltZW5zaW9ucy5mb3JFYWNoKCh2YWx1ZSwgaSkgPT4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1beEF4aXNEaW1lbnNpb25zW2ldXTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAvLyBlbmQgb2YgZm9yIGxvb3BcclxuICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBYQXhpc0RpbWVuc2lvblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBmb2N1czogJ3NlcmllcycsXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgIHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjUpJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgY29uc3QgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgeUF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgfS8vIEVuZCBvZiBlbHNlIHBhcnQgb2YgWUF4aXNEaW1lbnNpb25cclxuICAgIH1cclxuICB9XHJcbiAgLy8gZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgc2VyaWVzIGRhdGEgZm9yIHBvbGFyIGNoYXJ0XHJcbiAgZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgY3VycmVudFJlc3VsdCA9IFtdO1xyXG4gICAgICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dKTtcclxuICAgICAgY3VycmVudFJlc3VsdC5wdXNoKGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXSk7XHJcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRSZXN1bHQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gW3tcclxuICAgICAgY29vcmRpbmF0ZVN5c3RlbTogJ3BvbGFyJyxcclxuICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICB0eXBlOiB1c2VySW5wdXQubGF5b3V0LFxyXG4gICAgICBzaG93U3ltYm9sOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXN1bHQsXHJcbiAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICB9LFxyXG4gICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcigwKVxyXG4gICAgICB9LFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH1dXHJcbiAgfVxyXG4gIC8vIGdldFJhZGFyU2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGdldCB0aGUgZGF0YSBmcm9tIHNlcnZpY2UgYW5kIHN0b3JlIGl0IGluIHNlcmllc0RhdGEgdmFyaWFibGVcclxuICBnZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gdXNlcklucHV0LnJhZGFyRGltZW5zaW9ucy5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbiAgICBpZiAodXNlcklucHV0Lmxpc3ROYW1lIGluIHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25SZWNvcmRba2V5XSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25SZWNvcmRba2V5XS5wdXNoKGl0ZW1ba2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gdjtcclxuICAgICAgICByZXR1cm4geyBrZXk6IHZhbCwgdmFsdWU6IHRoaXMuc2VydmljZURhdGFbMF0uaW5kZXhPZih2KSB9O1xyXG4gICAgICB9KTtcclxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnNlcnZpY2VEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaW5kZXhlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgZGltZW5zaW9uUmVjb3JkW2VsZW1lbnQua2V5XS5wdXNoKHRoaXMuc2VydmljZURhdGFbaV1bZWxlbWVudC52YWx1ZV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXN1bHQxID0gT2JqZWN0LmtleXMoZGltZW5zaW9uUmVjb3JkKS5tYXAoKGtleSwgaSkgPT4gKHtcclxuICAgICAgbmFtZToga2V5LFxyXG4gICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV0sXHJcbiAgICB9KSk7XHJcbiAgICBpZiAodXNlcklucHV0Lmxpc3ROYW1lIGluIHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0Lmxpc3ROYW1lLFxyXG4gICAgICAgIHR5cGU6ICdyYWRhcicsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzRm9yQ2hhcnQsXHJcbiAgICAgICAgZGF0YTogcmVzdWx0MVxyXG4gICAgICB9XVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgfVxyXG4gIGNyZWF0ZU9iamVjdChkYXRhRGltLCBhcnIsIGRpbWVuKSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gZGltZW4uc3BsaXQoJywnKTtcclxuICAgIGNvbnN0IGRpbWVuc2lvblJlY29yZCA9IGRpbWVuc2lvbnMucmVkdWNlKChhY2MsIGRpbWVuc2lvbikgPT4ge1xyXG4gICAgICBhY2NbZGltZW5zaW9uXSA9IFtdO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwge30pO1xyXG4gICAgY29uc3QgaW5kZXhlcyA9IGRpbWVuc2lvbnMubWFwKCh2LCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCB2YWwgPSB2O1xyXG4gICAgICByZXR1cm4geyBrZXk6IHZhbCwgdmFsdWU6IGRhdGFEaW0uaW5kZXhPZih2KSB9O1xyXG4gICAgfSk7XHJcbiAgICBhcnIubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICBpbmRleGVzLmtleXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBkaW1lbnNpb25SZWNvcmRbZWxlbWVudC5rZXldLnB1c2goaXRlbVtlbGVtZW50LnZhbHVlXSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vIGdldFBpZUNoYXJ0U2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSBzZXJpZXMgZGF0YSBmb3IgcGllIGNoYXJ0XHJcbiAgZ2V0UGllQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCkge1xyXG4gICAgLy8gY29udmVydCBjb21tYSBzZXBhcmF0ZWQgc3RyaW5nIHVzZXJJbnB1dC5yYWRpdXMgdG8gYXJyYXlcclxuICAgIGNvbnN0IGNvbnZyYWRpdXMgPSB1c2VySW5wdXQucmFkaXVzLnNwbGl0KCcsJyk7XHJcbiAgICBsZXQgcm9zZVZhbHVlID0gJyc7IGxldCBzbGljZVN0eWxlO1xyXG4gICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdyb3NlTW9kZScpIHtcclxuICAgICAgcm9zZVZhbHVlID0gJ3Jvc2UnO1xyXG4gICAgfVxyXG4gICAgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzbGljZVN0eWxlID0ge31cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA+IDAgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodXNlcklucHV0LnBpZUJvcmRlcldpZHRoID09PSB1bmRlZmluZWQgJiYgdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyA+IDApIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXNcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMsXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbe1xyXG4gICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICByYWRpdXM6IGNvbnZyYWRpdXMsXHJcbiAgICAgIHJvc2VUeXBlOiByb3NlVmFsdWUsXHJcbiAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgbGFiZWw6IHtcclxuICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcclxuICAgICAgfSxcclxuICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXRlbVN0eWxlOiBzbGljZVN0eWxlLFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgc2hhZG93Qmx1cjogMTAsXHJcbiAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjb2xvcjogdGhpcy5jb2xvcnNGb3JDaGFydCxcclxuICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIC8vIHRha2UgdmFsIGZyb20gdXNlcmlucHV0LnBpZXNsaWNlIHZhbHVlIGFuZCByZXR1cm4gaXRcclxuICAgICAgICBjb25zdCB2YWwgPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuICAgICAgICBsZXQgbmFtO1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQucGllU2xpY2VWYWx1ZSA9PT0gdXNlcklucHV0LnBpZVNsaWNlbk5hbWUpIHtcclxuICAgICAgICAgIG5hbSA9IHVzZXJJbnB1dC5waWVTbGljZW5OYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuYW0gPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgIG5hbWU6IG5hbSxcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgfV1cclxuICB9XHJcbiAgLy8gZ2V0c2VyaWVzZGF0YSByZWNpZXZlcyB1c2VyaW5wdXQgYW5kIHJldHVybnMgc2VyaWVzZGF0YVxyXG4gIC8vIHNlcmllc2RhdGEgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0c1xyXG4gIGdldFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9XHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGNvbnN0IHlBeGlzRGF0YSA9IFtdO1xyXG4gICAgICB5QXhpc0RpbWVuc2lvbnMuZm9yRWFjaCgodmFsdWUsIGkpID0+IHtcclxuICAgICAgICBsZXQgYWIgPSB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2tMaXN0LCB5QXhpc0RpbWVuc2lvbnNbaV0pO1xyXG4gICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgIG5hbWU6IHlBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2tMaXN0LCB5QXhpc0RpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhLFxyXG4gICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldENoYXJ0SXRlbUNvbG9yKGkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTsgLy8gZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuICBnZXRDaGFydEl0ZW1Db2xvcihpbmRleCkge1xyXG4gICAgaWYgKHRoaXMuY29sb3JzRm9yQ2hhcnRbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb2xvcnNGb3JDaGFydFtpbmRleF07XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEdldHMgdGhlIGRpbWVuc2lvbnMgZm9yIGRhdGFzZXRcclxuICBnZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpIHtcclxuICAgIGxldCB5RGltZW5zaW9uczsgbGV0IHhEaW1lbnNpb25zOyBsZXQgZGltZW5zaW9uQXJyID0gW107XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh5RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi55RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICBkaW1lbnNpb25BcnIucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBkaW1lbnNpb25BcnIgPSBbLi4uZGltZW5zaW9uQXJyLCAuLi54RGltZW5zaW9uc107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGltZW5zaW9uQXJyO1xyXG4gIH1cclxuICAvLyBpZiBzdGFja2RhdGEgaXMgZW1wdHkgdGhlbiByZXR1cm4gZGltZW5zaW9uTmFtZVxyXG4gIC8vIGVsc2UgaWYgc3RhY2tkYXRhIGlzIG5vdCBlbXB0eSB0aGVuIGNoZWNrIGlmIGRpbWVuc2lvbk5hbWUgaXMgcHJlc2VudCBpbiBzdGFja2RhdGFcclxuICAvLyBpZiBwcmVzZW50IHRoZW4gcmV0dXJuIHN0YWNrbmFtZVxyXG4gIC8vIGVsc2UgcmV0dXJuIGRpbWVuc2lvbk5hbWVcclxuICBnZXRTdGFja05hbWUoc3RhY2tEYXRhLCBkaW1lbnNpb25OYW1lKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICBzdGFja0RhdGEuZm9yRWFjaCgodmFsdWUsIHgpID0+IHtcclxuICAgICAgY29uc3QgdmFsdWVzID0gc3RhY2tEYXRhW3hdLnN0YWNrVmFsdWVzLnNwbGl0KCcsJyk7XHJcbiAgICAgIHZhbHVlcy5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbHVlc1tpXSA9PT0gZGltZW5zaW9uTmFtZSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gc3RhY2tEYXRhW3hdLnN0YWNrTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBmb3IgbG9vcCBvZiBzdGFja2RhdGFcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIC8vIEdldCB0aGUgZGltZW5zaW9ucyBhbmQgbWV0aG9kIGFycmF5IGZvciBhZ2dyZWdhdGlvblxyXG4gIC8vIExpc3QgY29tZXMgZnJvbSBhZ2dyZWdhdGUgY29uZmlnIGFuZCBjb25hdGlucyBib3RoIG1ldGhvZCBhbmQgZGltZW5zaW9uIG5hbWVcclxuICAvLyBXZSBhbHNvIG5lZWQgZ3JvdXAgYnkgdG8gYmUgaW5jbHVkZWQgYXMgYSBkaW1lbnNpb24gYnV0IHdpdGhvdXQgYSBtZXRob2RcclxuICBnZXRSZXN1bHREaW1lc2lvbnMobGlzdCwgZ3JvdXBieSkge1xyXG4gICAgY29uc3QgY2hhbmdlZE5hbWVzRm9yUmVzdWx0ID0gbGlzdC5tYXAoKHtcclxuICAgICAgYWdnckRpbWVzbmlvbjogZnJvbSxcclxuICAgICAgYWdnck1ldGhvZDogbWV0aG9kXHJcbiAgICB9KSA9PiAoe1xyXG4gICAgICBmcm9tLFxyXG4gICAgICBtZXRob2RcclxuICAgIH0pKTtcclxuICAgIGNoYW5nZWROYW1lc0ZvclJlc3VsdC5wdXNoKHsgZnJvbTogZ3JvdXBieSB9KTtcclxuICAgIHJldHVybiBjaGFuZ2VkTmFtZXNGb3JSZXN1bHQ7XHJcbiAgfVxyXG4gIC8vIE1ldGhvZCBmb3Igc2hvd2luZyB0aGUgU2xpZGVyL1BpbmNoIFpvb21cclxuICBzaG93Wm9vbUZlYXR1cmUodmFsKSB7XHJcbiAgICBpZiAodmFsKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ2luc2lkZScsXHJcbiAgICAgICAgICB4QXhpc0luZGV4OiAwLFxyXG4gICAgICAgICAgbWluU3BhbjogNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogJ3NsaWRlcicsXHJcbiAgICAgICAgICB4QXhpc0luZGV4OiAwLFxyXG4gICAgICAgICAgbWluU3BhbjogNSxcclxuICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICBoZWlnaHQ6IDIwLFxyXG4gICAgICAgICAgdG9wOiAnOTAlJyxcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcbiAgaGV4VG9SZ2IoaGV4KSB7XHJcbiAgICAvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXHJcbiAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xyXG4gICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcclxuICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcclxuICAgIH0pO1xyXG4gICAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xyXG4gICAgcmV0dXJuIHJlc3VsdCA/IFwicmdiYShcIiArIHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpICsgXCIsIFwiICsgcGFyc2VJbnQocmVzdWx0WzJdLCAxNikgKyBcIiwgXCIgKyBwYXJzZUludChyZXN1bHRbM10sIDE2KSArIFwiLCBcIiArIDAuOCArIFwiKVwiIDogbnVsbDtcclxuICB9XHJcbiAgLy8gR2V0IGRhdGEgZm9yIGhvcml6b250YWwgQmFyIGNoYXJ0XHJcbiAgZ2V0SG9yaXpvbnRhbFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgaXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuZ2V0Q2hhcnRJdGVtQ29sb3IoMClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYVxyXG4gICAgICB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBjb25zdCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgeEF4aXNEaW1lbnNpb25zLmZvckVhY2goKHZhbHVlLCBpKSA9PiB7XHJcbiAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgbmFtZTogeEF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFjaywgeEF4aXNEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHhBeGlzRGltZW5zaW9uc1tpXSwgaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDaGFydEl0ZW1Db2xvcihpKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWFcclxuICAgICAgICB9XHJcbiAgICAgIH0pOy8vIGVuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxyXG4gIC8vICBvblJlc2l6ZSgpIHtcclxuICAvLyAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGFDaGFydClcclxuICAvLyAgICBpZiAodGhpcy5kYXRhQ2hhcnQpIHtcclxuICAvLyAgICAgIHRoaXMuZGF0YUNoYXJ0LnJlc2l6ZSgpO1xyXG4gIC8vICAgIH1cclxuICAvLyAgfVxyXG4gIG9uUmVzaXplZChldmVudDogUmVzaXplZEV2ZW50KSB7XHJcbiAgICB0aGlzLndpZHRoID0gZXZlbnQubmV3V2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGV2ZW50Lm5ld0hlaWdodDtcclxuICAgIHRoaXMuZGF0YUNoYXJ0LnJlc2l6ZSh7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6dGhpcy5oZWlnaHRcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==