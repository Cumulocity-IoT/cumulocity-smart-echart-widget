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
import { Component, EventEmitter, Input, OnInit, Output, Pipe } from '@angular/core';
import { AggregateData, ChartConfig, Stack } from '../model/config.modal';
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
        },
        {
          id: 'angleAxisBar',
          value: 'Angle Axis Polar'
        },
        {
          id: 'radiusAxisBar',
          value: 'Radius Axis Bar'
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
    }
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
}
@Component({
  selector: 'lib-smart-chart-config',
  templateUrl: './smart-chart-config.component.html',
  styleUrls: ['./smart-chart-config.component.css']
})
export class SmartChartConfigComponent implements OnInit {
  constructor() { }
  flag = false;
  userSelectedColor = [];
  @Input() config: ChartConfig = {
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
    yAxisDimension: '',
    radarDimensions: '',
    // addStack: false,
    showApiInput: false,
    darkMode: false,
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
  chartData = chartValues;
  chartLayoutData;
  aggregationMethods;
  isGroupByInAggregate = false;
  isAggrAdded = false;
  @Output() configData: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    this.aggregationMethods = chartValues.aggregateMethod;
    if (!this.config.aggrList) {
      this.config.aggrList = [];
    } else {
      this.isAggrAdded = true;
    }
    if (!this.config.stackList) {
      this.config.stackList = [];
    } else {
      this.config.addStack = true;
    }
    this.config.legend = {};
    // Default value for datahub sql query
    if (this.config.datahubUrl === null || this.config.datahubUrl === undefined) {
      this.config.datahubUrl = 'service/datahub/sql?version=v1';
    }
    if (this.config.sqlLimit === null || this.config.sqlLimit === undefined) {
      this.config.sqlLimit = 100;
    }
    // To initialize the chart layout dropdown
    this.onSelection(this.config.type);
    if (this.config.hasArea !== '') {
      this.config.area = false;
    }
  }
  // add another stack to the stackList
  // if stackList is empty, add total to the stackList
  // if stackList is not empty, add another stack to the stackList
  stackAdded(stack) {
    if (stack) {
      this.config.addStack = stack;
      this.config.stackList = [];
      this.config.stackList.push(new Stack());
      this.config.stackList.push(new Stack());
    } else {
      this.config.addStack = stack;
      this.config.stackList.length = 0;
    }
  }
  // called when Y Axis Dimension is updated
  yAxisDimensionUpdate(val) {
  }
  // Delete a stack entry for stack data chart
  deleteStackValue(stack, index) {
    this.config.stackList.splice(index, 1);
    if (this.config.stackList.length === 0) {
      this.config.addStack = false;
    }
  }
  // Add a stack entry for stack data chart
  addAnotherStack() {
    this.config.stackList.push(new Stack());
  }
  // Add an aggregate method
  addAnotherAggregate() {
    this.isAggrAdded = true;
    this.config.aggrList.push(new AggregateData());
  }
  // Delete Aggregate Method
  deleteAggrValue(aggr, index) {
    this.config.aggrList.splice(index, 1);
    if (this.config.aggrList.length === 0) {
      this.isAggrAdded = false;
    }
  }
  // Update the colors input from color picker
  colorUpdate(colorSelected) {
    this.userSelectedColor = [...this.userSelectedColor, colorSelected];
    this.config.colors = this.userSelectedColor.join(',')
  }
  // Update the colors input from color input box
  colorUpdateByTyping(colorTyped) {
    const joinedArr = [...this.userSelectedColor, ...colorTyped.split(',')];
    this.userSelectedColor = [...new Set([...joinedArr])]
  }
  // On selection of a chart type, bind the corresponding layout values to input dropdown on UI
  onSelection(value) {
    if (sessionStorage.getItem('chartType')) {
      if (this.config.type !== sessionStorage.getItem('chartType')) {
        sessionStorage.setItem('chartType', this.config.type);
        this.chartData.chartLayout.filter(val => {
          if (value === val.id) {
            this.chartLayoutData = val.layout;
            this.config.layout = val.layout[0].id;
          }
        });
      } else {
        this.chartData.chartLayout.filter(val => {
          if (value === val.id) {
            this.chartLayoutData = val.layout;
            return;
          }
        });
      }
    } else {
      sessionStorage.setItem('chartType', this.config.type);
    }
    if (this.config.type === 'bar' || this.config.type === 'line') {
    } else {
      this.config.addStack = false;
      this.config.stackList.length = 0;
    }
    if (value === 'polar') {
      for (const val of this.chartData.xAxisType) {
        if (val.id === 'time') {
          val.disabled = true;
        }
      }
    }
  }
  // On selection of a chart layout,enable/disable certain dimension type
  onLayoutSelection(value) {
    if (value === 'stackedBar' || value === 'stacked') {
    } else {
      this.config.addStack = false;
      this.config.stackList.length = 0;
    }
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
    } else if (value === 'simpleHorizontalBar' || value === 'stackedHorizontalBar' || value === 'horizontalScatter') {
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
  // Set the flag based on datasource
  dataSourceSelection(value) {
    if (value === 'API') {
      this.config.showApiInput = true;
      this.config.showDatahubInput = false;
      this.config.showMicroserviceInput = false;
    } else if (value === 'datahub') {
      this.config.showDatahubInput = true;
      this.config.showApiInput = false;
      this.config.showMicroserviceInput = false;
    }else if (value === 'microservice') {
      this.config.showMicroserviceInput = true;
      this.config.showApiInput = false;
      this.config.showDatahubInput = false;
    } else {
      this.config.showApiInput = false;
      this.config.showDatahubInput = false;
      this.config.showMicroserviceInput = false;
    }
  }
  // This code is commented as it is needed for localhost testing.
  // if onSelection, onLayoutSelection, dataSourceSelection is called, then submit data and emit config
  // SubmitData() {
  //   this.config.aggrList.filter(element => {
  //     if (element.aggrDimesnion === this.config.groupBy) {
  //       this.isGroupByInAggregate = true;
  //     } else {
  //       this.isGroupByInAggregate = false;
  //     }
  //   });
  //   if (this.config.area === true) {
  //     if (this.config.areaOpacity == null) {
  //       this.config.area = {};
  //     } else {
  //       this.config.area = {
  //         opacity: this.config.areaOpacity
  //       };
  //     }
  //   } else {
  //     this.config.area = null;
  //   }
  //   if (!this.isGroupByInAggregate) {
  //     this.configData.emit(this.config);
  //   }
  // }
}
