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
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { ChartConfig } from './model/config.modal';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
import { isDevMode } from '@angular/core';
import * as simpleTransform from 'echarts-simple-transform';
import {
  FetchClient,
  Realtime,
} from '@c8y/client';
import { extractValueFromJSON } from './util/extractValueFromJSON.util';
import { ResizedEvent } from 'angular-resize-event';
import { element } from 'protractor';
@Component({
  selector: 'lib-gp-smart-echart-widget',
  templateUrl: './gp-smart-echart-widget.component.html',
  styles: ['gp-smart-echart-widget.component.css']
})
export class GpSmartEchartWidgetComponent implements OnInit,OnDestroy {
  @ViewChild('chartBox', { static: true }) protected mapDivRef: ElementRef;
  @Input() config: ChartConfig;
  serviceData;
  seriesData;
  chartData;
  userInput;
  width: number;
  height: number;
  chartOption: EChartsOption = {};
  protected allSubscriptions: any = [];
  realtime = true;
  deviceId = '';
  protected chartDiv: HTMLDivElement;
  isDatahubPostCall = false;
  dataChart;
  colorsForChart;
  constructor(private chartService: GpSmartEchartWidgetService,
    private fetchClient: FetchClient,) { }
  ngOnInit(): void {
    this.chartDiv = this.mapDivRef.nativeElement;
    const sessionStorageData = this.getDataFromSessionStorage('Chartsession');
    if (sessionStorageData && sessionStorageData !== 'true') {
      this.dataChart = echarts.init(this.chartDiv);
      this.dataChart.showLoading();
      this.createChart(this.config);
    } else if (sessionStorageData === 'true') {
      this.dataChart = echarts.init(this.chartDiv);
      this.dataChart.showLoading();
      this.waitForServiceToComplete();
    } else {
      this.dataChart = echarts.init(this.chartDiv);
      this.dataChart.showLoading();
      this.createChart(this.config);
    }
  }
  dataFromUser(userInput: ChartConfig) {
    this.dataChart = echarts.init(this.chartDiv);
    this.dataChart.showLoading();
    this.createChart(userInput);
  }// end of dataFromUser()
  // create variables for all ChartConfig like value type, apidata from url etc to store the data from user
  // create chart
  reloadData(userInput: ChartConfig) {
    this.dataChart = echarts.init(this.chartDiv);
    this.dataChart.showLoading();
    this.createChart(userInput);
  }

