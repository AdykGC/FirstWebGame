import Phaser from 'phaser';
import { gameSettings } from '../config/gameSettings';


export class Level {
    private walls: Phaser.Physics.Arcade.StaticGroup;

    constructor(scene: Phaser.Scene) {
        // Создаем статическую группу для стен. 
        // StaticGroup не тратит ресурсы на расчет физики движения, только на коллизии.
        this.walls = scene.physics.add.staticGroup();
        this.buildLevel(scene);
    }

    private buildLevel(scene: Phaser.Scene): void {
        // 1. Генерируем текстуру стены программно (серый квадрат 32x32)
        // Если текстуры еще нет, создаем её. Это позволяет не зависеть от внешних файлов.
        if (!scene.textures.exists('wallTexture')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0x808080, 1); // Серый цвет
            graphics.fillRect(0, 0, 32, 32);
            // Добавим обводку, чтобы здания были видны лучше
            graphics.lineStyle(2, 0x505050, 1);
            graphics.strokeRect(0, 0, 32, 32);
            graphics.generateTexture('wallTexture', 32, 32);
        }


        // 3. Расставляем объекты на сцене   |   Растягиваем спрайт до нужных размеров
        gameSettings.Structures.Walls.forEach((struct) => {
            const wall = this.walls.create(struct.x, struct.y, struct.texture);
            wall.displayWidth = struct.w;
            wall.displayHeight = struct.h;
            // ВАЖНО: После изменения displayWidth/Height у физических объектов необходимо вызвать refreshBody(), чтобы обновить границы хитбокса!
            wall.refreshBody();
        });
    }

    // Публичный метод для получения группы стен (нужен для настройки коллизий в GameScene)
    public getWalls(): Phaser.Physics.Arcade.StaticGroup {
        return this.walls;
    }
}