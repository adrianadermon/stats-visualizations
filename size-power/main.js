JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue'),
        red = documentCSS.getPropertyValue('--graph-red'),
        black = documentCSS.getPropertyValue('--graph-black'),
        green = documentCSS.getPropertyValue('--graph-green');


// Board
const brd = JXG.JSXGraph.initBoard('jxgbox',
        {
                boundingbox: [-3, 1, 5, -1],
                axis: false,
                showNavigation: false,
                showCopyright: false
        });

const xAxis = brd.create('axis',
        [[-3, 0], [3, 0]],
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
const mu = brd.create('slider', [[1, 0.5], [2, 0.5], [-1, 1, 5]], { name: '\\(\\mu\\)' }),
        sigmaSq = brd.create('slider', [[1, 0.4], [2, 0.4], [0.1, 1, 2]], { name: '\\(\\sigma^2\\)' });

function getMu() { return mu.Value() };
function getSigmaSq() { return sigmaSq.Value() };


// Normal density
function normalPDF(x, mu, sigmaSq) {
    const f = (1 / (Math.sqrt(2*Math.PI*sigmaSq))) * Math.exp(-((x - mu)**2/(2*sigmaSq)));
    return f;
};

// Draw standard normal density
const standNormDensity = brd.create('functiongraph',
    (x) => normalPDF(x, 0, 1),
        {
                strokeWidth: 2,
                strokeColor: blue,
        });


// Draw normal density
const normDensity = brd.create('functiongraph',
    (x) => normalPDF(x, getMu(), getSigmaSq()),
        {
                strokeWidth: 2,
                strokeColor: green,
        });



// Shade area
let left = 1.96,
    right = 3,
    x = [],
    y = [];

for (let i = 0; i < standNormDensity.numberPoints; i++) {
    if (left <= standNormDensity.points[i].usrCoords[1] && standNormDensity.points[i].usrCoords[1] <= right) {
        x.push(standNormDensity.points[i].usrCoords[1]);
        y.push(standNormDensity.points[i].usrCoords[2]);
    };
};

x.push(right);
y.push(0);

x.push(left);
y.push(0);

const rejectionRegion = brd.create('curve',
    [x, y],
    {color: green,
    opacity: 0.2});




let rejectionRegion2 = brd.create('curve',
    [[], []],
    {color: red,
    opacity: 0.2});

rejectionRegion2.updateDataArray = function() {
    let left2 = -3,
    right2 = getMu() - 0.84;
    
    this.dataX = [];
    this.dataY = [];

    for (let i = 0; i < normDensity.numberPoints; i++) {
        if (left2 <= normDensity.points[i].usrCoords[1] && normDensity.points[i].usrCoords[1] <= right2) {
            this.dataX.push(normDensity.points[i].usrCoords[1]);
            this.dataY.push(normDensity.points[i].usrCoords[2]);
        };
    };

    this.dataX.push(right2);
    this.dataY.push(0);

    this.dataX.push(left2);
    this.dataY.push(0);
};

brd.update();

