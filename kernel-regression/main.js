
JXG.Options.text.useMathJax = true;

import { triKernel, rectKernel, epaKernel, gaussKernel, kernel } from '../modules/kernels.js';

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue'),
        red = documentCSS.getPropertyValue('--graph-red'),
        black = documentCSS.getPropertyValue('--graph-black'),
        green = documentCSS.getPropertyValue('--graph-green');


// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
        {
                boundingbox: [-1, 10, 10, -1],
                axis: false,
                showNavigation: false,
                showCopyright: false
        });

const xAxis = brd.create('axis',
        [[0, 0], [1, 0]],
        {
                straightFirst: false,
                name: 'x',
                withLabel: true,
                label: {
                        position: 'rt',
                        anchorX: 'right',
                        anchorY: 'bottom',
                        fontSize: 18,
                },
                ticks: { visible: false }
        });
const yAxis = brd.create('axis',
        [[0, 0], [0, 1]],
        {
                straightFirst: false,
                name: 'y',
                withLabel: true,
                label: {
                        position: 'rt',
                        anchorX: 'left',
                        anchorY: 'top',
                        fontSize: 18,
                },
                ticks: { visible: false }
        });

// Sliders
const x0 = brd.create('slider', [[1, 8], [5, 8], [1, 5, 9]], { name: '\\(x_0\\)' }),
        bw = brd.create('slider', [[1, 7], [5, 7], [0.1, 1, 5]], { name: '\\(h\\)' });

function lb() { return x0.Value() - bw.Value() };
function ub() { return x0.Value() + bw.Value() };
function mid() { return x0.Value() };

// Default kernel function
let kernelFunc = epaKernel;


// Select kernel function
let kernelMenu = document.getElementById('kernel-select');
kernelMenu.addEventListener('change', setKernelFunction);

function setKernelFunction(event) {
        if (kernelMenu.value == 'rect') {
                kernelFunc = rectKernel;
                brd.fullUpdate();
        } else if (kernelMenu.value == 'tri') {
                kernelFunc = triKernel;
                brd.fullUpdate();
        } else if (kernelMenu.value == 'gauss') {
                kernelFunc = gaussKernel;
                brd.fullUpdate();
        } else if (kernelMenu.value == 'epa') {
                kernelFunc = epaKernel;
                brd.fullUpdate();
        }
};

// Useful vector functions
const stats = JXG.Math.Statistics;


// Data

// No. of points
const n = 50;
// Error variance
const eVar = 1;
// parameters
const b0 = 2,
      b1 = 0.5;
const i = [...Array(n).keys()]
const x = i.map((i) => (8 * i / (n - 1)) + 1);
const e = i.map((i) => stats.randomNormal(0, eVar));
// DGP
function dgp(x, e) {
    const y = b0 + b1*x + e;
    return y;
};

const y = i.map((i) => dgp(x[i], e[i]));



// Plot data
const points = x.map((x, i) => {
        brd.create('point', [x, y[i]],
                {
                        name: '',
                        // size:1,
                        size: () => { return kernel(x0.Value(), x, bw.Value(), kernelFunc) + 1; },
                        color: black,
                        opacity: () => { return 0.7 * kernel(x0.Value(), x, bw.Value(), kernelFunc) + 0.3; },
                })
});




// Draw vertical lines at boundaries
const lbLine = brd.create('segment',
        [[lb, 0], [lb, 10]],
        {
                strokeWidth: 1,
                strokeColor: blue,
        });

const ubLine = brd.create('segment',
        [[ub, 0], [ub, 10]],
        {
                strokeWidth: 1,
                strokeColor: blue,
        });

// Labels
const midLabel = brd.create('text',
        [mid, -0.2, '\\(x_0\\)']);

const lbLabel = brd.create('text',
        [lb, -0.2, '\\(x_0 - h\\)'],
        {
                anchorX: 'right'
        });

const ubLabel = brd.create('text',
        [ub, -0.2, '\\(x_0 + h\\)'],
        {
                anchorX: 'left'
        });








// Draw local regression line
const plotLine = brd.create('segment',
        [() => { return localLine(x0.Value(), bw.Value())[0]; },
        () => { return localLine(x0.Value(), bw.Value())[1]; }],
        {
                strokeWidth: 2,
                strokeColor: blue,
        });


// Calculate height at midpoint
const ymid = () => kernReg(mid(), bw.Value());

// Draw vertical to midpoint
const midLine = brd.create('segment',
        [[mid, 0], [mid, ymid]],
        {
                strokeWidth: 1,
                strokeColor: blue,
        });


