var worldState = {

    hello: "initial",

    timer: new Date(),

    log: function() {

        console.log('hello is ' + this.hello + ' and timer is ' + this.timer.getTime());
    }
};

module.exports = function() {
    return worldState;
};