
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();



const globalCanvas = document.getElementById("globalCanvas");
const globalctx = globalCanvas.getContext('2d');

const canvasOffsetx = rect.left;
const canvasOffsetY = rect.top;

function generateId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const length = 5;
    let res = '';
    for (let i = 0; i < length; i++){
        let rand = Math.floor(Math.random() * length);
        res += chars.charAt(rand)
    }
    let num = Math.random() * (1000-1)+1;;

    let id = res+parseInt(num);

    return id;
}

class Pen {
    constructor(xpos, ypos, linewidth, id, painting) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.linewidth = linewidth;
        this.id = id;
        this.painting = painting;
    }
}

let painting = false;
let lineWidth = 5;

let lastX;
let lastY;

let myid = generateId();

let mypen = new Pen(0,0,5,myid, false);

const websocket = new WebSocket("ws://localhost:8000")

canvas.addEventListener("mousedown", (event) => {
    mypen.painting = true;
    mypen.xpos = event.clientX - canvasOffsetx;
    mypen.ypos = event.clientY - canvasOffsetY;

    ctx.lineWidth = mypen.linewidth;
    ctx.lineCap = "round";

    ctx.lineTo(mypen.xpos,mypen.ypos);
    ctx.stroke();
    //draw(event);

    const json_string = JSON.stringify({
        "type": "start",
        "id": mypen.id,
        "xpos": mypen.xpos,
        "ypos": mypen.ypos,
        "linewidth": mypen.linewidth
        })

    sendDraw(json_string);
});

//canvas.addEventListener("mousedown", draw)

canvas.addEventListener("mouseup", (event) => {
    mypen.painting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
    if(!mypen.painting) {
        return;
    }

    ctx.lineWidth = mypen.linewidth;
    ctx.lineCap = "round";

    mypen.xpos = e.clientX - canvasOffsetx;
    mypen.ypos = e.clientY - canvasOffsetY;

    ctx.lineTo(mypen.xpos, mypen.ypos);
    ctx.stroke()

    const json_string = JSON.stringify({
        "type": "draw",
        "id": mypen.id,
        "xpos": mypen.xpos,
        "ypos": mypen.ypos,
        "linewidth": mypen.linewidth
        })
    sendDraw(json_string)

}

function receiveDraw(websocket) {
    websocket.addEventListener("message", ({data}) => {
        const event = JSON.parse(data);

        switch(event.type) {
            case "start":
                globalctx.lineWidth = event.linewidth;
                globalctx.lineCap = "round";
                globalctx.moveTo(event.xpos, event.ypos);
                globalctx.lineTo(event.xpos, event.ypos);
                globalctx.stroke();
                globalctx.beginPath();
                break;
            case "draw":
                //globalctx.beginPath();
                globalctx.lineWidth = event.linewidth;
                globalctx.lineCap = "round";
                globalctx.lineTo(event.xpos, event.ypos);
                globalctx.stroke();
                break;
            case "undo":
                //undo specific id's last draw
                break;
            case "clear":
                //clear the canvas
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}`)
        }
    });
}

function sendDraw(event) {
    websocket.send(event);
}

receiveDraw(websocket)

/*
window.addEventListener("DOMContentLoaded", () => {
    create the canvas here

    initialize websocket

    send and receive draws
    
    })


*/