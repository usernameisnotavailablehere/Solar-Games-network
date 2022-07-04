$('#retry').hide();
$('#play').click(start);
$('#prev').hide();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	1,
	10000
);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);

var canvas = $('#canvascontainer').append(renderer.domElement);
var distance = 4;
var started = false;
var percent = 0;
camera.position.set(0, 5, distance);
camera.rotation.x -= 0.75;
var scoreSubmitted = false;
var level = 1;
var data;
var reqId;
$.getJSON('data.json', function(d) {
	data = d;
	data.length = Object.keys(data).length;
	loadLevel(level);
	$('#score').hide();
	$('#level').html('Level ' + level);
	reqId = requestAnimationFrame(render);
	console.clear();
	console.log(
		"If you're interested to look into the source code, it's avaliable here: https://repl.it/@iamcaleblol/WebGL-Rolling-Sky"
	);
});

//start function
function start(e) {
	e.preventDefault();
	if (!started) {
		started = true;
		ball.speed.z = -0.05;
		$('#main').fadeOut(300);
		$('#name').hide();
		reset();
		world.forEach(v => {
			if (v instanceof Bouncer) {
				v.mesh.position.y = 0;
			}
		});
		$('#main').css('pointer-events', 'none');
	}
}
function reset() {
	ball.landed = true;
	ball.tmpZ = 0;
	camera.position.set(0, 5, distance);
	ball.mesh.position.set(0, 0.6, 0);
	ball.speed.y = 0;
	ball.count2Lose = 0;
}
function nextLevel() {
	percent = 0;
	while (
		(selectedObject = scene.getObjectByName('level component')) != undefined
	) {
		var selectedObject = scene.getObjectByName('level component');
		scene.remove(selectedObject);
	}
	world = [];
	level++;
	loadLevel(level);
	reset();
	$('#score').hide();
	$('#level').show();
	$('#level').html('Level ' + level);
	$('#prev').show();
	$('#retry').hide();
	$('#play').show();
	if (level == data.length) {
		$('#next').hide();
	}
}
function prevLevel() {
	percent = 0;
	while (
		(selectedObject = scene.getObjectByName('level component')) != undefined
	) {
		var selectedObject = scene.getObjectByName('level component');
		scene.remove(selectedObject);
	}
	world = [];
	level--;
	loadLevel(level);
	reset();
	$('#score').hide();
	$('#level').show();
	$('#level').html('Level ' + level);
	$('#next').show();
	$('#retry').hide();
	$('#play').show();
	if (level == 1) {
		$('#prev').hide();
	}
}
// Da things
var light = new THREE.HemisphereLight(0xeeeeee, 0x777777);
scene.add(light);
var world = [];
function loadLevel(index) {
  renderer.setClearColor(parseInt(data[index].background));
  ball.mesh.material.color.setHex(parseInt(data[index].ball));
	for (var i in data[index].data) {
		for (var j in data[index].data[i]) {
			switch (data[index].data[i][j]) {
				case 1:
					world.push(new Mat(j - 2, -i, data[index].mat));
					break;
				case 2:
					world.push(new Bouncer(j - 2, -i, data[index].bouncer));
					break;
				case 3:
					world.push(new Mat(j - 2, -i, data[index].mat));
					world.push(new Obstacle(j - 2, -i, data[index].obstacle));
			}
		}
	}
}

var ball = new Ball();

keystate = [];
//Loop function
var render = function() {
	renderer.render(scene, camera);
	ball.update();
	percent = Math.ceil(
		Math.abs(ball.mesh.position.z) / data[level].data.length * 100
	);
	percent = percent > 100 ? 100 : percent;
	$('#percent').html(percent + '%');
	if (keystate[37]) ball.mesh.position.x -= 0.15;
	if (keystate[39]) ball.mesh.position.x += 0.15;
	reqId = requestAnimationFrame(render);
};

//controls

function gameover() {
	started = false;
	ball.speed.z = 0;
	$('#main').fadeIn(500);
	$('#retry').show();
	$('#retry').click(start);
	$('#level').hide();
	$('#score').show();
	$('#score').html($('#percent').html());
	$('#main').css('pointer-events', 'auto');
}
