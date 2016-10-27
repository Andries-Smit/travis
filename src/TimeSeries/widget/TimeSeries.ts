import * as dojoDeclare from "dojo/_base/declare";
import * as mxLang from "mendix/lang";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { HeightUnit, SeriesConfig, WidthUnit } from "../TimeSeries.d";
import { DataPoint, TimeSeries, WidgetProps } from "./components/TimeSeries";

export class TimeSeriesWrapper extends WidgetBase {
    // Parameters configured in the Modeler  
    private xAxisLabel: string;
    private xAxisFormat: string;
    private yAxisLabel: string;
    private yAxisFormat: string;
    private seriesConfig: SeriesConfig[];
    private width: number;
    private height: number;
    private widthUnit: WidthUnit;
    private heightUnit: HeightUnit;

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObject: mendix.lib.MxObject;
    private dataLoaded: boolean;
    private dataStore: any;
    private handle: number;

    private createProps(): WidgetProps {
        return {
            dataLoaded: this.dataLoaded,
            dataStore: this.dataStore,
            height: this.height,
            heightUnit: this.heightUnit,
            seriesConfig: this.seriesConfig,
            widgetId: this.id + "_Wrapper",
            width: this.width,
            widthUnit: this.widthUnit,
            xAxisFormat: this.xAxisFormat,
            xAxisLabel: this.xAxisLabel,
            yAxisFormat: this.yAxisFormat,
            yAxisLabel: this.yAxisLabel
        };
    }

    postCreate() {
        this.dataStore = {};
        this.dataStore.series = this.seriesConfig.reduce((previousValue: any, currentValue: SeriesConfig ) => {
            return previousValue[currentValue.seriesKey] = [];
        }, {});
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = object;
        if (this.contextObject && this.checkConfig()) {
        this.updateData(() => {
            this.dataLoaded = true;
            this.updateRendering(callback);
        });
        } else {
            this.updateRendering(callback);
        }
        this.resetSubscriptions();
    }

    uninitialize() {
        unmountComponentAtNode(this.domNode);
        return true;
    }

    private updateData(callback: Function) {
        const series = this.seriesConfig[0];
        // TODO: do this in a async parallel way for all series, in the future.
        if (series.seriesSource === "xpath" && series.seriesEntity) {
            this.fetchDataFromXpath(series, (data: mendix.lib.MxObject[]) => {
                this.setDataFromObjects(data, series);
                callback();
            });
        } else if (series.seriesSource === "microflow" && series.dataSourceMicroflow) {
             this.fetchDataFromMicroflow(series, (data: mendix.lib.MxObject[]) => {
                 this.setDataFromObjects(data, series);
                 callback();
             });
        } else {
            // TODO: improve error message, add config check in widget component.
            logger.error(this.id + ".updateData unknown source or error in widget configuration");
            callback();
        }
    }

    /**
     * Validate the widget configurations from the modeler
     */
    private checkConfig() {
        let valid = true;
        const incorrectSeries = this.seriesConfig.filter(series =>
        (series.seriesSource === "microflow" && !series.dataSourceMicroflow));

        if (incorrectSeries.length) {
            valid = false;
            mx.ui.error("Configuration error for series : '" + incorrectSeries[0].seriesKey +
                "'. Source is set to 'Microflow' but 'Source - microflow' is missing ", true);
        }

        return valid;
    }

    private updateRendering (callback?: Function) {
        render(createElement(TimeSeries, this.createProps()), this.domNode);

        mxLang.nullExec(callback);
    }

    private resetSubscriptions () {
        mx.data.unsubscribe(this.handle);
        this.handle = 0;

        if (this.contextObject) {
            this.handle = this.subscribe({
                callback: (guid: string) => {
                    this.updateRendering();
                },
                guid: this.contextObject.getGuid()
            });
        }
    }

    private fetchDataFromXpath(seriesConfig: SeriesConfig, callback: Function) {
        if (this.contextObject) {
            const guid = this.contextObject ? this.contextObject.getGuid() : "";
            const constraint = seriesConfig.entityConstraint.replace("[%CurrentObject%]", guid);
            const xpathString = "//" + seriesConfig.seriesEntity + constraint;
            mx.data.get({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while retrieving items: " + error);
                },
                filter: {
                    sort: [ [ seriesConfig.seriesXAttribute, "asc" ] ]
                },
                xpath : xpathString
            });
        } else {
            callback([]);
        }
    }

    private setDataFromObjects(objects: mendix.lib.MxObject[], seriesConfig: SeriesConfig): void {
        this.dataStore.series[seriesConfig.seriesKey] = objects.map((itemObject): DataPoint => ({
            x: itemObject.get(seriesConfig.seriesXAttribute) as number,
            y: parseFloat(itemObject.get(seriesConfig.seriesYAttribute) as string)
        }));
    }

    private fetchDataFromMicroflow(seriesConfig: SeriesConfig, callback: Function) {
        if (seriesConfig.dataSourceMicroflow) {
            mx.data.action({
                callback: callback.bind(this),
                error: (error) => {
                    logger.error(this.id + ": An error occurred while executing microflow: " + error);
                },
                params: {
                    actionname: seriesConfig.dataSourceMicroflow,
                    applyto: "selection",
                    guids: [ this.contextObject.getGuid() ]
                }
            });
        } else {
            callback([]);
        }
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("TimeSeries.widget.TimeSeries", [ WidgetBase ], (function (Source: any) {
    let result: any = {};
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i) ) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (TimeSeriesWrapper)));

export default TimeSeriesWrapper;
