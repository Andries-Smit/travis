import * as d3 from "d3";
import "nvd3";
import { Component, DOM } from "react";

import { Series } from "./TimeSeries";

export interface Nvd3LineChartProps {
    height?: number;
    width?: number;
    chartProps?: any;
    datum: Series[];
}

export function isPlainObject(object: any): boolean {
    if (typeof object === "object" && object !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const proto = Object.getPrototypeOf(object);
            return proto === Object.prototype || proto === null;
        }
        return Object.prototype.toString.call(object) === "[object Object]";
    }
    return false;
}

/**
 * Configure components recursively
 * @param chart A nvd3 chart instance
 * @param options A key value object
 */
export function configureComponents(chart: any, options: any) {
    for (let optionName in options) {
        if (options.hasOwnProperty(optionName)) {
            let optionValue = options[optionName];
            if (chart) {
                if (isPlainObject(optionValue)) {
                    configureComponents(chart[optionName], optionValue);
                } else if (typeof chart[optionName] === "function") {
                    chart[optionName](optionValue);
                }
            }
        }
    }
}

export class NVD3LineChart extends Component<Nvd3LineChartProps, {}> {
    private resizeHandler: { clear: Function };
    public chart: nv.LineChart;
    private rendering: boolean;
    private selection: d3.Selection<any>;
    private svg: Node;

    componentDidMount() {
        nv.addGraph(this.renderChart.bind(this));
    }

    componentDidUpdate() {
        this.renderChart();
    }

    componentWillUnmount() {
        if (this.resizeHandler) {
            this.resizeHandler.clear();
        }
    }

    render() {
        // TODO check if handles height and width correctly.
        const style = {
            height: this.props.height,
            width: this.props.width
        };
        return (DOM.div({ className: "nv-chart", style },
            DOM.svg({ ref: n => this.svg = n })
        ));
    }

    private renderChart() {
        this.chart = (this.chart && !this.rendering) ? this.chart : nv.models.lineChart();
        configureComponents(this.chart, this.props.chartProps);
        this.chart.showLegend(true)
            .showXAxis(true)
            .showYAxis(true)
            .useInteractiveGuideline(true)
            .duration(350);
        this.selection = d3.select(this.svg)
            .datum(this.props.datum)
            .call(this.chart);

        if (!this.resizeHandler) {
            this.resizeHandler = nv.utils.windowResize(() => {
                this.chart.update();
            });
        }

        this.rendering = true;
        return this.chart;
    }
}
