import Phaser from "phaser";
import { eventEmitter } from "./Events";
// import { preload, create, update } from "phaser";
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
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
    const initialData = this.registry.get("initialData");
    console.log(initialData.equippedCat);
    this.load.spritesheet(
      "cat",
      `${basePath}/sprites/cats/${initialData.equippedCat}.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    // Runs once, after all assets in preload are loaded
    this.scene.launch("GameOverlayScene");
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
    collisionLayer.setName("collisionLayer");
    collisionLayer.setCollisionByProperty({ collides: true });
    collisionLayer.setVisible(false);
    this.collisionLayer = collisionLayer;

    //GET OBJECT LAYER
    const doorObjectsLayer = map.getObjectLayer("Doors");
    MainScene.objects = doorObjectsLayer.objects;
    doorObjectsLayer.objects.forEach((doorObject) => {
      // console.log(doorObject.name);
      this[doorObject.name] = new Phaser.Geom.Rectangle(
        doorObject.x,
        doorObject.y,
        doorObject.width,
        doorObject.height
      );
      // console.log(JSON.stringify(this[doorObject.name]));
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

    // PLAYER CREATION AND SPAWN POINT
    this.player = this.physics.add.sprite(736, 780, "player", 3);
    this.cat = this.physics.add.sprite(736, 760, "cat", 44);
    // this.catOffsetX = 0;
    // this.catOffsetY = -20;
    this.cat.setSize(20, 20);
    this.cat.setInteractive();

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
    this.player.body.setCollideWorldBounds(true);
    this.cat.body.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body) => {
      console.log("worldbounds");
      if (body.gameObject === this.player) {
        this.cat.body.setVelocity(0);
        this.cat.x = this.player.x + this.catOffsetX;
        this.cat.y = this.player.y + this.catOffsetY;
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
    this.player.body.setSize(this.player.width, this.player.height * 0.75); // Make the player shorter for head overlap
    this.player.body.setOffset(0, this.player.height * 0.25); // Adjust the offset so the player appears correctly on the screen

    // Set up the camera to follow the player
    this.cameras.main.startFollow(this.player);
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
    // In your create function or similar initialization method
    // this.physics.world.createDebugGraphic(); // Create debug graphics for the physics world
    // this.debugGraphics = this.add.graphics().setAlpha(0.75); // Set up graphics for displaying debug information
    this.catOutBounds = false;
    this.physics.add.collider(this.player, collisionLayer, () => {
      this.cat.body.setVelocity(0);
      this.cat.x = this.player.x + this.catOffsetX;
      this.cat.y = this.player.y + this.catOffsetY;
    });
    this.physics.add.collider(this.cat, this.player, () => {
      console.log("cat collided with player");
      // this.cat.setVisible(false);
      let catTeleportLocationX = this.player.x + this.catOffsetX;
      let catTeleportLocationY = this.player.y + this.catOffsetY;
      // console.log("cat", catTeleportLocationX, catTeleportLocationY);
      // console.log(
      //   "world",
      //   this.physics.world.bounds.x,
      //   this.physics.world.bounds.y + this.physics.world.bounds.height
      // );

      if (
        catTeleportLocationX <=
          this.physics.world.bounds.x + this.physics.world.bounds.width &&
        catTeleportLocationX >= this.physics.world.bounds.x &&
        catTeleportLocationY <=
          this.physics.world.bounds.y + this.physics.world.bounds.height &&
        catTeleportLocationY >= this.physics.world.bounds.y
      ) {
        this.catOutBounds = false;
        // console.log("cat teleport");
        this.cat.x = catTeleportLocationX;
        this.cat.y = catTeleportLocationY;
      } else {
        this.catOutBounds = true;
        // console.log("cat out of bounds");
        // this.cat.setVisible(false);
      }
    });

    // this.physics.add.collider(this.cat, collisionLayer, () => {
    //   console.log("cat collided");
    // });
    //CREATE ANIMATIONS FOR DOORS
    this.anims.create({
      key: "homeDoor-open",
      frames: this.anims.generateFrameNumbers("homeDoor", {
        start: 13,
        end: 7,
      }),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: "shoppingCentreDoor-open",
      frames: this.anims.generateFrameNumbers("shoppingCentreDoor", {
        start: 0,
        end: 7,
      }),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: "bankDoor-open",
      frames: this.anims.generateFrameNumbers("bankDoor", {
        start: 0,
        end: 7,
      }),
      frameRate: 30,
      repeat: 0,
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

    //CREATE ANIMATIONS FOR CATS
    this.anims.create({
      key: "cat-walk-down",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 44,
        end: 47,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "cat-walk-left",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 176,
        end: 180,
        // start: 172,
        // end: 175,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "cat-walk-up",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 305,
        end: 311,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "cat-walk-right",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 432,
        end: 436,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "cat-looking-around",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 36,
        end: 39,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "cat-sitting1",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 32,
        end: 35,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.anims.create({
      key: "cat-sitting2",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 64,
        end: 66,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "cat-lay-down1",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 40,
        end: 43,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: "cat-lay-down2",
      frames: this.anims.generateFrameNumbers("cat", {
        start: 72,
        end: 75,
      }),
      frameRate: 8,
      repeat: 0,
    });

    this.cat.on("pointerdown", (pointer) => {
      console.log("cat clicked");
      if (pointer.leftButtonDown()) {
        this.cat.anims.play("cat-looking-around", true);
      } else if (pointer.rightButtonDown()) {
        this.cat.anims.play("cat-sitting1", true);
      } else if (pointer.middleButtonDown()) {
        this.cat.anims.play("cat-lay-down1", true);
      }

      if (this.cat.anims.isPlaying) {
        const currentAnimationName = this.cat.anims.currentAnim.key; // Get the name of the current animation
        console.log("Current animation playing: ", currentAnimationName);
      }
      this.cat.on("animationcomplete", (animation) => {
        console.log(`Animation completed: ${animation.key}`);

        if (animation.key === "cat-looking-around") {
          // Set the sprite directly to frame 65 after the animation ends
          this.cat.setFrame(68);
        }

        if (animation.key === "cat-sitting1") {
          this.cat.anims.play("cat-sitting2", true);
        }

        if (animation.key === "cat-lay-down1") {
          this.cat.anims.play("cat-lay-down2", true);
        }
      });
    });

    // EACH ROW HAS 32 FRAMES!!!

    //FOR COLLIDER DEBUGGING
    // const debugGraphics = this.add.graphics().setAlpha(0.75);

    // collisionLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.setCatPosition = false;
    this.prevPosition = { x: this.player.x, y: this.player.y };

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
    // console.log(this.collisionBlocks);

    // this.collisionBlocks.forEach((tile) => {
    //   console.log(tile);
    // });

    this.events.on("catOverlapWithCollisionBlocks", (cat) => {
      console.log("cat is overlapping with collision blocks");
      cat.setVisible(false);
    });

    this.events.on("catIsFreeToMove", (cat) => {
      if (!this.catOutBounds) {
        // console.log("cat is free to move");
        // console.log("cat is in bounds");
        cat.setVisible(true);
      } else {
        cat.setVisible(false);
      }
    });

    // Set line color to red and full opacity
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1); // Set line color to red and full opacity

    // Loop through each collision block and draw its rectangle
    // this.collisionBlocks.forEach((obj) => {
    //   // graphics.strokeRect(obj.x, obj.y, obj.width, obj.height);
    //   // graphics.setDepth(10000);
    //   // console.log(obj);
    // });

    // eventEmitter.on("playerMovement", () => {
    //   const playerY = this.player.y;
    //   const playerDepth = this.player.depth;

    //   // Iterate only over filtered depth-adjustable children
    //   this.depthAdjustableChildren.forEach((child) => {
    //     // Update depth only if the player is below the child
    //     if (playerY > child.y && child.depth <= playerDepth) {
    //       child.setDepth(playerDepth + 1);
    //     }
    //   });
    // });
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    // Automatically set depth based on the Y position
    MainScene.controls.update(delta);
    this.player.body.setVelocity(0);
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
        this.player.body.setVelocityX(-100);
        eventEmitter.emit("playerMovement", this.player);
        this.player.anims.play("walk-left", true);
        this.player.setDepth(this.player.y + this.player.height);
        this.cat.setDepth(this.player.y + this.player.height);
        this.catOffsetX = 25;
        this.catOffsetY = 8;
        // only runs once upon keydown to teleport the cat behind/beside the player
        // when player change direction/start moving
        if (!this.setCatPosition) {
          //cat position hasn't been set
          // console.log("cat teleported");
          this.cat.x = this.player.x + this.catOffsetX;
          this.cat.y = this.player.y + this.catOffsetY;
          this.setCatPosition = true; //cat position has been set
        }
        this.cat.body.setVelocityX(-100);
        this.cat.anims.play("cat-walk-left", true);
        moving = true;
      } else if (MainScene.cursors.right.isDown) {
        // console.log(this.player.body.velocity.x);
        currentDirection.x = 1;
        this.player.body.setVelocityX(100);
        eventEmitter.emit("playerMovement", this.player);
        // console.log(this.player.body.velocity.x);
        this.player.anims.play("walk-right", true);
        this.player.setDepth(this.player.y + this.player.height);
        this.cat.setDepth(this.player.y + this.player.height);
        this.catOffsetX = -25;
        this.catOffsetY = 8;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
          // console.log(this.setCatPosition);
          this.cat.x = this.player.x + this.catOffsetX;
          this.cat.y = this.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityX(100);
        this.cat.anims.play("cat-walk-right", true);
        moving = true;
      }
      // VERTICAL MOVEMENT
      if (MainScene.cursors.up.isDown) {
        currentDirection.y = -1;
        this.player.body.setVelocityY(-100);
        eventEmitter.emit("playerMovement", this.player);
        this.player.anims.play("walk-up", true);
        this.player.setDepth(this.player.y + this.player.height);
        this.cat.setDepth(this.player.y + this.player.height);
        this.cat.anims.play("cat-walk-up", true);
        this.catOffsetX = 0;
        this.catOffsetY = 30;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
          this.cat.x = this.player.x + this.catOffsetX;
          this.cat.y = this.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityY(-100);
        moving = true;
      } else if (MainScene.cursors.down.isDown) {
        currentDirection.y = 1;
        this.player.body.setVelocityY(100);
        eventEmitter.emit("playerMovement", this.player);
        this.player.anims.play("walk-down", true);
        this.player.setDepth(this.player.y + this.player.height);
        this.cat.setDepth(this.player.y + this.player.height);
        this.catOffsetX = 0;
        this.catOffsetY = -23;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
          this.cat.x = this.player.x + this.catOffsetX;
          this.cat.y = this.player.y + this.catOffsetY;
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
      this.player.anims.stop();
      if (this.cat.anims.isPlaying) {
        const currentAnimationName = this.cat.anims.currentAnim.key;
        if (currentAnimationName.includes("walk")) {
          this.cat.body.setVelocity(0);
          this.cat.anims.stop();
        }
      }
    }

    if (this.directionChanged) {
      this.setCatPosition = false;
      this.cat.body.setVelocity(0);
    }

    const playerBounds = this.player.getBounds();

    this.depthAdjustableChildren.forEach((child) => {
      if (
        this.player.y > child.y && //player is above map object
        !("texture" in child && child.texture.key.includes("Door"))
      ) {
        child.depth = this.player.depth + 1; //make the map object appear in front of the player
        // console.log(`player depth: ${this.player.depth}`);
        // console.log(`child depth: ${child.depth}`);
      }
    });

    let catPositionTile = this.collisionLayer.getTileAt(
      Math.floor(this.cat.x / 16),
      Math.floor(this.cat.y / 16)
    );
    if (catPositionTile != null) {
      this.events.emit("catOverlapWithCollisionBlocks", this.cat);
    } else {
      // console.log("cat is free to move");
      this.events.emit("catIsFreeToMove", this.cat);
    }

    MainScene.objects.forEach((doorObject) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          playerBounds,
          this[doorObject.name]
        ) &&
        MainScene.cursors.up.isDown &&
        moving
      ) {
        //CALL DOOR COLLISION EVENT
        // this emits the doorCollision event and the corresponding door object
        this.events.emit("doorCollision", doorObject);
        // console.log(
        //   `Player is overlapping with door area. Door:
        //   ${doorObject.name}
        // ${JSON.stringify(doorObject)}
        // `
        // );
      }
    });
    this.prevPosition = { x: this.player.x, y: this.player.y };
  }
}

