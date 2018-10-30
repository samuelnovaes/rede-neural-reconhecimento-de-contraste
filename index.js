const panel1 = document.querySelector('#panel1')
const panel2 = document.querySelector('#panel2')
const panelResult = document.querySelector('#panel-result')
const btnTrain = document.querySelector('#btn-train')
const btnColor = document.querySelector('#btn-color')
const btnBack = document.querySelector('#btn-back')
const trainContainer = document.querySelector('#train-container')
const resultContainer = document.querySelector('#result-container')
const loadingContainer = document.querySelector('#loading-container')
const loader = document.querySelector('#loader')

const net = new brain.NeuralNetwork()
const data = []

const randomColor = () => {
	const r = Math.random()
	const g = Math.random()
	const b = Math.random()
	return { r, g, b }
}

const applyColor = (color) => {
	const rgbColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
	panel1.style.backgroundColor = rgbColor
	panel2.style.backgroundColor = rgbColor
	panelResult.style.backgroundColor = rgbColor
}

const chooseColor = () => {
	const color = randomColor()
	applyColor(color)

	panel1.onclick = () => {
		data.push({ input: color, output: { black: 1, white: 0 } })
		chooseColor()
	}

	panel2.onclick = () => {
		data.push({ input: color, output: { white: 1, black: 0 } })
		chooseColor()
	}
}

const runNetwork = (color) => {
	const result = net.run(color)
	applyColor(color)
	if ((result.black || 0) > (result.white || 0)) {
		resultContainer.style.color = 'black'
	}
	else {
		resultContainer.style.color = 'white'
	}
}

const toRGB = (hex) => {
	const rgbArray = hex.replace(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i, m => {
		return [
			parseInt(RegExp.$1, 16) / 255,
			parseInt(RegExp.$2, 16) / 255,
			parseInt(RegExp.$3, 16) / 255
		]
	}).split(',')
	return {
		r: rgbArray[0],
		g: rgbArray[1],
		b: rgbArray[2]
	}
}

btnTrain.onclick = () => {
	if (data.length != 0) {
		trainContainer.style.display = 'none'
		loadingContainer.style.display = 'block'

		net.trainAsync(data, {
			errorThresh: 0.005,
			iterations: 9000,
			callback(status) {
				const percent = Math.round((100 * (status.error - 1)) / (this.errorThresh - 1))
				loader.value = percent
			}
		}).then(() => {
			loadingContainer.style.display = 'none'
			resultContainer.style.display = 'block'
			runNetwork(toRGB('#000000'))
		})
	}
	else alert('Selecione algumas cores primeiro!')
}

btnBack.onclick = () => {
	resultContainer.style.display = 'none'
	trainContainer.style.display = 'block'
}

btnColor.onchange = () => {
	runNetwork(toRGB(btnColor.value))
}

chooseColor()