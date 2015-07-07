var config = require('./config');

module.exports = function(foo, bar){
    
    this.foo = foo;
    this.bar = bar;
    
    this.baz = function(){
        config.log("baz");
    }
}