requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix'
    }
});




require(['projector', 'socket.io', 'jquery'], function (Projector, io, $) {

    var socket = io.connect('http://localhost:8081');
    var ctx = $('canvas')[0].getContext('2d');

function drawKeyframes(keyframes) {
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.lineWidth = 3;
    
    ctx.beginPath();

    var pos = {
        x: keyframes[0].state.x,
        y: keyframes[0].state.y
    };
    var projected = Projector.project(pos);

    ctx.moveTo(projected.x, projected.y);
    keyframes.forEach(function (keyframe) {
        var x = keyframe.state.x;
        var y = keyframe.state.y;

        var pos = {
            x: keyframe.state.x,
            y: keyframe.state.y
        };
        var projected = Projector.project(pos);
        
//        console.log(x, y);
        ctx.lineTo(projected.x, projected.y);
    });
    ctx.stroke();
}


function drawTriangle(p0, p1, p2) {
    ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
    
    ctx.beginPath();
    ctx.fillStyle = "rgba( " + Math.round(100+Math.random()*80) + ", " + Math.round(100+Math.random()*80) + ", " + Math.round(Math.random()) + ", 0.4)";        

    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();
    ctx.fill();
}




    // Sprite testing

    /*
    States (state,flip)
    
    walk up:    (1,0) (4,0) (1,0) (4,1)
    walk right: (2,1) (5,1)
    walk down:  (0,0) (3,0) (0,0) (3,1)
    walk right: (2,0) (5,0)
    
    */
    var walk = {
        'up': [
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10},
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10}
        ],
        'right': [
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0}
        ],
        'down': [
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10},
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10}
        ],
        'left': [
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0}
        ],
    };
    var stop = {
        'up': [
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0},
            {'state':1, 'flip': 0, 'x': 0, 'y': 0}
        ],
        'right': [
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0},
            {'state':2, 'flip': 1, 'x': 0, 'y': 0}
        ],
        'down': [
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0},
            {'state':0, 'flip': 0, 'x': 0, 'y': 0}
        ],
        'left': [
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0},
            {'state':2, 'flip': 0, 'x': 0, 'y': 0}
        ],
    };
var character = 10;

var relx = -16;
var rely = -16;

