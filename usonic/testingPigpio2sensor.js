/* jshint esversion:6 */

// Pin setup
const LEFT_SENSOR_TRIGGER_PIN = 23;
const LEFT_SENSOR_ECHO_PIN = 24;
const RIGHT_SENSOR_TRIGGER_PIN = 17;
const RIGHT_SENSOR_ECHO_PIN = 27;
const MEASUREMENT_FREQUENCY = 400; // in milliseconds (ms)
const MEASUREMENT_TIMEOUT = 1000; // in microseconds (us)

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius 
const MICROSECONDS_PER_CM = 1e6 / 34321;


var Gpio = require('pigpio').Gpio,
    triggerLeft = new Gpio(LEFT_SENSOR_TRIGGER_PIN, {mode: Gpio.OUTPUT}),
    echoLeft = new Gpio(LEFT_SENSOR_ECHO_PIN, {mode: Gpio.INPUT, alert: true}),
    triggerRight = new Gpio(RIGHT_SENSOR_TRIGGER_PIN, {mode: Gpio.OUTPUT}),
    echoRight = new Gpio(RIGHT_SENSOR_ECHO_PIN, {mode: Gpio.INPUT, alert: true});
 
triggerLeft.digitalWrite(0); // Make sure trigger is low 
triggerRight.digitalWrite(0);
 
(function () {
  var startTickRight;
 
  echoRight.on('alert', function (level, tick) {
    var endTick,
      diff, dist;
 
    if (level == 1) {
      startTickRight = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTickRight >> 0); // Unsigned 32 bit arithmetic 
      dist = diff / 2 / MICROSECONDS_PER_CM;
      console.log(`Right: ${dist.toFixed(2)}`);
    }
  });

  echoLeft.on('alert', function (level, tick) {
    var endTick,
      diff, dist;
 
    if (level == 1) {
      startTickLeft = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTickLeft >> 0); // Unsigned 32 bit arithmetic 
      dist = diff / 2 / MICROSECONDS_PER_CM;
      console.log(`Left: ${dist.toFixed(2)}`);
    }
  });
}());
 
// Trigger a distance measurement once per second 
setInterval(function () {
  triggerRight.trigger(10, 1); // Set trigger high for 10 microseconds 
  triggerLeft.trigger(10, 1); // Set trigger high for 10 microseconds 
}, MEASUREMENT_FREQUENCY);