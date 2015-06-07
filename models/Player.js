module.exports = function(id, name) {

    var player = {

        id: id,

        name: name,

        log: log,

        pos: {
            x: 0,
            y: 0
        },
        
        color: null,
        
        matchInputs: []
    }


    return player;

    function log() {


        console.log("Player " + name + " (id: " + id + ")");
    }
};