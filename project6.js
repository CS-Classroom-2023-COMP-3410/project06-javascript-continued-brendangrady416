/* script */ 
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const brushColorInput = document.getElementById('brushColor');
const brushSizeInput = document.getElementById('brushSize');
const bgColorInput = document.getElementById('bgColor');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const lineStyleSelect = document.getElementById('lineStyleSelect');
const textColorInput = document.createElement('input');
const fontSelect = document.createElement('select');

let drawing = false;
let strokes = [];
let currentStroke = [];
let shapeMode = null;
let textMode = false;
let lineStyle = 'solid';
let textInputs = [];

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

ctx.fillStyle = bgColorInput.value;
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (event) => {
    if (textMode) {
        createTextInput(event.offsetX, event.offsetY);
        textMode = false;
        return;
    }
    if (shapeMode) {
        drawShape(event.offsetX, event.offsetY);
        return;
    }
    drawing = true;
    currentStroke = [];
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    strokes.push([...currentStroke]);
    ctx.setLineDash([]);
});

canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing || shapeMode || textMode) return;
    ctx.lineWidth = brushSizeInput.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColorInput.value;
    setLineStyle();
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    currentStroke.push({
        x: event.offsetX,
        y: event.offsetY,
        color: ctx.strokeStyle,
        size: ctx.lineWidth,
        style: lineStyle
    });
}

function setLineStyle() {
    if (lineStyle === 'dashed') {
        ctx.setLineDash([15, 10]);
    } else if (lineStyle === 'dotted') {
        ctx.setLineDash([5, 5]);
    } else {
        ctx.setLineDash([]);
    }
}

function drawShape(x, y) {
    const color = brushColorInput.value;
    const size = brushSizeInput.value * 10;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (shapeMode === 'rectangle') {
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else if (shapeMode === 'circle') {
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (shapeMode === 'triangle') {
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.closePath();
        ctx.fill();
    }
    strokes.push([{ shape: shapeMode, x, y, color, size }]);
    shapeMode = null;
}

function createTextInput(x, y) {
    const input = document.createElement('textarea');
    input.style.position = 'absolute';
    input.style.left = `${canvas.offsetLeft + x}px`;
    input.style.top = `${canvas.offsetTop + y}px`;
    input.style.background = 'transparent';
    input.style.border = 'none';
    input.style.fontSize = '16px';
    input.style.resize = 'none';
    input.style.overflow = 'hidden';
    input.style.color = textColorInput.value;
    input.style.fontFamily = fontSelect.value;
    input.style.width = '100px';
    input.style.height = '20px';
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });
    document.body.appendChild(input);
    input.focus();
    textInputs.push(input);
}

undoBtn.addEventListener('click', () => { strokes.pop(); redraw(); });
clearBtn.addEventListener('click', () => { strokes = []; textInputs.forEach(input => document.body.removeChild(input)); textInputs = []; redraw(); });
saveBtn.addEventListener('click', () => { const link = document.createElement('a'); link.download = 'canvas.png'; link.href = canvas.toDataURL(); link.click(); });
bgColorInput.addEventListener('input', () => { redraw(); });

function redraw() {
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
        ctx.beginPath();
        stroke.forEach(point => {
            ctx.lineWidth = point.size;
            ctx.strokeStyle = point.color;
            lineStyle = point.style;
            setLineStyle();
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        });
    });
    ctx.setLineDash([]);
}

document.getElementById('rectangleBtn').addEventListener('click', () => shapeMode = 'rectangle');
document.getElementById('circleBtn').addEventListener('click', () => shapeMode = 'circle');
document.getElementById('triangleBtn').addEventListener('click', () => shapeMode = 'triangle');
document.getElementById('textBtn').addEventListener('click', () => textMode = true);
document.getElementById('lineStyleSelect').addEventListener('change', (event) => { lineStyle = event.target.value; setLineStyle(); });
