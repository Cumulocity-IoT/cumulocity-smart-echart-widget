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
import { Component, Input } from '@angular/core';
import * as echarts from 'echarts';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxLQUFLLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFHbkMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFOUUsT0FBTyxLQUFLLGVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU14RSxNQUFNLE9BQU8sNEJBQTRCO0lBa0N2QyxZQUFvQixZQUF3QyxFQUNsRCxlQUF5QixFQUFVLFdBQXdCO1FBRGpELGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUNsRCxvQkFBZSxHQUFmLGVBQWUsQ0FBVTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBTnJFLGdCQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUN0QixxQkFBZ0IsR0FBUSxFQUFFLENBQUM7UUFDckMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2Qsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO0lBRStDLENBQUM7SUFDMUUsUUFBUTtRQUNOLGlDQUFpQztRQUNqQyxzQkFBc0I7SUFDeEIsQ0FBQztJQUNELFlBQVksQ0FBQyxTQUFzQjtRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlC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QUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLElBQUk7eUJBQ1g7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUk7d0JBQzNELG1DQUFtQzt3QkFDbkMsTUFBTSxHQUFHLEdBQUcsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUMzRCxPQUFPLEdBQUcsQ0FBQztvQkFDYixDQUFDLENBQUM7b0JBQ0YsZUFBZTtvQkFDZixZQUFZO29CQUNaLG9DQUFvQztvQkFDcEMsbUNBQW1DO29CQUNuQyxNQUFNO29CQUNOLEtBQUs7b0JBQ0wsY0FBYztvQkFDZCw2Q0FBNkM7b0JBQzdDLElBQUk7b0JBQ0osSUFBSTtvQkFDSixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7b0JBQ3BCLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVTtvQkFDNUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxJQUFJO2lCQUMxQixDQUFBO2FBQ0YsQ0FBQyxrQkFBa0I7WUFDcEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7SUFDSCxDQUFDOzs7WUF6a0VGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QywyZUFBc0Q7eUJBQzdDLHNDQUFzQzthQUNoRDs7O1lBWlEsMEJBQTBCO1lBS2pDLFFBQVE7WUFEUixXQUFXOzs7cUJBVVYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSAnZWNoYXJ0cyc7XHJcbmltcG9ydCB7IEVDaGFydHNPcHRpb24gfSBmcm9tICdlY2hhcnRzJztcclxuaW1wb3J0IHsgQ2hhcnRDb25maWcgfSBmcm9tICcuL21vZGVsL2NvbmZpZy5tb2RhbCc7XHJcbmltcG9ydCB7IEdwU21hcnRFY2hhcnRXaWRnZXRTZXJ2aWNlIH0gZnJvbSAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCAqIGFzIHNpbXBsZVRyYW5zZm9ybSBmcm9tICdlY2hhcnRzLXNpbXBsZS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQge1xyXG4gIEZldGNoQ2xpZW50LFxyXG4gIFJlYWx0aW1lLFxyXG59IGZyb20gJ0BjOHkvY2xpZW50JztcclxuaW1wb3J0IHsgZXh0cmFjdFZhbHVlRnJvbUpTT04gfSBmcm9tICcuL3V0aWwvZXh0cmFjdFZhbHVlRnJvbUpTT04udXRpbCc7XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLWdwLXNtYXJ0LWVjaGFydC13aWRnZXQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZXM6IFsnZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEdwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogQ2hhcnRDb25maWc7XHJcbiAgLy8gQElucHV0KCkgY29uZmlnOiBDaGFydENvbmZpZyA9IHtcclxuICAvLyAgIHhBeGlzRGltZW5zaW9uOiBcIlBob25lU2FsZXNcIixcclxuICAvLyAgIGFwaVVybDogXCJodHRwczovL2RlbW9jZW50ZXIuZ2F0ZXdheS53ZWJtZXRob2RzY2xvdWQuY29tL2dhdGV3YXkvQ29ubmVjdGVkU3RvcmVBUElzLzEuMC9Db25uZWN0ZWRTdG9yZUFQSXMvZ2V0UXVhcnRlcmx5U2FsZXNcIixcclxuICAvLyAgIGxlZ2VuZDoge1xyXG4gIC8vICAgICBcImljb25cIjogXCJkaWFtb25kXCIsXHJcbiAgLy8gICAgIFwidG9wXCI6IFwiMTAlXCIsXHJcbiAgLy8gICAgIFwidHlwZVwiOiBcInNjcm9sbFwiXHJcbiAgLy8gICB9LFxyXG4gIC8vICAgbGlzdE5hbWU6IFwiU2FsZXNEYXRhXCIsXHJcbiAgLy8gICB0aXRsZTogXCJURVNUXCIsXHJcbiAgLy8gICBkYXRhU291cmNlOiBcIkFQSVwiLFxyXG4gIC8vICAgdHlwZTogXCJiYXJcIixcclxuICAvLyAgIGxheW91dDogXCJzaW1wbGVCYXJcIixcclxuICAvLyAgIHhBeGlzOiBcImNhdGVnb3J5XCIsXHJcbiAgLy8gICB5QXhpczogXCJ2YWx1ZVwiLFxyXG4gIC8vICAgeUF4aXNEaW1lbnNpb246IFwiUXVhcnRlclNhbGVzXCIsXHJcbiAgLy8gICByYWRpdXM6IFtdLFxyXG4gIC8vICAgc3RhY2tMaXN0OiBbXSxcclxuICAvLyAgIGFnZ3JMaXN0OiBbXSxcclxuICAvLyAgIHN0YWNrOiAnJyxcclxuICAvLyAgIGFnZ3JBcnI6IFtdLFxyXG4gIC8vICAgYWRkU3RhY2s6IGZhbHNlXHJcbiAgLy8gfTtcclxuICBzZXJ2aWNlRGF0YTtcclxuICBzZXJpZXNEYXRhO1xyXG4gIGNoYXJ0RGF0YTtcclxuICB1c2VySW5wdXQ7XHJcbiAgY2hhcnRPcHRpb246IEVDaGFydHNPcHRpb24gPSB7fTtcclxuICBwcm90ZWN0ZWQgYWxsU3Vic2NyaXB0aW9uczogYW55ID0gW107XHJcbiAgcmVhbHRpbWUgPSB0cnVlO1xyXG4gIGRldmljZUlkID0gJyc7XHJcbiAgaXNEYXRhaHViUG9zdENhbGwgPSBmYWxzZTtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoYXJ0U2VydmljZTogR3BTbWFydEVjaGFydFdpZGdldFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHJlYWxUaW1lU2VydmljZTogUmVhbHRpbWUsIHByaXZhdGUgZmV0Y2hDbGllbnQ6IEZldGNoQ2xpZW50KSB7IH1cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIC8vIHRoaXMuY3JlYXRlQ2hhcnQodGhpcy5jb25maWcpO1xyXG4gICAgLy8gdGhpcy5jcmVhdGVDaGFydCgpO1xyXG4gIH1cclxuICBkYXRhRnJvbVVzZXIodXNlcklucHV0OiBDaGFydENvbmZpZykge1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCh1c2VySW5wdXQpO1xyXG4gIH0vLyBlbmQgb2YgZGF0YUZyb21Vc2VyKClcclxuICAvL2NyZWF0ZSB2YXJpYWJsZXMgZm9yIGFsbCBDaGFydENvbmZpZyBsaWtlIHZhbHVlIHR5cGUsIGFwaWRhdGEgZnJvbSB1cmwgZXRjIHRvIHN0b3JlIHRoZSBkYXRhIGZyb20gdXNlclxyXG4gIC8vIGNyZWF0ZSBjaGFydFxyXG4gIHJlbG9hZERhdGEodXNlcklucHV0OiBDaGFydENvbmZpZykge1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCh1c2VySW5wdXQpO1xyXG4gIH1cclxuICAvL2NyZWF0ZUNoYXJ0IGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIGNoYXJ0IHdpdGggdGhlIGhlbHAgb2YgZWNoYXJ0IGxpYnJhcnlcclxuICBhc3luYyBjcmVhdGVDaGFydCh1c2VySW5wdXQ/OiBDaGFydENvbmZpZykge1xyXG4gICAgbGV0IGNoYXJ0RG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJ0LWNvbnRhaW5lcicpO1xyXG4gICAgbGV0IG15Q2hhcnQgPSBlY2hhcnRzLmluaXQoY2hhcnREb20pO1xyXG4gICAgbXlDaGFydC5zaG93TG9hZGluZygpO1xyXG4gICAgLy8gbGV0IGQgPSB0aGlzLnJlYWx0VGltZU1lYXN1cmVtZW50cyg2ODg5MDMxKTtcclxuICAgIC8vIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5mZXRjaENsaWVudC5mZXRjaCgnc2VydmljZS9kYXRhaHViL2RyZW1pby9hcGkvdjMvam9iLzFlMTgyNmU1LTBlN2QtZjM4Yy02MWI3LWNlMDU5YzcxNTcwMC9yZXN1bHRzJyk7XHJcbiAgICBpZiAodXNlcklucHV0LnNob3dBcGlJbnB1dCkge1xyXG4gICAgICBcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IGF3YWl0IHRoaXMuY2hhcnRTZXJ2aWNlLmdldEFQSURhdGEodXNlcklucHV0LmFwaVVybCkudG9Qcm9taXNlKCk7XHJcbiAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5zaG93RGF0YWh1YklucHV0KSB7XHJcblxyXG4gICAgICBjb25zdCBzcWxSZXFPYmplY3QgPSB7XHJcbiAgICAgICAgXCJzcWxcIjogdXNlcklucHV0LnNxbFF1ZXJ5LFxyXG4gICAgICAgIFwibGltaXRcIjogMTAwLFxyXG4gICAgICAgIFwiZm9ybWF0XCI6IFwiUEFOREFTXCJcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZldGNoQ2xpZW50LmZldGNoKHVzZXJJbnB1dC5hcGlVcmwsIHtcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzcWxSZXFPYmplY3QpLFxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMuc2VydmljZURhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHRoaXMuaXNEYXRhaHViUG9zdENhbGwgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ05vIERhdGFzb3VyY2Ugc2VsZWN0ZWQnKVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2VydmljZURhdGEpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2RhdGEgZnJvbSBBUEknLCB0aGlzLnNlcnZpY2VEYXRhKTtcclxuICAgICAgY29uc29sZS5sb2coJ2RhdGFodWIgcG9zdCcsIHRoaXMuaXNEYXRhaHViUG9zdENhbGwpXHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gdGhpcy5jaGFydFNlcnZpY2UuZ2V0QVBJRGF0YSh1c2VySW5wdXQuYXBpVXJsKS5zdWJzY3JpYmUoKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIG15Q2hhcnQuaGlkZUxvYWRpbmcoKTtcclxuICAgICAgLy8gdGhpcy5zZXJ2aWNlRGF0YSA9IHJlc3BvbnNlO1xyXG4gICAgICAvLyB0aGlzLnNlcnZpY2VEYXRhID0gZGF0YTtcclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJJbnB1dCcsIHVzZXJJbnB1dCk7XHJcbiAgICAgIGlmICh1c2VySW5wdXQuYWdnckxpc3QubGVuZ3RoID09PSAwICYmICF0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgLy9jYWxscyBmb3IgQVBJIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFBpZUNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiB1c2VySW5wdXQudGl0bGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3BpZSB3aXRob3V0IGFnZ3InLCB0aGlzLmNoYXJ0T3B0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgcGllY2hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFBvbGFyQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvbGFyOiB7fSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJOT1JNQUwgUE9MQVIgQ0hhcnQgT3B0aW9uIFwiLCB0aGlzLmNoYXJ0T3B0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmQgb2YgUG9sYXIgQ0hhcnQgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGxldCB4QXhpc09iamVjdCwgeUF4aXNPYmplY3Q7XHJcbiAgICAgICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgICAgICB4QXhpc09iamVjdCA9IHtcclxuICAgICAgICAgICAgICBuYW1lOiB0aGlzLmdldEZvcm1hdHRlZE5hbWUodXNlcklucHV0LnhBeGlzRGltZW5zaW9uKSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeUF4aXNPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbiksXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WUF4aXNUeXBlKHVzZXJJbnB1dClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHlBeGlzT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiB1c2VySW5wdXQudGl0bGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzIwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzE1JScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB4QXhpc09iamVjdCxcclxuICAgICAgICAgICAgeUF4aXM6IHlBeGlzT2JqZWN0LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LmJveFpvb20sXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6e1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOmZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9XHJcbiAgICAgICAgICAgICAgICAgIC8vIG5hbWUuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdzY2F0dGVyIG9wdGlvbicsIHRoaXMuY2hhcnRPcHRpb24pXHJcbiAgICAgICAgfSAvL0VuZCBvZiBTY2F0dGVyIENoYXJ0IGZvciBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOmZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9XHJcbiAgICAgICAgICAgICAgICAgIC8vIG5hbWUuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkYXI6IHtcclxuICAgICAgICAgICAgICBpbmRpY2F0b3I6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXSB9O1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IHRoaXMuc2VyaWVzRGF0YSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGFydE9wdGlvbilcclxuICAgICAgICB9IC8vIEVuZCBvZiBSYWRhciBDSGFydCBmb3IgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAoKHVzZXJJbnB1dC50eXBlID09PSAnbGluZScgfHwgdXNlcklucHV0LnR5cGUgPT09ICdiYXInKSAmJiAodXNlcklucHV0LmxheW91dCAhPSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgJiYgdXNlcklucHV0LmxheW91dCAhPSAnc3RhY2tlZEhvcml6b250YWxCYXInKSkge1xyXG4gICAgICAgICAgdGhpcy5zZXJpZXNEYXRhID0gdGhpcy5nZXRTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lLHlBeGlzTmFtZTtcclxuICAgICAgICAgIGlmKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aD4xKXtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aD4xKXtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gJydcclxuICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogdXNlcklucHV0LnRpdGxlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgICAgbmFtZTp4QXhpc05hbWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIG5hbWU6eUF4aXNOYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogdGhpcy5zZXJpZXNEYXRhLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LmJveFpvb20sXHJcbiAgICAgICAgICAgICAgICAgIHlBeGlzSW5kZXg6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJlc3RvcmU6IHt9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1NpbXBsZSBiYXIgb3IgbGluZScsIHRoaXMuY2hhcnRPcHRpb24pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZCBvZiBTaW1wbGUgTGluZSxTaW1wbGUgQmFyLFN0YWNrZWQgTGluZSBBbmQgU3RhY2tlZCBCYXIgZm9yIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaG9yaXpvbnRhbCBjaGFydCBjaG9zZW4hIScsIHVzZXJJbnB1dC5hZ2dyTGlzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZSx5QXhpc05hbWU7XHJcbiAgICAgICAgICBpZih1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGg+MSl7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZih1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGg+MSl7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnXHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9IHRoaXMuZ2V0Rm9ybWF0dGVkTmFtZSh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldEhvcml6b250YWxTZXJpZXNEYXRhKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID1cclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiB1c2VySW5wdXQudGl0bGUsXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ3RydW5jYXRlJyxcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBvcmllbnQ6ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgLy8gdXNlcklucHV0LmxlZ2VuZC5vcmllbnQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIC8vIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgLy8gbmFtZUdhcDogNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgLy8gbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICAvLyBuYW1lR2FwOiAxNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBleHRyYWN0VmFsdWVGcm9tSlNPTih1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaG9yaXpvbnRhbCBjaGFydCBvcHRpb25zJywgdGhpcy5jaGFydE9wdGlvbilcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kIG9mIEhvcml6b250YWwgQmFyICYgU3RhY2tlZCBIb3Jpem9udGFsIEJhclxyXG4gICAgICB9IC8vIEVuZCBvZiBBUEkgY2FsbHMgd2l0aCBKU09OIFJlc3BvbnNlIHdpdGhvdXQgQWdncmVnYXRpb25cclxuICAgICAgZWxzZSBpZiAodXNlcklucHV0LmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIERhdGFodWIgd2l0aG91dCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdERpbWVuc2lvbiA9IHRoaXMuZ2V0UmVzdWx0RGltZXNpb25zKHVzZXJJbnB1dC5hZ2dyTGlzdCwgdXNlcklucHV0Lmdyb3VwQnkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHREZWltZW5pb25zJywgcmVzdWx0RGltZW5zaW9uKVxyXG4gICAgICAgIGxldCBkaW1lbnNpb25zID0gW107XHJcbiAgICAgICAgbGV0IGVuY29kZURhdGE7XHJcbiAgICAgICAgY29uc3QgZGF0YXNldElkID0gbnVsbDtcclxuICAgICAgICAvLyBGb3JtYXQgb2YgRGF0YSBmcm9tIGRhdGFodWIgaXMgXHJcbiAgICAgICAgLy8gUmVzdWx0OltcclxuICAgICAgICAvLyAgIFwiY29sdW1uc1wiOlsnY29sQScsJ2NvbEInLC4uLiwnY29sTiddLFxyXG4gICAgICAgIC8vICAgXCJkYXRhXCI6W1xyXG4gICAgICAgIC8vICAgICBbXCJBMVwiLFwiQjFcIiwuLi4sXCJOMVwiXSxcclxuICAgICAgICAvLyAgICAgW1wiQTJcIixcIkIyXCIsLi4uLFwiTjJcIl0sXHJcbiAgICAgICAgLy8gICAgIC4uLixcclxuICAgICAgICAvLyAgICAgW1wiQU5cIixcIkJOXCIsLi4uLFwiTk5cIl1cclxuICAgICAgICAvLyAgIF1cclxuICAgICAgICAvLyBdXHJcbiAgICAgICAgLy8gc291cmNlIG9mIERhdGFzZXQgc2hvdWxkIGJlIFtbY29sdW1uc10sW2RhdGFyb3dzXV1cclxuICAgICAgICB0aGlzLnNlcnZpY2VEYXRhID0gW3RoaXMuc2VydmljZURhdGEuY29sdW1ucywgLi4udGhpcy5zZXJ2aWNlRGF0YS5kYXRhXVxyXG4gICAgICAgIC8vRW5kIG9mIFJlc3BvbnNlIERhdGEgZXh0cmFjdGlvblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFeHRyYWN0ZWQgU2VydmljZSBEYXRhJywgdGhpcy5zZXJ2aWNlRGF0YSk7XHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnYmFyJyB8fCB1c2VySW5wdXQudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gdGhpcy5nZXREYXRhc2V0RGltZW5zaW9ucyh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zLCB4RGltZW5zaW9ucztcclxuICAgICAgICAgIGxldCB5QXhpc05hbWU9JycseEF4aXNOYW1lPScnO1xyXG5cclxuICAgICAgICAgIC8vIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgfHwgdXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zOiBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgc2NhbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpLFxyXG4gICAgICAgICAgICAgIC8vICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAvLyAgICAgb25aZXJvOiBmYWxzZSAvLyBUaGlzIGlzIGltcG9ydGFudCwgc28geCBheGlzIGNhbiBzdGFydCBmcm9tIG5vbi16ZXJvIG51bWJlclxyXG4gICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbmNvZGUgZGF0YScsIGVuY29kZURhdGEpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2RhdGFodWIgYmFyIHdpdGhvdXQgYWdncmVnYXRpb24nLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBCYXIsTGluZSBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25zLmluZGV4T2YodXNlcklucHV0Lmdyb3VwQnkpID09PSAtMSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lPScnLHlBeGlzTmFtZT0nJztcclxuICAgICAgICAgIGlmKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zOiBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeEF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNTAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRYQXhpc1R5cGUodXNlcklucHV0KVxyXG4gICAgICAgICAgICAgIC8vIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAvLyAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgICAgICAgLy8gfSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZTogeUF4aXNOYW1lLFxyXG4gICAgICAgICAgICAgIG5hbWVMb2NhdGlvbjogJ21pZGRsZScsXHJcbiAgICAgICAgICAgICAgbmFtZUdhcDogNzAsXHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY3Jvc3MnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjb25maW5lOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFab29tOiB0aGlzLnNob3dab29tRmVhdHVyZSh1c2VySW5wdXQuc2xpZGVyWm9vbSksXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhWm9vbToge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlOiB7fSxcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnc2NhdHRlciBvcHRpb24gdHJhbnNmb3JtYXRpb24nLCB0aGlzLmNoYXJ0T3B0aW9uKVxyXG4gICAgICAgIH0gLy9FbmQgb2YgU2NhdHRlciBDaGFydCB3aXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICBkaW1lbnNpb25zID0gW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lLCB1c2VySW5wdXQucGllU2xpY2VWYWx1ZV07XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnM6IGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogXCJpdGVtXCIsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgaWNvbjogdXNlcklucHV0LmxlZ2VuZC5pY29uLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMTAlJywgIGxlZnQ6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBQaWUgY2hhcnQgd2l0aG91dCBBZ2dyZWdhdGlvbiBmb3IgRGF0YWh1YlxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncG9sYXInKSB7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnMsIHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4uZGltZW5zaW9ucywgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh1c2VySW5wdXQuZ3JvdXBCeSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zOiBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiB1c2VySW5wdXQudGl0bGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGVnZW5kOiB7fSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcG9sYXI6IHt9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLCAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiBlbmNvZGVEYXRhXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJBZ2dyZWdhdGUgUE9MQVIgQ0hhcnQgT3B0aW9uIFwiLCB0aGlzLmNoYXJ0T3B0aW9uKVxyXG4gICAgICAgIH0gIC8vIEVuZCBvZiBQb2xhciBDaGFydCBXaXRob3V0IEFnZ3JlZ2F0aW9uIGZvciBEYXRhaHViXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdyYWRhcicpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbnMgPSBbLi4udXNlcklucHV0LnJhZGFyRGltZW5zaW9uc107XHJcbiAgICAgICAgICB0aGlzLnNlcmllc0RhdGEgPSB0aGlzLmdldFJhZGFyU2VyaWVzRGF0YSh1c2VySW5wdXQpO1xyXG4gICAgICAgICAgbGV0IGluZGV4T2ZYRGltZW5zaW9uID0gdGhpcy5zZXJ2aWNlRGF0YVswXS5pbmRleE9mKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcbiAgICAgICAgICBsZXQgaW5kaWNhdG9yRGF0YSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnNlcnZpY2VEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGluZGljYXRvckRhdGEucHVzaCh7IG5hbWU6IHRoaXMuc2VydmljZURhdGFbaV1baW5kZXhPZlhEaW1lbnNpb25dIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gZW5jb2RlRGF0YSA9IHRoaXMuZ2V0RW5jb2RlRGF0YSh1c2VySW5wdXQsIGRhdGFzZXRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLCAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkYXI6IHtcclxuICAgICAgICAgICAgICBpbmRpY2F0b3I6IGluZGljYXRvckRhdGFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRhaHViIHJhZGFyIHdpdGhvdXQgYWdncmVnYXRpb24nLCB0aGlzLmNoYXJ0T3B0aW9uKVxyXG4gICAgICAgIH0gLy8gRW5kIG9mIFJhZGFyIENoYXJ0IHdpdGhvdXQgQWdncmVnYXRpb24gZm9yIERhdGFodWJcclxuICAgICAgfSAvLyBFTmQgb2YgRGF0YWh1YiBDYWxscyBSZXNwb25zZSB3aXRob3V0IEFnZ3JlZ2F0aW9uXHJcbiAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC5hZ2dyTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gY2FsbHMgZm9yIEFQSSAmIERhdGFodWIgd2l0aCBBZ2dyZWdhdGlvblxyXG4gICAgICAgIGVjaGFydHMucmVnaXN0ZXJUcmFuc2Zvcm0oc2ltcGxlVHJhbnNmb3JtLmFnZ3JlZ2F0ZSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RGltZW5zaW9uID0gdGhpcy5nZXRSZXN1bHREaW1lc2lvbnModXNlcklucHV0LmFnZ3JMaXN0LCB1c2VySW5wdXQuZ3JvdXBCeSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdERlaW1lbmlvbnMnLCByZXN1bHREaW1lbnNpb24pXHJcbiAgICAgICAgbGV0IGRpbWVuc2lvbnMgPSBbXTtcclxuICAgICAgICBsZXQgZW5jb2RlRGF0YTtcclxuICAgICAgICBjb25zdCBkYXRhc2V0SWQgPSAnX2FnZ3JlZ2F0ZSc7XHJcbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgc2VydmljZSBkYXRhIGJhc2VkIG9uIHRoZSByZXNwb25zZSB0eXBlIG9mIHd0aGVyZSBjYWxsIGlzIG1hZGUgdG8gRGF0YWh1YiBvciBPdGhlciBBUElcclxuICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgLy8gRm9ybWF0IG9mIERhdGEgZnJvbSBkYXRhaHViIGlzIFxyXG4gICAgICAgICAgLy8gUmVzdWx0OltcclxuICAgICAgICAgIC8vICAgXCJjb2x1bW5zXCI6Wydjb2xBJywnY29sQicsLi4uLCdjb2xOJ10sXHJcbiAgICAgICAgICAvLyAgIFwiZGF0YVwiOltcclxuICAgICAgICAgIC8vICAgICBbXCJBMVwiLFwiQjFcIiwuLi4sXCJOMVwiXSxcclxuICAgICAgICAgIC8vICAgICBbXCJBMlwiLFwiQjJcIiwuLi4sXCJOMlwiXSxcclxuICAgICAgICAgIC8vICAgICAuLi4sXHJcbiAgICAgICAgICAvLyAgICAgW1wiQU5cIixcIkJOXCIsLi4uLFwiTk5cIl1cclxuICAgICAgICAgIC8vICAgXVxyXG4gICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgLy8gc291cmNlIG9mIERhdGFzZXQgc2hvdWxkIGJlIFtbY29sdW1uc10sW2RhdGFyb3dzXV1cclxuICAgICAgICAgIHRoaXMuc2VydmljZURhdGEgPSBbdGhpcy5zZXJ2aWNlRGF0YS5jb2x1bW5zLCAuLi50aGlzLnNlcnZpY2VEYXRhLmRhdGFdXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIEZvcm1hdCBvZiBEYXRhIGZyb20gQVBpIGNhbGxzIGlzIEpTT04gb2JqZWN0IHdpdGgga2V5LHZhbHVlXHJcbiAgICAgICAgICAvLyBSZXN1bHQ6IFtcclxuICAgICAgICAgIC8vICAge1xyXG4gICAgICAgICAgLy8gICAgIFwia2V5MVwiOiBcInZhbDFcIixcclxuICAgICAgICAgIC8vICAgICBcImtleTJcIjogXCJ2YWwyXCIsXHJcbiAgICAgICAgICAvLyAgIH0sXHJcbiAgICAgICAgICAvLyAgIHtcclxuICAgICAgICAgIC8vICAgICBcImtleTFcIjogXCJ2YWwxLjFcIixcclxuICAgICAgICAgIC8vICAgICBcImtleTJcIjogXCJ2YWwyLjFcIixcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgdGhpcy5zZXJ2aWNlRGF0YSA9IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXTtcclxuICAgICAgICB9IC8vRW5kIG9mIFJlc3BvbnNlIERhdGEgZXh0cmFjdGlvblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFeHRyYWN0ZWQgU2VydmljZSBEYXRhJywgdGhpcy5zZXJ2aWNlRGF0YSlcclxuICAgICAgICBpZiAodXNlcklucHV0LnR5cGUgPT09ICdiYXInIHx8IHVzZXJJbnB1dC50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICAgIC8vIGRpbWVuc2lvbnMgPSB0aGlzLmdldERhdGFzZXREaW1lbnNpb25zKHVzZXJJbnB1dCk7XHJcbiAgICAgICAgICBsZXQgeURpbWVuc2lvbnMsIHhEaW1lbnNpb25zO1xyXG4gICAgICAgICAgbGV0IHhBeGlzTmFtZT0nJyx5QXhpc05hbWU9Jyc7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRhaHViUG9zdENhbGwpIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHlEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb247XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHhEaW1lbnNpb25zKTtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi54RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIHhBeGlzTmFtZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQsIHhEaW1lbnNpb25zLCB5RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uID0ge1xyXG4gICAgICAgICAgICBkYXRhc2V0OiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zOiBkaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNlcnZpY2VEYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ19hZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnJvbURhdGFzZXRJZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VjU2ltcGxlVHJhbnNmb3JtOmFnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb25zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHREaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5OiB1c2VySW5wdXQuZ3JvdXBCeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiB1c2VySW5wdXQudGl0bGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Nyb3NzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IHhBeGlzTmFtZSxcclxuICAgICAgICAgICAgICBuYW1lTG9jYXRpb246ICdtaWRkbGUnLFxyXG4gICAgICAgICAgICAgIG5hbWVHYXA6IDMwLFxyXG4gICAgICAgICAgICAgIHNjYWxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMuZ2V0WEF4aXNUeXBlKHVzZXJJbnB1dCksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRZQXhpc1R5cGUodXNlcklucHV0KSxcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWVcclxuICAgICAgICAgICAgICAvLyAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgLy8gICAgIG9uWmVybzogZmFsc2UgLy8gVGhpcyBpcyBpbXBvcnRhbnQsIHNvIHggYXhpcyBjYW4gc3RhcnQgZnJvbSBub24temVybyBudW1iZXJcclxuICAgICAgICAgICAgICAvLyB9LGltcG9ydCB7IGVsZW1lbnQgfSBmcm9tICdwcm90cmFjdG9yJztcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlc3QgPSBuYW1lLnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPVxyXG4gICAgICAgICAgICAgICAgICAvLyBuYW1lLnNwbGl0KC8oPz1bQS1aXSkvKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgIHRlc3RbMF0ucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cHBlcmNhc2UgdGhlIGZpcnN0IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGEudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVpvb206IHRoaXMuc2hvd1pvb21GZWF0dXJlKHVzZXJJbnB1dC5zbGlkZXJab29tKSxcclxuICAgICAgICAgICAgdG9vbGJveDoge1xyXG4gICAgICAgICAgICAgIGZlYXR1cmU6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFab29tOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbmNvZGUgZGF0YScsIGVuY29kZURhdGEpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2FnZ3JlZ2F0ZSBiYXInLCB0aGlzLmNoYXJ0T3B0aW9uKTtcclxuICAgICAgICB9IC8vRW5kIG9mIEJhcixMaW5lIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAnc2NhdHRlcicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmlzRGF0YWh1YlBvc3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KTtcclxuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbnMuaW5kZXhPZih1c2VySW5wdXQuZ3JvdXBCeSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucy5wdXNoKHVzZXJJbnB1dC5ncm91cEJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgeEF4aXNOYW1lPScnLHlBeGlzTmFtZT0nJztcclxuICAgICAgICAgIGlmKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICB4QXhpc05hbWUgPSAnJztcclxuICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgeEF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHlBeGlzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeUF4aXNOYW1lID0gdGhpcy5nZXRGb3JtYXR0ZWROYW1lKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbik7XHJcblxyXG4gICAgICAgICAgfVxyXG4gXHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM6IGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6IHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB4QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA1MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFhBeGlzVHlwZSh1c2VySW5wdXQpXHJcbiAgICAgICAgICAgICAgLy8gZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgIC8vICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnhBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgICAgICAvLyB9KSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICBuYW1lOiB5QXhpc05hbWUsXHJcbiAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnbWlkZGxlJyxcclxuICAgICAgICAgICAgICBuYW1lR2FwOiA3MCxcclxuICAgICAgICAgICAgICB0eXBlOiB0aGlzLmdldFlBeGlzVHlwZSh1c2VySW5wdXQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Njcm9sbCcsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOmZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9XHJcbiAgICAgICAgICAgICAgICAgIC8vIG5hbWUuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYXRhWm9vbTogdGhpcy5zaG93Wm9vbUZlYXR1cmUodXNlcklucHV0LnNsaWRlclpvb20pLFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgZGF0YVpvb206IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgeUF4aXNJbmRleDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZToge30sXHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3NjYXR0ZXIgb3B0aW9uIHRyYW5zZm9ybWF0aW9uJywgdGhpcy5jaGFydE9wdGlvbilcclxuICAgICAgICB9IC8vRW5kIG9mIFNjYXR0ZXIgQ2hhcnQgd2l0aCBBZ2dyZWdhdGlvbiBmb3IgZGF0YWh1YiBhbmQgQVBJXHJcbiAgICAgICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdwaWUnKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBbdXNlcklucHV0LnBpZVNsaWNlbk5hbWUsIHVzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkKTtcclxuICAgICAgICAgIHRoaXMuY2hhcnRPcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3Jhd19kYXRhJyxcclxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM6IGRpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc2VydmljZURhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAnX2FnZ3JlZ2F0ZScsXHJcbiAgICAgICAgICAgICAgICBmcm9tRGF0YXNldElkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZWNTaW1wbGVUcmFuc2Zvcm06YWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbnM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdERpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnk6IHVzZXJJbnB1dC5ncm91cEJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcmludDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgIHRleHQ6IHVzZXJJbnB1dC50aXRsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlcjogXCJpdGVtXCIsXHJcbiAgICAgICAgICAgICAgY29uZmluZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzEwJScsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMjAlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzEwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTUlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHsgZGV0YWlsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdzY3JvbGwnLFxyXG4gICAgICAgICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gbmFtZS5zcGxpdCgnLicpLnNsaWNlKC0xKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID1cclxuICAgICAgICAgICAgICAgICAgLy8gbmFtZS5zcGxpdCgvKD89W0EtWl0pLykuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgICB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBwZXJjYXNlIHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIudG9VcHBlckNhc2UoKTsgfSlcclxuICAgICAgICAgICAgICAgICAgICBhLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRvb2xib3g6IHtcclxuICAgICAgICAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcmllczogZW5jb2RlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9IC8vRW5kIG9mIFBpZSBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3BvbGFyJykge1xyXG4gICAgICAgICAgbGV0IHlEaW1lbnNpb25zLCB4RGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHlEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgZGltZW5zaW9ucyA9IFsuLi5kaW1lbnNpb25zLCAuLi55RGltZW5zaW9uc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIHhEaW1lbnNpb25zID0gdXNlcklucHV0LnhBeGlzRGltZW5zaW9uO1xyXG4gICAgICAgICAgICAgIGRpbWVuc2lvbnMucHVzaCh4RGltZW5zaW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zID0gWy4uLmRpbWVuc2lvbnMsIC4uLnhEaW1lbnNpb25zXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGltZW5zaW9ucy5pbmRleE9mKHVzZXJJbnB1dC5ncm91cEJ5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBkaW1lbnNpb25zLnB1c2godXNlcklucHV0Lmdyb3VwQnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbmNvZGVEYXRhID0gdGhpcy5nZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkLCB4RGltZW5zaW9ucywgeURpbWVuc2lvbnMpO1xyXG4gICAgICAgICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAgICAgZGF0YXNldDogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgICAgICAgICAgZGltZW5zaW9uczogZGltZW5zaW9ucyxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogdXNlcklucHV0LnRpdGxlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxlZ2VuZDoge30sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcm9zcydcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTAlJyxcclxuICAgICAgICAgICAgICB0b3A6ICcyMCUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMTAlJyxcclxuICAgICAgICAgICAgICBib3R0b206ICcxNSUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmdsZUF4aXM6IHtcclxuICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgIHN0YXJ0QW5nbGU6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmFkaXVzQXhpczoge1xyXG4gICAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb2xhcjoge30sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiB7IGRldGFpbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsJyxcclxuICAgICAgICAgICAgICBpY29uOiB1c2VySW5wdXQubGVnZW5kLmljb24sXHJcbiAgICAgICAgICAgICAgbGVmdDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOmZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVzdCA9IG5hbWUuc3BsaXQoJy4nKS5zbGljZSgtMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9XHJcbiAgICAgICAgICAgICAgICAgIC8vIG5hbWUuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgICAgdGVzdFswXS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7IH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b29sYm94OiB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZToge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUFzSW1hZ2U6IHt9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IGVuY29kZURhdGFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkFnZ3JlZ2F0ZSBQT0xBUiBDSGFydCBPcHRpb24gXCIsIHRoaXMuY2hhcnRPcHRpb24pXHJcbiAgICAgICAgfSAgLy8gRW5kIG9mIFBvbGFyIENoYXJ0IHdpdGggQWdncmVnYXRpb24gZm9yIGRhdGFodWIgYW5kIEFQSVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgLy8gICAvLyB0aGlzIGNvZGUgd2lsbCBub3Qgd29yayBhcyBBcGFjaGUgZG9lcyBub3Qgc3VwcG9ydCBhZ2dyZWdhdGlvbiB3aXRoIHJhZGFyXHJcbiAgICAgICAgLy8gICBpZiAodGhpcy5pc0RhdGFodWJQb3N0Q2FsbCkge1xyXG4gICAgICAgIC8vICAgICBkaW1lbnNpb25zID0gbnVsbDtcclxuICAgICAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIGRpbWVuc2lvbnMgPSBbLi4udXNlcklucHV0LnJhZGFyRGltZW5zaW9uc107XHJcblxyXG4gICAgICAgIC8vICAgfVxyXG5cclxuICAgICAgICAvLyAgIGVuY29kZURhdGEgPSB0aGlzLmdldEVuY29kZURhdGEodXNlcklucHV0LCBkYXRhc2V0SWQpO1xyXG4gICAgICAgIC8vICAgdGhpcy5jaGFydE9wdGlvbiA9IHtcclxuICAgICAgICAvLyAgICAgZGF0YXNldDogW1xyXG4gICAgICAgIC8vICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIGlkOiAncmF3X2RhdGEnLFxyXG4gICAgICAgIC8vICAgICAgICAgZGltZW5zaW9uczogZGltZW5zaW9ucyxcclxuICAgICAgICAvLyAgICAgICAgIHNvdXJjZTogdGhpcy5zZXJ2aWNlRGF0YVxyXG4gICAgICAgIC8vICAgICAgIH0sXHJcbiAgICAgICAgLy8gICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgaWQ6ICdfYWdncmVnYXRlJyxcclxuICAgICAgICAvLyAgICAgICAgIGZyb21EYXRhc2V0SWQ6ICdyYXdfZGF0YScsXHJcbiAgICAgICAgLy8gICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAvLyAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHR5cGU6ICdlY1NpbXBsZVRyYW5zZm9ybTphZ2dyZWdhdGUnLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uczpcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmVzdWx0RGltZW5zaW9uLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgZ3JvdXBCeTogdXNlcklucHV0Lmdyb3VwQnlcclxuICAgICAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHByaW50OiB0cnVlXHJcbiAgICAgICAgLy8gICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIF1cclxuICAgICAgICAvLyAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIF0sXHJcbiAgICAgICAgLy8gICAgIGxlZ2VuZDoge1xyXG4gICAgICAgIC8vICAgICAgIGljb246IHVzZXJJbnB1dC5sZWdlbmQuaWNvbixcclxuICAgICAgICAvLyAgICAgICB3aWR0aDogMzMwLFxyXG4gICAgICAgIC8vICAgICAgIHR5cGU6ICdzY3JvbGwnXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAvLyAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHJhZGFyOiB7XHJcbiAgICAgICAgLy8gICAgICAgaW5kaWNhdG9yOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4geyBuYW1lOiBpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl0gfTtcclxuICAgICAgICAvLyAgICAgICB9KSxcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAgc2VyaWVzOiB0aGlzLnNlcmllc0RhdGEsXHJcbiAgICAgICAgLy8gICAgIHRvb2xib3g6IHtcclxuICAgICAgICAvLyAgICAgICBmZWF0dXJlOiB7XHJcbiAgICAgICAgLy8gICAgICAgICBzYXZlQXNJbWFnZToge31cclxuICAgICAgICAvLyAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9IC8vIEVuZCBvZiBSYWRhciBDaGFydCB3aXRoIEFnZ3JlZ2F0aW9uIGZvciBkYXRhaHViIGFuZCBBUElcclxuICAgICAgfSAgLy8gRW5kIG9mIGNhbGxzIGZvciBBUEkgJiBEYXRhaHViIHdpdGggQWdncmVnYXRpb25cclxuICAgICAgLy8gRW5kIG9mIGNoYXJ0T3B0aW9uc1xyXG4gICAgICAvLyB9KVxyXG4gICAgfSAvLyBFbmQgb2YgSUYgY29uZGl0aW9uIGNoZWNraW5nIHdoZXRoZXIgdmFyaWFibGUgc2VydmljZURhdGEgaGFzIHNvbWUgZGF0YSBvciBub3RcclxuICB9XHJcbiAgZ2V0WEF4aXNUeXBlKGlucHV0KSB7XHJcbiAgICByZXR1cm4gaW5wdXQueEF4aXM7XHJcbiAgfVxyXG4gIGdldFlBeGlzVHlwZShpbnB1dCkge1xyXG4gICAgcmV0dXJuIGlucHV0LnlBeGlzO1xyXG4gIH1cclxuICBnZXRDaGFydFR5cGUoaW5wdXQpIHtcclxuICAgIHJldHVybiBpbnB1dC50eXBlO1xyXG4gIH1cclxuICBnZXRGb3JtYXR0ZWROYW1lKGlucHV0KSB7XHJcbiAgICBsZXQgdGVzdCA9IGlucHV0LnNwbGl0KCcuJykuc2xpY2UoLTEpO1xyXG4gICAgbGV0IGEgPSB0ZXN0WzBdLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgIC8vIHVwcGVyY2FzZSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcbiAgICAgIC5yZXBsYWNlKC9eLi8sIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpOyB9KVxyXG4gICAgcmV0dXJuIGEudHJpbSgpO1xyXG4gIH1cclxuICBnZXRFbmNvZGVEYXRhKHVzZXJJbnB1dCwgZGF0YXNldElkPywgeERpbWVuc2lvbnM/LCB5RGltZW5zaW9ucz8pIHtcclxuICAgIGlmICh1c2VySW5wdXQudHlwZSA9PT0gXCJwb2xhclwiKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW06ICdwb2xhcicsXHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC5sYXlvdXQsXHJcbiAgICAgICAgc2hvd1N5bWJvbDogdHJ1ZSxcclxuICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgIHJhZGl1czogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgYW5nbGU6IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9XVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodXNlcklucHV0LnR5cGUgPT09ICdzY2F0dGVyJykge1xyXG4gICAgICBpZiAodXNlcklucHV0LmxheW91dCA9PT0gJ2hvcml6b250YWxTY2F0dGVyJykge1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICAvLyBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgeDogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgbGV0IHhBeGlzRGF0YSA9IFtdO1xyXG4gICAgICAgICAgZm9yIChsZXQgaSBpbiB4QXhpc0RpbWVuc2lvbnMpIHtcclxuICAgICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgICBkYXRhc2V0SWQ6IGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICAgIHk6IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbixcclxuICAgICAgICAgICAgICAgIHg6IHhBeGlzRGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IFt4QXhpc0RpbWVuc2lvbnNbaV0sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4geEF4aXNEYXRhO1xyXG4gICAgICAgIH0vLyBFbmQgb2YgZWxzZSBwYXJ0IG9mIFhBeGlzRGltZW5zaW9uXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgeDogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IFt1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sIHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB5QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICAgIGxldCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICAgIGZvciAobGV0IGkgaW4geUF4aXNEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgICBzeW1ib2xTaXplOiB1c2VySW5wdXQuc2NhdHRlclN5bWJvbFNpemUsXHJcbiAgICAgICAgICAgICAgZGF0YXNldElkOiBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgICB5OiB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24sXHJcbiAgICAgICAgICAgICAgICB4OiB5QXhpc0RpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwOiBbeUF4aXNEaW1lbnNpb25zW2ldLCB1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHlBeGlzRGF0YTtcclxuICAgICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBZQXhpc0RpbWVuc2lvblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZXR1cm4gW3tcclxuICAgICAgLy8gICAvLyBuYW1lOiB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24sXHJcbiAgICAgIC8vICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgIC8vICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAvLyAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAvLyAgIGVuY29kZToge1xyXG4gICAgICAvLyAgICAgeTogdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLFxyXG4gICAgICAvLyAgICAgeDogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICAvLyAgICAgdG9vbHRpcDogW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXVxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vIH1dXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICBjb25zdCBkaW1lbnNpb25zID0gdXNlcklucHV0LnJhZGFyRGltZW5zaW9ucy5zcGxpdCgnLCcpO1xyXG4gICAgICBjb25zdCBkaW1lbnNpb25SZWNvcmQgPSBkaW1lbnNpb25zLnJlZHVjZSgoYWNjLCBkaW1lbnNpb24pID0+IHtcclxuICAgICAgICBhY2NbZGltZW5zaW9uXSA9IFtdO1xyXG4gICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgIH0sIHt9KTtcclxuICAgICAgdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgIGlmIChkaW1lbnNpb25SZWNvcmRba2V5XSkge1xyXG4gICAgICAgICAgICBkaW1lbnNpb25SZWNvcmRba2V5XS5wdXNoKGl0ZW1ba2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGxldCByZXN1bHRBUlIgPSBPYmplY3QudmFsdWVzKGRpbWVuc2lvblJlY29yZClcclxuICAgICAgY29uc3QgcmVzdWx0MSA9IE9iamVjdC5rZXlzKGRpbWVuc2lvblJlY29yZCkubWFwKGtleSA9PiAoe1xyXG4gICAgICAgIG5hbWU6IGtleSxcclxuICAgICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV1cclxuICAgICAgfSkpO1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gXCJiYXJcIiAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUJhcicgfHwgdXNlcklucHV0LmxheW91dCA9PT0gJ3N0YWNrZWRCYXInKSkge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAgICAgLy8gc3RhY2s6J2EnLFxyXG4gICAgICAgICAgbmFtZTogeURpbWVuc2lvbnMsXHJcbiAgICAgICAgICBlbmNvZGU6IHtcclxuICAgICAgICAgICAgeDogeERpbWVuc2lvbnMsXHJcbiAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zXHJcbiAgICAgICAgICAgIC8vIGl0ZW1OYW1lOiBbJ3Byb2R1Y3ROYW1lJ11cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiB5RGltZW5zaW9ucykge1xyXG4gICAgICAgICAgeUF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgZGF0YXNldElkOiBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAgIHN0YWNrOiB0aGlzLmdldFN0YWNrTmFtZSh1c2VySW5wdXQuc3RhY2ssIHlEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgICAgbmFtZTogeURpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zW2ldXHJcbiAgICAgICAgICAgICAgLy8gaXRlbU5hbWU6IFsncHJvZHVjdE5hbWUnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAvL2VuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gXCJiYXJcIiAmJiAodXNlcklucHV0LmxheW91dCA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHVzZXJJbnB1dC5sYXlvdXQgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicpKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgZGF0YXNldElkOiBkYXRhc2V0SWQsXHJcbiAgICAgICAgICAvLyBzdGFjazonYScsXHJcbiAgICAgICAgICBuYW1lOiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgICAgLy8gaXRlbU5hbWU6IFsncHJvZHVjdE5hbWUnXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIHhEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICB4QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQ6IGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFjaywgeERpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgICBuYW1lOiB4RGltZW5zaW9uc1tpXSxcclxuICAgICAgICAgICAgZW5jb2RlOiB7XHJcbiAgICAgICAgICAgICAgeDogeERpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgICAgICAvLyBpdGVtTmFtZTogWydwcm9kdWN0TmFtZSddXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IC8vZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVzZXJJbnB1dC50eXBlID09PSBcImxpbmVcIikge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgIGFyZWFTdHlsZTogdXNlcklucHV0LmFyZWEsXHJcbiAgICAgICAgICAvLyBzdGFjazonYScsXHJcbiAgICAgICAgICBuYW1lOiB5RGltZW5zaW9ucyxcclxuICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICB4OiB4RGltZW5zaW9ucyxcclxuICAgICAgICAgICAgeTogeURpbWVuc2lvbnNcclxuICAgICAgICAgICAgLy8gaXRlbU5hbWU6IFsncHJvZHVjdE5hbWUnXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIHlEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgICBkYXRhc2V0SWQ6IGRhdGFzZXRJZCxcclxuICAgICAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYSxcclxuICAgICAgICAgICAgbmFtZTogeURpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgICAgIHg6IHhEaW1lbnNpb25zLFxyXG4gICAgICAgICAgICAgIHk6IHlEaW1lbnNpb25zW2ldXHJcbiAgICAgICAgICAgICAgLy8gaXRlbU5hbWU6IFsncHJvZHVjdE5hbWUnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAvL2VuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQudHlwZSA9PT0gXCJwaWVcIikge1xyXG4gICAgICBsZXQgY29udnJhZGl1cyA9IHVzZXJJbnB1dC5yYWRpdXMuc3BsaXQoJywnKTtcclxuICAgICAgbGV0IHJvc2VWYWx1ZSA9ICcnOyBsZXQgc2xpY2VTdHlsZTtcclxuICAgICAgaWYgKHVzZXJJbnB1dC5sYXlvdXQgPT09ICdyb3NlTW9kZScpIHtcclxuICAgICAgICByb3NlVmFsdWUgPSAncm9zZSc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7fTtcclxuICAgICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPiAwICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID4gMCkge1xyXG4gICAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXNcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2xpY2VTdHlsZSA9IHtcclxuICAgICAgICAgIGJvcmRlclJhZGl1czogdXNlcklucHV0LnBpZUJvcmRlclJhZGl1cyxcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBib3JkZXJXaWR0aDogdXNlcklucHV0LnBpZUJvcmRlcldpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgIGRhdGFzZXRJZDogZGF0YXNldElkLFxyXG4gICAgICAgIHJhZGl1czogY29udnJhZGl1cyxcclxuICAgICAgICByb3NlVHlwZTogcm9zZVZhbHVlLFxyXG4gICAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpdGVtU3R5bGU6IHNsaWNlU3R5bGUsXHJcbiAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQucGllU2xpY2VOYW1lLFxyXG4gICAgICAgIGVuY29kZToge1xyXG4gICAgICAgICAgaXRlbU5hbWU6IFt1c2VySW5wdXQucGllU2xpY2VuTmFtZV0sXHJcbiAgICAgICAgICB2YWx1ZTogdXNlcklucHV0LnBpZVNsaWNlVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH1dO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBnZXRTY2F0dGVyQ2hhcnRTZXJpZXNEYXRhIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY3JlYXRlIHNlcmllcyBkYXRhIGZvciBzY2F0dGVyIGNoYXJ0XHJcbiAgZ2V0U2NhdHRlckNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIC8vIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgLy8gdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgLy8gICBjb25zdCBjdXJyZW50UmVzdWx0ID0gW107XHJcbiAgICAvLyAgIGN1cnJlbnRSZXN1bHQucHVzaChpdGVtW3VzZXJJbnB1dC54QXhpc0RpbWVuc2lvbl0pO1xyXG4gICAgLy8gICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueUF4aXNEaW1lbnNpb25dKTtcclxuICAgIC8vICAgcmVzdWx0LnB1c2goY3VycmVudFJlc3VsdCk7XHJcbiAgICAvLyB9KTtcclxuICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgLy8gZGF0YTogcmVzdWx0LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICAgIGxldCB4QXhpc0RhdGEgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIHhBeGlzRGltZW5zaW9ucykge1xyXG4gICAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgICAgc3ltYm9sU2l6ZTogdXNlcklucHV0LnNjYXR0ZXJTeW1ib2xTaXplLFxyXG4gICAgICAgICAgICAvLyBkYXRhOiByZXN1bHQsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaXRlbVt4QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB4QXhpc0RhdGE7XHJcbiAgICAgIH0vLyBFbmQgb2YgZWxzZSBwYXJ0IG9mIFhBeGlzRGltZW5zaW9uXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgIC8vIGRhdGE6IHJlc3VsdCxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXTtcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfV1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB5QXhpc0RpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgICBsZXQgeUF4aXNEYXRhID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiB5QXhpc0RpbWVuc2lvbnMpIHtcclxuICAgICAgICAgIHlBeGlzRGF0YVtpXSA9IHtcclxuICAgICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICAgIHN5bWJvbFNpemU6IHVzZXJJbnB1dC5zY2F0dGVyU3ltYm9sU2l6ZSxcclxuICAgICAgICAgICAgLy8gZGF0YTogcmVzdWx0LFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1beUF4aXNEaW1lbnNpb25zW2ldXTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgIGZvY3VzOiAnc2VyaWVzJyxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRYOiAwLFxyXG4gICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuNSknXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgICB9Ly8gRW5kIG9mIGVsc2UgcGFydCBvZiBZQXhpc0RpbWVuc2lvblxyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgLy8gZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgc2VyaWVzIGRhdGEgZm9yIHBvbGFyIGNoYXJ0XHJcbiAgZ2V0UG9sYXJDaGFydFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgY29uc3QgY3VycmVudFJlc3VsdCA9IFtdO1xyXG4gICAgICBjdXJyZW50UmVzdWx0LnB1c2goaXRlbVt1c2VySW5wdXQueEF4aXNEaW1lbnNpb25dKTtcclxuICAgICAgY3VycmVudFJlc3VsdC5wdXNoKGl0ZW1bdXNlcklucHV0LnlBeGlzRGltZW5zaW9uXSk7XHJcbiAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRSZXN1bHQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gW3tcclxuICAgICAgY29vcmRpbmF0ZVN5c3RlbTogJ3BvbGFyJyxcclxuICAgICAgbmFtZTogdXNlcklucHV0LnhBeGlzRGltZW5zaW9uLFxyXG4gICAgICB0eXBlOiB1c2VySW5wdXQubGF5b3V0LFxyXG4gICAgICBzaG93U3ltYm9sOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXN1bHQsXHJcbiAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgc2hvdzogdXNlcklucHV0LnNob3dMYWJlbFxyXG4gICAgICB9LFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH1dXHJcbiAgfVxyXG4gIC8vIGdldFJhZGFyU2VyaWVzRGF0YSBmdW5jdGlvbiBpcyB1c2VkIHRvIGdldCB0aGUgZGF0YSBmcm9tIHNlcnZpY2UgYW5kIHN0b3JlIGl0IGluIHNlcmllc0RhdGEgdmFyaWFibGVcclxuICBnZXRSYWRhclNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gdXNlcklucHV0LnJhZGFyRGltZW5zaW9ucy5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3QgZGltZW5zaW9uUmVjb3JkID0gZGltZW5zaW9ucy5yZWR1Y2UoKGFjYywgZGltZW5zaW9uKSA9PiB7XHJcbiAgICAgIGFjY1tkaW1lbnNpb25dID0gW107XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCB7fSk7XHJcbiAgICBjb25zb2xlLmxvZygnZGltZW5zaW9ucycsIGRpbWVuc2lvbnMpO1xyXG5cclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICB0aGlzLnNlcnZpY2VEYXRhW3VzZXJJbnB1dC5saXN0TmFtZV0ubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpbWVuc2lvblJlY29yZFtrZXldKSB7XHJcbiAgICAgICAgICAgIGRpbWVuc2lvblJlY29yZFtrZXldLnB1c2goaXRlbVtrZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgbGV0IHZhbCA9IHY7XHJcbiAgICAgICAgcmV0dXJuIHsga2V5OiB2YWwsIHZhbHVlOiB0aGlzLnNlcnZpY2VEYXRhWzBdLmluZGV4T2YodikgfTtcclxuICAgICAgfSk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5zZXJ2aWNlRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGluZGV4ZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgIGRpbWVuc2lvblJlY29yZFtlbGVtZW50LmtleV0ucHVzaCh0aGlzLnNlcnZpY2VEYXRhW2ldW2VsZW1lbnQudmFsdWVdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGxldCByZXN1bHRBUlIgPSBPYmplY3QudmFsdWVzKGRpbWVuc2lvblJlY29yZClcclxuICAgIGNvbnN0IHJlc3VsdDEgPSBPYmplY3Qua2V5cyhkaW1lbnNpb25SZWNvcmQpLm1hcChrZXkgPT4gKHtcclxuICAgICAgbmFtZToga2V5LFxyXG4gICAgICB2YWx1ZTogZGltZW5zaW9uUmVjb3JkW2tleV1cclxuICAgIH0pKTtcclxuICAgIGlmICh1c2VySW5wdXQubGlzdE5hbWUgaW4gdGhpcy5zZXJ2aWNlRGF0YSkge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICBuYW1lOiB1c2VySW5wdXQubGlzdE5hbWUsXHJcbiAgICAgICAgdHlwZTogJ3JhZGFyJyxcclxuICAgICAgICBkYXRhOiByZXN1bHQxXHJcbiAgICAgIH1dXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gW3tcclxuICAgICAgICAvLyBuYW1lOiB1c2VySW5wdXQuLFxyXG4gICAgICAgIHR5cGU6ICdyYWRhcicsXHJcbiAgICAgICAgZGF0YTogcmVzdWx0MVxyXG4gICAgICB9XVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG5cclxuICBjcmVhdGVPYmplY3QoZGF0YURpbSwgYXJyLCBkaW1lbikge1xyXG4gICAgY29uc3QgZGltZW5zaW9ucyA9IGRpbWVuLnNwbGl0KCcsJyk7XHJcbiAgICBjb25zdCBkaW1lbnNpb25SZWNvcmQgPSBkaW1lbnNpb25zLnJlZHVjZSgoYWNjLCBkaW1lbnNpb24pID0+IHtcclxuICAgICAgYWNjW2RpbWVuc2lvbl0gPSBbXTtcclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIHt9KTtcclxuICAgIGxldCBpbmRleGVzID0gZGltZW5zaW9ucy5tYXAoKHYsIGluZGV4KSA9PiB7XHJcbiAgICAgIGxldCB2YWwgPSB2O1xyXG4gICAgICByZXR1cm4geyBrZXk6IHZhbCwgdmFsdWU6IGRhdGFEaW0uaW5kZXhPZih2KSB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXJyLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0ZW0gJywgaXRlbSwgJyAgIGluZGV4ICcsIGluZGV4KTtcclxuICAgICAgaW5kZXhlcy5rZXlzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgZGltZW5zaW9uUmVjb3JkW2VsZW1lbnQua2V5XS5wdXNoKGl0ZW1bZWxlbWVudC52YWx1ZV0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9nZXRQaWVDaGFydFNlcmllc0RhdGEgZnVuY3Rpb24gaXMgdXNlZCB0byBjcmVhdGUgc2VyaWVzIGRhdGEgZm9yIHBpZSBjaGFydFxyXG4gIGdldFBpZUNoYXJ0U2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIC8vY29udmVydCBjb21tYSBzZXBhcmF0ZWQgc3RyaW5nIHVzZXJJbnB1dC5yYWRpdXMgdG8gYXJyYXlcclxuICAgIGxldCBjb252cmFkaXVzID0gdXNlcklucHV0LnJhZGl1cy5zcGxpdCgnLCcpO1xyXG4gICAgbGV0IHJvc2VWYWx1ZSA9ICcnOyBsZXQgc2xpY2VTdHlsZTtcclxuICAgIGlmICh1c2VySW5wdXQubGF5b3V0ID09PSAncm9zZU1vZGUnKSB7XHJcbiAgICAgIHJvc2VWYWx1ZSA9ICdyb3NlJztcclxuICAgIH1cclxuICAgIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPT09IHVuZGVmaW5lZCAmJiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2xpY2VTdHlsZSA9IHt9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh1c2VySW5wdXQucGllQm9yZGVyV2lkdGggPiAwICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzbGljZVN0eWxlID0ge1xyXG4gICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgYm9yZGVyV2lkdGg6IHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aFxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aCA9PT0gdW5kZWZpbmVkICYmIHVzZXJJbnB1dC5waWVCb3JkZXJSYWRpdXMgPiAwKSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNsaWNlU3R5bGUgPSB7XHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiB1c2VySW5wdXQucGllQm9yZGVyUmFkaXVzLFxyXG4gICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgYm9yZGVyV2lkdGg6IHVzZXJJbnB1dC5waWVCb3JkZXJXaWR0aFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW3tcclxuICAgICAgbmFtZTogdXNlcklucHV0Lmxpc3ROYW1lLFxyXG4gICAgICB0eXBlOiAncGllJyxcclxuICAgICAgcmFkaXVzOiBjb252cmFkaXVzLFxyXG4gICAgICByb3NlVHlwZTogcm9zZVZhbHVlLFxyXG4gICAgICBhdm9pZExhYmVsT3ZlcmxhcDogZmFsc2UsXHJcbiAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhYmVsTGluZToge1xyXG4gICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGl0ZW1TdHlsZTpzbGljZVN0eWxlLFxyXG4gICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgIC8vIGxhYmVsOiB7XHJcbiAgICAgICAgLy8gICBzaG93OiB0cnVlLFxyXG4gICAgICAgIC8vICAgZm9udFNpemU6ICczMCcsXHJcbiAgICAgICAgLy8gICBmb250V2VpZ2h0OiAnYm9sZCdcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAvL3Rha2UgdmFsIGZyb20gdXNlcmlucHV0LnBpZXNsaWNlIHZhbHVlIGFuZCByZXR1cm4gaXRcclxuICAgICAgICBjb25zdCB2YWwgPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZVZhbHVlXTtcclxuICAgICAgICBsZXQgbmFtO1xyXG4gICAgICAgIGlmICh1c2VySW5wdXQucGllU2xpY2VWYWx1ZSA9PT0gdXNlcklucHV0LnBpZVNsaWNlbk5hbWUpIHtcclxuICAgICAgICAgIG5hbSA9IHVzZXJJbnB1dC5waWVTbGljZW5OYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuYW0gPSBpdGVtW3VzZXJJbnB1dC5waWVTbGljZW5OYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgIG5hbWU6IG5hbVxyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICB9XVxyXG4gIH1cclxuICAvL2dldHNlcmllc2RhdGEgcmVjaWV2ZXMgdXNlcmlucHV0IGFuZCByZXR1cm5zIHNlcmllc2RhdGFcclxuICAvL3Nlcmllc2RhdGEgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0c1xyXG4gIGdldFNlcmllc0RhdGEodXNlcklucHV0KSB7XHJcbiAgICBpZiAodXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6IHVzZXJJbnB1dC5saXN0TmFtZSxcclxuICAgICAgICAvLyBkYXRhIGFzIHNlcnZpY2VkYXRhJ3MgdXNlcklucHV0Lmxpc3ROYW1lIGZyb20gdXNlcmlucHV0IHlheGlzIGRpbWVuc2lvbiB3aXRob3V0IHVzaW5nIG1hcCBmdW5jdGlvblxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgIHJldHVybiBpdGVtW3VzZXJJbnB1dC55QXhpc0RpbWVuc2lvbl07XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgc21vb3RoOiB1c2VySW5wdXQuc21vb3RoTGluZSxcclxuICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgIH1dO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgeUF4aXNEaW1lbnNpb25zID0gdXNlcklucHV0LnlBeGlzRGltZW5zaW9uLnNwbGl0KCcsJyk7XHJcbiAgICAgIGxldCB5QXhpc0RhdGEgPSBbXTtcclxuICAgICAgZm9yIChsZXQgaSBpbiB5QXhpc0RpbWVuc2lvbnMpIHtcclxuICAgICAgICB5QXhpc0RhdGFbaV0gPSB7XHJcbiAgICAgICAgICBuYW1lOiB5QXhpc0RpbWVuc2lvbnNbaV0sXHJcbiAgICAgICAgICBzdGFjazogdGhpcy5nZXRTdGFja05hbWUodXNlcklucHV0LnN0YWNrLCB5QXhpc0RpbWVuc2lvbnNbaV0pLFxyXG4gICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgZm9jdXM6ICdzZXJpZXMnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB0eXBlOiB1c2VySW5wdXQudHlwZSxcclxuICAgICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgICBhcmVhU3R5bGU6IHVzZXJJbnB1dC5hcmVhXHJcbiAgICAgICAgfVxyXG4gICAgICB9IC8vZW5kIG9mIGZvciBibG9ja1xyXG4gICAgICByZXR1cm4geUF4aXNEYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBHZXRzIHRoZSBkaW1lbnNpb25zIGZvciBkYXRhc2V0XHJcbiAgZ2V0RGF0YXNldERpbWVuc2lvbnModXNlcklucHV0KSB7XHJcbiAgICBsZXQgeURpbWVuc2lvbnMsIHhEaW1lbnNpb25zLCBkaW1lbnNpb25BcnIgPSBbXTtcclxuICAgIC8vIGlmICh1c2VySW5wdXQudHlwZSA9PT0gJ2JhcicgfHwgdXNlcklucHV0LnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgaWYgKHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICB5RGltZW5zaW9ucyA9IHVzZXJJbnB1dC55QXhpc0RpbWVuc2lvbjtcclxuICAgICAgZGltZW5zaW9uQXJyLnB1c2goeURpbWVuc2lvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeURpbWVuc2lvbnMgPSB1c2VySW5wdXQueUF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgZGltZW5zaW9uQXJyID0gWy4uLmRpbWVuc2lvbkFyciwgLi4ueURpbWVuc2lvbnNdO1xyXG4gICAgfVxyXG4gICAgaWYgKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICB4RGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbjtcclxuICAgICAgZGltZW5zaW9uQXJyLnB1c2goeERpbWVuc2lvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeERpbWVuc2lvbnMgPSB1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKTtcclxuICAgICAgZGltZW5zaW9uQXJyID0gWy4uLmRpbWVuc2lvbkFyciwgLi4ueERpbWVuc2lvbnNdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpbWVuc2lvbkFycjtcclxuICB9XHJcbiAgLy8gaWYgc3RhY2tkYXRhIGlzIGVtcHR5IHRoZW4gcmV0dXJuIGRpbWVuc2lvbk5hbWVcclxuICAvLyBlbHNlIGlmIHN0YWNrZGF0YSBpcyBub3QgZW1wdHkgdGhlbiBjaGVjayBpZiBkaW1lbnNpb25OYW1lIGlzIHByZXNlbnQgaW4gc3RhY2tkYXRhXHJcbiAgLy8gaWYgcHJlc2VudCB0aGVuIHJldHVybiBzdGFja25hbWVcclxuICAvLyBlbHNlIHJldHVybiBkaW1lbnNpb25OYW1lXHJcbiAgZ2V0U3RhY2tOYW1lKHN0YWNrRGF0YSwgZGltZW5zaW9uTmFtZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChsZXQgeCBpbiBzdGFja0RhdGEpIHtcclxuICAgICAgbGV0IHZhbHVlcyA9IHN0YWNrRGF0YVt4XS5zdGFja1ZhbHVlcy5zcGxpdCgnLCcpO1xyXG4gICAgICBmb3IgKGxldCBpIGluIHZhbHVlcykge1xyXG4gICAgICAgIGlmICh2YWx1ZXNbaV0gPT09IGRpbWVuc2lvbk5hbWUpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IHN0YWNrRGF0YVt4XS5zdGFja05hbWU7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICAvL0dldCB0aGUgZGltZW5zaW9ucyBhbmQgbWV0aG9kIGFycmF5IGZvciBhZ2dyZWdhdGlvblxyXG4gIC8vIExpc3QgY29tZXMgZnJvbSBhZ2dyZWdhdGUgY29uZmlnIGFuZCBjb25hdGlucyBib3RoIG1ldGhvZCBhbmQgZGltZW5zaW9uIG5hbWVcclxuICAvL1dlIGFsc28gbmVlZCBncm91cCBieSB0byBiZSBpbmNsdWRlZCBhcyBhIGRpbWVuc2lvbiBidXQgd2l0aG91dCBhIG1ldGhvZFxyXG4gIGdldFJlc3VsdERpbWVzaW9ucyhsaXN0LCBncm91cGJ5KSB7XHJcbiAgICBjb25zdCBjaGFuZ2VkTmFtZXNGb3JSZXN1bHQgPSBsaXN0Lm1hcCgoe1xyXG4gICAgICBhZ2dyRGltZXNuaW9uOiBmcm9tLFxyXG4gICAgICBhZ2dyTWV0aG9kOiBtZXRob2RcclxuICAgIH0pID0+ICh7XHJcbiAgICAgIGZyb20sXHJcbiAgICAgIG1ldGhvZFxyXG4gICAgfSkpO1xyXG4gICAgY2hhbmdlZE5hbWVzRm9yUmVzdWx0LnB1c2goeyBmcm9tOiBncm91cGJ5IH0pO1xyXG4gICAgcmV0dXJuIGNoYW5nZWROYW1lc0ZvclJlc3VsdDtcclxuICB9XHJcbiAgLy8gTWV0aG9kIGZvciBzaG93aW5nIHRoZSBTbGlkZXIvUGluY2ggWm9vbVxyXG4gIHNob3dab29tRmVhdHVyZSh2YWwpIHtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnaW5zaWRlJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiAnc2xpZGVyJyxcclxuICAgICAgICAgIHhBeGlzSW5kZXg6IDAsXHJcbiAgICAgICAgICBtaW5TcGFuOiA1LFxyXG4gICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgIGhlaWdodDogMjAsXHJcbiAgICAgICAgICB0b3A6ICc5MCUnLFxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBHZXQgZGF0YSBmb3IgaG9yaXpvbnRhbCBCYXIgY2hhcnRcclxuICBnZXRIb3Jpem9udGFsU2VyaWVzRGF0YSh1c2VySW5wdXQpIHtcclxuICAgIGlmICh1c2VySW5wdXQueEF4aXNEaW1lbnNpb24uc3BsaXQoJywnKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgbmFtZTogdXNlcklucHV0Lmxpc3ROYW1lLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuc2VydmljZURhdGFbdXNlcklucHV0Lmxpc3ROYW1lXS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgIGNvbnN0IHZhbCA9IGV4dHJhY3RWYWx1ZUZyb21KU09OKHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbiwgaXRlbSk7XHJcbiAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICBzaG93OiB1c2VySW5wdXQuc2hvd0xhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgZm9jdXM6ICdzZXJpZXMnLFxyXG4gICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHR5cGU6IHVzZXJJbnB1dC50eXBlLFxyXG4gICAgICAgIHNtb290aDogdXNlcklucHV0LnNtb290aExpbmUsXHJcbiAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYVxyXG4gICAgICB9XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHhBeGlzRGltZW5zaW9ucyA9IHVzZXJJbnB1dC54QXhpc0RpbWVuc2lvbi5zcGxpdCgnLCcpO1xyXG4gICAgICBsZXQgeEF4aXNEYXRhID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgaW4geEF4aXNEaW1lbnNpb25zKSB7XHJcbiAgICAgICAgeEF4aXNEYXRhW2ldID0ge1xyXG4gICAgICAgICAgbmFtZTogeEF4aXNEaW1lbnNpb25zW2ldLFxyXG4gICAgICAgICAgc3RhY2s6IHRoaXMuZ2V0U3RhY2tOYW1lKHVzZXJJbnB1dC5zdGFjaywgeEF4aXNEaW1lbnNpb25zW2ldKSxcclxuICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHNob3c6IHVzZXJJbnB1dC5zaG93TGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAvLyBmb2N1czonc2VyaWVzJyxcclxuICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5zZXJ2aWNlRGF0YVt1c2VySW5wdXQubGlzdE5hbWVdLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gaXRlbVt5QXhpc0RpbWVuc2lvbnNbaV1dO1xyXG4gICAgICAgICAgICBjb25zdCB2YWwgPSBleHRyYWN0VmFsdWVGcm9tSlNPTih4QXhpc0RpbWVuc2lvbnNbaV0sIGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICAvLyBtYXJrUG9pbnQ6IHtcclxuICAgICAgICAgIC8vICAgZGF0YTogW1xyXG4gICAgICAgICAgLy8gICAgIHsgdHlwZTogJ21heCcsIG5hbWU6ICdNYXgnIH0sXHJcbiAgICAgICAgICAvLyAgICAgeyB0eXBlOiAnbWluJywgbmFtZTogJ01pbicgfVxyXG4gICAgICAgICAgLy8gICBdXHJcbiAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgLy8gbWFya0xpbmU6IHtcclxuICAgICAgICAgIC8vICAgZGF0YTogW3sgdHlwZTogJ2F2ZXJhZ2UnLCBuYW1lOiAnQXZnJyB9XVxyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgLy8gLFxyXG4gICAgICAgICAgdHlwZTogdXNlcklucHV0LnR5cGUsXHJcbiAgICAgICAgICBzbW9vdGg6IHVzZXJJbnB1dC5zbW9vdGhMaW5lLFxyXG4gICAgICAgICAgYXJlYVN0eWxlOiB1c2VySW5wdXQuYXJlYVxyXG4gICAgICAgIH1cclxuICAgICAgfSAvL2VuZCBvZiBmb3IgYmxvY2tcclxuICAgICAgcmV0dXJuIHhBeGlzRGF0YTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19