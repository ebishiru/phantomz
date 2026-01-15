import Phaser from "phaser"
import GameScene from "./scenes/GameScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: [GameScene],
}

new Phaser.Game(config)
