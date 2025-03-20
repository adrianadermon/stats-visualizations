JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');

// Board, training data
const brdTrain = JXG.JSXGraph.initBoard('train',
        {
            boundingbox: [-1, 10, 10, -1],
            axis: false,
            showNavigation: false,
            showCopyright: false
        });
const xAxisTrain = brdTrain.create('axis',
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
const yAxisTrain = brdTrain.create('axis',
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


// // Sliders
const pOrder = brdTrain.create('slider',
    [[1, 8], [3, 8], [1, 1, 19]],
    { name: 'Polynomial degree',
        snapWidth: 1,
        digits: 0});

function pVal() { return pOrder.Value(); };
// const olsFit = (x) => alpha.Value() + beta.Value() * x;

// Useful vector functions
const add = JXG.Math.Statistics.add,
        mult = JXG.Math.Statistics.multiply,
        sub = JXG.Math.Statistics.subtract,
        sum = JXG.Math.Statistics.sum;




// Board, test data
const brdTest = JXG.JSXGraph.initBoard('test',
        {
                boundingbox: [-1, 10, 10, -1],
                axis: false,
                showNavigation: false,
                showCopyright: false
        });
const xAxisTest = brdTest.create('axis',
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
const yAxisTest = brdTest.create('axis',
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


brdTrain.addChild(brdTest);

// Titles
const trainLabel = brdTrain.create('text',
        [1, -0.2, 'Training data']);
const testLabel = brdTest.create('text',
        [1, -0.2, 'Test data']);

// Data

// No. of points
const n = 20;
// Error variance
const eVar = 2;
// parameters
const b0 = 2,
      b1 = 2,
      b2 = -0.2;
const i = [...Array(n).keys()]
const x = i.map((x) => (9 * x / (n - 1)) + 0.5);
const eTrain = i.map((x) => JXG.Math.Statistics.randomNormal(0, eVar));
const eTest = i.map((x) => JXG.Math.Statistics.randomNormal(0, eVar));

// DGP
function dgp(x, e) {
    const y = b0 + b1*x + b2*x**2 + e;
    return y;
};

const yTrain = i.map((i) => dgp(x[i], eTrain[i]));
const yTest = i.map((i) => dgp(x[i], eTest[i]));

// Plot training data
i.forEach((i) => {
        brdTrain.create('point', [x[i], yTrain[i]], { name: '', size: 2, color: blue });
});

// Plot test data
i.forEach((i) => {
        brdTest.create('point', [x[i], yTest[i]], { name: '', size: 2, color: blue });
});

// Plot DGP
trainDGPLine = brdTrain.create('functiongraph',
[(x) => dgp(x, 0), 0.5, 9.5],
{
strokeWidth: 1,
strokeColor: blue,
dash: 4
});

testDGPLine = brdTest.create('functiongraph',
[(x) => dgp(x, 0), 0.5, 9.5],
{
strokeWidth: 1,
strokeColor: blue,
dash: 4
});


// function yPred3(a, b) {
//         return add(a,
//                 mult(b, x)
//         )
// };

// function MSE2(a, b) {
//         const residuals = sub(y, yPred3(a, b));
//         const mse = sum(
//                 mult(residuals, residuals)
//         ) / n;
//         return mse / 100;
// };

// OLS regression
function ols(X, y) {
    // X'X
    const XtX = math.multiply(math.transpose(X), X);

    // X'y
    const Xty = math.multiply(math.transpose(X), y);

    // Solve for b in X'X b = X'y with LU decomposition
    const b = math.lusolve(XtX, Xty)

    return b.valueOf().flat();
};

// Polynomial regression
function polyReg(x, y, P) {
    const n = x.length;
    let X = math.ones(n, 1);
    for (let p = 1; p <= P; p++) {
        v = math.matrixFromColumns(math.dotPow(x, p));
        X = math.concat(X, v);
    };
    b = ols(X, y);
    return b;
};

// Make prediction function
function polyPred(x, y, P) {
    const b = polyReg(x, y, P);
    // create prediction polynomial function here and return
    function pred(xVal) {
        let yPred = 0;
        for (const [i, v] of b.entries()) {
            yPred += v * xVal**i;
        };
        return yPred;
    };
    return pred;
};


let predFunc = polyPred(x, yTrain, pOrder.Value());

// Draw prediction line for training data
let trainPredLine = brdTrain.create('functiongraph',
    [predFunc, 0.5, 9.5],
    {
        strokeWidth: 3,
        strokeColor: blue
    });

// Draw prediction line for test data
let testPredLine = brdTest.create('functiongraph',
    [predFunc, 0.5, 9.5],
    {
        strokeWidth: 3,
        strokeColor: blue
    });

// Update prediction lines
pOrder.on('drag', function(e){
    predFunc = polyPred(x, yTrain, pOrder.Value());
    brdTrain.removeObject(trainPredLine);
    trainPredLine = brdTrain.create('functiongraph',
        [predFunc, 0.5, 9.5],
        {
            strokeWidth: 3,
            strokeColor: blue
        });
    brdTest.removeObject(testPredLine);
    testPredLine = brdTest.create('functiongraph',
        [predFunc, 0.5, 9.5],
        {
            strokeWidth: 3,
            strokeColor: blue
        });
});


// // Works, but slow because recalculates whole regression for each prediction point
// function predSlow(xVal) {
//     const b = polyReg(x, yTrain, pOrder.Value());
//     // create prediction polynomial function here and return
//     let yPred = 0;
//     for (const [i, v] of b.entries()) {
//         yPred += v * xVal**i;
//     };
//     return yPred;
// };

// // Draw prediction line for training data
// const trainPredLine = brdTrain.create('functiongraph',
//     [predSlow, 0.5, 9.5],
//     // [predFunc, 0.5, 9.5],
//     {
//         strokeWidth: 3,
//         strokeColor: blue
// });

// Plot residuals
x.forEach((x, i) => {
        function yP() { return predFunc(x); };
        brdTrain.create('segment', [[x, yTrain[i]], [x, yP]], { strokeWidth: 1, dash: 2, color: blue });
        brdTest.create('segment', [[x, yTest[i]], [x, yP]], { strokeWidth: 1, dash: 2, color: blue });
});


// Ugly code --- clean up!

// Calculate MSE
function MSE() {
        const residuals = i.map((i) => yTrain[i] - predFunc(x[i]));
        
        return sum(
                mult(residuals, residuals)
        ) / n
};

function MSEVal() { return 'MSE = ' + MSE().toFixed(2); };
brdTrain.create('text', [1, 9, MSEVal], { fontSize: 18 });

function MSETest() {
        const residuals = i.map((i) => yTest[i] - predFunc(x[i]));
        
        return sum(
                mult(residuals, residuals)
        ) / n
};

function MSETestVal() { return 'MSE = ' + MSETest().toFixed(2); };
brdTest.create('text', [1, 9, MSETestVal], { fontSize: 18 });

