module.exports = function(id, name) {

    var input = {

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


    return input;

};