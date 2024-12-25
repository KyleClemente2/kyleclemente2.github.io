'use strict';

const globals = {
    sceneWidth: 1408,
    sceneHeight: 704,
    imagesPath: 'assets/images/',
    audioPath: 'assets/audio/',
    frameRate: 1000 / 60
}

const isTouchDevice = 'ontouchstart' in window;
const sceneWidth = globals.sceneWidth;
const sceneHeight = globals.sceneHeight;
const imagesPath = globals.imagesPath;
const audioPath = globals.audioPath;
const frameRate = globals.frameRate;
const sceneContainerDiv = document.getElementById('scene-container');
const verticalScalingFactor = 2;

let firstName;

const urls = {
    'Nina': 'https://kyleclemente2.github.io/north-pole/gifts/nina/index.html',
    'Steve': 'https://kyleclemente2.github.io/north-pole/gifts/steve/index.html',
    'Dylan': 'https://kyleclemente2.github.io/north-pole/gifts/dylan/index.html',
    'Amy': 'https://kyleclemente2.github.io/north-pole/gifts/amy/index.html',
    'Jason': 'https://kyleclemente2.github.io/north-pole/gifts/jason/index.html'
};

const touchStartListener = function(event) {
    event.preventDefault();
};


function getRandomInt(min, max) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
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

function windowHandler() {
    window.addEventListener('resize', adjustDimensions);
    window.addEventListener('DOMContentLoaded', adjustDimensions);
    window.addEventListener('load', adjustDimensions);

    const rootDiv = document.getElementById('root');
    if (isTouchDevice) {
        rootDiv.addEventListener('touchstart', function(event) {
            if (event.target === this) {
                adjustDimensions();
            }
        });
    } else {
        rootDiv.addEventListener('click', function(event) {
            if (event.target === this) {
                adjustDimensions();
            }
        });
    }

    if (isTouchDevice) {
        document.body.addEventListener('touchstart', touchStartListener, { passive: false });
    }
}

function isInHitbox(centerX, centerY, hitbox) {
    return ((centerX >= hitbox.x1 && centerX <= hitbox.x2) && 
        (centerY >= hitbox.y1 && centerY <= hitbox.y2));
}

function fadeTransition(sceneFunction, audioFile = undefined) {
    const fadeDuration = 3000;
    const blackDuration = 1000;
    const div = document.createElement('div');

    div.style.transition = `opacity ${fadeDuration}ms`;
    div.style.opacity = 0;

    div.setAttribute('draggable', false);
    div.classList.add('fade-screen');
    sceneContainerDiv.appendChild(div);

    setTimeout(function() {
        div.style.opacity = 1;
    }, 0);

    setTimeout(function() {
        for (const child of Array.from(sceneContainerDiv.children)) {
            if (child !== div) {
                sceneContainerDiv.removeChild(child);
            }
        }
        sceneFunction();

        if (audioFile) {
            const audio = new Audio();
            audio.src = audioPath + audioFile;
            audio.play();
        }
    }, fadeDuration);

    setTimeout(function() {
        div.style.opacity = 0;
    }, fadeDuration + blackDuration);

    setTimeout(function() {
        div.remove();
    }, (fadeDuration * 2) + blackDuration);
}

function addScrollerLeft(callback) {
    const scroller = document.createElement('div');
    scroller.classList.add('scroller', 'scroller-left', 'element');
    if (isTouchDevice) {
        scroller.addEventListener('touchstart', fadeTransition.bind(null, callback));
    } else {
        scroller.addEventListener('click', fadeTransition.bind(null, callback));
    }

    sceneContainerDiv.appendChild(scroller);
}

function addScrollerRight(callback) {
    const scroller = document.createElement('div');
    scroller.classList.add('scroller', 'scroller-right', 'element');
    if (isTouchDevice) {
        scroller.addEventListener('touchstart', fadeTransition.bind(null, callback));
    } else {
        scroller.addEventListener('click', fadeTransition.bind(null, callback));
    }
    

    sceneContainerDiv.appendChild(scroller);
}


