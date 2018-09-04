// Siec semantyczna
var magazineNetwork = new Semnet();

// Kategorie
magazineNetwork.add("TV");
magazineNetwork.add("Food");
magazineNetwork.add("PC parts");
magazineNetwork.add("Clothes");
magazineNetwork.add("Containers");
magazineNetwork.add("Furniture");

// Atrybuty
magazineNetwork.add("big", { opposite: "small", transitive: true });
magazineNetwork.add("medium");
magazineNetwork.add("colorfull", { opposite: "uncolorful", transitive: true });

// Fakty
magazineNetwork.fact("TV", "is", "big");
magazineNetwork.fact("Containers", "is", "big");
magazineNetwork.fact("Furniture", "is", "big");
magazineNetwork.fact("Clothes", "is", "medium");
magazineNetwork.fact("TV", "is", "big");
magazineNetwork.fact("Food", "is", "small");

var smallObjects = magazineNetwork
  .q()
  .filter("is", "small")
  .all();
var bigObjects = magazineNetwork
  .q()
  .filter("is", "big")
  .all();

console.log(smallObjects);
console.log(bigObjects);

// Inicjalizacja srodowiska

// Ilosc kolumn
var cols = 20;

// Ilosc wierszy

var rows = 20;

// Tworzenie siatki (mapy)
var grid = new Array(cols);

var temp_i, temp_j;

// Poczatkowe wartosci
// Pozcyja wozka
var startXValue = 0;
var startYValue = 0;

// Miejsce docelowe
var endXValue = 0;
var endYValue = 0;
var shelfName = "";

var y,
  x = 0;

// Mozliwe drogi
var openSet = [];

// Przejrzane drogi
var closedSet = [];
var w;
var h;
var start;
var end;
var shelfs = {};
// Sciezka
var path = [];

// Lista ruchow wozka
var forkliftMoveList = [];

// Wozek
var Forklift;

// Miejsce odbioru paczek

var PickupSpot;
// Zmienne pomagajace wykonywac konkretne czynnosci
var calculatingRoad = true;
var creatingMoveList = false;
var animateMove = false;

// Funkcja pomocnicza usuwajaca objekt z tablicy
function removeFromArray(array, item) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == item) {
      array.splice(i, 1);
    }
  }
}

// Pobieranie wartosci do kierowania wozkiem
function getValueEndX() {
  endXValue = this.value();
  console.log(endXValue);
}

function getValueEndY() {
  endYValue = this.value();
  console.log(endYValue);
}

function getShefName() {
  shelfName = this.value();
  console.log(shelfName);
}
// Heurestyka, w tym przypadku odleglosc Manhattan
function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);

  var d = abs(a.i - b.i) + abs(a.j - b.j);

  return d;
}

function getShelfInfo() {
  shelfs = {
    S10: {
      cord: [2, 2],
      entrance: grid[2][2].entrance
    },
    S11: {
      cord: [3, 2],
      entrance: grid[3][2].entrance
    },
    S12: {
      cord: [4, 2],
      entrance: grid[4][2].entrance
    },
    S13: {
      cord: [5, 2],
      entrance: grid[5][2].entrance
    },
    S14: {
      cord: [6, 2],
      entrance: grid[6][2].entrance
    },
    S20: {
      cord: [2, 4],
      entrance: grid[2][4].entrance
    },
    S21: {
      cord: [3, 4],
      entrance: grid[3][4].entrance
    },
    S22: {
      cord: [4, 4],
      entrance: grid[4][4].entrance
    },
    S23: {
      cord: [5, 4],
      entrance: grid[5][4].entrance
    },
    S24: {
      cord: [6, 4],
      entrance: grid[6][4].entrance
    },
    S30: {
      cord: [2, 6],
      entrance: grid[2][6].entrance
    },
    S31: {
      cord: [3, 6],
      entrance: grid[3][6].entrance
    },
    S32: {
      cord: [4, 6],
      entrance: grid[4][6].entrance
    },
    S33: {
      cord: [5, 6],
      entrance: grid[5][6].entrance
    },
    S34: {
      cord: [6, 6],
      entrance: grid[6][6].entrance
    },
    S40: {
      cord: [13, 13],
      entrance: grid[13][13].entrance
    },
    S41: {
      cord: [14, 13],
      entrance: grid[14][13].entrance
    },
    S42: {
      cord: [15, 13],
      entrance: grid[15][13].entrance
    },
    S43: {
      cord: [16, 13],
      entrance: grid[16][13].entrance
    },
    S44: {
      cord: [17, 13],
      entrance: grid[17][13].entrance
    },
    S50: {
      cord: [13, 15],
      entrance: grid[13][15].entrance
    },
    S51: {
      cord: [14, 15],
      entrance: grid[14][15].entrance
    },
    S52: {
      cord: [15, 15],
      entrance: grid[15][15].entrance
    },
    S53: {
      cord: [16, 15],
      entrance: grid[16][15].entrance
    },
    S54: {
      cord: [17, 15],
      entrance: grid[17][15].entrance
    },
    S60: {
      cord: [13, 17],
      entrance: grid[13][17].entrance
    },
    S61: {
      cord: [14, 17],
      entrance: grid[14][17].entrance
    },
    S62: {
      cord: [15, 17],
      entrance: grid[15][17].entrance
    },
    S63: {
      cord: [16, 17],
      entrance: grid[16][17].entrance
    },
    S64: {
      cord: [17, 17],
      entrance: grid[17][17].entrance
    }
  };
}
// Tworzenie scian
function initWalls() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (random(1) < 0.3) {
        grid[i][j].shelf = true;
      }
    }
  }
}

