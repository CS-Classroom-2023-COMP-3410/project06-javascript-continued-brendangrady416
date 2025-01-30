/* script */ 
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const brushColorInput = document.getElementById('brushColor');
const brushSizeInput = document.getElementById('brushSize');
const bgColorInput = document.getElementById('bgColor');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let drawing = false;
let strokes = [];
let currentStroke = [];

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

ctx.fillStyle = bgColorInput.value;
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', () => {
    drawing = true;
    currentStroke = [];
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    strokes.push([...currentStroke]);
});

canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColorInput.value;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    currentStroke.push({ x: event.offsetX, y: event.offsetY, color: ctx.strokeStyle, size: ctx.lineWidth });
}

undoBtn.addEventListener('click', () => {
    strokes.pop();
    redraw();
});

clearBtn.addEventListener('click', () => {
    strokes = [];
    redraw();
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = canvas.toDataURL();
    link.click();
});

bgColorInput.addEventListener('input', () => {
    redraw();
});

function redraw() {
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
        ctx.beginPath();
        stroke.forEach(point => {
            ctx.lineWidth = point.size;
            ctx.strokeStyle = point.color;
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        });
    });
}
