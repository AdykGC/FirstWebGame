import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'app',
    backgroundColor: '#1a1a1a',
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Вид сверху, гравитация отключена
            debug: false       // Поставьте true, чтобы видеть хитбоксы
        },
    },
};