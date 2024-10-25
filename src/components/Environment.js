import Phaser from "phaser";
// import { preload, create, update } from "phaser";
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }
  static controls;
  static player;
  static cursors;
  static speed = 40;

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
      [cityTerrainsTileset, terrainAndFencesTileset],
      0,
      0
    );
    const roadLayer = map.createLayer(
      "Road Roads (Actual roads, road lane lines and Such)",
      [cityTerrainsTileset, terrainAndFencesTileset],
      0,
      0
    );
    const pavementLayer = map.createLayer(
      "City Floors Layer (the floor you walk on that's not road, including walking pavements, flooring facade for buildings)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
      ],
      0,
      0
    );
    const roadDecorLayer = map.createLayer(
      "Parking Lots, Road Fixtures or 2nd layer for traffic lights(crossings etc)",
      [cityPropsTileset, terrainAndFencesTileset, cityTerrainsTileset],
      0,
      0
    );
    const streetLightingLayer = map.createLayer(
      "Street Lightings",
      cityPropsTileset,
      0,
      0
    );
    const carsLayer = map.createLayer("Cars on Roads", mainTileset, 0, 0);
    const buildingFirstLayer = map.createLayer(
      "Bank, School, Buildings, Parks 1st Layer",
      [mainTileset, cityTerrainsTileset],
      0,
      0
    );
    const buildingSecondLayer = map.createLayer(
      "Bank, School, Buildings, Parks Deco Layers (Layer on top)",
      [
        cityTerrainsTileset,
        terrainAndFencesTileset,
        cityTerrainsTileset,
        mainTileset,
      ],
      0,
      0
    );

    const beachLayer = map.createLayer(
      "Beach",
      [mainTileset, terrainAndFencesTileset],
      0,
      0
    );

    baseLayer.setCollisionByProperty({ collides: true });
    roadLayer.setCollisionByProperty({ collides: true });
    pavementLayer.setCollisionByProperty({ collides: true });
    roadDecorLayer.setCollisionByProperty({ collides: true });
    streetLightingLayer.setCollisionByProperty({ collides: true });
    carsLayer.setCollisionByProperty({ collides: true });
    buildingFirstLayer.setCollisionByProperty({ collides: true });
    buildingSecondLayer.setCollisionByProperty({ collides: true });
    beachLayer.setCollisionByProperty({ collides: true });

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    MainScene.cursors = this.input.keyboard.createCursorKeys();
    MainScene.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      // left: MainScene.cursors.left,
      // right: MainScene.cursors.right,
      // up: MainScene.cursors.up,
      // down: MainScene.cursors.down,
      // speed: MainScene.speed,
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
    MainScene.player = this.physics.add.sprite(96, 400, "player", 3);
    // Set up the camera to follow the player
    // this.cameras.main.startFollow(this.player);

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

    //FOR COLLIDER DEBUGGING
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    // houseLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    // groundLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    this.physics.add.collider(MainScene.player, baseLayer);
    this.physics.add.collider(MainScene.player, roadLayer);
    this.physics.add.collider(MainScene.player, pavementLayer);
    this.physics.add.collider(MainScene.player, roadDecorLayer);
    this.physics.add.collider(MainScene.player, streetLightingLayer);
    this.physics.add.collider(MainScene.player, carsLayer);
    this.physics.add.collider(MainScene.player, buildingFirstLayer);
    this.physics.add.collider(MainScene.player, buildingSecondLayer);
    this.physics.add.collider(MainScene.player, beachLayer);
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    MainScene.controls.update(delta);

    MainScene.player.body.setVelocity(0);
    let moving = false;

    // Horizontal movement
    if (MainScene.cursors.left.isDown) {
      MainScene.player.body.setVelocityX(-100);
      MainScene.player.anims.play("walk-left", true);
      moving = true;
    } else if (MainScene.cursors.right.isDown) {
      MainScene.player.body.setVelocityX(100);
      MainScene.player.anims.play("walk-right", true);
      moving = true;
    }

    // Vertical movement
    if (MainScene.cursors.up.isDown) {
      MainScene.player.body.setVelocityY(-100);
      MainScene.player.anims.play("walk-up", true);
      moving = true;
    } else if (MainScene.cursors.down.isDown) {
      MainScene.player.body.setVelocityY(100);
      MainScene.player.anims.play("walk-down", true);
      moving = true;
    }

    if (!moving) {
      MainScene.player.anims.stop();
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    MainScene.player.body.velocity.normalize().scale(MainScene.speed);
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
    // scale: {
    //   mode: Phaser.Scale.RESIZE, // Makes the game responsive
    //   autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game in the window
    // },
  };
  new Phaser.Game(config);
  // let controls;
}
