// Global vars.
var canvas, engine, scene, camera, score = 0;
var TOAD_MODEL;

// An array to store each ending of the lane.
var ENDINGS = [];

/**
 * Load the scene when canvas fully loaded.
 */
document.addEventListener("DOMContentLoaded", function() {
  if (BABYLON.Engine.isSupported()) {
    initScene();
  }
}, false);

/**
 * Create a new BABYLON Engine and initialise the scene.
 */
function initScene() {
  // Get canvas.
  canvas = document.getElementById("renderCanvas");

  // Create Babylon engine.
  engine = new BABYLON.Engine(canvas, true);

  // Create scene.
  scene = BABYLON.Scene(engine);

  // Create the camera.
  camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
  camera.setTarget(new BABYLON.Vector3(0,0,10));
  camera.attachControl(canvas);

  // Create light.
  var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);
}

