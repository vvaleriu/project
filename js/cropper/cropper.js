/**
 * Created by vincent on 24/08/16.
 *
 * SIMPLE FIXED SIZE JAVASCRIPT CROPPER
 *
 */

/* GLOBALS */
const MIN_CROPPED_SIZE = 30;

function getMousePos(canvas, evt) {
	var canvPos = canvas.getBoundingClientRect();

	return {
		x: evt.clientX - canvPos.left,
		y: evt.clientY - Math.floor(canvPos.top)
	};
}

/**
 * @param x: x coordonnees de la zone a verifier
 * @param y: y coordonnees de la zone a verifier
 * @param width: largeur de la zone
 * @param height: longueur de la zone
 * @param pos: {x, y} position a verifier
* */
function isOnPosition(x, y, width, height, pos) {
	return (pos.x >= x && pos.x <= (x + width) &&
		pos.y >= y && pos.y <= (y + height));
}
/*
* SHAPE
* */
class Shape {
	constructor(attr) {
		if (attr && typeof attr != "object")
			throw "constructor error, attribute must be an object";
		this.x = attr.x || 0; // position du pixel d'abscisse de depart
		this.y = attr.y || 0; // position du pixel d'ordonnee de depart
		this.offx = 0; // offset X lors d'une selection a la souris
		this.offy = 0; // offset Y lors d'une selection a la souris
		this.height = attr.height || 0; // hauteur
		this.width = attr.width || 0; // largeur
		this.ctx = attr.ctx || null; // reference vers le contexte principal
		this.type = this.constructor.name || "Shape"; // nom de la classe
		this.mycanvas = attr.mycanvas || null; //reference vers le canvas principal
		this.moved = false; // l'objet est selectionne a la souris pour etre bouge
		// resized;1: haut gauche, 2: haut droite, 3: bas gauche, 4: bas droite
		this.resized = 0; // l'objet est selectionne pour etre redimensionne
		this.color = attr.color || "#00000000";
		this.strokeColor = attr.strokeColor || "blue";
		this.resizerColor = attr.resizerColor || "blue";
		this.alpha = attr.alpha || 0.15;
		this.resizeSelectionMargin = attr.resizeSelectionMargin || 10;
		this.ratio = attr.ratio || 1;
	}

	draw() {
		console.log("this class has to override draw.");
	}

	clear() {
		this.ctx.clearRect(this.x, this.y, this.width, this.height);
	}

	info() {
		console.log(`x,y: (${this.x}, ${this.y}); offset: (${this.offx},${this.offy}); w,h: (${this.width},${this.height}); ratio: (${this.width / this.height})`);
	}

	isOnSelection(pos) {
		//gauche
		if (isOnPosition(this.x - this.resizeSelectionMargin, this.y + (this.height / 2) - this.resizeSelectionMargin,
				this.resizeSelectionMargin * 2, this.resizeSelectionMargin * 2, pos)) {
			this.resized = 1;
			this.offx = pos.x - this.x;
			this.offy = pos.y - this.y;
			return true;
		} // droite
		if (isOnPosition(this.x + this.width - this.resizeSelectionMargin,
				this.y + (this.height / 2) - this.resizeSelectionMargin, this.resizeSelectionMargin * 2, this.resizeSelectionMargin * 2, pos)) {
			this.resized = 2;
			this.offx = pos.x - this.x;
			this.offy = pos.y - this.y;
			return true;
		}

		// Sinon on est sur la zone de deplacement
		if (isOnPosition(this.x, this.y, this.width, this.height, pos)) {
			this.offx = pos.x - this.x;
			this.offy = pos.y - this.y;
			this.moved = true;
			return true;
		}
		return false;
	}
}

/*
 * IMAGESHAPE
 * */
class ImageShape extends Shape {
	constructor(prop) {
		super(prop || {});
		this.image = new Image();
		this.image.onload = () => {
			this.setRatio();
			this.mycanvas.toRedraw = true;
		};
		if (prop && prop.hasOwnProperty("path"))
			this.image.src = prop.path;
	}