function initMap() {
  // Sciany i pola ze zwiekszona waga
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (i == 0) {
        grid[i][j].wall = true;
      }

      if (j == 0) {
        grid[i][j].wall = true;
      }

      if (i == 19) {
        grid[i][j].wall = true;
      }

      if (j == 19) {
        grid[i][j].wall = true;
      }

      if (random(1) < 0.1) {
        grid[i][j].penalty = Math.round(random(1, 2)) * 5;
      }
    }
  }

  // Tworzenie pulek

  for (var i = 0; i < 5; i++) {
    grid[2 + i][2].shelf = true;
    grid[2 + i][2].entrance = "n";
    grid[2 + i][2].shelfName = "S1" + i;

    grid[2 + i][4].shelf = true;
    grid[2 + i][4].entrance = "s";
    grid[2 + i][4].shelfName = "S2" + i;

    grid[2 + i][6].shelf = true;
    grid[2 + i][6].entrance = "s";
    grid[2 + i][6].shelfName = "S3" + i;

    grid[13 + i][13].shelf = true;
    grid[13 + i][13].entrance = "n";
    grid[13 + i][13].shelfName = "S4" + i;

    grid[13 + i][15].shelf = true;
    grid[13 + i][15].entrance = "s";
    grid[13 + i][15].shelfName = "S5" + i;

    grid[13 + i][17].shelf = true;
    grid[13 + i][17].entrance = "s";
    grid[13 + i][15].shelfName = "S6" + i;
  }

  getShelfInfo();
}

// Czyszczenie wartosci pol
function clearFGH() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].f = 0;
      grid[i][j].g = 0;
      grid[i][j].h = 0;
    }
  }
}

// Funkcja uruchaniajaca wozek (obliczanie drogi i animacja)
function aStar(endX, endY, shelf) {
  console.log(shelf);

  console.log(shelfs[shelf]);
  if (shelfs[shelf]) {
    var destinationShelf = shelfs[shelf];

    if (destinationShelf.entrance == "n") {
      end = grid[destinationShelf.cord[0]][destinationShelf.cord[1] - 1];
    }

    if (destinationShelf.entrance == "s") {
      end = grid[destinationShelf.cord[0]][destinationShelf.cord[1] + 1];
    }

    start = grid[Forklift.i][Forklift.j];
    temp_i = Forklift.i;
    temp_j = Forklift.j;
    openSet = [];
    closedSet = [];
    openSet.push(start);
    calculatingRoad = true;
    creatingMoveList = false;
  } else {
    alert("Shelf dosent exist");
  }
}

// Ruchy wozka
function moveDown() {
  Forklift.j += 1;
}

function moveUp() {
  Forklift.j -= 1;
}

function moveRight() {
  Forklift.i += 1;
}

function moveLeft() {
  Forklift.i -= 1;
}

function turn() {
  Forklift.show(color(255, 255, 0));
}

