import Phaser from "phaser"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1e1e1e",
}

new Phaser.Game(config)
