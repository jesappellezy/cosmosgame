"use strict";

var tickObject = new Game();

function main() {
	// Boucle
	var startTime = Date.now();
	function loop() {
		console.log("tick");
		tickObject.tick();
		var endTime = Date.now();
	
		startTime += DELAY_BETWEEN_TICKS*1000;
		if(startTime < endTime) {
			// La frame a pris trop de temps
			startTime = Date.now();
			setTimeout(loop, 0);
		}
		else {
			setTimeout(loop, startTime - Date.now())
		}
	}
	loop();
}

main();