const {PI: π} = Math;

const DotCanvas = (selector) => {

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
        draw: () => {
            clear();
            for (const dot of dots) {
                drawDot(dot);
            }
        }
    };
};

export default DotCanvas;
