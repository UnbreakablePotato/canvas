
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
    let num = Math.random() * (1000-1)+1;

    let id = res+parseInt(num);

    return id;
}

class Pen {
    constructor(xpos, ypos, linewidth, id, painting, strokes = []) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.linewidth = linewidth;
        this.id = id;
        this.painting = painting;
        this.strokes = strokes;
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

    const coordinate = [mypen.xpos, mypen.ypos];

    mypen.strokes.push(coordinate);

    ctx.lineWidth = mypen.linewidth;
    ctx.lineCap = "round";

    ctx.moveTo(mypen.xpos,mypen.ypos);
    ctx.lineTo(mypen.xpos,mypen.ypos);
    ctx.stroke();

    const json_string = JSON.stringify({
        "type": "start",
        "id": mypen.id,
        "xpos": mypen.xpos,
        "ypos": mypen.ypos,
        "linewidth": mypen.linewidth
        })

    sendEvent(json_string);
});

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

    let coordinate = [mypen.xpos, mypen.ypos];

    mypen.strokes.push(coordinate);

    ctx.lineTo(mypen.xpos, mypen.ypos);
    ctx.stroke()

    const json_string = JSON.stringify({
        "type": "draw",
        "id": mypen.id,
        "xpos": mypen.xpos,
        "ypos": mypen.ypos,
        "linewidth": mypen.linewidth
        })
    sendEvent(json_string)

}

window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.code === "KeyZ") {
        if ( mypen.strokes.length === 0) {
            return;
        }
        // pop last stroke
        event.preventDefault();
        let coordinate = mypen.strokes.pop();
        ctx.clearRect(0, 0,canvas.width,canvas.height);

        const json_string = JSON.stringify({
        "type": "undo",
        "id": mypen.id,
        "xpos": coordinate[0],
        "ypos": coordinate[1],
        "linewidth": mypen.linewidth
        })
        sendEvent(json_string);
        
    }
});

window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.code === "KeyA") {
        event.preventDefault();
        ctx.clearRect(0,0,canvas.width,canvas.height);

        const json_string = JSON.stringify({
        "type": "clear",
        "id": mypen.id,
        "xpos": mypen.xpos,
        "ypos": mypen.ypos,
        "linewidth": mypen.linewidth
        })
        sendEvent(json_string);
    }
});

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
            case "join":
                // draw all previous lines
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}`)
        }
    });
}

function sendEvent(event) {
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