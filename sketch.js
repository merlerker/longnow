// GLOBALS
let mode = 0; // 0 - normal, 1 - tree, 2 - sun
let isMorning = true; // Morning or Day/Night
let isDay = true; // Morning/Day or Night
let isWinter = false; // Fall or Winter

let banana, lamp, nightOverlay, plant, shadow, tea, tree, curtain;
let room;

let treeButton, sunButton, nightButton, winterButton;

function preload() {
  room = loadImage(`assets/Room.png`);

  bananaWiggle = [4]; // 0 to 3
  bananaAge = [7]; // 0 to 6
  lampDay = loadImage(`assets/Lamp_Day.png`);
  lampNight = loadImage(`assets/Lamp_Night.png`);
  nightImg = loadImage(`assets/nightOverlay.png`);
  plantWiggle = [3];
  plantGrow = [10];
  tea1 = [4]; // 0 to 3
  tea2 = [2]; // 0 to 1
  tea3 = [2]; // 0 to 1
  tea4 = loadImage(`assets/Tea4.png`);
  mask = loadImage(`assets/WindowMask.png`);
  treeFall = [3];
  treeWinter = loadImage(`assets/Tree_Winter.png`);
  treeNight = loadImage(`assets/Window_Night.png`);
  shadowMorning = [3]; 
  curtainDay = loadImage(`assets/Curtains.png`);
  curtainNight = loadImage(`assets/Curtains_Night.png`);

  ocean = [17];

  for (i=0; i<17; i++) {
    if (i<10) {
      ocean[i] = loadImage(`assets/Ocean_0${i}.png`);
    }
    else {
      ocean[i] = loadImage(`assets/Ocean_${i}.png`);
    }
  }

  for (i=0; i<9; i++) {
    if (i<7) {
      bananaAge[i] = loadImage(`assets/Banana_Age0${i}.png`);
      if (i<4) {
        // tea1, bananaWiggle
        tea1[i] = loadImage(`assets/Tea1_Wiggle0${i}.png`);
        bananaWiggle[i] = loadImage(`assets/Banana_Wiggle0${i}.png`);
        if (i<3) {
          shadowMorning[i] = loadImage(`assets/Shadow0${i}.png`);
          treeFall[i] = loadImage(`assets/Tree0${i}.png`);
          plantWiggle[i] = loadImage(`assets/Plant_Wiggle0${i}.png`);
          if (i<2) {
            tea2[i] = loadImage(`assets/Tea2_Wiggle0${i}.png`);
            tea3[i] = loadImage(`assets/Tea3_Wiggle0${i}.png`);
          }
        }
      }
    }

    plantGrow[i] = loadImage(`assets/Plant_Grow0${i}.png`);
  }

  banana = new Banana(bananaWiggle, bananaAge);
  nightOverlay = new NightOverlay(nightImg);
  plant = new Plant(plantWiggle, plantGrow);
  tea = new Tea(tea1, tea2, tea3, tea4);
  tree = new Tree(mask, treeFall, treeWinter, treeNight, ocean);
  shadow = new Shadow(shadowMorning, tree); //pass tree to sync wiggle
  curtain = new Curtain([curtainDay, curtainNight]);
  lamp = new Lamp([lampDay, lampNight]);
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  let cnvX = (windowWidth-width)/2;
  let cnvY = (windowHeight-height)/2;
  let margin = 30;
  cnv.position(cnvX, cnvY);
  frameRate(4);

  treeButton = createButton("A Tree's View");
  treeButton.position(0*width/4 + margin,windowHeight - margin);
  treeButton.mousePressed(treeMode);
  sunButton = createButton("The Sun's View");
  sunButton.position(1*width/4 + margin,windowHeight - margin);
  sunButton.mousePressed(sunMode);
  nightButton = createButton("Day/Night");
  nightButton.position(2*width/4 + margin,windowHeight - margin);
  nightButton.mousePressed(dayNightMode);
  winterButton = createButton("Season");
  winterButton.position(3*width/4 + margin,windowHeight - margin);
  winterButton.mousePressed(winterMode);
}

function draw() {
  background(255);
  imageMode(CORNER);
  scale(width/1920);
  
  drawAll();
}

function drawAll() {
  image(room,0,0);
  banana.display();
  plant.display();
  tea.display();
  nightOverlay.display();
  tree.display();
  curtain.display();
  lamp.display();
  shadow.display();

}

