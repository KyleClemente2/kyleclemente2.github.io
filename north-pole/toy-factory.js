'use strict';

const toyFactoryImg = document.createElement('img');
toyFactoryImg.src = imagesPath + 'toy-factory.jpg';
toyFactoryImg.classList.add('scene-img');

sceneContainerDiv.appendChild(toyFactoryImg);

const conveyorBeltUpdateInterval = 50;
const conveyorBeltSpeed = 2;

const beltSegmentY = 620;
const beltSegmentWidth = 164;
const beltSegmentStartX = -80;
const beltSegmentXInterval = 160;


class BeltSegment {
    constructor(x) {
        this.x = x;
        
        this.img = document.createElement('img');
        this.img.src = imagesPath + 'belt-segment.jpg';
        this.img.classList.add('belt-segment', 'element');
        
        this.img.style.width = (beltSegmentWidth / sceneWidth) * 100 + '%';
        this.img.style.top = (beltSegmentY / sceneHeight) * 100 + '%';
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        
        sceneContainerDiv.appendChild(this.img);
        
    }
    
    move() {
        this.x += conveyorBeltSpeed;
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
    }
    
}

const beltSegments = [];
let beltSegmentX = beltSegmentStartX;
while (beltSegmentX < sceneWidth) {
    beltSegments.push(new BeltSegment(beltSegmentX));
    beltSegmentX += beltSegmentXInterval;
}

/*function updateConveyerBelt() {
    //console.log(beltSegments.length)
    if (beltSegments[0].x + conveyorBeltSpeed >= 0) {
        beltSegments.unshift(new BeltSegment(beltSegments[0].x - beltSegmentXInterval));
    }
    
    beltSegments.forEach(beltSegment => {
        beltSegment.move();
    });
    
    const lastBeltSegment = beltSegments[beltSegments.length - 1]
    //console.log('last x ' + lastBeltSegment.x);
    //console.log('scene ' + sceneWidth);
    if (lastBeltSegment.x > sceneWidth) {
        //console.log('removing');
        lastBeltSegment.img.remove();
        beltSegments.pop();
    }
}

setInterval(updateConveyerBelt, conveyorBeltUpdateInterval);*/


const giftBoxBottomY = 664;

const giftBoxData = {
    'gift-box-1': {
        'width': 54,
        'imageWidth': 264,
        'imageHeight': 292,
        'yVariance': 12
    }
}
for (const giftBoxKey of Object.keys(giftBoxData)) {
    const giftBox = giftBoxData[giftBoxKey];
    giftBox['height'] = (giftBox['imageHeight'] / giftBox['imageWidth']) * giftBox['width'];
}

class GiftBox {
    constructor(x, type) {
        this.x = x;
        this.type = 'gift-box-1';
        
        this.img = document.createElement('img');
        this.img.src = imagesPath + this.type + '-unopened.png';
        this.img.classList.add('gift-box', 'element');
        
        this.img.style.width = (giftBoxData[this.type]['width'] / sceneWidth) * 100 + '%';
        
        const yVariance = getRandomInt(0, giftBoxData[this.type]['yVariance']);
        const y = giftBoxBottomY - giftBoxData[this.type]['height'] - yVariance;
        
        this.img.style.top = (y / sceneHeight) * 100 + '%';
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        
        this.img.addEventListener('click', this.openGift.bind(this), { once: true });
        
        sceneContainerDiv.appendChild(this.img);
        
    }
    
    move() {
        this.x += conveyorBeltSpeed;
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
    }
    
    openGift() {
        this.img.src = imagesPath + this.type + '-opened.png';
    }
}


const giftBoxXInterval = 200;
const giftBoxStartX = -80;

let giftBoxes = [];
let giftBoxX = giftBoxStartX;
while (giftBoxX < sceneWidth) {
    giftBoxes.push(new GiftBox(giftBoxX));
    giftBoxX += giftBoxXInterval;
}

function updateConveyerBelt() {
    //console.log(beltSegments.length)
    if (beltSegments[0].x + conveyorBeltSpeed >= 0) {
        beltSegments.unshift(new BeltSegment(beltSegments[0].x - beltSegmentXInterval));
    }
    
    for (const beltSegment of beltSegments) {
        beltSegment.move();
    }
    
    const lastBeltSegment = beltSegments[beltSegments.length - 1]
    //console.log('last x ' + lastBeltSegment.x);
    //console.log('scene ' + sceneWidth);
    if (lastBeltSegment.x > sceneWidth) {
        //console.log('removing');
        lastBeltSegment.img.remove();
        beltSegments.pop();
    }
    
    if (giftBoxes[0].x + conveyorBeltSpeed >= 0) {
        giftBoxes.unshift(new GiftBox(giftBoxes[0].x - giftBoxXInterval));
    }
    
    for (const giftBox of giftBoxes) {
        giftBox.move()
    }
    
    const lastGiftBox = giftBoxes[giftBoxes.length - 1]
    //console.log('last x ' + lastBeltSegment.x);
    //console.log('scene ' + sceneWidth);
    if (lastGiftBox.x > sceneWidth) {
        //console.log('removing');
        lastGiftBox.img.remove();
        giftBoxes.pop();
    }
}

setInterval(updateConveyerBelt, conveyorBeltUpdateInterval);