function relu(x) { return Math.max(0, x) };
function sigmoid(x) { return 1 / (1 + Math.E ** -x) };
function leakyRelu(x) { return x >= 0 ? x : 0.1 * x };
function hardSwish(x) {
        return (x < -3) ? 0 :
                x > 3 ? x :
                        x * (x + 3) / 6
};
function passthrough(x) { return x };

export { relu, sigmoid, leakyRelu, hardSwish };
