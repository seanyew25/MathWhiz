import Phaser from "phaser";
// import { preload, create, update } from "phaser";
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    // Runs once, loads up assets like images and audio
    this.load.image("test", "/src/assets/testassets.png");
    // tileset name need to be the same as the image name here
    this.load.tilemapTiledJSON("map", "/src/assets/testmap.json");
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
    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
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

    worldLayer.setCollisionByProperty({ collides: true });
    player = this.physics.add.sprite(400, 350, "atlas", "misa-front");
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    controls.update(delta);
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
}
