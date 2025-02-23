JXG.Options.text.useMathJax = true;

import { relu, sigmoid, leakyRelu, hardSwish } from '../modules/activation-functions.js';

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');
const black = documentCSS.getPropertyValue('--graph-black');
const green = documentCSS.getPropertyValue('--graph-green');
const orange = documentCSS.getPropertyValue('--graph-orange');

// Coordinate ranges for 3D view
const box = [-5, 5];

// Lower left corner of 3D view
const lower = [0, -2];

// Width and height of 3D view
const dim = [4, 4];

// Boards
const board_dims = [-2, 4, 6, -4];

const board_output = JXG.JSXGraph.initBoard('controls.output', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_lin_output = JXG.JSXGraph.initBoard('lin.output', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false });

board_output.addChild(board_lin_output);

const board_h1 = JXG.JSXGraph.initBoard('controls.h1', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_lin_h1 = JXG.JSXGraph.initBoard('lin.h1', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_clip_h1 = JXG.JSXGraph.initBoard('clip.h1', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_scale_h1 = JXG.JSXGraph.initBoard('scale.h1', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false });

board_h1.addChild(board_lin_h1);
board_h1.addChild(board_clip_h1);
board_h1.addChild(board_scale_h1);
board_h1.addChild(board_lin_output);

board_output.addChild(board_clip_h1);
board_output.addChild(board_scale_h1);

const board_h2 = JXG.JSXGraph.initBoard('controls.h2', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_lin_h2 = JXG.JSXGraph.initBoard('lin.h2', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_clip_h2 = JXG.JSXGraph.initBoard('clip.h2', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_scale_h2 = JXG.JSXGraph.initBoard('scale.h2', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false });

board_h2.addChild(board_lin_h2);
board_h2.addChild(board_clip_h2);
board_h2.addChild(board_scale_h2);
board_h2.addChild(board_lin_output);

board_output.addChild(board_clip_h2);
board_output.addChild(board_scale_h2);

const board_h3 = JXG.JSXGraph.initBoard('controls.h3', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_lin_h3 = JXG.JSXGraph.initBoard('lin.h3', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_clip_h3 = JXG.JSXGraph.initBoard('clip.h3', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false }),
        board_scale_h3 = JXG.JSXGraph.initBoard('scale.h3', { boundingbox: board_dims, axis: false, showNavigation: false, showCopyright: false });

board_h3.addChild(board_lin_h3);
board_h3.addChild(board_clip_h3);
board_h3.addChild(board_scale_h3);
board_h3.addChild(board_lin_output);

board_output.addChild(board_clip_h3);
board_output.addChild(board_scale_h3);

// Sliders
const sleft = -1,
        sright = 3,
        t0h = 3,
        t1h = 2,
        t2h = 1,
        p0h = 3,
        p1h = 2,
        p2h = 1,
        p3h = 0,
        srange = [-3, 1, 3];

const t0param = [[sleft, t0h], [sright, t0h], srange],
        t1param = [[sleft, t1h], [sright, t1h], srange],
        t2param = [[sleft, t2h], [sright, t2h], srange],
        p0param = [[sleft, p0h], [sright, p0h], srange],
        p1param = [[sleft, p1h], [sright, p1h], srange],
        p2param = [[sleft, p2h], [sright, p2h], srange],
        p3param = [[sleft, p3h], [sright, p3h], srange];

const satts = { withTicks: false }

const p0 = board_output.create('slider', p0param, { ...{ name: '\\(\\phi_0\\)' }, ...satts }),
        p1 = board_output.create('slider', p1param, { ...{ name: '\\(\\phi_1\\)' }, ...satts }),
        p2 = board_output.create('slider', p2param, { ...{ name: '\\(\\phi_2\\)' }, ...satts }),
        p3 = board_output.create('slider', p3param, { ...{ name: '\\(\\phi_3\\)' }, ...satts }),

        t10 = board_h1.create('slider', t0param, { ...{ name: '\\(\\theta_{10}\\)' }, ...satts }),
        t11 = board_h1.create('slider', t1param, { ...{ name: '\\(\\theta_{11}\\)' }, ...satts }),
        t12 = board_h1.create('slider', t2param, { ...{ name: '\\(\\theta_{12}\\)' }, ...satts }),

        t20 = board_h2.create('slider', t0param, { ...{ name: '\\(\\theta_{20}\\)' }, ...satts }),
        t21 = board_h2.create('slider', t1param, { ...{ name: '\\(\\theta_{21}\\)' }, ...satts }),
        t22 = board_h2.create('slider', t2param, { ...{ name: '\\(\\theta_{22}\\)' }, ...satts }),

        t30 = board_h3.create('slider', t0param, { ...{ name: '\\(\\theta_{30}\\)' }, ...satts }),
        t31 = board_h3.create('slider', t1param, { ...{ name: '\\(\\theta_{31}\\)' }, ...satts }),
        t32 = board_h3.create('slider', t2param, { ...{ name: '\\(\\theta_{32}\\)' }, ...satts });


const start_button = board_output.create('button',
        [-1, -1, 'Start rotation', () => start_animation()]);
const stop_button = board_output.create('button',
        [-1, -2, 'Stop rotation', () => stop_animation()]);

const elSlider = board_output.create('slider', [[sleft, -3], [sright, -3], [0, Math.PI / 4, Math.PI / 2]], { ...{ name: 'Elevation' }, ...satts }),
        azSlider = board_output.create('slider', [[sleft, -4], [sright, -4], [0, Math.PI / 4, 2 * Math.PI]], { ...{ name: 'Azimuth' }, ...satts });

// Text
const title_lin_h1 = board_lin_h1.create('text', [-1.5, 3.5, '\\[\\theta_{10} + \\theta_{11} x_1 + \\theta_{12} x_2\\]']),
        title_clip_h1 = board_clip_h1.create('text', [-1.5, 3.5, '\\[h_1 = a[\\theta_{10} + \\theta_{11} x_1 + \\theta_{12} x_2]\\]']),
        title_scale_h1 = board_scale_h1.create('text', [-1.5, 3.5, '\\[\\phi_1 h_1\\]']),

        title_lin_h2 = board_lin_h2.create('text', [-1.5, 3.5, '\\[\\theta_{20} + \\theta_{21} x_1 + \\theta_{22} x_2\\]']),
        title_clip_h2 = board_clip_h2.create('text', [-1.5, 3.5, '\\[h_2 = a[\\theta_{20} + \\theta_{21} x_1 + \\theta_{22} x_2]\\]']),
        title_scale_h2 = board_scale_h2.create('text', [-1.5, 3.5, '\\[\\phi_2 h_2\\]']),

        title_lin_h3 = board_lin_h3.create('text', [-1.5, 3.5, '\\[\\theta_{30} + \\theta_{31} x_1 + \\theta_{32} x_3\\]']),
        title_clip_h3 = board_clip_h3.create('text', [-1.5, 3.5, '\\[h_3 = a[\\theta_{30} + \\theta_{31} x_1 + \\theta_{32} x_3]\\]']),
        title_scale_h3 = board_scale_h3.create('text', [-1.5, 3.5, '\\[\\phi_3 h_3\\]']),

        title_lin_output = board_lin_output.create('text', [-1.5, 3.5, '\\[y = \\phi_0 + \\phi_1 h_1 + \\phi_2 h_2 + \\phi_3 h_3\\]']);

// Functions
let activationMenu = document.getElementById('activation-select');
activationMenu.addEventListener('change', setActivationFunction);

let activation = relu;

function setActivationFunction(event) {
        if (activationMenu.value == 'relu') {
                activation = relu;
                board_output.fullUpdate();
        } else if (activationMenu.value == 'sigmoid') {
                activation = sigmoid;
                board_output.fullUpdate();
        } else if (activationMenu.value == 'leaky_relu') {
                activation = leakyRelu;
                board_output.fullUpdate();
        } else if (activationMenu.value == 'hardswish') {
                activation = hardSwish;
                board_output.fullUpdate();
        } else if (activationMenu.value == 'passthrough') {
            activation = (x) => x;
                board_output.fullUpdate();
        }
};




function lin_h1(x1, x2) {
        return t10.Value() + t11.Value() * x1 + t12.Value() * x2
};
function clip_h1(x1, x2) {
        return activation(lin_h1(x1, x2))
};
function scale_h1(x1, x2) {
        return p1.Value() * clip_h1(x1, x2)
};

function lin_h2(x1, x2) {
        return t20.Value() + t21.Value() * x1 + t22.Value() * x2
};
function clip_h2(x1, x2) {
        return activation(lin_h2(x1, x2))
};
function scale_h2(x1, x2) {
        return p2.Value() * clip_h2(x1, x2)
};

function lin_h3(x1, x2) {
        return t30.Value() + t31.Value() * x1 + t32.Value() * x2
};
function clip_h3(x1, x2) {
        return activation(lin_h3(x1, x2))
};
function scale_h3(x1, x2) {
        return p3.Value() * clip_h3(x1, x2)
};

function lin_output(x1, x2) {
        return p0.Value() + scale_h1(x1, x2) + scale_h2(x1, x2) + scale_h3(x1, x2)
};

// Function to create view
function make_view(board) {
        return board.create('view3d',
                [
                        lower, dim,
                        [box, box, box]
                ],
                {
                        xPlaneRear: { visible: false },
                        yPlaneRear: { visible: false },
                        axis: true,
                        axesPosition: 'center',
                        xAxis: {
                                name: '\\(X_1\\)',
                                // strokeColor: 'red',
                                withLabel: true,
                                label: { position: 'last', autoPosition: true }
                        },
                        yAxis: {
                                name: '\\(X_2\\)',
                                // strokeColor: 'green',
                                withLabel: true,
                                label: { position: 'last', autoPosition: true }
                        },
                        zAxis: {
                                name: '\\(y\\)',
                                // strokeColor: 'blue',
                                withLabel: true,
                                label: { position: 'last', autoPosition: true }
                        },
                        az: { pointer: { enabled: false } },
                        bank: { pointer: { enabled: false } },
                        el: { pointer: { enabled: false } },
                })
};

// Function to plot 3D surface
function surf_plot(view, f, color) {
        return view.create('functiongraph3d', [
                f,
                box, // () => [-s.Value()*5, s.Value() * 5],
                box, // () => [-s.Value()*5, s.Value() * 5],
        ], {
                strokeWidth: 0.5,
                stepsU: 10,
                stepsV: 10,
                strokeColor: color
        })
};

// Output layer
const view_lin_output = make_view(board_lin_output)

surf_plot(view_lin_output, lin_output, orange);

// h1
const view_lin_h1 = make_view(board_lin_h1)

surf_plot(view_lin_h1, lin_h1, blue);

const view_clip_h1 = make_view(board_clip_h1)

surf_plot(view_clip_h1, clip_h1, red);

const view_scale_h1 = make_view(board_scale_h1)

surf_plot(view_scale_h1, scale_h1, green);

// h2      
const view_lin_h2 = make_view(board_lin_h2)

surf_plot(view_lin_h2, lin_h2, blue);

const view_clip_h2 = make_view(board_clip_h2)

surf_plot(view_clip_h2, clip_h2, red);

const view_scale_h2 = make_view(board_scale_h2)

surf_plot(view_scale_h2, scale_h2, green);

// h3
const view_lin_h3 = make_view(board_lin_h3)

surf_plot(view_lin_h3, lin_h3, blue);

const view_clip_h3 = make_view(board_clip_h3)

surf_plot(view_clip_h3, clip_h3, red);

const view_scale_h3 = make_view(board_scale_h3)

surf_plot(view_scale_h3, scale_h3, green);



azSlider.on('drag', () => {
        view_lin_h1.setView(azSlider.Value(), elSlider.Value());
        view_clip_h1.setView(azSlider.Value(), elSlider.Value());
        view_scale_h1.setView(azSlider.Value(), elSlider.Value());
        view_lin_h2.setView(azSlider.Value(), elSlider.Value());
        view_clip_h2.setView(azSlider.Value(), elSlider.Value());
        view_scale_h2.setView(azSlider.Value(), elSlider.Value());
        view_lin_h3.setView(azSlider.Value(), elSlider.Value());
        view_clip_h3.setView(azSlider.Value(), elSlider.Value());
        view_scale_h3.setView(azSlider.Value(), elSlider.Value());
        view_lin_output.setView(azSlider.Value(), elSlider.Value());
});

elSlider.on('drag', () => {
        view_lin_h1.setView(azSlider.Value(), elSlider.Value());
        view_clip_h1.setView(azSlider.Value(), elSlider.Value());
        view_scale_h1.setView(azSlider.Value(), elSlider.Value());
        view_lin_h2.setView(azSlider.Value(), elSlider.Value());
        view_clip_h2.setView(azSlider.Value(), elSlider.Value());
        view_scale_h2.setView(azSlider.Value(), elSlider.Value());
        view_lin_h3.setView(azSlider.Value(), elSlider.Value());
        view_clip_h3.setView(azSlider.Value(), elSlider.Value());
        view_scale_h3.setView(azSlider.Value(), elSlider.Value());
        view_lin_output.setView(azSlider.Value(), elSlider.Value());
});



// Rotate graphs
function start_animation() {
        view_lin_output.animateAzimuth(),
                view_lin_h1.animateAzimuth(),
                view_clip_h1.animateAzimuth(),
                view_scale_h1.animateAzimuth(),
                view_lin_h2.animateAzimuth(),
                view_clip_h2.animateAzimuth(),
                view_scale_h2.animateAzimuth(),
                view_lin_h3.animateAzimuth(),
                view_clip_h3.animateAzimuth(),
                view_scale_h3.animateAzimuth()
};

function stop_animation() {

        view_lin_output.stopAzimuth(),
                view_lin_h1.stopAzimuth(),
                view_clip_h1.stopAzimuth(),
                view_scale_h1.stopAzimuth(),
                view_lin_h2.stopAzimuth(),
                view_clip_h2.stopAzimuth(),
                view_scale_h2.stopAzimuth(),
                view_lin_h3.stopAzimuth(),
                view_clip_h3.stopAzimuth(),
                view_scale_h3.stopAzimuth()
};
