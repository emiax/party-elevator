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

    // Here we run a very simple test of the Graph API after login is successful.
    // This testAPI() function is only called in those cases.
    /*    function testAPI() {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
          console.log('Good to see you, ' + response.name + '.');
          console.log(response);
          var img_link = "http://graph.facebook.com/"+response.id+"/picture";
          $("#placeholder").append($('<img src="' + img_link + '"/>'));
          });
          }*/

    FacebookConnector.init(onLogin);
    var socket = io.connect(':8081');

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


    function elementOfAttendee(attendeeId) {
        var $element = $("#attendee" + attendeeId);
        if (!$element.length) {
            $element = $('<div class="attendee" id="attendee' + attendeeId + '"></div>');
            $("#attendeeContainer").append($element);
            console.log("YO!");
        }
        return $element;
    }


    function updateAttendee(data) {
        var $elem = elementOfAttendee(data.id);
        $elem.stop(true);


        var fbId = data.fbId;
        $elem.attr('src', "http://graph.facebook.com/" + fbId + "/picture");

        var lastKeyframeTime = new Date().getTime() - timeOffset;
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
            
            animate({
                attendeeElement: $elem,
                targetCoords: { x: projected.x, y: projected.y },
                duration: duration
            })
            console.log('data.id: ' + data.id   )
            

            lastKeyframeTime = keyframe.time;
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

    function init() {
        $("#chat").submit(function (evt) {
            var message = $("#chatMessage").val();
            socket.emit('chat', message)
            evt.preventDefault();
        });

        socket.on('chat', function (data) {
            var attendeeId = data.attendee;
            var message = data.message;
            console.log(message);
        });

        socket.on('connect', function () {
            console.log("socket connected");

            $('#map').click(function (evt) {
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


            socket.on('drawTriangles', function (triangles) {
                ctx.clearRect(0, 0, 1000, 1000);
                triangles.forEach(function (tri, i) {
                    drawTriangle(Projector.project(tri.p0), Projector.project(tri.p1), Projector.project(tri.p2), i);
                });
            });


            socket.on('attendeeKeyframes', function (data) {
                console.log("data", data);
                drawKeyframes(data.keyframes);
                updateAttendee(data);
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
