import Phaser from "phaser"
import PreloadScene from "./scenes/PreloadScene"
import TitleScene from "./scenes/TitleScene"
import OptionsScene from "./scenes/OptionsScene"
import ControlScene from "./scenes/ControlsScene"
import GameScene from "./scenes/GameScene"
import LevellingScene from "./scenes/LevellingScene"
import GameOverScene from "./scenes/GameOverScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,        // internal game width
  height: 700,       // internal game height, landscape aspect
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#1e1e1e",
  physics: { default: "arcade", arcade: { debug: false } },
  input: { activePointers: 3 },
  pixelArt: true,
  scene: [PreloadScene, TitleScene, OptionsScene, ControlScene, GameScene, LevellingScene, GameOverScene],
}

new Phaser.Game(config)
