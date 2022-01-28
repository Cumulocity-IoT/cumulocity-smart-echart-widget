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
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { GpSmartEchartWidgetComponent } from './gp-smart-echart-widget.component';
import * as preview from './preview-image';
import { NgxEchartsModule } from 'ngx-echarts';
import { SmartChartConfigComponent } from './smart-chart-config/smart-chart-config.component';
import { GpSmartEchartWidgetService } from './gp-smart-echart-widget.service';
import * as echarts from 'echarts';
const ɵ0 = {
    id: 'smart.echart',
    label: 'Smart eChart',
    description: 'linechart derived from api data',
    previewImage: preview.previewImage,
    component: GpSmartEchartWidgetComponent,
    configComponent: SmartChartConfigComponent,
    data: {
        ng1: {
            options: { noDeviceTarget: false,
                noNewWidgets: false,
                deviceTargetNotRequired: true,
                groupsSelectable: true
            },
        }
    }
};
export class GpSmartEchartWidgetModule {
}
GpSmartEchartWidgetModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GpSmartEchartWidgetComponent, SmartChartConfigComponent],
                imports: [
                    CoreModule,
                    NgxEchartsModule.forRoot({
                        echarts
                    }),
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    GpSmartEchartWidgetService,
                    {
                        provide: HOOK_COMPONENTS,
                        multi: true,
                        useValue: ɵ0
                    }
                ],
                exports: [GpSmartEchartWidgetComponent, SmartChartConfigComponent],
                entryComponents: [GpSmartEchartWidgetComponent, SmartChartConfigComponent]
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxPQUFPLEVBQUUsc0JBQXNCLEVBQWtCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQW9DLFVBQVUsRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNsRixPQUFPLEtBQUssT0FBTyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMvQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUM5RixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztXQWtCakI7SUFDTixFQUFFLEVBQUUsY0FBYztJQUNsQixLQUFLLEVBQUUsY0FBYztJQUNyQixXQUFXLEVBQUUsaUNBQWlDO0lBQzlDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtJQUNsQyxTQUFTLEVBQUUsNEJBQTRCO0lBQ3ZDLGVBQWUsRUFBRSx5QkFBeUI7SUFDMUMsSUFBSSxFQUFHO1FBQ0gsR0FBRyxFQUFHO1lBQ0YsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUs7Z0JBQ2hDLFlBQVksRUFBRSxLQUFLO2dCQUNuQix1QkFBdUIsRUFBRSxJQUFJO2dCQUM3QixnQkFBZ0IsRUFBRSxJQUFJO2FBQ3JCO1NBQ0o7S0FDSjtDQUNKO0FBS1QsTUFBTSxPQUFPLHlCQUF5Qjs7O1lBbkNyQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsNEJBQTRCLEVBQUMseUJBQXlCLENBQUM7Z0JBQ3RFLE9BQU8sRUFBRTtvQkFDUCxVQUFVO29CQUNWLGdCQUFnQixDQUFDLE9BQU8sQ0FBQzt3QkFDdkIsT0FBTztxQkFDUixDQUFDO2lCQUNIO2dCQUNELE9BQU8sRUFBRSxDQUFFLHNCQUFzQixDQUFFO2dCQUNuQyxTQUFTLEVBQUU7b0JBQ1QsMEJBQTBCO29CQUMxQjt3QkFDSSxPQUFPLEVBQUcsZUFBZTt3QkFDekIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsUUFBUSxJQWdCUDtxQkFDSjtpQkFBQztnQkFDSixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsRUFBQyx5QkFBeUIsQ0FBQztnQkFDakUsZUFBZSxFQUFFLENBQUMsNEJBQTRCLEVBQUMseUJBQXlCLENBQUM7YUFDMUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29weXJpZ2h0IChjKSAyMDIxIFNvZnR3YXJlIEFHLCBEYXJtc3RhZHQsIEdlcm1hbnkgYW5kL29yIGl0cyBsaWNlbnNvcnNcclxuICpcclxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UU19TQ0hFTUEsIEluamVjdGlvblRva2VuLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCb290c3RyYXBDb21wb25lbnQsIENvbW1vbk1vZHVsZSwgQ29yZU1vZHVsZSwgSE9PS19DT01QT05FTlRTIH0gZnJvbSAnQGM4eS9uZ3gtY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IEdwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQgfSBmcm9tICcuL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuY29tcG9uZW50JztcclxuaW1wb3J0ICogYXMgcHJldmlldyBmcm9tICcuL3ByZXZpZXctaW1hZ2UnO1xyXG5pbXBvcnQgeyBOZ3hFY2hhcnRzTW9kdWxlIH0gZnJvbSAnbmd4LWVjaGFydHMnO1xyXG5pbXBvcnQgeyBTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50IH0gZnJvbSAnLi9zbWFydC1jaGFydC1jb25maWcvc21hcnQtY2hhcnQtY29uZmlnLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEdwU21hcnRFY2hhcnRXaWRnZXRTZXJ2aWNlIH0gZnJvbSAnLi9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgKiBhcyBlY2hhcnRzIGZyb20gJ2VjaGFydHMnO1xyXG5cclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0dwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQsU21hcnRDaGFydENvbmZpZ0NvbXBvbmVudF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29yZU1vZHVsZSxcclxuICAgIE5neEVjaGFydHNNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGVjaGFydHNcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgc2NoZW1hczogWyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSxcclxuICAgIHtcclxuICAgICAgICBwcm92aWRlOiAgSE9PS19DT01QT05FTlRTLFxyXG4gICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgIHVzZVZhbHVlOiB7XHJcbiAgICAgICAgICAgIGlkOiAnc21hcnQuZWNoYXJ0JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdTbWFydCBlQ2hhcnQnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2xpbmVjaGFydCBkZXJpdmVkIGZyb20gYXBpIGRhdGEnLFxyXG4gICAgICAgICAgICBwcmV2aWV3SW1hZ2U6IHByZXZpZXcucHJldmlld0ltYWdlLFxyXG4gICAgICAgICAgICBjb21wb25lbnQ6IEdwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQsXHJcbiAgICAgICAgICAgIGNvbmZpZ0NvbXBvbmVudDogU21hcnRDaGFydENvbmZpZ0NvbXBvbmVudCxcclxuICAgICAgICAgICAgZGF0YSA6IHtcclxuICAgICAgICAgICAgICAgIG5nMSA6IHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7IG5vRGV2aWNlVGFyZ2V0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBub05ld1dpZGdldHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRldmljZVRhcmdldE5vdFJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3Vwc1NlbGVjdGFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfV0sXHJcbiAgZXhwb3J0czogW0dwU21hcnRFY2hhcnRXaWRnZXRDb21wb25lbnQsU21hcnRDaGFydENvbmZpZ0NvbXBvbmVudF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCxTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgR3BTbWFydEVjaGFydFdpZGdldE1vZHVsZSB7IH1cclxuIl19