class NiceListName {
    constructor(name, hitbox, instances) {
        this.name = name;
        this.instances = instances;
        this.hitbox = hitbox;
        this.underline = null;
        this.width = this.hitbox['x2'] - this.hitbox['x1'];
        this.height = this.hitbox['y2'] - this.hitbox['y1'];

        this.div = document.createElement('div');
        this.div.setAttribute('draggable', false);
        this.div.classList.add('nice-list-name-hitbox', 'element');

        this.div.style.width =  (this.width / sceneWidth) * 100 + '%';
        this.div.style.height =  (this.height / sceneHeight) * 100 + '%';

        this.div.style.left = (this.hitbox['x1'] / sceneWidth) * 100 + '%';
        this.div.style.top = (this.hitbox['y1'] / sceneHeight) * 100 + '%';

        if (isTouchDevice) {
            this.div.addEventListener('touchstart', this.onClick.bind(this));
        } else {
            this.div.addEventListener('click', this.onClick.bind(this));
        }

        sceneContainerDiv.appendChild(this.div);
    }

    onClick() {
        this.removeAllUnderlines();
        if (this.underline === null) {
            this.addUnderline();
        }
    }

    addUnderline() {
        this.underline = document.createElement('img');
        this.underline.setAttribute('draggable', false);
        this.underline.src = imagesPath + 'underline-' + (this.name).toLowerCase() + '.png';
        this.underline.classList.add('underline', 'element');
        sceneContainerDiv.appendChild(this.underline);
    }

    removeAllUnderlines() {
        for (const instance of this.instances) {
            if (instance !== this && instance.underline !== null) {
                sceneContainerDiv.removeChild(instance.underline);
                instance.underline = null;
            }
        }
    }
}

class Mistletoe {
    constructor(niceListNames) {
        this.niceListNames = niceListNames;
        this.hitbox = {
            'x1': 601,
            'y1': 18,
            'x2': 786,
            'y2': 118
        };
        this.width = this.hitbox['x2'] - this.hitbox['x1'];
        this.height = this.hitbox['y2'] - this.hitbox['y1'];

        this.div = document.createElement('div');
        this.div.setAttribute('draggable', false);
        this.div.classList.add('mistletoe', 'element');

        this.div.style.width =  (this.width / sceneWidth) * 100 + '%';
        this.div.style.height =  (this.height / sceneHeight) * 100 + '%';

        this.div.style.left = (this.hitbox['x1'] / sceneWidth) * 100 + '%';
        this.div.style.top = (this.hitbox['y1'] / sceneHeight) * 100 + '%';

        if (isTouchDevice) {
            this.div.addEventListener('touchstart', this.checkForName.bind(this));
        } else {
            this.div.addEventListener('click', this.checkForName.bind(this));
        }
        

        sceneContainerDiv.appendChild(this.div);
    }

    checkForName() {
        for (const name of this.niceListNames) {
            if (name.underline !== null) {
                firstName = name.name;
                this.teleport();
            }
        }
    }

    teleport() {
        fadeTransition(villageSceneOne, 'song1.m4a');
    }
}

function niceList() {
    const niceListImg = document.createElement('img');
    niceListImg.setAttribute('draggable', false);
    niceListImg.src = imagesPath + 'nice-list.jpg';
    niceListImg.classList.add('scene-img');
    sceneContainerDiv.appendChild(niceListImg);

    const niceListNamesX = 590;
    const niceListNamesY = 270;
    const niceListNamesWidth = 220;
    const niceListNamesHeight = 300;

    const names = ['Nina', 'Steve', 'Dylan', 'Amy', 'Jason'];
    const nameHitboxHeight = niceListNamesHeight / names.length;

    const niceListNames = [];
    
    for (let i = 0; i < names.length; i++) {
        const nameHitbox = {
            'x1': niceListNamesX,
            'y1': niceListNamesY + (nameHitboxHeight * i),
            'x2': niceListNamesX + niceListNamesWidth,
            'y2': niceListNamesY + (nameHitboxHeight * i) + nameHitboxHeight
        };
        niceListNames.push(new NiceListName(names[i], nameHitbox, niceListNames));
    }

    new Mistletoe(niceListNames);
}


