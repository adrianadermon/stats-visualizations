// Kernel functions

// Triangular kernel
function triKernel(u) {
        return Math.abs(u) <= 1 ? 1 - Math.abs(u) : 0;
};

// Rectangular kernel
function rectKernel(u) {
        return Math.abs(u) <= 1 ? 1 / 2 : 0;
};

// Epanechnikov kernel
function epaKernel(u) {
        return Math.abs(u) <= 1 ? (3 / 4) * (1 - u ** 2) : 0;
};

// Gaussian kernel
function gaussKernel(u) {
        return (1 / Math.sqrt(2 * Math.PI)) * Math.E ** (- (1 / 2) * u ** 2);
};


// Kernel function
function kernel(x0, xi, h, kernFunc) {
        const u = (x0 - xi) / h;
        return kernFunc(u);
};

export { triKernel, rectKernel, epaKernel, gaussKernel, kernel };
