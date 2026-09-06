export const gameSettings = {
    player: {
        spawn_x: 400, spawn_y: 300
        , texture: 'playerTexture'
        , speed: 200
        , physics: {
            collideWorldBounds: true,
        },
    },
    world: { backgroundColor: 0x2d2d2d, }


    , Structures: {
        Walls: [
            { x: 200 , y: 150, w: 120, h: 120, texture: 'wallTexture' }
            , { x: 600, y: 400, w: 200, h: 60, texture: 'wallTexture' }
            , { x: 100, y: 450, w: 60, h: 150, texture: 'wallTexture' }
            , { x: 400, y: 600, w: 800, h: 30, texture: 'wallTexture' }
        ]
    }
} as const;