	setRatio() {
		this.yRatio = 1;
		this.xRatio = 1;
		this.ratio = this.image.naturalWidth / this.image.naturalHeight; // ratio de l'image
		let scaleRatio; // ratio de mise a l'echelle

		if (this.image.naturalWidth <= this.mycanvas.width && this.image.naturalHeight <= this.mycanvas.height) {
			this.width = this.image.naturalWidth;
			this.height = this.image.naturalHeight;
			this.ratio = 1;
			this.x = (this.mycanvas.width - this.width) / 2;
			this.y = (this.mycanvas.height - this.height) / 2;
			return;
		}
		if (this.ratio === 1) {
			this.width = Math.min(this.mycanvas.height, this.mycanvas.width);
			this.height = this.width;
		}
		else if (this.ratio < 1) {
			scaleRatio = this.mycanvas.height / this.image.naturalHeight;
			this.height = this.mycanvas.height;
			this.width = this.image.naturalWidth * scaleRatio;
			if (this.width > this.mycanvas.width) {
				scaleRatio = this.mycanvas.width / this.image.naturalWidth;
				this.width = this.mycanvas.width;
				this.height = this.image.naturalHeight * scaleRatio;
			}
		}
		else if (this.ratio > 1) {
			scaleRatio = this.mycanvas.width / this.image.naturalWidth;
			this.width = this.mycanvas.width;
			this.height = this.image.naturalHeight * scaleRatio;
			if (this.height > this.mycanvas.height) {
				scaleRatio = this.mycanvas.height / this.image.naturalHeight;
				this.height = this.mycanvas.height;
				this.width = this.image.naturalWidth * scaleRatio;
			}
		}
		this.x = this.width === this.mycanvas.width ? 0 : (this.mycanvas.width - this.width) / 2;
		this.y = this.height === this.mycanvas.height ? 0 : (this.mycanvas.height - this.height) / 2;
	}

	draw() {
		if (this.image.src.length === 0)
			return;
		this.ctx.globalAlpha = 1;
		this.ctx.drawImage(this.image,
			0, 0,
			this.image.naturalWidth, this.image.naturalHeight,
			this.x, this.y,
			this.width, this.height
		);
		//this.ctx.drawImage(this.image, this.x, this.y);
	}
}

/*
* RECTSHAPE
* */
class RectShape extends Shape {
	constructor(attr) {
		super(attr);
		this.resizerSelectionSize = attr.resizerSelectionSize || 5; // taille des petits carre de selection de redimensionnement
		this.ratio = attr.ratio || (16 / 9);
		this.height = this.width / this.ratio;
		if (this.width > this.mycanvas.width) {
			this.width = this.mycanvas.width;
			this.height = this.width / this.ratio;
			if (this.height > this.mycanvas.height) {
				this.height = this.mycanvas.height;
				this.width = this.height * this.ratio;
			}
		}
		else if (this.height > this.mycanvas.height) {
			this.height = this.mycanvas.height;
			this.width = this.height * this.ratio;
			if (this.width > this.mycanvas.width) {
				this.width = this.mycanvas.width;
				this.height = this.width / this.ratio;
			}
		}
		this.height = Math.floor(this.width / this.ratio);
	}

	isCoordValid(newX, newY, newWidth, newHeight) {
		/*console.log(`newX >= 0: ${newX >= 0}`);
		console.log(`newX <= this.mycanvas.width - MIN_CROPPED_SIZE: ${newX <= this.mycanvas.width - MIN_CROPPED_SIZE}`);
		console.log(`newY >= 0: ${newY >= 0}`);
		console.log(`newY <= this.mycanvas.height - MIN_CROPPED_SIZE / this.ratio: ${newY <= this.mycanvas.height - MIN_CROPPED_SIZE / this.ratio}`);
		console.log(`newWidth >= MIN_CROPPED_SIZE: ${newWidth >= MIN_CROPPED_SIZE}`);
		console.log(`newWidth <= this.width - this.x: ${newWidth <= this.mycanvas.width - newX}`);
		console.log(`newHeight >= MIN_CROPPED_SIZE / this.ratio: ${newHeight >= MIN_CROPPED_SIZE / this.ratio}`);
		console.log(`newHeight <= this.height - this.y: ${newHeight <= this.mycanvas.height - newY}`);*/
		return (
			newX >= 0 && newX <= this.mycanvas.width - MIN_CROPPED_SIZE &&
			newY >= 0 && newY <= this.mycanvas.height - MIN_CROPPED_SIZE / this.ratio &&
			newWidth >= MIN_CROPPED_SIZE && newWidth <= this.mycanvas.width - newX &&
			newHeight >= MIN_CROPPED_SIZE / this.ratio && newHeight <= this.mycanvas.height - newY
		)
	}

