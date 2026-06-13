
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

const canvasOffsetx = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop

let painting = false;
let lineWidth = 5;

let lastX;
let lastY;

canvas.addEventListener("mousedown", (event) => {
    painting = true;
    lastX = event.clientX - canvasOffsetx;
    lastY = event.clientY - canvasOffsetY;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    ctx.lineTo(lastX,lastY);
    ctx.stroke();
    //draw(event);

    const json_string = JSON.stringify({"xpos": lastX, "ypos": lastY});
});

canvas.addEventListener("mousedown", draw)

canvas.addEventListener("mouseup", (event) => {
    painting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
    if(!painting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX - canvasOffsetx, e.clientY - canvasOffsetY);
    ctx.stroke()

}

function receiveDraw(canvas, websocket) {

}

function sendDraw(canvas, websocket) {

}

/*
window.addEventListener("DOMContentLoaded", () => {
    create the canvas here

    initialize websocket

    send and receive draws
    
    })


*/