// Wozek
function Forklift(i, j) {
  path = [];

  this.i = i;
  this.j = j;
  this.direction = "s";

  this.show = function(color) {
    fill(color);
    noStroke(0);
    rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  this.turn = function() {
    fill(color(255, 255, 0));
  };
}

// Pole na mapie z parametrami ::
function PickupSpot(i, j) {
  this.i = i;
  this.j = j;

  this.show = function() {
    fill(91, 58, 0);

    rect(this.i * w, this.j * h, w - 1, h - 1);
  };
}

function Spot(i, j) {
  // lokalizcaja
  this.i = i;
  this.j = j;

  // wartosci f, g i h
  this.f = 0;
  this.g = 0;
  this.h = 0;

  // sasiedzi pola
  this.neighbours = [];

  // informacja o poprzedniku
  this.cameFrom = undefined;

  // informacja czy to pole jest sciana
  this.wall = false;

  //
  this.shelf = false;
  this.shelfName = null;
  this.type = null; // zywnosc, agd,
  this.atribute = null; // lekki, sredni, ciezki
  this.entrance = null;
  this.objects = [];

  // waga pola
  this.penalty = 0;

  // funkcja nadajaca wyglad polu
  this.show = function(color) {
    fill(color);
    noStroke(0);

    switch (this.penalty) {
      // pole wagi 1, kolor zielony
      case 5:
        fill(210, 255, 76);
        break;

      // pole wagi 2, kolor niebieski
      case 10:
        fill(50, 52, 56);
        break;

      // pole wagi 3, kolor czerwony
      // case 3:
      //   fill(255, 91, 91);
      //   break;
      default:
        break;
    }

    // rysowanie sciany
    if (this.wall) {
      fill(0);
    }

    if (this.shelf) {
      fill(136, 137, 136);
    }
    // tworzenie pola jako kwadratu w miejscu i (x),  j (y) w raz z jego wielkoscia
    rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  // funkcja dodajaca sasiada do pola, jako, ze wozek porusza sie tylko w 4 kierunkach kazde pole moze miec maksymalnie 4 sasiadow
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

    {
      // Pozostalosc po skosach, nie implementowana
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
      // }}
    }
  };
}

// Czyszczenie informacji o poprzednikach z poprzedniego przeszukiwania
function clearCameFrom() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].cameFrom = undefined;
    }
  }
}

// Inicjalizacja aplikacji
function setup() {
  // Inputy do sterowania wozkiem
  var endX = createInput("0");
  endX.input(getValueEndX);

  var endY = createInput("0");
  endY.input(getValueEndY);

  var shelfNameInput = createInput("Input shelfname");
  shelfNameInput.input(getShefName);

  var launcher = createButton("Launch");
  launcher.mousePressed(() => aStar(endXValue, endYValue, shelfName));

  // var playground = createCanvas(600, 600);
  // playground.parent('playground')

  // Tworzenie swiata
  createCanvas(600, 600);

  // Szerokosc i wysokosc kazdego pola wyliczania na podstawie ilosc wierszy i kolumn
  w = width / cols;
  h = height / rows;

  console.log("A*");

  // Inicjalizacja Mapy
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(cols);
  }

  // Tworzenie kazdego pola z pustymi parametrami bazowymi
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // Ustalenie wszystkich sasiadow
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  // Dodanie scian do mapy
  // initWalls();

  // Nadanie polom wag
  // initPenalties();

  // Tworzenie mapy
  initMap();
  // Miejsce startu, dmyslnie 0,0
  start = grid[1][1];

  // Koniec w tym samym miejscu
  end = grid[1][1];

  // Inicjalizacja sciezki
  path = [];

  // Upewnienie sie, ze poczatek ani koniec nie jest sciana
  start.wall = false;
  end.wall = false;

  // Dodanie pierwszego mozliwego pola do przeszukiwan
  openSet.push(start);

  // Rozpoczecie przeszukiwania
  calculatingRoad = true;

  // Dodanie wozka do mapy
  Forklift = new Forklift(start.i, start.j);
  PickupSpot = new PickupSpot(19, 10);
  grid[19][10].wall = false;
  console.log(grid);
  console.log(shelfs);

  // aStar(1, 1);
}

