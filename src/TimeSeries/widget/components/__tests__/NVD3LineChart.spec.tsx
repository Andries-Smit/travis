import { mount, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { NVD3LineChart, Nvd3LineChartProps, configureComponents, isPlainObject } from "../NVD3LineChart";
import * as d3 from "d3";
import "nvd3";

describe("NVD3LineChart", () => {

    const renderChart = (props?: Nvd3LineChartProps) => shallow(createElement(NVD3LineChart, props));
    const domChart = (props?: Nvd3LineChartProps) => mount(createElement(NVD3LineChart, props));
    const chartProps = {
        chartProps: {},
        datum: [ {
            area: true,
            color: "F00",
            key: "Serie 1",
            values: [ { x: 1, y: 5 } ]
        } ],
        height: 20,
        width: 50
    };

    it("should render an svg in a div node", () => {
        const output = renderChart(chartProps);

        const divNode = DOM.div({},
            DOM.svg()
        );

        expect(output).toMatchStructure(divNode);
    });

    it("should render with the class 'nv-chart'", () => {
        const output = renderChart(chartProps);

        expect(output).toHaveClass("nv-chart");
    });

    it("should render with style height", () => {
        const output = renderChart(chartProps);

        const style = output.first().prop("style");

        expect(style.height).toBe(20);
    });

    it("should render with style width", () => {
        const output = renderChart(chartProps);

        const style = output.first().prop("style");

        expect(style.width).toBe(50);
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

    it("should deny a instanciated object is a plain object", () => {
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

    it("should set a attribute on a child object", () => {
        const options = { setName: "John", location: { setName: "paradise" } };
        let chartObject = new Person();

        configureComponents(chartObject, options);

        expect(chartObject.location.name).toBe("paradise");
    });

    it("should set not change an empty object", () => {
        const options = { setName: "John" };
        let nullObject: Person = null;

        configureComponents(nullObject, options);

        expect(nullObject).toBe(nullObject);
    });

});
