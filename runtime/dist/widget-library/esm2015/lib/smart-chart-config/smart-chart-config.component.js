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
            fontSize: 12,
            xAxisRotateLabels: 0,
            yAxisRotateLabels: 0,
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
        // To initialize the chart layout dropdown
        this.onSelection(this.config.type);
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
                template: "<div class=\"configSection\">\r\n    <h4 translate>DataSource</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                <span></span>\r\n                <span>API URL</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                    placeholder=\"Enter Relative URL\">\r\n                <span></span>\r\n                <span>DataHub</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\"></div>\r\n        <div class=\"col-xs-4 col-md-4 \">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- ENd of DataSource Radio Button Selection -->\r\n    <div class=\"row\">\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n            </div>\r\n        </ng-container>\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n                <div>\r\n                    <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                        [(ngModel)]=\"config.sqlQuery\">\r\n                    </textarea>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n<div class=\"configSection\">\r\n    <h4 translate>Chart Config</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">\r\n                        {{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-3 col-md-3\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">\r\n                        {{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"fontSize\">Font Size</label>\r\n            <div>\r\n                <output>{{config.fontSize}}</output>\r\n                <input name=\"fontSize\" [(ngModel)]=\"config.fontSize\" type=\"range\" min=\"8\" max=\"20\" step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type=='pie'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type==='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"xrotateLabels\">X-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.xAxisRotateLabels}}</output>\r\n                <input name=\"xrotateLabels\" [(ngModel)]=\"config.xAxisRotateLabels\" type=\"range\" min=\"8\" max=\"20\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of X axis Config -->\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"yrotateLabels\">Y-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.yAxisRotateLabels}}</output>\r\n                <input name=\"yrotateLabels\" [(ngModel)]=\"config.yAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of y axis Config -->\r\n    <!-- Start of Radar config -->\r\n    <div class=\"row\" *ngIf=\"config.type=='radar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radarDimensions\">Radar Dimensions</label>\r\n            <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"RadarRadius\">Radar Chart radius</label>\r\n            <input class=\"form-control\" name=\"RadarRadius\" type=\"text\" [(ngModel)]=\"config.radarChartRadius\">\r\n        </div>\r\n    </div>\r\n    <!-- End of Radar config -->\r\n</div>\r\n<!-- End of General Chart Config Section -->\r\n<!-- Pie Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='pie'\">\r\n    <h4 translate>Pie Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radius\">Pie Radius</label>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderRadius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Pie Chart Config Section -->\r\n<!-- Scatter Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.type==='scatter'\">\r\n    <h4 translate>Scatter Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n            <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Stack Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n    <h4 translate>Stack Config</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                    (click)=\"stackAdded($event.target.checked)\">\r\n                <span></span>\r\n                <span>Add Stack</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackName\">Stack Name</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackValues\">Stack Values</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Line Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='line'\">\r\n    <h4 translate>Line Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Area\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                <span></span>\r\n                <span>Area</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Smooth Line\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                <span></span>\r\n                <span>Smooth Line</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Area Opacity\" for=\"lineAreaOpacity\">Area Opacity</label>\r\n            <input class=\"form-control\" type=\"number\" name=\"lineAreaOpacity\" [(ngModel)]=\"config.areaOpacity\" min=\"0\"\r\n                max=\"1\" step=\"0.1\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Line Chart Config Section -->\r\n<!-- Aggregate Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type!=='radar'\">\r\n    <!-- *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \"> -->\r\n    <h4 translate>Aggregate Config</h4>\r\n    <div class=\"col-xs-3 col-md-3\">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n    </div>\r\n    <div class=\"col-xs-12 col-md-12 col-lg-12\">\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregateDimension\">Dimension </label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                        [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                </div>\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregation\">Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                        <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2 \">\r\n                    <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n            <div class=\"col-xs-1 col-md-1\">\r\n                <label for=\"groupByDimension\">GroupBy</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Aggregate Section -->\r\n<!-- Legend Config Section -->\r\n<div class=\"configSection\">\r\n    <h4>Appearance Config</h4>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"legend\">Legend Shape</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                    <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                        {{legendType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Slider Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                <span></span>\r\n                <span>Slider Zoom</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Box Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                <span></span>\r\n                <span>Box Zoom</span>\r\n            </label>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Chart Color\" for=\"chartColor\">Chart Color</label>\r\n            <input type=\"text\" name=\"chartColor\" [(ngModel)]=\"config.colors\"\r\n                (change)=\"colorUpdateByTyping($event.target.value)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br/>\r\n            <input class=\"form-control\" type=\"color\" placeholder=\"Enter color HEX\"\r\n                (change)=\"colorUpdate($event.target.value)\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End Of Legend Config Section -->",
                styles: [".alertInput{border:2px solid red}.configSection{display:grid;border:1px solid rgba(0,0,0,.3);border-radius:4px;margin:.25em;padding:.25em}.row{padding:.5em}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFD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QixHQUFHLEtBQUssQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDN0IsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUM7Z0JBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUN2QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRztvQkFDakIsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVztpQkFDbkMsQ0FBQzthQUNIO1NBR0Y7YUFBSztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO0lBRUgsQ0FBQzs7O1lBL01GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyw0cmxCQUFrRDs7YUFFbkQ7Ozs7cUJBT0UsS0FBSzt5QkFzQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICdwcm9jZXNzJztcclxuaW1wb3J0IHsgQWdncmVnYXRlRGF0YSwgQ2hhcnRDb25maWcsIFN0YWNrIH0gZnJvbSAnLi4vbW9kZWwvY29uZmlnLm1vZGFsJztcclxuY29uc3QgY2hhcnRWYWx1ZXMgPSB7XHJcbiAgY2hhcnRUeXBlOiBbXHJcblxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIHZhbHVlOiAnQmFyIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgdmFsdWU6ICdMaW5lIENoYXJ0JyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncGllJyxcclxuICAgICAgdmFsdWU6ICdQaWUgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3JhZGFyJyxcclxuICAgICAgdmFsdWU6ICdSYWRhciBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICB2YWx1ZTogJ1BvbGFyIGNoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgdmFsdWU6ICdTY2F0dGVyIENoYXJ0J1xyXG4gICAgfVxyXG4gIF0sXHJcbiAgY2hhcnRMYXlvdXQ6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgTGluZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZCcsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgTGluZSBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdMaW5lJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdCYXInXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVIb3Jpem9udGFsQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEhvcml6b250YWwgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkSG9yaXpvbnRhbEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgSG9yaXpvbnRhbCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BpZScsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlUGllJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFBpZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAncm9zZU1vZGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdSb3NlIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFNjYXR0ZXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2hvcml6b250YWxTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnSG9yaXpvbnRhbCBTY2F0dGVyIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgeUF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcblxyXG4gIHhBeGlzVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3ZhbHVlJyxcclxuICAgICAgdmFsdWU6ICdWYWx1ZScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NhdGVnb3J5JyxcclxuICAgICAgdmFsdWU6ICdDYXRlZ29yeScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcblxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICd0aW1lJyxcclxuICAgICAgdmFsdWU6ICdUaW1lJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgIGlkOiAnbG9nJyxcclxuICAgIC8vICAgdmFsdWU6ICdMb2cnLFxyXG4gICAgLy8gICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgLy8gfSxcclxuICBdLFxyXG4gIGxlZ2VuZFR5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2NpcmNsZScsXHJcbiAgICAgIHZhbHVlOiAnQ2lyY2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3JlY3QnLFxyXG4gICAgICB2YWx1ZTogJ1JlY3RhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdyb3VuZFJlY3QnLFxyXG4gICAgICB2YWx1ZTogJ1JvdW5kIFJlY3RhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICd0cmlhbmdsZScsXHJcbiAgICAgIHZhbHVlOiAnVHJpYW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAnZGlhbW9uZCcsXHJcbiAgICAgIHZhbHVlOiAnRGlhbW9uZCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdhcnJvdycsXHJcbiAgICAgIHZhbHVlOiAnQXJyb3cnXHJcbiAgICB9XHJcbiAgXSxcclxuICBhZ2dyZWdhdGVNZXRob2Q6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdzdW0nLFxyXG4gICAgICB2YWx1ZTogJ1N1bSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY291bnQnLFxyXG4gICAgICB2YWx1ZTogJ0NvdW50J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdRMScsXHJcbiAgICAgIHZhbHVlOiAnUTEnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21lZGlhbicsXHJcbiAgICAgIHZhbHVlOiAnUTIgLyBNZWRpYW4nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1EzJyxcclxuICAgICAgdmFsdWU6ICdRMydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnZmlyc3QnLFxyXG4gICAgICB2YWx1ZTogJ0ZpcnN0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdhdmVyYWdlJyxcclxuICAgICAgdmFsdWU6ICdBdmVyYWdlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtaW4nLFxyXG4gICAgICB2YWx1ZTogJ01pbidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWF4JyxcclxuICAgICAgdmFsdWU6ICdNYXgnXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgbGlzdE5hbWU6ICcnLFxyXG59XHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLXNtYXJ0LWNoYXJ0LWNvbmZpZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3NtYXJ0LWNoYXJ0LWNvbmZpZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gIGZsYWcgPSBmYWxzZTtcclxuICB1c2VyU2VsZWN0ZWRDb2xvcj1bXTtcclxuICBASW5wdXQoKSBjb25maWc6IENoYXJ0Q29uZmlnID0ge1xyXG4gICAgbGlzdE5hbWU6ICcnLFxyXG4gICAgdGl0bGU6ICcnLFxyXG4gICAgcGllU2xpY2VuTmFtZTogJycsXHJcbiAgICBwaWVTbGljZVZhbHVlOiAnJyxcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgbGF5b3V0OiAnJyxcclxuICAgIGRhdGFTb3VyY2U6ICcnLFxyXG4gICAgZGF0YVNvdXJjZVZhbHVlOiAnJyxcclxuICAgIHhBeGlzOiAnJyxcclxuICAgIHlBeGlzOiAnJyxcclxuICAgIHNtb290aExpbmU6IGZhbHNlLFxyXG4gICAgYXBpVXJsOiAnJyxcclxuICAgIGZvbnRTaXplOjEyLFxyXG4gICAgeEF4aXNSb3RhdGVMYWJlbHM6MCxcclxuICAgIHlBeGlzUm90YXRlTGFiZWxzOjAsXHJcbiAgICBhcmVhOiBmYWxzZSxcclxuICAgIHlBeGlzRGltZW5zaW9uOiAnJyxcclxuICAgIHJhZGFyRGltZW5zaW9uczogJycsXHJcbiAgICBhZGRTdGFjazogZmFsc2UsXHJcbiAgICBzaG93QXBpSW5wdXQ6IGZhbHNlLFxyXG4gICAgc3RhY2s6IFtdLFxyXG4gICAgc3RhY2tMaXN0OiBTdGFja1snJ10sXHJcbiAgICBhZ2dyQXJyOiBbXSxcclxuICAgIGFnZ3JMaXN0OiBBZ2dyZWdhdGVEYXRhWycnXSxcclxuICAgIGxlZ2VuZDoge1xyXG4gICAgICBpY29uOiAnJyxcclxuICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgdHlwZTogJ3Njcm9sbCdcclxuICAgIH0sXHJcbiAgICByYWRpdXM6IFtdXHJcbiAgfTtcclxuICBjaGFydERhdGEgPSBjaGFydFZhbHVlcztcclxuICBjaGFydExheW91dERhdGE7XHJcbiAgYWdncmVnYXRpb25NZXRob2RzO1xyXG5cclxuICBpc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gIGlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGNvbmZpZ0RhdGE6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hZ2dyZWdhdGlvbk1ldGhvZHMgPSBjaGFydFZhbHVlcy5hZ2dyZWdhdGVNZXRob2Q7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdCA9IFtdO1xyXG4gICAgdGhpcy5jb25maWcubGVnZW5kPXt9O1xyXG4gICAgLy8gVG8gaW5pdGlhbGl6ZSB0aGUgY2hhcnQgbGF5b3V0IGRyb3Bkb3duXHJcbiAgICB0aGlzLm9uU2VsZWN0aW9uKHRoaXMuY29uZmlnLnR5cGUpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIGFkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICAvLyBpZiBzdGFja0xpc3QgaXMgZW1wdHksIGFkZCB0b3RhbCB0byB0aGUgc3RhY2tMaXN0XHJcbiAgLy8gaWYgc3RhY2tMaXN0IGlzIG5vdCBlbXB0eSwgYWRkIGFub3RoZXIgc3RhY2sgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIHN0YWNrQWRkZWQoc3RhY2spIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdCA9IFtdO1xyXG4gICAgaWYgKHN0YWNrKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHlBeGlzRGltZW5zaW9uVXBkYXRlKHZhbCl7XHJcbmNvbnNvbGUubG9nKHZhbCx0aGlzLmNvbmZpZy55QXhpc0RpbWVuc2lvbilcclxuICB9XHJcbiAgZGVsZXRlU3RhY2tWYWx1ZShzdGFjaywgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlU3RhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgdHlwZSBvZiBjaGFydFxyXG4gIC8vIHVwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGxheW91dCBvZiB0aGUgY2hhcnRcclxuICAvLyB1cGRhdGVTdGFjayBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBkYXRhIHNvdXJjZSBvZiB0aGUgY2hhcnRcclxuICB1cGRhdGVTdGFjaygpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hcGlVcmwpIHtcclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdiYXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxheW91dCA9PT0gJ3N0YWNrZWRCYXInKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICd0b3RhbCc7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gdGhpcy5jb25maWcuc3RhY2tMaXN0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXlvdXQgPT09ICdzdGFja2VkTGluZScpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJ3RvdGFsJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSB0aGlzLmNvbmZpZy5zdGFja0xpc3Q7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQW5vdGhlclN0YWNrKCkge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gIH1cclxuICBhZGRBbm90aGVyQWdncmVnYXRlKCkge1xyXG4gICAgdGhpcy5pc0FnZ3JBZGRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5wdXNoKG5ldyBBZ2dyZWdhdGVEYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQWdnclZhbHVlKGFnZ3IsIGluZGV4KSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbG9yVXBkYXRlKGNvbG9yU2VsZWN0ZWQpe1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi50aGlzLnVzZXJTZWxlY3RlZENvbG9yLGNvbG9yU2VsZWN0ZWRdO1xyXG4gICAgdGhpcy5jb25maWcuY29sb3JzID0gdGhpcy51c2VyU2VsZWN0ZWRDb2xvci5qb2luKCcsJylcclxuICB9XHJcbiAgY29sb3JVcGRhdGVCeVR5cGluZyhjb2xvclR5cGVkKXtcclxuICAgIGxldCBqb2luZWRBcnIgPSBbLi4udGhpcy51c2VyU2VsZWN0ZWRDb2xvciwuLi5jb2xvclR5cGVkLnNwbGl0KCcsJyldO1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi5uZXcgU2V0KFsuLi5qb2luZWRBcnJdKV1cclxuICAgIFxyXG4gIH1cclxuICBvblNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5jaGFydERhdGEuY2hhcnRMYXlvdXQuZmlsdGVyKHZhbCA9PiB7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gdmFsLmlkKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydExheW91dERhdGEgPSB2YWwubGF5b3V0O1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy5jb25maWcuYWRkU3RhY2sgPSBmYWxzZTtcclxuXHJcbiAgfVxyXG4gIG9uTGF5b3V0U2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZih2YWx1ZT09PSdzaW1wbGVCYXInIHx8IHZhbHVlPT09J3N0YWNrZWRCYXInfHwgdmFsdWU9PT0nc2ltcGxlJ3x8dmFsdWU9PT0nc3RhY2tlZCcgfHx2YWx1ZT09PSdzaW1wbGVTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3IoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSl7XHJcbiAgICAgICAgaWYodmFsLmlkPT09J2NhdGVnb3J5Jyl7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9ZWxzZSBpZih2YWx1ZT09PSdzaW1wbGVIb3Jpem9udGFsQmFyJyB8fCB2YWx1ZT09PSdzdGFja2VkSG9yaXpvbnRhbEJhcicgfHwgdmFsdWUgPT09J2hvcml6b250YWxTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS54QXhpc1R5cGUpe1xyXG4gICAgICAgIGlmKHZhbC5pZD09PSdjYXRlZ29yeScpe1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkYXRhU291cmNlU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09ICdBUEknKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZGF0YWh1YicpIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBvblNlbGVjdGlvbiwgb25MYXlvdXRTZWxlY3Rpb24sIGRhdGFTb3VyY2VTZWxlY3Rpb24gaXMgY2FsbGVkLCB0aGVuIHN1Ym1pdCBkYXRhIGFuZCBlbWl0IGNvbmZpZ1xyXG4gIFN1Ym1pdERhdGEoKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LmFnZ3JEaW1lc25pb24gPT09IHRoaXMuY29uZmlnLmdyb3VwQnkpIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFyZWEgPT09IHRydWUpIHtcclxuICAgICAgaWYodGhpcy5jb25maWcuYXJlYU9wYWNpdHkgPT0gbnVsbCl7XHJcbiAgICAgICAgdGhpcy5jb25maWcuYXJlYSA9IHt9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSB7XHJcbiAgICAgICAgICAnb3BhY2l0eSc6IHRoaXMuY29uZmlnLmFyZWFPcGFjaXR5XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuXHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnRGF0YS5lbWl0KHRoaXMuY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=