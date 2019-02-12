
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        window.screen.orientation.lock('portrait');
        
    },

   
    onDeviceReady: function() {
        console.log('device ready');
    },

    
};

app.initialize();

    