function treeMode() {
  if (! (mode==1)) {
    mode = 1;
    frameRate(2);
  }
  else {
    mode = 0;
  }
}

function sunMode() {
  if (! (mode==2)) {
    mode = 2;
    frameRate(2);
  }
  else {
    mode = 0;
  }
}

function dayNightMode() {
  isDay = !isDay;
}

function winterMode() {
  isWinter = !isWinter;
}


class Plant {
  constructor(normalImages, growImages) {
    this.x = 0;
    this.y = 0;
    this.wiggleImgs = normalImages;
    this.growImgs = growImages;
    this.frameCt = 0;
    this.wiggle = false;
    this.wiggleTimer = int(random(2, 10))*1000;
    this.startTime = millis();
    this.wiggleLoops = 0;
  }

  checkWiggle() {
    if (!this.wiggle && ((millis() - this.startTime) >= this.wiggleTimer)) {
      this.wiggle = true;
      this.wiggleTimer = int(random(2, 10))*1000;
    }
  }

  display() {
    // If we're in normal mode
    if (mode == 0) {
      image(this.wiggleImgs[this.frameCt],this.x,this.y)
      this.checkWiggle();
      if (this.wiggle) {
        this.frameCt++;
        if (this.frameCt >= this.wiggleImgs.length) {
          this.frameCt = 0;
          this.wiggleLoops++;
          if (this.wiggleLoops > 2) {
            this.wiggleLoops = 0;
            this.wiggle = false;
            this.startTime = millis();
          }
        }
      }
    }
    else if (mode == 1) {
      image(this.growImgs[this.frameCt],this.x,this.y)
      this.frameCt++;
      if (this.frameCt >= this.growImgs.length) {
        this.frameCt = this.growImgs.length-1;
      }
    }
  }
}

class Banana {
  constructor(normalImages, speedImages) {
    this.x = 0;
    this.y = 0;
    this.wiggleImgs = normalImages;
    this.ageImgs = speedImages;
    this.frameCt = 0;
    this.wiggle = false;
    this.wiggleTimer = int(random(20, 60))*1000;
    this.startTime = millis();
    this.wiggleLoops = 0;
  }

  checkWiggle() {
    if (!this.wiggle && ((millis() - this.startTime) >= this.wiggleTimer)) {
      this.wiggle = true;
      this.wiggleTimer = int(random(20, 60))*1000;
    }
  }

  display() {
    // If we're in normal mode
    if (mode == 0) {
      image(this.wiggleImgs[this.frameCt],this.x,this.y)
      this.checkWiggle();
      if (this.wiggle) {
        this.frameCt++;
        if (this.frameCt >= this.wiggleImgs.length) {
          this.frameCt = 0;
          this.wiggleLoops++;
          if (this.wiggleLoops > 1) {
            this.wiggleLoops = 0;
            this.wiggle = false;
            this.startTime = millis();
          }
        }
      }
    }
    else if (mode == 1) {
      image(this.ageImgs[this.frameCt],this.x,this.y)
      this.frameCt++;
      if (this.frameCt >= this.ageImgs.length) {
        this.frameCt = this.ageImgs.length-1;
      }
    }
  }
}

// Wall + curtain shadow
class Shadow {
  constructor(morningImages, treeObj) {
    this.x = 0;
    this.y = 0;
    this.imgs = morningImages; // shadow present
    this.frameCt = 0;
    this.tree = treeObj;
  }

  checkWiggle() {
    return this.tree.wiggle;
  }

  display() {
    if (isMorning && isDay && !isWinter && mode==0) {
      image(this.imgs[this.frameCt],this.x,this.y);
      if (this.tree.wiggle && mode==0) {
        this.frameCt++;
        if (this.frameCt >= this.imgs.length) {
          this.frameCt = 0;
        }
      }
    }
  }
}

// Tree
class Tree {
  constructor(maskImage, fallImages, winterImage, nightImage, oceanImages) {
    this.x = 0;
    this.y = 0;
    this.maskImg = maskImage; // mask for window
    this.imgs = fallImages; // tree with leaves
    this.winterImg = winterImage; // tree with snow
    this.nightImg = nightImage;
    this.oceanImgs = oceanImages;
    this.frameCt = 0;
    this.wiggle = false;
    this.wiggleTimer = int(random(2, 10))*1000;
    this.startTime = millis();
    this.wiggleLoops = 0;
  }

