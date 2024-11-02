import Phaser from "phaser";
<<<<<<< HEAD
import { eventEmitter } from "./Events";
=======
>>>>>>> 6d93397 (Added phaser and environment render)
// import { preload, create, update } from "phaser";
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
<<<<<<< HEAD
    this.prevDirection = { x: 0, y: 0 };
  }
  static controls;
  static player;
  static cursors;
  static objects;
  static speed = 80;

  preload() {
    // Runs once, loads up assets like images and audio
    // const basePath =
    //   import.meta.env.MODE === "development"
    //     ? "/assets/mainassets"
    //     : "/assets/mainassets";
    this.scene.launch("GameOverlayScene");
    const basePath = "/assets/mainassets";
    this.load.image(
      "terrainsAndFences",
      `${basePath}/1_Terrains_and_Fences_16x16.png`
    );
    this.load.image("cityTerrains", `${basePath}/2_City_Terrains_16x16.png`);
    this.load.image("cityProps", `${basePath}/3_City_Props_16x16.png`);
    this.load.image(
      "main",
      `${basePath}/Modern_Exteriors_Complete_Tileset.png`
    );
    // tileset name need to be the same as the image name here
    this.load.tilemapTiledJSON("map", `${basePath}/MainTilemap.json`);
    this.load.spritesheet("player", `${basePath}/sprites/postman.png`, {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("homeDoor", `${basePath}/sprites/homeDoor.png`, {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "shoppingCentreDoor",
      `${basePath}/sprites/shoppingCentreDoor.png`,
      {
        frameWidth: 32,
        frameHeight: 48,
      }
    );
    this.load.spritesheet("bankDoor", `${basePath}/sprites/bankDoor.png`, {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("schoolDoor", `${basePath}/sprites/schoolDoor.png`, {
      frameWidth: 64,
      frameHeight: 48,
    });
    this.load.spritesheet("bakeryDoor", `${basePath}/sprites/bakeryDoor.png`, {
      frameWidth: 48,
      frameHeight: 32,
    });
  }

  create() {
    // Runs once, after all assets in preload are loaded
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 12,
      tileHeight: 12,
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
<<<<<<< HEAD
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
    this.cat.body.setCollideWorldBounds(true);
    MainScene.player.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body) => {
      console.log("worldbounds");
      if (body.gameObject === MainScene.player) {
        this.cat.body.setVelocity(0);
        this.cat.x = MainScene.player.x + this.catOffsetX;
        this.cat.y = MainScene.player.y + this.catOffsetY;
      }
    });

    // In your create function or similar initialization method
    // this.physics.world.createDebugGraphic(); // Create debug graphics for the physics world
    // this.debugGraphics = this.add.graphics().setAlpha(0.75); // Set up graphics for displaying debug information

    // // In your update function, after updating positions, you can draw the debug graphics
    // this.physics.world.debugGraphic.clear(); // Clear previous debug graphics
    // this.physics.world.debugGraphic.lineStyle(1, 0xff0000, 1); // Set line style for debug

    // Draw debug shapes for the cat and other objects
    // this.physics.world.debugGraphic.strokeRect(
    //   this.cat.body.x,
    //   this.cat.body.y,
    //   this.cat.body.width,
    //   this.cat.body.height
    // );

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
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player-right", {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player-up", {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player-down", {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "schoolDoor-open",
      frames: this.anims.generateFrameNumbers("schoolDoor", {
        start: 0,
        end: 7,
      }),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: "bakeryDoor-open",
      frames: this.anims.generateFrameNumbers("bakeryDoor", {
        start: 0,
        end: 7,
      }),
      frameRate: 30,
      repeat: 0,
    });

    //FOR COLLIDER DEBUGGING
    // const debugGraphics = this.add.graphics().setAlpha(0.75);

    // collisionLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.setCatPosition = false;
    this.prevPosition = { x: MainScene.player.x, y: MainScene.player.y };

    this.depthAdjustableChildren = this.children.getAll().filter((child) => {
      return !(
        child.name === "baseLayer" ||
        child.name === "roadLayer" ||
        child.name === "pavementLayer" ||
        child.name === "groundDecorLayer" ||
        child.name === "bankSchoolFieldLayer" ||
        ("texture" in child && child.texture.key.includes("Door"))
      );
    });

    this.collisionBlocks = [];
    collisionLayer.forEachTile((tile) => {
      // let tileBounds = new Phaser.Geom.Rectangle(
      //   tile.pixelX,
      //   tile.pixelY,
      //   tile.width,
      //   tile.height
      // );
      this.collisionBlocks.push(tile);
    });
  }

  //DOOR COLLISION EVENT HANDLER
  // this handles the door collision event
  // handleDoorCollision(door) {
  //   console.log(door.name);
  // }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
<<<<<<< HEAD
    // Automatically set depth based on the Y position

    MainScene.controls.update(delta);
    MainScene.player.body.setVelocity(0);
    let moving = false;
    //CHECK IF CAT OVERLAP ANY BARRIERS

    // this.cat.setVisible(true);
    // console.log(this.catOverlapStatus);
    // this.cat.setVisible(true);
    // Get current velocity of the player
    this.directionChanged = false;

    let currentDirection = { x: 0, y: 0 };

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
    } else if (MainScene.cursors.down.isDown && MainScene.cursors.up.isDown) {
      ("");
    } else {
      //HORIZONTAL MOVEMENT
      if (MainScene.cursors.left.isDown) {
        currentDirection.x = -1;
        MainScene.player.body.setVelocityX(-100);
        eventEmitter.emit("playerMovement", MainScene.player);
        MainScene.player.anims.play("walk-left", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = 25;
        this.catOffsetY = 8;
        // only runs once upon keydown to teleport the cat behind/beside the player
        // when player change direction/start moving
        if (!this.setCatPosition) {
          //cat position hasn't been set
          console.log("cat teleported");
          this.cat.x = MainScene.player.x + this.catOffsetX;
          this.cat.y = MainScene.player.y + this.catOffsetY;
          this.setCatPosition = true; //cat position has been set
        }
        this.cat.body.setVelocityX(-100);
        this.cat.anims.play("cat-walk-left", true);
        moving = true;
      } else if (MainScene.cursors.right.isDown) {
        // console.log(MainScene.player.body.velocity.x);
        currentDirection.x = 1;
        MainScene.player.body.setVelocityX(100);
        console.log(MainScene.player.body.velocity.x);
        MainScene.player.anims.play("walk-right", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = -25;
        this.catOffsetY = 8;
        if (!this.setCatPosition) {
          console.log("cat teleported");
          console.log(this.setCatPosition);
          this.cat.x = MainScene.player.x + this.catOffsetX;
          this.cat.y = MainScene.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityX(100);
        this.cat.anims.play("cat-walk-right", true);
        moving = true;
      }
      // VERTICAL MOVEMENT
      if (MainScene.cursors.up.isDown) {
        currentDirection.y = -1;
        MainScene.player.body.setVelocityY(-100);
        eventEmitter.emit("playerMovement", MainScene.player);
        MainScene.player.anims.play("walk-up", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.anims.play("cat-walk-up", true);
        this.catOffsetX = 0;
        this.catOffsetY = 30;
        if (!this.setCatPosition) {
          console.log("cat teleported");
          this.cat.x = MainScene.player.x + this.catOffsetX;
          this.cat.y = MainScene.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityY(-100);
        moving = true;
      } else if (MainScene.cursors.down.isDown) {
        currentDirection.y = 1;
        MainScene.player.body.setVelocityY(100);
        eventEmitter.emit("playerMovement", MainScene.player);
        MainScene.player.anims.play("walk-down", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = 0;
        this.catOffsetY = -20;
        if (!this.setCatPosition) {
          console.log("cat teleported");
          this.cat.x = MainScene.player.x + this.catOffsetX;
          this.cat.y = MainScene.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityY(100);
        this.cat.anims.play("cat-walk-down", true);
        moving = true;
      }
    }
    // Check if direction has changed compared to previous direction
    if (
      currentDirection.x !== this.prevDirection.x ||
      currentDirection.y !== this.prevDirection.y
    ) {
      console.log("direction changed");
      this.directionChanged = true; // Set flag if direction has changed
      // console.log("Direction changed");
    }

    // Update previous direction to current for the next frame check
    this.prevDirection = currentDirection;

    if (!moving) {
      this.setCatPosition = false;
      MainScene.player.anims.stop();
    }

    const playerBounds = MainScene.player.getBounds();

    this.depthAdjustableChildren.forEach((child) => {
      if (
        MainScene.player.y > child.y && //player is above map object
        !("texture" in child && child.texture.key.includes("Door"))
      ) {
        child.depth = MainScene.player.depth + 1; //make the map object appear in front of the player
        // console.log(`player depth: ${MainScene.player.depth}`);
        // console.log(`child depth: ${child.depth}`);
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

    function repositionMinimap() {
      (minimap.x = this.scale.width - 230), (minimap.y = 10);
      bankMarker.x = this.scale.width - 212;
      bankMarker.y = 14;
      shoppingCentreMarker.x = this.scale.width - 164;
      shoppingCentreMarker.y = 14;
      bakeryMarker.x = this.scale.width - 137;
      bakeryMarker.y = 14;
      schoolMarker.x = this.scale.width - 70;
      schoolMarker.y = 14;
      homeMarker.x = this.scale.width - 160;
      homeMarker.y = 65;

      //REPOSITION PLAYER
      this.playerPosition.clear();
      this.playerPosition = this.add.graphics();
      this.playerPosition.fillStyle(0xff0000, 1);
      const circleX = minimap.x + this.playerX / 10 - radius; // X position in top-right corner
      const circleY = minimap.y + this.playerY / 10 - radius;
      this.playerPosition.fillCircle(circleX, circleY, radius);
    }
    this.scale.on("resize", repositionMinimap, this);
  }
}

export function initializePhaser(equippedCat) {
  const config = {
    type: Phaser.CANVAS, // Which renderer to use
    width: window.innerWidth, // Canvas width in pixels
    height: window.innerHeight - 56, // Canvas height in pixels
    parent: "phaser-container", // ID of the DOM element to add the canvas to
    pixelArt: true,
    transparency: false,
=======
    controls.update(delta);
  }
}

export function initializePhaser() {
  const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: window.innerWidth, // Canvas width in pixels
    height: window.innerHeight - 56, // Canvas height in pixels
    parent: "phaser-container", // ID of the DOM element to add the canvas to
>>>>>>> 6d93397 (Added phaser and environment render)
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
