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
import { config } from 'process';
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
      disabled:false
    },
    {
      id: 'category',
      value: 'Category',
      disabled:false

    },
    {
      id: 'time',
      value: 'Time',
      disabled:false
    },
    // {
    //   id: 'log',
    //   value: 'Log',
    //   disabled:false
    // },
  ],

  xAxisType: [
    {
      id: 'value',
      value: 'Value',
      disabled:false
    },
    {
      id: 'category',
      value: 'Category',
      disabled:false

    },
    {
      id: 'time',
      value: 'Time',
      disabled:false
    },
    // {
    //   id: 'log',
    //   value: 'Log',
    //   disabled:false
    // },
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
  userSelectedColor=[];
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
  chartData = chartValues;
  chartLayoutData;
  aggregationMethods;

  isGroupByInAggregate = false;
  isAggrAdded = false;
  @Output() configData: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    this.aggregationMethods = chartValues.aggregateMethod;
    this.config.aggrList = [];
    this.config.legend={};
  }


  // add another stack to the stackList
  // if stackList is empty, add total to the stackList
  // if stackList is not empty, add another stack to the stackList
  stackAdded(stack) {
    this.config.stackList = [];
    if (stack) {
      this.config.stackList.push(new Stack());
      this.config.stackList.push(new Stack());
    } else {
      this.config.stackList.length = 0;
    }
  }
  yAxisDimensionUpdate(val){
console.log(val,this.config.yAxisDimension)
  }
  deleteStackValue(stack, index) {
    this.config.stackList.splice(index, 1);
  }

  // updateStack is called when the user changes the type of chart
  // updateStack is called when the user changes the layout of the chart
  // updateStack is called when the user changes the data source of the chart
  updateStack() {
    if (this.config.apiUrl) {
      if (this.config.type === 'bar') {
        if (this.config.layout === 'stackedBar') {
          if (this.config.stackList.length === 0) {
            this.config.stack = 'total';
          } else if (this.config.stackList.length > 0) {
            this.config.stack = this.config.stackList;
          } else {
            this.config.stack = '';
          }
        }
      }
      if (this.config.type === 'line') {
        if (this.config.layout === 'stackedLine') {
          if (this.config.stackList.length === 0) {
            this.config.stack = 'total';
          } else if (this.config.stackList.length > 0) {
            this.config.stack = this.config.stackList;
          } else {
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
  colorUpdate(colorSelected){
    this.userSelectedColor = [...this.userSelectedColor,colorSelected];
    this.config.colors = this.userSelectedColor.join(',')
  }
  colorUpdateByTyping(colorTyped){
    let joinedArr = [...this.userSelectedColor,...colorTyped.split(',')];
    this.userSelectedColor = [...new Set([...joinedArr])]
    
  }
  onSelection(value) {
    this.chartData.chartLayout.filter(val => {
      if (value === val.id) {
        this.chartLayoutData = val.layout;
      }
    })
    this.config.addStack = false;

  }
  onLayoutSelection(value) {
    if(value==='simpleBar' || value==='stackedBar'|| value==='simple'||value==='stacked' ||value==='simpleScatter'){
      for(const val of this.chartData.yAxisType){
        if(val.id==='category'){
          val.disabled=true;
        }
      }
      for(const val of this.chartData.xAxisType){
        if(val.id==='category'){
          val.disabled=false;
        }
      }
    }else if(value==='simpleHorizontalBar' || value==='stackedHorizontalBar' || value ==='horizontalScatter'){
      for(const val of this.chartData.yAxisType){
        if(val.id==='category'){
          val.disabled=false;
        }
      }
      for(const val of this.chartData.xAxisType){
        if(val.id==='category'){
          val.disabled=true;
        }
      }
    }
  }

  dataSourceSelection(value) {
    if (value === 'API') {
      this.config.showApiInput = true;
      this.config.showDatahubInput = false;

    } else if (value === 'datahub') {
      this.config.showDatahubInput = true;
      this.config.showApiInput = false;

    } else {
      this.config.showApiInput = false;
      this.config.showDatahubInput = false;
    }
  }

  // if onSelection, onLayoutSelection, dataSourceSelection is called, then submit data and emit config
  SubmitData() {
    this.config.aggrList.filter(element => {
      if (element.aggrDimesnion === this.config.groupBy) {
        this.isGroupByInAggregate = true;
      } else {
        this.isGroupByInAggregate = false;
      }
    });
    if (this.config.area === true) {
      this.config.area = {};
    }else {
      this.config.area = null;
    }
    if (!this.isGroupByInAggregate) {
      this.configData.emit(this.config);
    }

  }

}
