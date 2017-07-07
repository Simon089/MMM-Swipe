/* Magic Mirror
 * Module: MMM-Swipe
 * 
 * By Luke Moch
 * MIT Licensed
 */

Module.register("MMM-Swipe", {
    defaults: {
        echoLeftPin: 24,
        triggerPin: 23,             // New
        /*triggerLeftPin: "",*/     // Obsolete Now Uses Single Pin
        echoRightPin: 27,
        /*triggerRightPin: "",*/    // Obsolete Now Uses Single Pin
        leftDistance: "",
        rightDistance: "",
        useAsButton: false,
        buttonPin: "",
        sensorTimeout: 500,
        animationSpeed: 200,
        sampleInterval: 300,
        swipeSpeed: 1000,
        verbose: false,
        calibrate: true,
        autoStart: true,
    },

    start: function() {
        var self = this;
        console.log('Starting Module: ' + this.name);

        this.loaded = false;
        this.kbInstance = (["127.0.0.1", "localhost"].indexOf(
            window.location.hostname) > -1) ? "SERVER" : "LOCAL";

        if (self.config.useAsButton === true) {
            // self.sendSocketNotification('INIT_BUTTON', self.config.buttonPin);
            // Not implemented at the moment.
        }

        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'STARTED') {
            if (this.config.autoStart) {
                this.sendSocketNotification("START", null);
            }
        }
        if (notification === 'CALIBRATION') {
            this.displayData = "<table border=\"1\" cellpadding=\"5\"><tr align=\"center\"><th>Left</td><th>Right</td></tr><tr align=\"center\"><td>" + payload.Left + "</td><td>" + payload.Right + "</td></tr></table>";
            this.updateDom(this.config.animationSpeed);
        } else if (notification === 'MOVEMENT') {
            this.sendNotification("SHOW_ALERT", { title: "Swipe Detected", message: payload, imageFA: "hand-paper-o", timer: 5000});
            this.sendNotification("MOVEMENT", payload);
        }
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === 'DOM_OBJECTS_CREATED') {
            this.loaded = true;
        }
        if (notification === 'ALL_MODULES_STARTED') {

        }
        if (notification === 'SWIPE_CONTROL') {
            // Accepts payloads of "START" or "STOP" to control ultrasonics
            // if (this.kbInstance === "SERVER") {
                this.sendSocketNotification(payload, null);
            // }
        }
    },

    getDom: function() {
        var self = this;

        // create element wrapper for show into the module
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = "Loading "+this.name+"...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.error) {
            wrapper.innerHTML = "Error loading data...";
            return wrapper;
        }

        if (typeof this.displayData !== "undefined") {
            wrapper.innerHTML = this.displayData;
            wrapper.className = "dimmed light small";
        }
        return wrapper;
    }
});
