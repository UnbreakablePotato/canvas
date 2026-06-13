
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();



const globalCanvas = document.getElementById("globalCanvas");
const globalctx = globalCanvas.getContext('2d');

const canvasOffsetx = rect.left;
const canvasOffsetY = rect.top;

let painting = false;
let lineWidth = 5;

let lastX;
let lastY;

const websocket = new WebSocket("ws://localhost:8000")

canvas.addEventListener("mousedown", (event) => {
    painting = true;
    lastX = event.clientX - canvasOffsetx;
    lastY = event.clientY - canvasOffsetY;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    ctx.lineTo(lastX,lastY);
    ctx.stroke();
    //draw(event);

    const json_string = JSON.stringify({
        "type": "draw",
        "xpos": lastX,
        "ypos": lastY,
        "linewidth": lineWidth
        })

    sendDraw(json_string)
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

    let currX = e.clientX - canvasOffsetx;
    let currY = e.clientY - canvasOffsetY;

    ctx.lineTo(e.clientX - canvasOffsetx, e.clientY - canvasOffsetY);
    ctx.stroke()

    const json_string = JSON.stringify({
        "type": "draw",
        "xpos": currX,
        "ypos": currY,
        "linewidth": lineWidth
        })
    sendDraw(json_string)

}

function receiveDraw(canvas, websocket) {
    websocket.addEventListener("message", ({data}) => {

    });
}

function sendDraw(event) {
    websocket.send(event);
}

/*
window.addEventListener("DOMContentLoaded", () => {
    create the canvas here

    initialize websocket

    send and receive draws
    
    })


*/