JXG.Options.text.useMathJax = true;

// Get colors from CSS
const documentCSS = window.getComputedStyle(document.body);
const blue = documentCSS.getPropertyValue('--graph-blue');
const red = documentCSS.getPropertyValue('--graph-red');
const black = documentCSS.getPropertyValue('--graph-black');
const green = documentCSS.getPropertyValue('--graph-green');
const orange = documentCSS.getPropertyValue('--graph-orange');
      
// Coordinate ranges for 3D view
const box = [-5, 5];

// Boards
const board_dims = [-2, 4, 6, -4];
      
const board_output = JXG.JSXGraph.initBoard('controls.output',
    {boundingbox: board_dims,
        axis:false,
        showNavigation:false,
        showCopyright:false}),
            board_lin_output = JXG.JSXGraph.initBoard('lin.output',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            // name: 'x',
                            // withLabel: true,
                            // label: {
                            //     position: 'rt',
                            // },
                            ticks: {visible: false}
                        },
                        y: {
                            // name: 'y',
                            // withLabel: true,
                            // label: {
                            //     position: 'rt',
                            // },
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false});
      
board_output.addChild(board_lin_output);

const board_h1 = JXG.JSXGraph.initBoard('controls.h1',
    {boundingbox: board_dims,
        axis:false,
        showNavigation:false,
        showCopyright:false}),
            board_lin_h1 = JXG.JSXGraph.initBoard('lin.h1',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_clip_h1 = JXG.JSXGraph.initBoard('clip.h1',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_scale_h1 = JXG.JSXGraph.initBoard('scale.h1',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false});
      
board_h1.addChild(board_lin_h1);
board_h1.addChild(board_clip_h1);
board_h1.addChild(board_scale_h1);
board_h1.addChild(board_lin_output);
      
board_output.addChild(board_clip_h1);
board_output.addChild(board_scale_h1);
      
const board_h2 = JXG.JSXGraph.initBoard('controls.h2',
    {boundingbox: board_dims,
        axis:false,
        showNavigation:false,
        showCopyright:false}),
            board_lin_h2 = JXG.JSXGraph.initBoard('lin.h2',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_clip_h2 = JXG.JSXGraph.initBoard('clip.h2',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_scale_h2 = JXG.JSXGraph.initBoard('scale.h2',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false});

board_h2.addChild(board_lin_h2);
board_h2.addChild(board_clip_h2);
board_h2.addChild(board_scale_h2);
board_h2.addChild(board_lin_output);
      
board_output.addChild(board_clip_h2);
board_output.addChild(board_scale_h2);
      
const board_h3 = JXG.JSXGraph.initBoard('controls.h3',
    {boundingbox: board_dims,
        axis:false,
        showNavigation:false,
        showCopyright:false}),
            board_lin_h3 = JXG.JSXGraph.initBoard('lin.h3',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_clip_h3 = JXG.JSXGraph.initBoard('clip.h3',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false}),
            board_scale_h3 = JXG.JSXGraph.initBoard('scale.h3',
                {boundingbox: board_dims,
                    axis:true,
                    defaultAxes: {
                        x: {
                            ticks: {visible: false}
                        },
                        y: {
                            ticks: {visible: false}
                        }
                    },
                    showNavigation:false,
                    showCopyright:false});

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
            p0h = 3,
            p1h = 2,
            p2h = 1,
            p3h = 0,
            srange = [-3, 1, 3];
      
const t0param = [[sleft, t0h], [sright, t0h], srange],
            t1param = [[sleft, t1h], [sright, t1h], srange],
            p0param = [[sleft, p0h], [sright, p0h], srange],
            p1param = [[sleft, p1h], [sright, p1h], srange],
            p2param = [[sleft, p2h], [sright, p2h], srange],
            p3param = [[sleft, p3h], [sright, p3h], srange];

const satts = {withTicks: false}
      
const p0 = board_output.create('slider', p0param, {...{name:'\\(\\phi_0\\)'}, ...satts}),
            p1 = board_output.create('slider', p1param, {...{name:'\\(\\phi_1\\)'}, ...satts}),
            p2 = board_output.create('slider', p2param, {...{name:'\\(\\phi_2\\)'}, ...satts}),
            p3 = board_output.create('slider', p3param, {...{name:'\\(\\phi_3\\)'}, ...satts}),

            t10 = board_h1.create('slider', t0param , {...{name:'\\(\\theta_{10}\\)'}, ...satts}),
            t11 = board_h1.create('slider', t1param, {...{name:'\\(\\theta_{11}\\)'}, ...satts}),

            t20 = board_h2.create('slider', t0param, {...{name:'\\(\\theta_{20}\\)'}, ...satts}),
            t21 = board_h2.create('slider', t1param, {...{name:'\\(\\theta_{21}\\)'}, ...satts}),
      
            t30 = board_h3.create('slider', t0param, {...{name:'\\(\\theta_{30}\\)'}, ...satts}),
            t31 = board_h3.create('slider', t1param, {...{name:'\\(\\theta_{31}\\)'}, ...satts});

// Text
const title_lin_h1 = board_lin_h1.create('text', [-1.5, 3.5, '\\[\\theta_{10} + \\theta_{11} x\\]']),
            title_clip_h1 = board_clip_h1.create('text', [-1.5, 3.5, '\\[h_1 = a[\\theta_{10} + \\theta_{11} x]\\]']),
            title_scale_h1 = board_scale_h1.create('text', [-1.5, 3.5, '\\[\\phi_1 h_1\\]']),

            title_lin_h2 = board_lin_h2.create('text', [-1.5, 3.5, '\\[\\theta_{20} + \\theta_{21} x\\]']),
            title_clip_h2 = board_clip_h2.create('text', [-1.5, 3.5, '\\[h_2 = a[\\theta_{20} + \\theta_{21} x]\\]']),
            title_scale_h2 = board_scale_h2.create('text', [-1.5, 3.5, '\\[\\phi_2 h_2\\]']),

            title_lin_h3 = board_lin_h3.create('text', [-1.5, 3.5, '\\[\\theta_{30} + \\theta_{31} x\\]']),
            title_clip_h3 = board_clip_h3.create('text', [-1.5, 3.5, '\\[h_3 = a[\\theta_{30} + \\theta_{31} x]\\]']),
            title_scale_h3 = board_scale_h3.create('text', [-1.5, 3.5, '\\[\\phi_3 h_3\\]']),

            title_lin_output = board_lin_output.create('text', [-1.5, 3.5, '\\[y = \\phi_0 + \\phi_1 h_1 + \\phi_2 h_2 + \\phi_3 h_3\\]']);
      
// Functions
let activationMenu = document.getElementById('activation-select');
activationMenu.addEventListener('change', setActivationFunction);

const relu = (x) => Math.max(0, x),
            sigmoid = (x) => 1 / (1 + Math.E**x),
            leaky_relu = (x) => x >= 0 ? x : 0.1*x,
            hardswish = (x) => (x < -3) ? 0 : 
                x > 3 ? x :
                    x*(x + 3)/6,
            passthrough = (x) => x;
let activation = relu;
      
function setActivationFunction(event) {
    if (activationMenu.value == 'relu') {
        activation = relu;
        board_output.fullUpdate();
    } else if (activationMenu.value == 'sigmoid') {
        activation = sigmoid;
        board_output.fullUpdate();
    } else if (activationMenu.value == 'leaky_relu') {
        activation = leaky_relu;
        board_output.fullUpdate();
    } else if (activationMenu.value == 'hardswish') {
        activation = hardswish;
        board_output.fullUpdate();
    } else if (activationMenu.value == 'passthrough') {
        activation = passthrough;
        board_output.fullUpdate();
    }
};
      
const lin_h1 = (x) => t10.Value() + t11.Value() * x,
            clip_h1 = (x) => activation(lin_h1(x)),
            scale_h1 = (x) => p1.Value() * clip_h1(x),

            lin_h2 = (x) => t20.Value() + t21.Value() * x,
            clip_h2 = (x) => activation(lin_h2(x)),
            scale_h2 = (x) => p2.Value() * clip_h2(x),

            lin_h3 = (x) => t30.Value() + t31.Value() * x,
            clip_h3 = (x) => activation(lin_h3(x)),
            scale_h3 = (x) => p3.Value() * clip_h3(x),

            lin_output = (x) => p0.Value() + scale_h1(x) + scale_h2(x) + scale_h3(x);

// Function to create graph
const create_graph = (board, f, color) => board.create('functiongraph', f, {
    strokeWidth: 3,
    strokeColor: color
});
      
// Output layer
const graph_lin_output = create_graph(board_lin_output, lin_output, orange);
        
// h1
const graph_lin_h1 = create_graph(board_lin_h1, lin_h1, blue);

const graph_clip_h1 = create_graph(board_clip_h1, clip_h1, blue);

const graph_scale_h1 = create_graph(board_scale_h1, scale_h1, blue);

// h2
const graph_lin_h2 = create_graph(board_lin_h2, lin_h2, green);

const graph_clip_h2 = create_graph(board_clip_h2, clip_h2, green);

const graph_scale_h2 = create_graph(board_scale_h2, scale_h2, green);

// h3
const graph_lin_h3 = create_graph(board_lin_h3, lin_h3, red);

const graph_clip_h3 = create_graph(board_clip_h3, clip_h3, red);

const graph_scale_h3 = create_graph(board_scale_h3, scale_h3, red);