class Elf {
    constructor(hitbox, dialogue, callback) {
        this.hitbox = hitbox;
        this.dialogue = dialogue;
        this.dialogueIndex = 0;
        this.callback = callback;
        this.x = this.hitbox['x1'];
        this.y = this.hitbox['y1'];
        this.width = this.hitbox['x2'] - this.hitbox['x1'];
        this.height = this.hitbox['y2'] - this.hitbox['y1'];

        this.div = document.createElement('div');
        this.div.setAttribute('draggable', false);
        this.div.classList.add('elf', 'element');

        this.div.style.width =  (this.width / sceneWidth) * 100 + '%';
        this.div.style.height =  (this.height / sceneHeight) * 100 + '%';

        this.div.style.left = (this.hitbox['x1'] / sceneWidth) * 100 + '%';
        this.div.style.top = (this.hitbox['y1'] / sceneHeight) * 100 + '%';

        if (isTouchDevice) {
            this.div.addEventListener('touchstart', this.showDialogue.bind(this));
        } else {
            this.div.addEventListener('click', this.showDialogue.bind(this));
        }
        

        sceneContainerDiv.appendChild(this.div);
    }

    showDialogue() {
        this.createSpeechBubble();
        this.addDialogue();
    }

    createSpeechBubble() {
        if (this.speechBubble {
            this.speechBubbleText.remove();
            this.speechBubble.remove();
        }
        const speechBubbleWidth = 150;
        const speechBubbleHeight = 160;
        this.speechBubble = document.createElement('div');
        this.speechBubble.classList.add('speech-bubble', 'element');

        this.speechBubble.style.width = (speechBubbleWidth / sceneWidth) * 100 + '%';
        this.speechBubble.style.height = (speechBubbleHeight / sceneHeight) * 100 + '%';
        const speechBubbleCenterX = this.x + (this.width / 2);
        const speechBubbleCenterY = this.y - 40 - (speechBubbleHeight / 2);
        const speechBubbleX = speechBubbleCenterX - (speechBubbleWidth / 2);
        const speechBubbleY = speechBubbleCenterY - (speechBubbleHeight / 2);

        this.speechBubble.style.left = (speechBubbleX / sceneWidth) * 100 + '%';
        this.speechBubble.style.top = (speechBubbleY / sceneHeight) * 100 + '%';

        this.speechBubbleText = document.createElement('p');
        this.speechBubbleText.classList.add('speech-bubble-text', 'element');

        sceneContainerDiv.appendChild(this.speechBubble);
        this.speechBubble.appendChild(this.speechBubbleText);
    }

    addDialogue() {
        this.speechBubbleText.textContent = this.dialogue[this.dialogueIndex];
        this.dialogueIndex += 1;
        if (this.dialogueIndex >= this.dialogue.length) {
            if (isTouchDevice) {
                this.speechBubble.addEventListener('touchstart', this.closeSpeechBubble.bind(this));
            } else {
                this.speechBubble.addEventListener('click', this.closeSpeechBubble.bind(this));
            }
        } else {
            if (isTouchDevice) {
                this.speechBubble.addEventListener('touchstart', this.addDialogue.bind(this));
            } else {
                this.speechBubble.addEventListener('click', this.addDialogue.bind(this));
            }
        }
    }

    closeSpeechBubble() {
        this.speechBubble.removeChild(this.speechBubbleText);
        sceneContainerDiv.removeChild(this.speechBubble);
        this.dialogueIndex = 0;
        this.callback();
    }
}

function addVillageScene() {
    const villageImg = document.createElement('img');
    villageImg.setAttribute('draggable', false);
    villageImg.src = imagesPath + 'village.jpg';
    villageImg.classList.add('scene-img');
    sceneContainerDiv.appendChild(villageImg);
}

function villageSceneOne() {
    addVillageScene();
    const elfHitbox = {
        'x1': 695,
        'y1': 525,
        'x2': 802,
        'y2': 664
    };
    const elfDialogue = [`Welcome to the North Pole, ${firstName}! I heard you are 
here to pick up a special present.`, `The last few gifts are being made in the toy factory. 
You should be able to find yours there.`];
    new Elf(elfHitbox, elfDialogue, () => addScrollerRight(toyFactoryScene));
}


class BeltSegment {
    constructor(x) {
        this.x = x;
        this.y = 620;
        this.width = 164
        
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'belt-segment.jpg';
        this.img.classList.add('belt-segment', 'element');
        
        this.img.style.width = (this.width / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        
        sceneContainerDiv.appendChild(this.img);
        
    }
    
    move(speed) {
        this.x += speed;
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
    }
    
}

class GiftBox {
    constructor(x, giftBoxesData, conveyorBelt) {
        this.x = x;
        this.type = 'gift-box-' + getRandomInt(1, Object.keys(giftBoxesData).length);
        this.data = giftBoxesData[this.type];
        this.conveyorBelt = conveyorBelt;
        this.bottomY = 668;
        
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + this.type + '-unopened.png';
        this.img.classList.add('gift-box', 'element');
        this.img.style.width = (this.data['width'] / sceneWidth) * 100 + '%';
        
        const yVariance = getRandomInt(0, this.data['yVariance']);
        this.y = this.bottomY - this.data['height'] - yVariance;
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        
        if (isTouchDevice) {
            this.img.addEventListener('touchstart', this.openGift.bind(this), { once: true });
        } else {
            this.img.addEventListener('click', this.openGift.bind(this), { once: true });
        }
        
        
        sceneContainerDiv.appendChild(this.img);
        
    }
    
