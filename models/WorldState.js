module.exports = function() {
    
    var self = this;
    
    self.hello = "initial";
    
    self.timer = new Date();
    
    self.log = function() {
        
        console.log('hello is ' + self.hello + ' and timer is ' + self.timer.getTime());
    };
};