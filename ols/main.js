JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');

// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
        {
                boundingbox: [-10, 10, 10, -10],
                axis: true,
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
                                ticks: { visible: false }
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
                                ticks: { visible: false }
                        }
                },
                showNavigation: false,
                showCopyright: false
        });

// Sliders
const alpha = brd.create('slider', [[-8, -6], [0, -6], [-6, 0, 6]], { name: '\\(\\alpha\\)' });
beta = brd.create('slider', [[-8, -8], [0, -8], [-2, 1, 2]], { name: '\\(\\beta\\)' });

const ols_fit = (x) => alpha.Value() + beta.Value() * x;

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
const x = [...Array(n).keys().map((x) => (20 * x / (n - 1) - 10))];
const e = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 2))];
const y = add(e,
        add(1,
                mult(0.5, x)
        )
);

function alphaVal() { return alpha.Value(); };
function betaVal() { return beta.Value(); };

function yPred(x) {
        return add(alphaVal(),
                mult(betaVal(), x)
        )
};

function yPred2() {
        return add(alphaVal(),
                mult(betaVal(), x)
        )
};

// Plot data
x.forEach((x, i) => {
        const y = 1 + 0.5 * x + e[i];
        brd.create('point', [x, y], { name: '', size: 2, color: blue });
});

// Plot residuals
x.forEach((x, i) => {
        function yP() { return yPred(x); };
        brd.create('segment', [[x, y[i]], [x, yP]], { strokeWidth: 1, dash: 2, color: blue });
});


// Calculate MSE
function MSE() {
        const residuals = sub(y, yPred2());
        return sum(
                mult(residuals, residuals)
        ) / n
};

function MSEVal() { return 'MSE = ' + MSE().toFixed(2); };
brd.create('text', [5, -5, MSEVal], { fontSize: 18 });



// Graph MSE
const brdGradient = JXG.JSXGraph.initBoard('gradient', { boundingbox: [-2.5, .5, .5, -2], axis: false, showNavigation: false, showCopyright: false });

brd.addChild(brdGradient);

var box = [-2, 2];
var view = brdGradient.create('view3d',
        [
                [-2, -2], [2, 2],
                [[-6, 6], box, [0, 2]]
        ],
        {
                xPlaneRear: { visible: false },
                yPlaneRear: { visible: false },
                xAxis: {
                        withLabel: true,
                        name: '\\(\\alpha\\)'
                },
                yAxis: {
                        withLabel: true,
                        name: '\\(\\beta\\)'
                },
                zAxis: {
                        withLabel: true,
                        name: 'MSE'
                },
        });

function yPred3(a, b) {
        return add(a,
                mult(b, x)
        )
};

function MSE2(a, b) {
        const residuals = sub(y, yPred3(a, b));
        const mse = sum(
                mult(residuals, residuals)
        ) / n;
        return mse / 100;
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
        [() => [alpha.Value(),
        beta.Value(),
        MSE2(alpha.Value(),
                beta.Value())],
        () => [alpha.Value(),
        beta.Value(), 0],
        ],
        {
                point1: {
                        visible: true,
                        size: 3,
                        gradient: false,
                        color: red
                }, point2: { visible: false }
        });