    move(speed) {
        this.x += speed;
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
    }
    
    openGift() {
        this.img.src = imagesPath + this.type + '-opened.png';
        this.conveyorBelt.giftBoxesOpened += 1;
    }
}

class ConveyorBelt {
    constructor() {
        this.speed = 1;
        this.slowRate = 0.005;
        this.startSlowing = false;
        this.startSlowingDelay = 1000;
        this.beltSegments = [];
        this.beltSegmentStartX = -80;
        this.beltSegmentXInterval = 160;
        this.giftBoxXInterval = 200;
        this.giftBoxStartX = -80;
        this.giftBoxes = [];
        this.giftBoxesData = {
            'gift-box-1': {
                'width': 64,
                'imageWidth': 264,
                'imageHeight': 292,
                'yVariance': 14
            },
            'gift-box-2': {
                'width': 66,
                'imageWidth': 258,
                'imageHeight': 298,
                'yVariance': 10
            }
        };
        this.giftBoxesOpened = 0;

        this.addBeltSegments();
        this.addGiftBoxes();
    }

    addBeltSegments() {
        let beltSegmentX = this.beltSegmentStartX;
        while (beltSegmentX < sceneWidth) {
            this.beltSegments.push(new BeltSegment(beltSegmentX));
            beltSegmentX += this.beltSegmentXInterval;
        }
    }

