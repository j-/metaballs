/**
 * @namespace meta
 */
var meta = {};

/**
 * Reduces a context to a black mask of pixels whose alpha channel is above a given
 * threshold. Does not modify the existing image data, instead returning a new image data.
 * @memberof meta
 * @method meta.threshold
 * @param {CanvasRenderingContext2D} ctx Canvas context to read from
 * @param {number} alpha (0 - 1) Alpha threshold. Values above this threshold will be
 * rendered black and values below this threshold will be transparent.
 * @return {ImageData} New image data containing the thresholded image
 */
meta.threshold = function (ctx, alpha) {
	alpha *= 255;
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;
	var source = ctx.getImageData(0, 0, width, height);
	var dest = ctx.createImageData(width, height);
	for (var i = 3, l = source.data.length; i < l; i += 4) {
		dest.data[i] = source.data[i] > alpha ? 255 : 0;
	}
	return dest;
};

/**
 * Draw a radial gradient at a given point on a given canvas.
 * @memberof meta
 * @method meta.drawRadialGradient
 * @param {CanvasRenderingContext2D} ctx Canvas context to draw on
 * @param {number} x X co-ordinate to center the gradient on
 * @param {number} y Y co-ordinate to center the gradient on
 * @param {number} r1 Radius of the inner circle of the gradient
 * @param {number} r2 Radius of the outer circle of the gradient
 */
meta.drawRadialGradient = function (ctx, x, y, r1, r2) {
	var grad = ctx.createRadialGradient(x, y, r1, x, y, r2);
	grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
	grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
	
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r2, 0, Math.PI * 2, true);
	ctx.closePath();
 	ctx.fillStyle = grad;
	ctx.fill();
	ctx.restore();
};

/**
 * Simple struct which stores a set of ({@link meta.MetaBall#x|x},
 * {@link meta.MetaBall#y|y}) co-ordinates.
 * @memberof meta
 * @constructor
 * @struct
 */
meta.MetaBall = function () { };

meta.MetaBall.prototype = {

	/**
	 * X co-ordinate
	 * @public
	 * @defaultvalue
	 * @type {number}
	 */
	x: 0,

	/**
	 * Y co-ordinate
	 * @public
	 * @defaultvalue
	 * @type {number}
	 */
	y: 0,

	/**
	 * Inner radius of {@link meta.MetaBall|MetaBall}
	 * @public
	 * @defaultvalue
	 * @type {number}
	 */
	r1: 0,

	/**
	 * Outer radius of {@link meta.MetaBall|MetaBall}
	 * @public
	 * @defaultvalue
	 * @type {number}
	 */
	r2: 1,

	/**
	 * Override this function. Return a struct of the form <code>{ x: 0, y: 0 }</code>.
	 * @public
	 * @abstract
	 * @defaultvalue
	 * @return {Object.<string, number>} A struct with x and y values.
	 */
	position: function () {
		return {
			x: 0,
			y: 0
		}
	},

	/**
	 * Takes a numeric time argument and sets the {@link meta.MetaBall|MetaBall}'s
	 * {@link meta.MetaBall#x|x} and {@link meta.MetaBall#y|y} co-ordinates using its
	 * {@link meta.MetaBall#position} function.
	 * @public
	 * @defaultvalue
	 * @param {number} time Unix time
	 */
	update: function (time) {
		var coords = this.position(time);
		this.x = coords.x;
		this.y = coords.y;
	}
};

/**
 * Draw a {@link meta.MetaBall|MetaBall} to a canvas context.
 * @memberof meta
 * @method meta.drawMetaBall
 * @param {CanvasRenderingContext2D} ctx Canvas context to draw on
 * @param {MetaBall} ball Meta ball to draw
 */
meta.drawMetaBall = function (ctx, ball) {
	meta.drawRadialGradient(ctx, ball.x, ball.y, ball.r1, ball.r2);
};