
// WARNING do not make manual Changes to this file.
// widget.d.ts files is auto generated from the params in the widget.xml
// use > 'grunt xsltproc' or > 'grunt watch' to generate a new file

export default ModelProps;

export interface ModelProps {
    xAxisLabel?: string;
    xAxisFormat?: string;
    yAxisLabel?: string;
    yAxisFormat?: string;
    seriesConfig?: SeriesConfig[];
    width?: number;
    widthUnit?: WidthUnit;
    height?: number;
    heightUnit?: HeightUnit;
}

export interface SeriesConfig {
    seriesEntity?: string;
    seriesSource?: SeriesConfigSeriesSource;
    seriesXAttribute?: string;
    seriesYAttribute?: string;
    seriesKey?: string;
    entityConstraint?: string;
    dataSourceMicroflow?: string;
    seriesColor?: string;
    seriesFill?: boolean;
}

export type WidthUnit = "auto" | "pixels";

export type HeightUnit = "auto" | "pixels";

export type SeriesConfigSeriesSource = "xpath" | "microflow";
