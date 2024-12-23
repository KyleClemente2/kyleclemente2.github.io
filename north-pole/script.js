'use strict';

function getRandomInt(min, max) {
    /* inclusive */
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let newWidth, newHeight;

function adjustDimensions() {
    const sceneContainerDiv = document.getElementById('scene-container');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = 2 / 1;
    
    if (viewportHeight * aspectRatio < viewportWidth) {
        newWidth = viewportHeight * aspectRatio;
        newHeight = viewportHeight;
    } else {
        newHeight = viewportWidth / aspectRatio;
        newWidth = viewportWidth;
    }
    
    sceneContainerDiv.style.width = `${newWidth}px`;
    sceneContainerDiv.style.height = `${newHeight}px`;
}

window.addEventListener('resize', adjustDimensions);
window.addEventListener('DOMContentLoaded', adjustDimensions);
window.addEventListener('load', adjustDimensions);

const rootDiv = document.getElementById('root');

rootDiv.addEventListener('click', function(e) {
    if (e.target === this) {
        adjustDimensions();
    }
});


const imagesPath = 'assets/images/';
const sceneWidth = 1408;
const sceneHeight = 704;

const sceneContainerDiv = document.getElementById('scene-container');


const reindeerStableImg = document.createElement('img');
reindeerStableImg.setAttribute('draggable', false);
reindeerStableImg.src = imagesPath + 'reindeer-stable.jpg';
reindeerStableImg.classList.add('scene-img');

sceneContainerDiv.appendChild(reindeerStableImg);


const sleighRailSegmentX = 60;
const sleighRailSegmentY = 378;
const sleighRailSegmentWidth = 28;
const sleighRailSegmentImg = document.createElement('img');
sleighRailSegmentImg.setAttribute('draggable', false);
sleighRailSegmentImg.src = imagesPath + 'sleigh-rail-segment.png';
sleighRailSegmentImg.classList.add('sleigh-rail-segment', 'element');


sleighRailSegmentImg.style.width = (sleighRailSegmentWidth / sceneWidth) * 100 + '%';
sleighRailSegmentImg.style.top = (sleighRailSegmentY / sceneHeight) * 100 + '%';
sleighRailSegmentImg.style.left = (sleighRailSegmentX / sceneWidth) * 100 + '%';

sceneContainerDiv.appendChild(sleighRailSegmentImg);


const carrotTroughX = 700;
const carrotTroughY = 570;
const carrotTroughWidth = 200;
const carrotTroughImg = document.createElement('img');
carrotTroughImg.setAttribute('draggable', false);
carrotTroughImg.src = imagesPath + 'carrot-trough.png';
carrotTroughImg.classList.add('carrot-trough', 'element');

carrotTroughImg.style.width = (carrotTroughWidth / sceneWidth) * 100 + '%';
carrotTroughImg.style.top = (carrotTroughY / sceneHeight) * 100 + '%';
carrotTroughImg.style.left = (carrotTroughX / sceneWidth) * 100 + '%';

sceneContainerDiv.appendChild(carrotTroughImg);


const reindeersCenterCoords = [[100, 100], [1200, 100], [1200, 500]];
const reindeerBaseWidth = 80; // width when reindeer centerY = 0
const reindeerMaxWidth = 160; // width when reindeer centerY = sceneHeight
const reindeerImgWidth = 200;
const reindeerImgHeight = 282;

const reindeerSpeed = 2;

const reindeers = [];
const carrots = [];
const carrotSearchDistance = (reindeerImgWidth / 2) + 150;
const carrotMinDistance = (reindeerImgWidth / 2) + 10;

class Reindeer {
    constructor(x, y) {
        this.centerX = x;
        this.centerY = y;
        this.directionFacing = 'front-right';
        this.carrotFollowing = null;
        
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'reindeer-' + this.directionFacing + '.png';
        this.img.classList.add('reindeer', 'element');
        
        this.updateDimensions();
        
        this.updatePosition();
        
        sceneContainerDiv.appendChild(this.img);
    }
    
    calculateCenter() {
        return;
    }
    
    updateDimensions() {
        const widthIncrement = (reindeerMaxWidth - reindeerBaseWidth) / sceneHeight;
        this.width = reindeerBaseWidth + (this.centerY * widthIncrement);
        this.height = (reindeerImgHeight / reindeerImgWidth) * this.width;
        
        this.img.style.width = (this.width / sceneWidth) * 100 + '%';
    }
    
    updateDirectionFacing(moveX, moveY) {
        const oldDirectionFacing = this.directionFacing;
        if (moveX <= 0 && moveY < 0) {
            this.directionFacing = 'back-left';
        } else if (moveX > 0 && moveY < 0) {
            this.directionFacing = 'back-right';
        } else if (moveX <= 0 && moveY >= 0) {
            this.directionFacing = 'front-left';
        } else if (moveX > 0 && moveY >=0) {
            this.directionFacing = 'front-right';
        }
        if (this.directionFacing !== oldDirectionFacing) {
            this.img.src = imagesPath + 'reindeer-' + this.directionFacing + '.png';
        }
    }
    
    updatePosition() {
        this.x = this.centerX - (this.width / 2);
        this.y = this.centerY - (this.height / 2);
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        this.updateDimensions();
    }
    
    isNearCarrot(carrot) {
        const distanceX = carrot.centerX - this.centerX;
        const distanceY = carrot.centerY - this.centerY;
        const distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));
        return distance <= carrotSearchDistance;
    }
    
    moveToCarrot(carrot) {
        const distanceX = carrot.centerX - this.centerX;
        const distanceY = carrot.centerY - this.centerY;
        const distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));
        
        if (distance > carrotMinDistance) {
            const moveX = (distanceX / distance) * reindeerSpeed;
            const moveY = (distanceY / distance) * reindeerSpeed;
            
            this.centerX += moveX;
            this.centerY += moveY;
            
            this.updateDirectionFacing(moveX, moveY);
            this.updatePosition();
        }
    }
    
    checkForCarrots(carrots) {
        if (this.carrotFollowing !== null) {
            if (this.isNearCarrot(this.carrotFollowing)) {
                this.moveToCarrot(this.carrotFollowing);
            } else {
                this.carrotFollowing.isFollowed = false;
                this.carrotFollowing = null;
            }
        } else {
            for (const carrot of carrots) {
                if (!carrot.isFollowed && this.isNearCarrot(carrot)) {
                    this.carrotFollowing = carrot;
                    carrot.isFollowed = true;
                    this.moveToCarrot(carrot);
                    break;
                }
            }
        }
    }
}

