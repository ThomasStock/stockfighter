module.exports = function(id, name) {

    var player = {

        id: id,

        name: name,

        log: log,

        pos: {
            x: 0,
            y: 0
        }
    }


    return player;

    function log() {


        console.log("Player " + id);
    }
};