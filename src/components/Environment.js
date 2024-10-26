import Phaser from "phaser";

// import { preload, create, update } from "phaser";
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }
  static controls;
  static player;
  static cursors;
  static objects;
  static speed = 100;

  preload() {
    // Runs once, loads up assets like images and audio
    this.load.image(
      "terrainsAndFences",
      "/src/assets/mainassets/1_Terrains_and_Fences_16x16.png"
    );
    this.load.image(
      "cityTerrains",
      "/src/assets/mainassets/2_City_Terrains_16x16.png"
    );
    this.load.image(
      "cityProps",
      "/src/assets/mainassets/3_City_Props_16x16.png"
    );
    this.load.image(
      "main",
      "/src/assets/mainassets/Modern_Exteriors_Complete_Tileset.png"
    );
    // tileset name need to be the same as the image name here
    this.load.tilemapTiledJSON(
      "map",
      "/src/assets/mainassets/MainTilemap.json"
    );
    this.load.spritesheet(
      "player",
      "/src/assets/mainassets/sprites/postman.png",
      {
        frameWidth: 16,
        frameHeight: 32,
      }
    );
  }

  create() {
    // Runs once, after all assets in preload are loaded
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const mainTileset = map.addTilesetImage(
      "Modern_Exteriors_Complete_Tileset",
      "main"
    );
    const cityTerrainsTileset = map.addTilesetImage(
      "2_City_Terrains_16x16",
      "cityTerrains"
    );
    const cityPropsTileset = map.addTilesetImage(
      "3_City_Props_16x16",
      "cityProps"
    );
    const terrainAndFencesTileset = map.addTilesetImage(
      "1_Terrains_and_Fences_16x16",
      "terrainsAndFences"
    );
    const baseLayer = map.createLayer(
      "Base Foundation Layer (looks like road)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );

    baseLayer.setName("baseLayer");
    const roadLayer = map.createLayer(
      "Road Roads (Actual roads, road lane lines and Such)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    roadLayer.setName("roadLayer");
    const pavementLayer = map.createLayer(
      "City Floors Layer (the floor you walk on that's not road, including walking pavements, flooring facade for buildings)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    pavementLayer.setName("pavementLayer");
    const groundDecorLayer = map.createLayer(
      "Ground Decor",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    groundDecorLayer.setName("groundDecorLayer");
    const streetLightingLayer = map.createLayer(
      "Street Lightings",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    streetLightingLayer.setName("streetLightingLayer");
    const carsLayer = map.createLayer(
      "Cars on Roads",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    carsLayer.setName("carsLayer");
    const buildingFirstLayer = map.createLayer(
      "Buildings, Parks 1st Layer",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    buildingFirstLayer.setName("buildingFirstLayer");

    const bankSchoolFieldLayer = map.createLayer(
      "Bank, School and Field Layer",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );

    bankSchoolFieldLayer.setName("bankSchoolFieldLayer");

    const buildingSecondLayer = map.createLayer(
      "Bank, School, Buildings, Parks Deco Layers (Layer on top)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    buildingSecondLayer.setName("buildingSecondLayer");
    const beachLayer = map.createLayer(
      "Beach Layer",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    beachLayer.setName("beachLayer");

    const beachUmbrellaLayer = map.createLayer(
      "Beach Umbrella Layer",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
        cityPropsTileset,
      ],
      0,
      0
    );
    beachUmbrellaLayer.setName("beachUmbrellaLayer");
    const collisionLayer = map.createLayer(
      "Collides",
      terrainAndFencesTileset,
      0,
      0
    );

    collisionLayer.setCollisionByProperty({ collides: true });
    collisionLayer.setVisible(false);

    //GET OBJECT LAYER
    const doorObjectsLayer = map.getObjectLayer("Doors");
    MainScene.objects = doorObjectsLayer.objects;
    doorObjectsLayer.objects.forEach((doorObject) => {
      console.log(doorObject.name);
      this[doorObject.name] = new Phaser.Geom.Rectangle(
        doorObject.x,
        doorObject.y,
        doorObject.width,
        doorObject.height
      );
      console.log(JSON.stringify(this[doorObject.name]));
    });

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    MainScene.cursors = this.input.keyboard.createCursorKeys();
    MainScene.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
    });

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000",
      })
      .setScrollFactor(0);

    // this.cursors = this.input.keyboard.createCursorKeys();

    // PLAYER CREATION AND SPAWN POINT
    MainScene.player = this.physics.add.sprite(736, 768, "player", 3);

    //MAKE SPRITE COLLIDE WITH MAP BOUNDARIES
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      true,
      true,
      true,
      true
    );
    MainScene.player.body.setCollideWorldBounds(true);

    //TO ALLOW HEAD TO OVERLAP WITH THE BORDERS
    // Adjust the player's body size
    MainScene.player.body.setSize(
      MainScene.player.width,
      MainScene.player.height * 0.75
    ); // Make the player shorter for head overlap
    MainScene.player.body.setOffset(0, MainScene.player.height * 0.25); // Adjust the offset so the player appears correctly on the screen

    // Set up the camera to follow the player
    this.cameras.main.startFollow(MainScene.player);
    this.cameras.main.setZoom(2.5);

    // Optional: Set camera deadzone (to avoid excessive camera movement)
    // this.cameras.main.setDeadzone(50, 50);

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 114,
        end: 119,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 120,
        end: 125,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 126,
        end: 131,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 132,
        end: 137,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.physics.add.collider(MainScene.player, collisionLayer);
    //FOR COLLIDER DEBUGGING
    const debugGraphics = this.add.graphics().setAlpha(0.75);

    collisionLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    // Automatically set depth based on the Y position

    MainScene.controls.update(delta);

    MainScene.player.body.setVelocity(0);
    let moving = false;

    //DO NOTHING FOR DIAGONAL MOVEMENT
    if (MainScene.cursors.left.isDown && MainScene.cursors.up.isDown) {
      ("");
    } else if (MainScene.cursors.left.isDown && MainScene.cursors.down.isDown) {
      ("");
    } else if (MainScene.cursors.right.isDown && MainScene.cursors.up.isDown) {
      ("");
    } else if (
      MainScene.cursors.right.isDown &&
      MainScene.cursors.down.isDown
    ) {
      ("");
    } else {
      //HORIZONTAL MOVEMENT
      if (MainScene.cursors.left.isDown) {
        MainScene.player.body.setVelocityX(-100);
        MainScene.player.anims.play("walk-left", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        moving = true;
      } else if (MainScene.cursors.right.isDown) {
        MainScene.player.body.setVelocityX(100);
        MainScene.player.anims.play("walk-right", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        moving = true;
      }

      // VERTICAL MOVEMENT
      if (MainScene.cursors.up.isDown) {
        MainScene.player.body.setVelocityY(-100);
        MainScene.player.anims.play("walk-up", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        moving = true;
      } else if (MainScene.cursors.down.isDown) {
        MainScene.player.body.setVelocityY(100);
        MainScene.player.anims.play("walk-down", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        moving = true;
      }
    }

    if (!moving) {
      MainScene.player.anims.stop();
    }

    //GET BOUNDS TO CHECK IF PLAYER RECTANGLE OVERLAP WITH DOOR OBJECTS
    const playerBounds = MainScene.player.getBounds();

    // DEPTH SORTING
    this.children.each((child) => {
      // console.log(JSON.stringify(child));
      // console.log(child.depth);
      // if player is above the child, set the child's depth to be higher than the player
      if (
        child.name === "baseLayer" ||
        child.name === "roadLayer" ||
        child.name === "pavementLayer" ||
        child.name === "groundDecorLayer" ||
        child.name === "bankSchoolFieldLayer"
      ) {
        ("");
      } else {
        if (MainScene.player.y > child.y) {
          child.depth = MainScene.player.depth + 1;
          // console.log(`player depth: ${MainScene.player.depth}`);
          // console.log(`child depth: ${child.depth}`);
        }
      }
    });

    MainScene.objects.forEach((doorObject) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          playerBounds,
          this[doorObject.name]
        )
      ) {
        if (doorObject.name === "bankDoor") {
          router.push("/bank");
        }
        console.log(
          `Player is overlapping with door area. Door:
          ${doorObject.name}
        ${JSON.stringify(doorObject)}
        `
        );
      }
    });
  }
}

export function initializePhaser() {
  const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: window.innerWidth, // Canvas width in pixels
    height: window.innerHeight - 56, // Canvas height in pixels
    parent: "phaser-container", // ID of the DOM element to add the canvas to
    scene: MainScene,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // Top down game, so no gravity
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE, // Makes the game responsive
      autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game in the window
    },
  };
  new Phaser.Game(config);
  // let controls;
}
