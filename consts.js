"use strict";

/**
 * Constantes globales du jeu.
 */

// AFFICHAGE
// Canvas
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1600;
// Boîtes de collisions
const COLLISION_COLOR = "#ff8800";
// Semi-tangibles 
const SEMI_TANGIBLE_COLOR = "#ffff00";
const SEMI_TANGIBLE_HEIGHT = 40;
// Avatar (temporairement)
const AVATAR_COLOR = "#ff77CC";

// AVATAR
// Taille de l'avatar
const AVATAR_WIDTH = 120;
const AVATAR_HEIGHT = 200;

// PHYSIQUE
const GRAVITY = 5200 // px/s²
// La vitesse de l'avatar pour atteindre sa vitesse max
const AVATAR_ACCELERATION = 4000; // px/s²
const AVATAR_MAXSPEED = 960; // px/s
const AVATAR_JUMPFORCE = 2000; // px/s

// Délai entre chaque tick
const DELAY_BETWEEN_TICKS = 1 / 60 // en s

// Grille de l'éditeur
const EDITOR_GRID_SIZE = 160;
const EDITOR_GRID_COLOR = "#88888888";
// Boutons de l'éditeur
const EDITOR_BUTTON_SIZE = 120;