    addGiftBoxes() {
        for (const giftBoxKey of Object.keys(this.giftBoxesData)) {
            const giftBoxData = this.giftBoxesData[giftBoxKey];
            const ratio = giftBoxData['imageHeight'] / giftBoxData['imageWidth']
            giftBoxData['height'] = ratio * giftBoxData['width'];
        }

        let giftBoxX = this.giftBoxStartX;

        while (giftBoxX < sceneWidth) {
            this.giftBoxes.push(new GiftBox(giftBoxX, this.giftBoxesData, this));
            giftBoxX += this.giftBoxXInterval;
        }
    }
}


function addToyFactoryScene() {
    const toyFactoryImg = document.createElement('img');
    toyFactoryImg.setAttribute('draggable', false);
    toyFactoryImg.src = imagesPath + 'toy-factory.jpg';
    toyFactoryImg.classList.add('scene-img');
    sceneContainerDiv.appendChild(toyFactoryImg);
}

function startConveyorBelt(conveyorBelt) {
    const conveyorBeltUpdateInterval = setInterval(function() {
        conveyorBeltUpdate(conveyorBelt, 'move');
        if (conveyorBelt.giftBoxesOpened >= 12) {
            clearInterval(conveyorBeltUpdateInterval);
            slowConveyorBelt(conveyorBelt);
        }
    }, frameRate);
}

function slowConveyorBelt(conveyorBelt) {
    const conveyorBeltUpdateInterval = setInterval(function() {
        conveyorBeltUpdate(conveyorBelt, 'slow');
        if (conveyorBelt.speed <= 0) {
            clearInterval(conveyorBeltUpdateInterval);
            toyFactoryElf();
        }
    }, frameRate);
}

function conveyorBeltUpdate(conveyorBelt, state) {
    const beltSegments = conveyorBelt.beltSegments;
    const giftBoxes = conveyorBelt.giftBoxes;

    if (beltSegments[0].x + conveyorBelt.speed >= 0) {
        beltSegments.unshift(new BeltSegment(beltSegments[0].x - conveyorBelt.beltSegmentXInterval));
    }
    
    for (const beltSegment of beltSegments) {
        beltSegment.move(conveyorBelt.speed);
    }
    
    const lastBeltSegment = beltSegments[beltSegments.length - 1];
    if (lastBeltSegment.x > sceneWidth) {
        lastBeltSegment.img.remove();
        beltSegments.pop();
    }
    if (state === 'move') {
        if (giftBoxes[0].x + conveyorBelt.speed >= 0) {
            const giftBoxX = giftBoxes[0].x - conveyorBelt.giftBoxXInterval;
            giftBoxes.unshift(new GiftBox(giftBoxX, conveyorBelt.giftBoxesData, conveyorBelt));
        }
    }
    
    for (const giftBox of giftBoxes) {
        giftBox.move(conveyorBelt.speed);
    }
    
    if (giftBoxes.length > 0) {
        const lastGiftBox = giftBoxes[giftBoxes.length - 1];
        if (lastGiftBox.x > sceneWidth) {
            lastGiftBox.img.remove();
            giftBoxes.pop();
        }
    } else {
        setTimeout(function() {
            conveyorBelt.startSlowing = true;
        }, conveyorBelt.startSlowingDelay);
    }

    // check after move to prevent backwards movement
    if (state === 'slow' && conveyorBelt.startSlowing) {
        conveyorBelt.speed -= conveyorBelt.slowRate;
    }
}

function toyFactoryElf() {
    const elfHitbox = {
        'x1': 763,
        'y1': 363,
        'x2': 818,
        'y2': 545
    };
    const elfDialogue = [`Sorry, ${firstName}. Your gift must have already been loaded onto 
        Santa's sleigh! Last I heard, the sleigh is by the Reindeer Stable.`
    ];
    new Elf(elfHitbox, elfDialogue, () => addScrollerLeft(villageSceneTwo));
}

function toyFactoryScene() {
    addToyFactoryScene();
    const conveyorBelt = new ConveyorBelt();
    startConveyorBelt(conveyorBelt);
}


function villageSceneTwo() {
    addVillageScene();
    addScrollerLeft(reindeerStable, 'song2.m4a');
}



class Reindeer {
    constructor(x, y, reindeers) {
        this.centerX = x;
        this.centerY = y;
        this.baseWidth = 80;
        this.maxWidth = this.baseWidth * verticalScalingFactor;
        this.imgWidth = 200;
        this.imgHeight = 282;
        this.speed = 2;
        this.directionFacing = 'front-right';
        this.carrotSearchDistance = 250;
        this.carrotMinDistance = 100;
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

        this.x = this.centerX - (this.width / 2);
        this.y = this.centerY - (this.height / 2);
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
            this.moveToSleigh();
        } else {
            const sleighHitbox = { // sleigh hitbox for center of reindeer
                'x1': -100,
                'y1': 250,
                'x2': 200,
                'y2': 370
            };
            
            if (isInHitbox(this.centerX, this.centerY, sleighHitbox)) {
                this.foundSleigh = true;
                if (this.carrotFollowing !== null) {
                    this.carrotFollowing.delete();
                }
            }
        }
    }

