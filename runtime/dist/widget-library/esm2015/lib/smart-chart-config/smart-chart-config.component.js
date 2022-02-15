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
        this.userSelectedColor = [];
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
    yAxisDimensionUpdate(val) {
        console.log(val, this.config.yAxisDimension);
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
    colorUpdate(colorSelected) {
        this.userSelectedColor = [...this.userSelectedColor, colorSelected];
        this.config.colors = this.userSelectedColor.join(',');
    }
    colorUpdateByTyping(colorTyped) {
        let joinedArr = [...this.userSelectedColor, ...colorTyped.split(',')];
        this.userSelectedColor = [...new Set([...joinedArr])];
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
            if (this.config.areaOpacity == null) {
                this.config.area = {};
            }
            else {
                this.config.area = {
                    'opacity': this.config.areaOpacity
                };
            }
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
                template: "<div class=\"form-group\">\r\n    <div class=\"form-group\">\r\n        <div>\r\n            <label class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n                Source\r\n            </label>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                    <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                        (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                </label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                    <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                        (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                        placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n                </label>\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n            <ng-container *ngIf=\"config.showApiInput\">\r\n                <div class=\"col-xs-6 col-md-6\">\r\n                    <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n                </div>\r\n            </ng-container>\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <ng-container *ngIf=\"config.showDatahubInput\">\r\n                    <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n                    <div>\r\n                        <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                            [(ngModel)]=\"config.sqlQuery\">\r\n                        </textarea>\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <!-- <div class=\"col-xs-5 col-md-5\">\r\n            <label for=\"title\">Chart Title</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        </div> -->\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-6 col-md-6\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type=='pie'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n    <!-- Pie chart options -->\r\n    <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"radius\">Pie Radius</label>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n    </div>\r\n    <div class=\"col-md-12 col-xs-12\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"pieConfig\">Pie Slice Config</label>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type==='pie'\">\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderRadius\">\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n    </div>\r\n    <!-- Line Chart configurations for Area Line Chart and Smooth Line Chart -->\r\n    <div *ngIf=\"config.type==='line'\" class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label title=\"Area\" class=\"c8y-checkbox\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                <span></span>\r\n                <span>Area</span>\r\n            </label>\r\n        </div>\r\n\r\n        <div class=\"col-xs-4 col-md-4\">\r\n            <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                <span></span>\r\n                <span>Smooth Line</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <div class=\"col-xs-4 col-md-4\">\r\n                <label title=\"Area Opacity\">Area Opacity</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input type=\"number\" [(ngModel)]=\"config.areaOpacity\" min=\"0\" max=\"1\" step=\"0.1\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- dont show div if config.type is pie or radar -->\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie'\">\r\n        <div class=\"form-group col-xs-6 col-md-6\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n        <div class=\"form-group col-xs-6 col-md-6\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type=='radar'\">\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"radarDimensions\">Radar Dimensions</label>\r\n            <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"RadarRadius\">Radar Chart radius</label>\r\n            <input class=\"form-control\" name=\"RadarRadius\" type=\"text\" [(ngModel)]=\"config.radarChartRadius\">\r\n        </div>\r\n    </div>\r\n    <!-- Dropdown for Aggregation / group by methods  -->\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\"\r\n        *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n        <div class=\"col-xs-6 col-md-6 row\">\r\n            <div class=\"col-xs-4 col-md-4\">\r\n                <label for=\"aggregation\">Aggregate Method</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <label for=\"aggregateDimension\">Dimension </label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                        [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <label for=\"aggregation\">Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                        <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2 \">\r\n                    <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label for=\"groupByDimension\">Group By</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- Font size and roatation for labels -->\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"form-group col-xs-6 col-md-6\">\r\n            <label for=\"fontSize\">Font Size</label>\r\n            <input name=\"fontSize\" [(ngModel)]=\"config.fontSize\" type=\"range\" min=\"8\" max=\"20\" step=\"1\"/>\r\n        </div>\r\n    </div>\r\n    <!-- Rotate Labels for X and Y Axis -->\r\n    <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"form-group col-xs-6 col-md-6\">\r\n            <label for=\"xrotateLabels\">X-Axis Rotate Labels</label>\r\n            <input name=\"xrotateLabels\" [(ngModel)]=\"config.xAxisRotateLabels\" type=\"range\" min=\"8\" max=\"20\" step=\"1\"/>\r\n            <output style=\"margin-top: 30px;\">{{config.xAxisRotateLabels}}</output>\r\n        </div>\r\n        <div class=\"col-xs-6 col-md-6\">\r\n            <label for=\"yrotateLabels\">Y-Axis Rotate Labels</label>\r\n            <input name=\"yrotateLabels\" [(ngModel)]=\"config.yAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\" step=\"1\"/>\r\n            <output style=\"margin-top: 30px;\">{{config.yAxisRotateLabels}}</output>\r\n        </div>\r\n    </div>\r\n    <!-- Dropdown for Legend Icon -->\r\n    <div class=\"form-group col-xs-12 col-md-12 row\">\r\n        <div class=\"col-md-6 col-xs-6\">\r\n            <label for=\"legend\">Legend Shape</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                    <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                        {{legendType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- For scatter bubble size -->\r\n    <div *ngIf=\"config.type==='scatter'\" class=\"col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"col-xs-5 col-md-5\">\r\n            <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n            <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n        </div>\r\n    </div>\r\n    <!-- stack container -->\r\n    <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\"\r\n        class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                    <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                        (click)=\"stackAdded($event.target.checked)\">\r\n                    <span></span>\r\n                    <span>Add Stack</span>\r\n                </label>\r\n            </div>\r\n            <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackName\">Stack Name</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackValues\">Stack Values</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <!-- <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                    <div class=\"col-xs-2 col-md-2\">\r\n                        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n                    </div>\r\n                </div> -->\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\"\r\n        class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n        <div class=\"form-group col-xs-5 col-md-5\">\r\n            <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                <span></span>\r\n                <span>Slider Zoom</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"form-group col-xs-5 col-md-5\">\r\n            <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                <span></span>\r\n                <span>Box Zoom</span>\r\n            </label>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\">\r\n    <div class=\"col-xs-5 col-md-5\">\r\n        <label title=\"Chart Color\" for=\"chartColor\">Chart Color</label>\r\n        <input type=\"text\" name=\"chartColor\" [(ngModel)]=\"config.colors\"\r\n            (change)=\"colorUpdateByTyping($event.target.value)\">\r\n        <input class=\"form-control\" type=\"color\" placeholder=\"Enter color HEX\"\r\n            (change)=\"colorUpdate($event.target.value)\">\r\n    </div>\r\n</div>\r\n<!-- <div>\r\n        <input type=\"submit\" (click)=\"SubmitData()\" value=\"Submit\" />\r\n    </div> -->",
                styles: [".alertInput{border:2px solid red}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFD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QUFDO2dCQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUc7b0JBQ2pCLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7aUJBQ25DLENBQUM7YUFDSDtTQUdGO2FBQUs7WUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQztJQUVILENBQUM7OztZQTFNRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsNGptQkFBa0Q7O2FBRW5EOzs7O3FCQU9FLEtBQUs7eUJBbUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29weXJpZ2h0IChjKSAyMDIxIFNvZnR3YXJlIEFHLCBEYXJtc3RhZHQsIEdlcm1hbnkgYW5kL29yIGl0cyBsaWNlbnNvcnNcclxuICpcclxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAncHJvY2Vzcyc7XHJcbmltcG9ydCB7IEFnZ3JlZ2F0ZURhdGEsIENoYXJ0Q29uZmlnLCBTdGFjayB9IGZyb20gJy4uL21vZGVsL2NvbmZpZy5tb2RhbCc7XHJcbmNvbnN0IGNoYXJ0VmFsdWVzID0ge1xyXG4gIGNoYXJ0VHlwZTogW1xyXG5cclxuICAgIHtcclxuICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICB2YWx1ZTogJ0JhciBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgIHZhbHVlOiAnTGluZSBDaGFydCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BpZScsXHJcbiAgICAgIHZhbHVlOiAnUGllIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdyYWRhcicsXHJcbiAgICAgIHZhbHVlOiAnUmFkYXIgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BvbGFyJyxcclxuICAgICAgdmFsdWU6ICdQb2xhciBjaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc2NhdHRlcicsXHJcbiAgICAgIHZhbHVlOiAnU2NhdHRlciBDaGFydCdcclxuICAgIH1cclxuICBdLFxyXG4gIGNoYXJ0TGF5b3V0OiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIExpbmUgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWQnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIExpbmUgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BvbGFyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgICAgIHZhbHVlOiAnTGluZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnQmFyJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZUJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWRCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlSG9yaXpvbnRhbEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBIb3Jpem9udGFsIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZEhvcml6b250YWxCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIEhvcml6b250YWwgQmFyIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwaWUnLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZVBpZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBQaWUgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3Jvc2VNb2RlJyxcclxuICAgICAgICAgIHZhbHVlOiAnUm9zZSBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc2NhdHRlcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlU2NhdHRlcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBTY2F0dGVyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdob3Jpem9udGFsU2NhdHRlcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ0hvcml6b250YWwgU2NhdHRlciBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdLFxyXG4gIHlBeGlzVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3ZhbHVlJyxcclxuICAgICAgdmFsdWU6ICdWYWx1ZScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NhdGVnb3J5JyxcclxuICAgICAgdmFsdWU6ICdDYXRlZ29yeScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcblxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICd0aW1lJyxcclxuICAgICAgdmFsdWU6ICdUaW1lJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgIGlkOiAnbG9nJyxcclxuICAgIC8vICAgdmFsdWU6ICdMb2cnLFxyXG4gICAgLy8gICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgLy8gfSxcclxuICBdLFxyXG5cclxuICB4QXhpc1R5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICd2YWx1ZScsXHJcbiAgICAgIHZhbHVlOiAnVmFsdWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjYXRlZ29yeScsXHJcbiAgICAgIHZhbHVlOiAnQ2F0ZWdvcnknLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG5cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndGltZScsXHJcbiAgICAgIHZhbHVlOiAnVGltZScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICB9LFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICBpZDogJ2xvZycsXHJcbiAgICAvLyAgIHZhbHVlOiAnTG9nJyxcclxuICAgIC8vICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIC8vIH0sXHJcbiAgXSxcclxuICBsZWdlbmRUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdjaXJjbGUnLFxyXG4gICAgICB2YWx1ZTogJ0NpcmNsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdyZWN0JyxcclxuICAgICAgdmFsdWU6ICdSZWN0YW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAncm91bmRSZWN0JyxcclxuICAgICAgdmFsdWU6ICdSb3VuZCBSZWN0YW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAndHJpYW5nbGUnLFxyXG4gICAgICB2YWx1ZTogJ1RyaWFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2RpYW1vbmQnLFxyXG4gICAgICB2YWx1ZTogJ0RpYW1vbmQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAnYXJyb3cnLFxyXG4gICAgICB2YWx1ZTogJ0Fycm93J1xyXG4gICAgfVxyXG4gIF0sXHJcbiAgYWdncmVnYXRlTWV0aG9kOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc3VtJyxcclxuICAgICAgdmFsdWU6ICdTdW0nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NvdW50JyxcclxuICAgICAgdmFsdWU6ICdDb3VudCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUTEnLFxyXG4gICAgICB2YWx1ZTogJ1ExJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtZWRpYW4nLFxyXG4gICAgICB2YWx1ZTogJ1EyIC8gTWVkaWFuJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdRMycsXHJcbiAgICAgIHZhbHVlOiAnUTMnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2ZpcnN0JyxcclxuICAgICAgdmFsdWU6ICdGaXJzdCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYXZlcmFnZScsXHJcbiAgICAgIHZhbHVlOiAnQXZlcmFnZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWluJyxcclxuICAgICAgdmFsdWU6ICdNaW4nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21heCcsXHJcbiAgICAgIHZhbHVlOiAnTWF4J1xyXG4gICAgfSxcclxuICBdLFxyXG4gIGxpc3ROYW1lOiAnJyxcclxufVxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2xpYi1zbWFydC1jaGFydC1jb25maWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3NtYXJ0LWNoYXJ0LWNvbmZpZy5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU21hcnRDaGFydENvbmZpZ0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuICBmbGFnID0gZmFsc2U7XHJcbiAgdXNlclNlbGVjdGVkQ29sb3I9W107XHJcbiAgQElucHV0KCkgY29uZmlnOiBDaGFydENvbmZpZyA9IHtcclxuICAgIGxpc3ROYW1lOiAnJyxcclxuICAgIHRpdGxlOiAnJyxcclxuICAgIHBpZVNsaWNlbk5hbWU6ICcnLFxyXG4gICAgcGllU2xpY2VWYWx1ZTogJycsXHJcbiAgICB0eXBlOiAnJyxcclxuICAgIGxheW91dDogJycsXHJcbiAgICBkYXRhU291cmNlOiAnJyxcclxuICAgIGRhdGFTb3VyY2VWYWx1ZTogJycsXHJcbiAgICB4QXhpczogJycsXHJcbiAgICB5QXhpczogJycsXHJcbiAgICBzbW9vdGhMaW5lOiBmYWxzZSxcclxuICAgIGFwaVVybDogJycsXHJcbiAgICBhcmVhOiBmYWxzZSxcclxuICAgIHlBeGlzRGltZW5zaW9uOiAnJyxcclxuICAgIHJhZGFyRGltZW5zaW9uczogJycsXHJcbiAgICBhZGRTdGFjazogZmFsc2UsXHJcbiAgICBzaG93QXBpSW5wdXQ6IGZhbHNlLFxyXG4gICAgc3RhY2s6IFtdLFxyXG4gICAgc3RhY2tMaXN0OiBTdGFja1snJ10sXHJcbiAgICBhZ2dyQXJyOiBbXSxcclxuICAgIGFnZ3JMaXN0OiBBZ2dyZWdhdGVEYXRhWycnXSxcclxuICAgIGxlZ2VuZDoge1xyXG4gICAgICBpY29uOiAnJyxcclxuICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgdHlwZTogJ3Njcm9sbCdcclxuICAgIH0sXHJcbiAgICByYWRpdXM6IFtdXHJcbiAgfTtcclxuICBjaGFydERhdGEgPSBjaGFydFZhbHVlcztcclxuICBjaGFydExheW91dERhdGE7XHJcbiAgYWdncmVnYXRpb25NZXRob2RzO1xyXG5cclxuICBpc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gIGlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGNvbmZpZ0RhdGE6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hZ2dyZWdhdGlvbk1ldGhvZHMgPSBjaGFydFZhbHVlcy5hZ2dyZWdhdGVNZXRob2Q7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdCA9IFtdO1xyXG4gICAgdGhpcy5jb25maWcubGVnZW5kPXt9O1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIGFkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICAvLyBpZiBzdGFja0xpc3QgaXMgZW1wdHksIGFkZCB0b3RhbCB0byB0aGUgc3RhY2tMaXN0XHJcbiAgLy8gaWYgc3RhY2tMaXN0IGlzIG5vdCBlbXB0eSwgYWRkIGFub3RoZXIgc3RhY2sgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIHN0YWNrQWRkZWQoc3RhY2spIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdCA9IFtdO1xyXG4gICAgaWYgKHN0YWNrKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHlBeGlzRGltZW5zaW9uVXBkYXRlKHZhbCl7XHJcbmNvbnNvbGUubG9nKHZhbCx0aGlzLmNvbmZpZy55QXhpc0RpbWVuc2lvbilcclxuICB9XHJcbiAgZGVsZXRlU3RhY2tWYWx1ZShzdGFjaywgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlU3RhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgdHlwZSBvZiBjaGFydFxyXG4gIC8vIHVwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGxheW91dCBvZiB0aGUgY2hhcnRcclxuICAvLyB1cGRhdGVTdGFjayBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBkYXRhIHNvdXJjZSBvZiB0aGUgY2hhcnRcclxuICB1cGRhdGVTdGFjaygpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hcGlVcmwpIHtcclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdiYXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxheW91dCA9PT0gJ3N0YWNrZWRCYXInKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICd0b3RhbCc7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gdGhpcy5jb25maWcuc3RhY2tMaXN0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXlvdXQgPT09ICdzdGFja2VkTGluZScpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJ3RvdGFsJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSB0aGlzLmNvbmZpZy5zdGFja0xpc3Q7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQW5vdGhlclN0YWNrKCkge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gIH1cclxuICBhZGRBbm90aGVyQWdncmVnYXRlKCkge1xyXG4gICAgdGhpcy5pc0FnZ3JBZGRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5wdXNoKG5ldyBBZ2dyZWdhdGVEYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQWdnclZhbHVlKGFnZ3IsIGluZGV4KSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbG9yVXBkYXRlKGNvbG9yU2VsZWN0ZWQpe1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi50aGlzLnVzZXJTZWxlY3RlZENvbG9yLGNvbG9yU2VsZWN0ZWRdO1xyXG4gICAgdGhpcy5jb25maWcuY29sb3JzID0gdGhpcy51c2VyU2VsZWN0ZWRDb2xvci5qb2luKCcsJylcclxuICB9XHJcbiAgY29sb3JVcGRhdGVCeVR5cGluZyhjb2xvclR5cGVkKXtcclxuICAgIGxldCBqb2luZWRBcnIgPSBbLi4udGhpcy51c2VyU2VsZWN0ZWRDb2xvciwuLi5jb2xvclR5cGVkLnNwbGl0KCcsJyldO1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi5uZXcgU2V0KFsuLi5qb2luZWRBcnJdKV1cclxuICAgIFxyXG4gIH1cclxuICBvblNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5jaGFydERhdGEuY2hhcnRMYXlvdXQuZmlsdGVyKHZhbCA9PiB7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gdmFsLmlkKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydExheW91dERhdGEgPSB2YWwubGF5b3V0O1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy5jb25maWcuYWRkU3RhY2sgPSBmYWxzZTtcclxuXHJcbiAgfVxyXG4gIG9uTGF5b3V0U2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZih2YWx1ZT09PSdzaW1wbGVCYXInIHx8IHZhbHVlPT09J3N0YWNrZWRCYXInfHwgdmFsdWU9PT0nc2ltcGxlJ3x8dmFsdWU9PT0nc3RhY2tlZCcgfHx2YWx1ZT09PSdzaW1wbGVTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3IoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSl7XHJcbiAgICAgICAgaWYodmFsLmlkPT09J2NhdGVnb3J5Jyl7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9ZWxzZSBpZih2YWx1ZT09PSdzaW1wbGVIb3Jpem9udGFsQmFyJyB8fCB2YWx1ZT09PSdzdGFja2VkSG9yaXpvbnRhbEJhcicgfHwgdmFsdWUgPT09J2hvcml6b250YWxTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS54QXhpc1R5cGUpe1xyXG4gICAgICAgIGlmKHZhbC5pZD09PSdjYXRlZ29yeScpe1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkYXRhU291cmNlU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09ICdBUEknKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZGF0YWh1YicpIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBvblNlbGVjdGlvbiwgb25MYXlvdXRTZWxlY3Rpb24sIGRhdGFTb3VyY2VTZWxlY3Rpb24gaXMgY2FsbGVkLCB0aGVuIHN1Ym1pdCBkYXRhIGFuZCBlbWl0IGNvbmZpZ1xyXG4gIFN1Ym1pdERhdGEoKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LmFnZ3JEaW1lc25pb24gPT09IHRoaXMuY29uZmlnLmdyb3VwQnkpIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFyZWEgPT09IHRydWUpIHtcclxuICAgICAgaWYodGhpcy5jb25maWcuYXJlYU9wYWNpdHkgPT0gbnVsbCl7XHJcbiAgICAgICAgdGhpcy5jb25maWcuYXJlYSA9IHt9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSB7XHJcbiAgICAgICAgICAnb3BhY2l0eSc6IHRoaXMuY29uZmlnLmFyZWFPcGFjaXR5XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuXHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnRGF0YS5lbWl0KHRoaXMuY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=