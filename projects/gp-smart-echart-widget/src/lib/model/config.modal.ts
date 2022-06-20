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
    title?: string | '',
    type?: string | '',
    layout?: string | '',
    dataSource?: string | '',
    dataSourceValue?: string | '',
    xAxis?: string | '',
    xAxisDimension?: string | '',
    yAxis?: string | '',
    yAxisDimension: string | '',
    apiUrl?: string | '',
    sqlQuery?: string | '',
    smoothLine?: boolean,
    area?: any | '',
    stackList: Stack[],
    aggrList: AggregateData[],
    stack: Stack[] | string,
    aggrArr: AggregateData[],
    roseType?: string | '',
    showLabel?: boolean,
    dateFormat?: string;
    itemStyle?: ItemStyle,
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
    showMicroserviceInput?: boolean;
    addStack?: boolean,
    listName: string | '';
    groupBy?: string | '';
    xAxisName?: string | '';
    yAxisName?: string | '';
    scatterSymbolSize?: string;
    pieBorderWidth?: number | 0;
    pieBorderRadius?: number | 0;
    colors?: string | '';
    areaOpacity?: string | '';
    hasArea?: any | '';
    radarChartRadius?: number | '';
    polarChartRadius?: number | '';
    fontSize?: number | '';
    xAxisRotateLabels?: number;
    yAxisRotateLabels?: number;
    sqlLimit?: number;
    datahubUrl?: string;
    darkMode?: boolean;
    microserviceUrl?: string;
}

export class Emphasis {
    label?: Label;
}
export class Label {
    show?: boolean;
}
export class ItemStyle {
    borderRadius?: number;
}
export class YAxis {
    ytype?: string;// 'value','category','time','log'
    name?: string;// name of axis
    position?: string;// left or right
}
export class Tooltip {
    show?: boolean | '';
    trigger?: string | ''; // 'axis' for line or bar chart,'item' for scatter or pie chart
    triggerOn?: string | '';
    borderColor?: string | '';
    borderWidth?: string | '';
    order?: string | '';// values can be 'seriesAsc','seriesDesc','valueAsc','valueDesc'
}

// To show symbol,color and name of series
export class Legend {
    show?: boolean | '';
    type?: string | '';// 'plain' is default,'scroll' when many options are in legend
    orient?: string | '';// 'horizontal' or  'vertical'
    icon?: string | '';// shape of legend ; values can be 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    selector?: boolean | '';// to show a select all button for legends or not
    top?: string | '';
    width?: number | '';

}

export class Toolbox {
    show?: boolean | '';
    orient?: string | '';// 'horizontal' or  'vertical'
    feature?: Feature;// 'plain' is default,'scroll' when many options are in legend
}

export class Stack {
    stackName: string;
    stackValues: string;
}

export class AggregateData {
    aggrDimesnion: string;
    aggrMethod: string;
}

export class Feature {
    saveAsImage?: any | '';
    magicType?: any | '';
    dataZoom?: any | '';
}
