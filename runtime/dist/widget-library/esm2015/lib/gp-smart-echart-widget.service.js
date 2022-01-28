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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GpSmartEchartWidgetService {
    constructor(http) {
        this.http = http;
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        this.options = {
            headers: this.httpHeaders,
        };
        this.token = 'bmVlcnUuYXJvcmFAc29mdHdhcmVhZy5jb206TWFuYWdlQDA5ODc=';
        this.httpHeaders.append("Authorization", "Bearer " + this.token);
    }
    getAPIData(apiUrl) {
        console.log('options', this.options);
        // if(apiUrl.indexOf('smart-equipment.eu-latest.cumulocity.com')!=-1){
        //   return this.http.get(apiUrl,this.options);
        // } else {
        return this.http.get(apiUrl);
        // }
        // const response = await this.fetchClient.fetch('service/datahub/dremio/api/v3/job/1e1826e5-0e7d-f38c-61b7-ce059c715700/results');
        // const data = await response.json();
        // return this.fetchClient.fetch('service/datahub/dremio/api/v3/job/1e1826e5-0e7d-f38c-61b7-ce059c715700/results');
    }
}
GpSmartEchartWidgetService.ɵprov = i0.ɵɵdefineInjectable({ factory: function GpSmartEchartWidgetService_Factory() { return new GpSmartEchartWidgetService(i0.ɵɵinject(i1.HttpClient)); }, token: GpSmartEchartWidgetService, providedIn: "root" });
GpSmartEchartWidgetService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
GpSmartEchartWidgetService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZ3Atc21hcnQtZWNoYXJ0LXdpZGdldC9zcmMvbGliL2dwLXNtYXJ0LWVjaGFydC13aWRnZXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTzNDLE1BQU0sT0FBTywwQkFBMEI7SUFhckMsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQVg1QixnQkFBVyxHQUFnQixJQUFJLFdBQVcsQ0FBQztZQUNqRCxjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLFFBQVEsRUFBRSxrQkFBa0I7U0FFN0IsQ0FBQyxDQUFDO1FBRUssWUFBTyxHQUFHO1lBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVztTQUUxQixDQUFBO1FBQ0QsVUFBSyxHQUFHLHNEQUFzRCxDQUFDO1FBRTdELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTSxVQUFVLENBQUMsTUFBTTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsc0VBQXNFO1FBQ3RFLCtDQUErQztRQUMvQyxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJO1FBRUosbUlBQW1JO1FBRW5JLHNDQUFzQztRQUN0QyxtSEFBbUg7SUFFckgsQ0FBQzs7OztZQWpDRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQVBRLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29weXJpZ2h0IChjKSAyMDIxIFNvZnR3YXJlIEFHLCBEYXJtc3RhZHQsIEdlcm1hbnkgYW5kL29yIGl0cyBsaWNlbnNvcnNcclxuICpcclxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHcFNtYXJ0RWNoYXJ0V2lkZ2V0U2VydmljZSB7XHJcblxyXG4gIHByaXZhdGUgaHR0cEhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcclxuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgXHJcbiAgfSk7XHJcbiAgXHJcbiAgcHJpdmF0ZSBvcHRpb25zID0ge1xyXG4gICAgaGVhZGVyczogdGhpcy5odHRwSGVhZGVycyxcclxuICAgIC8vIHBhcmFtczogbmV3IEh0dHBQYXJhbXMoKS5hcHBlbmQoJ3Jlc29sdmVJZHMnLCAnJyArIHRydWUpLmFwcGVuZCgndGVuYW50SWQnLCAnUkFDTScpXHJcbiAgfVxyXG4gIHRva2VuID0gJ2JtVmxjblV1WVhKdmNtRkFjMjltZEhkaGNtVmhaeTVqYjIwNlRXRnVZV2RsUURBNU9EYz0nO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyBcclxuICAgIHRoaXMuaHR0cEhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIHRoaXMudG9rZW4pO1xyXG4gIH1cclxuICBcclxuICBwdWJsaWMgZ2V0QVBJRGF0YShhcGlVcmwpOiBPYnNlcnZhYmxlPGFueT57XHJcbiAgICBjb25zb2xlLmxvZygnb3B0aW9ucycsdGhpcy5vcHRpb25zKTtcclxuICAgIC8vIGlmKGFwaVVybC5pbmRleE9mKCdzbWFydC1lcXVpcG1lbnQuZXUtbGF0ZXN0LmN1bXVsb2NpdHkuY29tJykhPS0xKXtcclxuICAgIC8vICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYXBpVXJsLHRoaXMub3B0aW9ucyk7XHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYXBpVXJsKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2hDbGllbnQuZmV0Y2goJ3NlcnZpY2UvZGF0YWh1Yi9kcmVtaW8vYXBpL3YzL2pvYi8xZTE4MjZlNS0wZTdkLWYzOGMtNjFiNy1jZTA1OWM3MTU3MDAvcmVzdWx0cycpO1xyXG5cclxuICAgIC8vIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAvLyByZXR1cm4gdGhpcy5mZXRjaENsaWVudC5mZXRjaCgnc2VydmljZS9kYXRhaHViL2RyZW1pby9hcGkvdjMvam9iLzFlMTgyNmU1LTBlN2QtZjM4Yy02MWI3LWNlMDU5YzcxNTcwMC9yZXN1bHRzJyk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19