"use strict";

function initField(field) {
	const ball = field.querySelector('.ball');

	move(199, 149);

	function move (x, y) {

		x-= ball.offsetWidth / 2;
		y-= ball.offsetHeight / 2;

		const maxX = field.clientWidth - ball.offsetWidth;
		const maxy = field.clientHeight - ball.offsetHeight;

		if (x < 0) x = 0;
		if (y < 0) y = 0;

		if (x > maxX) x = maxX;
		if (y > maxy) y = maxy;

		console.log(x, y);

		ball.style.left = `${x}px`;
		ball.style.top = `${y}px`;
	};
}

const fields = [...document.querySelectorAll('.field')];

for (const field of fields) {
	initField(field)
}