class GameOverlayScene extends Phaser.Scene {
  constructor() {
    super("GameOverlayScene");
  }

  preload() {
    this.load.image("minimap", `/assets/mainassets/minimap_small.png`);
    this.load.image("marker", `/assets/mainassets/marker.png`);
  }

  create() {
    if (!this) {
      console.error("scene contetx not found");
      return;
    }
    // MINIMAP;
    const minimapX = 100;
    const minimapY = 200;

    const minimap = this.add
      .image(this.scale.width - 230, 10, "minimap")
      .setOrigin(0);

    const bankMarker = this.add
      .image(this.scale.width - 212, 14, "marker")
      .setOrigin(0);

    const shoppingCentreMarker = this.add
      .image(this.scale.width - 164, 14, "marker")
      .setOrigin(0);

    const bakeryMarker = this.add
      .image(this.scale.width - 137, 14, "marker")
      .setOrigin(0);

    const schoolMarker = this.add
      .image(this.scale.width - 70, 14, "marker")
      .setOrigin(0);

    const homeMarker = this.add
      .image(this.scale.width - 160, 65, "marker")
      .setOrigin(0);

    const minimapWidth = minimap.width;
    const minimapHeight = minimap.height;
    if (!this.playerPosition) {
      this.playerPosition = this.add.graphics();
    }
    this.playerPosition.fillStyle(0xff0000, 1); // Red color with full opacity
    const radius = 3.2;
    // Draw the circle with a 3.2-pixel radius
    this.playerX = 736;
    this.playerY = 768;
    const circleX = minimap.x + this.playerX / 10 - radius; // X position in top-right corner
    const circleY = minimap.y + this.playerY / 10 - radius;
    this.playerPosition.fillCircle(circleX, circleY, radius);

    // minimap.setDisplaySize(minimapWidth, minimapHeight);
    minimap.setScrollFactor(0); // Make the minimap fixed in the camera view

    // console.log(minimap);
    // console.log(minimap.x);
    // console.log(`width: ${this.scale.width}`);
    // console.log(`height: ${this.scale.height}`);
    eventEmitter.on("playerMovement", (data) => {
      this.playerPosition.clear();
      // console.log("Player position in GameOverlayScene:", data.x, data.y);
      this.playerX = data.x;
      this.playerY = data.y;
      if (!this.playerPosition) {
        this.playerPosition = this.add.graphics();
      }
      this.playerPosition.fillStyle(0xff0000, 1);
      const circleX = minimap.x + data.x / 10 - radius; // X position in top-right corner
      const circleY = minimap.y + data.y / 10 - radius;
      this.playerPosition.fillCircle(circleX, circleY, radius);
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
    scene: MainScene,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // Top down game, so no gravity
      },
    },
    scene: [MainScene],
    scale: {
      mode: Phaser.Scale.RESIZE, // Makes the game responsive
      autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game in the window
    },
    callbacks: {
      preBoot: (game) => {
        // Set initial data here if needed
        game.registry.set("initialData", { equippedCat: equippedCat });
      },
    },
  };
  const game = new Phaser.Game(config);
  game.scene.add("GameOverlayScene", GameOverlayScene);
  return game;
}
