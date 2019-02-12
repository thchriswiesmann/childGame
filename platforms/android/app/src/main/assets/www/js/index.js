
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

   
    onDeviceReady: function() {
        console.log('device ready');
        var p = $('#device p');
        p.text("Device is ready to do fancy stuff");
    },

    
};

app.initialize();

    