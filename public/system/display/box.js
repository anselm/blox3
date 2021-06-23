



/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}



///
/// Box
///
///		- a grouping concept for 2d
///		- should do transform hierarchies
///		- also can paint images and text and borders
///		- may have a layout engine too
///		- doesn't have to paint anything however
///

export class Box extends Node {

	ontick() {

		// do children - should clip
		super.ontick()

		this.paint();
	}

	paint() {

		// TODO - display is a real thing, but, can we assert that it is present or should we query for it?
		let c = Node.root().display.context

		let props = this
		let x = props.xyz.x;
		let y = props.xyz.y;
		let w = props.whd.x;
		let h = props.whd.y;
		let r = 5
		let fill = props.fill_style
		let stroke = props.stroke_style

		// just don't paint anything
		if(!fill && !stroke) return

		c.save()

		// rotate in place
		c.translate(x+w/2, y+h/2)
		c.rotate(props.ypr.z)
		c.translate(-x-w/2,-y-h/2)

		// do box style
		c.strokeStyle = props.stroke_style
		c.fillStyle = props.fill_style
		roundRect(c, x, y, w, h, r, fill, stroke) ;

		// set cliper
		c.beginPath()
		c.rect(x,y,w,h)
		c.clip()

		// do text as part of box - center it
		c.font = props.text_font
		let metrics = c.measureText(props.text)
		let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
		let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		x = x + w/2
		y = y + h/2
		y = y + fontHeight / 4
		x -= metrics.width / 2

		c.fillStyle=props.text_style
		c.fillText(props.text,x,y)


		// done
		c.restore()


	}
}