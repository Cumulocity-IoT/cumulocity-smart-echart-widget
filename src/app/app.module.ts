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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as echarts from 'echarts';
import { AppComponent } from './app.component';
import { BasicAuth, Client, Realtime } from '@c8y/client';
import { GpSmartEchartWidgetModule } from '../../projects/gp-smart-echart-widget/src/lib/gp-smart-echart-widget.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@c8y/ngx-components';
// Import the library module
import { AngularResizedEventModule } from 'angular-resize-event';
const auth = new BasicAuth({
  user: '###', /*username for your tenant */
  password: '###' , /*password for your tenant */
  tenant: '###' /*teant Id */
});

const client = new Client(auth, 'http://localhost:4200');
client.setAuth(auth);
const fetchClient = client.core;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    GpSmartEchartWidgetModule,
    AngularResizedEventModule
  ],
  providers: [
    {
      provide: Realtime,
      useFactory: () => {
          return new Realtime(fetchClient);
          }
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
