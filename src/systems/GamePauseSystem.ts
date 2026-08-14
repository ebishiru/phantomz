import Phaser from "phaser";

let gamePaused = false;
let initialized = false;

export function setupGamePause(game: Phaser.Game) {
    if (initialized) return;

    initialized = true;

    // Browser / Phaser focus
    game.events.on(Phaser.Core.Events.BLUR, () => {
        pauseGame(game);
    });

    game.events.on(Phaser.Core.Events.FOCUS, () => {
        resumeGame(game);
    });
}

export function pauseGame(game: Phaser.Game) {
    if (gamePaused) return;

    gamePaused = true;

    game.loop.sleep();
    game.sound.pauseAll();
}

export function resumeGame(game: Phaser.Game) {
    if (!gamePaused) return;

    gamePaused = false;

    game.loop.wake();
    game.sound.resumeAll();
}

export function isGamePaused() {
    return gamePaused;
}