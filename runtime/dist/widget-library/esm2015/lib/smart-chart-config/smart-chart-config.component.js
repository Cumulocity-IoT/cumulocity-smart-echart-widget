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
            title: 'DATA CHART',
            pieSlicenName: 'Date',
            pieSliceValue: 'PhoneSales',
            type: '',
            layout: '',
            dataSource: '',
            dataSourceValue: '',
            xAxis: '',
            yAxis: '',
            smoothLine: false,
            apiUrl: '',
            area: false,
            yAxisDimension: 'QuarterSales',
            radarDimensions: 'count,costOfRepair',
            addStack: false,
            showApiInput: false,
            stack: [],
            stackList: Stack[''],
            aggrArr: [],
            aggrList: AggregateData[''],
            // groupBy: '',
            legend: {
                icon: '',
                width: 330,
                type: 'scroll'
            },
            radius: []
        };
        // @Input() config: ChartConfig = {
        //   listName: '',
        //   title: 'DATA CHART',
        //   pieSlicenName: '',
        //   pieSliceValue: '',
        //   type: '',
        //   layout: '',
        //   dataSource: '',
        //   dataSourceValue: '',
        //   xAxis: '',
        //   yAxis: '',
        //   smoothLine: false,
        //   apiUrl: '',
        //   area: false,
        //   yAxisDimension: 'Temperature',
        //   radarDimensions: '',
        //   addStack: false,
        //   showApiInput: false,
        //   showDatahubInput: false,
        //   stack: [],
        //   stackList: Stack[''],
        //   aggrArr:[],
        //   aggrList: AggregateData[''],
        //   // groupBy: '',
        //   legend: {
        //     icon: '',
        //     width: 330,
        //     type: 'scroll'
        //   },
        //   radius: []
        // };
        //create output decorator to emit data
        this.chartData = chartValues;
        this.isGroupByInAggregate = false;
        this.isAggrAdded = false;
        this.configData = new EventEmitter();
    }
    ngOnInit() {
        this.aggregationMethods = chartValues.aggregateMethod;
        this.config.xAxis = 'Date';
        this.config.xAxis = 'value';
        this.config.xAxisDimension = 'PhoneSales';
        this.config.yAxisDimension = 'QuarterSales';
        this.config.apiUrl = 'https://democenter.gateway.webmethodscloud.com/gateway/ConnectedStoreAPIs/1.0/ConnectedStoreAPIs/getQuarterlySales';
        this.config.legend = {
            icon: 'diamond',
            top: '10%',
            type: 'scroll'
        };
        this.config.listName = 'SalesData';
        this.config.aggrList = [];
        // this.config.xAxisDimension = 'time';
        // this.config.yAxisDimension = 'c8y_Temperature.T.value';
        // this.config.sqlQuery = 'select * from t664142085Space.temperature';
        // this.config.apiUrl = 'service/datahub/sql?version=v1';
        // this.config.legend = {
        //   icon: 'diamond',
        //   top: '10%',
        //   type: 'scroll'
        // }
        // this.config.listName = 'rows';
        // this.config.aggrList = [];
    }
    //add another stack to the stackList
    //if stackList is empty, add total to the stackList
    //if stackList is not empty, add another stack to the stackList
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
    //updateStack is called when the user changes the type of chart
    //updateStack is called when the user changes the layout of the chart
    //updateStack is called when the user changes the data source of the chart
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
        if (value === 'simpleBar' || value === 'stackedBar' || value === 'simple' || value === "stacked" || value === 'simpleScatter') {
            for (let val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = true;
                }
            }
            for (let val of this.chartData.xAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
        }
        else if (value === 'simpleHorizontalBar' || value === 'stackedHorizontalBar' || value === 'horizontalScatter') {
            for (let val of this.chartData.yAxisType) {
                if (val.id === 'category') {
                    val.disabled = false;
                }
            }
            for (let val of this.chartData.xAxisType) {
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
        // console.log('config', this.config);
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
                selector: 'app-smart-chart-config',
                template: "<div class=\"form-group\">\r\n    <div class=\"form-group\">\r\n        <label for=\"title\">Chart Title</label>\r\n        <input type=\"text\" class=\"form-control\" name=\"title\" [(ngModel)]=\"config.title\">\r\n        <div >\r\n            <label for=\"listname\">List Name</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.listName\">\r\n        </div>\r\n    </div>\r\n    <!-- <div class=\"form-group\">\r\n\r\n        <label for=\"xAxisName\">X-Axis Name</label>\r\n        <input class=\"form-control\" name=\"xAxisName\" type=\"text\" [(ngModel)]=\"config.xAxisName\">\r\n        <label for=\"yAxisName\">Y-Axis Name</label>\r\n        <input class=\"form-control\" name=\"yAxisName\" type=\"text\" [(ngModel)]=\"config.yAxisName\">\r\n    </div> -->\r\n    <div class=\"form-group\">\r\n        <form>\r\n            <label for=\"api\" title=\"API URL\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"api\" name=\"dataSource\" value=\"API\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>API URL</span>\r\n                \r\n            </label>\r\n            <!-- <label for=\"device\" title=\"Device\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"device\" name=\"dataSource\" value=\"device\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\">\r\n                    <span></span>\r\n                    <span>Device</span>\r\n\r\n            </label> -->\r\n            <label for=\"datahub\" title=\"DataHub\" class=\"c8y-radio radio-inline\">\r\n                <input type=\"radio\" id=\"datahub\" name=\"dataSource\" value=\"datahub\"\r\n                    (change)=\"dataSourceSelection($event.target.value)\" [(ngModel)]=\"config.dataSource\" placeholder=\"Enter Relative URL\">\r\n                    <span></span>\r\n                    <span>DataHub</span>\r\n\r\n            </label>\r\n        </form>\r\n        <ng-container *ngIf=\"config.showApiInput\">\r\n            &nbsp;&nbsp;<input class=\"form-control\" type=\"text\" [(ngModel)]=\"config.apiUrl\">\r\n        </ng-container>\r\n        <!-- <ng-container *ngIf=\"!config.showApiInput\">\r\n            &nbsp;&nbsp;\r\n        </ng-container> -->\r\n        <ng-container *ngIf=\"config.showDatahubInput\">\r\n            <input class=\"form-control\" type=\"text\" placeholder=\"Datahub URL\" [(ngModel)]=\"config.apiUrl\">\r\n            <div><textarea class=\"form-control\" placeholder=\"Sql Query\"  rows=\"3\" cols=\"30\" [(ngModel)]=\"config.sqlQuery\"></textarea>\r\n            </div>\r\n        </ng-container>\r\n      \r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"type\">Chart Type</label>\r\n        <div class=\"c8y-select-wrapper\">\r\n            <select id=\"selectExample\" class=\"form-control\" name=\"type\" (change)=\"onSelection($event.target.value)\"\r\n                [(ngModel)]=\"config.type\">\r\n                <option *ngFor=\"let chartType of chartData.chartType\" value=\"{{chartType.id}}\">{{chartType.value}}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <!-- dont show div if config.type is scatter or radar -->\r\n        <div *ngIf=\" config.type!=='radar'\">\r\n            <label for=\"layout\">Chart Layout</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select name=\"layout\" id=\"selectExample\" class=\"form-control\" [(ngModel)]=\"config.layout\"\r\n                (change)=\"onLayoutSelection($event.target.value)\">\r\n                    <option *ngFor=\"let chartLayout of chartLayoutData\" value=\"{{chartLayout.id}}\">{{chartLayout.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"config.type=='pie'\">\r\n            <label for=\"listname\">PieSliceValue</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSliceValue\">\r\n            <label for=\"listname\">PieSliceName</label>\r\n            <input type=\"text\" class=\"form-control\" name=\"listname\" [(ngModel)]=\"config.pieSlicenName\">\r\n        </div>\r\n    </div>\r\n\r\n    <div *ngIf=\"config.type==='line'\">\r\n        <label title=\"Area\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.area\">\r\n            <span></span>\r\n            <span>Area</span>\r\n        </label>\r\n        <label title=\"Smooth Line\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"true\" [(ngModel)]=\"config.smoothLine\">\r\n            <span></span>\r\n            <span>Smooth Line</span>\r\n        </label><br>\r\n    </div>\r\n    <!-- dont show div if config.type is pie or radar -->\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"xAxisType\">X-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"xAxisType\" [(ngModel)]=\"config.xAxis\">\r\n                    <option *ngFor=\"let type of chartData.xAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"xAxisDimension\">X-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"url\" type=\"text\" [(ngModel)]=\"config.xAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type!=='pie' && config.type!=='radar'\">\r\n        <div class=\"form-group\" *ngIf=\"config.type!=='polar'\">\r\n            <label for=\"yAxisType\">Y-Axis Type</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select id=\"selectExample\" class=\"form-control\" name=\"yAxisType\" [(ngModel)]=\"config.yAxis\">\r\n                    <option *ngFor=\"let type of chartData.yAxisType\" value=\"{{type.id}}\"\r\n                    [disabled]='type.disabled'>{{type.value}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <label for=\"yAxisDimension\">Y-Axis Dimension</label>\r\n        <input class=\"form-control\" name=\"yAxisDimension\" type=\"text\" [(ngModel)]=\"config.yAxisDimension\">\r\n    </div>\r\n\r\n    <div class=\"form-group\" *ngIf=\"config.type=='radar'\">\r\n        <label for=\"radarDimensions\">Radar Dimensions</label>\r\n        <input class=\"form-control\" name=\"radarDimensions\" type=\"text\" [(ngModel)]=\"config.radarDimensions\">\r\n    </div>\r\n    <!-- Dropdown for Aggregation / group by methods  -->\r\n    <div *ngIf=\"config.type==='pie'||config.type==='bar'||config.type==='line' ||config.type==='polar' || config.type==='scatter' \">\r\n        <label for=\"aggregation\">Aggregate Method</label>\r\n        <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherAggregate()\">+</button>\r\n\r\n        <ng-container *ngFor=\"let item of config.aggrList;let i = index\">\r\n            <div class=\"form-group\">\r\n                <label for=\"aggregateDimension\">Dimension </label>\r\n                <input class=\"form-control\" name=\"aggregateDimension\" type=\"text\"\r\n                    [ngClass]=\"{'alertInput': isGroupByInAggregate === true}\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrDimesnion\">\r\n\r\n                <label for=\"aggregation\">Method</label>\r\n                <select name=\"aggregation\" id=\"selectMethod\" class=\"form-control\"\r\n                    [(ngModel)]=\"config.aggrList[i].aggrMethod\">\r\n                    <option *ngFor=\"let method of aggregationMethods\" value=\"{{method.id}}\">{{method.value}}\r\n                    </option>\r\n                </select>\r\n\r\n\r\n                <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteAggrValue($event,i)\">-</button>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <div class=\"form-group\" *ngIf=\"isAggrAdded\">\r\n            <label for=\"groupByDimension\">Group By</label>\r\n            <input class=\"form-control\" name=\"groupByDimension\" type=\"text\" [(ngModel)]=\"config.groupBy\">\r\n\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Dropdown for Legend Icon -->\r\n    <label for=\"legend\">Legend config</label>\r\n    <div class=\"c8y-select-wrapper\">\r\n        <select name=\"legend\" id=\"LegendSelect\" class=\"form-control\" [(ngModel)]=\"config.legend.icon\">\r\n            <option *ngFor=\"let legendType of chartData.legendType\" value=\"{{legendType.icon}}\">{{legendType.value}}\r\n            </option>\r\n        </select>\r\n    </div>\r\n    <!-- Pie chart options -->\r\n    <div id=\"pie-option-conatiner\" *ngIf=\"config.type==='pie'\">\r\n        <!-- <div id=\"pie-option-conatiner\" *ngIf=\"config.layout==='roseMode'\">\r\n            <label for=\"roseType\">RoseType</label>\r\n            <div class=\"c8y-select-wrapper\">\r\n                <select class=\"form-control\" name=\"roseType\" [(ngModel)]=\"config.roseType\">\r\n                    <option value=\"radius\">Radius\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div> -->\r\n        \r\n        <label for=\"radius\">Pie Radius</label>\r\n        <div>\r\n            <input class=\"form-control\" name=\"radius\" type=\"text\" placeholder=\"0%,100%\" [(ngModel)]=\"config.radius\">\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\" *ngIf=\"config.type==='pie'\">\r\n        <label for=\"pieConfig\">Pie Slice Config</label>\r\n        <div>\r\n        <label for=\"pieBorderRadius\">Border Radius</label>\r\n            <input class=\"form-control\" name=\"pieBorderRadius\" type=\"number\" min='0' max='30' placeholder=\"0\" value=\"0\" [(ngModel)]=\"config.pieBorderRadius\">\r\n       \r\n        <label for=\"pieBorderWidth\">Border Width</label>\r\n            <input class=\"form-control\" name=\"pieBorderWidth\" type=\"number\" min='0' max='30' placeholder=\"0\"  value=\"0\"[(ngModel)]=\"config.pieBorderWidth\">\r\n        </div>\r\n     </div>\r\n\r\n    <!-- For scatter bubble size -->\r\n    <div *ngIf=\"config.type==='scatter'\">\r\n        <label title=\"Bubble Size\"for=\"symbolSize\">Bubble Size</label>\r\n        <input class=\"form-control\" name=\"symbolSize\" type=\"number\" placeholder=\"Enter a number\"\r\n            [(ngModel)]=\"config.scatterSymbolSize\" min=\"5\" max=\"20\">\r\n\r\n    </div>\r\n    <!-- stack container -->\r\n    <div id=\"stack-conatiner\" *ngIf=\"config.type==='line' || config.type==='bar'\">\r\n        <div id=\"stack-container\" *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n            <div style=\"margin-right: 0px;\">\r\n                <label class=\"c8y-checkbox checkbox-inline\" title=\"addStack\">\r\n                    <input type=\"checkbox\" value=\"Add Stack\" [(ngModel)]=\"config.addStack\"\r\n                        (click)=\"stackAdded($event.target.checked)\">\r\n                    <span></span>\r\n                    <span>Add Stack</span>\r\n                </label>\r\n            </div>\r\n            <div *ngIf=\"config.addStack\">\r\n                <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"addAnotherStack()\">Add\r\n                    Another Stack</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div *ngIf=\"config.type==='line'  || config.type==='scatter'  || config.type==='bar'\">\r\n        <label title=\"Slider Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.sliderZoom\" >\r\n            <span></span>\r\n            <span>Slider Zoom</span>\r\n        </label>\r\n        <label title=\"Box Zoom\" class=\"c8y-checkbox\">\r\n            <input type=\"checkbox\" value=\"false\" [(ngModel)]=\"config.boxZoom\">\r\n            <span></span>\r\n            <span>Box Zoom</span>\r\n        </label>\r\n    </div>\r\n    <div *ngIf=\"config.layout==='stacked' || config.layout==='stackedBar'\">\r\n        <div *ngIf=\"config.addStack\">\r\n            <ng-container *ngFor=\"let item of config.stackList;let i = index\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"stackName\">Stack Name</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackName\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackName\">\r\n                    </div>\r\n                    <label for=\"stackValues\">Stack Values</label>\r\n                    <div>\r\n                        <input class=\"form-control\" name=\"stackValues\" type=\"text\"\r\n                            [(ngModel)]=\"config.stackList[i].stackValues\">\r\n                    </div>\r\n                    <div>\r\n                        <button class=\"btn btn-primary btn-xs btn-danger\" (click)=\"deleteStackValue($event,i)\">Delete\r\n                            Stack</button>\r\n                    </div>\r\n                </div>\r\n            </ng-container>\r\n            <button type=\"button\" class=\"btn btn-primary btn-xs\" (click)=\"updateStack()\">update</button>\r\n\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n<!-- <div>\r\n    <input type=\"submit\" (click)=\"SubmitData()\" value=\"Submit\" />\r\n</div> -->",
                styles: ["div{margin-top:5px;margin-right:5px;margin-bottom:5px}.alertInput{border:2px solid red}"]
            },] }
];
SmartChartConfigComponent.ctorParameters = () => [];
SmartChartConfigComponent.propDecorators = {
    config: [{ type: Input }],
    configData: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQvc3JjL2xpYi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBRXJGLE9BQU8sRUFBRSxhQUFhLEVBQWUsS0FBSyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFO1FBRVQ7WUFDRSxFQUFFLEVBQUUsS0FBSztZQUNULEtBQUssRUFBRSxXQUFXO1NBQ25CO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsTUFBTTtZQUNWLEtBQUssRUFBRSxZQUFZO1NBQ3BCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsS0FBSztZQUNULEtBQUssRUFBRSxXQUFXO1NBQ25CO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsT0FBTztZQUNYLEtBQUssRUFBRSxhQUFhO1NBQ3JCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsT0FBTztZQUNYLEtBQUssRUFBRSxhQUFhO1NBQ3JCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsU0FBUztZQUNiLEtBQUssRUFBRSxlQUFlO1NBQ3ZCO0tBQ0Y7SUFDRCxXQUFXLEVBQUU7UUFDWDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxRQUFRO29CQUNaLEtBQUssRUFBRSxtQkFBbUI7aUJBQzNCO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxTQUFTO29CQUNiLEtBQUssRUFBRSxvQkFBb0I7aUJBQzVCO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsRUFBRSxFQUFFLE9BQU87WUFDWCxNQUFN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UUFFdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BDLElBQUksT0FBTyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDakQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDdkI7YUFBSztZQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25DO0lBRUgsQ0FBQzs7O1lBdFBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxnaGJBQWtEOzthQUVuRDs7OztxQkFLRSxLQUFLO3lCQXVOTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICdwcm9jZXNzJztcclxuaW1wb3J0IHsgQWdncmVnYXRlRGF0YSwgQ2hhcnRDb25maWcsIFN0YWNrIH0gZnJvbSAnLi4vbW9kZWwvY29uZmlnLm1vZGFsJztcclxuY29uc3QgY2hhcnRWYWx1ZXMgPSB7XHJcbiAgY2hhcnRUeXBlOiBbXHJcblxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIHZhbHVlOiAnQmFyIENoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgdmFsdWU6ICdMaW5lIENoYXJ0JyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncGllJyxcclxuICAgICAgdmFsdWU6ICdQaWUgQ2hhcnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3JhZGFyJyxcclxuICAgICAgdmFsdWU6ICdSYWRhciBDaGFydCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICB2YWx1ZTogJ1BvbGFyIGNoYXJ0J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgdmFsdWU6ICdTY2F0dGVyIENoYXJ0J1xyXG4gICAgfVxyXG4gIF0sXHJcbiAgY2hhcnRMYXlvdXQ6IFtcclxuICAgIHtcclxuICAgICAgaWQ6ICdsaW5lJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdTaW1wbGUgTGluZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZCcsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgTGluZSBDaGFydCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAncG9sYXInLFxyXG4gICAgICBsYXlvdXQ6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2xpbmUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdMaW5lJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdiYXInLFxyXG4gICAgICAgICAgdmFsdWU6ICdCYXInXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2JhcicsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEJhciBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc3RhY2tlZEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVIb3Jpem9udGFsQmFyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIEhvcml6b250YWwgQmFyIENoYXJ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzdGFja2VkSG9yaXpvbnRhbEJhcicsXHJcbiAgICAgICAgICB2YWx1ZTogJ1N0YWNrZWQgSG9yaXpvbnRhbCBCYXIgQ2hhcnQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3BpZScsXHJcbiAgICAgIGxheW91dDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnc2ltcGxlUGllJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFBpZSBDaGFydCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAncm9zZU1vZGUnLFxyXG4gICAgICAgICAgdmFsdWU6ICdSb3NlIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdzY2F0dGVyJyxcclxuICAgICAgbGF5b3V0OiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdzaW1wbGVTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnU2ltcGxlIFNjYXR0ZXIgQ2hhcnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2hvcml6b250YWxTY2F0dGVyJyxcclxuICAgICAgICAgIHZhbHVlOiAnSG9yaXpvbnRhbCBTY2F0dGVyIENoYXJ0J1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgeUF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcbiAgXHJcbiAgeEF4aXNUeXBlOiBbXHJcbiAgICB7XHJcbiAgICAgIGlkOiAndmFsdWUnLFxyXG4gICAgICB2YWx1ZTogJ1ZhbHVlJyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnY2F0ZWdvcnknLFxyXG4gICAgICB2YWx1ZTogJ0NhdGVnb3J5JyxcclxuICAgICAgZGlzYWJsZWQ6ZmFsc2VcclxuXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ3RpbWUnLFxyXG4gICAgICB2YWx1ZTogJ1RpbWUnLFxyXG4gICAgICBkaXNhYmxlZDpmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgaWQ6ICdsb2cnLFxyXG4gICAgLy8gICB2YWx1ZTogJ0xvZycsXHJcbiAgICAvLyAgIGRpc2FibGVkOmZhbHNlXHJcbiAgICAvLyB9LFxyXG4gIF0sXHJcbiAgbGVnZW5kVHlwZTogW1xyXG4gICAge1xyXG4gICAgICBpY29uOiAnY2lyY2xlJyxcclxuICAgICAgdmFsdWU6ICdDaXJjbGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpY29uOiAncmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3JvdW5kUmVjdCcsXHJcbiAgICAgIHZhbHVlOiAnUm91bmQgUmVjdGFuZ2xlJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ3RyaWFuZ2xlJyxcclxuICAgICAgdmFsdWU6ICdUcmlhbmdsZSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGljb246ICdkaWFtb25kJyxcclxuICAgICAgdmFsdWU6ICdEaWFtb25kJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWNvbjogJ2Fycm93JyxcclxuICAgICAgdmFsdWU6ICdBcnJvdydcclxuICAgIH1cclxuICBdLFxyXG4gIGFnZ3JlZ2F0ZU1ldGhvZDogW1xyXG4gICAge1xyXG4gICAgICBpZDogJ3N1bScsXHJcbiAgICAgIHZhbHVlOiAnU3VtJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdjb3VudCcsXHJcbiAgICAgIHZhbHVlOiAnQ291bnQnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ1ExJyxcclxuICAgICAgdmFsdWU6ICdRMSdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnbWVkaWFuJyxcclxuICAgICAgdmFsdWU6ICdRMiAvIE1lZGlhbidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnUTMnLFxyXG4gICAgICB2YWx1ZTogJ1EzJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdmaXJzdCcsXHJcbiAgICAgIHZhbHVlOiAnRmlyc3QnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ2F2ZXJhZ2UnLFxyXG4gICAgICB2YWx1ZTogJ0F2ZXJhZ2UnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJ21pbicsXHJcbiAgICAgIHZhbHVlOiAnTWluJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICdtYXgnLFxyXG4gICAgICB2YWx1ZTogJ01heCdcclxuICAgIH0sXHJcbiAgXSxcclxuICBsaXN0TmFtZTogJycsXHJcbn1cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc21hcnQtY2hhcnQtY29uZmlnJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNtYXJ0Q2hhcnRDb25maWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGZsYWcgPSBmYWxzZTtcclxuICBASW5wdXQoKSBjb25maWc6IENoYXJ0Q29uZmlnID0ge1xyXG4gICAgbGlzdE5hbWU6ICcnLFxyXG4gICAgdGl0bGU6ICdEQVRBIENIQVJUJyxcclxuICAgIHBpZVNsaWNlbk5hbWU6ICdEYXRlJyxcclxuICAgIHBpZVNsaWNlVmFsdWU6ICdQaG9uZVNhbGVzJyxcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgbGF5b3V0OiAnJyxcclxuICAgIGRhdGFTb3VyY2U6ICcnLFxyXG4gICAgZGF0YVNvdXJjZVZhbHVlOiAnJyxcclxuICAgIHhBeGlzOiAnJyxcclxuICAgIHlBeGlzOiAnJyxcclxuICAgIHNtb290aExpbmU6IGZhbHNlLFxyXG4gICAgYXBpVXJsOiAnJyxcclxuICAgIGFyZWE6IGZhbHNlLFxyXG4gICAgeUF4aXNEaW1lbnNpb246ICdRdWFydGVyU2FsZXMnLFxyXG4gICAgcmFkYXJEaW1lbnNpb25zOiAnY291bnQsY29zdE9mUmVwYWlyJyxcclxuICAgIGFkZFN0YWNrOiBmYWxzZSxcclxuICAgIHNob3dBcGlJbnB1dDogZmFsc2UsXHJcbiAgICBzdGFjazogW10sXHJcbiAgICBzdGFja0xpc3Q6IFN0YWNrWycnXSxcclxuICAgIGFnZ3JBcnI6IFtdLFxyXG4gICAgYWdnckxpc3Q6IEFnZ3JlZ2F0ZURhdGFbJyddLFxyXG4gICAgLy8gZ3JvdXBCeTogJycsXHJcbiAgICBsZWdlbmQ6IHtcclxuICAgICAgaWNvbjogJycsXHJcbiAgICAgIHdpZHRoOiAzMzAsXHJcbiAgICAgIHR5cGU6ICdzY3JvbGwnXHJcbiAgICB9LFxyXG4gICAgcmFkaXVzOiBbXVxyXG4gIH07XHJcblxyXG4gIC8vIEBJbnB1dCgpIGNvbmZpZzogQ2hhcnRDb25maWcgPSB7XHJcbiAgLy8gICBsaXN0TmFtZTogJycsXHJcbiAgLy8gICB0aXRsZTogJ0RBVEEgQ0hBUlQnLFxyXG4gIC8vICAgcGllU2xpY2VuTmFtZTogJycsXHJcbiAgLy8gICBwaWVTbGljZVZhbHVlOiAnJyxcclxuICAvLyAgIHR5cGU6ICcnLFxyXG4gIC8vICAgbGF5b3V0OiAnJyxcclxuICAvLyAgIGRhdGFTb3VyY2U6ICcnLFxyXG4gIC8vICAgZGF0YVNvdXJjZVZhbHVlOiAnJyxcclxuICAvLyAgIHhBeGlzOiAnJyxcclxuICAvLyAgIHlBeGlzOiAnJyxcclxuICAvLyAgIHNtb290aExpbmU6IGZhbHNlLFxyXG4gIC8vICAgYXBpVXJsOiAnJyxcclxuICAvLyAgIGFyZWE6IGZhbHNlLFxyXG4gIC8vICAgeUF4aXNEaW1lbnNpb246ICdUZW1wZXJhdHVyZScsXHJcbiAgLy8gICByYWRhckRpbWVuc2lvbnM6ICcnLFxyXG4gIC8vICAgYWRkU3RhY2s6IGZhbHNlLFxyXG4gIC8vICAgc2hvd0FwaUlucHV0OiBmYWxzZSxcclxuICAvLyAgIHNob3dEYXRhaHViSW5wdXQ6IGZhbHNlLFxyXG4gIC8vICAgc3RhY2s6IFtdLFxyXG4gIC8vICAgc3RhY2tMaXN0OiBTdGFja1snJ10sXHJcbiAgLy8gICBhZ2dyQXJyOltdLFxyXG4gIC8vICAgYWdnckxpc3Q6IEFnZ3JlZ2F0ZURhdGFbJyddLFxyXG4gIC8vICAgLy8gZ3JvdXBCeTogJycsXHJcbiAgLy8gICBsZWdlbmQ6IHtcclxuICAvLyAgICAgaWNvbjogJycsXHJcbiAgLy8gICAgIHdpZHRoOiAzMzAsXHJcbiAgLy8gICAgIHR5cGU6ICdzY3JvbGwnXHJcbiAgLy8gICB9LFxyXG4gIC8vICAgcmFkaXVzOiBbXVxyXG4gIC8vIH07XHJcblxyXG5cclxuICAvL2NyZWF0ZSBvdXRwdXQgZGVjb3JhdG9yIHRvIGVtaXQgZGF0YVxyXG5cclxuICBjaGFydERhdGEgPSBjaGFydFZhbHVlcztcclxuICBjaGFydExheW91dERhdGE7XHJcbiAgYWdncmVnYXRpb25NZXRob2RzO1xyXG5cclxuICBpc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFnZ3JlZ2F0aW9uTWV0aG9kcyA9IGNoYXJ0VmFsdWVzLmFnZ3JlZ2F0ZU1ldGhvZDtcclxuXHJcbiAgICB0aGlzLmNvbmZpZy54QXhpcyA9ICdEYXRlJztcclxuICAgIHRoaXMuY29uZmlnLnhBeGlzID0gJ3ZhbHVlJztcclxuXHJcbiAgICB0aGlzLmNvbmZpZy54QXhpc0RpbWVuc2lvbiA9ICdQaG9uZVNhbGVzJztcclxuICAgIHRoaXMuY29uZmlnLnlBeGlzRGltZW5zaW9uID0gJ1F1YXJ0ZXJTYWxlcyc7XHJcblxyXG4gICAgdGhpcy5jb25maWcuYXBpVXJsID0gJ2h0dHBzOi8vZGVtb2NlbnRlci5nYXRld2F5LndlYm1ldGhvZHNjbG91ZC5jb20vZ2F0ZXdheS9Db25uZWN0ZWRTdG9yZUFQSXMvMS4wL0Nvbm5lY3RlZFN0b3JlQVBJcy9nZXRRdWFydGVybHlTYWxlcyc7XHJcbiAgICB0aGlzLmNvbmZpZy5sZWdlbmQgPSB7XHJcbiAgICAgIGljb246ICdkaWFtb25kJyxcclxuICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgdHlwZTogJ3Njcm9sbCdcclxuICAgIH1cclxuICAgIHRoaXMuY29uZmlnLmxpc3ROYW1lID0gJ1NhbGVzRGF0YSc7XHJcbiAgICB0aGlzLmNvbmZpZy5hZ2dyTGlzdCA9IFtdO1xyXG4gICAgLy8gdGhpcy5jb25maWcueEF4aXNEaW1lbnNpb24gPSAndGltZSc7XHJcbiAgICAvLyB0aGlzLmNvbmZpZy55QXhpc0RpbWVuc2lvbiA9ICdjOHlfVGVtcGVyYXR1cmUuVC52YWx1ZSc7XHJcbiAgICAvLyB0aGlzLmNvbmZpZy5zcWxRdWVyeSA9ICdzZWxlY3QgKiBmcm9tIHQ2NjQxNDIwODVTcGFjZS50ZW1wZXJhdHVyZSc7XHJcbiAgICAvLyB0aGlzLmNvbmZpZy5hcGlVcmwgPSAnc2VydmljZS9kYXRhaHViL3NxbD92ZXJzaW9uPXYxJztcclxuICAgIC8vIHRoaXMuY29uZmlnLmxlZ2VuZCA9IHtcclxuICAgIC8vICAgaWNvbjogJ2RpYW1vbmQnLFxyXG4gICAgLy8gICB0b3A6ICcxMCUnLFxyXG4gICAgLy8gICB0eXBlOiAnc2Nyb2xsJ1xyXG4gICAgLy8gfVxyXG4gICAgLy8gdGhpcy5jb25maWcubGlzdE5hbWUgPSAncm93cyc7XHJcbiAgICAvLyB0aGlzLmNvbmZpZy5hZ2dyTGlzdCA9IFtdO1xyXG5cclxuICB9XHJcblxyXG5cclxuICAvL2FkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICAvL2lmIHN0YWNrTGlzdCBpcyBlbXB0eSwgYWRkIHRvdGFsIHRvIHRoZSBzdGFja0xpc3RcclxuICAvL2lmIHN0YWNrTGlzdCBpcyBub3QgZW1wdHksIGFkZCBhbm90aGVyIHN0YWNrIHRvIHRoZSBzdGFja0xpc3RcclxuICBzdGFja0FkZGVkKHN0YWNrKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QgPSBbXTtcclxuICAgIGlmIChzdGFjaykge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5wdXNoKG5ldyBTdGFjaygpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlU3RhY2tWYWx1ZShzdGFjaywgaW5kZXgpIHtcclxuICAgIHRoaXMuY29uZmlnLnN0YWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxuICBcclxuICAvL3VwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIHR5cGUgb2YgY2hhcnRcclxuICAvL3VwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGxheW91dCBvZiB0aGUgY2hhcnRcclxuICAvL3VwZGF0ZVN0YWNrIGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGRhdGEgc291cmNlIG9mIHRoZSBjaGFydFxyXG4gIHVwZGF0ZVN0YWNrKCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFwaVVybCkge1xyXG4gICAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ2JhcicpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcubGF5b3V0ID09PSAnc3RhY2tlZEJhcicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJ3RvdGFsJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc3RhY2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSB0aGlzLmNvbmZpZy5zdGFja0xpc3Q7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ2xpbmUnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxheW91dCA9PT0gJ3N0YWNrZWRMaW5lJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnN0YWNrTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhY2sgPSAndG90YWwnO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZy5zdGFja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGFjayA9IHRoaXMuY29uZmlnLnN0YWNrTGlzdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YWNrID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRBbm90aGVyU3RhY2soKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5zdGFja0xpc3QucHVzaChuZXcgU3RhY2soKSk7XHJcbiAgfVxyXG4gIGlzQWdnckFkZGVkID0gZmFsc2U7XHJcbiAgYWRkQW5vdGhlckFnZ3JlZ2F0ZSgpIHtcclxuICAgIHRoaXMuaXNBZ2dyQWRkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QucHVzaChuZXcgQWdncmVnYXRlRGF0YSgpKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUFnZ3JWYWx1ZShhZ2dyLCBpbmRleCkge1xyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hZ2dyTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5pc0FnZ3JBZGRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgdGhpcy5jaGFydERhdGEuY2hhcnRMYXlvdXQuZmlsdGVyKHZhbCA9PiB7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gdmFsLmlkKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydExheW91dERhdGEgPSB2YWwubGF5b3V0O1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy5jb25maWcuYWRkU3RhY2sgPSBmYWxzZTtcclxuICAgIFxyXG4gIH1cclxuICBvbkxheW91dFNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgaWYodmFsdWU9PT0nc2ltcGxlQmFyJyB8fCB2YWx1ZT09PSdzdGFja2VkQmFyJ3x8IHZhbHVlPT09J3NpbXBsZSd8fHZhbHVlPT09XCJzdGFja2VkXCIgfHx2YWx1ZT09PSdzaW1wbGVTY2F0dGVyJyl7XHJcbiAgICAgIGZvcihsZXQgdmFsIG9mIHRoaXMuY2hhcnREYXRhLnlBeGlzVHlwZSl7XHJcbiAgICAgICAgaWYodmFsLmlkPT09J2NhdGVnb3J5Jyl7XHJcbiAgICAgICAgICB2YWwuZGlzYWJsZWQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGxldCB2YWwgb2YgdGhpcy5jaGFydERhdGEueEF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1lbHNlIGlmKHZhbHVlPT09J3NpbXBsZUhvcml6b250YWxCYXInIHx8IHZhbHVlPT09J3N0YWNrZWRIb3Jpem9udGFsQmFyJyB8fCB2YWx1ZSA9PT0naG9yaXpvbnRhbFNjYXR0ZXInKXtcclxuICAgICAgZm9yKGxldCB2YWwgb2YgdGhpcy5jaGFydERhdGEueUF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yKGxldCB2YWwgb2YgdGhpcy5jaGFydERhdGEueEF4aXNUeXBlKXtcclxuICAgICAgICBpZih2YWwuaWQ9PT0nY2F0ZWdvcnknKXtcclxuICAgICAgICAgIHZhbC5kaXNhYmxlZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGF0YVNvdXJjZVNlbGVjdGlvbih2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSAnQVBJJykge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93RGF0YWh1YklucHV0ID0gZmFsc2U7XHJcblxyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2RhdGFodWInKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLnNob3dEYXRhaHViSW5wdXQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSBmYWxzZTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNvbmZpZy5zaG93QXBpSW5wdXQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jb25maWcuc2hvd0RhdGFodWJJbnB1dCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBAT3V0cHV0KCkgY29uZmlnRGF0YTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8vIGlmIG9uU2VsZWN0aW9uLCBvbkxheW91dFNlbGVjdGlvbiwgZGF0YVNvdXJjZVNlbGVjdGlvbiBpcyBjYWxsZWQsIHRoZW4gc3VibWl0IGRhdGEgYW5kIGVtaXQgY29uZmlnXHJcbiAgU3VibWl0RGF0YSgpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjb25maWcnLCB0aGlzLmNvbmZpZyk7XHJcblxyXG4gICAgdGhpcy5jb25maWcuYWdnckxpc3QuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICBpZiAoZWxlbWVudC5hZ2dyRGltZXNuaW9uID09PSB0aGlzLmNvbmZpZy5ncm91cEJ5KSB7XHJcbiAgICAgICAgdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pc0dyb3VwQnlJbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hcmVhID09PSB0cnVlKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmFyZWEgPSB7fTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgdGhpcy5jb25maWcuYXJlYSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuaXNHcm91cEJ5SW5BZ2dyZWdhdGUpIHtcclxuICAgICAgdGhpcy5jb25maWdEYXRhLmVtaXQodGhpcy5jb25maWcpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59XHJcbiJdfQ==