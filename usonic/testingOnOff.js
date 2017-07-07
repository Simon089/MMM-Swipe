/* jshint esversion:6 */

var Gpio = require('onoff').Gpio,
    trigger = new Gpio(23, "out"),
    echo = new Gpio(24, "in", "both");
let { usleep } = require('usleep');

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius 
var MICROSECONDS_PER_CM = 1e6 / 34321;

trigger.writeSync(0);

/* Asyncronous Write Example
  trigger.write(0, (err) => {
      if (err) {
        throw err;
      }
    }); // Make sure trigger is low 
*/

(function() {
    var startTick;

    echo.watch((err, value) => {
        var dist, usDiff, diff;
        if (err) {
            throw err;
        }


        if (value == 1) {
            startTick = process.hrtime();
        } else {
            diff = process.hrtime(startTick);
            // Full conversion of hrtime to us => [0]*1000000 + [1]/1000
            usDiff = diff[0]*1000000 + diff[1]/1000;

            if (usDiff > 1000) { return; } // Bad Data

            dist = usDiff / 2 / MICROSECONDS_PER_CM;
            console.log(`Distance: ${dist.toFixed(2)}cm`);
        }
    });
}());

// Trigger a distance measurement once per second 
setInterval(function() {
    // Set trigger high for 10 microseconds
    trigger.writeSync(1);
    usleep(10);
    trigger.writeSync(0);
}, 300);

process.on('SIGINT', function() {
    trigger.unexport();
    echo.unexport();
});
