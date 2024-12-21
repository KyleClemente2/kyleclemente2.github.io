'use strict';

function adjustDimensions() {
    const sceneContainerDiv = document.getElementById('scene-container');
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
    
    console.log('viewport width: ' + String(viewportWidth));
    console.log('viewport height: ' + String(viewportHeight));
    console.log('new width: ' + String(newWidth));
    console.log('new height: ' + String(newHeight));
    
    sceneContainerDiv.style.width = `${newWidth}px`;
    sceneContainerDiv.style.height = `${newHeight}px`;
}

window.addEventListener('resize', adjustDimensions);
window.addEventListener('DOMContentLoaded', adjustDimensions);
window.addEventListener('load', adjustDimensions);


const imagesPath = 'assets/images/';
const sceneWidth = 1408;
const sceneHeight = 704;

const rootDiv = document.getElementById('root');
const sceneContainerDiv = document.getElementById('scene-container');

const toyFactoryImg = document.createElement('img');
toyFactoryImg.src = imagesPath + 'toy-factory.jpg';
toyFactoryImg.classList.add('scene-img');

sceneContainerDiv.appendChild(toyFactoryImg);



const beltSegmentY = 620;
const beltSegmentWidth = 164;
const beltSegmentStartX = -80;
const beltSegmentXInterval = 160;
const beltSegmentSpeed = 2;

class BeltSegment {
    constructor(x, y) {
        this.x = x;
        
        this.img = document.createElement('img');
        this.img.src = imagesPath + 'belt-segment.jpg';
        this.img.classList.add('belt-segment');
        
        this.img.style.width = (beltSegmentWidth / sceneWidth) * 100 + '%';
        this.img.style.top = (beltSegmentY / sceneHeight) * 100 + '%';
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.zIndex = '2';
        
        sceneContainerDiv.appendChild(this.img);
        
    }
    
    move() {
        this.x += beltSegmentSpeed;
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
    }
    
}

let beltSegments = [];
let beltSegmentX = beltSegmentStartX;
while (beltSegmentX < sceneWidth) {
    beltSegments.push(new BeltSegment(beltSegmentX));
    beltSegmentX += beltSegmentXInterval;
}

function updateConveyerBelt() {
    console.log(beltSegments.length)
    if (beltSegments[0].x + beltSegmentSpeed >= 0) {
        beltSegments.unshift(new BeltSegment(beltSegments[0].x - beltSegmentXInterval));
    }
    
    beltSegments.forEach(beltSegment => {
        beltSegment.move();
    });
    
    const lastBeltSegment = beltSegments[beltSegments.length - 1]
    console.log('last x ' + lastBeltSegment.x);
    console.log('scene ' + sceneWidth);
    if (lastBeltSegment.x > sceneWidth) {
        console.log('removing');
        lastBeltSegment.img.remove();
        beltSegments.pop();
    }
}

setInterval(updateConveyerBelt, 50);