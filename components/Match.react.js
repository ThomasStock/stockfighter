var React = require('react'),
    ReactCanvas = require('react-canvas'),
    config = require('./../config');
    
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;

module.exports = Match = React.createClass({
    
    endMatch: function(){
        
        //request the server to end the match
        socket.emit(config.events.requestEndMatch);
    },
    
    getImageHeight: function() {
        return Math.round(window.innerHeight / 2);
    },

    getImageStyle: function() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: this.getImageHeight()
        };
    },

    getTextStyle: function() {
        return {
            top: this.getImageHeight() + 10,
            left: 0,
            width: window.innerWidth,
            height: 20,
            lineHeight: 20,
            fontSize: 12
        };
    },
    
    // Render the component
    render: function() {
        
        if(!this.props.isEndMatchRequested){

            var surfaceWidth = window.innerWidth;
            var surfaceHeight = window.innerHeight;
            var imageStyle = this.getImageStyle();
            var textStyle = this.getTextStyle();
        
            return (
                <div className="match-view">
                    
                    <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
                        <Image style={imageStyle} src='http://www.picturesnew.com/media/images/picture-wallpaper.jpg' />
                        <Text style={textStyle}>
                          Here is some text below an image.
                        </Text>
                    </Surface>
                    
                    <input type="button" value="End the match" onClick={this.endMatch} />
                    
                </div>
            );
        }

        return <div>ending match..</div>;
    }
});