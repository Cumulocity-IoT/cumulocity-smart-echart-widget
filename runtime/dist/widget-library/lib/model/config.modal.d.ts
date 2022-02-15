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
export interface ChartConfig {
    radius: string[];
    tooltip?: Tooltip;
    legend?: Legend;
    toolbox?: Toolbox;
    title?: string | '';
    type?: string | '';
    layout?: string | '';
    dataSource?: string | '';
    dataSourceValue?: string | '';
    xAxis?: string | '';
    xAxisDimension?: string | '';
    yAxis?: string | '';
    yAxisDimension: string | '';
    apiUrl?: string | '';
    sqlQuery?: string | '';
    smoothLine?: boolean;
    area?: any | '';
    stackList: Stack[];
    aggrList: AggregateData[];
    stack: Stack[] | string;
    aggrArr: AggregateData[];
    roseType?: string | '';
    showLabel?: boolean;
    dateFormat?: string;
    itemStyle?: ItemStyle;
    emphasis?: Emphasis;
    sliderZoom?: boolean | '';
    boxZoom?: boolean;
    pieSlicenName?: string | '';
    pieSliceValue?: string | '';
    radarShape?: string | '';
    radarIndicator?: string | '';
    radarDimensions?: string | '';
    showApiInput?: boolean;
    showDatahubInput?: boolean;
    addStack: boolean;
    listName: string | '';
    groupBy?: string | '';
    xAxisName?: string | '';
    yAxisName?: string | '';
    scatterSymbolSize?: string;
    pieBorderWidth?: number | 0;
    pieBorderRadius?: number | 0;
    colors?: string | '';
    areaOpacity?: string | '';
    radarChartRadius?: number | '';
    fontSize?: number | '';
    xAxisRotateLabels?: number;
    yAxisRotateLabels?: number;
    sqlLimit?: number;
    datahubUrl?: string;
}
export declare class Emphasis {
    label?: Label;
}
export declare class Label {
    show?: boolean;
}
export declare class ItemStyle {
    borderRadius?: number;
}
export declare class YAxis {
    ytype?: string;
    name?: string;
    position?: string;
}
export declare class Tooltip {
    show?: boolean | '';
    trigger?: string | '';
    triggerOn?: string | '';
    borderColor?: string | '';
    borderWidth?: string | '';
    order?: string | '';
}
export declare class Legend {
    show?: boolean | '';
    type?: string | '';
    orient?: string | '';
    icon?: string | '';
    selector?: boolean | '';
    top?: string | '';
    width?: number | '';
}
export declare class Toolbox {
    show?: boolean | '';
    orient?: string | '';
    feature?: Feature;
}
export declare class Stack {
    stackName: string;
    stackValues: string;
}
export declare class AggregateData {
    aggrDimesnion: string;
    aggrMethod: string;
}
export declare class Feature {
    saveAsImage?: any | '';
    magicType?: any | '';
    dataZoom?: any | '';
}
