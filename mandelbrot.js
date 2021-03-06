let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var scale = 1;
var originx = 0;
var originy = 0;
let zoomfactor = 1;

H = window.innerHeight;
W = window.innerWidth;

let xx_r = 3.5;
let yy_r = 2;

let x_range = [-2.5,1], y_range = [-1,1];

canvas.addEventListener("mousewheel", handleMouseWheel, false); // mousewheel duplicates dblclick function
canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false); // for Firefox


function scalePoint(point, x_range = [-2.5,1], y_range = [-1,1]){
    x=point[0]/W, y=point[1]/H;
    return [(x_range[1]-x_range[0])*x + x_range[0], (y_range[1]-y_range[0])*y + y_range[0]]
}

function calculateT(c, x_range = [-2.5,1], y_range = [-1,1]){
    let t = 0;
    let point = scalePoint(c, x_range, y_range);
    let x0=point[0], y0=point[1]; 
    let max_iteration = 1000;
    let x=0,y=0;
    let x2=0, y2=0;
    do{
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        t = t + 1;
    } while (x2 + y2 <= 4 && t < max_iteration)
    
    return t;
}

function rainbow(n,e) {
    n = n * Math.cos(e);
    var r = Math.round(Math.tan(n*e) * 255);
    var g = Math.round(Math.cos(n) * 255);
    var b = Math.round(Math.sin(n*(1-e)) * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}


function renderPoint(point,e,x_range = [-2.5,1], y_range = [-1,1]){
    let t = calculateT(point, x_range, y_range);
    let x = point[0],
        y = point[1];
    let color = rainbow(t,e)
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x+1,y+1);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
}

function renderMandelbrot(x_range = [-2.5,1], y_range = [-1,1]){
    let e = Math.random();
    for(let i=0;i<W;i++){
        for(let j=0;j<H;j++){
            renderPoint([i,j],e,x_range,y_range);
        }
    }
}


renderMandelbrot();

function handleMouseWheel(event){
    event.preventDefault();
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = event.clientY - canvas.offsetTop;
    var wheel = event.wheelDelta/120;//n or -n
    if(wheel > 0){
        zoomfactor *= wheel;
    }else{
        zoomfactor /= -wheel;
    }


    x_r = xx_r/zoomfactor;
    y_r = yy_r/zoomfactor;
    
    let p = scalePoint([mousex, mousey],x_range,y_range);
    mousex = p[0], mousey=p[1];

    x_range = [(2*mousex - x_r)/2, (2*mousex + x_r)/2,]
    y_range = [(2*mousey - y_r)/2, (2*mousey + y_r)/2,]

    renderMandelbrot(x_range,y_range)
  
}
