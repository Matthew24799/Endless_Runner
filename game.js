import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
const jumpForce = 650;
const speed = 600;
const floorHeight = 48;
let score = 0;
const game = document.querySelector("#game");


const scales = Math.min(
    window.innerWidth / 1280, 
    window.innerHeight / 720
);



let scaledWidth = 1280 * scales;
let scaledHeight = 720 * scales;


if (scaledWidth > 1280 || scaledHeight > 720) {
    const aspectRatio = 1280 / 720; 
    if (scaledWidth / scaledHeight > aspectRatio) {
        // Limit width
        scaledWidth = 1280;
        scaledHeight = scaledWidth / scales;
    } else {
        
        scaledHeight = 720;
        scaledWidth = scaledHeight * scales;
    }
}


kaboom({
  //  width: 1280,
  //  height: 720,
    canvas: game,
  width: scaledWidth,
  height: scaledHeight,
    font: "upHeave",
    letterbox: true,
});


setGravity(1400);



loadSprite("dead", "deadSheet.png", {
    sliceX: 2, 
    sliceY: 1,
    anims: {
        dead: {
            from: 0,
            to: 1,
            loop: true, 
        },
    },
})

loadSprite("gobbo", "gabbo2.png", {
    sliceX: 4, 
    sliceY: 1,
    anims: {
        run: {
            from: 0,
            to: 2,
            loop: true, 
        },
        jump: {
            from: 3,
            to: 3,
        }
    },
})
loadSprite("platform", "platform.png" )
loadSprite("doubleSpike", "doubleSpike.png");
loadSprite("spike", "spike.png");
loadSprite("floor", "floor.png");
loadSprite("cloud", "cloud.png"); 
loadFont("upHeave", "upheavtt.ttf");
scene("game", () => {
    

    const scoreLabel = add([
        text(score, {
            font: "upHeave"
        }),

        scale(2),
        pos( width() / 2.5 , height() / 4)
    ])

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    setBackground(95,205,228);

    const player = add([
        sprite("gobbo"),
        scale(3),
        pos(90,500),
        area(),
        body({
            jumpForce: jumpForce,
        } ),  
        doubleJump()
    
    ]);
 
    onUpdate(() => {
      if (player.pos.x <  -10) {
        go("lose");
      }
    })

        player.play("run")   


        function spawnplatforms() {
            const platform = add([
                sprite("platform"),
                scale(6 ),
                area(),
                body({ isStatic: true }), 
                pos(width(), height() - floorHeight - randi(80, 130)),
               anchor("botleft"),
                move(LEFT,speed),
                "platform",
                offscreen({ destroy: true }),

            ])
        wait(rand(2,4), spawnplatforms);
    }

    spawnplatforms();


    
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
            move(LEFT, speed ),
            "cloud",
            offscreen({ destroy: true }),
        ])

        wait(rand(0.5,1.0), spawnClouds)
    }

    spawnClouds();
    
    function spawnSpikes() {
            const spike = add([
                sprite("spike"),
                scale(3 ),
                area(),
                pos(width(), height() - floorHeight),
                anchor("botleft"),
                move(LEFT,speed),
                "spike",
                offscreen({ destroy: true }),
            ]) 
        
    }

    function spawnDoubleSpikes() {
        const doubleSpike = add([
            sprite("doubleSpike"),
            scale(3 ),
            area(),
            pos(width(), height() - floorHeight),
            anchor("botleft"),
            move(LEFT,speed),
            "doubleSpike",
            offscreen({ destroy: true }),
    ])}
    


function spawnTraps() {
   const trap = randi(1,3)
   console.log(trap);
    if(trap == 1) {
        spawnSpikes();
    } else if (trap == 2 ) {
        spawnDoubleSpikes();
    };
    wait(rand(1.0 , 1.5 ), spawnTraps)
};

spawnTraps();




    onKeyPress("space", () => {
       
        player.play("jump"); 
        player.doubleJump(jumpForce);
        wait(2, () => {
            player.play("run");
        
        })
       
    });

    onClick(() => {
        if (player.isGrounded()) {
            player.jump(jumpForce); 
           }
    });

    onKeyPress("f", (c) => {
        setFullscreen(!isFullscreen())
    })
    
    
    player.onCollide("spike",  () => {
        go("lose");
        shake();
        
    })
    
    player.onCollide("doubleSpike",  () => {
        go("lose");
        shake();
        
    })

});

scene("lose", () => {
    
   const dead = add([
    pos(width() / 2.3, height() / 1.4),
    sprite("dead"),
    scale(8)
])

dead.play("dead")

    add([
        text("game Over", {
        }),
        scale(3),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text(score, {
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