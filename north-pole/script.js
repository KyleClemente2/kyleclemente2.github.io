'use strict';
//import reindeerStable from './reindeer-stable.js';
const globals = {
    sceneWidth: 1408,
    sceneHeight: 704,
    imagesPath: 'assets/images/'
}

const isTouchDevice = 'ontouchstart' in window;
const sceneWidth = globals.sceneWidth;
const sceneHeight = globals.sceneHeight;
const imagesPath = globals.imagesPath;
const sceneContainerDiv = document.getElementById('scene-container');

function getRandomInt(min, max) {
    /* inclusive */
    return Math.floor(Math.random() * (max - min + 1) + min);
}


const textElement = document.createElement('div');
textElement.classList.add('text');
sceneContainerDiv.appendChild(textElement);
function displayText(inputText) {
    const text = String(inputText);
    textElement.textContent += text + '  ';
}



function adjustDimensions() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = 2 / 1;
    
    let newWidth, newHeight;
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

class Reindeer {
    constructor(x, y, reindeers) {
        this.centerX = x;
        this.centerY = y;
        this.baseWidth = 80;
        this.maxWidth = 160;
        this.imgWidth = 200;
        this.imgHeight = 282;
        this.speed = 2;
        this.directionFacing = 'front-right';
        this.carrotSearchDistance = (this.imgWidth / 2) + 150;
        this.carrotMinDistance = (this.imgWidth / 2) + 10;
        this.carrotFollowing = null;
        this.foundSleigh = false;
        this.reindeers = reindeers;
        
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'reindeer-' + this.directionFacing + '.png';
        this.img.classList.add('reindeer', 'element');
        
        this.updateDimensions();
        this.updatePosition();
        
        sceneContainerDiv.appendChild(this.img);
    }

    updateDimensions() {
        const widthIncrement = (this.maxWidth - this.baseWidth) / sceneHeight;
        this.width = this.baseWidth + (this.centerY * widthIncrement);
        this.height = (this.imgHeight / this.imgWidth) * this.width;
        
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
        return distance <= this.carrotSearchDistance;
    }

    moveToCarrot(carrot) {
        const distanceX = carrot.centerX - this.centerX;
        const distanceY = carrot.centerY - this.centerY;
        const distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));
        
        if (distance > this.carrotMinDistance) {
            const moveX = (distanceX / distance) * this.speed;
            const moveY = (distanceY / distance) * this.speed;
            
            this.centerX += moveX;
            this.centerY += moveY;
            
            this.updateDirectionFacing(moveX, moveY);
            this.updatePosition();
        }
    }

    checkForCarrots(carrots) {
        if (this.foundSleigh) {
            return;
        }
        if (this.carrotFollowing === null) {
            for (const carrot of carrots) {
                if (!carrot.isFollowed && this.isNearCarrot(carrot)) {
                    this.carrotFollowing = carrot;
                    carrot.isFollowed = true;
                    carrot.reindeerFollowedBy = this;
                    this.moveToCarrot(carrot);
                    break;
                }
            }
        } else {
            if (this.isNearCarrot(this.carrotFollowing)) {
                this.moveToCarrot(this.carrotFollowing);
            } else {
                this.carrotFollowing.isFollowed = false;
                this.carrotFollowing.reindeerFollowedBy = null;
                this.carrotFollowing = null;
            }
        }
    }

    checkForSleigh() {
        if (this.foundSleigh) {
            this.centerX -= this.speed;
            this.updatePosition()
            if (this.centerX + (this.width / 2) < 0) {
                this.delete();
            }
        } else {
            const sleighHitbox = { // sleigh hitbox for center of reindeer
                'x1': -150,
                'y1': 250,
                'x2': 150,
                'y2': 350
            }
            
            if ((this.centerX >= sleighHitbox.x1 && this.centerX <= sleighHitbox.x2) &&
            (this.centerY >= sleighHitbox.y1 && this.centerY <= sleighHitbox.y2)) {
                this.foundSleigh = true;
                if (this.carrotFollowing !== null) {
                    this.carrotFollowing.delete();
                }
            }
        }
    }

    delete() {
        sceneContainerDiv.removeChild(this.img);
        const index = this.reindeers.indexOf(this);
        this.reindeers.splice(index, 1);
    }
}

class Carrot {
    constructor(mouseX, mouseY, carrots) {
        this.width = 80;
        this.imgWidth = 150;
        this.imgHeight = 72;
        this.width = 80;
        this.height = 80 * (this.imgHeight / this.imgWidth);
        this.isFollowed = false;
        this.reindeerFollowedBy = null;
        this.carrots = carrots;
        this.deleted = false;

        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'carrot.png';
        this.img.classList.add('carrot', 'element');
        
        this.updateDimensions();
        this.updatePosition(mouseX, mouseY);
        
        if (isTouchDevice) {
            this.img.addEventListener('touchstart', this.followMouse.bind(this));
        } else {
            this.img.addEventListener('mousedown', this.followMouse.bind(this));
        }
        
        sceneContainerDiv.appendChild(this.img);
    }
    
    updateDimensions() {
        const width = (this.width / sceneWidth) * 100 + '%';
        this.img.style.width = width;
    }
    
