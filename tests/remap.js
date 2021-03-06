var path = require("path");
var loadCoverage = require("remap-istanbul/lib/loadCoverage");
var remap = require("remap-istanbul/lib/remap");
var writeReport = require("remap-istanbul/lib/writeReport");

var root = path.join(__dirname, "..");

var tsCoverage = loadCoverage(path.join(root, "dist/testresults/coverage.json"));
var jsCoverage = {};

Object.keys(tsCoverage)
    .forEach(function(tsFilePath) {
        var jsFilePath = path.join(root, "dist/tsc", path.relative(root, tsFilePath)).replace(/\.ts$/, ".js");
        jsCoverage[jsFilePath] = tsCoverage[tsFilePath];
    });

var result = remap(jsCoverage);
writeReport(result, "html", {}, path.join(root, "dist/testresults/coverage"));
writeReport(result, "json", {}, path.join(root, "dist/testresults/coverage-final.json"));
// relative hack is required due to windows-specific bug in mkdirp used by istanbul
// writeReport(result, "cobertura", path.relative(".", path.join(root, "testresults/coverage.xml")));