	move(pos) {
		this.x = pos.x - this.offx;
		if (this.x < 0)
			this.x = 0;
		if (this.x + this.width > this.mycanvas.width)
			this.x = this.mycanvas.width - this.width;
		this.y = pos.y - this.offy;
		if (this.y < 0)
			this.y = 0;
		if (this.y + this.height > this.mycanvas.height)
			this.y = this.mycanvas.height - this.height;
	}

	resize(pos) {
		let deltaX;
		let newX;
		let newY;
		let newWidth;
		let newHeight;

		if (this.resized === 1) { // redimensionnement gauche
			deltaX = pos.x - this.x;
			newWidth = this.width - deltaX;
			newY = this.y * (newWidth / this.width);
			newHeight = newWidth / this.ratio;
			newX = this.x + deltaX;
			if (this.isCoordValid(newX, newY, newWidth, newHeight) === true) {
				this.x = newX;
				this.y = newY;
				this.width = newWidth;
				this.height = newHeight;
			}
		}
		else if (this.resized === 2) { // redimensionnement droit
			deltaX = pos.x - this.x - this.width;
			newWidth = this.width + deltaX;
			newHeight = newWidth / this.ratio;
			if (this.isCoordValid(this.x, this.y, newWidth, newHeight) === true) {
				this.width = newWidth;
				this.height = newHeight;
			}
		}
	}

	/*draw() {
		this.ctx.strokeStyle = this.strokeColor;
		this.ctx.fillStyle = this.color;
		this.ctx.globalAlpha = this.alpha;
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
		this.ctx.strokeRect(this.x, this.y, this.width, this.height);
		this.ctx.globalAlpha = 1;
		this.ctx.fillStyle = this.resizerColor;
		// Rectangle de selection du resize
		//gauche
		this.ctx.fillRect(this.x - this.resizerSelectionSize, this.y + (this.height / 2) - this.resizerSelectionSize ,
			this.resizerSelectionSize * 2, this. resizerSelectionSize * 2);
		// droite
		this.ctx.fillRect(this.x + this.width - this.resizerSelectionSize, this.y + (this.height / 2) - this.resizerSelectionSize ,
			this.resizerSelectionSize * 2, this. resizerSelectionSize * 2);
	}*/
	draw() {
		this.ctx.strokeStyle = this.strokeColor;
		this.ctx.fillStyle = this.color;
		this.ctx.globalAlpha = this.alpha;
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
		this.ctx.strokeRect(this.x, this.y, this.width, this.height);
		this.ctx.globalAlpha = 1;
		this.ctx.fillStyle = this.resizerColor;
		// Rectangle de selection du resize
		//gauche
		this.ctx.fillRect(this.x - this.resizerSelectionSize, this.y + (this.height / 2) - this.resizerSelectionSize ,
			this.resizerSelectionSize * 2, this. resizerSelectionSize * 2);
		// droite
		this.ctx.fillRect(this.x + this.width - this.resizerSelectionSize, this.y + (this.height / 2) - this.resizerSelectionSize ,
			this.resizerSelectionSize * 2, this. resizerSelectionSize * 2);
	}
}

/**
 * @param id: id de l'element canvas
 * @param imagePath (opt): chemin de l'image initiale si desiree
 * */