    updatePosition(mouseClientX, mouseClientY) {
        const ratio = sceneWidth / sceneContainerDiv.offsetWidth;
        const rect = sceneContainerDiv.getBoundingClientRect();
        this.centerX = (mouseClientX - rect.left) * ratio;
        this.centerY = (mouseClientY - rect.top) * ratio;
        
        this.x = this.centerX - (this.width / 2);
        this.y = this.centerY - (this.height / 2);
        
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
    }

    checkOutOfBounds() {
        if (!this.deleted) {
            if (this.centerX < 0 || this.centerX > sceneWidth || this.centerY < 0 || this.centerY > sceneHeight) {
                this.delete();
            }
        }
    }

    delete() {
        this.deleted = true;
        if (this.reindeerFollowedBy !== null) {
            this.reindeerFollowedBy.carrotFollowing = null;
        }
        sceneContainerDiv.removeChild(this.img);
        const index = this.carrots.indexOf(this);
        this.carrots.splice(index, 1);
        this.reindeerFollowedBy = null;
    }

    followMouse() {
        carrotFollowOnMouseMove(this);
    }
}

class SleighRailSegment {
    constructor() {
        this.x = 60;
        this.y = 378;
        this.width = 28;
        this.deleted = false;
    
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = globals.imagesPath + 'sleigh-rail-segment.png';
        this.img.classList.add('sleigh-rail-segment', 'element');
        this.img.style.width = (this.width / sceneWidth) * 100 + '%';
        this.updatePosition();
        sceneContainerDiv.appendChild(this.img);
    }
    
    updatePosition() {
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        if (this.x + this.width < 0) {
            this.delete();
        }
    }

    move() {
        const angleInDegrees = 160;
        const angleInRadians = angleInDegrees * (Math.PI / 180);
        const moveX = Math.cos(angleInDegrees);
        const moveY = Math.sin(angleInRadians);
        this.x += moveX;
        this.y += moveY;
        
        this.updatePosition();
    }

    delete() {
        this.deleted = true;
        sceneContainerDiv.removeChild(this.img);
    }
}


function addStableScene() {
    const reindeerStableImg = document.createElement('img');
    reindeerStableImg.setAttribute('draggable', false);
    reindeerStableImg.src = globals.imagesPath + 'reindeer-stable.jpg';
    reindeerStableImg.classList.add('scene-img');
    sceneContainerDiv.appendChild(reindeerStableImg);
}

function addCarrotTrough(carrots) {
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

    if (isTouchDevice) {
        carrotTroughImg.addEventListener('touchstart', function(event) {
            event.preventDefault();
            const touch = event.touches[0];
            const newCarrot = new Carrot(touch.pageX, touch.pageY, carrots)
            carrots.push(newCarrot);
        
            carrotFollowOnMouseMove(newCarrot);
        });
        
    } else {
        carrotTroughImg.addEventListener('mousedown', function(event) {
            event.preventDefault();
            const newCarrot = new Carrot(event.clientX, event.clientY, carrots)
            carrots.push(newCarrot);
        
            carrotFollowOnMouseMove(newCarrot);
        });
    }
}

function addReindeer() {
    const reindeersCenterCoords = [[260, 20], [1250, 40], [1350, 650]];
    const reindeers = [];
    for (const reindeerCenterCoords of reindeersCenterCoords) {
        reindeers.push(new Reindeer(reindeerCenterCoords[0], reindeerCenterCoords[1], reindeers));
    }
    return reindeers;
}

function carrotFollowOnMouseMove(carrot) {
    if (isTouchDevice) {
        function onTouchMove(event, carrot) {
            event.preventDefault();
            const touch = event.touches[0];
            updateCarrotFollowingPosition(touch, carrot);
        }
    
        document.addEventListener('touchmove', onTouchMove, { passive: false });
    
        function onTouchEnd() {
            carrot.checkOutOfBounds();
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd)
        }
    
        document.addEventListener('touchend', onTouchEnd);
    } else {
        function onMouseMove(event) {
            updateCarrotFollowingPosition(event, carrot);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        function onMouseUp() {
            carrot.checkOutOfBounds();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp)
        }
    
        document.addEventListener('mouseup', onMouseUp);
    }
}

function updateCarrotFollowingPosition(event, carrot) {
    if (isTouchDevice) {
        console.log(event);
        carrot.updatePosition(event.pageX, event.pageY);
    } else {
        carrot.updatePosition(event.clientX, event.clientY);
    }
}

function stableUpdate(reindeers, carrots, sleighRailSegment) {
    if (reindeers.length > 0) {
        for (const reindeer of reindeers) {
            reindeer.checkForCarrots(carrots);
            reindeer.checkForSleigh();
        }
    } else {
        if (!sleighRailSegment.deleted) {
            sleighRailSegment.move();
        }
    }
    
    requestAnimationFrame(() => stableUpdate(reindeers, carrots, sleighRailSegment));
}

function reindeerStable() {
    addStableScene();
    const sleighRailSegment = new SleighRailSegment();
    const carrots = [];
    addCarrotTrough(carrots);
    const reindeers = addReindeer();

    stableUpdate(reindeers, carrots, sleighRailSegment);
}

reindeerStable();