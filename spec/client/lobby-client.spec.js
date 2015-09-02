/*"use strict";

describe("a lobby client", function () {

    var rewire = require("rewire");
    var Player = rewire("../server/player");

    it("should be able to use private variables in its functions", function () {
        
        var fooPlayer = new Player();
        var barPlayer = new Player();

        fooPlayer.name = "foo";
        barPlayer.name = "bar";
        
        expect(fooPlayer.log()).toBe("name: foo");
        expect(barPlayer.log()).toBe("name: bar");
    });
});
*/