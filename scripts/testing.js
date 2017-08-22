var hit = false;
var poly = [];
function setup() {
	createCanvas(windowWidth,windowHeight);
	collideDebug(true)
	poly[0] = createVector(123,231);     // set X/Y position
	poly[1] = createVector(10,111);
	poly[2] = createVector(20,23);
	poly[3] = createVector(390,33);
}

function draw() {
	background(255);

  //draw the polygon from the created Vectors above.
	beginShape();
	for(i=0; i < poly.length; i++){
		vertex(poly[i].x,poly[i].y);
	}
	endShape(CLOSE);

	ellipse(mouseX,mouseY,45,45);

	hit = collideCirclePoly(mouseX,mouseY,45,poly);
	//enable the hit detection if the circle is wholly inside the polygon
	// hit = collideCirclePoly(mouseX,mouseY,45,poly,true);

	print("colliding? " + hit);
}
