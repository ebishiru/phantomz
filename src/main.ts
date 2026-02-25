import Phaser from "phaser"
import PreloadScene from "./scenes/PreLoadScene"
import TitleScene from "./scenes/TitleScene"
import ControlScene from "./scenes/ControlsScene"
import GameScene from "./scenes/GameScene"
import LevellingScene from "./scenes/LevellingScene"
import GameOverScene from "./scenes/GameOverScene"

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const canvasHeight = isMobile ? 1200 : 700

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: canvasHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  input: {
    activePointers: 3
  },
  pixelArt: true,
  scene: [PreloadScene, TitleScene, ControlScene, GameScene, LevellingScene, GameOverScene],
}

new Phaser.Game(config)