  // createChart function is used to create chart with the help of echart library
  async createChart(userInput?: ChartConfig) {
    // this.dataChart = echarts.init(this.chartDiv);
    // this.dataChart.showLoading();
    if (userInput.showApiInput || userInput.showDatahubInput) {
      let chartsessionData = [];
      if (this.getDataFromSessionStorage('Chartsession')) {

        chartsessionData = JSON.parse(sessionStorage.getItem('Chartsession'));

        let matchingURL = false;
        chartsessionData.forEach((dataElement, index) => {
          if ((userInput.apiUrl === dataElement.url) || (userInput.datahubUrl === dataElement.url)) {
            if(userInput.apiUrl){
              this.isDatahubPostCall = false;
            }
            if(userInput.datahubUrl){
              this.isDatahubPostCall = true;
            }
            matchingURL = true;
            this.serviceData = dataElement.response;
          }
        });
        if (!matchingURL) {
          if (this.getDataFromSessionStorage('serviceRunning') === 'false') {
            this.setDataInSessionStorage('serviceRunning', 'true');
            // tslint:disable-next-line: prefer-const
            let getDataFromSession = JSON.parse(sessionStorage.getItem('Chartsession'));
            //  Service call for E chart
            if (userInput.showApiInput) {
              this.serviceData = await this.chartService.getAPIData(userInput.apiUrl).toPromise();

              if (this.serviceData != null) {


                getDataFromSession.push({ response: this.serviceData, url: userInput.apiUrl });
                sessionStorage.setItem('Chartsession', JSON.stringify(getDataFromSession));
                sessionStorage.setItem('serviceRunning', JSON.stringify('false'));
              }
            } else if (userInput.showDatahubInput) {
              const sqlReqObject = {
                sql: userInput.sqlQuery,
                limit: userInput.sqlLimit,
                format: 'PANDAS'
              };
              const response = await this.fetchClient.fetch(userInput.datahubUrl, {
                body: JSON.stringify(sqlReqObject),
                method: 'POST'
              })
              this.serviceData = await response.json();
              this.isDatahubPostCall = true;

              if (this.serviceData != null) {
                getDataFromSession.push({ response: this.serviceData, url: userInput.datahubUrl });
                sessionStorage.setItem('Chartsession', JSON.stringify(getDataFromSession));
                sessionStorage.setItem('serviceRunning', JSON.stringify('false'));
              }
            } else {
              if (isDevMode()) { console.log('No Datasource selected'); }
            }
          } else {
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
          this.serviceData = await this.chartService.getAPIData(userInput.apiUrl).toPromise();
          if (this.serviceData !== null) {
            temp.push({ response: this.serviceData, url: this.config.apiUrl });
            this.setDataInSessionStorage('Chartsession', temp);
            this.setDataInSessionStorage('serviceRunning', 'false');
          }
        } else if (userInput.showDatahubInput) {
          const sqlReqObject = {
            sql: userInput.sqlQuery,
            limit: userInput.sqlLimit,
            format: 'PANDAS'
          };
          const response = await this.fetchClient.fetch(userInput.datahubUrl, {
            body: JSON.stringify(sqlReqObject),
            method: 'POST'
          })
          this.serviceData = await response.json();
          this.isDatahubPostCall = true;

          if (this.serviceData !== null) {

            temp.push({ response: this.serviceData, url: this.config.datahubUrl });
            this.setDataInSessionStorage('Chartsession', temp);
            this.setDataInSessionStorage('serviceRunning', 'false');
          }
        } else {
          if (isDevMode()) { console.log('No Datasource selected'); }
        }
      }
    }
    if (!userInput.colors) {
      if (isDevMode()) { console.log('No colors Specified'); }
      this.colorsForChart = [];
    } else {
      this.colorsForChart = [...userInput.colors.split(',')]
    }
    if (this.serviceData) {
      this.dataChart.hideLoading();
      let axisFontSize = 0;
      if (userInput.fontSize === 0 || userInput.fontSize === '' || userInput.fontSize === null || userInput.fontSize === undefined) {
        axisFontSize = 12;
      } else {
        axisFontSize = userInput.fontSize;
      }
      if (userInput.area === true) {
        if (userInput.areaOpacity == null) {
          userInput.area = {};
        } else {
          userInput.area = {
            opacity : userInput.areaOpacity
          };
        }
      } else {
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
                  .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Pie Chart For API', this.chartOption); }
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Polar Chart For API', this.chartOption); }
        }
        // End of Polar CHart for API
        else if (userInput.type === 'scatter') {
          let xAxisObject; let yAxisObject;
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
          } else {
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
                a.trim();
                return a;
              },
            },
            dataZoom: this.showZoomFeature(userInput.sliderZoom),
            series: this.seriesData
          }
          if (isDevMode()) { console.log('Scatter chart for API', this.chartOption) }
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Radar chart for API', this.chartOption) }
        } // End of Radar CHart for API
        else if ((userInput.type === 'line' || userInput.type === 'bar')
          && (userInput.layout !== 'simpleHorizontalBar' && userInput.layout !== 'stackedHorizontalBar')) {
          this.seriesData = this.getSeriesData(userInput);
          let xAxisName; let yAxisName;
          if (userInput.xAxisDimension.split(',').length > 1) {
            xAxisName = ''
          } else {
            xAxisName = this.getFormattedName(userInput.xAxisDimension)
          }
          if (userInput.yAxisDimension.split(',').length > 1) {
            yAxisName = ''
          } else {
            yAxisName = this.getFormattedName(userInput.yAxisDimension)
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Simple bar or line chart for API', this.chartOption); }
        }
        // End of Simple Line,Simple Bar,Stacked Line And Stacked Bar for API
        else if (userInput.type === 'bar' && (userInput.layout === 'simpleHorizontalBar' || userInput.layout === 'stackedHorizontalBar')) {
          let xAxisName; let yAxisName;
          if (userInput.xAxisDimension.split(',').length > 1) {
            xAxisName = ''
          } else {
            xAxisName = this.getFormattedName(userInput.xAxisDimension)
          }
          if (userInput.yAxisDimension.split(',').length > 1) {
            yAxisName = ''
          } else {
            yAxisName = this.getFormattedName(userInput.yAxisDimension)
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Horizontal chart for API', this.chartOption); }
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
        this.serviceData = [this.serviceData.columns, ...this.serviceData.data]
        // End of Response Data extraction
        if (userInput.type === 'bar' || userInput.type === 'line') {
          dimensions = this.getDatasetDimensions(userInput);
          let yDimensions; let xDimensions;
          let yAxisName = ''; let xAxisName = '';
          if (userInput.yAxisDimension.split(',').length === 1) {
            yDimensions = userInput.yAxisDimension;
            dimensions.push(yDimensions);
            yAxisName = this.getFormattedName(userInput.yAxisDimension);
          } else {
            yDimensions = userInput.yAxisDimension.split(',');
            dimensions = [...dimensions, ...yDimensions];
            yAxisName = '';
          }
          if (userInput.xAxisDimension.split(',').length === 1) {
            xDimensions = userInput.xAxisDimension;
            dimensions.push(xDimensions);
            xAxisName = this.getFormattedName(userInput.xAxisDimension);
          } else {
            xDimensions = userInput.xAxisDimension.split(',');
            dimensions = [...dimensions, ...xDimensions];
            xAxisName = '';
          }
          if (dimensions.indexOf(userInput.groupBy) === -1) {
            dimensions.push(userInput.groupBy)
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Bar or Line chart for Datahub without aggregation', this.chartOption); }
        } // End of Bar,Line Chart without Aggregation for Datahub
        else if (userInput.type === 'scatter') {
          dimensions = this.getDatasetDimensions(userInput);
          if (dimensions.indexOf(userInput.groupBy) === -1) {
            dimensions.push(userInput.groupBy)
          }
          let xAxisName = ''; let yAxisName = '';
          if (userInput.xAxisDimension.split(',').length > 1) {
            xAxisName = '';
          } else {
            xAxisName = this.getFormattedName(userInput.xAxisDimension);
          }
          if (userInput.yAxisDimension.split(',').length > 1) {
            yAxisName = '';
          } else {
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Scatter chart without Aggregation for Datahub', this.chartOption); }
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Pie chart without Aggregation for Datahub', this.chartOption); }
        } // End of Pie chart without Aggregation for Datahub
        else if (userInput.type === 'polar') {
          let yDimensions; let xDimensions;
          if (userInput.yAxisDimension.split(',').length === 1) {
            yDimensions = userInput.yAxisDimension;
            dimensions.push(yDimensions);
          } else {
            yDimensions = userInput.yAxisDimension.split(',');
            dimensions = [...dimensions, ...yDimensions];
          }
          if (userInput.xAxisDimension.split(',').length === 1) {
            xDimensions = userInput.xAxisDimension;
            dimensions.push(xDimensions);
          } else {
            xDimensions = userInput.xAxisDimension.split(',');
            dimensions = [...dimensions, ...xDimensions];
          }
          if (dimensions.indexOf(userInput.groupBy) === -1) {
            dimensions.push(userInput.groupBy)
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Polar chart without Aggregation for Datahub', this.chartOption); }
        }  // End of Polar Chart Without Aggregation for Datahub
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Radar Chart without Aggregation for Datahub', this.chartOption); }
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
          this.serviceData = [this.serviceData.columns, ...this.serviceData.data]
        } else {
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
          let yDimensions; let xDimensions;
          let xAxisName = ''; let yAxisName = '';
          if (this.isDatahubPostCall) {
            dimensions = null;
          } else {
            if (userInput.yAxisDimension.split(',').length === 1) {
              yDimensions = userInput.yAxisDimension;
              dimensions.push(yDimensions);
              yAxisName = this.getFormattedName(userInput.yAxisDimension);
            } else {
              yDimensions = userInput.yAxisDimension.split(',');
              dimensions = [...dimensions, ...yDimensions];
              yAxisName = '';
            }
            if (userInput.xAxisDimension.split(',').length === 1) {
              xDimensions = userInput.xAxisDimension;
              dimensions.push(xDimensions);
              xAxisName = this.getFormattedName(userInput.xAxisDimension);
            } else {
              xDimensions = userInput.xAxisDimension.split(',');
              dimensions = [...dimensions, ...xDimensions];
              xAxisName = '';
            }
            if (dimensions.indexOf(userInput.groupBy) === -1) {
              dimensions.push(userInput.groupBy)
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
                      resultDimensions:
                        resultDimension,
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Aggregate Bar or Line chart', this.chartOption); }
        } // End of Bar,Line Chart with Aggregation for datahub and API
        else if (userInput.type === 'scatter') {
          if (this.isDatahubPostCall) {
            dimensions = null;
          } else {
            dimensions = this.getDatasetDimensions(userInput);
            if (dimensions.indexOf(userInput.groupBy) === -1) {
              dimensions.push(userInput.groupBy)
            }
          }
          let xAxisName = ''; let yAxisName = '';
          if (userInput.xAxisDimension.split(',').length > 1) {
            xAxisName = '';
          } else {
            xAxisName = this.getFormattedName(userInput.xAxisDimension);
          }
          if (userInput.yAxisDimension.split(',').length > 1) {
            yAxisName = '';
          } else {
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          }
          if (isDevMode()) { console.log('Aggregate Scatter chart', this.chartOption); }
        } // End of Scatter Chart with Aggregation for datahub and API
        else if (userInput.type === 'pie') {
          if (this.isDatahubPostCall) {
            dimensions = null;
          } else {
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
                      resultDimensions:
                        resultDimension,
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
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Aggregate Pie chart', this.chartOption); }
        } // End of Pie Chart with Aggregation for datahub and API
        else if (userInput.type === 'polar') {
          let yDimensions; let xDimensions;
          if (this.isDatahubPostCall) {
            dimensions = null;
          } else {
            if (userInput.yAxisDimension.split(',').length === 1) {
              yDimensions = userInput.yAxisDimension;
              dimensions.push(yDimensions);
            } else {
              yDimensions = userInput.yAxisDimension.split(',');
              dimensions = [...dimensions, ...yDimensions];
            }
            if (userInput.xAxisDimension.split(',').length === 1) {
              xDimensions = userInput.xAxisDimension;
              dimensions.push(xDimensions);
            } else {
              xDimensions = userInput.xAxisDimension.split(',');
              dimensions = [...dimensions, ...xDimensions];
            }
            if (dimensions.indexOf(userInput.groupBy) === -1) {
              dimensions.push(userInput.groupBy)
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
                      resultDimensions:
                        resultDimension,
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
                const a =
                  test[0].replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, (str) => { return str.toUpperCase(); })
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
          if (isDevMode()) { console.log('Aggregate Polar chart', this.chartOption); }
        }  // End of Polar Chart with Aggregation for datahub and API
      }  // End of calls for API & Datahub with Aggregation
      // End of chartOptions
    } // End of IF condition checking whether variable serviceData has some data or not
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
      .replace(/^./, (str) => { return str.toUpperCase(); })
    return a.trim();
  }
  getEncodeData(userInput, datasetId?, xDimensions?, yDimensions?) {
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
      }]
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
          }]
        } else {
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
            }
          });
          return xAxisData;
        }// End of else part of XAxisDimension
      } else {
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
          }]
        } else {
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
            }
          });
          return yAxisData;
        }// End of else part of YAxisDimension
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
            dimensionRecord[key].push(item[key])
          }
        });
      });
      const resultARR = Object.values(dimensionRecord)
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
      }]
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
      } else {
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
          }
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
      } else {
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
          }
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
      } else {
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
          }
        }); // end of for block
        return yAxisData;
      }
    }
    else if (userInput.type === 'pie') {
      const convradius = userInput.radius.split(',');
      let roseValue = ''; let sliceStyle;
      if (userInput.layout === 'roseMode') {
        roseValue = 'rose';
      }
      if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius === undefined) {
        sliceStyle = {};
      } else if (userInput.pieBorderWidth > 0 && userInput.pieBorderRadius === undefined) {
        sliceStyle = {
          borderColor: '#fff',
          borderWidth: userInput.pieBorderWidth
        }
      } else if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius > 0) {
        sliceStyle = {
          borderRadius: userInput.pieBorderRadius
        }
      } else {
        sliceStyle = {
          borderRadius: userInput.pieBorderRadius,
          borderColor: '#fff',
          borderWidth: userInput.pieBorderWidth
        }
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
        }]
      } else {
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
          }
        }); // end of for loop
        return xAxisData;
      }// End of else part of XAxisDimension
    } else {
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
        }]
      } else {
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
          }
        });
        return yAxisData;
      }// End of else part of YAxisDimension
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
    }]
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
            dimensionRecord[key].push(item[key])
          }
        });
      });
    } else {
      const indexes = dimensions.map((v, index) => {
        const val = v;
        return { key: val, value: this.serviceData[0].indexOf(v) };
      });
      for (let i = 1; i < this.serviceData.length; i++) {
        indexes.forEach(dataElement => {
          dimensionRecord[dataElement.key].push(this.serviceData[i][dataElement.value]);
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
      }]
    } else {
      return [{
        type: 'radar',
        color: this.colorsForChart,
        data: result1
      }]
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
      indexes.keys.forEach(dataElement => {
        dimensionRecord[dataElement.key].push(item[dataElement.value]);
      });
    });
  }
  // getPieChartSeriesData function is used to create series data for pie chart
  getPieChartSeriesData(userInput) {
    // convert comma separated string userInput.radius to array
    const convradius = userInput.radius.split(',');
    let roseValue = ''; let sliceStyle;
    if (userInput.layout === 'roseMode') {
      roseValue = 'rose';
    }
    if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius === undefined) {
      sliceStyle = {}
    }
    else if (userInput.pieBorderWidth > 0 && userInput.pieBorderRadius === undefined) {
      sliceStyle = {
        borderColor: '#fff',
        borderWidth: userInput.pieBorderWidth
      }
    } else if (userInput.pieBorderWidth === undefined && userInput.pieBorderRadius > 0) {
      sliceStyle = {
        borderRadius: userInput.pieBorderRadius
      }
    } else {
      sliceStyle = {
        borderRadius: userInput.pieBorderRadius,
        borderColor: '#fff',
        borderWidth: userInput.pieBorderWidth
      }
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
        } else {
          nam = item[userInput.pieSlicenName]
        }
        return {
          value: val,
          name: nam,
        }
      }),
    }]
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
    } else {
      const yAxisDimensions = userInput.yAxisDimension.split(',');
      const yAxisData = [];
      yAxisDimensions.forEach((value, i) => {
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
        }
      }); // end of for block
      return yAxisData;
    }
  }
  getChartItemColor(index) {
    if (this.colorsForChart[index] === undefined) {
      return ''
    } else {
      return this.colorsForChart[index];
    }
  }
  // Gets the dimensions for dataset
  getDatasetDimensions(userInput) {
    let yDimensions; let xDimensions; let dimensionArr = [];
    if (userInput.yAxisDimension.split(',').length === 1) {
      yDimensions = userInput.yAxisDimension;
      dimensionArr.push(yDimensions);
    } else {
      yDimensions = userInput.yAxisDimension.split(',');
      dimensionArr = [...dimensionArr, ...yDimensions];
    }
    if (userInput.xAxisDimension.split(',').length === 1) {
      xDimensions = userInput.xAxisDimension;
      dimensionArr.push(xDimensions);
    } else {
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
      values.forEach((data, i) => {
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
    const changedNamesForResult = list.map(({
      aggrDimesnion: from,
      aggrMethod: method
    }) => ({
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
      ]
    } else {
      return [];
    }
  }
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex,  (m, r, g, b)=> {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // tslint:disable-next-line:max-line-length
    return result ? 'rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) + ', ' + 0.8 + ')' : null;
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
    } else {
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
        }
      });// end of for block
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
      } else {
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
  onResized(event: ResizedEvent) {
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