"use strict";

/**
 * Constantes globales du jeu.
 */

// AFFICHAGE
// Canvas
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1600;
// Boîtes de collisions
const COLLISION_COLOR = "#ff880088";
// Semi-tangibles 
const HALF_TANGIBLE_COLOR = "#ffff0088";
const HALF_TANGIBLE_HEIGHT = 20;
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

const EDITOR_PRECISION = 20;
// Grille de l'éditeur
const EDITOR_GRID_SIZE = 80;
const EDITOR_GRID_COLOR = "#888888";
const EDITOR_SCALE_COLOR = "#ffffff";
// Boutons de l'éditeur
const EDITOR_BUTTON_SIZE = 120;
// Sélection
const EDITOR_SELECT_THING_COLOR = "#0088ff";
const EDITOR_SELECT_THING_SELECTED_COLOR = "#00ffff";
const EDITOR_SELECT_THING_FILL_COLOR = "#0088ff44";
const EDITOR_SELECT_THING_POINT_COLOR = "#0066bb";
const EDITOR_SELECT_THING_WIDTH = 5;