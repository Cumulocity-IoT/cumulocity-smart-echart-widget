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
import { AngularResizedEventModule } from 'angular-resize-event';
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
                    AngularResizedEventModule
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ncC1zbWFydC1lY2hhcnQtd2lkZ2V0L3NyYy9saWIvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxPQUFPLEVBQUUsc0JBQXNCLEVBQWtCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQW9DLFVBQVUsRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNsRixPQUFPLEtBQUssT0FBTyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMvQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUM5RixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM5RSxPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztXQW1CL0M7SUFDTixFQUFFLEVBQUUsY0FBYztJQUNsQixLQUFLLEVBQUUsY0FBYztJQUNyQixXQUFXLEVBQUUsaUNBQWlDO0lBQzlDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtJQUNsQyxTQUFTLEVBQUUsNEJBQTRCO0lBQ3ZDLGVBQWUsRUFBRSx5QkFBeUI7SUFDMUMsSUFBSSxFQUFHO1FBQ0gsR0FBRyxFQUFHO1lBQ0YsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUs7Z0JBQ2hDLFlBQVksRUFBRSxLQUFLO2dCQUNuQix1QkFBdUIsRUFBRSxJQUFJO2dCQUM3QixnQkFBZ0IsRUFBRSxJQUFJO2FBQ3JCO1NBQ0o7S0FDSjtDQUNKO0FBS1QsTUFBTSxPQUFPLHlCQUF5Qjs7O1lBcENyQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsNEJBQTRCLEVBQUMseUJBQXlCLENBQUM7Z0JBQ3RFLE9BQU8sRUFBRTtvQkFDUCxVQUFVO29CQUNWLGdCQUFnQixDQUFDLE9BQU8sQ0FBQzt3QkFDdkIsT0FBTztxQkFDUixDQUFDO29CQUNGLHlCQUF5QjtpQkFDMUI7Z0JBQ0QsT0FBTyxFQUFFLENBQUUsc0JBQXNCLENBQUU7Z0JBQ25DLFNBQVMsRUFBRTtvQkFDVCwwQkFBMEI7b0JBQzFCO3dCQUNJLE9BQU8sRUFBRyxlQUFlO3dCQUN6QixLQUFLLEVBQUUsSUFBSTt3QkFDWCxRQUFRLElBZ0JQO3FCQUNKO2lCQUFDO2dCQUNKLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixFQUFDLHlCQUF5QixDQUFDO2dCQUNqRSxlQUFlLEVBQUUsQ0FBQyw0QkFBNEIsRUFBQyx5QkFBeUIsQ0FBQzthQUMxRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgU29mdHdhcmUgQUcsIERhcm1zdGFkdCwgR2VybWFueSBhbmQvb3IgaXRzIGxpY2Vuc29yc1xyXG4gKlxyXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IHsgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSwgSW5qZWN0aW9uVG9rZW4sIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJvb3RzdHJhcENvbXBvbmVudCwgQ29tbW9uTW9kdWxlLCBDb3JlTW9kdWxlLCBIT09LX0NPTVBPTkVOVFMgfSBmcm9tICdAYzh5L25neC1jb21wb25lbnRzJztcclxuaW1wb3J0IHsgR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCB9IGZyb20gJy4vZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5jb21wb25lbnQnO1xyXG5pbXBvcnQgKiBhcyBwcmV2aWV3IGZyb20gJy4vcHJldmlldy1pbWFnZSc7XHJcbmltcG9ydCB7IE5neEVjaGFydHNNb2R1bGUgfSBmcm9tICduZ3gtZWNoYXJ0cyc7XHJcbmltcG9ydCB7IFNtYXJ0Q2hhcnRDb25maWdDb21wb25lbnQgfSBmcm9tICcuL3NtYXJ0LWNoYXJ0LWNvbmZpZy9zbWFydC1jaGFydC1jb25maWcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR3BTbWFydEVjaGFydFdpZGdldFNlcnZpY2UgfSBmcm9tICcuL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSAnZWNoYXJ0cyc7XHJcbmltcG9ydCB7IEFuZ3VsYXJSZXNpemVkRXZlbnRNb2R1bGUgfSBmcm9tICdhbmd1bGFyLXJlc2l6ZS1ldmVudCc7XHJcblxyXG5cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCxTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50XSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb3JlTW9kdWxlLFxyXG4gICAgTmd4RWNoYXJ0c01vZHVsZS5mb3JSb290KHtcclxuICAgICAgZWNoYXJ0c1xyXG4gICAgfSksXHJcbiAgICBBbmd1bGFyUmVzaXplZEV2ZW50TW9kdWxlXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIEdwU21hcnRFY2hhcnRXaWRnZXRTZXJ2aWNlLFxyXG4gICAge1xyXG4gICAgICAgIHByb3ZpZGU6ICBIT09LX0NPTVBPTkVOVFMsXHJcbiAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgdXNlVmFsdWU6IHtcclxuICAgICAgICAgICAgaWQ6ICdzbWFydC5lY2hhcnQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1NtYXJ0IGVDaGFydCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnbGluZWNoYXJ0IGRlcml2ZWQgZnJvbSBhcGkgZGF0YScsXHJcbiAgICAgICAgICAgIHByZXZpZXdJbWFnZTogcHJldmlldy5wcmV2aWV3SW1hZ2UsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudDogR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCxcclxuICAgICAgICAgICAgY29uZmlnQ29tcG9uZW50OiBTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50LFxyXG4gICAgICAgICAgICBkYXRhIDoge1xyXG4gICAgICAgICAgICAgICAgbmcxIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgbm9EZXZpY2VUYXJnZXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vTmV3V2lkZ2V0czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlVGFyZ2V0Tm90UmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzU2VsZWN0YWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XSxcclxuICBleHBvcnRzOiBbR3BTbWFydEVjaGFydFdpZGdldENvbXBvbmVudCxTbWFydENoYXJ0Q29uZmlnQ29tcG9uZW50XSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtHcFNtYXJ0RWNoYXJ0V2lkZ2V0Q29tcG9uZW50LFNtYXJ0Q2hhcnRDb25maWdDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcFNtYXJ0RWNoYXJ0V2lkZ2V0TW9kdWxlIHsgfVxyXG4iXX0=