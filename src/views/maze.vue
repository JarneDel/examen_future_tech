<template>
    <div class="flex flex-col justify-center items-center">
        <div id="maze_container" class="maze-container"></div>
        <div v-if="hasWon == true">You Won</div>
        <div>Level: {{ currentLevel }}</div>
        <div v-if="time1">Time level 1: {{ time1 }} seconds</div>
        <div v-if="time2">Time level 2: {{ time2 }} seconds</div>
        <div v-if="time3">Time level 3: {{ time3 }} seconds</div>
        <div v-if="time4">Time level 4: {{ time4 }} seconds</div>
        <div>Time Elapsed: {{ currentTime }} seconds</div>
        
        
        <button v-if="state == 'connected'" v-on:click="start()" class="bg-blue-500 flex  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">start</button>
        <div v-else>make sure you are connected to a squeezi first!</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { useBle } from '../composables/useBle'

    const { gyro, state } = useBle()

  function createMaze(width: number, height: number): string[][] {
    // Initialize maze with all walls
    const maze: string[][] = Array.from({ length: height }, () => new Array(width).fill('wall'));
    const visited = new Set();
  
    function markVisited(x: number, y: number) {
      visited.add(`${x},${y}`);
      maze[y][x] = 'path';
    }
  
    function getUnvisitedNeighbors(x: number, y: number) {
      const neighbors = [];
      // Up
      if (y > 2 && !visited.has(`${x},${y - 2}`) && maze[y - 2][x] === 'wall') {
        neighbors.push({ x, y: y - 2, direction: 'V' });
      }
      // Right
      if (x < width - 3 && !visited.has(`${x + 2},${y}`) && maze[y][x + 2] === 'wall') {
        neighbors.push({ x: x + 2, y, direction: 'H' });
      }
      // Down
      if (y < height - 3 && !visited.has(`${x},${y + 2}`) && maze[y + 2][x] === 'wall') {
        neighbors.push({ x, y: y + 2, direction: 'V' });
      }
      // Left
      if (x > 2 && !visited.has(`${x - 2},${y}`) && maze[y][x - 2] === 'wall') {
        neighbors.push({ x: x - 2, y, direction: 'H' });
      }
      return neighbors;
    }
  
    // Start at a random position
    let currentX = 1;
    let currentY = 1;
    markVisited(currentX, currentY);
  
    const stack = [{ x: currentX, y: currentY }];
  
    while (stack.length > 0) {
      const { x, y } = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(x, y);
  
      if (neighbors.length > 0) {
        const { x: nextX, y: nextY, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
        markVisited(nextX, nextY);
  
        // Remove the wall between the current and next cell
        if (direction === 'H') {
          maze[y][(x + nextX) / 2] = 'path';
        } else {
          maze[(y + nextY) / 2][x] = 'path';
        }
  
        stack.push({ x: nextX, y: nextY });
      } else {
        stack.pop();
      }
    }
  
    // Set entrance and exit
    maze[1][1] = 'door exit';
    
  
    // Surround maze with walls
    maze[0] = maze[0].map(() => 'wall');
    maze[height - 1] = maze[height - 1].map(() => 'wall');
    maze.forEach(row => {
      row[0] = 'wall';
      row[width - 1] = 'wall';
    });
  
    return maze;
  }
  
  function displayMaze(maze: string[][], containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Element with id "${containerId}" not found.`);
      return;
    }
  
    container.innerHTML = '';
  
    maze.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('maze-row');
      row.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('maze-cell', ...cell.split(' '));
        rowDiv.appendChild(cellDiv);
      });
      container.appendChild(rowDiv);
    });
  }
  
  const width = ref(15);
  const height = ref(15);
  const maze = ref(createMaze(width.value, height.value));
  const hasWon = ref(false);

  const startTime = ref(0);
  const currentTime = ref(0);
  const timer = ref();
  const time1 = ref();
  const time2 = ref();
  const time3 = ref();
  const time4 = ref();

  const currentLevel = ref(1);

  const start_ref = ref(false);

    function updateLevel() {

        currentLevel.value++;
        if(currentLevel.value == 2){
            time1.value = currentTime.value;
        }
        if(currentLevel.value == 3){
            time2.value = currentTime.value;
        }
        if(currentLevel.value == 4){
            time3.value = currentTime.value;
        }
        if(currentLevel.value == 5){
            time4.value = currentTime.value;
        }
        
        width.value = width.value + 6  ; // Example formula
        height.value = height.value + 6 ; // Example formula
        maze.value = createMaze(width.value, height.value);
        resetPlayerPosition();
        displayMaze(maze.value, 'maze_container');
        start();
    }

    function resetPlayerPosition() {
        player.x = width.value - 2;
        player.y = height.value - 2;
        maze.value[player.y][player.x] = 'player';
    }

const player = reactive({
  x: width.value -2, // initial x position of the entrance
  y: height.value - 2, // initial y position of the entrance (bottom row)
});

function movePlayer(dx: number, dy:number) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (maze.value[newY][newX] === 'path' && hasWon.value==false) {
    maze.value[player.y][player.x] = 'path'; // old position becomes a path
    player.x = newX;
    player.y = newY;
    
    if (maze.value[newY-1][newX] === 'door exit') {
      hasWon.value = true; // Set win condition
      
    }if (maze.value[newY][newX-1] === 'door exit') {
      hasWon.value = true; // Set win condition
      
    } else {
      maze.value[player.y][player.x] = 'player'; // new position becomes the player
    }
     
  }
}


function movePlayerWithBall(event: string) {
  switch (event) {
    case 'ArrowUp':
    movePlayer(0, -1);
      break;
    case 'ArrowDown':
    movePlayer(0, 1);
      break;
    case 'ArrowLeft':
    movePlayer(-1, 0);
      break;
    case 'ArrowRight':
    movePlayer(1, 0);
      break;
  }
  displayMaze(maze.value, 'maze_container');
}



  const start = () => {
    startTime.value = Date.now();
    timer.value = setInterval(() => {
        currentTime.value = Math.floor((Date.now() - startTime.value) / 1000);
    }, 1000);
    start_ref.value = true;
  }
  onMounted(() => {
    maze.value[player.y][player.x] = 'player';
    displayMaze(maze.value, 'maze_container');
    
    
  });

  watch(hasWon, (newVal) => {
    if (newVal && currentLevel.value < 5) {
        updateLevel();
        hasWon.value = false;
        clearInterval(timer.value);
    }
    });
  
 
  watch(gyro, () => { 
    if(start_ref.value == true){
        const { x, y } = gyro.value
        console.log(x, y)

        if (x < -0.40) movePlayerWithBall('ArrowLeft')
        else if (x > 0.40) movePlayerWithBall('ArrowRight')
        else if (y > 0.40) movePlayerWithBall('ArrowDown')
        else if (y < -0.40) movePlayerWithBall('ArrowUp') 
        //   console.log(data.value) 
    }
}, { deep: true })

  
  </script>
    
  <style>
  .maze-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #a7c53f;
  background-image: radial-gradient(circle at 0% 0%, transparent 50%, rgba(0,0,0,0.1) 50%),
                    radial-gradient(circle at center, rgba(0,0,0,0.1) 50%, transparent 50%),
                    radial-gradient(circle at 100% 100%, transparent 50%, rgba(0,0,0,0.1) 50%),
                    radial-gradient(circle at 0% 100%, transparent 50%, rgba(0,0,0,0.1) 50%),
                    radial-gradient(circle at 100% 0%, transparent 50%, rgba(0,0,0,0.1) 50%);
  background-size: 8em 8em;
  border: #454545;
}

.maze-row {
  display: flex;
}

.maze-cell {
  width: 20px; /* Adjust size as needed */
  height: 20px; /* Adjust size as needed */

  box-sizing: border-box;
}

.maze-cell.wall {
  background-color: #454545;
  background-image: linear-gradient(45deg, rgba(0,0,0,0.2) 45%, transparent 55%),
                    linear-gradient(to bottom, rgba(0,0,0,0.2) 45%, transparent 55%);
  background-size: 0.5em 0.5em;
}

  
  .maze-cell.path {
    background-color: transparent;
  }
  
  .maze-cell.door.exit {
    background-color: purple;
  }
  
  .maze-cell.door.entrance {
    background-color: yellow;
  }
  .maze-cell.player {
    background-color: red;
  }
  </style>
  