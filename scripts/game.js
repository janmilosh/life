$(function() {
  var blockSize = 18;
  var width = $(window).width();
  var height = $(window).height();
  var xElements = width/blockSize;
  var yElements = height/blockSize - 3;
  var cycleTime = 300;
  var livingArray = [];
  var i, j;

  // Create a starting grid for selecting the living squares
  for (i = 0; i < xElements; i++) {
    for (j = 0; j < yElements; j++) {
      createDiv(i, j);
    }
  }
  // Click on squares to select which start out alive
  $('div').click(function () {
    var element = $(this);
    element.toggleClass('alive');
    var offset = element.offset();
    var x = offset.left/blockSize;
    var y = offset.top/blockSize;
    livingArray.push([x, y]);
    var newArray = livingArray.filter(isAlive);
    livingArray = newArray;
  });
  // Function createDiv will create a new div at any x, y coordinate
  function createDiv(x, y) {
    var newDiv = document.createElement('div');
    $(newDiv).css({
      "left": i * blockSize + 'px',
      "top": j * blockSize + 'px',
      "height": (blockSize - 2) + 'px',
      "width": (blockSize - 2) + 'px'
     });
     document.body.appendChild(newDiv);
     $('body').append(newDiv);
  }
  // Function checkForNeighbors compares a cell to all cells in the livingArray
  var checkForNeighbors = function(cell) {
      var i;
      var neighbors = 0;
      var length = livingArray.length;
      for (i = 0; i < length; i++) {
        var xDiff = cell[0] - livingArray[i][0];
        var yDiff = cell[1] - livingArray[i][1];
        if (((xDiff === 1 || xDiff === -1) && (yDiff === 1 || yDiff === -1 || yDiff === 0)) ||
         ((yDiff === 1 || yDiff === -1) && (xDiff === 1 || xDiff === -1 || xDiff === 0))) {
         neighbors++; 
        }
      }
      return neighbors;
  };
  // Function isAlive checks for the 'alive' class on a cell
  function isAlive(element) {
    var xPos = element[0] * blockSize;
    var yPos = element[1] * blockSize;
    var cell = document.elementFromPoint(xPos, yPos);
    return $(cell).hasClass('alive');
  }
  // Function toggleLife changes the class of a cell
  function toggleLife(element) {
    if (element[0] > xElements || element[0] < 0 ||
      element[1] > yElements || element[1] < 0) {
      createDiv(element[0], element[1]);     
    }
    var xPos = element[0] * blockSize;
    var yPos = element[1] * blockSize;
    var cell = document.elementFromPoint(xPos, yPos);
    var width = $(cell).width();
    if (width <= blockSize) {
      $(cell).toggleClass('alive');
    }
  }
  // Function neutral checks for cells with 2 or 3 neighbors and pushes them to the tempArray
  var neutral = function(cell, neighbors, tempArray) {
    if (neighbors === 2 || neighbors ===3) {
      tempArray.push(cell);
    }
    return tempArray;
  };
  // Function reproduce checks cells surrounding all alive cells for neighbors and pushes them
  // to the tempArray if they have 3 neighbors and aren't already alive
  var reproduce = function(cell, tempArray) {
    function surroundingCells(x, y) {
      var temp = [];
      var neighbors, duplicates;
      temp[0] = cell[0] + x;
      temp[1] = cell[1] + y;
      if (!isAlive(temp)) {
        neighbors = checkForNeighbors(temp);
        duplicate = checkDuplicate(temp);
        if (neighbors === 3 && !duplicate) {
          tempArray.push(temp);
        }
      }
    }
    function checkDuplicate(cell) {
      var i;
      var length = tempArray.length;
      for (i = 0; i < length; i++) {
        var xDiff = cell[0] - tempArray[i][0];
        var yDiff = cell[1] - tempArray[i][1];
        if (xDiff === 0 && yDiff === 0) {
          return true;
        }
      }
    }
    surroundingCells(0, 1);
    surroundingCells(0, -1);
    surroundingCells(1, 1);
    surroundingCells(1, 0);
    surroundingCells(1, -1);
    surroundingCells(-1, 1);
    surroundingCells(-1, 0);
    surroundingCells(-1, -1);
    return tempArray;
  };
  $('button').css('top', (yElements * blockSize + 10) + 'px');
  $('.stop').css({'top': (yElements * blockSize + 10) + 'px',
                  'left': '100px'});
  $('.clear').css({'top': (yElements * blockSize + 10) + 'px',
                  'left': '150px'});
  // Click here to start cycling
  $('.start').click(function () {
    var start = setInterval(function() {
      var i;
      var length = livingArray.length;
      var tempArray = [];
      for (i = 0; i < length; i++) {
        var neighbors = checkForNeighbors(livingArray[i]);
        tempArray = neutral(livingArray[i], neighbors, tempArray);
        tempArray = reproduce(livingArray[i], tempArray);
        toggleLife(livingArray[i]);
      }
      livingArray = tempArray;
      length = livingArray.length;
      for (i = 0; i < length; i++) {
        toggleLife(livingArray[i]);
      }       
    }, cycleTime);
    $('.stop').click(function() {
      clearInterval(start);
    });
  });
  $('.clear').click(function() {
    livingArray = [];
    $('div').removeClass('alive');
  });
});