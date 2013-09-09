//#!/usr/bin/env node

var _ = require('underscore')._;
var Program = require('commander');
var Utils = require('./lib/yaml.utils');
var Fs = require('fs');

Program.version('0.0.1').option('-o, --operation <opname>', 'execute operation: toyaml, parse').parse(process.argv);

if (Program.operation) {
    if (Program.operation == 'toyaml') {
        Utils.toMarkedownYamlFiles('./data/data.json', './data/', true);

    } else if (Program.operation == 'parse') {
        var files = Utils.getFilesByExtension('./data', 'md');
        _.each(files, function(file) {
            var obj = Utils.toGeoJson(file);
        });

    } else if (Program.operation == 'stat') {

        Fs.readdir(__dirname + '/data', function(err, files) {
            console.log(files);
            _.each(files, function(file) {
                Fs.stat(__dirname + '/data/' + file, function(err, stats) {
                    console.log(stats);
                });
            });

        });

    } else {
        console.log('operation %s is unknown', Program.operation);
        process.exit(0);

    }

} else {
    Program.help();
    process.exit(-1);
}
