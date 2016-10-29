var webpackConfig = require("./webpack.config");
Object.assign(webpackConfig, {
    debug: true,
    devtool: "inline-source-map"
});

webpackConfig.externals.push("react/lib/ExecutionEnvironment");
webpackConfig.externals.push("react/lib/ReactContext");
webpackConfig.externals.push("react/addons");
webpackConfig.externals.push("jsdom");

if (!!process.argv.find(arg => arg === "--reporters")) {
    console.log("With reporters")
    // Hack the webpack config to add istanbul instrumenter for non-test files as a normal loader, not as a postLoader
    // (which is a recommended way). This is needed because istanbul conflicts with pitching loaders (`inject` in our
    // case), see https://github.com/deepsweet/istanbul-instrumenter-loader/issues/3
    const tsLoaderIndex = webpackConfig.module.loaders.findIndex(loader => loader.test && loader.test.test("index.ts"));
    const tsLoader = webpackConfig.module.loaders[tsLoaderIndex];

    webpackConfig.module.loaders.splice(tsLoaderIndex, 1,
        { test: tsLoader.test, exclude: /tests/, loaders: [ "istanbul-instrumenter", tsLoader.loader ] },
        { test: /tests.*\.ts$/, loader: tsLoader.loader }
    );
}

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: [ "jasmine" ],

        files: [
            { pattern: "src/**/*.ts", watched: true, included: false, served: false },
            { pattern: "tests/**/*.ts", watched: true, included: false, served: false },
            "tests/test-index.js"
        ],
        exclude: [],
        preprocessors: {
            "tests/test-index.js": [ "webpack", "sourcemap" ]
        },
        webpack: webpackConfig,
        webpackServer: { noInfo: true },
        reporters: [ "progress", "kjhtml", "coverage" ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [ "Chrome" ],
        singleRun: false,
        concurrency: Infinity,
        coverageReporter: {
            dir: "./dist/testresults", 
            reporters: [
                { type: "json", subdir: ".", file: "coverage.json" },
                { type: "text" }
            ]
        },
        jasmineNodeOpts: {
            defaultTimeoutInterval: 2500000
        },
        singleRun: true
    })
};
