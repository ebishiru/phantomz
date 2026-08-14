const MusicSystem = {
    currentMusic: null as Phaser.Sound.BaseSound | null,
    currentKey: ""
};

export function playMusic(scene: Phaser.Scene, key: string, volume = 0.5) {

    if (MusicSystem.currentKey === key) return;

    const startNewMusic = () => {

        const music = scene.sound.add(key, {
            loop: true,
            volume: 0
        });

        music.play();

        scene.tweens.add({
            targets: music,
            volume: volume,
            duration: 800
        });

        MusicSystem.currentMusic = music;
        MusicSystem.currentKey = key;
    };

    if (MusicSystem.currentMusic) {

        const oldMusic = MusicSystem.currentMusic;

        scene.tweens.add({
            targets: oldMusic,
            volume: 0,
            duration: 800,

            onComplete: () => {
                oldMusic.stop();
                startNewMusic();
            }
        });

    } else {
        startNewMusic();
    }
}