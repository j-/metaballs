/** @const */ var NUM_BALLS = 10;
/** @const */ var TIME_DILATION = 2000;
/** @const */ var CANVAS_WIDTH = 500;
/** @const */ var CANVAS_HEIGHT = 500;
/** @const */ var ALPHA_THRESHOLD = 0.5;
/** @const */ var SPIROGRAPH_RADIUS = 10;
/** @const */ var SCALE_FACTOR = 20;
/** @const */ var METABALL_INNER_RADIUS_MIN = 0;
/** @const */ var METABALL_INNER_RADIUS_MAX = 1;
/** @const */ var METABALL_OUTER_RADIUS_MIN = 2;
/** @const */ var METABALL_OUTER_RADIUS_MAX = 4;

/**
 * Generate a spirograph function.
 * @tutorial spirograph
 * @param {number} r Radius of the spirograph
 * @param {number} k (0 - 1) Ratio of inner circle to outer circle.
 * @param {number} l (0 - 1) Hole distance from center of inner circle.
 * @return {function(number): { x: number, y: number }} Spirograph function. Takes a
 * timestamp and returns a set of x and y coordinates representing the position of the
 * spirograph at this point in time.
 */
var spirograph = function (r, k, l) {
	return function (t) {
		return {
			x: r * ((1 - k) * Math.cos(t) + l * k * Math.cos((1 - k) / k * t)),
			y: r * ((1 - k) * Math.sin(t) + l * k * Math.sin((1 - k) / k * t))
		};
	};
};

// create an array of metaballs
var balls = (function () {
	var balls = [];
	var metaballInnerRadiusSize = METABALL_INNER_RADIUS_MAX - METABALL_INNER_RADIUS_MIN;
	var metaballOuterRadiusSize = METABALL_OUTER_RADIUS_MAX - METABALL_OUTER_RADIUS_MIN;
	
	var i, ball;
	for (i = 0; i < NUM_BALLS; i++) {
		ball = new meta.MetaBall;
		ball.position = (function () {
			var fn = spirograph(SPIROGRAPH_RADIUS, Math.random(), Math.random());
			var speed = (Math.random() * 2 - 1) / TIME_DILATION;
			return function (time) {
				time *= speed;
				return fn(time);
			};
		})();
		ball.r1 = METABALL_INNER_RADIUS_MIN + Math.random() * metaballInnerRadiusSize;
		ball.r2 = METABALL_OUTER_RADIUS_MIN + Math.random() * metaballOuterRadiusSize;
		balls.push(ball);
	};
	
	return balls;
})();

var requestAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame;

var start = window.mozAnimationStartTime || Date.now() || (new Date).getTime();

var canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var ctx = canvas.getContext('2d');
ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
ctx.scale(SCALE_FACTOR, SCALE_FACTOR);

// main loop
(function (time) {
	ctx.clearRect(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	for (var i = 0; i < NUM_BALLS; i++) {
		var ball = balls[i];
		ball.update(time);
		meta.drawMetaBall(ctx, ball);
	}

	var id = meta.threshold(ctx, ALPHA_THRESHOLD);
	ctx.putImageData(id, 0, 0);
	
	requestAnimationFrame(arguments.callee);
})(start);

document.addEventListener('DOMContentLoaded', function () {
	document.body.appendChild(canvas);
});