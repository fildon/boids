!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=5)}([function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.config={boid:{alignmentRadius:40,alignmentRadiusDefault:40,attractionRadius:200,attractionRadiusDefault:200,defaultColour:"LightSteelBlue",fearDuration:30,maxSpeed:6,minSpeed:3,quantity:200,repulsionRadius:20,repulsionRadiusDefault:20,size:4,visionRadius:200},creature:{acceleration:.2,headingFuzz:.05,maxHistory:5,turningMax:.2},hunter:{defaultColour:"yellow",eatRadius:20,maxSpeed:5,minSpeed:4,quantity:1,size:8,visionRadius:90},player:{maxSpeed:64,minSpeed:0},screen:{maxX:1e3,maxY:1e3}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(0);class s{static average(t){if(0===t.length)return new s;return t.reduce((t,e)=>t.add(e)).scaleByScalar(1/t.length)}static weightedAverage(t){if(0===t.length)return new s;const e=t.reduce((t,e)=>({vector:t.vector.add(e.vector.scaleByScalar(e.weight)),weight:t.weight+e.weight}),{vector:new s,weight:0});return e.vector.scaleByScalar(1/e.weight)}static fromHeadingAndSpeed(t,e){return e?new s(e*Math.cos(t),e*Math.sin(t)):new s(0,0)}constructor(t=0,e=0){this.x=t%n.config.screen.maxX,this.y=e%n.config.screen.maxY,this.length=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}unitVector(){return this.scaleByScalar(1/this.length)}distance(t){return this.vectorTo(t).length}vectorTo(t){let e=(t.x-this.x)%n.config.screen.maxX;e>n.config.screen.maxX/2&&(e-=n.config.screen.maxX),e<-n.config.screen.maxX/2&&(e+=n.config.screen.maxX);let i=(t.y-this.y)%n.config.screen.maxY;return i>n.config.screen.maxY/2&&(i-=n.config.screen.maxY),i<-n.config.screen.maxY/2&&(i+=n.config.screen.maxY),new s(e,i)}rotate(t){return new s(this.x*Math.cos(t)-this.y*Math.sin(t),this.x*Math.sin(t)+this.y*Math.cos(t))}angleTo(t){return Math.atan2(this.x*t.y-this.y*t.x,this.x*t.x+this.y*t.y)}add(t){return new s(this.x+t.x,this.y+t.y)}subtract(t){return new s(this.x-t.x,this.y-t.y)}equals(t){return this.x===t.x&&this.y===t.y}scaleByScalar(t){return new s(this.x*t,this.y*t)}scaleToLength(t){return this.length?this.scaleByScalar(t/this.length):this}isParallelTo(t){return this.x*t.y==this.y*t.x}normalize(){return 0<=this.x&&0<=this.y?this:new s((this.x%n.config.screen.maxX+n.config.screen.maxX)%n.config.screen.maxX,(this.y%n.config.screen.maxY+n.config.screen.maxY)%n.config.screen.maxY)}toHeading(){return Math.atan2(this.y,this.x)}toString(){return`[${this.x}, ${this.y}]`}}e.Vector2=s},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(12);e.Behaviour=class{constructor(t,e,i){this.getIdealHeading=t,this.getWeight=e,this.getColor=i}getCurrentPriority(){const t=this.getIdealHeading();return t?new n.Priority(t,this.getWeight(),this.getColor()):null}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(0),s=i(1),r=i(4);e.BehaviourControlledCreature=class extends r.Creature{constructor(t=0,e,i){super(),this.id=t,this.creatureStorage=e,this.colour="black",this.history=[],this.position=i||new s.Vector2(Math.random()*n.config.screen.maxX,Math.random()*n.config.screen.maxY);for(let t=0;t<n.config.creature.maxHistory;t++)this.history.push(this.position);this.initializeVelocity()}distanceToCreature(t){return this.position.distance(t.position)}move(){this.updateHistory(),this.position=this.position.add(this.velocity()).normalize(),this.updateHeading()}updateHeading(){const t=this.getCurrentPriorities().sort((t,e)=>e.weight-t.weight);0!==t.length?(this.colour=t[0].color,this.updateHeadingTowards(s.Vector2.weightedAverage(t))):this.defaultBehaviour()}getCurrentPriorities(){return this.behaviours.map(t=>t.getCurrentPriority()).filter(t=>t&&t.vector.length&&t.weight)}defaultBehaviour(){this.colour=this.defaultColour,this.speed=Math.max(this.velocity.length-n.config.creature.acceleration,this.minSpeed);const t=2*n.config.creature.turningMax*Math.random()-n.config.creature.turningMax;this.heading=this.heading+t}updateHeadingTowards(t){if(!t)return;let e=Math.max(Math.min(t.length,this.maxSpeed),this.minSpeed);e=Math.max(Math.min(e,this.speed+n.config.creature.acceleration),this.speed-n.config.creature.acceleration),this.speed=e;const i=this.velocity().angleTo(t),s=Math.max(Math.min(i,n.config.creature.turningMax),-n.config.creature.turningMax);this.heading=this.heading+s+2*n.config.creature.headingFuzz*Math.random()-n.config.creature.headingFuzz}nearestCreatureToPosition(t){if(0===t.length)throw new Error("Nearest creature is undefined for zero creatures");return t.reduce((t,e)=>{const i=this.position.vectorTo(e.position).length;return t.distance>i?{distance:i,nearest:e}:t},{distance:this.position.vectorTo(t[0].position).length,nearest:t[0]}).nearest}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(1);e.Creature=class{distanceToCreature(t){return this.position.distance(t.position)}updateHistory(){this.history.push(this.position),this.history=this.history.slice(1)}velocity(){return n.Vector2.fromHeadingAndSpeed(this.heading,this.speed)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(6);document.addEventListener("DOMContentLoaded",()=>{(new n.SimulationManager).runSimulation()},!1)},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(7),s=i(0),r=i(9),o=i(10);e.SimulationManager=class{constructor(){const t=document.getElementById("canvas");if(!t)throw new Error("couldn't find 'canvas' on document");this.canvas=new n.Canvas(t),this.inputHandler=new r.InputHandler(this.canvas,t=>this.createBoid(t),t=>this.createHunter(t)),this.creatureStorage=new o.CreatureStorage(this.inputHandler);for(let t=0;t<s.config.boid.quantity;t++)this.creatureStorage.addBoid();for(let t=0;t<s.config.hunter.quantity;t++)this.creatureStorage.addHunter();this.playerFish=this.creatureStorage.addPlayerFish()}createBoid(t){this.creatureStorage.addBoid(t)}createHunter(t){this.creatureStorage.addHunter(t)}runSimulation(){this.tick(performance.now(),0)}tick(t,e){const i=performance.now(),n=i-t;for(t=i,e+=n;e>=1e3/60;)this.playerFish.update(),this.updateSimulation(),e-=1e3/60;this.renderSimulation(),setTimeout(()=>this.tick(t,e),0)}updateSimulation(){this.creatureStorage.update();for(const t of this.creatureStorage.getAllBoids())t.update();for(const t of this.creatureStorage.getAllHunters())t.update()}renderSimulation(){this.canvas.draw(this.creatureStorage.getAllCreatures(),this.playerFish.position),this.updateHunterCountDisplay(this.creatureStorage.getHunterCount()),this.updateBoidCountDisplay(this.creatureStorage.getBoidCount())}updateHunterCountDisplay(t){const e=document.getElementById("number-of-hunters");e&&(e.textContent=`${t}`)}updateBoidCountDisplay(t){const e=document.getElementById("number-of-boids");e&&(e.textContent=`${t}`)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(0),s=i(1),r=i(8);e.Canvas=class{constructor(t){this.fpsCounter=r.FpsCounter.getFpsCounter(),this.cameraPosition=new s.Vector2(window.innerWidth,window.innerHeight),this.canvas=t;const e=this.canvas.getContext("2d");if(!e)throw new Error("could not get canvas context");this.ctx=e,this.canvas.height=n.config.screen.maxY,this.canvas.width=n.config.screen.maxX,this.setScreenSize()}onclick(t){this.canvas.onclick=t}setScreenSize(){window&&(n.config.screen.maxX=window.innerWidth,n.config.screen.maxY=window.innerHeight),this.ctx.canvas.width=n.config.screen.maxX,this.ctx.canvas.height=n.config.screen.maxY}draw(t,e){this.cameraPosition=e,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.setScreenSize(),this.drawGhosts(t),t.forEach(t=>{this.drawCreature(t)}),this.fpsCounter.countFrame(),this.fpsCounter.updateFps()}drawGhosts(t){if(n.config.creature.maxHistory)for(let e=0;e<n.config.creature.maxHistory;e++)t.forEach(t=>{this.drawGhost(t,e)})}drawGhost(t,e){this.drawCreatureBody(t,e)}drawCreature(t){this.drawCreatureBody(t),this.drawCreatureBeak(t)}getPositionInCameraSpace(t){return t.add(new s.Vector2(window.innerWidth/2,window.innerHeight/2)).subtract(this.cameraPosition).normalize()}getPositionInWorldSpace(t){return t.subtract(new s.Vector2(window.innerWidth/2,window.innerHeight/2)).add(this.cameraPosition).normalize()}drawCreatureBody(t,e){let i=e?t.history[e]:t.position;i=this.getPositionInCameraSpace(i);const s=e?t.size*((e+1)/(n.config.creature.maxHistory+1)):t.size;this.ctx.beginPath(),this.ctx.arc(i.x,i.y,s,0,2*Math.PI),this.ctx.fillStyle=t.colour,this.ctx.fill()}drawCreatureBeak(t){const e=this.getPositionInCameraSpace(t.position);this.ctx.beginPath(),this.ctx.arc(e.x+(t.size+1)*Math.cos(t.heading),e.y+(t.size+1)*Math.sin(t.heading),t.size/2,0,2*Math.PI),this.ctx.fillStyle="black",this.ctx.fill()}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class n{constructor(){this.SECOND=1e3,this.recentFrames=[],this.fpsLabel=document.getElementById("fps-status")}static getFpsCounter(){return this.fpsCounter||(this.fpsCounter=new n)}countFrame(){this.recentFrames.push(performance.now())}updateFps(){const t=performance.now();this.recentFrames=this.recentFrames.filter(e=>e>=t-this.SECOND),this.fpsLabel.textContent=this.recentFrames.length.toString()}}e.FpsCounter=n},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(1),s=i(0);e.InputHandler=class{constructor(t,e,i){this.left=!1,this.right=!1,this.up=!1,this.down=!1,this.canvas=t,this.createBoid=e,this.createHunter=i,this.separationLabel=document.getElementById("separation-status"),this.alignmentLabel=document.getElementById("alignment-status"),this.cohesionLabel=document.getElementById("cohesion-status"),this.canvas.onclick(t=>{this.handleMouseClick(t)}),window.addEventListener("keyup",t=>{this.handleKeyUp(t)}),window.addEventListener("keyup",t=>{this.setArrow(t.key,!1)}),window.addEventListener("keydown",t=>{this.setArrow(t.key,!0)})}handleMouseClick(t){const e=this.canvas.getPositionInWorldSpace(new n.Vector2(t.clientX,t.clientY));t.ctrlKey||t.metaKey?this.createHunter(e):this.createBoid(e)}handleKeyUp(t){switch(t.keyCode){case 49:this.toggleSeparation();break;case 50:this.toggleAlignment();break;case 51:this.toggleCohesion();break;default:return}}toggleSeparation(){s.config.boid.repulsionRadius?(s.config.boid.repulsionRadius=0,this.separationLabel.textContent="OFF",this.separationLabel.style.color="red"):(s.config.boid.repulsionRadius=s.config.boid.repulsionRadiusDefault,this.separationLabel.textContent="ON",this.separationLabel.style.color="green")}toggleAlignment(){s.config.boid.alignmentRadius?(s.config.boid.alignmentRadius=0,this.alignmentLabel.textContent="OFF",this.alignmentLabel.style.color="red"):(s.config.boid.alignmentRadius=s.config.boid.alignmentRadiusDefault,this.alignmentLabel.textContent="ON",this.alignmentLabel.style.color="green")}toggleCohesion(){s.config.boid.attractionRadius?(s.config.boid.attractionRadius=0,this.cohesionLabel.textContent="OFF",this.cohesionLabel.style.color="red"):(s.config.boid.attractionRadius=s.config.boid.attractionRadiusDefault,this.cohesionLabel.textContent="ON",this.cohesionLabel.style.color="green")}getHeadingUpdate(){return.1*(+this.right-+this.left)}getSpeedUpdate(){return.5*(+this.up-+this.down)}setArrow(t,e){switch(t){case"ArrowLeft":this.left=e;break;case"ArrowRight":this.right=e;break;case"ArrowUp":this.up=e;break;case"ArrowDown":this.down=e;break;default:return}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(11),s=i(13),r=i(0),o=i(14);e.CreatureStorage=class{constructor(t){this.inputHandler=t,this.nextId=0,this.creatures=new Map,this.bucketMap=[],this.bucketColumns=1,this.bucketRows=1,this.bucketSize=100,this.update()}update(){this.resetBucketMap(),this.creatures.forEach(t=>{const e=Math.min(Math.floor(t.position.x/this.bucketSize),this.bucketColumns-1),i=Math.min(Math.floor(t.position.y/this.bucketSize),this.bucketRows-1);this.bucketMap[e][i].push(t)})}addHunter(t){const e=new n.Hunter(this.nextId,this,t);return this.creatures.set(this.nextId,e),this.nextId++,e}addBoid(t){const e=new s.Boid(this.nextId,this,t);return this.creatures.set(this.nextId,e),this.nextId++,e}addPlayerFish(){const t=new o.default(this.inputHandler);return this.creatures.set(this.nextId,t),this.nextId++,t}getAllHunters(){return[...this.creatures.values()].filter(t=>t instanceof n.Hunter)}getAllBoids(){return[...this.creatures.values()].filter(t=>t instanceof s.Boid)}getAllCreatures(){return[...this.creatures.values()]}getHuntersInArea(t,e){return this.getCreaturesInArea(t,e).filter(i=>i instanceof n.Hunter&&i.position.distance(t)<e)}getBoidsInArea(t,e){return this.getCreaturesInArea(t,e).filter(i=>i instanceof s.Boid&&i.position.distance(t)<e)}getBoidsOrPlayersInArea(t,e){return this.getCreaturesInArea(t,e).filter(i=>(i instanceof s.Boid||i instanceof o.default)&&i.position.distance(t)<e)}getCreaturesInArea(t,e){const i=Math.floor(t.x/this.bucketSize),n=Math.floor(t.y/this.bucketSize),s=Math.ceil(e/this.bucketSize),r=(i-s+this.bucketColumns)%this.bucketColumns,o=(i+s+1)%this.bucketColumns,a=(n-s+this.bucketRows)%this.bucketRows,c=(n+s+1)%this.bucketRows;let h=[];for(let t=r;t!==o;t++,t%=this.bucketColumns)for(let e=a;e!==c;e++,e%=this.bucketRows)h=h.concat(this.bucketMap[t][e]);return h}getHunterCount(){return this.getAllHunters().length}getBoidCount(){return this.getAllBoids().length}remove(t){this.creatures.delete(t)}resetBucketMap(){this.bucketMap=[],this.bucketColumns=Math.ceil(r.config.screen.maxX/this.bucketSize),this.bucketRows=Math.ceil(r.config.screen.maxY/this.bucketSize);for(let t=0;t<this.bucketColumns;t++){const t=[];for(let e=0;e<this.bucketRows;e++)t.push([]);this.bucketMap.push(t)}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(0),s=i(2),r=i(3);e.Hunter=class extends r.BehaviourControlledCreature{constructor(){super(...arguments),this.defaultColour=n.config.hunter.defaultColour,this.maxSpeed=n.config.hunter.maxSpeed,this.minSpeed=n.config.hunter.minSpeed,this.size=n.config.hunter.size,this.heading=0,this.speed=0,this.behaviours=[new s.Behaviour(()=>this.huntingVector(),()=>10,()=>"DeepPink")]}initializeVelocity(){this.heading=2*Math.random()*Math.PI,this.speed=n.config.hunter.minSpeed}update(){this.eat(),this.move()}chanceToSee(t,e){return(e-t.distance(this.position))/e*((this.speed-n.config.hunter.minSpeed)/(n.config.hunter.maxSpeed-n.config.hunter.minSpeed))}huntingVector(){const t=this.creatureStorage.getBoidsInArea(this.position,n.config.hunter.visionRadius);if(0===t.length)return null;const e=this.nearestCreatureToPosition(t);return this.position.vectorTo(e.position.add(e.velocity())).scaleToLength(n.config.hunter.maxSpeed)}eat(){this.creatureStorage.getBoidsInArea(this.position,n.config.hunter.eatRadius).forEach(t=>t.die())}die(){this.creatureStorage.remove(this.id)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.Priority=class{constructor(t,e,i){this.vector=t,this.weight=e,this.color=i}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(0),s=i(1),r=i(2),o=i(3);e.Boid=class extends o.BehaviourControlledCreature{constructor(){super(...arguments),this.defaultColour=n.config.boid.defaultColour,this.maxSpeed=n.config.boid.maxSpeed,this.minSpeed=n.config.boid.minSpeed,this.size=n.config.boid.size,this.fearCountdown=0,this.heading=2*Math.PI*Math.random(),this.speed=n.config.boid.maxSpeed,this.behaviours=[new r.Behaviour(()=>this.hunterEvasionVector(),()=>100,()=>"red"),new r.Behaviour(()=>this.repulsionVector(),()=>50,()=>this.fearCountdown?"red":"orange"),new r.Behaviour(()=>this.alignmentVector(),()=>20,()=>this.fearCountdown?"red":"blue"),new r.Behaviour(()=>this.attractionVector(),()=>10,()=>this.fearCountdown?"red":"green")]}initializeVelocity(){this.heading=2*Math.random()*Math.PI,this.speed=n.config.boid.maxSpeed}update(){this.fearCountdown&&this.fearCountdown--,this.move()}hunterEvasionVector(){const t=this.creatureStorage.getHuntersInArea(this.position,n.config.boid.visionRadius).filter(t=>Math.random()<t.chanceToSee(this.position,n.config.boid.visionRadius));return 0===t.length?null:(this.fearCountdown=n.config.boid.fearDuration,this.nearestCreatureToPosition(t).position.vectorTo(this.position).scaleToLength(this.maxSpeed))}repulsionVector(){const t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,n.config.boid.repulsionRadius).filter(t=>t!==this);return 0===t.length?null:s.Vector2.average(t.map(t=>t.position.vectorTo(this.position))).scaleToLength(this.fearCountdown?this.maxSpeed:.9*this.speed)}alignmentVector(){const t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,n.config.boid.alignmentRadius).filter(t=>t!==this);if(0===t.length)return null;const e=s.Vector2.average(t.map(t=>t.velocity()));return this.fearCountdown?e.scaleToLength(this.maxSpeed):e}attractionVector(){const t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,n.config.boid.attractionRadius).filter(t=>t!==this);if(0===t.length)return null;const e=this.nearestCreatureToPosition(t);return this.position.vectorTo(e.position).scaleToLength(this.fearCountdown?this.maxSpeed:1.1*e.speed)}die(){this.creatureStorage.remove(this.id)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=i(1),s=i(4),r=i(0);e.default=class extends s.Creature{constructor(t){super(),this.inputHandler=t,this.colour="black",this.size=6,this.heading=0,this.speed=0,this.history=[],this.position=new n.Vector2(window.innerWidth/2,window.innerHeight/2);for(let t=0;t<r.config.creature.maxHistory;t++)this.history.push(this.position)}update(){this.updateHistory(),this.heading+=this.inputHandler.getHeadingUpdate(),this.speed+=this.inputHandler.getSpeedUpdate(),this.speed=Math.max(Math.min(this.speed,r.config.player.maxSpeed),r.config.player.minSpeed),this.position=this.position.add(this.velocity()).normalize()}}}]);