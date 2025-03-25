const canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d"),
      tools = document.querySelectorAll(".tools-board .option"),
      colors = document.querySelectorAll(".colors .option"),
      sizeSlider = document.getElementById("size-slider"),
      clearBtn = document.querySelector(".clear-canvas"),
      saveBtn = document.querySelector(".save-img"),
      preencherCheckbox = document.getElementById("preencher");

let isDrawing = false,
    currentTool = "pincel",
    currentColor = "#000000",
    brushSize = 5,
    startX, startY, drawingShape = false, shapeType = 'retangulo', fillShape = false;

canvas.width = 800;
canvas.height = 600;

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    if (currentTool === "pincel") {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (currentTool === "borracha") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (drawingShape) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (shapeType === 'retangulo') {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
            if (fillShape) {
                ctx.fillStyle = currentColor;
                ctx.fillRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
            }
        } else if (shapeType === 'circulo') {
            ctx.beginPath();
            ctx.arc(startX, startY, Math.abs(e.offsetX - startX), 0, Math.PI * 2);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.stroke();
            if (fillShape) {
                ctx.fillStyle = currentColor;
                ctx.fill();
            }
        } else if (shapeType === 'triangulo') {
            const height = Math.abs(e.offsetY - startY);
            const width = Math.abs(e.offsetX - startX);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + width, startY + height);
            ctx.lineTo(startX - width, startY + height);
            ctx.closePath();
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.stroke();
            if (fillShape) {
                ctx.fillStyle = currentColor;
                ctx.fill();
            }
        }
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.globalCompositeOperation = "source-over";
});

tools.forEach(tool => {
    tool.addEventListener("click", () => {
        tools.forEach(t => t.classList.remove("active"));
        tool.classList.add("active");

        if (tool.querySelector("span")) {
            const toolName = tool.querySelector("span").textContent.toLowerCase();
            currentTool = toolName;

            if (currentTool === "borracha") {
                ctx.globalCompositeOperation = "destination-out";
            } else {
                ctx.globalCompositeOperation = "source-over";
            }
        } else if (tool.querySelector("input[type='range']")) {
            brushSize = sizeSlider.value;
        } else if (tool.querySelector("input[type='checkbox']")) {
            fillShape = tool.querySelector("input").checked;
        }
    });
});

colors.forEach(color => {
    color.addEventListener("click", () => {
        colors.forEach(c => c.classList.remove("active"));
        color.classList.add("active");
        currentColor = color.style.backgroundColor;
    });
});

sizeSlider.addEventListener("input", (e) => {
    brushSize = e.target.value;
});

clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "paint.png";
    link.click();
});

window.addEventListener("resize", () => {
    canvas.width = 800;
    canvas.height = 600;
});
