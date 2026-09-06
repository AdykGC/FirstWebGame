import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;


  public constructor() { super('GameScene'); }


  create(): void {
    // 1. Создаем фон арены
    this.add.rectangle( this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x2d2d2d );
    
    // 2. Создаем игрока в центре экрана
    this.player = this.physics.add.sprite(400, 300, 'playerTexture');
    this.player.setCollideWorldBounds(true); // Запрещаем выходить за границы 80
    
    // 3. Настраиваем управление (стрелки + WASD)
    // Используем ! (non-null assertion), так как keyboard гарантированно существует в этой конфигурации
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  // Префикс _ указывает TypeScript, что параметры намеренно не используются (правило noUnusedParameters)
  update(_time: number, _delta: number) {
    const speed = 200;
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