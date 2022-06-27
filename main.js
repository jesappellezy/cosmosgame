"use strict";

// Appelle tickObject.tick() et tickObject.draw(ctx) en boucle.
function main() {
	window.tickObject = new Editor(new Level());

	// Boucle
	var startTime = Date.now();
	function loop() {
		tickObject.tick();
		Interface.Input.getLeftClick();
		tickObject.draw(Interface.Output.getContext());
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

loadAssets(main);