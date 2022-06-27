"use strict";

/**
 * Images à importer de assets/.
 * Par défaut, c'est un string du chemin du fichier (relatif à "assets/"), et quand `loadAssets()` a été appelé, c'est :
 * - une image si le fichier est un png.
 */
var assets = {
	/**
	 * Editeur de niveaux.
	 */
	Editor: {
		button: "editor/button.png",
		buttonHover: "editor/button_hover.png",
		buttonActive: "editor/button_active.png"
	}
}

/**
 * Importe tous les fichiers de assets dans assets.
 * - onloadend: fonction a exécuter quand tout a été chargé.
 */
function loadAssets(onloadend) {
	function getValue(location) {
		var value = assets;
		for(var i = 0; i < location.length; i++) {
			value = value[location[i]];
		}
		return value;
	}

	var keysList = [];
	function getKeys(location = [], dict = assets) {
		Object.keys(dict).forEach((key) => {

			var newLocation = Array(...location, key);
			var value = getValue(newLocation);

			
			if(typeof(value) == "object") {
				getKeys(newLocation, value);
			}
			else {
				keysList.push(newLocation);
			}
		});
	}
	getKeys();

	function* files() {
		for(var i = 0; i < keysList.length; i++) {
			var keys = keysList[i];
			var file = getValue(keys);
			
			data = undefined;
			if(file.slice(-4) == ".png") {
				var data = document.createElement("img");
				data.loading = "preload";
				var r = {el: data, src: "assets/" + file};
				yield r;
			}
			else {
				throw file + " n'est pas un fichier .png.";
			}

			getValue(keys.slice(0, -1))[keys.slice(-1)] = data;
		};
	}

	var gen = files();
	function load(value) {
		if(value != undefined) {
			value.el.onloadend = () => {
				load(gen.next().value);
			};
			value.el.src = value.src;
		}
	}
	load(gen.next().value);

	function isAllLoaded() {
		for(var i = 0; i < keysList.length; i++) {
			if(typeof(getValue(keysList[i])) != "object")
				return false;
		}
		return true;
	}

	function testAllLoaded() {
		if(isAllLoaded())
			onloadend();
		else
			setTimeout(testAllLoaded, 10);
	}
	testAllLoaded();
}