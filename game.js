import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
const jumpForce = 800;
const speed = 480;

kaboom({
    width: 960,
    height: 540,
   
})

let score = 0;
setGravity(1600);


loadJSON("gobboSheet","gobbo.json");

loadAseprite("gobbo", "gobboBoi-sheet.png", "gobbo.json", {
    "frames": [
        {
         "filename": "gobOOO 0.png",
         "frame": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "rotated": false,
         "trimmed": false,
         "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "sourceSize": { "w": 23, "h": 20 },
         "duration": 100
        },
        {
         "filename": "gobOOO 1.png",
         "frame": { "x": 23, "y": 0, "w": 23, "h": 20 },
         "rotated": false,
         "trimmed": false,
         "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "sourceSize": { "w": 23, "h": 20 },
         "duration": 100
        },
        {
         "filename": "gobOOO 2.png",
         "frame": { "x": 46, "y": 0, "w": 23, "h": 20 },
         "rotated": false,
         "trimmed": false,
         "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "sourceSize": { "w": 23, "h": 20 },
         "duration": 100
        },
        {
         "filename": "gobOOO 3.png",
         "frame": { "x": 69, "y": 0, "w": 23, "h": 20 },
         "rotated": false,
         "trimmed": false,
         "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "sourceSize": { "w": 23, "h": 20 },
         "duration": 100
        },
        {
         "filename": "gobOOO 4.png",
         "frame": { "x": 92, "y": 0, "w": 23, "h": 20 },
         "rotated": false,
         "trimmed": false,
         "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 20 },
         "sourceSize": { "w": 23, "h": 20 },
         "duration": 100
        },

      ],

      anims: {
        run: { from: 0, to: 92 },
    },
    
})
  
loadSprite("spike", "spike.png");
loadSprite("floor", "floor.png");
loadSprite("cloud", "cloud.png");
loadFont("rebel", "rebel.ttf");

scene("game", () => {

    const scoreLabel = add([
        text(score, {
            font: "rebel"
        }),

        scale(2),
        pos( width() - 550 , height() / 4)
    ])

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    setBackground(95,205,228);

    const player = add([
        sprite("gobbo"),
        scale(2 ),
        pos(80,40),
        area(),
        body(),
    
    ]);
 
    player.play("run")
    
     add([
        sprite("floor"),
        scale(5),
        pos(0, height() - 48),
        area(),
        body({ isStatic: true }),
    ])
    
    function spawnClouds() {
        const cloud = add([
            sprite("cloud"),
            scale(4),
            pos(width(),rand(0, height() / 2)),
            move(LEFT, 300),
            "cloud",
        ])

        wait(rand(0.5,1.5), spawnClouds)
    }

    spawnClouds();
    
    function spawnSpikes() {
            const spike = add([
                sprite("spike"),
                scale(3 ),
                area(),
                pos(width(), height() - 48),
                anchor("botleft"),
                move(LEFT,speed),
                "spike",
            ])
        
        wait(rand(0.5, 1.5), spawnSpikes)
    }
    
    spawnSpikes();
    
    onKeyPress("space", () => {
       if (player.isGrounded()) {
        player.jump(jumpForce); 
       }
         
    });

    onKeyPress("f", (c) => {
        setFullscreen(!isFullscreen())
    })
    
    
    player.onCollide("spike", () => {
        go("lose");
        shake();
        addKaboom(player.pos);
    })
    
});

scene("lose", () => {
    add([
        text("game Over", {
            font: "rebel"
        }),
        scale(2),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text(score, {
            font: "rebel"
        }),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);
    score = 0;

    onKeyPress("f", (c) => {
        setFullscreen(!isFullscreen())
    })

    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

})

go("game");