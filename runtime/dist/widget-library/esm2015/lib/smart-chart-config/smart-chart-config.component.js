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
}
SmartChartConfigComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-smart-chart-config',
                template: "<div class=\"configSection\">\r\n    <h4 translate>DataSource</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                <span></span>\r\n                <span>API URL</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\">\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\"\r\n                    placeholder=\"Enter Relative URL\">\r\n                <span></span>\r\n                <span>DataHub</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-2 col-md-2\"></div>\r\n        <div class=\"col-xs-4 col-md-4 \">\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- ENd of DataSource Radio Button Selection -->\r\n    <div class=\"row\">\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"API URL\" [(ngModel)]=\"config.apiUrl\">\r\n            </div>\r\n        </ng-container>\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.datahubUrl\">\r\n                <div>\r\n                    <textarea class=\"form-control\" placeholder=\"Sql Query\" rows=\"3\" cols=\"30\"\r\n                        [(ngModel)]=\"config.sqlQuery\">\r\n                    </textarea>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-xs-6 col-md-6\">\r\n                <label for=\"sqlLimit\">Sql Result Limit</label>\r\n                <div>\r\n                    <input name=\"sqlLimit\" [(ngModel)]=\"config.sqlLimit\" type=\"number\" min=\"100\" max=\"20000\" step=\"1\" />\r\n                </div>\r\n            </div>\r\n\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n<div class=\"configSection\">\r\n    <h4 translate>Chart Config</h4>\r\n    <div class=\"row \">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"type\">Chart Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                    [(ngModel)]=\"config.type\">\r\n                    <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">\r\n                        {{chartType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\" class=\"col-xs-3 col-md-3\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                    (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">\r\n                        {{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"fontSize\">Font Size</label>\r\n            <div>\r\n                <output>{{config.fontSize}}</output>\r\n                <input name=\"fontSize\" [(ngModel)]=\"config.fontSize\" type=\"range\" min=\"8\" max=\"20\" step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type=='pie'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type==='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"xrotateLabels\">X-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.xAxisRotateLabels}}</output>\r\n                <input name=\"xrotateLabels\" [(ngModel)]=\"config.xAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of X axis Config -->\r\n    <div class=\"row \" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\" [disabled]='type.disabled'>\r\n                        {{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n            <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\"\r\n                (change)=\"yAxisDimensionUpdate(config.yAxisDimension)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type!=='pie' && config.type!=='radar' && config.type!=='polar'\">\r\n            <label for=\"yrotateLabels\">Y-Axis Rotate Labels</label>\r\n            <div>\r\n                <output>{{config.yAxisRotateLabels}}</output>\r\n                <input name=\"yrotateLabels\" [(ngModel)]=\"config.yAxisRotateLabels\" type=\"range\" min=\"-90\" max=\"90\"\r\n                    step=\"1\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- End of y axis Config -->\r\n    <!-- Start of Radar config -->\r\n    <div class=\"row\" *ngIf=\"config.type=='radar'\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radarDimensions\">Radar Dimensions</label>\r\n            <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"RadarRadius\">Radar Chart radius</label>\r\n            <input class=\"form-control\" name=\"RadarRadius\" type=\"text\" [(ngModel)]=\"config.radarChartRadius\">\r\n        </div>\r\n    </div>\r\n    <!-- End of Radar config -->\r\n</div>\r\n<!-- End of General Chart Config Section -->\r\n<!-- Pie Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='pie'\">\r\n    <h4 translate>Pie Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"radius\">Pie Radius</label>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderRadius\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\"\r\n                [(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Pie Chart Config Section -->\r\n<!-- Scatter Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.type==='scatter'\">\r\n    <h4 translate>Scatter Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Bubble Size\" for=\"symbolSize\">Bubble Size</label>\r\n            <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n                [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Stack Chart Config -->\r\n<div class=\"configSection\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n    <h4 translate>Stack Config</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                    (click)=\"stackAdded($event.target.checked)\">\r\n                <span></span>\r\n                <span>Add Stack</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <div *ngIf=\"config.addStack\" class=\"col-xs-2 col-md-2\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"row col-xs-12 col-md-12 col-lg-12\" style=\"margin-top: 5px;\">\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackName\">Stack Name</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <label for=\"stackValues\">Stack Values</label>\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div class=\"col-md-2 col-xs-2\">\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Scatter Chart Config -->\r\n<!-- Line Chart Config Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type=='line'\">\r\n    <h4 translate>Line Chart Settings</h4>\r\n    <div class=\"row form-group\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Area Opacity\" for=\"lineAreaOpacity\">Area Opacity</label>\r\n            <input class=\"form-control\" type=\"number\" name=\"lineAreaOpacity\" [(ngModel)]=\"config.areaOpacity\" min=\"0\"\r\n                max=\"1\" step=\"0.1\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Area\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n                <span></span>\r\n                <span>Area</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <label title=\"Smooth Line\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n                <span></span>\r\n                <span>Smooth Line</span>\r\n            </label>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n<!-- End of Line Chart Config Section -->\r\n<!-- Aggregate Section -->\r\n<div class=\"configSection\" *ngIf=\"config.type!=='radar'\">\r\n    <!-- *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \"> -->\r\n    <h4 translate>Aggregate Config</h4>\r\n    <div class=\"col-xs-3 col-md-3\">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button style=\"margin-left: 10px;\" type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n    </div>\r\n    <div class=\"col-xs-12 col-md-12 col-lg-12\">\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"row col-xs-12 col-md-12 col-lg-12\">\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregateDimension\">Dimension </label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                        [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n                </div>\r\n                <div class=\"col-xs-1 col-md-1\">\r\n                    <label for=\"aggregation\">Method</label>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2\">\r\n                    <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                        [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                        <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                        </option>\r\n                    </select>\r\n                </div>\r\n                <div class=\"col-xs-2 col-md-2 \">\r\n                    <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n                </div>\r\n            </div>\r\n        </ng-container>\r\n        <div class=\"form-group col-xs-12 col-md-12 col-lg-12 row\" *ngIf=\"isAggrAdded\">\r\n            <div class=\"col-xs-1 col-md-1\">\r\n                <label for=\"groupByDimension\">GroupBy</label>\r\n            </div>\r\n            <div class=\"col-xs-2 col-md-2\">\r\n                <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End of Aggregate Section -->\r\n<!-- Legend Config Section -->\r\n<div class=\"configSection\">\r\n    <h4>Appearance Config</h4>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label for=\"legend\">Legend Shape</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n                    <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">\r\n                        {{legendType.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Slider Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\">\r\n                <span></span>\r\n                <span>Slider Zoom</span>\r\n            </label>\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\" *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n            <br />\r\n            <label title=\"Box Zoom\" class=\"c8y-checkbox\" style=\"height: 35px;\">\r\n                <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n                <span></span>\r\n                <span>Box Zoom</span>\r\n            </label>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <label title=\"Chart Color\" for=\"chartColor\">Chart Color</label>\r\n            <input type=\"text\" name=\"chartColor\" [(ngModel)]=\"config.colors\"\r\n                (change)=\"colorUpdateByTyping($event.target.value)\">\r\n        </div>\r\n        <div class=\"col-xs-3 col-md-3\">\r\n            <br />\r\n            <input class=\"form-control\" type=\"color\" placeholder=\"Enter color HEX\"\r\n                (change)=\"colorUpdate($event.target.value)\">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- End Of Legend Config Section -->",
                styles: [".alertInput{border:2px solid red}.configSection{display:grid;border:1px solid rgba(0,0,0,.3);border-radius:4px;margin:.25em;padding:.25em}.row{padding:.5em}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsT0FBTztZQUNYLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxFQUFFLEVBQUUsTUFBTTtvQkFDVixLQUFLLEVBQUUsTUFBTTtpQkFDZDtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsS0FBSztvQkFDVCxLQUFLLEVBQUUsS0FBSztpQkFDYjthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxXQUFXO29CQUNmLEtBQUssRUFBRSxrQkFBa0I7aUJBQzFCO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxZQUFZO29CQUNoQixLQUFLLEVBQUUsbUJBQW1CO2lCQUMzQjtnQkFDRDtvQkFDRSxFQUFFLEVBQUUscUJBQXFCO29CQUN6QixLQUFLLEVBQUUsNkJBQTZCO2lCQUNyQztnQkFDRDtvQkFDRSxFQUFFLEVBQUUsc0JBQXNCO29CQUMxQixLQUFLLEVBQUUsOEJBQThCO2lCQUN0QzthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxXQUFXO29CQUNmLEtBQUssRUFBRSxrQkFBa0I7aUJBQzFCO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxVQUFVO29CQUNkLEtBQUssRUFBRSxZQUFZO2lCQUNwQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxlQUFlO29CQUNuQixLQUFLLEVBQUUsc0JBQXNCO2lCQUM5QjtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsbUJBQW1CO29CQUN2QixLQUFLLEVBQUUsMEJBQTBCO2lCQUNsQzthQUNGO1NBQ0Y7S0FDRjtJQUNELFNBQVMsRUFBRTtRQUNUO1lBQ0UsRUFBRSxFQUFFLE9BQU87WUFDWCxLQUFLLEVBQUUsT0FBTztZQUNkLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsVUFBVTtZQUNkLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFFBQVEsRUFBRSxLQUFLO1NBRWhCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FNRjtJQUVELFNBQVMsRUFBRTtRQUNUO1lBQ0UsRUFBRSxFQUFFLE9BQU87WUFDWCxLQUFLLEVBQUUsT0FBTztZQUNkLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsVUFBVTtZQUNkLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFFBQVEsRUFBRSxLQUFLO1NBRWhCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FNRjtJQUNELFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxLQUFLLEVBQUUsUUFBUTtTQUNoQjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsV0FBVztTQUNuQjtRQUNEO1lBQ0UsSUFBSSxFQUFFLFdBQVc7WUFDakIsS0FBSyxFQUFFLGlCQUFpQjtTQUN6QjtRQUNEO1lBQ0UsSUFBSSxFQUFFLFVBQVU7WUFDaEIsS0FBSyxFQUFFLFVBQVU7U0FDbEI7UUFDRDtZQUNFLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLFNBQVM7U0FDakI7UUFDRDtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFLE9BQU87U0FDZjtLQUNGO0lBQ0QsZUFBZSxFQUFFO1FBQ2Y7WUFDRSxFQUFFLEVBQUUsS0FBSztZQUNULEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLE9BQU87U0FDZjtRQUNEO1lBQ0UsRUFBRSxFQUFFLElBQUk7WUFDUixLQUFLLEVBQUUsSUFBSTtTQUNaO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsUUFBUTtZQUNaLEtBQUssRUFBRSxhQUFhO1NBQ3JCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsSUFBSTtZQUNSLEtBQUssRUFBRSxJQUFJO1NBQ1o7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLE9BQU87U0FDZjtRQUNEO1lBQ0UsRUFBRSxFQUFFLFNBQVM7WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQjtRQUNEO1lBQ0UsRUFBRSxFQUFFLEtBQUs7WUFDVCxLQUFLLEVBQUUsS0FBSztTQUNiO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsS0FBSztZQUNULEtBQUssRUFBRSxLQUFLO1NBQ2I7S0FDRjtJQUNELFFBQVEsRUFBRSxFQUFFO0NBQ2IsQ0FBQTtBQVFELE1BQU0sT0FBTyx5QkFBeUI7SUFDcEM7UUFDQSxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2Isc0JBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQ2QsV0FBTSxHQUFnQjtZQUM3QixRQUFRLEVBQUUsRUFBRTtZQUNaLEtBQUssRUFBRSxFQUFFO1lBQ1QsYUFBYSxFQUFFLEVBQUU7WUFDakIsYUFBYSxFQUFFLEVBQUU7WUFDakIsSUFBSSxFQUFFLEVBQUU7WUFDUixNQUFNLEVBQUUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1lBQ2QsZUFBZSxFQUFFLEVBQUU7WUFDbkIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsRUFBRTtZQUNULFVBQVUsRUFBRSxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7WUFDWixpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsSUFBSSxFQUFFLEtBQUs7WUFDWCxjQUFjLEVBQUUsRUFBRTtZQUNsQixlQUFlLEVBQUUsRUFBRTtZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLFlBQVksRUFBRSxLQUFLO1lBQ25CLEtBQUssRUFBRSxFQUFFO1lBQ1QsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDcEIsT0FBTyxFQUFFLEVBQUU7WUFDWCxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUMzQixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLFFBQVE7YUFDZjtZQUNELE1BQU0sRUFBRSxFQUFFO1NBQ1gsQ0FBQztRQUNGLGNBQVMsR0FBRyxXQUFXLENBQUM7UUFJeEIseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQzdCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ1YsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBekM3QyxDQUFDO0lBMENqQixRQUFRO1FBQ04sSUFBSSxDQUFDLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN4QixzQ0FBc0M7UUFDdEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQzNFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLGdDQUFnQyxDQUFDO1NBQzNEO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztTQUM1QjtRQUNELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUdELHFDQUFxQztJQUNyQyxvREFBb0Q7SUFDcEQsZ0VBQWdFO0lBQ2hFLFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUNELG9CQUFvQixDQUFDLEdBQUc7UUFDdEIsK0NBQStDO0lBQ2pELENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFJRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUMxQjtJQUNILENBQUM7SUFDRCxXQUFXLENBQUMsYUFBYTtRQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZELENBQUM7SUFDRCxtQkFBbUIsQ0FBQyxVQUFVO1FBQzVCLElBQUksU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXZELENBQUM7SUFDRCxXQUFXLENBQUMsS0FBSztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QyxJQUFJLEtBQUssS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNwQixJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7YUFDbkM7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUUvQixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsS0FBSztRQUNyQixJQUFJLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLFlBQVksSUFBSSxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLGVBQWUsRUFBRTtZQUM3SCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUMxQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssVUFBVSxFQUFFO29CQUN6QixHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztpQkFDckI7YUFDRjtZQUNELEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzFDLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxVQUFVLEVBQUU7b0JBQ3pCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2lCQUN0QjthQUNGO1NBQ0Y7YUFBTSxJQUFJLEtBQUssS0FBSyxxQkFBcUIsSUFBSSxLQUFLLEtBQUssc0JBQXNCLElBQUksS0FBSyxLQUFLLG1CQUFtQixFQUFFO1lBQy9HLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzFDLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxVQUFVLEVBQUU7b0JBQ3pCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2lCQUN0QjthQUNGO1lBQ0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDMUMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLFVBQVUsRUFBRTtvQkFDekIsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7aUJBQ3JCO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxLQUFLO1FBQ3ZCLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7U0FFdEM7YUFBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBRWxDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7U0FDdEM7SUFDSCxDQUFDOzs7WUE5SkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLDhpbUJBQWtEOzthQUVuRDs7OztxQkFPRSxLQUFLO3lCQXNDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBTb2Z0d2FyZSBBRywgRGFybXN0YWR0LCBHZXJtYW55IGFuZC9vciBpdHMgbGljZW5zb3JzXHJcbiAqXHJcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3Byb2Nlc3MnO1xyXG5pbXBvcnQgeyBBZ2dyZWdhdGVEYXRhLCBDaGFydENvbmZpZywgU3RhY2sgfSBmcm9tICcuLi9tb2RlbC9jb25maWcubW9kYWwnO1xyXG5jb25zdCBjaGFydFZhbHVlcyA9IHtcclxuICBjaGFydFR5cGU6IFtcclxuXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgdmFsdWU6ICdCYXIgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICB2YWx1ZTogJ0xpbmUgQ2hhcnQnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwaWUnLFxyXG4gICAgICB2YWx1ZTogJ1BpZSBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncmFkYXInLFxyXG4gICAgICB2YWx1ZTogJ1JhZGFyIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwb2xhcicsXHJcbiAgICAgIHZhbHVlOiAnUG9sYXIgY2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3NjYXR0ZXInLFxyXG4gICAgICB2YWx1ZTogJ1NjYXR0ZXIgQ2hhcnQnXHJcbiAgICB9XHJcbiAgXSxcclxuICBjaGFydExheW91dDogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBMaW5lIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBMaW5lIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwb2xhcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ0xpbmUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2JhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ0JhcidcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZUhvcml6b250YWxCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgSG9yaXpvbnRhbCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWRIb3Jpem9udGFsQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBIb3Jpem9udGFsIEJhciBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncGllJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVQaWUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgUGllIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdyb3NlTW9kZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1Jvc2UgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3NjYXR0ZXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZVNjYXR0ZXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgU2NhdHRlciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnaG9yaXpvbnRhbFNjYXR0ZXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdIb3Jpem9udGFsIFNjYXR0ZXIgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgXSxcclxuICB5QXhpc1R5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICd2YWx1ZScsXHJcbiAgICAgIHZhbHVlOiAnVmFsdWUnLFxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcblxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICd0aW1lJyxcclxuICAgICAgdmFsdWU6ICdUaW1lJyxcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICBpZDogJ2xvZycsXHJcbiAgICAvLyAgIHZhbHVlOiAnTG9nJyxcclxuICAgIC8vICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIC8vIH0sXHJcbiAgXSxcclxuXHJcbiAgeEF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2NhdGVnb3J5JyxcclxuICAgICAgdmFsdWU6ICdDYXRlZ29yeScsXHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG5cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndGltZScsXHJcbiAgICAgIHZhbHVlOiAnVGltZScsXHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcbiAgbGVnZW5kVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpY29uOiAnY2lyY2xlJyxcclxuICAgICAgdmFsdWU6ICdDaXJjbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAncmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3JvdW5kUmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUm91bmQgUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3RyaWFuZ2xlJyxcclxuICAgICAgdmFsdWU6ICdUcmlhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdkaWFtb25kJyxcclxuICAgICAgdmFsdWU6ICdEaWFtb25kJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2Fycm93JyxcclxuICAgICAgdmFsdWU6ICdBcnJvdydcclxuICAgIH1cclxuICBdLFxyXG4gIGFnZ3JlZ2F0ZU1ldGhvZDogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3N1bScsXHJcbiAgICAgIHZhbHVlOiAnU3VtJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjb3VudCcsXHJcbiAgICAgIHZhbHVlOiAnQ291bnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1ExJyxcclxuICAgICAgdmFsdWU6ICdRMSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWVkaWFuJyxcclxuICAgICAgdmFsdWU6ICdRMiAvIE1lZGlhbidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUTMnLFxyXG4gICAgICB2YWx1ZTogJ1EzJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdmaXJzdCcsXHJcbiAgICAgIHZhbHVlOiAnRmlyc3QnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2F2ZXJhZ2UnLFxyXG4gICAgICB2YWx1ZTogJ0F2ZXJhZ2UnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21pbicsXHJcbiAgICAgIHZhbHVlOiAnTWluJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtYXgnLFxyXG4gICAgICB2YWx1ZTogJ01heCdcclxuICAgIH0sXHJcbiAgXSxcclxuICBsaXN0TmFtZTogJycsXHJcbn1cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdsaWItc21hcnQtY2hhcnQtY29uZmlnJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNtYXJ0Q2hhcnRDb25maWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgZmxhZyA9IGZhbHNlO1xyXG4gIHVzZXJTZWxlY3RlZENvbG9yID0gW107XHJcbiAgQElucHV0KCkgY29uZmlnOiBDaGFydENvbmZpZyA9IHtcclxuICAgIGxpc3ROYW1lOiAnJyxcclxuICAgIHRpdGxlOiAnJyxcclxuICAgIHBpZVNsaWNlbk5hbWU6ICcnLFxyXG4gICAgcGllU2xpY2VWYWx1ZTogJycsXHJcbiAgICB0eXBlOiAnJyxcclxuICAgIGxheW91dDogJycsXHJcbiAgICBkYXRhU291cmNlOiAnJyxcclxuICAgIGRhdGFTb3VyY2VWYWx1ZTogJycsXHJcbiAgICB4QXhpczogJycsXHJcbiAgICB5QXhpczogJycsXHJcbiAgICBzbW9vdGhMaW5lOiBmYWxzZSxcclxuICAgIGFwaVVybDogJycsXHJcbiAgICBmb250U2l6ZTogMTIsXHJcbiAgICB4QXhpc1JvdGF0ZUxhYmVsczogMCxcclxuICAgIHlBeGlzUm90YXRlTGFiZWxzOiAwLFxyXG4gICAgYXJlYTogZmFsc2UsXHJcbiAgICB5QXhpc0RpbWVuc2lvbjogJycsXHJcbiAgICByYWRhckRpbWVuc2lvbnM6ICcnLFxyXG4gICAgYWRkU3RhY2s6IGZhbHNlLFxyXG4gICAgc2hvd0FwaUlucHV0OiBmYWxzZSxcclxuICAgIHN0YWNrOiBbXSxcclxuICAgIHN0YWNrTGlzdDogU3RhY2tbJyddLFxyXG4gICAgYWdnckFycjogW10sXHJcbiAgICBhZ2dyTGlzdDogQWdncmVnYXRlRGF0YVsnJ10sXHJcbiAgICBsZWdlbmQ6IHtcclxuICAgICAgaWNvbjogJycsXHJcbiAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgIHR5cGU6ICdzY3JvbGwnXHJcbiAgICB9LFxyXG4gICAgcmFkaXVzOiBbXVxyXG4gIH07XHJcbiAgY2hhcnREYXRhID0gY2hhcnRWYWx1ZXM7XHJcbiAgY2hhcnRMYXlvdXREYXRhO1xyXG4gIGFnZ3JlZ2F0aW9uTWV0aG9kcztcclxuXHJcbiAgaXNHcm91cEJ5SW5BZ2dyZWdhdGUgPSBmYWxzZTtcclxuICBpc0FnZ3JBZGRlZCA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBjb25maWdEYXRhOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuYWdncmVnYXRpb25NZXRob2RzID0gY2hhcnRWYWx1ZXMuYWdncmVnYXRlTWV0aG9kO1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QgPSBbXTtcclxuICAgIHRoaXMuY29uZmlnLmxlZ2VuZCA9IHt9O1xyXG4gICAgLy8gRGVmYXVsdCB2YWx1ZSBmb3IgZGF0YWh1YiBzcWwgcXVlcnlcclxuICAgIGlmICh0aGlzLmNvbmZpZy5kYXRhaHViVXJsID09PSBudWxsIHx8IHRoaXMuY29uZmlnLmRhdGFodWJVcmwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmNvbmZpZy5kYXRhaHViVXJsID0gXCJzZXJ2aWNlL2RhdGFodWIvc3FsP3ZlcnNpb249djFcIjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmNvbmZpZy5zcWxMaW1pdCA9PT0gbnVsbCB8fCB0aGlzLmNvbmZpZy5zcWxMaW1pdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNxbExpbWl0ID0gMTAwO1xyXG4gICAgfVxyXG4gICAgLy8gVG8gaW5pdGlhbGl6ZSB0aGUgY2hhcnQgbGF5b3V0IGRyb3Bkb3duXHJcbiAgICB0aGlzLm9uU2VsZWN0aW9uKHRoaXMuY29uZmlnLnR5cGUpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIGFkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICAvLyBpZiBzdGFja0xpc3QgaXMgZW1wdHksIGFkZCB0b3RhbCB0byB0aGUgc3RhY2tMaXN0XHJcbiAgLy8gaWYgc3RhY2tMaXN0IGlzIG5vdCBlbXB0eSwgYWRkIGFub3RoZXIgc3RhY2sgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIHN0YWNrQWRkZWQoc3RhY2spIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdCA9IFtdO1xyXG4gICAgaWYgKHN0YWNrKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHlBeGlzRGltZW5zaW9uVXBkYXRlKHZhbCkge1xyXG4gICAgLy8gY29uc29sZS5sb2codmFsLCB0aGlzLmNvbmZpZy55QXhpc0RpbWVuc2lvbilcclxuICB9XHJcbiAgZGVsZXRlU3RhY2tWYWx1ZShzdGFjaywgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxuXHJcbiAgXHJcblxyXG4gIGFkZEFub3RoZXJTdGFjaygpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICB9XHJcbiAgYWRkQW5vdGhlckFnZ3JlZ2F0ZSgpIHtcclxuICAgIHRoaXMuaXNBZ2dyQWRkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QucHVzaChuZXcgQWdncmVnYXRlRGF0YSgpKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUFnZ3JWYWx1ZShhZ2dyLCBpbmRleCkge1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hZ2dyTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5pc0FnZ3JBZGRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBjb2xvclVwZGF0ZShjb2xvclNlbGVjdGVkKSB7XHJcbiAgICB0aGlzLnVzZXJTZWxlY3RlZENvbG9yID0gWy4uLnRoaXMudXNlclNlbGVjdGVkQ29sb3IsIGNvbG9yU2VsZWN0ZWRdO1xyXG4gICAgdGhpcy5jb25maWcuY29sb3JzID0gdGhpcy51c2VyU2VsZWN0ZWRDb2xvci5qb2luKCcsJylcclxuICB9XHJcbiAgY29sb3JVcGRhdGVCeVR5cGluZyhjb2xvclR5cGVkKSB7XHJcbiAgICBsZXQgam9pbmVkQXJyID0gWy4uLnRoaXMudXNlclNlbGVjdGVkQ29sb3IsIC4uLmNvbG9yVHlwZWQuc3BsaXQoJywnKV07XHJcbiAgICB0aGlzLnVzZXJTZWxlY3RlZENvbG9yID0gWy4uLm5ldyBTZXQoWy4uLmpvaW5lZEFycl0pXVxyXG5cclxuICB9XHJcbiAgb25TZWxlY3Rpb24odmFsdWUpIHtcclxuICAgIHRoaXMuY2hhcnREYXRhLmNoYXJ0TGF5b3V0LmZpbHRlcih2YWwgPT4ge1xyXG4gICAgICBpZiAodmFsdWUgPT09IHZhbC5pZCkge1xyXG4gICAgICAgIHRoaXMuY2hhcnRMYXlvdXREYXRhID0gdmFsLmxheW91dDtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHRoaXMuY29uZmlnLmFkZFN0YWNrID0gZmFsc2U7XHJcblxyXG4gIH1cclxuICBvbkxheW91dFNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSAnc2ltcGxlQmFyJyB8fCB2YWx1ZSA9PT0gJ3N0YWNrZWRCYXInIHx8IHZhbHVlID09PSAnc2ltcGxlJyB8fCB2YWx1ZSA9PT0gJ3N0YWNrZWQnIHx8IHZhbHVlID09PSAnc2ltcGxlU2NhdHRlcicpIHtcclxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKSB7XHJcbiAgICAgICAgaWYgKHZhbC5pZCA9PT0gJ2NhdGVnb3J5Jykge1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueEF4aXNUeXBlKSB7XHJcbiAgICAgICAgaWYgKHZhbC5pZCA9PT0gJ2NhdGVnb3J5Jykge1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnc2ltcGxlSG9yaXpvbnRhbEJhcicgfHwgdmFsdWUgPT09ICdzdGFja2VkSG9yaXpvbnRhbEJhcicgfHwgdmFsdWUgPT09ICdob3Jpem9udGFsU2NhdHRlcicpIHtcclxuICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKSB7XHJcbiAgICAgICAgaWYgKHZhbC5pZCA9PT0gJ2NhdGVnb3J5Jykge1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWwuaWQgPT09ICdjYXRlZ29yeScpIHtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkYXRhU291cmNlU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09ICdBUEknKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZGF0YWh1YicpIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dBcGlJbnB1dCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBvblNlbGVjdGlvbiwgb25MYXlvdXRTZWxlY3Rpb24sIGRhdGFTb3VyY2VTZWxlY3Rpb24gaXMgY2FsbGVkLCB0aGVuIHN1Ym1pdCBkYXRhIGFuZCBlbWl0IGNvbmZpZ1xyXG4gIC8vIFN1Ym1pdERhdGEoKSB7XHJcbiAgLy8gICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgLy8gICAgIGlmIChlbGVtZW50LmFnZ3JEaW1lc25pb24gPT09IHRoaXMuY29uZmlnLmdyb3VwQnkpIHtcclxuICAvLyAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gdHJ1ZTtcclxuICAvLyAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICB0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlID0gZmFsc2U7XHJcbiAgLy8gICAgIH1cclxuICAvLyAgIH0pO1xyXG4gIC8vICAgaWYgKHRoaXMuY29uZmlnLmFyZWEgPT09IHRydWUpIHtcclxuICAvLyAgICAgaWYgKHRoaXMuY29uZmlnLmFyZWFPcGFjaXR5ID09IG51bGwpIHtcclxuICAvLyAgICAgICB0aGlzLmNvbmZpZy5hcmVhID0ge307XHJcbiAgLy8gICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgdGhpcy5jb25maWcuYXJlYSA9IHtcclxuICAvLyAgICAgICAgICdvcGFjaXR5JzogdGhpcy5jb25maWcuYXJlYU9wYWNpdHlcclxuICAvLyAgICAgICB9O1xyXG4gIC8vICAgICB9XHJcblxyXG5cclxuICAvLyAgIH0gZWxzZSB7XHJcbiAgLy8gICAgIHRoaXMuY29uZmlnLmFyZWEgPSBudWxsO1xyXG4gIC8vICAgfVxyXG4gIC8vICAgaWYgKCF0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlKSB7XHJcbiAgLy8gICAgIHRoaXMuY29uZmlnRGF0YS5lbWl0KHRoaXMuY29uZmlnKTtcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gfVxyXG5cclxufVxyXG4iXX0=