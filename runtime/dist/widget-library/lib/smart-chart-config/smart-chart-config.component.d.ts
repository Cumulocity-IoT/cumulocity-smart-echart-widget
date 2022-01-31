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
import { EventEmitter, OnInit } from '@angular/core';
import { ChartConfig } from '../model/config.modal';
export declare class SmartChartConfigComponent implements OnInit {
    constructor();
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
    isAggrAdded: boolean;
    configData: EventEmitter<any>;
    ngOnInit(): void;
    stackAdded(stack: any): void;
    deleteStackValue(stack: any, index: any): void;
    updateStack(): void;
    addAnotherStack(): void;
    addAnotherAggregate(): void;
    deleteAggrValue(aggr: any, index: any): void;
    onSelection(value: any): void;
    onLayoutSelection(value: any): void;
    dataSourceSelection(value: any): void;
    SubmitData(): void;
}