  checkWiggle() {
    if (!this.wiggle && ((millis() - this.startTime) >= this.wiggleTimer)) {
      this.wiggle = true;
      this.wiggleTimer = int(random(2, 10))*1000;
    }
  }

  display() {
    if (mode == 2) {
      if (this.frameCt < 5) {
        let oceanImg = this.oceanImgs[this.frameCt].get();
        oceanImg.mask(this.maskImg);
        image(oceanImg,this.x,this.y);
      }
      else if (this.frameCt < this.oceanImgs.length) {
        image(this.oceanImgs[this.frameCt],this.x,this.y);
      }
      else {
        this.frameCt = (this.frameCt%4)+13
        image(this.oceanImgs[this.frameCt],this.x,this.y);
      }
      this.frameCt++;
    }
    else {
      let treeImg;
      if (!isDay) {
        treeImg = this.nightImg.get();
        treeImg.mask(this.maskImg);
        image(treeImg,this.x,this.y);
      }
      else if (!isWinter) {
        treeImg = this.imgs[this.frameCt].get();
        treeImg.mask(this.maskImg);
        image(treeImg,this.x,this.y);
        // console.log(`Drawing wiggle number ${this.frameCt}`);
        this.checkWiggle();
        if (this.wiggle) {
          this.frameCt++;
          if (this.frameCt >= this.imgs.length) {
            this.frameCt = 0;
            this.wiggleLoops++;
            if (this.wiggleLoops > 2) {
              this.wiggleLoops = 0;
              this.wiggle = false;
              this.startTime = millis();
            }
          }
        }
      }
      else {
        treeImg = this.winterImg.get();
        treeImg.mask(this.maskImg);
        image(treeImg,this.x,this.y);
      }
    }
  }
}

class NightOverlay {
  constructor(image) {
    this.x = 0;
    this.y = 0;
    this.img = image;
  }

  display() {
    // If it's night draw overlay
    if (!isDay) {
      image(this.img, this.x, this.y);
    }
  }
}

class Curtain {
  constructor(images) {
    this.x = 0;
    this.y = 0;
    this.imgs = images;
  }

  display() {
    if (!mode==2) {
      // If it's night draw curtains without outline
      if (isDay) {
        image(this.imgs[0], this.x, this.y);
      }
      else {
        image(this.imgs[1], this.x, this.y);
      }
    }
  }
}

class Lamp {
  constructor(images) {
    this.x = 0;
    this.y = 0;
    this.imgs = images;
  }

  display() {
    if (!mode==2) {
      if (isDay) {
        image(this.imgs[0], this.x, this.y);
      }
      else {
        image(this.imgs[1], this.x, this.y);
      }
    }
  }
}

class Tea {
  constructor(tea1, tea2, tea3, tea4) {
    this.x = 0;
    this.y = 0;
    this.t1 = tea1;
    this.t2 = tea2;
    this.t3 = tea3;
    this.t4 = tea4;
    this.levelCt = 1; // corresponds to level + steam
    this.wiggleCt = 0;
    this.startTime = millis();
  }

  checkLevel() {
    // Check how full tea should be
    // Based on time on page
    let twoMins = 1000*60*2; // Decrease level every 2 mins
    // If tea isn't empty
    if (this.levelCt < 4) {
      let timeElapsed = (millis() - this.startTime);
      if (timeElapsed >= twoMins) {
        this.levelCt++;
        this.startTime = millis();
        this.wiggleCt = 0;
      }
    }

  }

  display() {
    if (isDay && mode==0) {
      this.checkLevel();
      if (this.levelCt == 1) {
        image(this.t1[this.wiggleCt], this.x, this.y);
        this.wiggleCt = (this.wiggleCt+1) % this.t1.length;
      }
      else if (this.levelCt == 2) {
        image(this.t2[this.wiggleCt], this.x, this.y);
        this.wiggleCt = (this.wiggleCt+1) % this.t2.length;
      }
      else if (this.levelCt == 3) {
        image(this.t3[this.wiggleCt], this.x, this.y);
        this.wiggleCt = (this.wiggleCt+1) % this.t3.length;
      }
      else {
        image(this.t4, this.x, this.y);
      }
    }
  }
}