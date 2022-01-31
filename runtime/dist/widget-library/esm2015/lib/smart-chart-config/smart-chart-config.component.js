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
                template: "<div class=\"form-group\">\r\n    <div class=\"form-group\">\r\n        <label for=\"title\">Chart Title</label>\r\n        <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        <div >\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n  \r\n    <div class=\"form-group\">\r\n        <form>\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                \r\n            </label>\r\n            \r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\" placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n\r\n            </label>\r\n        </form>\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            &nbsp;&nbsp;<input class=\"form-control\" type=\"text\" [(ngModel)]=\"config.apiUrl\">\r\n        </ng-container>\r\n     \r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n            <div><textarea class=\"form-control\" placeholder=\"Sql Query\"  rows=\"3\" cols=\"30\" [(ngModel)]=\"config.sqlQuery\"></textarea>\r\n            </div>\r\n        </ng-container>\r\n      \r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"type\">Chart Type</label>\r\n        <div class=\"c8y-select-wrapper\">\r\n            <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                [(ngModel)]=\"config.type\">\r\n                <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type=='pie'\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n\r\n    <div *ngIf=\"config.type==='line'\">\r\n        <label title=\"Area\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n            <span></span>\r\n            <span>Area</span>\r\n        </label>\r\n        <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n            <span></span>\r\n            <span>Smooth Line</span>\r\n        </label><br>\r\n    </div>\r\n    <!-- dont show div if config.type is pie or radar -->\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type=='radar'\">\r\n        <label for=\"radarDimensions\">Radar Dimensions</label>\r\n        <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n    </div>\r\n    <!-- Dropdown for Aggregation / group by methods  -->\r\n    <div *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"form-group\">\r\n                <label for=\"aggregateDimension\">Dimension </label>\r\n                <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                    [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n\r\n                <label for=\"aggregation\">Method</label>\r\n                <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                    <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                    </option>\r\n                </select>\r\n\r\n\r\n                <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <div class=\"form-group\" *ngIf=\"isAggrAdded\">\r\n            <label for=\"groupByDimension\">Group By</label>\r\n            <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Dropdown for Legend Icon -->\r\n    <label for=\"legend\">Legend config</label>\r\n    <div class=\"c8y-select-wrapper\">\r\n        <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n            <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">{{legendType.value}}\r\n            </option>\r\n        </select>\r\n    </div>\r\n    <!-- Pie chart options -->\r\n    <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"radius\">Pie Radius</label>\r\n        <div>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"pieConfig\">Pie Slice Config</label>\r\n        <div>\r\n        <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\" [(ngModel)]=\"config.pieBorderRadius\">\r\n       \r\n        <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\"  value=\"0\"[(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n     </div>\r\n\r\n    <!-- For scatter bubble size -->\r\n    <div *ngIf=\"config.type==='scatter'\">\r\n        <label title=\"Bubble Size\"for=\"symbolSize\">Bubble Size</label>\r\n        <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n            [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n\r\n    </div>\r\n    <!-- stack container -->\r\n    <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\">\r\n        <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div style=\"margin-right: 0px;\">\r\n                <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                    <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                        (click)=\"stackAdded($event.target.checked)\">\r\n                    <span></span>\r\n                    <span>Add Stack</span>\r\n                </label>\r\n            </div>\r\n            <div *ngIf=\"config.addStack\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n        <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\" >\r\n            <span></span>\r\n            <span>Slider Zoom</span>\r\n        </label>\r\n        <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n            <span></span>\r\n            <span>Box Zoom</span>\r\n        </label>\r\n    </div>\r\n    <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"stackName\">Stack Name</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <label for=\"stackValues\">Stack Values</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div>\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n",
                styles: ["div{margin-top:5px;margin-right:5px;margin-bottom:5px}.alertInput{border:2px solid red}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFckYsT0FBTyxFQUFFLGFBQWEsRUFBZSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUU7UUFFVDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsS0FBSyxFQUFFLFlBQVk7U0FDcEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxLQUFLO1lBQ1QsS0FBSyxFQUFFLFdBQVc7U0FDbkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsS0FBSyxFQUFFLGFBQWE7U0FDckI7UUFDRDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFLGVBQWU7U0FDdkI7S0FDRjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLG1CQUFtQjtpQkFDM0I7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7YUFDRjtTQUNGO1FBQ0Q7WUFD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Q0FBQztJQUVELHFHQUFxRztJQUNyRyxVQUFVO1FBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BDLElBQUksT0FBTyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDakQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDdkI7YUFBSztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO0lBRUgsQ0FBQzs7O1lBdExGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxrbVlBQWtEOzthQUVuRDs7OztxQkFNRSxLQUFLO3lCQW1DTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBTb2Z0d2FyZSBBRywgRGFybXN0YWR0LCBHZXJtYW55IGFuZC9vciBpdHMgbGljZW5zb3JzXHJcbiAqXHJcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3Byb2Nlc3MnO1xyXG5pbXBvcnQgeyBBZ2dyZWdhdGVEYXRhLCBDaGFydENvbmZpZywgU3RhY2sgfSBmcm9tICcuLi9tb2RlbC9jb25maWcubW9kYWwnO1xyXG5jb25zdCBjaGFydFZhbHVlcyA9IHtcclxuICBjaGFydFR5cGU6IFtcclxuXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgdmFsdWU6ICdCYXIgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICB2YWx1ZTogJ0xpbmUgQ2hhcnQnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwaWUnLFxyXG4gICAgICB2YWx1ZTogJ1BpZSBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncmFkYXInLFxyXG4gICAgICB2YWx1ZTogJ1JhZGFyIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwb2xhcicsXHJcbiAgICAgIHZhbHVlOiAnUG9sYXIgY2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3NjYXR0ZXInLFxyXG4gICAgICB2YWx1ZTogJ1NjYXR0ZXIgQ2hhcnQnXHJcbiAgICB9XHJcbiAgXSxcclxuICBjaGFydExheW91dDogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1NpbXBsZSBMaW5lIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBMaW5lIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdwb2xhcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnbGluZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ0xpbmUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2JhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ0JhcidcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnYmFyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZUhvcml6b250YWxCYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgSG9yaXpvbnRhbCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3N0YWNrZWRIb3Jpem9udGFsQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU3RhY2tlZCBIb3Jpem9udGFsIEJhciBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncGllJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVQaWUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgUGllIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdyb3NlTW9kZScsXHJcbiAgICAgICAgICB2YWx1ZTogJ1Jvc2UgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3NjYXR0ZXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3NpbXBsZVNjYXR0ZXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgU2NhdHRlciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnaG9yaXpvbnRhbFNjYXR0ZXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdIb3Jpem9udGFsIFNjYXR0ZXIgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgXSxcclxuICB5QXhpc1R5cGU6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICd2YWx1ZScsXHJcbiAgICAgIHZhbHVlOiAnVmFsdWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjYXRlZ29yeScsXHJcbiAgICAgIHZhbHVlOiAnQ2F0ZWdvcnknLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG5cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndGltZScsXHJcbiAgICAgIHZhbHVlOiAnVGltZScsXHJcbiAgICAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICB9LFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICBpZDogJ2xvZycsXHJcbiAgICAvLyAgIHZhbHVlOiAnTG9nJyxcclxuICAgIC8vICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIC8vIH0sXHJcbiAgXSxcclxuXHJcbiAgeEF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcbiAgbGVnZW5kVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpY29uOiAnY2lyY2xlJyxcclxuICAgICAgdmFsdWU6ICdDaXJjbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAncmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3JvdW5kUmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUm91bmQgUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3RyaWFuZ2xlJyxcclxuICAgICAgdmFsdWU6ICdUcmlhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdkaWFtb25kJyxcclxuICAgICAgdmFsdWU6ICdEaWFtb25kJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2Fycm93JyxcclxuICAgICAgdmFsdWU6ICdBcnJvdydcclxuICAgIH1cclxuICBdLFxyXG4gIGFnZ3JlZ2F0ZU1ldGhvZDogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3N1bScsXHJcbiAgICAgIHZhbHVlOiAnU3VtJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjb3VudCcsXHJcbiAgICAgIHZhbHVlOiAnQ291bnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1ExJyxcclxuICAgICAgdmFsdWU6ICdRMSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWVkaWFuJyxcclxuICAgICAgdmFsdWU6ICdRMiAvIE1lZGlhbidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUTMnLFxyXG4gICAgICB2YWx1ZTogJ1EzJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdmaXJzdCcsXHJcbiAgICAgIHZhbHVlOiAnRmlyc3QnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2F2ZXJhZ2UnLFxyXG4gICAgICB2YWx1ZTogJ0F2ZXJhZ2UnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21pbicsXHJcbiAgICAgIHZhbHVlOiAnTWluJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtYXgnLFxyXG4gICAgICB2YWx1ZTogJ01heCdcclxuICAgIH0sXHJcbiAgXSxcclxuICBsaXN0TmFtZTogJycsXHJcbn1cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdsaWItc21hcnQtY2hhcnQtY29uZmlnJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNtYXJ0Q2hhcnRDb25maWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgZmxhZyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogQ2hhcnRDb25maWcgPSB7XHJcbiAgICBsaXN0TmFtZTogJycsXHJcbiAgICB0aXRsZTogJycsXHJcbiAgICBwaWVTbGljZW5OYW1lOiAnJyxcclxuICAgIHBpZVNsaWNlVmFsdWU6ICcnLFxyXG4gICAgdHlwZTogJycsXHJcbiAgICBsYXlvdXQ6ICcnLFxyXG4gICAgZGF0YVNvdXJjZTogJycsXHJcbiAgICBkYXRhU291cmNlVmFsdWU6ICcnLFxyXG4gICAgeEF4aXM6ICcnLFxyXG4gICAgeUF4aXM6ICcnLFxyXG4gICAgc21vb3RoTGluZTogZmFsc2UsXHJcbiAgICBhcGlVcmw6ICcnLFxyXG4gICAgYXJlYTogZmFsc2UsXHJcbiAgICB5QXhpc0RpbWVuc2lvbjogJycsXHJcbiAgICByYWRhckRpbWVuc2lvbnM6ICcnLFxyXG4gICAgYWRkU3RhY2s6IGZhbHNlLFxyXG4gICAgc2hvd0FwaUlucHV0OiBmYWxzZSxcclxuICAgIHN0YWNrOiBbXSxcclxuICAgIHN0YWNrTGlzdDogU3RhY2tbJyddLFxyXG4gICAgYWdnckFycjogW10sXHJcbiAgICBhZ2dyTGlzdDogQWdncmVnYXRlRGF0YVsnJ10sXHJcbiAgICBsZWdlbmQ6IHtcclxuICAgICAgaWNvbjogJycsXHJcbiAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgIHR5cGU6ICdzY3JvbGwnXHJcbiAgICB9LFxyXG4gICAgcmFkaXVzOiBbXVxyXG4gIH07XHJcbiAgY2hhcnREYXRhID0gY2hhcnRWYWx1ZXM7XHJcbiAgY2hhcnRMYXlvdXREYXRhO1xyXG4gIGFnZ3JlZ2F0aW9uTWV0aG9kcztcclxuXHJcbiAgaXNHcm91cEJ5SW5BZ2dyZWdhdGUgPSBmYWxzZTtcclxuICBpc0FnZ3JBZGRlZCA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBjb25maWdEYXRhOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuYWdncmVnYXRpb25NZXRob2RzID0gY2hhcnRWYWx1ZXMuYWdncmVnYXRlTWV0aG9kO1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QgPSBbXTtcclxuICAgIHRoaXMuY29uZmlnLmxlZ2VuZD17fTtcclxuICB9XHJcblxyXG5cclxuICAvLyBhZGQgYW5vdGhlciBzdGFjayB0byB0aGUgc3RhY2tMaXN0XHJcbiAgLy8gaWYgc3RhY2tMaXN0IGlzIGVtcHR5LCBhZGQgdG90YWwgdG8gdGhlIHN0YWNrTGlzdFxyXG4gIC8vIGlmIHN0YWNrTGlzdCBpcyBub3QgZW1wdHksIGFkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICBzdGFja0FkZGVkKHN0YWNrKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QgPSBbXTtcclxuICAgIGlmIChzdGFjaykge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlU3RhY2tWYWx1ZShzdGFjaywgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlU3RhY2sgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2hhbmdlcyB0aGUgdHlwZSBvZiBjaGFydFxyXG4gIC8vIHVwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGxheW91dCBvZiB0aGUgY2hhcnRcclxuICAvLyB1cGRhdGVTdGFjayBpcyBjYWxsZWQgd2hlbiB0aGUgdXNlciBjaGFuZ2VzIHRoZSBkYXRhIHNvdXJjZSBvZiB0aGUgY2hhcnRcclxuICB1cGRhdGVTdGFjaygpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hcGlVcmwpIHtcclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdiYXInKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxheW91dCA9PT0gJ3N0YWNrZWRCYXInKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICd0b3RhbCc7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gdGhpcy5jb25maWcuc3RhY2tMaXN0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sYXlvdXQgPT09ICdzdGFja2VkTGluZScpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJ3RvdGFsJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSB0aGlzLmNvbmZpZy5zdGFja0xpc3Q7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQW5vdGhlclN0YWNrKCkge1xyXG4gICAgdGhpcy5jb25maWcuc3RhY2tMaXN0LnB1c2gobmV3IFN0YWNrKCkpO1xyXG4gIH1cclxuICBhZGRBbm90aGVyQWdncmVnYXRlKCkge1xyXG4gICAgdGhpcy5pc0FnZ3JBZGRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5wdXNoKG5ldyBBZ2dyZWdhdGVEYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQWdnclZhbHVlKGFnZ3IsIGluZGV4KSB7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFnZ3JMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uU2VsZWN0aW9uKHZhbHVlKSB7XHJcbiAgICB0aGlzLmNoYXJ0RGF0YS5jaGFydExheW91dC5maWx0ZXIodmFsID0+IHtcclxuICAgICAgaWYgKHZhbHVlID09PSB2YWwuaWQpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0TGF5b3V0RGF0YSA9IHZhbC5sYXlvdXQ7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB0aGlzLmNvbmZpZy5hZGRTdGFjayA9IGZhbHNlO1xyXG5cclxuICB9XHJcbiAgb25MYXlvdXRTZWxlY3Rpb24odmFsdWUpIHtcclxuICAgIGlmKHZhbHVlPT09J3NpbXBsZUJhcicgfHwgdmFsdWU9PT0nc3RhY2tlZEJhcid8fCB2YWx1ZT09PSdzaW1wbGUnfHx2YWx1ZT09PSdzdGFja2VkJyB8fHZhbHVlPT09J3NpbXBsZVNjYXR0ZXInKXtcclxuICAgICAgZm9yKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS55QXhpc1R5cGUpe1xyXG4gICAgICAgIGlmKHZhbC5pZD09PSdjYXRlZ29yeScpe1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvcihjb25zdCB2YWwgb2YgdGhpcy5jaGFydERhdGEueEF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1lbHNlIGlmKHZhbHVlPT09J3NpbXBsZUhvcml6b250YWxCYXInIHx8IHZhbHVlPT09J3N0YWNrZWRIb3Jpem9udGFsQmFyJyB8fCB2YWx1ZSA9PT0naG9yaXpvbnRhbFNjYXR0ZXInKXtcclxuICAgICAgZm9yKGNvbnN0IHZhbCBvZiB0aGlzLmNoYXJ0RGF0YS55QXhpc1R5cGUpe1xyXG4gICAgICAgIGlmKHZhbC5pZD09PSdjYXRlZ29yeScpe1xyXG4gICAgICAgICAgdmFsLmRpc2FibGVkPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3IoY29uc3QgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnhBeGlzVHlwZSl7XHJcbiAgICAgICAgaWYodmFsLmlkPT09J2NhdGVnb3J5Jyl7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRhdGFTb3VyY2VTZWxlY3Rpb24odmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gJ0FQSScpIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0FwaUlucHV0ID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IGZhbHNlO1xyXG5cclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdkYXRhaHViJykge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0FwaUlucHV0ID0gZmFsc2U7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0FwaUlucHV0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIG9uU2VsZWN0aW9uLCBvbkxheW91dFNlbGVjdGlvbiwgZGF0YVNvdXJjZVNlbGVjdGlvbiBpcyBjYWxsZWQsIHRoZW4gc3VibWl0IGRhdGEgYW5kIGVtaXQgY29uZmlnXHJcbiAgU3VibWl0RGF0YSgpIHtcclxuICAgIHRoaXMuY29uZmlnLmFnZ3JMaXN0LmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQuYWdnckRpbWVzbmlvbiA9PT0gdGhpcy5jb25maWcuZ3JvdXBCeSkge1xyXG4gICAgICAgIHRoaXMuaXNHcm91cEJ5SW5BZ2dyZWdhdGUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaXNHcm91cEJ5SW5BZ2dyZWdhdGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYXJlYSA9PT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLmNvbmZpZy5hcmVhID0ge307XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmlzR3JvdXBCeUluQWdncmVnYXRlKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnRGF0YS5lbWl0KHRoaXMuY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=