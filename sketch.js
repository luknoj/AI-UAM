var cols = 20;
var rows = 20;
var grid = new Array(cols);

var startXValue = 0;
var startYValue = 0;
var endXValue = 0;
var endYValue = 0;
var y, x = 0;
var openSet = [];
var closedSet = [];
var w;
var h;
var start;
var end;
var path = [];
var forkliftMoveList = [];
var drawing = true;
var Forklift;
var endRoad = false;


function removeFromArray(array, item) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == item) {
      array.splice(i, 1)
    }
  }
}

function getValueEndX() {
  endXValue = this.value();
  console.log(endXValue);
}

function getValueEndY() {
  endYValue = this.value();
  console.log(endYValue);
}

function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);

  var d = abs(a.i - b.i) + abs(a.j - b.j)

  return d;
}

function initWalls() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (random(1) < 0.3) {
        grid[i][j].wall = true;
      }
    }
  }

}

function clearFGH(){
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].f = 0;
      grid[i][j].g = 0;
      grid[i][j].h = 0;
    }
  }
}

function aStar(oldStart, endX, endY) {
  start = grid[oldStart.i][oldStart.j];
  end = grid[endX][endY];
  openSet = [];
  closedSet = [];
  openSet.push(start);
  drawing = true;
  endRoad = false;
}

function moveDown() {
  Forklift.j += 1;
}

function moveUp(){
  Forklift.j -= 1;
}


function moveRight() {
  Forklift.i += 1;
}

function moveLeft(){
  Forklift.i -= 1;
}

function turn(){
  Forklift.show(color(255,255,0))
}

function Forklift(i, j) {
  path=[]

  this.i = i
  this.j = j
  this.direction = 's';

  this.show = function(color){
    fill(color)
    noStroke(0)
    rect(this.i * w, this.j * h, w - 1, h - 1)
  }

  this.turn = function(){
    fill(color(255, 255, 0))
  }
} 

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.cameFrom = undefined;
  this.wall = false;


  this.show = function(color) {
    fill(color);
    noStroke(0);

    if (this.wall) {
      fill(0);
    }

    rect(this.i * w, this.j * h, w - 1, h - 1);
  }
  this.addNeighbours = function(grid) {
    var i = this.i;
    var j = this.j;

    if (i < cols - 1) {
      this.neighbours.push(grid[i + 1][j]);
    }

    if (i > 0) {
      this.neighbours.push(grid[i - 1][j]);
    }

    if (j < rows - 1) {
      this.neighbours.push(grid[i][j + 1]);
    }

    if (j > 0) {
      this.neighbours.push(grid[i][j - 1]);
    }

    // if (i < cols - 1 && j > 0) {
    //   this.neighbours.push(grid[i + 1][j - 1]);
    // }

    // if (i > 0 && j < rows - 1) {
    //   this.neighbours.push(grid[i - 1][j + 1]);
    // }

    // if (i < cols - 1 && j < rows - 1) {
    //   this.neighbours.push(grid[i + 1][j + 1]);
    // }

    // if (i > 0 && j > 0) {
    //   this.neighbours.push(grid[i - 1][j - 1]);
    // }
  }
}

function clearCameFrom() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].cameFrom = undefined;
    }
  }
}

function setup() {  
  var endX = createInput('0');
  endX.input(getValueEndX);

  var endY = createInput('0');
  endY.input(getValueEndY);

  var launcher = createButton('Launch')
  launcher.mousePressed(() => aStar(end, endXValue, endYValue));

  // var playground = createCanvas(600, 600);
  // playground.parent('playground')
  
  createCanvas(600, 600);
  w = width / cols;
  h = height / rows;
  
  console.log('A*');

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(cols);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  initWalls();

  start = grid[0][0];
  end = grid[0][0];
  path = [];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
  drawing = true;
  Forklift = new Forklift(start.i, start.j)
  aStar(start, 0, 0);
  
  
}



function draw() {

  x++;

  if (drawing) {
    if (openSet.length > 0) {
      var winner = 0;

      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];


      if (current == end) {
        drawing = false;
        console.log("Searching finished");
        console.log(path);
      }

      removeFromArray(openSet, current);
      closedSet.push(current);
      var neighbours = current.neighbours;
      for (var i = 0; i < neighbours.length; i++) {
        var neighbour = neighbours[i];

        if (!closedSet.includes(neighbour) && !neighbour.wall) {
          var tempG = current.g + heuristic(neighbour, current);
          
          var newPath = false
          if (openSet.includes(neighbour)) {
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
              newPath = true;
            }
          } else {
            neighbour.g = tempG;
            newPath = true;
            openSet.push(neighbour);
          }

          if (newPath) {
            // console.log(end)
            neighbour.h = heuristic(neighbour, end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.cameFrom = current;
          }
        }
      }
    } else {
      console.log("no solution");
      drawing = false;
    }
    background(0);
    path = []
    path.push(end)
    var temp = current;
    path.push[temp];
    while (temp.cameFrom) {
      path.push(temp.cameFrom);
      temp = temp.cameFrom;  
    }
    // console.log(path);
    
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  Forklift.show(color(44, 82, 142))

  {
  // end.show(color(255,0,0))
  //   for (var i = 0; i < closedSet.length; i++) {
  //     closedSet[i].show(color(255,0,0));
  //   }


  //   for (var i = 0; i < openSet.length; i++) {
  //     openSet[i].show(color(0,255,0));
  //   }}}
  }
  
  if (!drawing && !endRoad) {
    clearCameFrom()
    if(Forklift.i !== path[path.length-1].i){
      if (Forklift.i > path[path.length-1].i) {
        moveLeft()
      }

      if (Forklift.i < path[path.length-1].i) {
        moveRight()
      }
      // Forklift.i = path[path.length-1].i
    } 

    if(Forklift.j !== path[path.length-1].j) {
      if (Forklift.j > path[path.length-1].j) {
        moveUp()
      }

      if (Forklift.j < path[path.length-1].j) {
        moveDown()
      }
      Forklift.j = path[path.length-1].j
    }
    
    if(x % 20 === 0){
      path.pop()
      
    }
    if(path.length === 0){
      console.log("Postion of fork at the end", Forklift.i, Forklift.j);
      endRoad = true;
      // clearFGH()
    }
    end.show(color(255,0,0)) 
  }
  
}