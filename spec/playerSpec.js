"use strict";

describe("a player", function () {

    var rewire = require("rewire");
    var Player = rewire("../modules/player");
    var config = require("../config");
    var player;

    beforeEach(function () {

        player = new Player();
    });

    it("should be able to use private variables in its functions", function () {
        
        //this is something to learn how to work with requirejs better.

        var fooPlayer = new Player();
        var barPlayer = new Player();

        fooPlayer.name = "foo";
        barPlayer.name = "bar";
        
        expect(fooPlayer.log()).toBe("name: foo");
        expect(barPlayer.log()).toBe("name: bar");
    });
});
