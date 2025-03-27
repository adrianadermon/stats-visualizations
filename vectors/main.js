JXG.Options.text.useMathJax = true;

const brd = JXG.JSXGraph.initBoard('jxgbox',
    { boundingbox: [-10, 10, 10, -10],
        axis: true,
        showNavigation: false,
        showCopyright: false
    });


const origin = brd.create('point',[0, 0],
    {
        visible : false
    });

const p1 = brd.create('point', [1, 1],
    { name: 'a' });
const l1 = brd.create('arrow', [origin, p1],
    { fixed: true });

const p2 = brd.create('point', [1, 2],
    { name: 'b' });
const l2 = brd.create('arrow', [origin, p2],
    { fixed: true });


function dotProduct() {
    return p1.X() * p2.X() + p1.Y() * p2.Y();
};



const aVec = brd.create('text',
    [4, 4,
        () => '\\[\\boldsymbol{a} = \\begin{bmatrix}' + p1.X().toFixed(2) + '\\\\' + p1.Y().toFixed(2) + '\\end{bmatrix}\\]']);

const bVec = brd.create('text',
    [4, 3,
        () => '\\[\\boldsymbol{b} = \\begin{bmatrix}' + p2.X().toFixed(2) + '\\\\' + p2.Y().toFixed(2) + '\\end{bmatrix}\\]']);

const dotProd = brd.create('text', [4, 2, () => '\\[\\boldsymbol{a} \\cdot \\boldsymbol{b} =' + dotProduct().toFixed(2) + '\\]']);


// var box = [0, 2];
// var view = brd.create('view3d',
//     [
//         [-2, -2], [2, 2],
//         [box, box, box]
//     ],
//     {
//         xPlaneRear: { visible: true },
//         yPlaneRear: { visible: true },
//         xAxis: {
//             withLabel: true,
//             name: 'x'
//         },
//         yAxis: {
//             withLabel: true,
//             name: 'y'
//         },
//         zAxis: {
//             withLabel: true,
//             name: 'z'
//         },
//     });

// const l1 = view.create('arrow',
//     [[0, 0, 0], [1, 1, 1]],
//     {point1: {visible: true},
//         point2: {visible: true}
//     });
