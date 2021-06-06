(()=>{var i={boid:{alignmentRadius:40,alignmentRadiusDefault:40,attractionRadius:200,attractionRadiusDefault:200,defaultColour:"LightSteelBlue",fearDuration:30,maxSpeed:6,minSpeed:3,quantity:100,repulsionRadius:30,repulsionRadiusDefault:30,size:4,visionRadius:200},creature:{acceleration:.2,headingFuzz:.05,maxHistory:5,turningMax:.2},hunter:{defaultColour:"pink",eatRadius:20,maxSpeed:5,minSpeed:0,quantity:0,size:8,visionRadius:90},player:{maxSpeed:64,minSpeed:0},screen:{maxX:1e3,maxY:1e3}};var o=class{static average(t){return t.length===0?new o:t.reduce((r,n)=>r.add(n)).scaleByScalar(1/t.length)}static fromHeadingAndSpeed(t,e){return e?new o(e*Math.cos(t),e*Math.sin(t)):new o(0,0)}constructor(t=0,e=0){this.x=t%i.screen.maxX,this.y=e%i.screen.maxY,this.length=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}unitVector(){return this.scaleByScalar(1/this.length)}distance(t){return this.vectorTo(t).length}vectorTo(t){let e=(t.x-this.x)%i.screen.maxX;e>i.screen.maxX/2&&(e-=i.screen.maxX),e<-(i.screen.maxX/2)&&(e+=i.screen.maxX);let r=(t.y-this.y)%i.screen.maxY;return r>i.screen.maxY/2&&(r-=i.screen.maxY),r<-(i.screen.maxY/2)&&(r+=i.screen.maxY),new o(e,r)}rotate(t){return new o(this.x*Math.cos(t)-this.y*Math.sin(t),this.x*Math.sin(t)+this.y*Math.cos(t))}angleTo(t){return Math.atan2(this.x*t.y-this.y*t.x,this.x*t.x+this.y*t.y)}add(t){return new o(this.x+t.x,this.y+t.y)}subtract(t){return new o(this.x-t.x,this.y-t.y)}equals(t){return this.x===t.x&&this.y===t.y}scaleByScalar(t){return new o(this.x*t,this.y*t)}scaleToLength(t){return this.length?this.scaleByScalar(t/this.length):this}isParallelTo(t){return this.x*t.y==this.y*t.x}normalize(){return 0<=this.x&&0<=this.y?this:new o((this.x%i.screen.maxX+i.screen.maxX)%i.screen.maxX,(this.y%i.screen.maxY+i.screen.maxY)%i.screen.maxY)}toHeading(){return Math.atan2(this.y,this.x)}toString(){return`[${this.x}, ${this.y}]`}};var S=class{constructor(t){this.cameraPosition=new o(window.innerWidth,window.innerHeight),this.canvas=t;let e=this.canvas.getContext("2d");if(e)this.ctx=e;else throw new Error("could not get canvas context");this.canvas.height=i.screen.maxY,this.canvas.width=i.screen.maxX,this.setScreenSize()}onclick(t){this.canvas.onclick=t}setScreenSize(){window&&(i.screen.maxX=window.innerWidth,i.screen.maxY=window.innerHeight),this.ctx.canvas.width=i.screen.maxX,this.ctx.canvas.height=i.screen.maxY}draw(t,e=new o(window.innerWidth/2,window.innerHeight/2)){this.cameraPosition=e,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.setScreenSize(),this.drawBackground(),this.drawGhosts(t),t.forEach(r=>{this.drawCreature(r)})}drawBackground(){let t=window.innerWidth,e=window.innerHeight,{x:r,y:n}=this.cameraPosition;for(let a=0;a<t;a+=200)for(let c=0;c<e;c+=200){let m=(a+t-r)%t,g=(c+e-n)%e;this.ctx.beginPath(),this.ctx.arc(m,g,2,0,2*Math.PI),this.ctx.fillStyle="silver",this.ctx.fill()}}drawGhosts(t){if(!!i.creature.maxHistory)for(let e=0;e<i.creature.maxHistory;e++)t.forEach(r=>{this.drawGhost(r,e)})}drawGhost(t,e){this.drawCreatureBody(t,e)}drawCreature(t){this.drawCreatureBody(t),this.drawCreatureBeak(t)}getPositionInCameraSpace(t){return t.add(new o(window.innerWidth/2,window.innerHeight/2)).subtract(this.cameraPosition).normalize()}getPositionInWorldSpace(t){return t.subtract(new o(window.innerWidth/2,window.innerHeight/2)).add(this.cameraPosition).normalize()}drawCreatureBody(t,e){let r=e?t.history[e]:t.position;r=this.getPositionInCameraSpace(r);let n=e?t.size*((e+1)/(i.creature.maxHistory+1)):t.size;this.ctx.beginPath(),this.ctx.arc(r.x,r.y,n,0,2*Math.PI),this.ctx.fillStyle=t.colour,this.ctx.fill()}drawCreatureBeak(t){let e=this.getPositionInCameraSpace(t.position);this.ctx.beginPath(),this.ctx.arc(e.x+(t.size+1)*Math.cos(t.heading),e.y+(t.size+1)*Math.sin(t.heading),t.size/2,0,2*Math.PI),this.ctx.fillStyle="black",this.ctx.fill()}};var h=class{distanceToCreature(t){return this.position.distance(t.position)}updateHistory(){this.history.push(this.position),this.history=this.history.slice(1)}velocity(){return o.fromHeadingAndSpeed(this.heading,this.speed)}};var M=class{constructor(t,e,r=Math.random()){this.input=t,this.output=e,this.weight=r}getNormalizedOutput(){return 2*this.input.value*this.weight}};var x=class{constructor(){this.inputs=[],this.outputs=[],this.value=0}connectOutput(t){this.outputs.push(t)}connectInput(t){this.inputs.push(t)}static connectPair(t,e){let r=new M(t,e);t.connectOutput(r),e.connectInput(r)}updateValue(){this.step3Function()}step2Function(){let e=this.inputs.reduce((r,n)=>r+n.getNormalizedOutput(),0)/this.inputs.length;this.value=e<.5?0:1}step3Function(){let e=this.inputs.reduce((r,n)=>r+n.getNormalizedOutput(),0)/this.inputs.length;if(e<1/3){this.value=0;return}if(e<2/3){this.value=.5;return}this.value=1}};var y=class{constructor(t){this.neurons=[];for(let e=0;e<t;e++)this.neurons.push(new x)}connectPriorLayer(t){this.neurons.forEach(e=>{t.neurons.forEach(r=>{x.connectPair(r,e)})})}injectInputVector(t){for(let e=0;e<t.length;e++)this.neurons[e].value=t[e]}updateValues(){this.neurons.forEach(t=>t.updateValue())}outputVector(){return this.neurons.map(t=>t.value)}};var V=class{constructor(t){let e=new y(t[0]);this.layers=[e];let r=e;for(let n=1;n<t.length;n++){let a=new y(t[n]);a.connectPriorLayer(r),this.layers.push(a),r=a}}processInput(t){this.injectInputVectorToInputLayer(t);for(let e=1;e<this.layers.length;e++)this.layers[e].updateValues();return this.layers[this.layers.length-1].outputVector()}injectInputVectorToInputLayer(t){this.layers[0].injectInputVector(t)}};var B=[1,3,2],w=class extends h{constructor(t=0,e,r){super();this.id=t;this.creatureStorage=e;this.colour=i.hunter.defaultColour,this.maxSpeed=i.hunter.maxSpeed,this.minSpeed=i.hunter.minSpeed,this.size=i.hunter.size,this.heading=0,this.speed=0,this.history=[],this.position=r||new o(Math.random()*i.screen.maxX,Math.random()*i.screen.maxY);for(let n=0;n<i.creature.maxHistory;n++)this.history.push(this.position);this.initializeVelocity(),this.net=new V(B)}initializeVelocity(){this.heading=Math.random()*2*Math.PI,this.speed=i.hunter.minSpeed}update(){this.eat(),this.move(),this.updateHistory()}eat(){this.creatureStorage.getBoidsInArea(this.position,i.hunter.eatRadius).forEach(t=>t.die())}move(){this.updateHistory(),this.position=this.position.add(this.velocity()).normalize();let t=this.getNeuralNetInputVector(),e=this.net.processInput(t);this.parseOutputToAction(e)}getNeuralNetInputVector(){let t=this.creatureStorage.getAllBoids().sort((a,c)=>a.distanceToCreature(this)-c.distanceToCreature(this))[0],e=this.position.vectorTo(t.position);return[this.velocity().angleTo(e)/(2*Math.PI)+.5]}parseOutputToAction(t){let e=t[0],r=this.heading-i.creature.turningMax,n=i.creature.turningMax*2;this.heading=r+e*n;let a=t[1],c=this.speed-i.creature.acceleration,m=i.creature.acceleration*2,g=c+m*a;this.speed=Math.min(Math.max(g,0),i.hunter.maxSpeed)}};var H=class{constructor(t,e){this.weightedVector=t;this.color=e}};var d=class{constructor(t,e){this.getIdealWeightedHeading=t;this.getColor=e}getCurrentPriority(){let t=this.getIdealWeightedHeading();return t.weight>0?new H(t,this.getColor()):null}};var u=class{constructor(t=new o,e=0){this.vector=t;this.weight=e}static average(t){if(t.length===0)return new o;let e=t.reduce((r,n)=>({vector:r.vector.add(n.vector.scaleByScalar(n.weight)),weight:r.weight+n.weight}),{vector:new o,weight:0});return e.vector.scaleByScalar(1/e.weight)}};var I=class extends h{constructor(t=0,e,r){super();this.id=t;this.creatureStorage=e;this.colour="black",this.position=r||new o(Math.random()*i.screen.maxX,Math.random()*i.screen.maxY),this.history=[];for(let n=0;n<i.creature.maxHistory;n++)this.history.push(this.position);this.initializeVelocity()}distanceToCreature(t){return this.position.distance(t.position)}move(){this.updateHistory(),this.position=this.position.add(this.velocity()).normalize(),this.updateHeading()}updateHeading(){let t=this.getCurrentPriorities().sort((e,r)=>r.weightedVector.weight-e.weightedVector.weight);if(t.length===0){this.defaultBehaviour();return}this.colour=t[0].color,this.updateHeadingTowards(u.average(t.map(e=>e.weightedVector)))}getCurrentPriorities(){return this.behaviours.map(t=>t.getCurrentPriority()).filter(t=>t&&t.weightedVector.vector.length&&t.weightedVector.weight)}defaultBehaviour(){this.colour=this.defaultColour,this.speed=Math.max(this.velocity.length-i.creature.acceleration,this.minSpeed);let t=2*i.creature.turningMax*Math.random()-i.creature.turningMax;this.heading=this.heading+t}updateHeadingTowards(t){if(!t)return;let e=Math.max(Math.min(t.length,this.maxSpeed),this.minSpeed);e=Math.max(Math.min(e,this.speed+i.creature.acceleration),this.speed-i.creature.acceleration),this.speed=e;let r=this.velocity().angleTo(t),n=Math.max(Math.min(r,i.creature.turningMax),-i.creature.turningMax);this.heading=this.heading+n+2*i.creature.headingFuzz*Math.random()-i.creature.headingFuzz}nearestCreatureToPosition(t){if(t.length===0)throw new Error("Nearest creature is undefined for zero creatures");return t.reduce((e,r)=>{let n=this.position.vectorTo(r.position).length;return e.distance>n?{distance:n,nearest:r}:e},{distance:this.position.vectorTo(t[0].position).length,nearest:t[0]}).nearest}};var p=class extends I{constructor(t,e,r){super(t,e,r);this.defaultColour=i.boid.defaultColour,this.maxSpeed=i.boid.maxSpeed,this.minSpeed=i.boid.minSpeed,this.size=i.boid.size,this.fearCountdown=0,this.heading=2*Math.PI*Math.random(),this.speed=i.boid.maxSpeed,this.behaviours=[new d(()=>this.hunterEvasion(),()=>"red"),new d(()=>this.repulsion(),()=>this.fearCountdown?"red":"orange"),new d(()=>this.alignment(),()=>this.fearCountdown?"red":"blue"),new d(()=>this.attraction(),()=>this.fearCountdown?"red":"green")]}initializeVelocity(){this.heading=Math.random()*2*Math.PI,this.speed=i.boid.maxSpeed}update(){this.fearCountdown&&this.fearCountdown--,this.move()}hunterEvasion(){let t=this.creatureStorage.getHuntersInArea(this.position,i.boid.visionRadius);if(t.length===0)return new u;this.fearCountdown=i.boid.fearDuration;let r=this.nearestCreatureToPosition(t).position.vectorTo(this.position);return new u(r.scaleToLength(this.maxSpeed),100)}repulsion(){let t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,i.boid.repulsionRadius).filter(n=>n!==this);if(t.length===0)return new u;let e=t.map(n=>n.position.vectorTo(this.position)).map(n=>new u(n,this.repulsionWeightFrom(n))),r=e.reduce((n,a)=>n+a.weight,0);return new u(u.average(e),r)}repulsionWeightFrom(t){let r=(i.boid.repulsionRadius-t.length)/i.boid.repulsionRadius;return Math.pow(r,2)*i.boid.repulsionRadius}alignment(){let t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,i.boid.alignmentRadius).filter(r=>r!==this);if(t.length===0)return new u;let e=o.average(t.map(r=>r.velocity()));return new u(this.fearCountdown?e.scaleToLength(this.maxSpeed):e,15)}attraction(){let t=this.creatureStorage.getBoidsOrPlayersInArea(this.position,i.boid.attractionRadius).filter(r=>r!==this);if(t.length===0)return new u;let e=this.nearestCreatureToPosition(t);return new u(this.position.vectorTo(e.position).scaleToLength(this.fearCountdown?this.maxSpeed:e.speed*1.1),10)}die(){this.creatureStorage.remove(this.id)}};function z(){i.boid.repulsionRadius?i.boid.repulsionRadius=0:i.boid.repulsionRadius=i.boid.repulsionRadiusDefault}function A(){i.boid.alignmentRadius?i.boid.alignmentRadius=0:i.boid.alignmentRadius=i.boid.alignmentRadiusDefault}function E(){i.boid.attractionRadius?i.boid.attractionRadius=0:i.boid.attractionRadius=i.boid.attractionRadiusDefault}function L(s){({"1":z,"2":A,"3":E})[s.key]?.()}var k=class{constructor(){this.left=!1;this.right=!1;this.up=!1;this.down=!1;window.addEventListener("keyup",L),window.addEventListener("touchcancel",()=>{this.left=!1,this.right=!1}),window.addEventListener("touchend",()=>{this.left=!1,this.right=!1}),window.addEventListener("mouseup",()=>{this.left=!1,this.right=!1}),window.addEventListener("keyup",t=>{this.setArrow(t.key,!1)}),window.addEventListener("touchstart",t=>this.handleTouchSteering(t)),window.addEventListener("touchmove",t=>this.handleTouchSteering(t)),window.addEventListener("mousedown",t=>this.handleMouseSteering(t)),window.addEventListener("keydown",t=>{this.setArrow(t.key,!0)})}getHeadingUpdate(){return .1*(+this.right-+this.left)}getSpeedUpdate(){return .5*(+this.up-+this.down)}handleTouchSteering(t){let e=!0,r=!0;for(let n=0;n<t.touches.length;n++)t.touches.item(n).clientX<window.innerWidth/2?e=!1:r=!1;this.left=r,this.right=e}handleMouseSteering(t){if(t.clientX<window.innerWidth/2){this.left=!0;return}this.right=!0}setArrow(t,e){({ArrowLeft:()=>this.left=e,ArrowRight:()=>this.right=e,ArrowUp:()=>this.up=e,ArrowDown:()=>this.down=e})[t]?.()}};var v=class extends h{constructor(){super();this.colour="black";this.size=6;this.heading=1.5*Math.PI;this.speed=3.1;this.history=[];this.inputHandler=new k;this.position=new o(window.innerWidth/2,window.innerHeight/2);for(let t=0;t<i.creature.maxHistory;t++)this.history.push(this.position)}update(){this.updateHistory(),this.heading+=this.inputHandler.getHeadingUpdate(),this.speed+=this.inputHandler.getSpeedUpdate(),this.speed=Math.max(Math.min(this.speed,i.player.maxSpeed),i.player.minSpeed),this.position=this.position.add(this.velocity()).normalize()}};var l=100,P=class{constructor(){this.nextId=0,this.creatures=new Map,this.bucketMap=[],this.bucketColumns=1,this.bucketRows=1,this.update()}update(){this.resetBucketMap(),this.creatures.forEach(t=>{let e=Math.min(Math.floor(t.position.x/l),this.bucketColumns-1),r=Math.min(Math.floor(t.position.y/l),this.bucketRows-1);this.bucketMap[e][r].push(t)})}addHunter(t){let e=new w(this.nextId,this,t);return this.creatures.set(this.nextId,e),this.nextId++,e}addBoid(t){let e=new p(this.nextId,this,t);return this.creatures.set(this.nextId,e),this.nextId++,e}addPlayerFish(){let t=new v;return this.creatures.set(this.nextId,t),this.nextId++,t}getAllHunters(){return[...this.creatures.values()].filter(t=>t instanceof w)}getAllBoids(){return[...this.creatures.values()].filter(t=>t instanceof p)}getAllCreatures(){return[...this.creatures.values()]}getHuntersInArea(t,e){return this.getCreaturesInArea(t,e).filter(r=>r instanceof w&&r.position.distance(t)<e)}getBoidsInArea(t,e){return this.getCreaturesInArea(t,e).filter(r=>r instanceof p&&r.position.distance(t)<e)}getBoidsOrPlayersInArea(t,e){return this.getCreaturesInArea(t,e).filter(r=>(r instanceof p||r instanceof v)&&r.position.distance(t)<e)}getCreaturesInArea(t,e){let r=Math.floor(t.x/l),n=Math.floor(t.y/l),a=Math.ceil(e/l),c=(r-a+this.bucketColumns)%this.bucketColumns,m=(r+a+1)%this.bucketColumns,g=(n-a+this.bucketRows)%this.bucketRows,T=(n+a+1)%this.bucketRows,C=[];for(let b=c;b!==m;b++,b=b%this.bucketColumns)for(let f=g;f!==T;f++,f=f%this.bucketRows)C=C.concat(this.bucketMap[b][f]);return C}getHunterCount(){return this.getAllHunters().length}getBoidCount(){return this.getAllBoids().length}remove(t){this.creatures.delete(t)}resetBucketMap(){this.bucketMap=[],this.bucketColumns=Math.ceil(i.screen.maxX/l),this.bucketRows=Math.ceil(i.screen.maxY/l);for(let t=0;t<this.bucketColumns;t++){let e=[];for(let r=0;r<this.bucketRows;r++)e.push([]);this.bucketMap.push(e)}}};function W(s){return s.nodeName==="CANVAS"}var R=class{constructor(){this.fpsTarget=60;let t=document.getElementById("canvas");if(!W(t))throw new Error("couldn't find 'canvas' on document");this.canvas=new S(t),this.creatureStorage=new P;for(let e=0;e<i.boid.quantity;e++)this.creatureStorage.addBoid();for(let e=0;e<i.hunter.quantity;e++)this.creatureStorage.addHunter();this.playerFish=this.creatureStorage.addPlayerFish()}runSimulation(){this.tick(performance.now(),0)}tick(t,e){let r=performance.now(),n=r-t;for(t=r,e+=n;e>=1e3/this.fpsTarget;)this.updateSimulation(),e-=1e3/this.fpsTarget;this.renderSimulation(),setTimeout(()=>this.tick(t,e),0)}updateSimulation(){this.creatureStorage.update();for(let t of this.creatureStorage.getAllBoids())t.update();for(let t of this.creatureStorage.getAllHunters())t.update();this.playerFish.update()}renderSimulation(){this.canvas.draw(this.creatureStorage.getAllCreatures(),this.playerFish.position)}};document.addEventListener("DOMContentLoaded",()=>{new R().runSimulation()},!1);})();