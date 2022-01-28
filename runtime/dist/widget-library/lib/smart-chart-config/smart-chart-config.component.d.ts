import { EventEmitter, OnInit } from '@angular/core';
import { ChartConfig } from '../model/config.modal';
export declare class SmartChartConfigComponent implements OnInit {
    flag: boolean;
    config: ChartConfig;
    chartData: {
        chartType: {
            id: string;
            value: string;
        }[];
        chartLayout: {
            id: string;
            layout: {
                id: string;
                value: string;
            }[];
        }[];
        yAxisType: {
            id: string;
            value: string;
            disabled: boolean;
        }[];
        xAxisType: {
            id: string;
            value: string;
            disabled: boolean;
        }[];
        legendType: {
            icon: string;
            value: string;
        }[];
        aggregateMethod: {
            id: string;
            value: string;
        }[];
        listName: string;
    };
    chartLayoutData: any;
    aggregationMethods: any;
    isGroupByInAggregate: boolean;
    constructor();
    ngOnInit(): void;
    stackAdded(stack: any): void;
    deleteStackValue(stack: any, index: any): void;
    updateStack(): void;
    addAnotherStack(): void;
    isAggrAdded: boolean;
    addAnotherAggregate(): void;
    deleteAggrValue(aggr: any, index: any): void;
    onSelection(value: any): void;
    onLayoutSelection(value: any): void;
    dataSourceSelection(value: any): void;
    configData: EventEmitter<any>;
    SubmitData(): void;
}
