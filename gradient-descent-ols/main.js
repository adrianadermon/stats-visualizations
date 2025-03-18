JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');

// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
    {boundingbox: [-1, 10, 10, -1],
        axis:true,
        defaultAxes: {
            x: {
                name: 'x',
                withLabel: true,
                label: {
                    position: 'rt',
                    anchorX: 'right',
                    anchorY: 'bottom',
                    fontSize: 18,
                },
                ticks: {visible: false}
            },
            y: {
                name: 'y',
                withLabel: true,
                label: {
                    position: 'rt',
                    anchorX: 'left',
                    anchorY: 'top',
                    fontSize: 18,
                },
                ticks: {visible: false}
            }
        },
        showNavigation:false,
        showCopyright:false});
      
// Sliders
let // alpha = 4*Math.random() - 2,
    // beta = 2* Math.random() - 1,
    a0 = 4*Math.random() - 2,
    b0 = 2*Math.random() - 1;

// const alpha = brd.create('slider', [[-8, -6], [0, -6], [-6, 0, 6]], {name:'\\(\\alpha\\)'});
// beta = brd.create('slider', [[-8, -8], [0, -8], [-2, 1, 2]], {name:'\\(\\beta\\)'});

const olsFit = (x) => a0 + b0 * x;

const regLine = brd.create('functiongraph', olsFit, {
    strokeWidth: 3,
    strokeColor: blue
});

// Data

// Useful vector functions
const add = JXG.Math.Statistics.add,
            mult = JXG.Math.Statistics.multiply,
            sub = JXG.Math.Statistics.subtract,
            sum = JXG.Math.Statistics.sum;


// No. of points
const n = 20;
// Error variance
const eVar = 2;
// parameters
const a = 1,
      b = 1;
const i = [...Array(n).keys()]
const x = i.map((x) => (9 * x / (n - 1)) + 0.5);
const e = i.map(() => JXG.Math.Statistics.randomNormal(0, eVar));

// DGP
function dgp(x, e) {
    const y = a + b*x + e;
    return y;
};

const y = i.map((i) => dgp(x[i], e[i]));

// Plot data
x.forEach((x, i) => {
    const y = a + b*x + e[i];
    brd.create('point', [x, y], {name:'', size:2, color:blue});
});


// Gradients
function dLossAlpha(a, b, x, y) {
    return 2*(a + b*x - y)
};

function dLossBeta(a, b, x, y) {
    return 2*x*(a + b*x - y)
};

// Calculate gradients
let ga = sum(i.map((i) => dLossAlpha(a0, b0, x[i], y[i])));
let gb = sum(i.map((i) => dLossBeta(a0, b0, x[i], y[i])));

// Gradient learning rate
let learningRate = 0.0001;

let a1 = a0 - learningRate * ga;
let b1 = b0 - learningRate * gb;


const regLine1 = brd.create('functiongraph',
    (x) => a1 + b1 * x,
    {
    strokeWidth: 3,
    strokeColor: red
    });



















const alphaVal = function() {return alpha.Value();};
const betaVal = function() {return beta.Value();};

function yPred(x) {
    return add(alphaVal(),
        mult(betaVal(), x)
    )};
          
function yPred2() {
    return add(alphaVal(),
        mult(betaVal(), x)
    )};


// // Plot residuals
// x.forEach((x, i) => {
//     const yP = function() {return yPred(x);};
//     brd.create('segment', [[x, y[i]], [x, yP]], {strokeWidth:1, dash:2, color:blue});
// });


// Calculate MSE
function MSE() {
    const residuals = sub(y, yPred2());
    return sum(
        mult(residuals, residuals)
    ) / n
};
      
const MSEVal = function() {return 'MSE = ' + MSE().toFixed(2);};
brd.create('text', [5, -5, MSEVal], {fontSize: 18});



// Graph MSE
const brdGradient = JXG.JSXGraph.initBoard('gradient', {boundingbox: [-2.5, .5, .5, -2], axis:false, showNavigation:false, showCopyright:false});

brd.addChild(brdGradient);

var box = [-2, 2];
var view = brdGradient.create('view3d',
    [
        [-2, -2], [2, 2],
        [[-6, 6], box, [0, 2]]
    ],
    {
        xPlaneRear: {visible: false},
        yPlaneRear: {visible: false},
        xAxis: {withLabel: true,
            name: '\\(\\alpha\\)'},
        yAxis: {withLabel: true,
            name: '\\(\\beta\\)'},
        zAxis: {withLabel: true,
            name: 'MSE'},
    });

function yPred3(a, b) {
    return add(a,
        mult(b, x)
    )};
      
function MSE2(a, b) {
    const residuals = sub(y, yPred3(a, b));
    const mse = sum(
        mult(residuals, residuals)
    ) / n;
    return mse/100;
};

// 3D surface
const c = view.create('functiongraph3d', [
    MSE2,
    [-6, 6],
    [-2, 2],
], {
    strokeWidth: 0.5,
    stepsU: 40,
    stepsV: 40
});

// const q = view.create('point3d', function() { return [alpha.Value(), beta.Value(), MSE2(alpha.Value(), beta.Value())]; },
//                       { name:'MSE', size: 5, fixed: true });

// MSE point + drop line
const l1 = view.create('line3d',
    [function() {
        return [alpha.Value(),
            beta.Value(),
            MSE2(alpha.Value(),
                beta.Value())];
    },
        function() {
            return [alpha.Value(),
                beta.Value(), 0];
        }],
    {point1: {visible: true,
        size: 3,
        gradient: false,
        color: red}, point2: {visible: false} });
      
