## Noms
- ceciEstUneVariable
- CECI_EST_UNE_CONSTANTE (ça peut être une variable mais qui ne change pas durant tout le jeu)
- CeciEstUneClass

## Trucs à considérer privé pour un objet

Les paramètres d'un objet et les fonctions dont le nom commence par `_` ne doivent pas être appelés à l'extérieur d'un objet (juste une convention comme ça pas de problème).

## Comment l'implémenter en HTML ?

Chaque fichier .js doit être inclut dans la page index.html via la ligne :
```<script type="text/javascript" src="dossier/fichier.js"></script>```
Par contre, si script2.js a besoin de quelque chose défini dans script1.js, il faut que script1.js soit inclut *avant* script2.js.

## Comment dessiner sur le canvas ?

Interface renvoie un objet contexte : https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D

## Fonction spéciale pour le contexte canvas

J'ai fait une fonction `ctx.fillRectTrunc()` pour remplacer `ctx.fillRect()`, elle s'utilise pareil, mais vaut mieux l'utiliser pour afficher des objets, sinon ça tremble c'est bizarre.

## C'est quoi `getZ()` ?

Si le Z d'un objet est plus grand qu'un autre, ça veut dire qu'il sera affiché au dessus de l'autre.
C'est pour le jour où on pourra mettre des objets plus devant et plus derrière et faire de la perspective B)

Boh en attendant on peut mettre `return 0;`

## Syntaxe d'un fichier de niveau .cosmoslevel

Ce fichier contient toutes les informations d'un niveau :
- Position de départ de l'avatar ;
- Boîtes de collisions, semi-tangibles.
Chacune de ces données doivent être définis, même pour des données vides.

Il peut y avoir des lignes vides et des espaces partout, ils seront ignorés.
Les nombres doivent être des entiers.

# Début et fin du fichier

Le fichier commence par la ligne `BEGIN` et se termine par `END`.

# Position de départ de l'avatar

Syntaxe :
```
AVATAR_START
x,y
```

# Boîtes de collision

La partie doit commencer par :
```
COLLISION_BOXES
```

Ensuite, pour chaque boîte de collision, on a une ligne avec cette syntaxe :
```
x,y,width,height
```

# Semi-tangibles

La partie doit commencer par :
```
HALF_TANGIBLES
```

Ensuite, pour chaque boîte de collision, on a une ligne avec cette syntaxe :
```
x,y,width,height
```