# Module: MMM-Swipe
The `MMM-Swipe` program is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon module.
This module uses 2 HC-SR04 ultrasonic sensors to determing hand position to produce a "Swipe Left" or "Swipe Right"

# DEVELOPMENT NOTE:
This is a fork of [MMM-Swipe](https://github.com/shbatm/MMM-Swipe) by shbatm. Thank you to shbatm and mochman, who created the initial module, for their work.

## Differences from original (made by shbatm):
* Uses `onoff` node module instead of `mmm-usonic` and `mmm-gpio`
* No SUDO required
* Sensors/detection can be started/stopped automatically with the `autoStart` configuration option, or can be started/stopped by sending a notification from another module: e.g.: `this.sendNotification("SWIPE_CONTROL", "START")`.
* Testing scripts included in the `usonic` folder if you want to play around with the sensors. Run them using `node usonic/testingXXX.js` from the MMM-Swipe folder. Also includes a script to use `pigpio` instead of `onoff` (still requires sudo).

**NOTE:** After my (Simon089) changed, AutoStart is not implemented anymore. I also never used the tests in the `usonic` directory so I do not know if they still work, but I will leave them in here, if someone wants to use them.

## Differences from the fork (made by me):
* Different method to detect a swipe
* Some small displaying changes
* Make it compatible to [MMM-Pages](https://github.com/edward-shen/MMM-pages)
* **Wiring** I kept shbatm's idea of using only one trigger pin, but I wired my sensors with only one 1k Ohm resistor per sensor (see image)
![image](https://raw.githubusercontent.com/clebert/r-pi-usonic/master/resources/hcsr04.png "HC-SR05 wiring")

## Installing the module
1. Execute `git clone https://github.com/Simon089/MMM-Swipe.git` in your `modules` folder
2. `cd` into it and `npm install`

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-Swipe',
		position: 'bottom_center',
		config: {
			// See 'Configuration options' for more information.
			// trigger pin triggers both ultrasonic sensors
			triggerPin: 23,
			// both echo pins, use side the sensor is when you look at the mirror
			echoLeftPin: 24,
			echoRightPin: 26,
			// everything < leftDistance/rightDistance is considered as a recognized object (e.g. your hand)
			leftDistance: 50,
			rightDistance: 50,
			// everything > maxDistance is an invalid measurement
			maxDistance: 200,
			// writes the sensed distances on the mirror
			calibrate: false,
			// outputs measurements for a swipe in the console log
			verbose: false,
		}
	}
]
````

This module will use `sendNotification(notification, payload)` to change pages with the MMM-Pages module mentioned above.
`notification = PAGE_INCREMENT` for a `Swipe Right` and `notification = PAGE_INCREMENT` for a `Swipe Left`.
`payload` will always be empty, since MMM-Pages ignores it for these two notifications.

## Configuration options
The following properties can be configured:

|Option | Description | Default Value |
|-------|-------------|---------------|
|triggerPin  | Trigger pin for both sensors. | `23` |
|echoLeftPin | Left sensor's echo pin. | `24` |
|echoRightPin | Right Sensor's Trigger pin. | `26` |
|leftDistance | Distance in cm that will initiate the movement detection with the left sensor. | `50` |
|rightDistance | Distance in cm that will initiate the movement detection with the right sensor. | `50` |
|maxDistance | Distance in cm. Every measurement higher than this will be ignored. | `200` |
|sampleInterval | Interval in `ms` for the sensors while no movement is detected. | `300` |
|swipeSpeed | Duration in `ms` how long a swipe lasts | `800` |
|calibrate | This will dispay the distances read by your sensors on the screen so you can use a `leftDistance` and `rightDistance` that works for you. | `false` |
|verbose | Will display swipe data to the console for testing the swipe detection. | `false` |
