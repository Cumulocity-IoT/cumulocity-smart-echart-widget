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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregateData, Stack } from '../model/config.modal';
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
export class SmartChartConfigComponent {
    constructor() {
        this.flag = false;
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
    // if onSelection, onLayoutSelection, dataSourceSelection is called, then submit data and emit config
    SubmitData() {
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
                selector: 'lib-smart-chart-config',
                template: "<div class=\"form-group\">\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <!-- <div class=\"col-xs-5 col-md-5\">\r\n            <label for=\"title\">Chart Title</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        </div> -->\r\n        <div class=\"col-xs-5 col-md-5\">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <!-- <form> -->\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                    <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                        (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                </label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                    <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                        (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                        placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n        <!-- </form> -->\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n\r\n            <ng-container *ngIf=\"config.showApiInput\">\r\n                <div class=\"col-xs-6 col-md-6\">\r\n                    <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n                </div>\r\n            </ng-container>\r\n\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <ng-container *ngIf=\"config.showDatahubInput\">\r\n                    <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n                    <div>\r\n                        <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                            [(ngModel)]=\"config.sqlQuery\">\r\n                        </textarea>\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-5 col-md-5\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-5 col-md-5\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type=='pie'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"listname\">PieSliceValue</label>\r\n                <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n            </div>\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"listname\">PieSliceName</label>\r\n                <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n            </div>\r\n        </div>\r\n        <!-- Pie chart options -->\r\n        <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"radius\">Pie Radius</label>\r\n                <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-12 col-xs-12\" *ngIf=\"config.type==='pie'\">\r\n            <label for=\"pieConfig\">Pie Slice Config</label>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type==='pie'\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"pieBorderRadius\">Border Radius</label>\r\n                <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\"\r\n                    value=\"0\" [(ngModel)]=\"config.pieBorderRadius\">\r\n            </div>\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"pieBorderWidth\">Border Width</label>\r\n                <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\"\r\n                    value=\"0\" [(ngModel)]=\"config.pieBorderWidth\">\r\n            </div>\r\n        </div>\r\n        <!-- Line Chart configurations for Area Line Chart and Smooth Line Chart -->\r\n        <div *ngIf=\"config.type==='line'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label title=\"Area\" class=\"c8y-checkbox\">\r\n                    <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                    <span></span>\r\n                    <span>Area</span>\r\n                </label>\r\n            </div>\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n                    <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                    <span></span>\r\n                    <span>Smooth Line</span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is pie or radar -->\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie'\">\r\n            <div class=\"form-group col-xs-5 col-md-5\" *ngIf=\"config.type!=='polar'\">\r\n                <label for=\"xAxisType\">X-Axis Type</label>\r\n                <div class=\"c8y-select-wrapper\">\r\n                    <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                        <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                            {{type.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n                <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n            <div class=\"form-group col-md-5 col-xs-5\" *ngIf=\"config.type!=='polar'\">\r\n                <label for=\"yAxisType\">Y-Axis Type</label>\r\n                <div class=\"c8y-select-wrapper\">\r\n                    <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                        <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                            {{type.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n                <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\">\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type=='radar'\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label for=\"radarDimensions\">Radar Dimensions</label>\r\n                <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n            </div>\r\n        </div>\r\n        <!-- Dropdown for Aggregation / group by methods  -->\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\"\r\n            *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n            <div class=\"col-xs-6 col-md-6 row\">\r\n                <div class=\"col-xs-4 col-md-4\">\r\n                    <label for=\"aggregation\">Aggregate Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <label for=\"aggregateDimension\">Dimension </label>\r\n                    </div>\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                            [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                            [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                    </div>\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <label for=\"aggregation\">Method</label>\r\n                    </div>\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                            [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                            <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                            </option>\r\n                        </select>\r\n                    </div>\r\n                    <div class=\"col-xs-2 col-md-2 \">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <label for=\"groupByDimension\">Group By</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- Dropdown for Legend Icon -->\r\n        <div class=\"form-group col-xs-12 col-md-12 row\">\r\n            <div class=\"col-md-5 col-xs-5\">\r\n                <label for=\"legend\">Legend Shape</label>\r\n                <div class=\"c8y-select-wrapper\">\r\n                    <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                        <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                            {{legendType.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- For scatter bubble size -->\r\n        <div *ngIf=\"config.type==='scatter'\" class=\"col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-5 col-md-5\">\r\n                <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n                <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                    [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n            </div>\r\n        </div>\r\n        <!-- stack container -->\r\n        <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\"\r\n            class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                        <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                            (click)=\"stackAdded($event.target.checked)\">\r\n                        <span></span>\r\n                        <span>Add Stack</span>\r\n                    </label>\r\n                </div>\r\n                <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                    <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                        Another Stack</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div *ngIf=\"config.addStack\">\r\n                <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                    <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                        <div class=\"col-md-2 col-xs-2\">\r\n                            <label for=\"stackName\">Stack Name</label>\r\n                        </div>\r\n                        <div class=\"col-md-2 col-xs-2\">\r\n                            <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                                [(ngModel)]=\"config.stackList[i].stackName\">\r\n                        </div>\r\n                        <div class=\"col-md-2 col-xs-2\">\r\n                            <label for=\"stackValues\">Stack Values</label>\r\n                        </div>\r\n                        <div class=\"col-md-2 col-xs-2\">\r\n                            <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                                [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                        </div>\r\n                        <div class=\"col-md-2 col-xs-2\">\r\n                            <button class=\"btn btn-primary btn-xs btn-danger\"\r\n                                (click)=\"deleteStackValue($event,i)\">Delete\r\n                                Stack</button>\r\n                        </div>\r\n                    </div>\r\n                </ng-container>\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\"\r\n            class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"form-group col-xs-5 col-md-5\">\r\n                <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n                    <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                    <span></span>\r\n                    <span>Slider Zoom</span>\r\n                </label>\r\n            </div>\r\n            <div class=\"form-group col-xs-5 col-md-5\">\r\n                <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n                    <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                    <span></span>\r\n                    <span>Box Zoom</span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n    </div>",
                styles: [".alertInput{border:2px solid red}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFD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Q0FBQztJQUVELHFHQUFxRztJQUNyRyxVQUFVO1FBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BDLElBQUksT0FBTyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDakQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDdkI7YUFBSztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO0lBRUgsQ0FBQzs7O1lBdExGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyw2b2lCQUFrRDs7YUFFbkQ7Ozs7cUJBTUUsS0FBSzt5QkFtQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICdwcm9jZXNzJztcclxuaW1wb3J0IHsgQWdncmVnYXRlRGF0YSwgQ2hhcnRDb25maWcsIFN0YWNrIH0gZnJvbSAnLi4vbW9kZWwvY29uZmlnLm1vZGFsJztcclxuY29uc3QgY2hhcnRWYWx1ZXMgPSB7XHJcbiAgY2hhcnRUeXBlOiBbXHJcblxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIHZhbHVlOiAnQmFyIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgdmFsdWU6ICdMaW5lIENoYXJ0JyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncGllJyxcclxuICAgICAgdmFsdWU6ICdQaWUgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3JhZGFyJyxcclxuICAgICAgdmFsdWU6ICdSYWRhciBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICB2YWx1ZTogJ1BvbGFyIGNoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgdmFsdWU6ICdTY2F0dGVyIENoYXJ0J1xyXG4gICAgfVxyXG4gIF0sXHJcbiAgY2hhcnRMYXlvdXQ6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgTGluZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZCcsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgTGluZSBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdMaW5lJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdCYXInXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVIb3Jpem9udGFsQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEhvcml6b250YWwgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkSG9yaXpvbnRhbEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgSG9yaXpvbnRhbCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BpZScsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlUGllJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFBpZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAncm9zZU1vZGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdSb3NlIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFNjYXR0ZXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2hvcml6b250YWxTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnSG9yaXpvbnRhbCBTY2F0dGVyIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgeUF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcblxyXG4gIHhBeGlzVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3ZhbHVlJyxcclxuICAgICAgdmFsdWU6ICdWYWx1ZScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NhdGVnb3J5JyxcclxuICAgICAgdmFsdWU6ICdDYXRlZ29yeScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcblxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICd0aW1lJyxcclxuICAgICAgdmFsdWU6ICdUaW1lJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgIGlkOiAnbG9nJyxcclxuICAgIC8vICAgdmFsdWU6ICdMb2cnLFxyXG4gICAgLy8gICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgLy8gfSxcclxuICBdLFxyXG4gIGxlZ2VuZFR5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2NpcmNsZScsXHJcbiAgICAgIHZhbHVlOiAnQ2lyY2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3JlY3QnLFxyXG4gICAgICB2YWx1ZTogJ1JlY3RhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdyb3VuZFJlY3QnLFxyXG4gICAgICB2YWx1ZTogJ1JvdW5kIFJlY3RhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICd0cmlhbmdsZScsXHJcbiAgICAgIHZhbHVlOiAnVHJpYW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAnZGlhbW9uZCcsXHJcbiAgICAgIHZhbHVlOiAnRGlhbW9uZCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdhcnJvdycsXHJcbiAgICAgIHZhbHVlOiAnQXJyb3cnXHJcbiAgICB9XHJcbiAgXSxcclxuICBhZ2dyZWdhdGVNZXRob2Q6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdzdW0nLFxyXG4gICAgICB2YWx1ZTogJ1N1bSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY291bnQnLFxyXG4gICAgICB2YWx1ZTogJ0NvdW50J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdRMScsXHJcbiAgICAgIHZhbHVlOiAnUTEnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21lZGlhbicsXHJcbiAgICAgIHZhbHVlOiAnUTIgLyBNZWRpYW4nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1EzJyxcclxuICAgICAgdmFsdWU6ICdRMydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnZmlyc3QnLFxyXG4gICAgICB2YWx1ZTogJ0ZpcnN0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdhdmVyYWdlJyxcclxuICAgICAgdmFsdWU6ICdBdmVyYWdlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtaW4nLFxyXG4gICAgICB2YWx1ZTogJ01pbidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWF4JyxcclxuICAgICAgdmFsdWU6ICdNYXgnXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgbGlzdE5hbWU6ICcnLFxyXG59XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLXNtYXJ0LWNoYXJ0LWNvbmZpZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3NtYXJ0LWNoYXJ0LWNvbmZpZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gIGZsYWcgPSBmYWxzZTtcclxuICBASW5wdXQoKSBjb25maWc6IENoYXJ0Q29uZmlnID0ge1xyXG4gICAgbGlzdE5hbWU6ICcnLFxyXG4gICAgdGl0bGU6ICcnLFxyXG4gICAgcGllU2xpY2VuTmFtZTogJycsXHJcbiAgICBwaWVTbGljZVZhbHVlOiAnJyxcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgbGF5b3V0OiAnJyxcclxuICAgIGRhdGFTb3VyY2U6ICcnLFxyXG4gICAgZGF0YVNvdXJjZVZhbHVlOiAnJyxcclxuICAgIHhBeGlzOiAnJyxcclxuICAgIHlBeGlzOiAnJyxcclxuICAgIHNtb290aExpbmU6IGZhbHNlLFxyXG4gICAgYXBpVXJsOiAnJyxcclxuICAgIGFyZWE6IGZhbHNlLFxyXG4gICAgeUF4aXNEaW1lbnNpb246ICcnLFxyXG4gICAgcmFkYXJEaW1lbnNpb25zOiAnJyxcclxuICAgIGFkZFN0YWNrOiBmYWxzZSxcclxuICAgIHNob3dBcGlJbnB1dDogZmFsc2UsXHJcbiAgICBzdGFjazogW10sXHJcbiAgICBzdGFja0xpc3Q6IFN0YWNrWycnXSxcclxuICAgIGFnZ3JBcnI6IFtdLFxyXG4gICAgYWdnckxpc3Q6IEFnZ3JlZ2F0ZURhdGFbJyddLFxyXG4gICAgbGVnZW5kOiB7XHJcbiAgICAgIGljb246ICcnLFxyXG4gICAgICB3aWR0aDogMzMwLFxyXG4gICAgICB0eXBlOiAnc2Nyb2xsJ1xyXG4gICAgfSxcclxuICAgIHJhZGl1czogW11cclxuICB9O1xyXG4gIGNoYXJ0RGF0YSA9IGNoYXJ0VmFsdWVzO1xyXG4gIGNoYXJ0TGF5b3V0RGF0YTtcclxuICBhZ2dyZWdhdGlvbk1ldGhvZHM7XHJcblxyXG4gIGlzR3JvdXBCeUluQWdncmVnYXRlID0gZmFsc2U7XHJcbiAgaXNBZ2dyQWRkZWQgPSBmYWxzZTtcclxuICBAT3V0cHV0KCkgY29uZmlnRGF0YTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFnZ3JlZ2F0aW9uTWV0aG9kcyA9IGNoYXJ0VmFsdWVzLmFnZ3JlZ2F0ZU1ldGhvZDtcclxuICAgIHRoaXMuY29uZmlnLmFnZ3JMaXN0ID0gW107XHJcbiAgICB0aGlzLmNvbmZpZy5sZWdlbmQ9e307XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gYWRkIGFub3RoZXIgc3RhY2sgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIC8vIGlmIHN0YWNrTGlzdCBpcyBlbXB0eSwgYWRkIHRvdGFsIHRvIHRoZSBzdGFja0xpc3RcclxuICAvLyBpZiBzdGFja0xpc3QgaXMgbm90IGVtcHR5LCBhZGQgYW5vdGhlciBzdGFjayB0byB0aGUgc3RhY2tMaXN0XHJcbiAgc3RhY2tBZGRlZChzdGFjaykge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0ID0gW107XHJcbiAgICBpZiAoc3RhY2spIHtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlbGV0ZVN0YWNrVmFsdWUoc3RhY2ssIGluZGV4KSB7XHJcbiAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIHR5cGUgb2YgY2hhcnRcclxuICAvLyB1cGRhdGVTdGFjayBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBsYXlvdXQgb2YgdGhlIGNoYXJ0XHJcbiAgLy8gdXBkYXRlU3RhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgZGF0YSBzb3VyY2Ugb2YgdGhlIGNoYXJ0XHJcbiAgdXBkYXRlU3RhY2soKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYXBpVXJsKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy50eXBlID09PSAnYmFyJykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXlvdXQgPT09ICdzdGFja2VkQmFyJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAndG90YWwnO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9IHRoaXMuY29uZmlnLnN0YWNrTGlzdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcubGF5b3V0ID09PSAnc3RhY2tlZExpbmUnKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICd0b3RhbCc7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gdGhpcy5jb25maWcuc3RhY2tMaXN0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZEFub3RoZXJTdGFjaygpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICB9XHJcbiAgYWRkQW5vdGhlckFnZ3JlZ2F0ZSgpIHtcclxuICAgIHRoaXMuaXNBZ2dyQWRkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QucHVzaChuZXcgQWdncmVnYXRlRGF0YSgpKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUFnZ3JWYWx1ZShhZ2dyLCBpbmRleCkge1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hZ2dyTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5pc0FnZ3JBZGRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5jaGFydERhdGEuY2hhcnRMYXlvdXQuZmlsdGVyKHZhbCA9PiB7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gdmFsLmlkKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydExheW91dERhdGEgPSB2YWwubGF5b3V0O1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy5jb25maWcuYWRkU3RhY2sgPSBmYWxzZTtcclxuXHJcbiAgfVxyXG4gIG9uTGF5b3V0U2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZih2YWx1ZT09PSdzaW1wbGVCYXInIHx8IHZhbHVlPT09J3N0YWNrZWRCYXInfHwgdmFsdWU9PT0nc2ltcGxlJ3x8dmFsdWU9PT0nc3RhY2tlZCcgfHx2YWx1ZT09PSdzaW1wbGVTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3IoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSl7XHJcbiAgICAgICAgaWYodmFsLmlkPT09J2NhdGVnb3J5Jyl7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9ZWxzZSBpZih2YWx1ZT09PSdzaW1wbGVIb3Jpem9udGFsQmFyJyB8fCB2YWx1ZT09PSdzdGFja2VkSG9yaXpvbnRhbEJhcicgfHwgdmFsdWUgPT09J2hvcml6b250YWxTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS54QXhpc1R5cGUpe1xyXG4gICAgICAgIGlmKHZhbC5pZD09PSdjYXRlZ29yeScpe1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkYXRhU291cmNlU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09ICdBUEknKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZGF0YWh1YicpIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBvblNlbGVjdGlvbiwgb25MYXlvdXRTZWxlY3Rpb24sIGRhdGFTb3VyY2VTZWxlY3Rpb24gaXMgY2FsbGVkLCB0aGVuIHN1Ym1pdCBkYXRhIGFuZCBlbWl0IGNvbmZpZ1xyXG4gIFN1Ym1pdERhdGEoKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LmFnZ3JEaW1lc25pb24gPT09IHRoaXMuY29uZmlnLmdyb3VwQnkpIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFyZWEgPT09IHRydWUpIHtcclxuICAgICAgdGhpcy5jb25maWcuYXJlYSA9IHt9O1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5hcmVhID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSkge1xyXG4gICAgICB0aGlzLmNvbmZpZ0RhdGEuZW1pdCh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19