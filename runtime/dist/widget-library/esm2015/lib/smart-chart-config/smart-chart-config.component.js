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
        // Default value for datahub sql query
        if (this.config.datahubUrl === null || this.config.datahubUrl === undefined) {
            this.config.datahubUrl = "service/datahub/sql?version=v1";
        }
        if (this.config.sqlLimit === null || this.config.sqlLimit === undefined) {
            this.config.sqlLimit = 100;
        }
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
        // console.log(val, this.config.yAxisDimension)
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
                template: "<div class=\"configSection\">\r\n    <h4 translate>DataSource</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                <span></span>\r\n                <span>API URL</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                    placeholder=\"Enter Relative URL\">\r\n                <span></span>\r\n                <span>DataHub</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\"></div>\r\n        <div class=\"col-xs-4 col-md-4 \">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- ENd of DataSource Radio Button Selection -->\r\n    <div class=\"row\">\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n            </div>\r\n        </ng-container>\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.datahubUrl\">\r\n                <div>\r\n                    <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                        [(ngModel)]=\"config.sqlQuery\">\r\n                    </textarea>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <label for=\"sqlLimit\">Sql Result Limit</label>\r\n                <div>\r\n                    <input name=\"sqlLimit\" [(ngModel)]=\"config.sqlLimit\" type=\"number\" min=\"100\" max=\"20000\" step=\"1\" />\r\n                </div>\r\n            </div>\r\n\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n<div class=\"configSection\">\r\n    <h4 translate>Chart Config</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">\r\n                        {{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-3 col-md-3\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">\r\n                        {{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"fontSize\">Font Size</label>\r\n            <div>\r\n                <output>{{config.fontSize}}</output>\r\n                <input name=\"fontSize\" [(ngModel)]=\"config.fontSize\" type=\"range\" min=\"8\" max=\"20\" step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type=='pie'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type==='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"xrotateLabels\">X-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.xAxisRotateLabels}}</output>\r\n                <input name=\"xrotateLabels\" [(ngModel)]=\"config.xAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of X axis Config -->\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"yrotateLabels\">Y-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.yAxisRotateLabels}}</output>\r\n                <input name=\"yrotateLabels\" [(ngModel)]=\"config.yAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of y axis Config -->\r\n    <!-- Start of Radar config -->\r\n    <div class=\"row\" *ngIf=\"config.type=='radar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radarDimensions\">Radar Dimensions</label>\r\n            <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"RadarRadius\">Radar Chart radius</label>\r\n            <input class=\"form-control\" name=\"RadarRadius\" type=\"text\" [(ngModel)]=\"config.radarChartRadius\">\r\n        </div>\r\n    </div>\r\n    <!-- End of Radar config -->\r\n</div>\r\n<!-- End of General Chart Config Section -->\r\n<!-- Pie Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='pie'\">\r\n    <h4 translate>Pie Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radius\">Pie Radius</label>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderRadius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Pie Chart Config Section -->\r\n<!-- Scatter Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.type==='scatter'\">\r\n    <h4 translate>Scatter Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n            <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Stack Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n    <h4 translate>Stack Config</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                    (click)=\"stackAdded($event.target.checked)\">\r\n                <span></span>\r\n                <span>Add Stack</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackName\">Stack Name</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackValues\">Stack Values</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Line Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='line'\">\r\n    <h4 translate>Line Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Area Opacity\" for=\"lineAreaOpacity\">Area Opacity</label>\r\n            <input class=\"form-control\" type=\"number\" name=\"lineAreaOpacity\" [(ngModel)]=\"config.areaOpacity\" min=\"0\"\r\n                max=\"1\" step=\"0.1\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Area\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                <span></span>\r\n                <span>Area</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Smooth Line\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                <span></span>\r\n                <span>Smooth Line</span>\r\n            </label>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<!-- End of Line Chart Config Section -->\r\n<!-- Aggregate Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type!=='radar'\">\r\n    <!-- *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \"> -->\r\n    <h4 translate>Aggregate Config</h4>\r\n    <div class=\"col-xs-3 col-md-3\">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n    </div>\r\n    <div class=\"col-xs-12 col-md-12 col-lg-12\">\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregateDimension\">Dimension </label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                        [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                </div>\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregation\">Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                        <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2 \">\r\n                    <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n            <div class=\"col-xs-1 col-md-1\">\r\n                <label for=\"groupByDimension\">GroupBy</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Aggregate Section -->\r\n<!-- Legend Config Section -->\r\n<div class=\"configSection\">\r\n    <h4>Appearance Config</h4>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"legend\">Legend Shape</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                    <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                        {{legendType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Slider Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                <span></span>\r\n                <span>Slider Zoom</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Box Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                <span></span>\r\n                <span>Box Zoom</span>\r\n            </label>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Chart Color\" for=\"chartColor\">Chart Color</label>\r\n            <input type=\"text\" name=\"chartColor\" [(ngModel)]=\"config.colors\"\r\n                (change)=\"colorUpdateByTyping($event.target.value)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <input class=\"form-control\" type=\"color\" placeholder=\"Enter color HEX\"\r\n                (change)=\"colorUpdate($event.target.value)\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End Of Legend Config Section -->",
                styles: [".alertInput{border:2px solid red}.configSection{display:grid;border:1px solid rgba(0,0,0,.3);border-radius:4px;margin:.25em;padding:.25em}.row{padding:.5em}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFD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R0FBRyxLQUFLLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQscUdBQXFHO0lBQ3JHLFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxPQUFPLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUNqRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO2FBQ2xDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7YUFDbkM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUc7b0JBQ2pCLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7aUJBQ25DLENBQUM7YUFDSDtTQUdGO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQztJQUVILENBQUM7OztZQXRORixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsaWhtQkFBa0Q7O2FBRW5EOzs7O3FCQU9FLEtBQUs7eUJBc0NMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29weXJpZ2h0IChjKSAyMDIxIFNvZnR3YXJlIEFHLCBEYXJtc3RhZHQsIEdlcm1hbnkgYW5kL29yIGl0cyBsaWNlbnNvcnNcclxuICpcclxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAncHJvY2Vzcyc7XHJcbmltcG9ydCB7IEFnZ3JlZ2F0ZURhdGEsIENoYXJ0Q29uZmlnLCBTdGFjayB9IGZyb20gJy4uL21vZGVsL2NvbmZpZy5tb2RhbCc7XHJcbmNvbnN0IGNoYXJ0VmFsdWVzID0ge1xyXG4gIGNoYXJ0VHlwZTogW1xyXG5cclxuICAgIHtcclxuICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICB2YWx1ZTogJ0JhciBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgIHZhbHVlOiAnTGluZSBDaGFydCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BpZScsXHJcbiAgICAgIHZhbHVlOiAnUGllIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdyYWRhcicsXHJcbiAgICAgIHZhbHVlOiAnUmFkYXIgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BvbGFyJyxcclxuICAgICAgdmFsdWU6ICdQb2xhciBjaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc2NhdHRlcicsXHJcbiAgICAgIHZhbHVlOiAnU2NhdHRlciBDaGFydCdcclxuICAgIH1cclxuICBdLFxyXG4gIGNoYXJ0TGF5b3V0OiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIExpbmUgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWQnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIExpbmUgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BvbGFyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgICAgIHZhbHVlOiAnTGluZSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnQmFyJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZUJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWRCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlSG9yaXpvbnRhbEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBIb3Jpem9udGFsIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZEhvcml6b250YWxCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTdGFja2VkIEhvcml6b250YWwgQmFyIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwaWUnLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZVBpZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBQaWUgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3Jvc2VNb2RlJyxcclxuICAgICAgICAgIHZhbHVlOiAnUm9zZSBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc2NhdHRlcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlU2NhdHRlcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBTY2F0dGVyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdob3Jpem9udGFsU2NhdHRlcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ0hvcml6b250YWwgU2NhdHRlciBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdLFxyXG4gIHlBeGlzVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3ZhbHVlJyxcclxuICAgICAgdmFsdWU6ICdWYWx1ZScsXHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjYXRlZ29yeScsXHJcbiAgICAgIHZhbHVlOiAnQ2F0ZWdvcnknLFxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgIGlkOiAnbG9nJyxcclxuICAgIC8vICAgdmFsdWU6ICdMb2cnLFxyXG4gICAgLy8gICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgLy8gfSxcclxuICBdLFxyXG5cclxuICB4QXhpc1R5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICd2YWx1ZScsXHJcbiAgICAgIHZhbHVlOiAnVmFsdWUnLFxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcblxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICd0aW1lJyxcclxuICAgICAgdmFsdWU6ICdUaW1lJyxcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICBpZDogJ2xvZycsXHJcbiAgICAvLyAgIHZhbHVlOiAnTG9nJyxcclxuICAgIC8vICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIC8vIH0sXHJcbiAgXSxcclxuICBsZWdlbmRUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdjaXJjbGUnLFxyXG4gICAgICB2YWx1ZTogJ0NpcmNsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdyZWN0JyxcclxuICAgICAgdmFsdWU6ICdSZWN0YW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAncm91bmRSZWN0JyxcclxuICAgICAgdmFsdWU6ICdSb3VuZCBSZWN0YW5nbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAndHJpYW5nbGUnLFxyXG4gICAgICB2YWx1ZTogJ1RyaWFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2RpYW1vbmQnLFxyXG4gICAgICB2YWx1ZTogJ0RpYW1vbmQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAnYXJyb3cnLFxyXG4gICAgICB2YWx1ZTogJ0Fycm93J1xyXG4gICAgfVxyXG4gIF0sXHJcbiAgYWdncmVnYXRlTWV0aG9kOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnc3VtJyxcclxuICAgICAgdmFsdWU6ICdTdW0nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NvdW50JyxcclxuICAgICAgdmFsdWU6ICdDb3VudCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUTEnLFxyXG4gICAgICB2YWx1ZTogJ1ExJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtZWRpYW4nLFxyXG4gICAgICB2YWx1ZTogJ1EyIC8gTWVkaWFuJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdRMycsXHJcbiAgICAgIHZhbHVlOiAnUTMnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2ZpcnN0JyxcclxuICAgICAgdmFsdWU6ICdGaXJzdCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYXZlcmFnZScsXHJcbiAgICAgIHZhbHVlOiAnQXZlcmFnZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWluJyxcclxuICAgICAgdmFsdWU6ICdNaW4nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21heCcsXHJcbiAgICAgIHZhbHVlOiAnTWF4J1xyXG4gICAgfSxcclxuICBdLFxyXG4gIGxpc3ROYW1lOiAnJyxcclxufVxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2xpYi1zbWFydC1jaGFydC1jb25maWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3NtYXJ0LWNoYXJ0LWNvbmZpZy5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU21hcnRDaGFydENvbmZpZ0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuICBmbGFnID0gZmFsc2U7XHJcbiAgdXNlclNlbGVjdGVkQ29sb3IgPSBbXTtcclxuICBASW5wdXQoKSBjb25maWc6IENoYXJ0Q29uZmlnID0ge1xyXG4gICAgbGlzdE5hbWU6ICcnLFxyXG4gICAgdGl0bGU6ICcnLFxyXG4gICAgcGllU2xpY2VuTmFtZTogJycsXHJcbiAgICBwaWVTbGljZVZhbHVlOiAnJyxcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgbGF5b3V0OiAnJyxcclxuICAgIGRhdGFTb3VyY2U6ICcnLFxyXG4gICAgZGF0YVNvdXJjZVZhbHVlOiAnJyxcclxuICAgIHhBeGlzOiAnJyxcclxuICAgIHlBeGlzOiAnJyxcclxuICAgIHNtb290aExpbmU6IGZhbHNlLFxyXG4gICAgYXBpVXJsOiAnJyxcclxuICAgIGZvbnRTaXplOiAxMixcclxuICAgIHhBeGlzUm90YXRlTGFiZWxzOiAwLFxyXG4gICAgeUF4aXNSb3RhdGVMYWJlbHM6IDAsXHJcbiAgICBhcmVhOiBmYWxzZSxcclxuICAgIHlBeGlzRGltZW5zaW9uOiAnJyxcclxuICAgIHJhZGFyRGltZW5zaW9uczogJycsXHJcbiAgICBhZGRTdGFjazogZmFsc2UsXHJcbiAgICBzaG93QXBpSW5wdXQ6IGZhbHNlLFxyXG4gICAgc3RhY2s6IFtdLFxyXG4gICAgc3RhY2tMaXN0OiBTdGFja1snJ10sXHJcbiAgICBhZ2dyQXJyOiBbXSxcclxuICAgIGFnZ3JMaXN0OiBBZ2dyZWdhdGVEYXRhWycnXSxcclxuICAgIGxlZ2VuZDoge1xyXG4gICAgICBpY29uOiAnJyxcclxuICAgICAgd2lkdGg6IDMzMCxcclxuICAgICAgdHlwZTogJ3Njcm9sbCdcclxuICAgIH0sXHJcbiAgICByYWRpdXM6IFtdXHJcbiAgfTtcclxuICBjaGFydERhdGEgPSBjaGFydFZhbHVlcztcclxuICBjaGFydExheW91dERhdGE7XHJcbiAgYWdncmVnYXRpb25NZXRob2RzO1xyXG5cclxuICBpc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gIGlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGNvbmZpZ0RhdGE6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hZ2dyZWdhdGlvbk1ldGhvZHMgPSBjaGFydFZhbHVlcy5hZ2dyZWdhdGVNZXRob2Q7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdCA9IFtdO1xyXG4gICAgdGhpcy5jb25maWcubGVnZW5kID0ge307XHJcbiAgICAvLyBEZWZhdWx0IHZhbHVlIGZvciBkYXRhaHViIHNxbCBxdWVyeVxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmRhdGFodWJVcmwgPT09IG51bGwgfHwgdGhpcy5jb25maWcuZGF0YWh1YlVybCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmRhdGFodWJVcmwgPSBcInNlcnZpY2UvZGF0YWh1Yi9zcWw/dmVyc2lvbj12MVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY29uZmlnLnNxbExpbWl0ID09PSBudWxsIHx8IHRoaXMuY29uZmlnLnNxbExpbWl0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5jb25maWcuc3FsTGltaXQgPSAxMDA7XHJcbiAgICB9XHJcbiAgICAvLyBUbyBpbml0aWFsaXplIHRoZSBjaGFydCBsYXlvdXQgZHJvcGRvd25cclxuICAgIHRoaXMub25TZWxlY3Rpb24odGhpcy5jb25maWcudHlwZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gYWRkIGFub3RoZXIgc3RhY2sgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIC8vIGlmIHN0YWNrTGlzdCBpcyBlbXB0eSwgYWRkIHRvdGFsIHRvIHRoZSBzdGFja0xpc3RcclxuICAvLyBpZiBzdGFja0xpc3QgaXMgbm90IGVtcHR5LCBhZGQgYW5vdGhlciBzdGFjayB0byB0aGUgc3RhY2tMaXN0XHJcbiAgc3RhY2tBZGRlZChzdGFjaykge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0ID0gW107XHJcbiAgICBpZiAoc3RhY2spIHtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICB9XHJcbiAgeUF4aXNEaW1lbnNpb25VcGRhdGUodmFsKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh2YWwsIHRoaXMuY29uZmlnLnlBeGlzRGltZW5zaW9uKVxyXG4gIH1cclxuICBkZWxldGVTdGFja1ZhbHVlKHN0YWNrLCBpbmRleCkge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgfVxyXG5cclxuICAvLyB1cGRhdGVTdGFjayBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSB0eXBlIG9mIGNoYXJ0XHJcbiAgLy8gdXBkYXRlU3RhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgbGF5b3V0IG9mIHRoZSBjaGFydFxyXG4gIC8vIHVwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGRhdGEgc291cmNlIG9mIHRoZSBjaGFydFxyXG4gIHVwZGF0ZVN0YWNrKCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFwaVVybCkge1xyXG4gICAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ2JhcicpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcubGF5b3V0ID09PSAnc3RhY2tlZEJhcicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJ3RvdGFsJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSB0aGlzLmNvbmZpZy5zdGFja0xpc3Q7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxheW91dCA9PT0gJ3N0YWNrZWRMaW5lJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAndG90YWwnO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9IHRoaXMuY29uZmlnLnN0YWNrTGlzdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRBbm90aGVyU3RhY2soKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgfVxyXG4gIGFkZEFub3RoZXJBZ2dyZWdhdGUoKSB7XHJcbiAgICB0aGlzLmlzQWdnckFkZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuY29uZmlnLmFnZ3JMaXN0LnB1c2gobmV3IEFnZ3JlZ2F0ZURhdGEoKSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVBZ2dyVmFsdWUoYWdnciwgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLmFnZ3JMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYWdnckxpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuaXNBZ2dyQWRkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgY29sb3JVcGRhdGUoY29sb3JTZWxlY3RlZCkge1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi50aGlzLnVzZXJTZWxlY3RlZENvbG9yLCBjb2xvclNlbGVjdGVkXTtcclxuICAgIHRoaXMuY29uZmlnLmNvbG9ycyA9IHRoaXMudXNlclNlbGVjdGVkQ29sb3Iuam9pbignLCcpXHJcbiAgfVxyXG4gIGNvbG9yVXBkYXRlQnlUeXBpbmcoY29sb3JUeXBlZCkge1xyXG4gICAgbGV0IGpvaW5lZEFyciA9IFsuLi50aGlzLnVzZXJTZWxlY3RlZENvbG9yLCAuLi5jb2xvclR5cGVkLnNwbGl0KCcsJyldO1xyXG4gICAgdGhpcy51c2VyU2VsZWN0ZWRDb2xvciA9IFsuLi5uZXcgU2V0KFsuLi5qb2luZWRBcnJdKV1cclxuXHJcbiAgfVxyXG4gIG9uU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmNoYXJ0RGF0YS5jaGFydExheW91dC5maWx0ZXIodmFsID0+IHtcclxuICAgICAgaWYgKHZhbHVlID09PSB2YWwuaWQpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0TGF5b3V0RGF0YSA9IHZhbC5sYXlvdXQ7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB0aGlzLmNvbmZpZy5hZGRTdGFjayA9IGZhbHNlO1xyXG5cclxuICB9XHJcbiAgb25MYXlvdXRTZWxlY3Rpb24odmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gJ3NpbXBsZUJhcicgfHwgdmFsdWUgPT09ICdzdGFja2VkQmFyJyB8fCB2YWx1ZSA9PT0gJ3NpbXBsZScgfHwgdmFsdWUgPT09ICdzdGFja2VkJyB8fCB2YWx1ZSA9PT0gJ3NpbXBsZVNjYXR0ZXInKSB7XHJcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnlBeGlzVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWwuaWQgPT09ICdjYXRlZ29yeScpIHtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWwuaWQgPT09ICdjYXRlZ29yeScpIHtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3NpbXBsZUhvcml6b250YWxCYXInIHx8IHZhbHVlID09PSAnc3RhY2tlZEhvcml6b250YWxCYXInIHx8IHZhbHVlID09PSAnaG9yaXpvbnRhbFNjYXR0ZXInKSB7XHJcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnlBeGlzVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWwuaWQgPT09ICdjYXRlZ29yeScpIHtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS54QXhpc1R5cGUpIHtcclxuICAgICAgICBpZiAodmFsLmlkID09PSAnY2F0ZWdvcnknKSB7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGF0YVNvdXJjZVNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSAnQVBJJykge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcblxyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2RhdGFodWInKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgb25TZWxlY3Rpb24sIG9uTGF5b3V0U2VsZWN0aW9uLCBkYXRhU291cmNlU2VsZWN0aW9uIGlzIGNhbGxlZCwgdGhlbiBzdWJtaXQgZGF0YSBhbmQgZW1pdCBjb25maWdcclxuICBTdWJtaXREYXRhKCkge1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICBpZiAoZWxlbWVudC5hZ2dyRGltZXNuaW9uID09PSB0aGlzLmNvbmZpZy5ncm91cEJ5KSB7XHJcbiAgICAgICAgdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hcmVhID09PSB0cnVlKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5hcmVhT3BhY2l0eSA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcuYXJlYSA9IHt9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSB7XHJcbiAgICAgICAgICAnb3BhY2l0eSc6IHRoaXMuY29uZmlnLmFyZWFPcGFjaXR5XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5hcmVhID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSkge1xyXG4gICAgICB0aGlzLmNvbmZpZ0RhdGEuZW1pdCh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19