class MyCanvas {
	constructor(id, prop) {
		if (!id)
			console.log("Id can't be null");
		this.canvas = document.getElementById(id);
		if (this.canvas) {
			this.ctx = this.canvas.getContext("2d");
			this.height = this.canvas.height || 400;
			this.width = this.canvas.width || 600;
			this.shapes = [];
			this.toRedraw = true;
			this.interval = prop.interval || 30;
			this.realtime = prop.realtime || true;
			this.previewId = prop.previewId || null;
			if (this.previewId && !(document.getElementById(this.previewId) instanceof HTMLImageElement))
				this.previewId = null;

			this.ctx.fillStyle = "#F0F8FF";
			this.ctx.strokeStyle = "blue";

			this.canvas.addEventListener("mousedown", (evt) => {
				let pos = getMousePos(this.canvas, evt);
				console.log(`mouse(${pos.x},${pos.y}). isOnSelection: ${this.shapes[1].isOnSelection(pos)}`);
				this.shapes[1].isOnSelection(pos);
			}, false);

			this.canvas.addEventListener("mousemove", (evt) => {
				let pos = getMousePos(this.canvas, evt);
				if (this.shapes[1].moved === true) {
					this.shapes[1].move(pos);
					this.toRedraw = true;
				}
				else if (this.shapes[1].resized != 0) {
					this.shapes[1].resize(pos);
					this.toRedraw = true;
				}
			}, false);

			this.canvas.addEventListener("mouseup", (evt) => {
				this.shapes[1].moved = false;
				this.shapes[1].resized = 0;
			}, false);

			this.addImage(prop.image || {});
			this.addCropper(prop.cropper || {});

			setInterval(() => {
				this.draw();
			}, this.interval);
		}
	}

	addImage(prop) {
		this.shapes.push(new ImageShape(
			Object.assign(prop, {ctx: this.ctx,	mycanvas: this})));
	}

	addCropper(prop) {
		this.shapes.push(
			new RectShape(Object.assign({
				x: prop.x || 0,	y: prop.y || 0,
				width: prop.width || this.width,	height: prop.height || this.height,
				ctx: this.ctx,
				mycanvas: this
			}, prop)));
	}

	/**
	 * Recoit :
	 * - directement une string litterale correspondant a la source de l'image
	 * (ie: lorsquon rentre directement l'url de l'image
	 * OU
	 * - un objet evenement declanche lorsque l'utilisateur importe une image de
	 * de son disc
	 * OU
	 * - un object File directement
	 * */
	uploadImage(e) {
		if (typeof e === "string") {
			this.shapes[0].image.src = e;
			return;
		}

		let reader = new FileReader();
		reader.onload = (event) => {
			this.shapes[0].image.src = event.target.result;
		};
		if (e.target)
			reader.readAsDataURL(e.target.files[0]);
		else
			reader.readAsDataURL(e);
	}

	draw() {
		if (this.toRedraw === true) {
			this.clear();
			let len = this.shapes.length;
			let i = -1;
			while (++i < len) {
				if (this.shapes[i] instanceof Shape)
					this.shapes[i].draw();
			}
			this.toRedraw = false;
			if (this.previewId || this.realtime === true)
				this.crop();
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	crop() {
		let bufCanvas = document.createElement('canvas');
		let bufCtx = bufCanvas.getContext('2d');

		bufCanvas.width = this.shapes[1].width;
		bufCanvas.height = this.shapes[1].height;
		bufCtx.drawImage(this.canvas, this.shapes[1].x, this.shapes[1].y,
			this.shapes[1].width, this.shapes[1].height,
			0, 0, bufCanvas.width, bufCanvas.height);
		/*bufCanvas.width = this.shapes[1].width;
		bufCanvas.height = this.shapes[1].height;
		bufCtx.drawImage(this.shapes[0].image,
			this.shapes[1].x - this.shapes[0].x, this.shapes[1].y - this.shapes[0].y,
			this.shapes[1].width * (this.shapes[0].image.naturalWidth / this.shapes[0].width), this.shapes[1].height * (this.shapes[0].image.naturalWidth / this.shapes[0].width) ,
			0, 0, bufCanvas.width, bufCanvas.height);*/

		let image = document.getElementById(this.previewId);

		document.getElementById(this.previewId).src = bufCanvas.toDataURL("image/png");
	}
}

