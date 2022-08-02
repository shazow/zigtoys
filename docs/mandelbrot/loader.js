request = new XMLHttpRequest();
request.open('GET', 'mandelbrot.wasm');
request.responseType = 'arraybuffer';
request.send();

var wasm_loaded = false;

request.onload = function() {
	var bytes = request.response;
	WebAssembly.instantiate(bytes, {
		env: {
			print: (result) => { console.log(`The result is ${result}`); }
		}
	}).then(result => {
		const get_pixel_color = result.instance.exports.get_pixel_color;
		wasm_loaded = true;
	});
};

if (!wasm_loaded)
	throw Error("Wasm failed to load");

// create a running body of code
(function(){
	var cnv = window.document.getElementById("canvas");
	var ctx = cnv.getContext("2d");

	for (var i = 0; i < cnv.width; i++) {
		for (var j = 0; j < cnv.height; j++) {
			var iters = get_pixel_color(i, j);
			ctx.fillStyle = "rgb(" + iters +", "+iters+", "+iters+")";
			ctx.fillRect(i, j, 1, 1);
		}
	}
})();
