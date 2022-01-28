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
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
import { BootstrapComponent, CommonModule, CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { GpSmartEchartWidgetComponent } from './gp-smart-echart-widget.component';
import * as preview from './preview-image';
import { NgxEchartsModule } from 'ngx-echarts';
import { SmartChartConfigComponent } from './smart-chart-config/smart-chart-config.component';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
import * as echarts from 'echarts';



@NgModule({
  declarations: [GpSmartEchartWidgetComponent,SmartChartConfigComponent],
  imports: [
    CoreModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    GpSmartEchartWidgetService,
    {
        provide:  HOOK_COMPONENTS,
        multi: true,
        useValue: {
            id: 'smart.echart',
            label: 'Smart eChart',
            description: 'linechart derived from api data',
            previewImage: preview.previewImage,
            component: GpSmartEchartWidgetComponent,
            configComponent: SmartChartConfigComponent,
            data : {
                ng1 : {
                    options: { noDeviceTarget: false,
                    noNewWidgets: false,
                    deviceTargetNotRequired: true,
                    groupsSelectable: true
                    },
                }
            }
        }
    }],
  exports: [GpSmartEchartWidgetComponent,SmartChartConfigComponent],
  entryComponents: [GpSmartEchartWidgetComponent,SmartChartConfigComponent]
})
export class GpSmartEchartWidgetModule { }
