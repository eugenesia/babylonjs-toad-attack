// Global vars.
var canvas, engine, scene, camera, score = 0;
var TOAD_MODEL;

// An array to store each ending of the lane.
var ENDINGS = [];

// Store all enemies.
var ENEMIES = [];


/**
 * Load the scene when canvas fully loaded.
 */
document.addEventListener("DOMContentLoaded", function() {
  if (BABYLON.Engine.isSupported()) {
    initScene();
    initGame();
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
  scene = new BABYLON.Scene(engine);

  // Create the camera.
  camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
  camera.setTarget(new BABYLON.Vector3(0,0,10));
  camera.attachControl(canvas);

  // Create light.
  var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);

  // Render the scene continuously.
  engine.runRenderLoop(function() {
    scene.render();

    // Move all shrooms forward each frame.
    ENEMIES.forEach(function (shroom) {
      if (shroom.killed) {
        // Nothing to do here.
      }
      else {
        // Move shroom forward.
        shroom.position.z -= 0.5;
      }
    });
  });
}


/**
 * Initialize the game.
 */
function initGame() {
  // Number of lanes.
  var LANE_NUMBER = 3;
  // Space between lanes.
  var LANE_INTERVAL = 5;
  var LANES_POSITIONS = [];

  // Create ground material using texture image.
  var ground = new BABYLON.StandardMaterial("ground", scene);
  var texture = new BABYLON.Texture("assets/ground.jpg", scene);
  // Scale the texture to fit the scaled entity.
  texture.uScale = 40;
  texture.vScale = 2;
  ground.diffuseTexture = texture;

  // Function to create lanes.
  var createLane = function (id, position) {
    var lane = BABYLON.Mesh.CreateBox("lane" + id, 1, scene);
    lane.scaling.y = 0.1;
    lane.scaling.x = 3;
    lane.scaling.z = 800;
    lane.position.x = position;
    lane.position.z = lane.scaling.z/2 - 100;

    // Set lane material to be ground.
    lane.material = ground;
  };

  // A plane denoting the near end of the lane.
  var createEnding = function (id, position) {
    var ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
    ending.position.x = position;
    ending.position.y = 0.1;
    ending.position.z = 1;
    var mat = new BABYLON.StandardMaterial("endingMat", scene);
    mat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
    ending.material = mat;
    return ending;
  };

  // The X axis value of the centre of the lane.
  var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);

  for (var i = 0; i < LANE_NUMBER; i++) {
    LANES_POSITIONS[i] = currentLanePosition;
    createLane(i, currentLanePosition);
    var e = createEnding(i, currentLanePosition);
    ENDINGS.push(e);
    currentLanePosition += LANE_INTERVAL;
  }

  // Adjust camera position to the middle lane.
  camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];

  // The function ImportMesh will import our custom model in the scene given in
  // parameter.
  BABYLON.SceneLoader.ImportMesh("red_toad", "assets/", "toad.babylon",
    scene, function (meshes) { 
      // Loaded only 1 mesh - the "red_toad" mesh from file. Use it.
      var m = meshes[0];
      m.isVisible = false;
      m.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
      TOAD_MODEL = m;
    }
  );

  
  ENEMIES = [];

  // Create a shroom in a random lane.
  var createEnemy = function () {
    // Starting position of toads.
    var posZ = 100;

    // Get a random lane.
    var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

    // Create a clone of our template toad.
    var shroom = TOAD_MODEL.clone(TOAD_MODEL.name);

    // ID will be "red_toad 1", "red_toad 2", etc.
    shroom.id = TOAD_MODEL.name + (ENEMIES.length + 1);
    // Toad not killed yet.
    shroom.killed = false;
    // Make it visible.
    shroom.isVisible = true;
    // Update position
    shroom.position = new BABYLON.Vector3(posX, shroom.position.y/2, posZ);
    ENEMIES.push(shroom);
  };

  // Create a clone every 1 second.
  setInterval(createEnemy, 1000);


}


