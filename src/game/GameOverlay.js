import Phaser from "phaser";
import { eventEmitter } from "./Events";
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
      if (!this.playerPosition) {
        this.playerPosition = this.add.graphics();
      }
      this.playerPosition.fillStyle(0xff0000, 1);
      const circleX = minimap.x + this.playerX / 10 - radius; // X position in top-right corner
      const circleY = minimap.y + this.playerY / 10 - radius;
      this.playerPosition.fillCircle(circleX, circleY, radius);
    }
    this.scale.on("resize", repositionMinimap, this);
  }
}

export default GameOverlayScene;
