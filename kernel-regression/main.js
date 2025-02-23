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
bw = brd.create('slider', [[1, 7], [5, 7], [0, 1, 5]], { name: '\\(h\\)' });

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


// Weighted mean
function wmean(x, w) {
        return stats.sum(stats.multiply(w, x)) / stats.sum(w);
};

// WLS regression
function wls(x, y, w) {
        const xm = wmean(x, w),
                ym = wmean(y, w);

        const xd = stats.subtract(x, xm);
        const yd = stats.subtract(y, ym);
        const covariance = stats.sum(
                stats.multiply(w,
                        stats.multiply(xd, yd)));

        const variance =
                stats.sum(
                        stats.multiply(w,
                                stats.multiply(xd, xd)));

        const bhat = covariance / variance;

        const ahat = ym - bhat * xm;

        return [ahat, bhat]
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

// Calculate height at midpoint
const ymid = () => kernReg(mid(), bw.Value());



// Data

// No. of points
const n = 50;
const x = [...Array(n).keys().map((x) => (8 * x / (n - 1) + 1))];
const e = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const y = stats.add(e,
        stats.add(2,
                stats.multiply(0.5, x)
        )
);

// Plot data
const points = x.map((x, i) => {
        const y = 2 + 0.5 * x + e[i];
        brd.create('point', [x, y],
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