// Petla w ktorej sa wykonywane wszystkie operacje
function draw() {
  x++;

  // Obliczanie drogi
  if (calculatingRoad) {
    if (openSet.length > 0) {
      var winner = 0;

      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];

      if (current == end) {
        calculatingRoad = false;
        creatingMoveList = true;
        console.log("Searching finished");
        console.log(path);
      }

      removeFromArray(openSet, current);
      closedSet.push(current);
      var neighbours = current.neighbours;
      for (var i = 0; i < neighbours.length; i++) {
        var neighbour = neighbours[i];

        if (
          !closedSet.includes(neighbour) &&
          !neighbour.wall &&
          !neighbour.shelf
        ) {
          var tempG =
            current.g + heuristic(neighbour, current) + neighbour.penalty;

          var newPath = false;
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
      calculatingRoad = false;
      creatingMoveList = true;
    }
    background(0);

    // Tworzenie wlasciwej sciezki dzialac wstecz
    path = [];
    path.push(end);
    var temp = current;
    path.push[temp];
    while (temp.cameFrom) {
      path.push(temp.cameFrom);
      temp = temp.cameFrom;
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  {
    // end.show(color(255,0,0))
    //   for (var i = 0; i < closedSet.length; i++) {
    //     closedSet[i].show(color(255,0,0));
    //   }
    //   for (var i = 0; i < openSet.length; i++) {
    //     openSet[i].show(color(0,255,0));
    //   }}}
  }

  // Tworzenie listy ruchow na podstawie ustalonej sciezki
  if (creatingMoveList) {
    clearCameFrom();
    // Tworzenie sciezki w formie listy ruchow wraz z obrotami w miejscu
    if (temp_i !== path[path.length - 1].i) {
      if (temp_i > path[path.length - 1].i) {
        if (Forklift.direction !== "w") {
          forkliftMoveList.push(turn);

          if (Forklift.direction === "n" || Forklift.direction === "s") {
          } else {
            forkliftMoveList.push(turn);
          }
          Forklift.direction = "w";
        }

        forkliftMoveList.push(moveLeft);
      }

      if (temp_i < path[path.length - 1].i) {
        if (Forklift.direction !== "e") {
          forkliftMoveList.push(turn);

          if (Forklift.direction === "n" || Forklift.direction === "s") {
          } else {
            forkliftMoveList.push(turn);
          }
          Forklift.direction = "e";
        }

        forkliftMoveList.push(moveRight);
      }
      temp_i = path[path.length - 1].i;
    }

    if (temp_j !== path[path.length - 1].j) {
      if (temp_j > path[path.length - 1].j) {
        if (Forklift.direction !== "n") {
          forkliftMoveList.push(turn);

          if (Forklift.direction === "w" || Forklift.direction === "e") {
          } else {
            forkliftMoveList.push(turn);
          }
          Forklift.direction = "n";
        }

        forkliftMoveList.push(moveUp);
      }

      if (temp_j < path[path.length - 1].j) {
        if (Forklift.direction !== "s") {
          forkliftMoveList.push(turn);

          if (Forklift.direction === "w" || Forklift.direction === "e") {
          } else {
            forkliftMoveList.push(turn);
          }
          Forklift.direction = "s";
        }

        forkliftMoveList.push(moveDown);
      }

      temp_j = path[path.length - 1].j;
    }

    path.pop();

    if (path.length === 0) {
      console.log("Postion of fork at the end", Forklift.i, Forklift.j);
      creatingMoveList = false;
      animateMove = true;
      console.log(forkliftMoveList);
    }
    end.show(color(255, 0, 0));
  }

  Forklift.show(color(44, 82, 142));

  // Animacja poruszania sie wozka
  if (animateMove) {
    if (forkliftMoveList.length > 0) {
      if (x % 40 === 0) {
        forkliftMoveList[0]();
        forkliftMoveList.splice(0, 1);
      }
    } else {
      clearFGH();
      if (shelfs[shelfName]) {
        while (Forklift.direction !== shelfs[shelfName].entrance) {
          console.log("Nizgodny kierunek wozka z wjazdem");
          console.log(Forklift.direction, shelfs[shelfName].entrance);

          turn();
        }
      }

      animateMove = false;
    }
  }
  PickupSpot.show();
}
