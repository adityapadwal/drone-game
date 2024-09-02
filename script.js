// variables and contants
const gameContainer = document.getElementById("game-container");
const placeButton = document.getElementById("place-button");
const upButton = document.getElementById("up-button");
const downButton = document.getElementById("down-button");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
const fireButton = document.getElementById("fire-button");
const burstFireButton = document.getElementById("burst-fire-button");
const changeDirectionButton = document.getElementById("change-direction-button");
const reportButton = document.getElementById("report-button");
const bulletSpeed = 1;
let bullets = [];
const xInput = document.getElementById("x-input");
const yInput = document.getElementById("y-input");
let dronePositionX = 0;
let dronePositionY = 0;
let droneDirection = "up";

// create the game-container
function createGrid(){
    gameContainer.innerHTML = '';
    for(let i=0; i<100; i++)
    {
        const cell = document.createElement('div');
        cell.classList.add('game-cell');
        gameContainer.appendChild(cell);
    }
}
createGrid();

// place drone in game-container
let cellIndex;
function placeDrone() {
    dronePositionX = xInput.value === '' ? 0 : parseInt(xInput.value, 10);
    dronePositionY = yInput.value === '' ? 0 : parseInt(yInput.value, 10);

    dronePositionX = Math.max(0, Math.min(dronePositionX, 9));
    dronePositionY = Math.max(0, Math.min(dronePositionY, 9));
    dronePositionY = 9 - dronePositionY;

    const existingDrones = document.querySelectorAll(".drone");
    existingDrones.forEach(d => d.remove());

    cellIndex = dronePositionY * 10 + dronePositionX; 

    const cell = gameContainer.children[cellIndex];

    if (cell) {
        const drone = document.createElement("div");
        drone.classList.add("drone");

        drone.style.width = `${cell.offsetWidth}px`;
        drone.style.height = `${cell.offsetHeight}px`;
        drone.innerHTML = "⬆️"; // Default direction

        cell.appendChild(drone);
    }
}

// moving drone in different directions
function moveDroneLeft() {
    if(cellIndex % 10 !== 0) {
        removeDrone();
        cellIndex -= 1;
        placeDroneAtIndex(cellIndex);
    }
}
function moveDroneRight() {
    if(cellIndex % 10 !== 9) {
        removeDrone();
        cellIndex += 1;
        placeDroneAtIndex(cellIndex);
    }
}
function moveDroneUp() {
    if(cellIndex-10 >= 0) {
        removeDrone();
        cellIndex -= 10;
        placeDroneAtIndex(cellIndex);
    }
}
function moveDroneDown() {
    if(cellIndex+10 <= 99) {
        removeDrone();
        cellIndex += 10;
        placeDroneAtIndex(cellIndex);
    }
}
// helper function (remove drone from game-conatiner)
function removeDrone() {
    const currentCell = gameContainer.children[cellIndex];
    const drone = currentCell.querySelector(".drone");
    if (drone) {
        currentCell.removeChild(drone);
    }
}
// helper function (place drone in game-container)
function placeDroneAtIndex(cellIndex) {
    const cell = gameContainer.children[cellIndex];
    if(cell) {
        const drone = document.createElement("div");
        drone.classList.add("drone");

        drone.style.width = `${cell.offsetWidth}px`;
        drone.style.height = `${cell.offsetHeight}px`;
        drone.innerHTML = "⬆️";

        cell.appendChild(drone);
    }
}

function fireBullet() {
    const drone = document.querySelector(".drone");
    
    if (!drone) return; // Ensure drone exists
    
    const bullet = document.createElement('div');
    bullet.classList.add("bullet");

    // Get the bounding box of the drone for its position
    const droneRect = drone.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();
    
    // Set bullet's initial position to the center of the drone
    bullet.style.left = `${droneRect.left + droneRect.width / 2 - 2}px`;
    bullet.style.top = `${droneRect.top - 10}px`;

    bullet.dataset.direction = droneDirection;
    
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
}


// on-screen controls
placeButton.addEventListener("click", () => {
    placeDrone();
});
leftButton.addEventListener("click", () => {
    moveDroneLeft();
});
rightButton.addEventListener("click", () => {
    moveDroneRight();
});
upButton.addEventListener("click", () => {
    moveDroneUp();
});
downButton.addEventListener("click", () => {
    moveDroneDown();
});
fireButton.addEventListener("click", () => {
    fireBullet();
})

// keyboard controls
function handleKeyboardInputs(event){
    switch(event.key) {
        case ("p"): {
            placeDrone();
            break;
        }
        case("ArrowLeft"): {
            moveDroneLeft();
            break;
        }
        case("ArrowRight"): {
            moveDroneRight();
            break;
        }
        case("ArrowUp"): {
            moveDroneUp();
            break;
        }
        case("ArrowDown"): {
            moveDroneDown();
            break;
        }
        case(" "): {   
            fireBullet();
            break;
        }
    }
}
window.addEventListener("keydown", handleKeyboardInputs); 

// update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        const direction = bullet.dataset.direction;
        let newTop = parseFloat(bullet.style.top);
        let newLeft = parseFloat(bullet.style.left);

        switch(direction){
            case "up": {
                newTop -= bulletSpeed;
                break;
            }
            case "down": {
                newTop += bulletSpeed;
                break;
            }
            case "left": {
                newLeft -= bulletSpeed;
                break;
            }
            case "right": {
                newLeft += bulletSpeed;
                break;
            }
        }

        bullet.style.top = `${newTop}px`;
        bullet.style.left = `${newLeft}px`;

        if (
            newTop < 0 || 
            newTop > gameContainer.offsetHeight || 
            newLeft < 0 || 
            newLeft > gameContainer.offsetWidth
        ) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

// game loop
function gameLoop() {
    updateBullets();
    requestAnimationFrame(gameLoop);
}

// start the game loop
gameLoop();