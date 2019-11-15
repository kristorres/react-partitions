const {PI: π, floor} = Math;

const DotCanvas = (selector, latticeUnit) => {

    const context = document.querySelector(selector).getContext("2d");
    const dots = [];

    const clear = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };

    const drawDot = (dot) => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, 2 * π, true);
        context.fillStyle = dot.color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    };

    return {
        addDots: (newDots) => {
            for (const dot of newDots) {
                dots.push(dot);
            }
        },
        clear,
        cut: (a, b, c, color1, color2) => {
            clear();
            for (const dot of dots) {
                const x = floor(dot.x / latticeUnit);
                const y = floor(dot.y / latticeUnit);
                dot.color = (a * x + b * y < c) ? color2 : color1;
                drawDot(dot);
            }
        },
        draw: () => {
            clear();
            for (const dot of dots) {
                drawDot(dot);
            }
        }
    };
};

export default DotCanvas;
