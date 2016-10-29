import { Component, DOM, createElement } from "react";

import { NVD3LineChart } from "./NVD3LineChart";
import { format, time } from "d3";

import { ModelProps, SeriesConfig } from "../../TimeSeries.d";

export interface DataPoint {
    x: number;
    y: number;
}

export interface DataStore {
    series: any;
}

export interface Series {
    values?: DataPoint[];
    key?: any;
    color?: string;
    area?: boolean;
}

export interface WidgetProps extends ModelProps {
    widgetId: string;
    dataLoaded?: boolean;
    dataStore?: DataStore;
}

export class TimeSeries extends Component<WidgetProps, {}> {

    constructor(props: WidgetProps) {
        super(props);

        this.getDatum = this.getDatum.bind(this);
    }

    render() {
        const props = this.props;
        const datum = this.getDatum(props.seriesConfig, props.dataStore);
        const xFormat = props.xAxisFormat ? props.xAxisFormat : "%d-%b-%y";
        const yFormat = props.yAxisFormat ? props.yAxisFormat : "";
        let chart: any = {
                chartProps: {
                    xAxis: {
                        axisLabel: props.xAxisLabel,
                        showMaxMin: true,
                        tickFormat: (dataPoint: any) => {
                            return time.format(xFormat)(new Date(dataPoint));
                        }
                    },
                    xScale: time.scale(),
                    yAxis: {
                        axisLabel: props.yAxisLabel,
                        tickFormat: (dataPoint: any) => {
                            if (yFormat) {
                                return format(yFormat)(dataPoint);
                            } else {
                                return dataPoint;
                            }
                        }
                    }
                },
                datum,
                height: props.height,
                width: props.width
            };
        return createElement (NVD3LineChart, chart);
    }

    public getDatum(seriesConfig: SeriesConfig[], dataStore: DataStore): Series[] {
        return seriesConfig.map(serieConfig => ({
            area: serieConfig.seriesFill,
            color: serieConfig.seriesColor ? serieConfig.seriesColor : undefined,
            key: serieConfig.seriesKey,
            values: Object.keys(dataStore.series).length ? dataStore.series[serieConfig.seriesKey] : []
        }));
    }
}