    moveToSleigh() {
        this.centerX -= this.speed;
            this.updatePosition()
            if (this.centerX + (this.width / 2) < 0) {
                this.delete();
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

    followMouse() {
        carrotFollowOnMouseMove(this);
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
}

class SleighRailSegment {
    constructor() {
        this.x = 60;
        this.y = 378;
        this.width = 28;
        this.deleted = false;
    
        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'sleigh-rail-segment.png';
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

class Sleigh {
    constructor() {
        this.imgWidth = 639
        this.imgHeight = 324
        this.baseWidth = 300;
        this.maxWidth = this.baseWidth * verticalScalingFactor;
        this.centerY = 300;
        const widthIncrement = (this.maxWidth - this.baseWidth) / sceneHeight;
        this.width = this.baseWidth + (this.centerY * widthIncrement);
        this.height = (this.imgHeight / this.imgWidth) * this.width;
        this.centerX = 0 - (this.width / 2) - 10;
        this.speed = 1.5;
        this.arrived = false;

        this.img = document.createElement('img');
        this.img.setAttribute('draggable', false);
        this.img.src = imagesPath + 'sleigh.png';
        this.img.classList.add('sleigh', 'element');
        this.img.style.width = (this.width / sceneWidth) * 100 + '%';
        this.updateDimensions();
        this.updatePosition();
        
        sceneContainerDiv.appendChild(this.img);
    }

    updateDimensions() {
        const widthIncrement = (this.maxWidth - this.baseWidth) / sceneHeight;
        this.width = this.baseWidth + (this.centerY * widthIncrement);
        this.height = (this.imgHeight / this.imgWidth) * this.width;
        this.img.style.width = (this.width / sceneWidth) * 100 + '%';

        this.x = this.centerX - (this.width / 2);
        this.y = this.centerY - (this.height / 2);
    }

    updatePosition() {
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        this.updateDimensions();
    }
    updatePosition() {
        this.x = this.centerX - (this.width / 2);
        this.y = this.centerY - (this.height / 2);
        this.img.style.left = (this.x / sceneWidth) * 100 + '%';
        this.img.style.top = (this.y / sceneHeight) * 100 + '%';
        this.updateDimensions();
    }

    move() {
        const angleInDegrees = 5;
        const angleInRadians = angleInDegrees * (Math.PI / 180);
        const moveX = Math.cos(angleInRadians) * this.speed;
        const moveY = Math.sin(angleInRadians) * this.speed;
        this.centerX += moveX;
        this.centerY += moveY;
        
        this.updatePosition();
        if (this.centerX >= sceneWidth / 2) {
            this.arrived = true;
            const giftPile = new GiftPile(this);
            giftPile.add(this);
        }
    }

}

class GiftPile {
    constructor(sleigh) {
        // position relative to natural sleigh image
        this.x = 16;
        this.y = 76;
        this.width = 124;
        this.height = 36;

        this.link = document.createElement('a');
        const url = urls[firstName];
        this.link.href = url;
        this.link.target = '_blank';
        this.link.classList.add('gift-pile', 'element');
        const ratio = sleigh.width / sleigh.imgWidth;
        this.link.style.width = ((this.width * ratio) / sceneWidth) * 100 + '%';
        this.link.style.height = ((this.height * ratio) / sceneHeight) * 100 + '%';
        sceneContainerDiv.appendChild(this.link);

    }

    add(sleigh) {
        if (isTouchDevice) {
            document.body.removeEventListener('touchstart', touchStartListener);
        }

        const sleighSizeRatio = (sleigh.width / sleigh.imgWidth)
        const totalX = sleigh.x + (this.x * sleighSizeRatio);
        const totalY = sleigh.y + (this.y * sleighSizeRatio);
        this.link.style.left = totalX / sceneWidth * 100 + '%';
        this.link.style.top = totalY / sceneHeight * 100 + '%';
    }
}

function addStableScene() {
    const reindeerStableImg = document.createElement('img');
    reindeerStableImg.setAttribute('draggable', false);
    reindeerStableImg.src = imagesPath + 'reindeer-stable.jpg';
    reindeerStableImg.classList.add('scene-img');
    sceneContainerDiv.appendChild(reindeerStableImg);

    const treeImg = document.createElement('img');
    treeImg.setAttribute('draggable', false);
    treeImg.src = imagesPath + 'stable-tree.png';
    treeImg.classList.add('stable-tree', 'scene-img');
    sceneContainerDiv.appendChild(treeImg);
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
            const clientX = touch.pageX - window.scrollX;
            const clientY = touch.pageY - window.scrollY;
            const newCarrot = new Carrot(clientX, clientY, carrots)
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
    const reindeersCenterCoords = [[260, -55], [1250, -55], [1350, 835]];
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
            updateCarrotFollowingPosition(event, carrot);
        }
    
        const onTouchMoveHelper = (event) => onTouchMove(event, carrot);
        document.addEventListener('touchmove', onTouchMoveHelper, { passive: false });
    
        function onTouchEnd() {
            carrot.checkOutOfBounds();
            document.removeEventListener('touchmove', onTouchMoveHelper);
            document.removeEventListener('touchend', onTouchEndHelper);
        }
    
        const onTouchEndHelper = () => onTouchEnd(carrot);
        document.addEventListener('touchend', onTouchEndHelper);
    } else {
        function onMouseMove(event) {
            updateCarrotFollowingPosition(event, carrot);
        }
    
        const onMouseMoveHelper = (event) => onMouseMove(event, carrot);
        document.addEventListener('mousemove', onMouseMoveHelper);
    
        function onMouseUp(carrot) {
            carrot.checkOutOfBounds();
            document.removeEventListener('mousemove', onMouseMoveHelper);
            document.removeEventListener('mouseup', onMouseUpHelper);
        }

        const onMouseUpHelper = () => onMouseUp(carrot);
        document.addEventListener('mouseup', onMouseUpHelper);
    }
}

function updateCarrotFollowingPosition(event, carrot) {
    if (isTouchDevice) {
        const touch = event.touches[0];
        const clientX = touch.pageX - window.scrollX;
        const clientY = touch.pageY - window.scrollY;
        carrot.updatePosition(clientX, clientY);
    } else {
        carrot.updatePosition(event.clientX, event.clientY);
    }
}

function reindeerUpdate(updateParams) {
    const { reindeers, carrots, sleighRailSegmentParams } = updateParams;
    for (const reindeer of reindeers) {
        reindeer.checkForCarrots(carrots);
        reindeer.checkForSleigh();
    }

    if (reindeers.length > 0) {
        requestAnimationFrame(() => reindeerUpdate(updateParams));
    } else {
        setTimeout(function() {
            sleighRailSegmentUpdate(sleighRailSegmentParams);
        }, 5000);
    }
}

function sleighRailSegmentUpdate(updateParams) {
    const { sleighRailSegment, sleighParams } = updateParams;
    sleighRailSegment.move();
    if (!sleighRailSegment.deleted) {
        requestAnimationFrame(() => sleighRailSegmentUpdate(updateParams));
    } else {
        setTimeout(function() {
            sleighUpdate(sleighParams);
        }, 8000);
    }
}

function sleighUpdate(updateParams) {
    const { sleigh } = updateParams;
    sleigh.move();
    if (!sleigh.arrived) {
        requestAnimationFrame(() => sleighUpdate(updateParams));
    }
}


function reindeerStable() {
    addStableScene();
    const carrots = [];
    addCarrotTrough(carrots);
    const reindeers = addReindeer();
    const sleighRailSegment = new SleighRailSegment();
    const sleigh = new Sleigh();

    const sleighParams = { sleigh };
    const sleighRailSegmentParams = { sleighRailSegment, sleighParams };
  
    const updateParams = {
        reindeers,
        carrots,
        sleighRailSegmentParams
    };

    reindeerUpdate(updateParams);
}

function main() {
    windowHandler();
    niceList();
}
main();
