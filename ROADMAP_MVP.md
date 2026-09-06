# 2D top-down game MVP — TypeScript + Phaser + Vite → HTML5 → itch.io

Этот документ описывает:
- структуру проекта
- назначение каждого файла/папки
- на каком этапе разработки они используются
- минимальный набор для MVP

Цель: понять, «что зачем» и быстро собрать работающий прототип.

---

## Структура проекта

```text
my-game/
  src/
    main.ts              # точка входа, создание Phaser.Game
    scenes/
      BootScene.ts       # предзагрузка критичных ассетов
      PreloadScene.ts    # загрузка спрайтов, аудио, тайловых карт
      MenuScene.ts       # главное меню
      GameScene.ts       # основная игровая сцена
      UIScene.ts         # интерфейс (HUD)
    entities/
      Player.ts
      Enemy.ts
    config/
      gameConfig.ts      # конфиг Phaser (размер, физика и т.д.)
    utils/
      input.ts
      math.ts
  public/
    assets/
      sprites/
      audio/
      maps/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

---

## Назначение файлов и папок

### `index.html`

**Для чего:** HTML-обёртка игры. В нём подключается скрипт сборки (`main.ts` после билда) и обычно есть `<div id="game-container">`, в который Phaser рендерит игру.

**Когда используется:**  
- На этапе настройки проекта (обычно генерируется шаблоном).  
- При публикации на itch.io (входит в ZIP вместе с `dist/`).

**Что менять в MVP:**  
Обычно не трогаешь, если не нужно:
- изменить размер канваса на весь экран
- добавить мета-теги, favicon, стили.

---

### `package.json`

**Для чего:** Зависимости (`phaser`, `typescript`, `vite` и др.) и npm-скрипты (`dev`, `build`, `preview`).

**Когда используется:**  
- При создании проекта.  
- При установке зависимостей: `npm install`.  
- При запуске дев-сервера и сборке: `npm run dev`, `npm run build`.

**Что менять в MVP:**  
Обычно не трогаешь, кроме:
- имени проекта (`"name"`)
- версии, описания, если хочешь.

---

### `tsconfig.json`

**Для чего:** Настройки TypeScript: какие файлы компилировать, целевая версия JS, строгость типов и т.д.

**Когда используется:**  
- При создании проекта.  
- При изменении настроек компиляции (редко нужно на старте).

**Что менять в MVP:**  
Обычно оставляешь как есть (шаблон уже настроен).

---

### `vite.config.ts`

**Для чего:** Настройки сборщика Vite: порт, базовый путь, плагины, алиасы импортов.

**Когда используется:**  
- При создании проекта.  
- При необходимости изменить:
  - порт дев-сервера
  - `base` путь (важно для itch.io, если игра не в корне домена).

**Что менять в MVP:**  
Чаще всего не трогаешь. Если игра будет только на itch.io и в ZIP — стандартные настройки подходят.

---

### `src/main.ts`

**Для чего:** Точка входа. Здесь создаётся объект `Phaser.Game` с конфигом и списком сцен.

**Когда используется:**  
- На этапе «запуск первой сцены».  
- Когда подключаешь новые сцены.

**Пример:**

```ts
import { Game } from 'phaser';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const game = new Game({
  ...gameConfig,
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    UIScene,
  ],
});
```

**Что менять в MVP:**  
- Подключать только те сцены, которые реально есть.  
- Для самого минимального MVP можно начать с `[GameScene]` и потом добавить остальные.

---

### `src/config/gameConfig.ts`

**Для чего:** Конфигурация Phaser: размер окна, физика, фон, масштабирование.

**Когда используется:**  
- При старте проекта.  
- При изменении разрешения, физики, поведения канваса.

**Пример:**

```ts
import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // для top-down обычно 0
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
```

**Что менять в MVP:**  
- `width` / `height` под желаемое разрешение.  
- `backgroundColor`.  
- Включить/выключить `debug` в физике.

---

### `src/scenes/BootScene.ts`

**Для чего:** Самая первая сцена. Загружает минимальный набор ассетов, нужных для экрана прелоадера (логотип, прогресс-бар).

**Когда используется:**  
- На этапе «хочу красивый прелоадер».  
- В MVP можно сделать максимально простой или вообще пропустить.

**Типичная логика:**

```ts
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Загружаем только самое необходимое для PreloadScene
    // this.load.image('logo', 'assets/sprites/logo.png');
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
```

**Для MVP:**  
Можно сделать так, чтобы `BootScene` сразу переходил в `PreloadScene` без загрузки, или вообще убрать и стартовать с `PreloadScene`.

---

### `src/scenes/PreloadScene.ts`

**Для чего:** Загрузка всех основных ассетов игры: спрайты, аудио, тайловые карты, атласы и т.д. Здесь же можно показать прогресс-бар.

**Когда используется:**  
- На этапе «добавляю графику и звук».  
- Каждый раз, когда добавляешь новый ассет.

**Пример:**

```ts
import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Спрайты
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('enemy', 'assets/sprites/enemy.png');
    this.load.image('wall', 'assets/sprites/wall.png');

    // Аудио (опционально для MVP)
    // this.load.audio('shoot', 'assets/audio/shoot.mp3');

    // Тайловая карта (если нужна)
    // this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
  }

  create(): void {
    // После загрузки всех ассетов переходим в меню
    this.scene.start('MenuScene');
  }
}
```

**Для MVP:**  
Загружаешь только то, что реально нужно для первой играбельной сцены (например, спрайт игрока и врага, возможно одну карту).

---

### `src/scenes/MenuScene.ts`

**Для чего:** Главное меню: кнопка «Start», возможно «How to play», настройки.

**Когда используется:**  
- На этапе «хочу меню перед игрой».  
- Для MVP можно сделать очень простым: фон + текст + кнопка.

**Пример:**

```ts
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x0f0f1a).setOrigin(0);

    this.add.text(width / 2, height / 2 - 40, 'My Top-Down Game', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const startText = this.add.text(width / 2, height / 2 + 20, 'Press SPACE to Start', {
      fontSize: '20px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
```

**Для MVP:**  
Достаточно:
- фона
- названия
- одной кнопки/клавиши для старта.

---

### `src/scenes/GameScene.ts`

**Для чего:** Основная игровая сцена. Здесь происходит всё: игрок, враги, карта, правила, условия победы/поражения.

**Когда используется:**  
- На всех этапах разработки геймплея.  
- Это главный файл, в котором ты проводишь больше всего времени.

**Типичная структура:**

```ts
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // 1. Создаём мир (карту или просто фон)
    // 2. Создаём игрока
    this.player = new Player(this, 400, 300);

    // 3. Создаём врагов
    this.enemies = this.add.group();
    this.enemies.add(new Enemy(this, 200, 200));
    this.enemies.add(new Enemy(this, 600, 400));

    // 4. Настраиваем ввод (клавиши)
    // 5. Настраиваем коллизии
  }

  update(): void {
    // 1. Обновляем игрока
    this.player.update();

    // 2. Обновляем врагов
    this.enemies.getChildren().forEach((enemy) => {
      (enemy as Enemy).update(this.player);
    });

    // 3. Проверяем коллизии, условия победы/поражения
  }
}
```

**Для MVP:**  
Здесь ты делаешь:
- движение игрока (WASD / стрелки)
- простую карту или арену
- 1–2 типа врагов с примитивным поведением
- условие проигрыша (касание врага) и рестарт.

---

### `src/scenes/UIScene.ts`

**Для чего:** Отдельная сцена для интерфейса: счёт, жизни, паттерны, пауза, сообщения.

**Когда используется:**  
- Когда интерфейс становится сложнее пары текстов.  
- Для MVP можно не делать отдельную сцену, а рисовать UI прямо в `GameScene`.

**Пример минимального UI:**

```ts
import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '18px',
      color: '#ffffff',
    });

    // Слушаем событие увеличения счёта
    this.events.on('addScore', (amount: number) => {
      this.score += amount;
      this.scoreText.setText(`Score: ${this.score}`);
    });
  }
}
```

Вызов из `GameScene`:

```ts
(this.scene.get('UIScene') as UIScene).events.emit('addScore', 10);
```

**Для MVP:**  
Можно просто добавить текст счёта прямо в `GameScene.create()` и обновлять его в `update()` или при событиях.

---

### `src/entities/Player.ts`

**Для чего:** Класс игрока. Логика движения, анимаций, здоровья, атак и т.д.

**Когда используется:**  
- На этапе «делаю управление и поведение игрока».  
- Каждый раз, когда меняешь механику игрока.

**Пример (базовое движение):**

```ts
import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 200;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);

    // Клавиши
    const keys = scene.input.keyboard?.createCursorKeys();
    this.cursors = keys!;
  }

  update(): void {
    this.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
    }

    if (this.cursors.up.isDown) {
      this.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(this.speed);
    }
  }
}
```

**Для MVP:**  
- Движение (WASD / стрелки)  
- Ограничение мира (чтобы не уходил за карту)  
- Позже: здоровье, атака, анимации.

---

### `src/entities/Enemy.ts`

**Для чего:** Класс врага. Поведение (преследование, патрулирование), урон, здоровье.

**Когда используется:**  
- На этапе «добавляю врагов и угрозу».  

**Пример (простое преследование):**

```ts
import Phaser from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private speed = 80;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
  }

  update(player: Player): void {
    // Простое движение к игроку
    this.scene.physics.moveToObject(this, player, this.speed);
  }
}
```

**Для MVP:**  
- Один тип врага  
- Простое поведение (идти к игроку)  
- Условие проигрыша при касании.

---

### `src/utils/input.ts`

**Для чего:** Утилиты для ввода: обработка клавиш, мыши, тача. Можно вынести повторяющуюся логику.

**Когда используется:**  
- Когда ввод становится сложнее (комбо, действия по кнопкам и т.д.).  

**Для MVP:**  
Можно не использовать и обрабатывать ввод прямо в `Player` или `GameScene`.

---

### `src/utils/math.ts`

**Для чего:** Вспомогательные математические функции: случайные числа в диапазоне, нормализация, углы и т.д.

**Когда используется:**  
- По мере необходимости (случайный спавн врагов, направление и т.п.).

**Для MVP:**  
Можно не создавать отдельный файл, а писать простые выражения на месте.

---

### `public/assets/...`

**Для чего:** Папка с ассетами: спрайты, аудио, карты.

- `sprites/` — изображения: игрок, враги, тайлы, предметы.
- `audio/` — звуки и музыка.
- `maps/` — тайловые карты (Tiled), JSON.

**Когда используется:**  
- На этапе «добавляю графику и звук».  
- В `PreloadScene` указываешь пути к этим файлам.

**Для MVP:**  
Достаточно:
- 1 спрайт игрока
- 1 спрайт врага
- 1 фон или простая карта (можно просто цветной прямоугольник).

---

## Этапы разработки MVP

1. **Настройка и запуск**  
   - Убедиться, что `npm run dev` открывает пустую сцену.  
   - В `main.ts` оставить только `[GameScene]`, если остальные сцены ещё не созданы.

2. **Базовая GameScene**  
   - Создать `GameScene.ts` с `create()` и `update()`.  
   - Нарисовать фон (прямоугольник) и добавить простой спрайт игрока.  
   - Реализовать движение игрока (WASD / стрелки).

3. **Враги и проигрыш**  
   - Создать `Enemy.ts` и добавить 1–2 врага на сцену.  
   - Реализовать простое поведение (идти к игроку).  
   - При касании игрока и врага — рестарт сцены или переход в «Game Over».

4. **Меню и прелоадер (опционально для MVP)**  
   - Добавить `PreloadScene` для загрузки спрайтов.  
   - Добавить `MenuScene` с кнопкой «Start».  
   - Настроить переходы: `PreloadScene → MenuScene → GameScene`.

5. **Полировка MVP**  
   - Добавить простой счёт (например, за время выживания).  
   - Добавить звук выстрела/удара (опционально).  
   - Проверить сборку: `npm run build` и запуск через `npm run preview`.

6. **Публикация на itch.io**  
   - Сделать ZIP из папки `dist/`.  
   - Загрузить как HTML5 проект на itch.io.  

---

## Минимальный набор файлов для MVP

Для самого простого работающего прототипа можно начать с:

- `index.html`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.ts`
- `src/config/gameConfig.ts`
- `src/scenes/GameScene.ts`
- `src/entities/Player.ts`
- `src/entities/Enemy.ts`
- `public/assets/sprites/player.png`
- `public/assets/sprites/enemy.png`

Остальные сцены и утилиты добавляешь по мере необходимости.