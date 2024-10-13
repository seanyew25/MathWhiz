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
    this.load.image("test", "/src/assets/testassets.png");
    // tileset name need to be the same as the image name here
    this.load.tilemapTiledJSON("map", "/src/assets/testmap.json");
    this.load.spritesheet("player-left", "/src/assets/sprites/ACharLeft.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet(
      "player-right",
      "/src/assets/sprites/ACharRight.png",
      { frameWidth: 24, frameHeight: 24 }
    );
    this.load.spritesheet("player-down", "/src/assets/sprites/ACharDown.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet("player-up", "/src/assets/sprites/ACharUp.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
  }

  create() {
    // Runs once, after all assets in preload are loaded
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 12,
      tileHeight: 12,
    });
    const tileset = map.addTilesetImage("test");
    const waterLayer = map.createLayer("Water", tileset, 0, 0);
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    const pathsLayer = map.createLayer("Paths", tileset, 0, 0);
    const treesLayer = map.createLayer("Trees", tileset, 0, 0);
    const trees1Layer = map.createLayer("Trees1", tileset, 0, 0);
    const plateauLayer = map.createLayer("Plateau", tileset, 0, 0);
    const houseLayer = map.createLayer("House", tileset, 0, 0);
    const grassAndFlowersLayer = map.createLayer(
      "Grass and Flowers",
      tileset,
      0,
      0
    );
    const fenceLayer = map.createLayer("Fence", tileset, 0, 0);
    const dockLayer = map.createLayer("Dock", tileset, 0, 0);

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    MainScene.cursors = this.input.keyboard.createCursorKeys();
    MainScene.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: MainScene.cursors.left,
      right: MainScene.cursors.right,
      up: MainScene.cursors.up,
      down: MainScene.cursors.down,
      speed: MainScene.speed,
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

    groundLayer.setCollisionByProperty({ collides: true });
    houseLayer.setCollisionByProperty({ collides: true });
    treesLayer.setCollisionByProperty({ collides: true });
    trees1Layer.setCollisionByProperty({ collides: true });
    fenceLayer.setCollisionByProperty({ collides: true });
    plateauLayer.setCollisionByProperty({ collides: true });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player-left", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player-right", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player-up", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player-down", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // this.cursors = this.input.keyboard.createCursorKeys();
    MainScene.player = this.physics.add.sprite(348, 84, "player-down");

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
    // grassAndFlowersLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    // treesLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    // trees1Layer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
    // fenceLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.physics.add.collider(MainScene.player, treesLayer);
    this.physics.add.collider(MainScene.player, groundLayer);
    this.physics.add.collider(MainScene.player, trees1Layer);
    this.physics.add.collider(MainScene.player, houseLayer);
    this.physics.add.collider(MainScene.player, fenceLayer);
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
    width: 800, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "phaser-container", // ID of the DOM element to add the canvas to
    scene: MainScene,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // Top down game, so no gravity
      },
    },
  };
  new Phaser.Game(config);
  // let controls;
}
