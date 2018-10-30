'use strict';

var panel1 = document.querySelector('#panel1');
var panel2 = document.querySelector('#panel2');
var panelResult = document.querySelector('#panel-result');
var btnTrain = document.querySelector('#btn-train');
var btnColor = document.querySelector('#btn-color');
var btnBack = document.querySelector('#btn-back');
var trainContainer = document.querySelector('#train-container');
var resultContainer = document.querySelector('#result-container');
var loadingContainer = document.querySelector('#loading-container');
var loader = document.querySelector('#loader');

var net = new brain.NeuralNetwork();
var data = [];

var randomColor = function randomColor() {
	var r = Math.random();
	var g = Math.random();
	var b = Math.random();
	return { r: r, g: g, b: b };
};

var applyColor = function applyColor(color) {
	var rgbColor = 'rgb(' + color.r * 255 + ', ' + color.g * 255 + ', ' + color.b * 255 + ')';
	panel1.style.backgroundColor = rgbColor;
	panel2.style.backgroundColor = rgbColor;
	panelResult.style.backgroundColor = rgbColor;
};

var chooseColor = function chooseColor() {
	var color = randomColor();
	applyColor(color);

	panel1.onclick = function () {
		data.push({ input: color, output: { black: 1, white: 0 } });
		chooseColor();
	};

	panel2.onclick = function () {
		data.push({ input: color, output: { white: 1, black: 0 } });
		chooseColor();
	};
};

var runNetwork = function runNetwork(color) {
	var result = net.run(color);
	applyColor(color);
	if ((result.black || 0) > (result.white || 0)) {
		resultContainer.style.color = 'black';
	} else {
		resultContainer.style.color = 'white';
	}
};

var toRGB = function toRGB(hex) {
	var rgbArray = hex.replace(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i, function (m) {
		return [parseInt(RegExp.$1, 16) / 255, parseInt(RegExp.$2, 16) / 255, parseInt(RegExp.$3, 16) / 255];
	}).split(',');
	return {
		r: rgbArray[0],
		g: rgbArray[1],
		b: rgbArray[2]
	};
};

btnTrain.onclick = function () {
	if (data.length != 0) {
		trainContainer.style.display = 'none';
		loadingContainer.style.display = 'block';

		net.trainAsync(data, {
			errorThresh: 0.005,
			iterations: 9000,
			callback: function callback(status) {
				var percent = Math.round(100 * (status.error - 1) / (this.errorThresh - 1));
				loader.value = percent;
			}
		}).then(function () {
			loadingContainer.style.display = 'none';
			resultContainer.style.display = 'block';
			runNetwork(toRGB('#000000'));
		});
	} else alert('Selecione algumas cores primeiro!');
};

btnBack.onclick = function () {
	resultContainer.style.display = 'none';
	trainContainer.style.display = 'block';
};

btnColor.onchange = function () {
	runNetwork(toRGB(btnColor.value));
};

chooseColor();
