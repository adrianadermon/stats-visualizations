JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');

// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
    {boundingbox: [-10, 10, 10, -10],
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
const alpha = brd.create('slider', [[-8, -6], [0, -6], [-6, 0, 6]], {name:'\\(\\alpha\\)'});
beta1 = brd.create('slider', [[-8, -7], [0, -7], [-2, 1, 2]], {name:'\\(\\beta_1\\)'});
beta2 = brd.create('slider', [[-8, -8], [0, -8], [-2, 1, 2]], {name:'\\(\\beta_2\\)'});


const ols_fit = (x) => alpha.Value() + beta1.Value() * x + beta2.Value() * x**2;

const regLine = brd.create('functiongraph', ols_fit, {
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
n = 30;
const x = [...Array(n).keys().map((x) => (20*x/(n-1) - 10))];

const trueModel = function(x) {return 1 + 0.5*x + 0.2*x**2 + JXG.Math.Statistics.randomNormal(0, 2)};

const y = x.map(trueModel);

const alphaVal = function() {return alpha.Value();};
const beta1Val = function() {return beta1.Value();};
const beta2Val = function() {return beta2.Value();};

function yPred(x) {return alphaVal() + beta1Val()*x + beta2Val()*x**2};

// Plot data
x.forEach((x, i) => {
    brd.create('point', [x, y[i]], {name:'', size:2, color:blue});
});

// Plot residuals
x.forEach((x, i) => {
    const yP = function() {return yPred(x);};
    brd.create('segment', [[x, y[i]], [x, yP]], {strokeWidth:1, dash:2, color:blue});
});

// Calculate MSE
function MSE() {
    const residuals = y.map((v, i) => {return v - yPred(x[i])});
    const resSq = residuals.map((v) => {return v**2});
    return JXG.Math.Statistics.sum(resSq) / n
};
      
const MSEVal = function() {return 'MSE = ' + MSE().toFixed(2);};
// brd.create('text', [5, -5, 'MSE = ' + MSE().toFixed(2)]);
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
            name: '\\(\\beta_1\\)'},
        yAxis: {withLabel: true,
            name: '\\(\\beta_2\\)'},
        zAxis: {withLabel: true,
            name: 'MSE'},
    });


function yPred2(x, a, b1, b2) {return a + b1*x + b2*x**2};

function MSE2(b1, b2) {
    const residuals = y.map((v, i) => {return v - yPred2(x[i], alphaVal(), b1, b2)});
    const resSq = residuals.map((v) => {return v**2});
    const mse = JXG.Math.Statistics.sum(resSq) / n
    return mse/10000;
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

// MSE point + drop line
const l1 = view.create('line3d',
    [function() {
        return [beta1.Value(),
            beta2.Value(),
            MSE2(beta1.Value(),
                beta2.Value())];
    },
        function() {
            return [beta1.Value(),
                beta2.Value(), 0];
        }],
    {point1: {visible: true,
        size: 3,
        gradient: false,
        color: red}, point2: {visible: false} });
      
