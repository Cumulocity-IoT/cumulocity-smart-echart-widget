

  

# Smart E Chart Widget for Cumulocity [<img width="35" src="https://user-images.githubusercontent.com/67993842/97668428-f360cc80-1aa7-11eb-8801-da578bda4334.png"/>](https://github.com/SoftwareAG/cumulocity-smart-echart-widget/blob/main/runtime/dist/smart-echart-runtime-widget-1.0.0.zip)

  
The Smart E chart widget help you to display API and datahub response on a chart with color configurations.
  

![Picture1](https://user-images.githubusercontent.com/85675121/154234664-5840f68e-33b8-4e49-89fa-b9b854773c75.png)

### Please verify that you are using below Application builder version:

|APPLICATION BUILDER | CUMULOCITY | SMART ECHART WIDGET    |
|--------------------|------------|------------------------|
| 1.3.x              | >= 1011.x.x| 1.x.x                  |



## Features

  
*  **Charts Supported:** Line , Bar , Polar, Radar, Pie, alongwith Horizontal Orientation

*  **Supports Datahub:** Datahub can be chosen as a source and results from datahub can be configured with LIMIT option.

*  **Configurable Color:** Select custom color for your chart.

*  **Configurable Zoom:**  Select the zoom which is best fit for your chart.  
  

## Installation

  
### Runtime Widget Deployment?

* This widget support runtime deployment. Download [Runtime Binary](https://github.com/SoftwareAG/cumulocity-smart-echart-widget/releases/download/v1.0.0/smart-echart-runtime-widget-1.0.0.zip) and use Application-builder to install your widget.
  

### Installation of widget through Appbuilder
  

**Supported Cumulocity Environments:**
  

*  **App Builder:** Tested with Cumulocity App Builder version 1.3.0  

  
**Requirements:**

* Git

* NodeJS (release builds are currently built with `v14.15.0`)

* NPM (Included with NodeJS)

**External dependencies:**

```

"@juggle/resize-observer": "^3.3.1",

"echarts": "^5.2.1",

"echarts-simple-transform": "^1.0.0",

"ngx-bootstrap": "6.2.0",

"ngx-echarts": "^7.1.0",

```

**Installation Steps For App Builder:**


**Note:** If you are new to App Builder or not yet downloaded/clone app builder code then please follow [App builder documentation(Build Instructions)](https://github.com/SoftwareAG/cumulocity-app-builder) before proceeding further.



1. Open Your existing App Builder project and install external dependencies by executing below command or install it manually.

    ```

    npm i echarts@^5.2.1 echarts-simple-transform@^1.0.0 juggle/resize-observer@^3.3.1 ngx-bootstrap@6.2.0 ngx-echarts@^7.1.0 

    ```
2. Grab the Smart E Chart **[Latest Release Binary](https://github.com/SoftwareAG/cumulocity-smart-echart-widget/releases/download/v1.0.0/gp-smart-echart-widget-1.0.0.tgz)**.


3. Install the Binary file in app builder.

    ```
    
    npm i <binary file path>/gp-smart-echart-widget-1.0.0.tgz

    ```

4. Import GpSmartEchartWidgetModulein custom-widget.module.ts file located at /cumulocity-app-builder/custom-widgets/

    ```  

    import {GpSmartEchartWidgetModule} from  'gp-smart-echart-widget.module';

    @NgModule({

    imports: [

    GpSmartEchartWidgetModule

    ]

    })

    ```

9. Congratulation! Installation is now completed. Now you can run app builder locally or build and deploy it into your tenant.

    ```

    //Start App Builder

    
    npm run start

    // Build App


    npm run build


    // Deploy App


    npm run deploy

    ```
  
    ```

## Build Instructions

**Note:** It is only necessary to follow these instructions if you are modifying/extending this widget, otherwise see the [Installation Guide](#Installation).

**Requirements:**
  
* Git  

* NodeJS (release builds are currently built with `v14.15.0`)
  

* NPM (Included with NodeJS)
  

**Instructions**


1. Clone the repository:

    ```  

    git clone https://github.com/SoftwareAG/cumulocity-smart-echart-widget.git

    ```

2. Change directory:

    ```

    cd cumulocity-smart-echart-widget

    ```

3. (Optional) Checkout a specific version:

    ```

    git checkout <your version>
    

    ```  

4. Install the dependencies:

    ```

    npm install

    ```

5. (Optional) Local development server:

    ```

    npm run start

    ```

6. Build the app:

    ```

    npm run build

    ```

7. Deploy the app:

    ```

    npm run deploy

    ```

## QuickStart
  

This guide will teach you how to add widget in your existing or new dashboard.

  

**NOTE:** This guide assumes you have followed the [Installation instructions](#Installation)

  

1. Open you application from App Switcher
  

2. Add new dashboard or navigate to existing dashboard
  

3. Click `Add Widget`
  

4. Search for `Smart E Chart`


5. Select `Target API or Datahub`


6. Fill Options required

7. Click `Save`


Congratulations! Smart E Chart is configured.

  

## User Guide

 

-   **Target API:** User can select an API or Datahub. If Datahub is selected, user needs to provide a relative URL and the SQL query to get data from Datahub. 


-   **Types Of Chart:** User can select a Chart Type and its Layout.Below is the detail of chart types available alongwith the options
  
Options Available in Chart Config :


**1. Chart Title** : This will be the title of chart on top-left.

**2. List Name** : Name of the response field which holds JSON object. For example: API response comes as output:{…..JSON…}.Then List Name = output.

**3. Data Source(API / Datahub)** :  Either API or Datahub.

    3.1. API : Provide the API url.
    3.2. Datahub : Provide the Datahub Url and SQL query to access the data.
    NOTE: Datahub should be on the same tenant and user must have permission to access datahub.



**4. Chart Type** : At present, we have Bar, Line, Radar, Polar, Pie and Scatter chart.

**5. Chart Layout** : This has diff values based on the Chart type selected by User.
            ```
NOTE : In Simple charts, X-Axis can be category or value type and Y-Axis can be value only whereas in Horizontal charts, Y-Axis can be category or value type and X-Axis can be value only.
            ```

    5.1 Line Chart : For Simple Line, Only single value in Y-Axis Dimension.For Stacked Line, Comma separated values in Y-Axis Dimension.
    5.2 Bar Chart : For Simple Bar, Only single value in Y-Axis Dimension.
    For Stacked Bar, Comma separated values in Y-Axis Dimension.For Simple Horizontal Bar, Only single value in X-Axis Dimension.For Stacked Horizontal Bar, Comma separated values in X-Axis Dimension.
    5.3 Pie Chart : It can be a simple pie chart or a rose pie chart.Some value of pie chart are:
	    PieSliceValue : The numerical axis
		  PieSliceName : Can be same as PieSliceValue or can be a category axis.
		  Pie Radius : Mandatory. should be in <num>%,<num>% format.
		  Border radius : optional. Specifies the radius of pie slice.
		  Border width : optional. Specifies the width of pie slice.
    5.4 Scatter Chart : It can be simple scatter chart or horizontal scatter chart with category on Y-Axis.
		Bubble Size : Mandatory.Specifies the size of scatter bubble.
	5.5 Polar Chart : It can be a Line polar or Bar Polar chart.
		NOTE: X and Y axis dimension both are value types.Therefore, the fields should be numerical data.
	5.6 Radar Chart : Here the 
		  X Axis dimension : can be numerical or category.Example: Sales or Name.This basically plots the box of radar.
		  Radar Dimensions : are the numerical fields which are plotted inside the radar box.

**6. X-Axis Type** : This has three options :

    6.1 Value : For numerical axis. Example fields like productSales : 2000,3000,1290 etc. 
    6.2 Category : For categorized data. Example fields like: Date: ‘Mar-2021’,’Feb-2020’ etc.
    6.3 Time : For time axis where you want to show continuous time data.
    
   **7. X-Axis Dimension** : This should be the fieldname of value you want to show on chart. It should be exactly same as it is in response of API.
   
   **8. Y-Axis Type** : This has three options :

    8.1 Value : For numerical axis. Example fields like productSales : 2000,3000,1290 etc. 
    8.2 Category : For categorized data. Example fields like: Date: ‘Mar-2021’,’Feb-2020’ etc.
    8.3 Time : For time axis where you want to show continuous time data.
    
  **9. Y-Axis Dimension** : This should be the fieldname of value you want to show on chart. It should be exactly same as it is in response of API.
  
  **10. X-Axis Rotate Labels** : In case the labels for x axis are lengthy , you can specify an input from -90 to 90.
  
  **11. Y-Axis Rotate Labels** : In case the labels for y axis are lengthy , you can specify an input from -90 to 90.
  
  **12. Legend** : User can select the shape of legend from here.
  
  **13. Slider Zoom** : This is like pinch zoom we have in phones. User can zoom in to see large datasets in detail.
  
  **14. Box Zoom** : This is available in top-right corner if selected. User has to select the zoom button and it would be highlighted in blue color and then user can make the selection on chart and that area will be zoomed in. To go back to previous stage user needs to click on ‘Zoom Reset’ Button(available in top-right corner).
  
  **15. Chart Color** : You can specify color in input box or you can use color picker.

------------------------------

##**Aggregation Utility**

Widget also provides aggregation functions as below:

**Dimension**: Specify the numerical dimension name.

**Method** : Select one of the method from dropdown.

**Group By** : Specify the category dimension.
 ```
Example: If you are creating a simple line chart with x-axis dimesion as ‘Date’ and y-axis dimension as ‘score’.To see the average score , In Aggregate you would Specify dimension as ‘score’ with method as ‘average’ and group by as ‘Date’.

In case of multiple numerical axis, you need to give all the axis in aggregate to be able to map those on chart.
``` 

------------------------------

This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

_____________________

For more information you can Ask a Question in the [TECHcommunity Forums](https://tech.forums.softwareag.com/tag/Cumulocity-IoT).


You can find additional information in the [Software AG TECHcommunity](https://techcommunity.softwareag.com/home/-/product/name/cumulocity).
