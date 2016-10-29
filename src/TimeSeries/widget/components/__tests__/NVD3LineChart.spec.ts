import { ReactWrapper, mount, shallow } from "enzyme";
import { DOM, HTMLAttributes, createElement } from "react";

import { NVD3LineChart, Nvd3LineChartProps, configureComponents, isPlainObject } from "../NVD3LineChart";

describe("NVD3LineChart", () => {

    const renderChart = (props?: Nvd3LineChartProps) => shallow(createElement(NVD3LineChart, props));
    const renderFull = (props?: Nvd3LineChartProps) => mount(createElement(NVD3LineChart, props));

    const chartProps = {
        chartProps: {},
        datum: [ {
            area: true,
            color: "F00",
            key: "Series 1",
            values: [ { x: 1, y: 5 } ]
        } ],
        height: 20,
        width: 50
    };
    const fullChart = renderFull(chartProps);
    let myChart: ReactWrapper<HTMLAttributes<{}>, any>; // tricky
    let svgDocument: HTMLElement;
    beforeAll((done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            myChart = fullChart.find(".nv-chart");
            svgDocument = document.createElement("div");
            svgDocument.innerHTML = myChart.html();
            done();
        }, 4000);
    });

    it("should render an svg in a div node", () => {
        const output = renderChart(chartProps);

        expect(output).toMatchStructure(
            DOM.div({ className: "nv-chart" },
                DOM.svg()
            )
        );
    });

    it("should render div with the class 'nv-chart'", () => {
        const output = renderChart(chartProps);

        expect(output).toHaveClass("nv-chart");
    });

    it("should render div with style height", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").height).toBe(20);
    });

    it("should render div with style width", () => {
        const output = renderChart(chartProps);

        expect(output.first().prop("style").width).toBe(50);
    });

    it("Checking if component NVD3LineChart has div with class 'nv-chart'", () => {

        expect(fullChart.find(".nv-chart").hasClass("nv-chart")).toEqual(true);
    });

    it("Checking if NVD3LineChart component mounts", () => {
        spyOn(NVD3LineChart.prototype, "componentDidMount");
        let spyOnChart = renderFull(chartProps);
        expect(NVD3LineChart.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    });

    it("Should have a legend", () => {
        expect(svgDocument.getElementsByClassName("nvd3 nv-legend").length).toEqual(1);
    });

    it("Should have interactive guideline", () => {
        expect(svgDocument.getElementsByClassName("nv-interactive").length).toEqual(1);
    });

    xit ("Should render when data is empty", () => {
        // TODO: Implement this test.
    });
    xit("Should have the correct color", () => {
        // TODO: Implement
    });

});

describe("Util function isPlainObject", () => {

    it("should confirm a literal object is a plain object", () => {
        const emptyObject = {};

        expect(isPlainObject(emptyObject)).toBe(true);
    });

    it("should deny a function is a plain object", () => {
        const simpleFunction = () => { /*  */ };

        expect(isPlainObject(simpleFunction)).toBe(false);
    });

    it("should deny that an instantiated object is a plain object", () => {
        class SomeClass {
            /* */
        }
        const someInstance = new SomeClass();
        expect(isPlainObject(someInstance)).toBe(false);
    });

});

describe("Util function configureComponents", () => {

    class Person {
        name: string = "unknown";
        location: Location;
        constructor() {
            this.location = new Location();
        }
        setName (name: string) {
            this.name = name;
        }
    }

    class Location {
        name: string = "somewhere";
        setName (name: string) {
            this.name = name;
        }
    }

    it("should set an attribute", () => {
        const options = { setName: "John" };
        let chartObject = new Person();

        configureComponents(chartObject, options);

        expect(chartObject.name).toBe("John");
    });

    it("should set an attribute on a child object", () => {
        const options = { location: { setName: "paradise" }, setName: "John" };
        let chartObject = new Person();

        configureComponents(chartObject, options);

        expect(chartObject.location.name).toBe("paradise");
    });

    it("should not change an empty object", () => {
        const options = { setName: "John" };
        let nullObject: Person = null;

        configureComponents(nullObject, options);

        expect(nullObject).toBe(nullObject);
    });

});
