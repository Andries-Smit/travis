import { mount } from "enzyme"; // enzyme's api doesn't provide innerHTML for svg. use "React.addons.TestUtils"
import { createElement } from "react";

import { SeriesConfig } from "../../../TimeSeries.d";
import { TimeSeries, WidgetProps } from "../TimeSeries";

describe("Test suite for TimeSeries component", () => {
    const dataStore: any = { series: {} };

    const getDate = (date: string) => { return new Date(date).getDate(); };
    const seriesConfig: SeriesConfig[] = [ { seriesColor: "blue", seriesFill: true, seriesKey: "data1" } ];
    dataStore.series[seriesConfig[0].seriesKey] = [
        { x: getDate("24-Apr-2007"), y: 93.24 },
        { x: getDate("2-Jan-2008"), y: 194.84 },
        { x: getDate("1-Jan-2009"), y: 85.35 },
        { x: getDate("1-Jan-2010"), y: 210.73 }
    ];

    const createProps: WidgetProps = {
        dataStore,
        height: 500,
        heightUnit: "pixels",
        seriesConfig,
        widgetId: "Test.TimeSeries.widget.TimeSeries",
        width: 900,
        widthUnit: "pixels"
        };
    let TimeSeriesWrapper = mount(createElement(TimeSeries, createProps));

    it("Should have the correct height passed as props to NVD3LineChart", () => {
        expect(TimeSeriesWrapper.find("NVD3LineChart").props().height).toBe(500);
    });

    it("Should have the correct width passed as props to NVD3LineChart", () => {
        expect(TimeSeriesWrapper.find("NVD3LineChart").props().width).toBe(900);
    });

    it("Should transform props into datum", () => {
        const datum = TimeSeries.prototype.getDatum(seriesConfig, dataStore)[0];
        // HINT: use direct value instead referencing eg: seriesConfig[0].seriesFill to avoid undefined
        expect(datum.area).toEqual(true);
        expect(datum.color).toBe("blue");
        expect(datum.key).toBe("data1");
    });

    it("Should contain TimeSeries named component tag", () => {
        expect(TimeSeriesWrapper.find("TimeSeries").length).toEqual(1) ;
        expect(TimeSeriesWrapper.find("NVD3LineChart").length).toEqual(1) ;
    });
});
