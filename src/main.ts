import Phaser from "phaser"
import GameScene from "./scenes/GameScene"
import LevellingScene from "./scenes/LevellingScene"
import GameOverScene from "./scenes/GameOverScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  pixelArt: true,
  scene: [GameScene, LevellingScene, GameOverScene],
}

new Phaser.Game(config)
