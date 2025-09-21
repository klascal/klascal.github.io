// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var c = 0;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;

var imghtml =
  '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>' +
  '<div id="imghelp">drag and drop a QRCode here' +
  "<br>or select a file" +
  '<input type="file" onchange="handleFiles(this.files)"/>' +
  "</div>" +
  "</div>";

var vidhtml = '<video id="v" autoplay></video>';

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  if (files.length > 0) {
    handleFiles(files);
  } else if (dt.getData("URL")) {
    qrcode.decode(dt.getData("URL"));
  }
}

function handleFiles(f) {
  var o = [];

  for (var i = 0; i < f.length; i++) {
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

        qrcode.decode(e.target.result);
      };
    })(f[i]);
    reader.readAsDataURL(f[i]);
  }
}

function initCanvas(w, h) {
  gCanvas = document.getElementById("qr-canvas");
  gCanvas.style.width = w / 2 + "px";
  gCanvas.style.height = h / 2 + "px";
  gCanvas.width = w;
  gCanvas.height = h;
  gCtx = gCanvas.getContext("2d");
  gCtx.clearRect(0, 0, w, h);
}

function captureToCanvas() {
  if (stype != 1) return;
  if (gUM) {
    try {
      gCtx.drawImage(v, 0, 0);
      try {
        qrcode.decode();
      } catch (e) {
        setTimeout(captureToCanvas, 0);
      }
    } catch (e) {
      setTimeout(captureToCanvas, 0);
    }
  }
}

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function read(a) {
  var html = "";
  if (a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
    html += "<a target='_blank' href='" + a + "'>" + a + "</a><br>";
  html += "<b>" + htmlEntities(a) + "</b>";
  document.getElementById("result").innerHTML = html;
}

function isCanvasSupported() {
  var elem = document.createElement("canvas");
  return !!(elem.getContext && elem.getContext("2d"));
}
function success(stream) {
  v.srcObject = stream;
  v.play();

  gUM = true;
  setTimeout(captureToCanvas, 0);
}

function error(error) {
  gUM = false;
  return;
}

function load() {
  if (isCanvasSupported() && window.File && window.FileReader) {
    initCanvas(800, 600);
    qrcode.callback = read;
    setwebcam();
  }
}

function setwebcam() {
  var options = { facingMode: "environment" };
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    try {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === "videoinput") {
            // Check if the label suggests the back camera
            if (
              device.label.toLowerCase().search("back") > -1 ||
              device.label.toLowerCase().search("rear") > -1
            ) {
              options = {
                deviceId: { exact: device.deviceId }, // Use deviceId for the back camera
                facingMode: "environment", // Also include facingMode as a fallback
              };
            }
            console.log(
              device.kind + ": " + device.label + " id = " + device.deviceId
            );
          }
        });
        // Now pass the `options` to setwebcam2
        setwebcam2(options);
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("no navigator.mediaDevices.enumerateDevices");
    setwebcam2(options);
  }
}

function setwebcam2(options) {
  console.log(options);
  if (stype == 1) {
    setTimeout(captureToCanvas, 0);
    return;
  }
  var n = navigator;
  document.getElementById("outdiv").innerHTML = vidhtml;
  v = document.getElementById("v");

  if (n.mediaDevices.getUserMedia) {
    n.mediaDevices
      .getUserMedia({ video: options, audio: false })
      .then(function (stream) {
        success(stream);
      })
      .catch(function (error) {
        error(error);
      });
  } else if (n.getUserMedia) {
    webkit = true;
    n.getUserMedia({ video: options, audio: false }, success, error);
  } else if (n.webkitGetUserMedia) {
    webkit = true;
    n.webkitGetUserMedia({ video: options, audio: false }, success, error);
  }

  stype = 1;
  setTimeout(captureToCanvas, 0);
}

function setimg() {
  document.getElementById("result").innerHTML = "";
  if (stype == 2) return;
  document.getElementById("outdiv").innerHTML = imghtml;
  //document.getElementById("qrimg").src="qrimg.png";
  //document.getElementById("webcamimg").src="webcam2.png";
  var qrfile = document.getElementById("qrfile");
  qrfile.addEventListener("dragenter", dragenter, false);
  qrfile.addEventListener("dragover", dragover, false);
  qrfile.addEventListener("drop", drop, false);
  stype = 2;
}