for (const reindeerCenterCoords of reindeersCenterCoords) {
    reindeers.push(new Reindeer(reindeerCenterCoords[0], reindeerCenterCoords[1]));
}


const carrotImgWidth = 150;
const carrotImgHeight = 72;
const carrotWidth = 80;
const carrotHeight = 80 * (carrotImgHeight / carrotImgWidth);

class Carrot {
    constructor(mouseX, mouseY) {
        this.width = 80;
        this.isFollowed = false;
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'carrot.png';
        this.img.classList.add('carrot', 'element');
        
        this.updateDimensions();
        this.updatePosition(mouseX, mouseY);
        
        this.img.addEventListener('touchstart', this.followMouse.bind(this));
        
        sceneContainerDiv.appendChild(this.img);
    }
    
    updateDimensions() {
        const width = (carrotWidth / sceneWidth) * 100 + '%';
        this.img.style.width = width;
    }
    
    updatePosition(mouseClientX, mouseClientY) {
        const ratio = sceneWidth / newWidth;
        const rect = sceneContainerDiv.getBoundingClientRect();
        this.x = (mouseClientX - rect.left) * ratio;
        this.y = (mouseClientY - rect.top) * ratio;
        
        this.centerX = this.x - (carrotWidth / 2);
        this.centerY = this.y - (carrotHeight / 2);
        
        this.img.style.left = (this.centerX / sceneWidth) * 100 + '%';
        this.img.style.top = (this.centerY / sceneHeight) * 100 + '%';
    }
    
    followMouse() {
        carrotFollowOnMouseMove(this);
    }
    
}


const isTouchDevice = 'ontouchstart' in window;

if (isTouchDevice) {
    carrotTroughImg.addEventListener('touchstart', function(event) {
        console.log(event.clientX, event.clientY);
        console.log(event);
        event.preventDefault();
        const newCarrot = new Carrot(event.clientX, event.clientY)
        carrots.push(newCarrot);
    
        carrotFollowOnMouseMove(newCarrot);
    });
    
    function carrotFollowOnMouseMove(carrot) {
        function onTouchMove(event) {
            event.preventDefault();
            touch = event.touches[0];
            updateCarrotFollowingPosition(touch, carrot);
        }
    
        document.addEventListener('touchmove', onTouchMove, { passive: false });
    
        function onTouchEnd() {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd)
        }
    
        document.addEventListener('touchend', onTouchEnd);
    }
} else {
    carrotTroughImg.addEventListener('mousedown', function(event) {
        event.preventDefault();
        const newCarrot = new Carrot(event.clientX, event.clientY)
        carrots.push(newCarrot);
    
        carrotFollowOnMouseMove(newCarrot);
    });
    
    function carrotFollowOnMouseMove(carrot) {
        function onMouseMove(event) {
            updateCarrotFollowingPosition(event, carrot);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp)
        }
    
        document.addEventListener('mouseup', onMouseUp);
    }
}

function updateCarrotFollowingPosition(event, carrot) {
    carrot.updatePosition(event.clientX, event.clientY);
}

function gameLoop() {
    for (const reindeer of reindeers) {
        reindeer.checkForCarrots(carrots);
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();
