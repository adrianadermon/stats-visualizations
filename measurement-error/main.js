JXG.Options.text.useMathJax = true;
      
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
const errX = brd.create('slider', [[-8, -6], [0, -6], [0, 0, 10]], {name:'\\(\\sigma^2_{e_x}\\)'}),
errY = brd.create('slider', [[-8, -8], [0, -8], [0, 0, 10]], {name:'\\(\\sigma^2_{e_y}\\)'});



// Useful vector functions
const stats = JXG.Math.Statistics;

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



// Data

// Useful vector functions
const add = JXG.Math.Statistics.add,
            mult = JXG.Math.Statistics.multiply,
            sub = JXG.Math.Statistics.subtract,
            sum = JXG.Math.Statistics.sum;

// No. of points
n = 200;
const x = [...Array(n).keys().map((x) => (20*x/(n-1) - 10))];
const e = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const y = add(e,
    add(1,
        mult(0.5, x)
    )
);

// Measurement errors
const ex = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const ey = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];


// Plot data with errors
x.forEach((x, i) => {
    const y = 1 + 0.5*x + e[i];
    brd.create('point', [() => {return x+errX.Value()*ex[i]},
    () => {return y+errY.Value()*ey[i]}],
    {name:'', size:2, color:JXG.palette.red, opacity: 0.5});
});

// Plot true data
x.forEach((x, i) => {
    const y = 1 + 0.5*x + e[i];
    brd.create('point', [x, y],
    {name:'', size:2, color:JXG.palette.blue});
});



// Plot regression line with errors
const regLineObs = function(v) {
    let xObs = add(x, mult(errX.Value(), ex));
    let yObs = add(y, mult(errY.Value(), ey));
    let aObs, bObs;
    [aObs, bObs] = ols(xObs, yObs);
    return aObs + bObs*v;
};

const regLineObsPlot = brd.create('functiongraph',
      regLineObs,
        {
            strokeWidth: 3,
            strokeColor: JXG.palette.red,
            strokeOpacity: 0.5
        }
);

// Plot true regression line
let a, b;
[a, b] = ols(x, y);

const olsFit = function(x, y) {
    return 1 + 0.5*x;
};       

const regLine = brd.create('functiongraph', olsFit, {
    strokeWidth: 3,
    strokeColor: JXG.palette.blue
});


const regLineObsBeta = function() {
    let xObs = add(x, mult(errX.Value(), ex));
    let yObs = add(y, mult(errY.Value(), ey));
    let aObs, bObs;
    [aObs, bObs] = ols(xObs, yObs);
    return bObs.toFixed(2);
};

// const MSEVal = function() {return 'MSE = ' + MSE().toFixed(2);};
const trueBeta = '\\(\\beta\\) = ' + b.toFixed(2);
const obsBeta = function() {return '\\(\\hat{\\beta}\\) = ' + regLineObsBeta();};

brd.create('text', [5, -5, '\\(\\beta\\) = 0.5'], {fontSize: 18,
    color:JXG.palette.blue});
brd.create('text', [5, -7, obsBeta], {fontSize: 18,
    color:JXG.palette.red});