// Plot midpoint
const regPoint = brd.create('point',
        [mid, () => { return kernReg(x0.Value(), bw.Value()); }],
        {
                withLabel: false,
                size: 4,
                color: blue,
        });




// Draw kernel regression line
const kernelLine = brd.create('functiongraph',
        [(x) => kernReg(x, bw.Value()),
                1, mid],
        {
                strokeWidth: 2,
                strokeColor: red,
        });

// Draw weights
const weightLine = brd.create('functiongraph',
        [(x) => kernel(x0.Value(), x, bw.Value(), kernelFunc),
                0, 10],
        {
                strokeWidth: 1,
                strokeColor: green,
        });


// Weighted mean
function wmean(x, w) {
        return stats.sum(stats.multiply(w, x)) / stats.sum(w);
};

// Weighted variance
function wvar(x, w) {
        const xm = wmean(x, w);

        const xd = stats.subtract(x, xm);

        return stats.sum(
                stats.multiply(w,
                        stats.multiply(xd, xd)));
};

// Weighted covariance
function wcov(x, y, w) {
        const xm = wmean(x, w),
                ym = wmean(y, w);

        const xd = stats.subtract(x, xm),
                yd = stats.subtract(y, ym);

        return stats.sum(
                stats.multiply(w,
                        stats.multiply(xd, yd)));
};

// WLS regression
function wls(x, y, w) {
        const covyx = wcov(y, x, w);
        const varx = wvar(x, w);

        const b = covyx / varx;
        const a = wmean(y, w) - b * wmean(x, w);

        return [a, b];
};

// WLS regression, two variables
function wls2(x1, x2, y, w) {
        const covyx1 = wcov(y, x1, w),
                covyx2 = wcov(y, x2, w),
                covx1x2 = wcov(x1, x2, w),
                varx1 = wvar(x1, w),
                varx2 = wvar(x2, w);

        const b1 = (covyx1 * varx2 - covyx2 * covx1x2) /
                (varx1 * varx2 - covx1x2 ** 2);

        const b2 = (covyx2 * varx1 - covyx1 * covx1x2) /
                (varx1 * varx2 - covx1x2 ** 2);

        const a = wmean(y, w) - b1 * wmean(x1, w) - b2 * wmean(x2, w);

        return [a, b1, b2]
};

// Quadratic regression
function wlsSq(x, y, w) {
    const x2 = stats.multiply(x, x);
    const [a, b1, b2] = wls2(x, x2, y, w);
    const yPred = x => a + b1 * x + b2 * x ** 2;
    return yPred;
};





// Calculate kernel regression
function kernReg(x0, h) {
        const w = x.map((v) => kernel(x0, v, h, kernelFunc));

        let a, b;
        [a, b] = wls(x, y, w);
        const y0 = a + b * x0;
        return y0;
}

// Calculate kernel regression parameters
function kernRegParam(x0, h) {
        const w = x.map((v) => kernel(x0, v, h, kernelFunc));
        let a, b;
        [a, b] = wls(x, y, w);
        return a + b * x0;
}

// Calculate endpoints for local regression line
function localLine(x0, h) {
        const w = x.map((v) => kernel(x0, v, h, kernelFunc));
        let a, b;
        [a, b] = wls(x, y, w);
        const lb = x0 - h;
        const ub = x0 + h;
        return [[lb, a + b * lb], [ub, a + b * ub]];
}




// What is needed?

// To draw local line:
// input: x0, h
// output: local regression line in [x0 - h, x0 + h]

// To draw kernel line:
// input: x, x0, h
// output: smoothed line from 0 to x0






// Works, but too slow to be usable
// WLS regression
function wlsMat(x, y, w) {
    // X matrix with constant
    const X = math.transpose(math.matrix([math.ones(x.length), x]));

    // // X'X
    // const XtX = math.multiply(math.transpose(X), X);

    // // X'y
    // const Xty = math.multiply(math.transpose(X), y);

    // // Solve for b in X'X b = X'y with LU decomposition
    // const [a, b] = math.lusolve(XtX, Xty)

    // W
    const W = math.diag(w);
    
    // Solve for b in X'W X b = X'W y with LU decomposition
    const Xt = math.transpose(X);
    const XtWX = math.multiply(Xt, W, X);
    const XtWy = math.multiply(Xt, W, y);
    const b = math.lusolve(XtWX, XtWy);
    
    return b.valueOf().flat();
};
