import Phaser from "phaser"
import PreloadScene from "./scenes/PreloadScene"
import TitleScene from "./scenes/TitleScene"
import OptionsScene from "./scenes/OptionsScene"
import LeaderboardScene from "./scenes/LeaderboardScene"
import ControlScene from "./scenes/ControlsScene"
import UnlockablesScene from "./scenes/UnlockablesScene"
import CreditsScene from "./scenes/CreditsScene"
import GameScene from "./scenes/GameScene"
import LevellingScene from "./scenes/LevellingScene"
import GameOverScene from "./scenes/GameOverScene"
import LevelSelect from "./scenes/LevelSelect"
import MainMenuScene from "./scenes/MainMenuScene"
import GameSetupScene from "./scenes/GameSetupScene"

import { App } from "@capacitor/app"
import {
    setupGamePause,
    pauseGame,
    resumeGame
} from "./systems/GamePauseSystem";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,        // internal game width
    height: 540,       // internal game height, landscape aspect
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: "#1e1e1e",
    physics: { default: "arcade", arcade: { debug: false } },
    input: { activePointers: 3 },
    pixelArt: true,
    scene: [PreloadScene, TitleScene, OptionsScene, LeaderboardScene, LevelSelect, MainMenuScene, GameSetupScene, ControlScene, UnlockablesScene, CreditsScene, GameScene, LevellingScene, GameOverScene],
    }

const game = new Phaser.Game(config)
// Pausing game when tabbed out or out of focus
setupGamePause(game);
App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) {
        resumeGame(game);
    } else {
        pauseGame(game);
    }
});