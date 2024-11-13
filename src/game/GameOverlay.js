import Phaser from "phaser";
import { eventEmitter } from "./Events";
class GameOverlayScene extends Phaser.Scene {
  constructor() {
    super("GameOverlayScene");
  }

  preload() {
    this.load.image("minimap", `/assets/mainassets/gameMinimap.png`);
    this.load.image("marker", `/assets/mainassets/playerStar.png`);
  }

  create() {
    if (!this) {
      console.error("scene contetx not found");
      return;
    }
    // MINIMAP;
    let minimapWidthAsFractionOfScreen = 0.3;
    if (window.innerWidth <= 768) {
      minimapWidthAsFractionOfScreen = 0.3;
    } else if (window.innerWidth <= 1440) {
      minimapWidthAsFractionOfScreen = 0.25;
    } else {
      minimapWidthAsFractionOfScreen = 0.2;
    }
    // const playerStar = this.add.image(0, 0, "marker").setOrigin(0);
    const minimap = this.add.image(0, 0, "minimap").setOrigin(0);
    const initialScale =
      (this.scale.width * minimapWidthAsFractionOfScreen) / minimap.width;
    minimap.setScale(initialScale);

    minimap.setPosition(this.scale.width - minimap.displayWidth - 10, 10);
    // Get the display size of the minimap for accurate border sizing
    const minimapWidth = minimap.displayWidth;
    const minimapHeight = minimap.displayHeight;

    // Create a Graphics object for the border
    this.border = this.add.graphics();

    // Set the line style: color and thickness
    this.border.lineStyle(2, 0xffffff, 1); // White border with 2px thickness
    this.border.strokeRect(minimap.x, minimap.y, minimapWidth, minimapHeight);

    if (!this.playerPosition) {
      this.playerPosition = this.add.graphics();
    }
    // this.playerPosition.clear(); // Clear previous drawings
    this.playerPosition.fillStyle(0xffa500, 1);

    // Define star parameters
    const radius = 12.8;
    const points = 5; // 5-point star

    // Player's position on the minimap
    this.playerX = 736;
    this.playerY = 768;
    this.minimapRatioToMap = minimap.displayWidth / minimap.width;
    const centerX = minimap.x + this.playerX * this.minimapRatioToMap; // Center X of the star
    const centerY = minimap.y + this.playerY * this.minimapRatioToMap; // Center Y of the star

    // Function to calculate star points
    function getStarPoints(centerX, centerY, outerRadius, innerRadius, points) {
      const angle = Math.PI / points;
      const path = [];

      for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(i * angle);
        const y = centerY + radius * Math.sin(i * angle);
        path.push(new Phaser.Math.Vector2(x, y));
      }

      return path;
    }

    // Generate the points for the star
    const starPoints = getStarPoints(
      centerX,
      centerY,
      radius,
      radius / 3,
      points
    );

    // Draw the star shape on the minimap
    this.playerPosition.fillPoints(starPoints, true); // Draws a filled star shape

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
      this.playerPosition.fillStyle(0xffa500, 1);
      const centerX = minimap.x + this.playerX * this.minimapRatioToMap; // Center X of the star
      const centerY = minimap.y + this.playerY * this.minimapRatioToMap;
      const starPoints = getStarPoints(
        centerX,
        centerY,
        radius,
        radius / 3,
        points
      );

      this.playerPosition.fillPoints(starPoints, true); // Draws a filled star
    });

    function repositionMinimap() {
      if (window.innerWidth <= 768) {
        minimapWidthAsFractionOfScreen = 0.3;
      } else if (window.innerWidth <= 1440) {
        minimapWidthAsFractionOfScreen = 0.25;
      } else {
        minimapWidthAsFractionOfScreen = 0.2;
      }
      const newScale =
        (this.scale.width * minimapWidthAsFractionOfScreen) / minimap.width;
      minimap.setScale(newScale);

      minimap.setPosition(this.scale.width - minimap.displayWidth - 10, 10);

      //REPOSITION BORDER
      this.border.clear();
      if (!this.border) {
        this.border = this.add.graphics();
      }
      this.border.lineStyle(2, 0xffffff, 1); // White border with 2px thickness
      this.border.strokeRect(
        minimap.x,
        minimap.y,
        minimap.displayWidth,
        minimap.displayHeight
      );

      //REPOSITION PLAYER
      this.playerPosition.clear();
      if (!this.playerPosition) {
        this.playerPosition = this.add.graphics();
      }
      this.playerPosition.fillStyle(0xffa500, 1);
      // const circleX = minimap.x + this.playerX / 10 - radius; // X position in top-right corner
      // const circleY = minimap.y + this.playerY / 10 - radius;
      this.minimapRatioToMap = minimap.displayWidth / minimap.width;
      const starPoints = getStarPoints(
        minimap.x + this.playerX * this.minimapRatioToMap,
        minimap.y + this.playerY * this.minimapRatioToMap,
        radius,
        radius / 3,
        points
      );
      this.playerPosition.fillPoints(starPoints, true); // Draws a filled star
    }
    this.scale.on("resize", repositionMinimap, this);
  }
}

export default GameOverlayScene;
