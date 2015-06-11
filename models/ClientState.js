module.exports = function(id, name) {

    var clientState = {

        id: id,

        name: name,

        pos: {
            x: 0,
            y: 0
        },
        
        color: null,
        
        matchInputs: []
    }


    return clientState;

};