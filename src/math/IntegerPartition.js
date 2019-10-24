const {PI: π, floor, log, random, sqrt} = Math;

const validatePositiveInteger = (n) => {
    if (
        typeof n !== "number"
        || isNaN(n)
        || Number.isInteger(n) === false
        || n <= 0
    ) {
        throw new Error("n is not a positive integer.");
    }
};

const IntegerPartition = {
    generateRandom: (n) => {
        validatePositiveInteger(n);
        let λ = [];
        while (true) {
            for (let i = 1; i <= n; i += 1) {
                const U = random();
                if (U > 0) {
                    const Zᵢ = floor((-sqrt(6 * n) * log(U)) / (π * i));
                    for (let j = 0; j < Zᵢ; j += 1) {
                        λ.push(i);
                    }
                }
            }
            const weight = λ.reduce(
                (sum, part) => sum + part,
                0
            );
            if (weight === n) {
                break;
            }
            λ = [];
        }
        λ.reverse();
        return λ;
    }
};

export default IntegerPartition;
