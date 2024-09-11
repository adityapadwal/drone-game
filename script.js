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
const bulletSpeed = 1; // default bullet speed
let bullets = []; // holds fired bullets
const xInput = document.getElementById("x-input");
const yInput = document.getElementById("y-input");
let dronePositionX = 0; // x co-ordinate of the drone
let dronePositionY = 0; // y co-ordinate of the drone
let droneDirection = "north"; // defalt drone direction
let currentRotation = 0; // initial rottion of the drone
const audio = new Audio("./assets/sound.mp3");

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
        const droneImage = document.createElement("img");
        droneImage.src = "./assets/drone.png"; 
        droneImage.alt = "Drone";
        droneImage.classList.add("drone");

        if(cell.offsetWidth < cell.offsetHeight) {
            droneImage.style.width = `${cell.offsetWidth}px`;
            droneImage.style.height = `${cell.offsetWidth}px`;
        } else {
            droneImage.style.width = `${cell.offsetHeight}px`;
            droneImage.style.height = `${cell.offsetHeight}px`;
        }

        cell.appendChild(droneImage);
    }
}

// moving drone in different directions
function moveDroneLeft() {
    if(cellIndex % 10 !== 0) {
        removeDrone();
        cellIndex -= 1;
        placeDroneAtIndex(cellIndex);
        dronePositionX -= 1;
    }
}
function moveDroneRight() {
    if(cellIndex % 10 !== 9) {
        removeDrone();
        cellIndex += 1;
        placeDroneAtIndex(cellIndex);
        dronePositionX += 1;
    }
}
function moveDroneUp() {
    if(cellIndex-10 >= 0) {
        removeDrone();
        cellIndex -= 10;
        placeDroneAtIndex(cellIndex);
        dronePositionY += 1;
    }
}
function moveDroneDown() {
    if(cellIndex+10 <= 99) {
        removeDrone();
        cellIndex += 10;
        placeDroneAtIndex(cellIndex);
        dronePositionY -= 1;
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
    if (cell) {
        const droneImage = document.createElement("img");
        droneImage.src = "./assets/drone.png"; 
        droneImage.alt = "Drone";
        droneImage.classList.add("drone");

        if(cell.offsetWidth < cell.offsetHeight) {
            droneImage.style.width = `${cell.offsetWidth}px`;
            droneImage.style.height = `${cell.offsetWidth}px`;
        } else {
            droneImage.style.width = `${cell.offsetHeight}px`;
            droneImage.style.height = `${cell.offsetHeight}px`;
        }

        droneImage.style.transform = `rotate(${currentRotation}deg)`;
        cell.appendChild(droneImage);
    }
}

// fire bullets
function fireBullet() {
    const drone = document.querySelector(".drone");
    
    if (!drone) return; 
    
    const bullet = document.createElement('div');
    bullet.classList.add("bullet");

    const droneRect = drone.getBoundingClientRect();
    
    bullet.style.left = `${droneRect.left + (droneRect.width/4)}px`;
    bullet.style.top = `${droneRect.top  + (droneRect.width/4)}px`;

    bullet.dataset.direction = droneDirection;
    
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
    audio.play();
}

function burstFire() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            fireBullet();
        }, i * 100); 
    }
}

function changeDroneDirection() {
    const drone = document.querySelector('.drone');

    if (!drone) return; 

    if (droneDirection === "north") {
        droneDirection = "east";
    } else if (droneDirection === "east") {
        droneDirection = "south";
    } else if (droneDirection === "south") {
        droneDirection = "west";
    } else {
        droneDirection = "north";
    }

    currentRotation += 90;
    drone.style.transform = `rotate(${currentRotation}deg)`;
    drone.style.transformOrigin = "center";  

    const cell = gameContainer.children[cellIndex];
    if (cell) {
        if(cell.offsetWidth < cell.offsetHeight) {
            droneImage.style.width = `${cell.offsetWidth}px`;
            droneImage.style.height = `${cell.offsetWidth}px`;
        } else {
            droneImage.style.width = `${cell.offsetHeight}px`;
            droneImage.style.height = `${cell.offsetHeight}px`;
        }
    }
}

function displayDroneReport() {
    const drone = document.querySelector('.drone');
    if (!drone) {
        alert("No drone found :(");
    } else {
        alert(`Drone is at position ${dronePositionX},${dronePositionY-9} and direction ${droneDirection}`);
    }
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
});
burstFireButton.addEventListener("click", () => {
    burstFire();
});
changeDirectionButton.addEventListener("click", () => {
    changeDroneDirection();
});
reportButton.addEventListener("click", () => {
    displayDroneReport();
});

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
        case("b"): {
            burstFire();
            break;
        }
        case("d"): {
            changeDroneDirection();
            break;
        }
        case("r"): {
            displayDroneReport();
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
            case "north": {
                newTop -= bulletSpeed;
                break;
            }
            case "south": {
                newTop += bulletSpeed;
                break;
            }
            case "west": {
                newLeft -= bulletSpeed;
                break;
            }
            case "east": {
                newLeft += bulletSpeed;
                break;
            }
        }

        bullet.style.top = `${newTop}px`;
        bullet.style.left = `${newLeft}px`;

        if (
            newTop < gameContainer.offsetTop || 
            newTop > gameContainer.offsetHeight || 
            newLeft < gameContainer.offsetLeft || 
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