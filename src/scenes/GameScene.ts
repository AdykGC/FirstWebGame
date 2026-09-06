import Phaser from 'phaser';
import { gameSettings } from '../config/gameSettings';
import { Level } from '../levels/Level'; // Импортируем наш новый класс


export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private level!: Level;


  public constructor() { super('GameScene'); }



  preload() {
    // Генерируем текстуру игрока (зеленый круг)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(16, 16, 16);
    graphics.generateTexture('playerTexture', 32, 32);
  }



  create(): void {
    // 1. Создаем фон арены
    this.add.rectangle( this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x2d2d2d );

    // 2. Инициализируем уровень (стены и здания)
    this.level = new Level(this);

    // 3. Создаем игрока в сцене
    this.player = this.physics.add.sprite( gameSettings.player.spawn_x, gameSettings.player.spawn_y, gameSettings.player.texture);
    this.player.setCollideWorldBounds(gameSettings.player.physics.collideWorldBounds); // Запрещаем выходить за границы
    
    // 4. Настраиваем управление (стрелки + WASD)
    // Используем ! (non-null assertion), так как keyboard гарантированно существует в этой конфигурации
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // 5. ДОБАВЛЯЕМ КОЛЛИЗИЮ: Игрок не может пройти сквозь стены
    this.physics.add.collider(this.player, this.level.getWalls());
  }


  // Префикс _ указывает TypeScript, что параметры намеренно не используются (правило noUnusedParameters)
  update(_time: number, _delta: number) {
    const speed = gameSettings.player.speed;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    let vx = 0, vy = 0;

    // Горизонтальное движение
    if (this.cursors.left.isDown || this.keyA.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.keyD.isDown) vx = 1;

    // Вертикальное движение
    if (this.cursors.up.isDown || this.keyW.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.keyS.isDown) vy = 1;

    // Нормализация вектора: чтобы движение по диагонали не было быстрее (√2 раз)
    if (vx !== 0 || vy !== 0) {
      const length = Math.sqrt(vx * vx + vy * vy);
      vx /= length;
      vy /= length;
    }

    // Применяем скорость к физическому телу
    body.setVelocity(vx * speed, vy * speed);
  }
}