var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

//Constructor for a point object
function Point(x,y){
    this.drawX = (x+1)*10;
    this.drawY = (y+1)*10;
    this.visited = false;
    this.neighbors = [];
    this.paths = [];
    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.drawX-2,this.drawY-2,4,4);
        ctx.closePath();
};
    this.getUnvisited = function(){
        // clear any visited neighbors from the array
        for(var i = this.neighbors.length-1;i>=0;i--){
            if(this.neighbors[i].visited){
                this.neighbors.splice(i,1);
} }
        // select a random unvisited neighbor if there are any
        if(this.neighbors.length>0){
            var idx = Math.floor(Math.random()*this.neighbors.length);
            return this.neighbors[idx];
        }else{
            return false;
        }
}; }

/*
var test = new Point(10,20)
var test2 = new Point(11,20)
test.draw()
test2.draw()
console.log(test2.getUnvisited())
*/

// used to store 2-Dimensional array of points
var pts = [];
// variable to set the size of the grid
var gridSize = 60;
// array which acts as a stack for the DFS algorithm
var ptStack = [];
initialize();
// an interval is used to visualize the DFS algorithm's thinking
var mazeInterval = setInterval(createMaze,50);
function initialize(){
    //create the points
    for(var i = 0; i<gridSize;i++){
        var row = [];
        for(var j = 0; j<gridSize;j++){
            row.push(new Point(i,j));
            row[j].draw();
            if(i>0){
                pts[i-1][j].neighbors.push(row[j]);
                row[j].neighbors.push(pts[i-1][j]);
            }
            if(j>0){
                row[j-1].neighbors.push(row[j]);
                row[j].neighbors.push(row[j-1]);
} }
        pts.push(row);
    }
      //pick a random point to start the stack and mark it as visited
    var x = Math.floor(Math.random()*gridSize);
    var y = Math.floor(Math.random()*gridSize);
    ptStack.push(pts[x][y]);
    ptStack[0].visited = true;
}

// used to store all the paths
var paths = [];
//constructor for a path object, Takes two points as parameters
function Path(p1,p2,color){
    this.p1 = p1;
    this.p2 = p2;
    // determines if the path is horizontal or vertical
    this.vertical = p1.drawX == p2.drawX;
    this.color = color;
    this.draw = function(){
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        if(this.vertical){
            // this code makes the corners look nice :)
            ctx.moveTo(p1.drawX,Math.min(p1.drawY,p2.drawY)-2);
            ctx.lineTo(p2.drawX,Math.max(p1.drawY,p2.drawY)+2);
        }else{
            ctx.moveTo(p1.drawX,p1.drawY);
            ctx.lineTo(p2.drawX,p2.drawY);
        }
        ctx.stroke();
        ctx.closePath();
        } }

function drawMaze(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0;i<paths.length;i++){
        paths[i].draw();
    }
}

/*
var point1 = new Point(1,1)
var point2 = new Point(30,30)

var testPath = new Path(point1,point2,"red")
testPath.draw()
*/
function createMaze(){
    drawMaze();
    ptStack[0].draw();
    var nb = ptStack[0].getUnvisited();
    while(nb == false){
        // 'pop' the first item off the stack
        ptStack.splice(0,1);
        if(ptStack.length == 0){
            clearInterval(mazeInterval);
return; }
        nb = ptStack[0].getUnvisited();
    }
    nb.visited = true;
    paths.push(new Path(ptStack[0],nb,"white"));
    ptStack[0].paths.push(nb);
    nb.paths.push(ptStack[0]);
    // 'push' an item onto the stack
    ptStack.splice(0,0,nb);
}