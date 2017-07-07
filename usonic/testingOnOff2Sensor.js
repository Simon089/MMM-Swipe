/* jshint esversion:6 */

// Pin setup
const LEFT_SENSOR_TRIGGER_PIN = 23;
const LEFT_SENSOR_ECHO_PIN = 24;
const RIGHT_SENSOR_TRIGGER_PIN = 17;
const RIGHT_SENSOR_ECHO_PIN = 27;
const MEASUREMENT_FREQUENCY = 300; // in milliseconds (ms)
const MEASUREMENT_TIMEOUT = 1000; // in microseconds (us)

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius 
const MICROSECONDS_PER_CM = 1e6 / 34321;


var Gpio = require('onoff').Gpio,
    triggerLeft = new Gpio(LEFT_SENSOR_TRIGGER_PIN, "out"),
    echoLeft = new Gpio(LEFT_SENSOR_ECHO_PIN, "in", "both"),
    //triggerRight = new Gpio(RIGHT_SENSOR_TRIGGER_PIN, "out"),
    echoRight = new Gpio(RIGHT_SENSOR_ECHO_PIN, "in", "both");
let { usleep } = require('usleep');

triggerLeft.writeSync(0);
// triggerRight.writeSync(0);

(function() {
    var startTickLeft, startTickRight;

    echoLeft.watch((err, value) => {
        var endTick, diff;
        if (err) {
            throw err;
        }

        if (value == 1) {
            startTickLeft = process.hrtime();
        } else {
            diff = process.hrtime(startTickLeft);
            // Full conversion of hrtime to us => [0]*1000000 + [1]/1000
            usDiff = diff[0]*1000000 + diff[1]/1000;
            if (usDiff > MEASUREMENT_TIMEOUT) {  // Ignore bad measurements
                return;
            }

            dist = usDiff / 2 / MICROSECONDS_PER_CM;
            console.log(`Left: ${dist.toFixed(2)}`);
        }
    });

    echoRight.watch((err, value) => {
        var endTick, diff;
        if (err) {
            throw err;
        }

        if (value == 1) {
            startTickRight = process.hrtime();
        } else {
            diff = process.hrtime(startTickRight);
            // Full conversion of hrtime to us => [0]*1000000 + [1]/1000
            usDiff = diff[0]*1000000 + diff[1]/1000;
            if (usDiff > MEASUREMENT_TIMEOUT) {  // Ignore bad measurements
                return;
            }

            dist = usDiff / 2 / MICROSECONDS_PER_CM;
            console.log(`Right: ${dist.toFixed(2)}`);
        }
    });
}());

// Trigger a distance measurement once per second 
setInterval(function() {
    // Set trigger high for 10 microseconds
    triggerLeft.writeSync(1);
    usleep(10);
    triggerLeft.writeSync(0);
    // usleep(10);
    // triggerRight.writeSync(1);
    // usleep(10);
    // triggerRight.writeSync(0);
}, MEASUREMENT_FREQUENCY);

process.on('SIGINT', function() {
    triggerLeft.unexport();
    echoLeft.unexport();
    // triggerRight.unexport();
    echoRight.unexport();
});
