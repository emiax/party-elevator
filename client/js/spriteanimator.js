define([
    'jquery'
], function ($) {
 
	/** Dirty sprite animator! */

	// Sprite testing

    /*
    States (state,flip)
    
    walk up:    (1,0) (4,0) (1,0) (4,1)
    walk right: (2,1) (5,1)
    walk down:  (0,0) (3,0) (0,0) (3,1)
    walk right: (2,0) (5,0)
    
    */

    /** Frames */
    // 8 frames = 8fps = more responsive.
    // That's why every frame occurs two times.
    // (Told you it was dirty.)

    var walk = {
        'up': [
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10},
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':4, 'flip': 0, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':1, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10},
            {'state':4, 'flip': 1, 'x': 0, 'y': -10}
        ],
        'right': [
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':2, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0},
            {'state':5, 'flip': 1, 'x': 10, 'y': 0}
        ],
        'down': [
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10},
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':3, 'flip': 0, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':0, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10},
            {'state':3, 'flip': 1, 'x': 0, 'y': 10}
        ],
        'left': [
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':2, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0},
            {'state':5, 'flip': 0, 'x': -10, 'y': 0}
        ],
    };
    var stop = {
        'up': [
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0},
            {'state':1, 'flip': 0}
        ],
        'right': [
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1},
            {'state':2, 'flip': 1}
        ],
        'down': [
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0}
        ],
        'left': [
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0},
            {'state':2, 'flip': 0}
        ],
    }
    var dance = {
        'bobhead': [
            {'state':3, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':3, 'flip': 0},
            {'state':0, 'flip': 0},
        ],
        'leftright': [
            {'state':5, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':0, 'flip': 0},
        ],
        'spin': [
            {'state':5, 'flip': 0},
            {'state':4, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':3, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':3, 'flip': 1},
            {'state':3, 'flip': 1},
            {'state':3, 'flip': 1},
        ],
        'spinfast': [
            {'state':5, 'flip': 0},
            {'state':4, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':3, 'flip': 0},
            {'state':5, 'flip': 0},
            {'state':4, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':3, 'flip': 0},
            {'state':5, 'flip': 0},
            {'state':4, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':3, 'flip': 0},
            {'state':5, 'flip': 0},
            {'state':4, 'flip': 0},
            {'state':5, 'flip': 1},
            {'state':3, 'flip': 0},
        ],
        'leftkick': [
            {'state':5, 'flip': 0},
            {'state':0, 'flip': 0},
            {'state':3, 'flip': 1},
            {'state':0, 'flip': 0},
        ]
    };

    // Negative offset to place sprite correctly over click-coordinate
	var relx = -16;
	var rely = -32;

	var spriteSize = 32;
	function animateSprite(parentEl, frames, killAnimation){
        var $spriteEl = $(parentEl).children().children('img');


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
	            $spriteEl.css({
	                'left': offsetX + 'px',
	                'top': - (parseInt($(parentEl).attr('id').substr(8,4)) % 44) * spriteSize + 'px',
	                '-moz-transform': 'scaleX(1)',
	                '-o-transform': 'scaleX(1)',
	                '-webkit-transform': 'scaleX(1)',
	                'transform': 'scaleX(1)',
	                'filter': '',
	                '-ms-filter': '""'
	            }).parent().css({'left': relx + 'px', 'top': rely + 'px'});
	        }else{
	            var offsetX = - spriteSize * (6 - state) + spriteSize;
	            $spriteEl.css({
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
	// window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, walk.down);
	  



	var animate = function(initObj){


        // Insert sprite if it is missing
        var $elem = initObj.attendeeElement;
        if($elem.html() == ''){
            $elem.html('<div class="sprite-wrap"><img id="sprite" src="img/sprites64.png" alt=""></div>'); 
        }

        // character = initObj.character;
		// character = $elem.attr('id').substr(8,4);
		// console.log('CHARACTER: ' + character)

		/*
		Example of initObj: 
		{
                attendeeElement: $elem,
                targetCoords: { x: projected.x, y: projected.y },
                duration: duration,
                character: 13
            }
		*/


		// Calculate speed (animation duration, doesn't seem to work though)

	    // Get start coords
	    var startX = parseInt($(initObj.attendeeElement).css("left"));
	    var startY = parseInt($(initObj.attendeeElement).css("top"));

	    // Get triangle sides
	    var catheterX = initObj.targetCoords.x - startX ;
	    var catheterY = initObj.targetCoords.y - startY ;

		// Get the distance in X- and Y-directions to select animation (left/right or up/down)
        var catheterXLength = catheterX;
        var catheterYLength = catheterY;

        // If moving up or left we need to invert the catheter length
        if(catheterX < 0){
            catheterXLength = catheterX * -1;
        }
        if(catheterY < 0){
            catheterYLength = catheterY * -1;
        }

	    // Get length of hypotenuse (for calculating speed, or animation duration)
	    var hypotenuse = Math.sqrt(catheterXLength * catheterXLength + catheterYLength * catheterYLength);

	    // Dirty stuff:
	    // To be able to remove the setInterval for an animation, we need to store it in a global object.
	    // For now, i'm using the window.
	    if(window.animations === undefined){
	    	window.animations = {};
	    }

	    // Animate position movement
	    $(initObj.attendeeElement).animate({
	        left: initObj.targetCoords.x,
	        top: initObj.targetCoords.y
	    },
	    {
	        // On each turn, update sprite animation
	        start: function(){

	            // Update start coords for every turn
	            startX = parseInt($(initObj.attendeeElement).css("left"));
	            startY = parseInt($(initObj.attendeeElement).css("top"));

	            // Get triangle sides to calculate direction
	            catheterX = initObj.targetCoords.x - startX ;
	            catheterY = initObj.targetCoords.y - startY ;

	            // Get the distance in X- and Y-directions to select animation (left/right or up/down)
	            catheterXLength = catheterX;
	            catheterYLength = catheterY;

	            // If moving up or left we need to invert the catheter length
	            if(catheterX < 0){
	                catheterXLength = catheterX * -1;
	            }
	            if(catheterY < 0){
	                catheterYLength = catheterY * -1;
	            }
				
				// Get length of hypotenuse (for calculating speed, or animation duration)
	    		hypotenuse = Math.sqrt(catheterXLength * catheterXLength + catheterYLength * catheterYLength);

	           console.log('Sprite animation debug: \n - startX: ' + startX + ' x: ' + initObj.targetCoords.x + ' startY: ' + startY + ' y: ' + initObj.targetCoords.y + ' \n - catheterX: ' + catheterX + ' catheterY: ' + catheterY + ' \n - catheterXLength: ' + catheterXLength + ' catheterYLength: ' + catheterYLength + ' \n - Hypotenuse: ' + hypotenuse + ' Duration: ' + initObj.duration);

	            // Check if animation should be left/right or up/down
	            if(catheterYLength < catheterXLength ){
	                // animation is left or right
	                if(catheterXLength > 0.5){ //Threshold to prevent animation when avatar is just moving < .00001 steps
	                    if(catheterX < 0){
	                        // delta X is negative - moving left
	                        window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, walk.left /* Try dance.spinfast */, window.animations['sprite_' + $elem.attr('id') + '_anim']);
	                        console.log("walk.left");
	                    }else{
	                        // moving right
	                        window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, walk.right, window.animations['sprite_' + $elem.attr('id') + '_anim']);
	                        console.log("walk.right");
	                    }
	                }
	            }else{
	                // animation is up or down
	                if(catheterYLength > 0.5){ //Threshold to prevent animation when avatar is just moving < .00001 steps
	                    if(catheterY < 0){
	                        // delta Y is negative - moving up
	                        window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, walk.up, window.animations['sprite_' + $elem.attr('id') + '_anim']);
	                        console.log("walk.up");
	                    }else{
	                        // moving down
	                        window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, walk.down, window.animations['sprite_' + $elem.attr('id') + '_anim']);
	                        console.log("walk.down");
	                    }
	                }
	            }
	        },

	        // When we're done, stop and face the camera.
	        // TODO: Maybe dance a bit instead of stopping?
	        done: function(){
	            window.animations['sprite_' + $elem.attr('id') + '_anim'] = animateSprite($elem, stop.down /*Try dance.spin*/, window.animations['sprite_' + $elem.attr('id') + '_anim']);
	        },
	        easing: 'linear',
	        duration: initObj.duration
	    });
	}
	
	return animate;
});