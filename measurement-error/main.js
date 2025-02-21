JXG.Options.text.useMathJax = true;
      
// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
    {boundingbox: [-1, 10, 10, -1],
        axis:false,
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

const xAxis = brd.create('axis',
    [[0, 0], [1, 0]],
    {straightFirst: false,
        name: 'x',
        withLabel: true,
        label: {
            position: 'rt',
            anchorX: 'right',
            anchorY: 'bottom',
            fontSize: 18,
        },
        ticks: { visible: false}});
const yAxis = brd.create('axis',
    [[0, 0], [0, 1]],
    {straightFirst: false,
        name: 'y',
        withLabel: true,
        label: {
            position: 'rt',
            anchorX: 'left',
            anchorY: 'top',
            fontSize: 18,
        },
        ticks: { visible: false }});
      

// Sliders
const errX = brd.create('slider',
    [[1, 9], [5, 9], [0, 0, 10]],
    {name:'\\(\\sigma^2_{e_x}\\)'}),
errY = brd.create('slider',
    [[1, 8], [5, 8], [0, 0, 10]],
    {name:'\\(\\sigma^2_{e_y}\\)'});



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

// No. of points
n = 200;
const x = [...Array(n).keys().map((x) => (8*x/(n-1) + 1))];
const e = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const y = stats.add(e,
    stats.add(1,
        stats.multiply(0.5, x)
    )
);

// Measurement errors
const ex = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];
const ey = [...Array(n).keys().map((x) => JXG.Math.Statistics.randomNormal(0, 1))];


// Plot data with errors
x.forEach((x, i) => {
    const y = 1 + 0.5*x + e[i];
    brd.create('point', [() => {return x+Math.sqrt(errX.Value())*ex[i]},
        () => {return y+Math.sqrt(errY.Value())*ey[i]}],
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
    let xObs = stats.add(x, stats.multiply(Math.sqrt(errX.Value()), ex));
    let yObs = stats.add(y, stats.multiply(Math.sqrt(errY.Value()), ey));
    let aObs, bObs;
    [aObs, bObs] = ols(xObs, yObs);
    return aObs + bObs*v;
};

const regLineObsPlot = brd.create('functiongraph',
    [regLineObs, 0, 10],
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

const regLine = brd.create('functiongraph',
    [olsFit, 0, 10],
    {
    strokeWidth: 3,
    strokeColor: JXG.palette.blue
});


const regLineObsBeta = function() {
    let xObs = stats.add(x, stats.multiply(Math.sqrt(errX.Value()), ex));
    let yObs = stats.add(y, stats.multiply(Math.sqrt(errY.Value()), ey));
    let aObs, bObs;
    [aObs, bObs] = ols(xObs, yObs);
    return bObs.toFixed(2);
};

// Show true and estimated slope parameters
const trueBeta = '\\(\\beta\\) = ' + b.toFixed(2);
const obsBeta = function() {return '\\(\\hat{\\beta}\\) = ' + regLineObsBeta();};

brd.create('text', [3, 1, '\\(\\beta\\) = 0.5'], {fontSize: 18,
    color:JXG.palette.blue});
brd.create('text', [7, 1, obsBeta], {fontSize: 18,
    color:JXG.palette.red});


// Show standard error

const regLineObsParam = function() {
    let xObs = stats.add(x, stats.multiply(Math.sqrt(errX.Value()), ex));
    let yObs = stats.add(y, stats.multiply(Math.sqrt(errY.Value()), ey));
    let aObs, bObs;
    [aObs, bObs] = ols(xObs, yObs);
    return [aObs, bObs];
};

const residuals = function() {
    let a, b;
    [a, b] = regLineObsParam();
    const xObs = stats.add(x, stats.multiply(Math.sqrt(errX.Value()), ex));
    const yObs = stats.add(y, stats.multiply(Math.sqrt(errY.Value()), ey));
    const yHat = stats.add(a, stats.multiply(b, xObs));
    resids = stats.subtract(yObs, yHat);
    return resids;
};

const se = function() {
    const r = residuals();
    const se = Math.sqrt(
        (1 / (n - 2)) * stats.sum(stats.multiply(r, r)) /
            stats.sum(stats.multiply(stats.subtract(x, stats.mean(x)), stats.subtract(x, stats.mean(x))))
    );
    return se;
};

const printSe = function() {
    seVal = se();
    return 'SE = ' + seVal.toFixed(3);
};

brd.create('text', [7, 0.5, printSe],
    {fontSize: 18,
    color:JXG.palette.red});
