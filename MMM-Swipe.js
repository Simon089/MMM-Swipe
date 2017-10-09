/* Magic Mirror
 * Module: MMM-Swipe
 * 
 * By Luke Moch
 * MIT Licensed
 */

Module.register("MMM-Swipe", {
    defaults: {
        // trigger pin triggers both ultrasonic sensors
        triggerPin: 23,
        // both echo pins, use side the sensor is when you look at the mirror
        echoLeftPin: 24,
        echoRightPin: 26,
        // the max distances when a movement should count
        leftDistance: 50,
        rightDistance: 50,
        // everything > maxDistance is an invalid measurement
        maxDistance: 200,
        // interval for the measurement in "standby" mode [ms]
        sampleInterval: 300,
        // the time how long a swipe is [ms]
        swipeSpeed: 800,
        // writes the sensed distances on the mirror
        calibrate: false,
        // outputs measurements for a swipe in the console log
        verbose: false,
        // determines if the sensors should start when the module is loaded.
        // if false, the sensors have to be started with a message (not implemented yet!)
        autoStart: true,
    },

    start: function() {
        this.loaded = false;
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        if (notification === 'CALIBRATION') {
            this.displayData = "<table border=\"1\" cellpadding=\"5\"><tr align=\"center\"><th>Left</td><th>Right</td></tr><tr align=\"center\"><td>" + payload["Left"] + "</td><td>" + payload["Right"] + "</td></tr></table>";
            this.updateDom();
        } else if (notification === 'MOVEMENT') {
            this.displayData = "Movement: " + payload;
            if (payload === "Swipe Right") {
                this.sendNotification("PAGE_INCREMENT");
            } else if (payload === "Swipe Left") {
                this.sendNotification("PAGE_DECREMENT");
            }
            this.updateDom();
            setTimeout(function () {
                self.displayData = 'waiting for movement ...';
                self.updateDom(200);
            }, 2000);
        }
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === 'DOM_OBJECTS_CREATED') {
            this.displayData = "waiting for movement ..."
            this.loaded = true;
            this.updateDom(200);
        }
        // not implemented yet
        // if (notification === 'SWIPE_CONTROL') {
        //     // Accepts payloads of "START" or "STOP" to control ultrasonics
        //     // if (this.kbInstance === "SERVER") {
        //         this.sendSocketNotification(payload, null);
        //     // }
        // }
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        if (!this.loaded) {
            wrapper.innerHTML = "Loading " + this.name + "...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (typeof this.displayData !== "undefined") {
            wrapper.innerHTML = this.displayData;
            wrapper.className = "dimmed light small";
        }
        return wrapper;
    }
});
