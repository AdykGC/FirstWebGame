export const gameSettings = {
    player: {
        spawn_x: 400, spawn_y: 300
        , texture: 'playerTexture'
        , speed: 200
        , physics: {
            collideWorldBounds: true,
        },
    },
    world: { backgroundColor: 0x2d2d2d, },
} as const;
