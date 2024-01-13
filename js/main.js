let fpscalc = 0;
let projs = []
let susdata = [];
let timeShift = 0 
let nothing = "c"+"u"+"m"
let ignorekeys = [32,37,38,39,40];
let running = true;
const STARTFORMULA = "255<<c+t/40"
fetch("/static/lesus.json")
  .then((resp) => resp.json())
  .then((out) => {susdata=out})


function loadproj() {
  document.getElementById("projects").innerHTML = "Loading.";
  let json = projs;/*let json = JSON.parse(projs);*/
  document.getElementById("projects").innerHTML = "<b>JSArt Library</b><br>";
  for (i = 0; i < json.length; i++) {
    let proj = json[i];
    let trybtn = document.createElement("button");
    trybtn.innerHTML = "Try";
    trybtn.setAttribute("onclick", "document.getElementById('formula').value=projs[" + i + "].code;parse();document.querySelector('canvas#canvas').scrollIntoView({behavior:'smooth', block:'center'});")
    document.getElementById("projects").innerHTML += '<br>"' + proj.name + '" by ' + proj.owner + " ";
    document.getElementById("projects").appendChild(trybtn);
  }
  // document.getElementById("projects").innerHTML += "<br><i>Without functions</i>";
  // for (i = 0; i < json.nofunc.length; i++) {
  //   let proj = json.nofunc[i];
  //   let trybtn = document.createElement("button");
  //   trybtn.innerHTML = "Try";
  //   trybtn.setAttribute("onclick", "document.getElementById('formula').value=projs.nofunc[" + i + "].code;parse();document.querySelector('canvas#canvas').scrollIntoView({behavior:'smooth', block:'center'});")
  //   document.getElementById("projects").innerHTML += '<br>"' + proj.name + '" by ' + proj.owner + " ";
  //   document.getElementById("projects").appendChild(trybtn);
  // }
}

var canvas, ctx, pixels, width, height, mouseX = 0,
  mouseY = 0;
var mouseDown = 0;
var keyvents = 0;

function random() {
  return Math.random()
}

function randomCol() {
  return Math.round(random() * 0xffffff)
}

function CalculateC(x, y) {
  let ox = x - width / 2
  let oy = y - height / 2
  let mx = -(width / 2)
  let my = -(height / 2)
  let dist = Math.sqrt((ox ** 2) + (oy ** 2))
  let max = Math.sqrt((mx ** 2) + (my ** 2))
  let out = max - dist
  if (out > 256) {
    out = 255
  }
  return [out, dist]
}

Array.prototype.random = function() {
  return this[Math.floor(random() * this.length)]
};
var funct = function() { };

function p5map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

function resize() {
  canvas.width = width = parseInt(document.getElementById("width").value), canvas.height = height = parseInt(document.getElementById("height").value), pixels = ctx.createImageData(width, height)
}

function generate() {
  var e = parseInt(document.getElementById("length").value);
  //document.getElementById("length-random").checked ? document.getElementById("formula").value = genForm(Math.floor(random() * (e - 1)) + 1) : document.getElementById("formula").value = genForm(e), parse()
  document.getElementById("formula").value = STARTFORMULA; parse();
}

function parse() {
  var e = document.getElementById("formula").value;
  window.location.hash = encodeURIComponent(e);
  try {
    funct = new Function("i", "t", "x", "y", "mx", "my", "sw", "sh", "r", "sus", "c", "ic",nothing,"cl","k", "return " + e)
		// timeShift = Date.now()
  } catch (e) {
    console.log(e)
  }
}
window.addEventListener("load", (function() {
  fetch("/static/projects.json").then((resp)=>resp.json()).then((out)=>{projs=out;loadproj();});
  (canvas = document.getElementById("canvas")).style.zoom = 2, ctx = canvas.getContext("2d"), resize(), window.location.hash ? (document.getElementById("formula").value = decodeURIComponent(window.location.hash.slice(1)), parse()) : generate(), window.addEventListener("mousemove", (function(e) {
    var t = canvas.getBoundingClientRect();
    mouseX = (e.pageX - 2 * t.x) / 2, mouseY = (e.pageY - 2 * t.y) / 2
  })), document.getElementById("advanced").addEventListener("click", (function() {
    document.getElementById("options").classList.toggle("hidden")
  })), document.getElementById("formula").addEventListener("input", (function() {
    parse()
  })), document.getElementById("width").addEventListener("input", resize), document.getElementById("height").addEventListener("input", resize), genImg()
	window.addEventListener("mousedown",(e)=>{
		mouseDown = 1
	})
	window.addEventListener("mouseup",(e)=>{
		mouseDown = 0
	})
	window.addEventListener("touchstart",(e)=>{
		mouseDown = 1
	})
	window.addEventListener("touchend",(e)=>{
		mouseDown = 0
	})
	window.addEventListener("keyup",(e)=>{
		keyvents = 0
	});
	document.querySelector("button#playBtn").addEventListener("click",()=>{
		running=!running;
		if(running){genImg();}
	},true)
	document.querySelector("button#stepBtn").addEventListener("click",()=>{
		if(running){genImg();}
	},true)
	window.addEventListener("keydown",(e)=>{
		if (ignorekeys.includes(e.keyCode)&&document.activeElement.id != "formula"){
			e.preventDefault()
		}
		keyvents = e.keyCode
	})
}));
var operators = ["+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>"];

function genForm(e) {
  if (1 == e) return random() >= parseFloat(document.getElementById("operand-ratio").value) ? Math.floor(100 * random()) : random() >= parseFloat(document.getElementById("variable-ratio").value) ? "i" : "t";
  var t = Math.floor(random() * (e - 1)) + 1,
    n = genForm(t) + operators[Math.floor(random() * operators.length)] + genForm(e - t);
  return random() >= parseFloat(document.getElementById("bracket-chance").value) ? n : "(" + n + ")"
}

function genImg() {
  let fps = Math.floor(1000 / (Date.now() - fpscalc));
  document.getElementById("fps").innerHTML = fps + " fps" + " <font color='red'>WARNING: Lag detected.</font>".repeat(fps < 26)
  fpscalc = Date.now();
  try {
    for (var e = Date.now(), t = 0; t < width * height; t++) {
      var x = t % width
      var y = Math.floor(t / width)
      var sus = susdata[t]
			var gradients = CalculateC(x,y)
			var c = gradients[0]
			var ic = gradients[1]
			// function letter(ltr){
				
			// }
			// t = t - timeShift
      var n = funct(t, e, t % width, Math.floor(t / width), mouseX, mouseY, width, height, randomCol(), sus, c, ic,0xFFFFFF,mouseDown,keyvents);
      Math.floor(Math.floor(n) / 16777216);
      pixels.data[4 * t + 0] = n >> 16 & 255, pixels.data[4 * t + 1] = n >> 8 & 255, pixels.data[4 * t + 2] = 255 & n, pixels.data[4 * t + 3] = 256
    }
    ctx.putImageData(pixels, 0, 0)
  } catch (e) {
    console.log(e)
  }
  if(running){window.requestAnimationFrame(genImg);}
};


//if (location.href.startsWith("https://4fce3d74-d2ae-48a0-9bf9-0d1102c842bc.id.repl.co")) { location.assign("https://jsam.codersquack.ml"); }