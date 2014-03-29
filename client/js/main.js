requirejs.config({
    baseUrl: './js/',
    paths: {
        'socket.io': '../bower_components/socket.io-client/dist/socket.io',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix'
    }
});


var timeOffset = 0;

require([
    'projector',
    'socket.io',
    'jquery',
    'facebookConnector',
    'spriteanimator'
], function (
    Projector,
    io,
    $,
    FacebookConnector,
    animate
) {

    FacebookConnector.init(onLogin);
    var socket = io.connect(':8081');

/*    var ctx = $('canvas')[0].getContext('2d');

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
*/

    function elementOfAttendee(attendeeId) {
        var $element = $("#attendee" + attendeeId);
        //var imgLink = "http://graph.facebook.com/"+ attendee.id +"/picture";

        if (!$element.length) {
            $element = $('<div class="attendee" id="attendee' + attendeeId + '"><div class="insideElevator personalElevator">' +
                         '<div class="messageContainer"></div>' + 
                         '<img class="profilePic" src="sprite.png"/>' + 
                         '</div></div>');
            $("#attendeeContainer").append($element);
            console.log("YO!");
        }
        return $element;
    }


    function serverTime() {
        return new Date().getTime() - timeOffset;
    }
    
    
    function updateElevator(data) {
//        console.log("ELEVATOR DATA", data);
        var $elem = $('#elevator');
        $elem.stop(true);
        
        var st = serverTime();
        var previousKeyframeIndex = 0;
        data.keyframes.forEach(function (keyframe, i) {
            if (keyframe.time < st) {
                previousKeyframeIndex = i;
            }
        });
        
        var lastKeyframeTime = st;
        for (var i = previousKeyframeIndex + 1; i < data.keyframes.length; i++) {
            var keyframe = data.keyframes[i];
            var duration = keyframe.time - lastKeyframeTime;
            var y = keyframe.level === 'top' ? 0 : 350;

            $elem.animate({
                top: y
            }, {
                easing: 'linear',
                duration: duration,
                step: function () {
                    var top = $elem.css('top');
                    $('.insideElevator').css({
                        top: top
                    });
                }
            });
            lastKeyframeTime = keyframe.time;
        }
    }


    function updateAttendee(data) {
        var $elem = elementOfAttendee(data.id);
        $elem.stop(true);

        var fbId = data.fbId;
        $elem.children().children('img').attr('src', "http://graph.facebook.com/" + fbId + "/picture");
//        console.log("SSJD");
        
        var now = serverTime();
        var lastKeyframeTime = now;

        data.keyframes.forEach(function (keyframe) {
            var x = keyframe.state.x;
            var y = keyframe.state.y;
            var projected = Projector.project({
                x: x,
                y: y
            });

            var duration = keyframe.time - lastKeyframeTime;
/*
            $elem.animate({
                left: projected.x,
                top: projected.y
            }, {
                duration: duration
            });

              animate({
              spriteID: 'avatar',
              targetCoords: { x: projected.x, y: projected.y },
              speed: 5,
              character: 13
              })
            */
            

            $elem.animate({
                left: projected.x,
                top: projected.y
            }, {
                duration: duration,
                complete: function () {
                    console.log(keyframe.state.level);
                    
                    if (keyframe.state.level === 'elevator') {
//                        console.log("YO");
                        $elem.children('.personalElevator').addClass('insideElevator');
                    } else {
                        $elem.children('.personalElevator').removeClass('insideElevator');
                    } 
                    if (keyframe.state.level === 'ground') {
                        $elem.children('.personalElevator').css('top', 350);
                    }
                    
                    if (keyframe.state.level === 'top') {
                        $elem.children('.personalElevator').css('top', 0);
                    }
                }
            });
                
            /*animate({
                    attendeeElement: $elem,
                    targetCoords: { x: projected.x, y: projected.y },
                    duration: duration
            });*/
                
                lastKeyframeTime = keyframe.time;
            //}
        });
    }
    
    function sendFacebookData(data) {
        socket.emit('login', data);
    }
    

    function onLogin() {
        FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
            console.log(response);
            //            var img_link = "http://graph.facebook.com/"+response.id+"/picture";
            //            $("#placeholder").append($('<img src="' + img_link + '"/>'));
            sendFacebookData(response);
        });

    }

    
    function chatMessage($elem, message) {
        var $message = $('<div class="chatMessage">' + message + '</div>');
        $elem.children().children('.messageContainer').append($message);

        $message.css({
            left: -$message.width()/2
        });
        
        $message.animate({
            opacity: 0
        }, {
            duration: 5000,
            delay: 3000,
            done: function () {
                $message.remove();
            }
        });
    }
    

    function init() {
        $("#chat").submit(function (evt) {
            var message = $("#chatMessage").val();
            socket.emit('chat', message);
            $("#chatMessage").val('');
            evt.preventDefault();
        });

        socket.on('chat', function (data) {
            var attendeeId = data.attendee;
            var message = data.message;
            var $elem = elementOfAttendee(attendeeId);
            chatMessage($elem, message);
        });

        socket.on('connect', function () {
            console.log("socket connected");

            
            $('#topFloor').click(function (evt) {
                var x = evt.pageX - $(this).offset().left;
                var y = evt.pageY - $(this).offset().top;

                console.log(x, y);
                var projected = {
                    x: x,
                    y: y
                };

                var pos = Projector.unproject(projected);
                socket.emit('intention', {
                    x: pos.x,
                    y: pos.y,
                    level: 'top'
                });
            });
            
            $('#groundFloor').click(function (evt) {
                var x = evt.pageX - $(this).offset().left;
                var y = evt.pageY - $(this).offset().top;

                var projected = {
                    x: x,
                    y: y
                };

                var pos = Projector.unproject(projected);
                socket.emit('intention', {
                    x: pos.x,
                    y: pos.y,
                    level: 'ground'
                });
            });


/*            socket.on('drawTriangles', function (triangles) {
                ctx.clearRect(0, 0, 1000, 1000);
                triangles.forEach(function (tri, i) {
                    drawTriangle(Projector.project(tri.p0), Projector.project(tri.p1), Projector.project(tri.p2), i);
                });
            });*/


            socket.on('attendeeKeyframes', function (data) {
                console.log("data", data);
                //drawKeyframes(data.keyframes);
                updateAttendee(data);
            });

            socket.on('elevatorKeyframes', function (data) {
                updateElevator(data);
            });

            socket.on('all', function (data) {
                Object.keys(data.attendees).forEach(function (attendeeId) {
                    attendeeData = data.attendees[attendeeId];
                    updateAttendee(attendeeData);
                });
                console.log("Done.")
            });


            socket.on('sync', function (serverTime) {
                var clientTime = (new Date()).getTime();
                timeOffset = clientTime - serverTime;
                console.log("Time offset: ", timeOffset)
            });


            socket.on('disconnect', function () {
                console.log("socket disconnected");
            });

        });
    }
    init();
});
