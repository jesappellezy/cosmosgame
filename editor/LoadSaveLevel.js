/**
 * Fonctions pour sauvegarder et charger des niveaux dans l'éditeur.
 * 
 * Voir README.md pour voir la syntaxe d'un fichier de niveau.
 */
class LoadSaveLevel {

	/**
	 * Télécharge le niveau dans un fichier .cosmoslevel
	 */
	static saveInFile(level) {
		var str = LoadSaveLevel.save(level);

		var element = document.createElement('a');
		element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(str));
		element.setAttribute('download', "excellent_niveau.cosmoslevel");
		//document.body.appendChild(element); // est-ce utile ?
		element.click();
	}

	/**
	 * Charge le niveau depuis un fichier .cosmoslevel donné par l'utilisateur
	 */
	static loadFromFile(onloaded) {
		var el = document.createElement("input");
		el.type = "file";
		el.accept = ".cosmoslevel";
		el.addEventListener("change", (e) => {
			el.files[0].text().then((str) => {
				onloaded(LoadSaveLevel.load(str));
			});
		})
		el.click();
	}

	static save(level) {
		var S = String;

		var str = "BEGIN\n";

		str += "AVATAR_START\n" + S(level._baseX) + "," + S(level._baseY) + "\n";

		str += "COLLISION_BOXES\n";
		level.collision.collisionBoxes.forEach((box) => {
			str += S(box[0]) + "," + S(box[1]) + "," + S(box[2]) + "," + S(box[3]) + "\n";
		});

		str += "HALF_TANGIBLES\n";
		level.collision.halfTangibles.forEach((ht) => {
			str += S(ht[0]) + "," + S(ht[1]) + "," + S(ht[2]) + "\n";
		});

		str += "END\n";

		return str;
	}

	static load(str) {
		function all(arr, f) {
			for (var i = arr.length - 1; i >= 0; i--) {
				if(!f(arr[i])) return false;
			}
			return true;
		}

		function allToNumber(arr) {
			var r = [];
			arr.forEach((v) => {
				r.push(Number(v));
			})
			return r;
		}

		function isAnInt(str) {
			return /^\-?[0-9]+$/g.test(str);
		}

		class ImportError extends Error {
			constructor(i) {
				if(i == "EOF")
					super("EOF: erreur de syntaxe.");
				else
					super("Ligne " + String(i+1) + ": erreur de syntaxe.");
				self.line = i + 1;
			}
		}

		var avatarStart;
		var collisionBoxes;
		var halfTangibles;
		var started = false;
		var ended = false;
		var currentContext = null;

		str.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n").forEach((line, i) => {
			line = line.replaceAll(" ", "");
			if(line != "") {
				if(ended)
					throw new ImportError(i);

				switch(line) {
					case "BEGIN":
						if(started)
							throw new ImportError(i);
						started = true;
						return;
					case "END":
						ended = true;
						return;

					case "AVATAR_START":
						if(avatarStart != undefined)
							throw new ImportError(i);
						currentContext = "AVATAR_START"
						break;
					case "COLLISION_BOXES":
						if(collisionBoxes != undefined)
							throw new ImportError(i);
						currentContext = "COLLISION_BOXES"
						collisionBoxes = [];
						break;
					case "HALF_TANGIBLES":
						if(halfTangibles != undefined)
							throw new ImportError(i);
						currentContext = "HALF_TANGIBLES"
						halfTangibles = [];
						break;

					default:
						switch(currentContext) {
							case "AVATAR_START":
								var r = line.split(",");
								if(r.length != 2 || !all(r, isAnInt))
									throw new ImportError(i);
								avatarStart = allToNumber(r);
								break;
							case "COLLISION_BOXES":
								var r = line.split(",");
								if(r.length != 4 || !all(r, isAnInt))
									throw new ImportError(i);
								collisionBoxes.push(allToNumber(r));
								break;
							case "HALF_TANGIBLES":
								var r = line.split(",");
								if(r.length != 3 || !all(r, isAnInt))
									throw new ImportError(i);
								halfTangibles.push(allToNumber(r));
								break;
						}
				}
			}
		});

		if(
			avatarStart == undefined ||
			collisionBoxes == undefined ||
			halfTangibles == undefined ||
			!started ||
			!ended
			)
			throw new ImportError("EOF");

		return new Level(avatarStart[0], avatarStart[1], new Collision(collisionBoxes, halfTangibles));
	}
}