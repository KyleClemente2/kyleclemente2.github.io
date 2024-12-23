'use strict';
import globals from './globals.js';

const isTouchDevice = 'ontouchstart' in window;
const sceneWidth = globals.sceneWidth;
const sceneHeight = globals.sceneHeight;
const imagesPath = globals.imagesPath;
const sceneContainerDiv = document.getElementById('scene-container');

class Reindeer {
    constructor(x, y) {
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

class Carrot {
    constructor(mouseX, mouseY) {
        this.width = 80;
        this.imgWidth = 150;
        this.imgHeight = 72;
        this.width = 80;
        this.height = 80 * (this.imgHeight / this.imgWidth);
        this.isFollowed = false;

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
        this.x = (mouseClientX - rect.left) * ratio;
        this.y = (mouseClientY - rect.top) * ratio;
        
        this.centerX = this.x - (this.width / 2);
        this.centerY = this.y - (this.height / 2);
        
        this.img.style.left = (this.centerX / sceneWidth) * 100 + '%';
        this.img.style.top = (this.centerY / sceneHeight) * 100 + '%';
    }
    
    followMouse() {
        carrotFollowOnMouseMove(this);
    }
}

function addSceneImages() {
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
            const newCarrot = new Carrot(touch.pageX, touch.pageY)
            carrots.push(newCarrot);
        
            carrotFollowOnMouseMove(newCarrot);
        });
        
    } else {
        carrotTroughImg.addEventListener('mousedown', function(event) {
            event.preventDefault();
            const newCarrot = new Carrot(event.clientX, event.clientY)
            carrots.push(newCarrot);
        
            carrotFollowOnMouseMove(newCarrot);
        });
    }
}

function addReindeer() {
    const reindeersCenterCoords = [[100, 100], [1200, 100], [1200, 500]];
    const reindeers = [];
    for (const reindeerCenterCoords of reindeersCenterCoords) {
        reindeers.push(new Reindeer(reindeerCenterCoords[0], reindeerCenterCoords[1]));
    }
    console.log(reindeers);
    return reindeers;
}

function carrotFollowOnMouseMove(carrot) {
    if (isTouchDevice) {
        function onTouchMove(event) {
            event.preventDefault();
            const touch = event.touches[0];
            updateCarrotFollowingPosition(touch, carrot);
        }
    
        document.addEventListener('touchmove', onTouchMove, { passive: false });
    
        function onTouchEnd() {
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
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp)
        }
    
        document.addEventListener('mouseup', onMouseUp);
    }
}

function updateCarrotFollowingPosition(event, carrot) {
    if (isTouchDevice) {
        carrot.updatePosition(event.pageX, event.pageY);
    } else {
        carrot.updatePosition(event.clientX, event.clientY);
    }
}

function checkReindeerForCarrots(reindeers, carrots) {
    console.log('r');
    console.log(reindeers);
    for (const reindeer of reindeers) {
        reindeer.checkForCarrots(carrots);
    }
    requestAnimationFrame(() => checkReindeerForCarrots(reindeers, carrots));
}

function main() {
    addSceneImages();
    const carrots = [];
    addCarrotTrough(carrots);
    const reindeers = addReindeer();

    console.log('checking');
    checkReindeerForCarrots(reindeers, carrots);
}

export default main;