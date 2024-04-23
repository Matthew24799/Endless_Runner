import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
const jumpForce = 800;
const speed = 480;

kaboom({
    width: 960,
    height: 540,
   
})

let score = 0;
setGravity(1600);

loadSprite("gobbo", "gobboSheet.png", {
    sliceX: 6, 
    sliceY: 1,
    anims: {
        run: {
            from: 0,
            to: 5,
            loop: true, 
        },
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
        scale(3),
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