var spriteSize = 32;
function animateSprite(sel, frames, killAnimation){
    if(killAnimation !== undefined){
        clearInterval(killAnimation);
    }else{
        // console.log("nothing to kill");
    }

    var animation = setInterval(function(){
        var clock = new Date().getMilliseconds();

        var frameTime = 1000 / frames.length;
        var lastPassedThreshold = clock - clock % frameTime;
        var currentFrame = lastPassedThreshold / frameTime;

        // relx += frames[currentFrame].x*1.5;
        // rely += frames[currentFrame].y*1.5;

        var state = frames[currentFrame].state;
        var flip = frames[currentFrame].flip;

        if (flip == 0){
            var offsetX = - spriteSize * state;
            $(sel).css({
                'left': offsetX + 'px',
                'top': - character * spriteSize + 'px',
                '-moz-transform': 'scaleX(1)',
                '-o-transform': 'scaleX(1)',
                '-webkit-transform': 'scaleX(1)',
                'transform': 'scaleX(1)',
                'filter': '',
                '-ms-filter': '""'
            }).parent().css({'left': relx + 'px', 'top': rely + 'px'});
        }else{
            var offsetX = - spriteSize * (6 - state) + spriteSize;
            $(sel).css({
                'left': offsetX + 'px',
                '-moz-transform': 'scaleX(-1)',
                '-o-transform': 'scaleX(-1)',
                '-webkit-transform': 'scaleX(-1)',
                'transform': 'scaleX(-1)',
                'filter': 'FlipH',
                '-ms-filter': '"FlipH"'
            }).parent().css({'left': relx + 'px', 'top': rely + 'px'});
        }
    }, 1000 / frames.length);
    
    return animation;
}
// window.currentWalkAnimation = animateSprite('#sprite', walk.down);
    



    socket.on('connect', function () {
        console.log("socket connected");

        $('canvas').click(function (evt) {
            var projected = {
                x: evt.offsetX,
                y: evt.offsetY
            };

            var pos = Projector.unproject(projected);
            socket.emit('intention', {
                x: pos.x,
                y: pos.y,
                level: 'ground'
            });
        });

        socket.emit('intention', {
            x: 522, 
            y: 113,
            level: 'ground'
        });
    });

    socket.on('drawTriangles', function (triangles) {
        ctx.clearRect(0, 0, 1000, 1000);
        triangles.forEach(function (tri, i) {
            drawTriangle(Projector.project(tri.p0), Projector.project(tri.p1), Projector.project(tri.p2), i);
        });
    });
    

    socket.on('attendeeKeyframes', function (data) {
        drawKeyframes(data.keyframes);
        data.keyframes.forEach(function (keyframe) {
            var x = keyframe.state.x;
            var y = keyframe.state.y;

            var projected = Projector.project({
                x: x,
                y: y
            });
            var startX = parseInt($('#avatar').css("left"));
            var startY = parseInt($('#avatar').css("top"));

            var katetX = x - startX ;
            var katetY = y - startY ;


            var hypotenusan = Math.sqrt(katetX * katetX + katetY * katetY);
            // console.log('hypotenusa: ' + hypotenusan);

            var msPerPixel = 5;
    
            // window.currentWalkAnimation = animateSprite('#sprite', stop.down);

            $('#avatar').animate({
                left: projected.x,
                top: projected.y
            },
            {
                start: function(){
                    var katetXLength = katetX;
                    var katetYLength = katetY;

                    if(katetX < 0){
                        katetXLength = katetX * -1;
                    }
                    if(katetY < 0){
                        katetYLength = katetY * -1;
                    }

                    // console.log(' startX: ' + startX + ' x: ' + x + ' startY: ' + startY + ' y: ' + y + ' \nkatetX: ' + katetX + ' katetY: ' + katetY + ' katetXLength: ' + katetXLength + ' katetYLength: ' + katetYLength );


                    if(katetYLength < katetXLength ){
                        // animation is left or right
                        if(katetX < 0){
                            // delta X is negative - moving left
                            window.currentWalkAnimation = animateSprite('#sprite', walk.left, window.currentWalkAnimation);
                            console.log("walk.left");
                        }else{
                            // moving down
                            window.currentWalkAnimation = animateSprite('#sprite', walk.right, window.currentWalkAnimation);
                            console.log("walk.right");
                        }
                    }else{
                        // animation is up or down
                        if(katetY < 0){
                            // delta Y is negative - moving up
                            window.currentWalkAnimation = animateSprite('#sprite', walk.up, window.currentWalkAnimation);
                            console.log("walk.up");
                        }else{
                            // moving down
                            window.currentWalkAnimation = animateSprite('#sprite', walk.down, window.currentWalkAnimation);
                            console.log("walk.down");
                        }
                    }
                },
                done: function(){
                    window.currentWalkAnimation = animateSprite('#sprite', stop.down, window.currentWalkAnimation);
                },
                easing: 'linear',
                duration: msPerPixel * hypotenusan
            });
            
        });
        console.log("Done.")
    });

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });

    console.log("LOL");
    
//    console.log(Projector.unproject((Projector.project({x: 307, y: 326.5}))));
//    console.log(Projector.project({x: 614, y: 326.5}));
//    console.log(Projector.project({x: 0, y: 326.5}));
//    console.log(Projector.unproject({x: 400, y: 250}))
    console.log(Projector.unproject({x: 500, y: 250}))
//    console.log(Projector.unproject({x: 0, y: 250}));
//    console.log(Projector.unproject({x: 400, y: 250}))
///    console.log(Projector.unproject({x: 800, y: 250}))
//    console.log(Projector.unproject((Projector.project({x: 0, y: 326.5}))));
    
});
