"use strict";

/**
 * Constantes globales du jeu.
 */

// AFFICHAGE
// Boîtes de collisions
const COLLISION_COLOR = "#ff8800";
// Semi-tangibles 
const SEMI_TANGIBLE_COLOR = "#ffff00";
const SEMI_TANGIBLE_HEIGHT = 10;
// Avatar (temporairement)
const AVATAR_COLOR = "#ff77CC";

// AVATAR
// Taille de l'avatar
const AVATAR_WIDTH = 30;
const AVATAR_HEIGHT = 50;

// PHYSIQUE
const GRAVITY = 1300 // px/s²
// La vitesse de l'avatar pour atteindre sa vitesse max
const AVATAR_ACCELERATION = 1000; // px/s²
const AVATAR_MAXSPEED = 240; // px/s
const AVATAR_JUMPFORCE = 500; // px/s

// Délai entre chaque tick
const DELAY_BETWEEN_TICKS = 1 / 60 // en s