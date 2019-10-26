const {PI: π, floor, log, random, sqrt} = Math;

const partitionRestrictions = {
    none: {
        allowPart: (part) => true,
        validateWeight: (weight) => true,
        validateWeightForDistinctParts: (weight) => true
    },
    even: {
        allowPart: (part) => part % 2 === 0,
        validateWeight: (weight) => weight % 2 === 0,
        validateWeightForDistinctParts: (weight) => weight % 2 === 0
    },
    odd: {
        allowPart: (part) => part % 2 === 1,
        validateWeight: (weight) => true,
        validateWeightForDistinctParts: (weight) => weight !== 2
    }
};

const getPartitionRestriction = (partRestriction) => {
    const partitionRestriction = partitionRestrictions[partRestriction];
    if (partitionRestriction === undefined) {
        throw new Error(`Invalid part restriction: "${partRestriction}".`);
    }
    return partitionRestriction;
};

const partsAreDistinct = (λ) => {
    return λ.length === (new Set(λ)).size;
};

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

const generateRandomWithDistinctParts = (n, partRestriction = "none") => {
    validatePositiveInteger(n);
    const restriction = getPartitionRestriction(partRestriction);
    if (restriction.validateWeightForDistinctParts(n) === false) {
        throw new Error(`Invalid value for n due to restriction: ${n}.`);
    }
    let λ = [];
    while (true) {
        let largestPartAllowed = n;
        while (largestPartAllowed > 0) {
            const part = floor(random() * largestPartAllowed) + 1;
            if (restriction.allowPart(part)) {
                λ.push(part);
                largestPartAllowed -= part;
            }
        }
        if (partsAreDistinct(λ)) {
            break;
        }
        λ = [];
    }
    λ.sort(
        (a, b) => b - a
    );
    return λ;
};

const IntegerPartition = {
    generateRandom: (n, partRestriction = "none") => {
        validatePositiveInteger(n);
        const restriction = getPartitionRestriction(partRestriction);
        if (restriction.validateWeight(n) === false) {
            throw new Error(`Invalid value for n due to restriction: ${n}.`);
        }
        let λ = [];
        while (true) {
            for (let i = 1; i <= n; i += 1) {
                const U = random();
                if (restriction.allowPart(i) && U > 0) {
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
    },
    generateRandomWithDistinctParts
};

export default IntegerPartition;
