"use strict";

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile("spec/support/jasmine.json");

/*
var myReporter = {
    specDone: function (result) {

        if (!result.status) {

            console.log('Spec: ' + result.description + ' was ' + result.status);
            for (var i = 0; i < result.failedExpectations.length; i++) {
                console.log('Failure: ' + result.failedExpectations[i].message);
                //console.log(result.failedExpectations[i].stack);
            }
        }
    }
};*/

//jasmine.addReporter(myReporter);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

jasmine.execute();