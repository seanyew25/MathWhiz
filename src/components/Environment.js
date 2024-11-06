import Phaser from "phaser";

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
    this.cat = this.physics.add.sprite(736, 752, "cat", 44);
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
    MainScene.player.body.setCollideWorldBounds(true);
    this.cat.body.setCollideWorldBounds(true);
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

    this.physics.add.collider(MainScene.player, collisionLayer, () => {
      this.cat.body.setVelocity(0);
      this.cat.x = MainScene.player.x + this.catOffsetX;
      this.cat.y = MainScene.player.y + this.catOffsetY;
    });
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
    this.prevPosition = { x: MainScene.player.x, y: MainScene.player.y };
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
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
        MainScene.player.anims.play("walk-left", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = 25;
        this.catOffsetY = 8;
        // only runs once upon keydown to teleport the cat behind/beside the player
        // when player change direction/start moving
        if (!this.setCatPosition) {
          //cat position hasn't been set
          // console.log("cat teleported");
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
        // console.log(MainScene.player.body.velocity.x);
        MainScene.player.anims.play("walk-right", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = -25;
        this.catOffsetY = 8;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
          // console.log(this.setCatPosition);
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
        MainScene.player.anims.play("walk-up", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.anims.play("cat-walk-up", true);
        this.catOffsetX = 0;
        this.catOffsetY = 30;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
          this.cat.x = MainScene.player.x + this.catOffsetX;
          this.cat.y = MainScene.player.y + this.catOffsetY;
          this.setCatPosition = true;
        }
        this.cat.body.setVelocityY(-100);
        moving = true;
      } else if (MainScene.cursors.down.isDown) {
        currentDirection.y = 1;
        MainScene.player.body.setVelocityY(100);
        MainScene.player.anims.play("walk-down", true);
        MainScene.player.setDepth(MainScene.player.y + MainScene.player.height);
        this.cat.setDepth(MainScene.player.y + MainScene.player.height);
        this.catOffsetX = 0;
        this.catOffsetY = -20;
        if (!this.setCatPosition) {
          // console.log("cat teleported");
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
      this.directionChanged = true; // Set flag if direction has changed
      // console.log("Direction changed");
    }

    // Update previous direction to current for the next frame check
    this.prevDirection = currentDirection;

    if (!moving) {
      this.setCatPosition = false;
      MainScene.player.anims.stop();
      if (this.cat.anims.isPlaying) {
        const currentAnimationName = this.cat.anims.currentAnim.key;
        if (currentAnimationName.includes("walk")) {
          this.cat.setVelocity(0);
          this.cat.anims.stop();
        }
      }
    }

    if (this.directionChanged) {
      this.setCatPosition = false;
      this.cat.setVelocity(0);
    }

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
        child.name === "bankSchoolFieldLayer" ||
        ("texture" in child && child.texture.key.includes("Door")) //exclude doors to ensure character appears on top of door sprites when they open
      ) {
        ("");
      } else {
        if (MainScene.player.y > child.y) {
          child.depth = MainScene.player.depth + 1;
          // console.log(`player depth: ${MainScene.player.depth}`);
          // console.log(`child depth: ${child.depth}`);
        }
      }

      // if (child.name === "collisionLayer") {
      //   let catBounds = this.cat.getBounds();
      //   let childBounds = child.getBounds();
      //   if (
      //     Phaser.Geom.Intersects.RectangleToRectangle(catBounds, childBounds)
      //   ) {
      //     console.log("cat collision");
      //   }
      // }
    });

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
    this.prevPosition = { x: MainScene.player.x, y: MainScene.player.y };
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
  return game;
}
