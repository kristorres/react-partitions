const {PI: π, floor} = Math;

const DotCanvas = (selector, dotRadius) => {

    const context = document.querySelector(selector).getContext("2d");

    const latticeUnit = dotRadius * 3;
    const offset = dotRadius * 2;
    let dots = [];

    const toLatticeUnits = (pixels) => floor(pixels / latticeUnit);
    const toPixels = (latticeUnits) => latticeUnits * latticeUnit + offset;

    const erase = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    };

    const drawDot = (dot) => {
        context.beginPath();
        context.arc(dot.x, dot.y, dotRadius, 0, 2 * π, true);
        context.fillStyle = dot.color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    };

    const drawDots = () => {
        erase();
        for (const dot of dots) {
            drawDot(dot);
        }
    };

    const transform = (color, f) => {
        const movingDots = dots
            .filter(
                (dot) => dot.color === color
            )
            .map(
                (dot) => {
                    const xInitial = toLatticeUnits(dot.x);
                    const yInitial = toLatticeUnits(dot.y);
                    const [xFinal, yFinal] = f(xInitial, yInitial);
                    return [dot, xFinal - xInitial, yFinal - yInitial];
                }
            )
            .filter(
                ([, dx, dy]) => dx !== 0 || dy !== 0
            );
        if (movingDots.length === 0) {
            return;
        }
        const [firstMovingDot, dx, dy] = movingDots[0];
        const xFinal = firstMovingDot.x + latticeUnit * dx;
        const yFinal = firstMovingDot.y + latticeUnit * dy;
        const animate = () => {
            if (xFinal === firstMovingDot.x && yFinal === firstMovingDot.y) {
                return;
            }
            for (const [dot, dx, dy] of movingDots) {
                dot.x += dx;
                dot.y += dy;
            }
            drawDots();
            requestAnimationFrame(animate);
        };
        animate();
    };

    return {
        add: (color1, color2) => {
            const parts = new Map();
            for (const dot of dots) {
                if (dot.color === color1) {
                    const x = toLatticeUnits(dot.x);
                    const y = toLatticeUnits(dot.y);
                    const currentPart = parts.get(y);
                    const newPart = x + 1;
                    if (currentPart === undefined || currentPart < newPart) {
                        parts.set(y, newPart);
                    }
                }
            }
            transform(
                color2,
                (x, y) => [x + (parts.get(y) ?? 0), y]
            );
        },
        cut: (a, b, c, color1, color2) => {
            erase();
            for (const dot of dots) {
                const x = toLatticeUnits(dot.x);
                const y = toLatticeUnits(dot.y);
                dot.color = (a * x + b * y < c) ? color2 : color1;
                drawDot(dot);
            }
        },
        draw: drawDots,
        erase,
        insertDots: (newDots) => {
            for (const dot of newDots) {
                dots.push({
                    x: toPixels(dot.x),
                    y: toPixels(dot.y),
                    color: dot.color
                });
            }
        },
        move: (color, dx, dy) => {
            if (dx === 0 && dy === 0) {
                return;
            }
            transform(
                color,
                (x, y) => [x + dx, y + dy]
            );
        },
        paste: (inputColor1, inputColor2, outputColor) => {
            erase();
            for (const dot of dots) {
                if (dot.color === inputColor1 || dot.color === inputColor2) {
                    dot.color = outputColor;
                }
                drawDot(dot);
            }
        },
        reset: () => {
            erase();
            dots = [];
        },
        shift: (color, a, b, c, d) => {
            transform(
                color,
                (x, y) => [a * x + b * y, c * x + d * y]
            );
        },
        shred: (inputColor, ...outputColors) => {
            const outputColorCount = outputColors.length;
            if (outputColorCount === 0) {
                return;
            }
            erase();
            for (const dot of dots) {
                if (dot.color === inputColor) {
                    const x = toLatticeUnits(dot.x);
                    dot.color = outputColors[x % outputColorCount];
                }
                drawDot(dot);
            }
        },
        stretch: (color, k, l) => {
            if (l === 0 || (k === 1 && l === 1)) {
                return;
            }
            transform(
                color,
                (x, y) => [floor(x * k), floor(y / l)]
            );
        },
        transpose: (color) => {
            transform(
                color,
                (x, y) => [y, x]
            );
        }
    };
};

export default DotCanvas;
