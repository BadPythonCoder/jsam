window.onload = (()=>{

let rectype = document.createElement("select");
rectype.innerHTML="<option value=\"0\">4:3 using seperate image (Default 1024x768)</option><option value=\"1\">1:1 upscaled (768x768)</option><option value=\"2\">Lossy 1:1 (Depends on canvas size)</option>";
let rctpcntnr = 0;rectype.addEventListener("change",(e)=>{rctpcntnr=parseInt(rectype.value);console.log(rctpcntnr);})
document.querySelector("#options").appendChild(document.createElement("label"));
Array.from(document.querySelector("#options").children).at(-1).setAttribute("for","record-settings");
Array.from(document.querySelector("#options").children).at(-1).innerHTML="Record setting: ";
Array.from(document.querySelector("#options").children).at(-1).appendChild(rectype);
var canvas = document.querySelector("canvas#canvas");
var recordCanvas = document.createElement("canvas");
var rCLImage = new Image();
rCLImage.src = "/static/jsam-record.png";
var rctx = recordCanvas.getContext("2d");
var ctx = canvas.getContext("2d");

var videoStream = recordCanvas.captureStream(60);
var mediaRecorder = new MediaRecorder(videoStream);
console.log(videoStream)

var chunks = [];
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};

mediaRecorder.onstop = function(e) {
  var blob = new Blob(chunks, { 'type' : 'video/mp4' });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  downloadURI(videoURL, "jsart.mp4");
};
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};

let recordBtn = document.createElement("button");
recordBtn.innerHTML="Record";
let recordState = 0;
recordBtn.addEventListener("click",()=>{
	if(recordState){
		mediaRecorder.stop();
		recordBtn.innerHTML="Record";
		reccanvas = 0;
	} else {
		mediaRecorder.start();	
		recordBtn.innerHTML="Recording...";
		reccanvas = 1;
		rCanvasFrame();
	}
	recordState = 1 - recordState;
},false);
recordBtn.setAttribute("class","le-button")
document.querySelector(".buttonstop").appendChild(recordBtn);
let reccanvas = 0;
function rCanvasFrame(){
	rctx.imageSmoothingEnabled=false;
	if(rctpcntnr==0){
		recordCanvas.width = 1024;
		recordCanvas.height = 768;
		rctx.drawImage(rCLImage,0,0,256,768);
		rctx.drawImage(canvas,256,0,768,768);
	}else if(rctpcntnr==1) {
		recordCanvas.width=recordCanvas.height=768;
		rctx.drawImage(canvas,0,0,768,768);
	} else {
		recordCanvas.width=canvas.width;
		recordCanvas.height=canvas.height;
		rctx.drawImage(canvas,0,0);
	}
	if(reccanvas){window.requestAnimationFrame(rCanvasFrame);}
}
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

});