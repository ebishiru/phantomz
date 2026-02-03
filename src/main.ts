import Phaser from "phaser"
import TitleScene from "./scenes/TitleScene"
import GameScene from "./scenes/GameScene"
import LevellingScene from "./scenes/LevellingScene"
import GameOverScene from "./scenes/GameOverScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  pixelArt: true,
  scene: [TitleScene, GameScene, LevellingScene, GameOverScene],
}

new Phaser.Game(config)
