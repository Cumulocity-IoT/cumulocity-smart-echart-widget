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
import { ElementRef, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartConfig } from './model/config.modal';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
import { FetchClient } from '@c8y/client';
import { ResizedEvent } from 'angular-resize-event';
export declare class GpSmartEchartWidgetComponent implements OnInit {
    private chartService;
    private fetchClient;
    protected mapDivRef: ElementRef;
    config: ChartConfig;
    serviceData: any;
    seriesData: any;
    chartData: any;
    userInput: any;
    width: number;
    height: number;
    chartOption: EChartsOption;
    protected allSubscriptions: any;
    realtime: boolean;
    deviceId: string;
    protected chartDiv: HTMLDivElement;
    isDatahubPostCall: boolean;
    dataChart: any;
    colorsForChart: any;
    constructor(chartService: GpSmartEchartWidgetService, fetchClient: FetchClient);
    ngOnInit(): void;
    dataFromUser(userInput: ChartConfig): void;
    reloadData(userInput: ChartConfig): void;
    createChart(userInput?: ChartConfig): Promise<void>;
    getXAxisType(input: any): any;
    getYAxisType(input: any): any;
    getChartType(input: any): any;
    getFormattedName(input: any): any;
    getEncodeData(userInput: any, datasetId?: any, xDimensions?: any, yDimensions?: any): any[];
    getScatterChartSeriesData(userInput: any): any[];
    getPolarChartSeriesData(userInput: any): {
        coordinateSystem: string;
        name: any;
        type: any;
        showSymbol: boolean;
        data: any[];
        label: {
            show: any;
        };
        itemStyle: {
            color: any;
        };
        emphasis: {
            label: {
                show: boolean;
            };
        };
    }[];
    getRadarSeriesData(userInput: any): {
        name: any;
        type: string;
        color: any;
        data: {
            name: string;
            value: any;
        }[];
    }[] | {
        type: string;
        color: any;
        data: {
            name: string;
            value: any;
        }[];
    }[];
    createObject(dataDim: any, arr: any, dimen: any): void;
    getPieChartSeriesData(userInput: any): {
        name: any;
        type: string;
        radius: any;
        roseType: string;
        avoidLabelOverlap: boolean;
        label: {
            show: boolean;
            position: string;
        };
        labelLine: {
            show: boolean;
        };
        itemStyle: any;
        emphasis: {
            itemStyle: {
                shadowBlur: number;
                shadowOffsetX: number;
                shadowColor: string;
            };
        };
        color: any;
        data: any;
    }[];
    getSeriesData(userInput: any): any[];
    getChartItemColor(index: any): any;
    getDatasetDimensions(userInput: any): any[];
    getStackName(stackData: any, dimensionName: any): string;
    getResultDimesions(list: any, groupby: any): any;
    showZoomFeature(val: any): ({
        type: string;
        xAxisIndex: number;
        minSpan: number;
        show?: undefined;
        height?: undefined;
        top?: undefined;
    } | {
        type: string;
        xAxisIndex: number;
        minSpan: number;
        show: boolean;
        height: number;
        top: string;
    })[];
    hexToRgb(hex: any): string;
    getHorizontalSeriesData(userInput: any): any[];
    onResized(event: ResizedEvent): void;
}
