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

    const drawDots = () => {
        clear();
        for (const dot of dots) {
            drawDot(dot);
        }
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
        draw: drawDots,
        move: (color, dx, dy) => {
            if (dx === 0 && dy === 0) {
                return;
            }
            const dotsToMove = dots.filter(
                (dot) => dot.color === color
            );
            if (dotsToMove.length === 0) {
                return;
            }
            const xFinal = dotsToMove[0].x + latticeUnit * dx;
            const yFinal = dotsToMove[0].y + latticeUnit * dy;
            const animate = () => {
                if (xFinal === dotsToMove[0].x && yFinal === dotsToMove[0].y) {
                    return;
                }
                for (const dot of dotsToMove) {
                    dot.x += dx;
                    dot.y += dy;
                }
                drawDots();
                requestAnimationFrame(animate);
            };
            animate();
        },
        paste: (inputColor1, inputColor2, outputColor) => {
            clear();
            for (const dot of dots) {
                if (dot.color === inputColor1 || dot.color === inputColor2) {
                    dot.color = outputColor;
                }
                drawDot(dot);
            }
        },
        shred: (...colors) => {
            const colorCount = colors.length;
            if (colorCount === 0) {
                return;
            }
            clear();
            for (const dot of dots) {
                const x = floor(dot.x / latticeUnit);
                dot.color = colors[x % colorCount];
                drawDot(dot);
            }
        },
        stretch: (color, k, l) => {
            if (l === 0 || (k === 1 && l === 1)) {
                return;
            }
            const dotsToMove = dots
                .filter(
                    (dot) => dot.color === color
                )
                .map(
                    (dot) => {
                        const x = floor(dot.x / latticeUnit);
                        const y = floor(dot.y / latticeUnit);
                        const dx = floor(x * k) - x;
                        const dy = floor(y / l) - y;
                        return [dot, dx, dy];
                    }
                );
            if (dotsToMove.length === 0) {
                return;
            }
            const [firstDot, dx, dy] = dotsToMove[0];
            const xFinal = firstDot.x + latticeUnit * dx;
            const yFinal = firstDot.y + latticeUnit * dy;
            const animate = () => {
                if (xFinal === firstDot.x && yFinal === firstDot.y) {
                    return;
                }
                for (const [dot, dx, dy] of dotsToMove) {
                    dot.x += dx;
                    dot.y += dy;
                }
                drawDots();
                requestAnimationFrame(animate);
            };
            animate();
        },
        transpose: () => {
            const dotsToMove = dots.map(
                (dot) => {
                    const dx = floor((dot.y - dot.x) / latticeUnit);
                    const dy = floor((dot.x - dot.y) / latticeUnit);
                    return [dot, dx, dy];
                }
            );
            if (dotsToMove.length === 0) {
                return;
            }
            const [lastDot, dx, dy] = dotsToMove[dotsToMove.length - 1];
            const xFinal = lastDot.x + latticeUnit * dx;
            const yFinal = lastDot.y + latticeUnit * dy;
            const animate = () => {
                if (xFinal === lastDot.x && yFinal === lastDot.y) {
                    return;
                }
                for (const [dot, dx, dy] of dotsToMove) {
                    dot.x += dx;
                    dot.y += dy;
                }
                drawDots();
                requestAnimationFrame(animate);
            };
            animate();
        }
    };
};

export default DotCanvas;
