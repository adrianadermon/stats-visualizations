JXG.Options.text.useMathJax = true;
      
// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
    {boundingbox: [-1, 10, 10, -1],
        axis:false,
        showNavigation:false,
        showCopyright:false});

const xAxis = brd.create('axis', [[0, 0], [1, 0]], { straightFirst: false,
    ticks: { visible: false }});
const yAxis = brd.create('axis', [[0, 0], [0, 1]], { straightFirst: false,
    ticks: { visible: false }});
      
// Sliders
const x0 = brd.create('slider', [[1, 8], [5, 8], [0, 5, 10]], {name:'\\(x_0\\)'});
bw = brd.create('slider', [[1, 7], [5, 7], [0, 1, 5]], {name:'\\(h\\)'});



const lb = function() {return x0.Value() - bw.Value()};
const ub = function() {return x0.Value() + bw.Value()};
const mid = function() {return x0.Value()};


// Kernel functions
// Triangular kernel
const triKernel = function(u) {
    return Math.abs(u) <= 1 ? 1 - Math.abs(u) : 0;
};

// Rectangular kernel
const rectKernel = function(u) {
    return Math.abs(u) <= 1 ? 1/2 : 0;
};

// Epanechnikov kernel
const epaKernel = function(u) {
    return Math.abs(u) <= 1 ? (3/4) * (1 - u**2) : 0;
};

// Gaussian kernel
const gaussKernel = function(u) {
    return (1 / Math.sqrt(2*Math.PI)) * Math.E**(- (1/2) * u**2);
};


// Kernel function
const kernel = function(x0, xi, h, kernFunc) {
    const u = (x0 - xi) / h;
    return kernFunc(u);
};


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







// Data

// Useful vector functions
const stats = JXG.Math.Statistics;

// No. of points
n = 30;
const x = [...Array(n).keys().map((x) => (8*x/(n-1) + 1))];
const e = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const y = stats.add(e,
    stats.add(2,
        stats.multiply(0.5, x)
    )
);

// ---- MAKE OPACITY UPDATE ---- //
// Plot data
points = x.map((x, i) => {
    const y = 2 + 0.5*x + e[i];
    brd.create('point', [x, y],
        {name:'',
            size:1,
            color:JXG.palette.black,
            opacity: kernel(x0.Value(), x, bw.Value(), kernelFunc) + 0.2});
});




// OLS regression
ols = function(x, y) {
    const xm = stats.mean(x),
 ym = stats.mean(y);

    const xd = stats.subtract(x, xm);
    const yd = stats.subtract(y, ym);
    const covariance = stats.sum(
        stats.multiply(xd, yd));

    const variance = 
        stats.sum(
            stats.multiply(xd, xd));

    const bhat = covariance/variance;

    const ahat = ym - bhat*xm;

    return [ahat, bhat]
};

// Limit data to given range
const dataRange = function(x, y, lb, ub) {
    const condition = (v, lb, ub) => {return v >= lb && v <= ub};
    const firstx = x.findIndex((v) => condition(v, lb, ub));
    const lastx = x.findLastIndex((v) => condition(v, lb, ub));
    xRange = x.slice(firstx, lastx + 1);
    yRange = y.slice(firstx, lastx + 1);
    return [xRange, yRange];
}

// Calculate regression coefficients given range
const localReg = function(lb, ub) {
    let xLim, yLim;
    [xLim, yLim] = dataRange(x, y, lb, ub);
    let a, b;
    [a, b] = ols(xLim, yLim);
    return [a, b];
};

// Calculate local regression line
const plotReg = (x) => {
    const [a, b] = localReg(lb(), ub());
    return a + b*x
};


// ----- MAKE WEIGHTED ----- //
// Draw local regression line
const regLine = brd.create('functiongraph',
    [plotReg, lb, ub],
    {
        strokeWidth: 3,
        strokeColor: JXG.palette.blue,
    });

// Calculate height at midpoint
const ymid = () => plotReg(mid());

// Plot midpoint
const regPoint = brd.create('point',
    [mid, ymid],
    {
        withLabel: false,
        size: 3,
        color: JXG.palette.blue,
    });

// // Get y-value at lower boundary
// const ylb = () => {
//     const [a, b] = localReg(lb(), ub());
//     return a + b*lb();
// };

// // Get y-value at upper boundary
// const yub = () => {
//     const [a, b] = localReg(lb(), ub());
//     return a + b*ub();
// };

// Draw vertical lines at boundaries
const lbLine = brd.create('segment',
    [[lb, 0], [lb, 10]],
    {
        strokeWidth: 1,
        strokeColor: JXG.palette.blue,
    });

const ubLine = brd.create('segment',
    [[ub, 0], [ub, 10]],
    {
        strokeWidth: 1,
        strokeColor: JXG.palette.blue,
    });

const midLine = brd.create('segment',
    [[mid, 0], [mid, ymid]],
    {
        strokeWidth: 1,
        strokeColor: JXG.palette.blue,
    });

// Labels
const midLabel = brd.create('text',
    [mid, -0.5, '\\(x_0\\)']);

const lbLabel = brd.create('text',
    [lb, -0.5, '\\(x_0 - h\\)'],
    {
        anchorX: 'middle'
    });

const ubLabel = brd.create('text',
    [ub, -0.5, '\\(x_0 + h\\)'],
    {
        anchorX: 'middle'
    });




// Weighted mean
const wmean = function(x, w) {
    return stats.sum(stats.multiply(w, x)) / stats.sum(w);
};

// WLS regression
wls = function(x, y, w) {
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

    const bhat = covariance/variance;

    const ahat = ym - bhat*xm;

    return [ahat, bhat]
};

// Calculate kernel regression
const kernReg = function(x0, h) {
    const w = x.map((v) => kernel(x0, v, h, kernelFunc));

    let a, b;
    [a, b] = wls(x, y, w);
    const y0 =  a + b*x0;
    return y0;
}

// // Calculate kernel regression parameters
// const kernRegParam = function(x0) {
//     const w = x.map((v) => triKernel(x0, v, bw.Value()));
//     let a, b;
//     [a, b] = wls(x, y, w);
//     return a + b*x0;
// }




// // Draw local regression line
// const kernelLine1 = brd.create('functiongraph',
//     [kernRegParam, lb, ub],
//     {
//         strokeWidth: 2,
//         strokeColor: JXG.palette.orange,
//     });



// Draw kernel regression line
const kernelLine2 = brd.create('functiongraph',
    [(x) => kernReg(x, bw.Value()), 0, mid],
    {
        strokeWidth: 2,
        strokeColor: JXG.palette.red,
    });




// Draw weights
const weightLine = brd.create('functiongraph',
    (x) => kernel(x0.Value(), x, bw.Value(), kernelFunc),
    {
        strokeWidth: 1,
        strokeColor: JXG.palette.skyblue,
    });


