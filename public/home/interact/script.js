window.addEventListener('load', function(){    

      class App {
        constructor() {         
      
          this.playIntro = document.querySelector('.play-intro');
          this.playIntro.classList.add('control-show');

          this.songs = ["breaking-the-habit.mp3","castle-of-glass.mp3","new-divide.mp3","one-more-light.mp3"];
          this.indexSongs = 0;

          this.count = 0;
          this.percent = 0;
          this.playing = false;
      
          this.objects = [];

          this.rotation = false;
          this.angle = 0;

          this.newDisc = null;

          this.complete('./data/interaction/songs/'+this.songs[this.indexSongs]);
        }        
      
        progress(percent) {
          this.loaderBar.style.transform = `scale(${percent / 100}, 1)`;
          
          if (percent === 100) {
            setTimeout(() => {
              requestAnimationFrame(() => {
                this.playIntro.classList.add('control-show');
                this.loaderBar.classList.add('removeLoader');
                this.loaderBar.style.transform = 'scale(1, 0)';
              })
            }, 300);
          }
        }
      
        complete(file) {
          setTimeout(() => {
            this.firstRing = new THREE.Object3D();
            this.secondRing = new THREE.Object3D();
            this.thirdRing = new THREE.Object3D();
            this.fourthRing = new THREE.Object3D();
      
            this.setupAudio();
            this.addAnimationElements();
            this.addSoundControls();
            this.createScene();
            this.createCamera();
            this.addAmbientLight();
            this.addSpotLight();
      
            //this.addCameraControls();
            this.addFloor();
      
            this.createRingOfSquares(20, 1, 0x828282, this.firstRing);
            this.createRingOfSquares(30, 2, 0x0A0A0A, this.secondRing);
            this.createRingOfSquares(40, 3, 0x828282, this.thirdRing);
            this.createRingOfSquares(50, 4, 0x0A0A0A, this.fourthRing);
      
            this.animate();
      
            this.playSound(file);
          }, 200);
        }

        addAnimationElements(){
          this.tl = new TimelineLite();

          this.disc = document.querySelector('.disc');
          this.stick = document.querySelector('.stick');
        }
      
        addSoundControls() {
          this.btnPlay = document.querySelector('.play');
          this.btnPause = document.querySelector('.pause');
          this.btnNext = document.querySelector('.next');
          this.btnBefore = document.querySelector('.before');
      
          this.btnPlay.addEventListener('click', () => {
            this.play();
          });
      
          this.btnPause.addEventListener('click', () => {
            this.pause();
          });

          this.btnNext.addEventListener('click', () => {
            this.next();
          });
      
          this.btnBefore.addEventListener('click', () => {
            this.before();
          });
        }
      
        createRingOfSquares(count, radius, color, group) {
          const size = .5;
          const geometry = new THREE.BoxGeometry(size, size, size);
          const material = new THREE.MeshLambertMaterial({
            color
          });
          
          for (let index = 0; index < count; index++) {
            const l = 360 / count;
            const pos = this.radians(l * index);
            const obj = this.createObj(color, geometry, material);
            const distance = (radius * 2);
            const sin = Math.sin(pos) * distance;
            const cos = Math.cos(pos) * distance;
      
            obj.position.set(sin, 0, cos);

              obj.rotateY(pos);
      
            this.objects.push(obj);
      
            group.add(obj);
          }
      
          this.scene.add(group);
        }
        
        play() {
          this.evaluateDisc()
          TweenLite.to(this.stick, 1, {rotation:20, transformOrigin:"right 50%"});
          this.audioCtx.resume();
          this.audioElement.play();
          this.btnPlay.classList.remove('control-show');
          this.btnPause.classList.add('control-show');
          this.rotation = true;
        }
        
        pause() {
          TweenLite.to(this.stick, 1, {rotation:0, transformOrigin:"right 50%"});
          this.audioElement.pause();
          this.btnPause.classList.remove('control-show');
          this.btnPlay.classList.add('control-show');
          this.rotation = false;
        }

        next(){
          this.pause();
          this.createNewDisc();
          this.indexSongs++
          if(this.indexSongs == this.songs.length){
            this.indexSongs = 0;
          }
          this.audioElement.src = './data/interaction/songs/'+this.songs[this.indexSongs];
          this.pause();
        }

        before(){
          this.pause();
          this.createNewDisc();
          this.indexSongs--;
          if(this.indexSongs == -1){
            this.indexSongs = this.songs.length-1;
          }
          this.audioElement.src = './data/interaction/songs/'+this.songs[this.indexSongs];
        }

        createNewDisc(){
          if(this.newDisc == null){
            this.newDisc = document.createElement('img');
            this.newDisc.setAttribute('src','./data/interaction/images/disc.png');
            this.newDisc.setAttribute('class','disc');

            this.newDisc.style.cssText = 'position: absolute;width: 25.57vw;left: 100vw;top: 14vw;transition: 1s ease;'

            document.querySelector('.interaction').appendChild(this.newDisc);
    
            TweenLite.to(this.newDisc, 0.1, {
              left: window.innerWidth*(0.715),
            })
            TweenLite.to(this.disc, 0.1, {
              left: window.innerWidth*(-0.3),
            })
          }
        }

        evaluateDisc(){
          if(this.newDisc != null){
            this.disc.remove(0);
            this.disc = this.newDisc;
            this.newDisc = null;
            
            TweenLite.to(this.disc, 0.1, {
              left: window.innerWidth*(0.07),
              top: window.innerWidth*(0.08),
            })
          }
        }

        createScene() {
          this.scene = new THREE.Scene();
          //this.scene.background = new THREE.Color(0xffffff);
          this.scene.background = new THREE.TextureLoader().load( './data/interaction/images/background.png' );
          this.scene.background.wrapS = THREE.ClampToEdgeWrapping;
          this.scene.background.wrapT = THREE.ClampToEdgeWrapping;
          
      
          this.renderer = new THREE.WebGLRenderer({ antialias: true });
          this.renderer.setSize(window.innerWidth, (window.innerWidth/16)*9 );
      
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
          document.querySelector('.interaction').appendChild(this.renderer.domElement);
        }
      
        createCamera() {
          const width = window.innerWidth;
          const height =  (window.innerWidth/16)*9;
          
          this.camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
          
          this.camera.position.set(-25.4, 50, 1.3);
          this.camera.lookAt(new THREE.Vector3(-25.4 ,0, 1.3));
                
          this.scene.add(this.camera);
        }
      
        addCameraControls() {
          //this.controls = new THREE.OrbitControls(this.camera);
        }
      
        createObj(color, geometry, material) {
          const obj = new THREE.Mesh(geometry, material);
          
          obj.castShadow = true;
          obj.receiveShadow = true;
      
          return obj;
        }
      
        onResize() {
          const ww = window.innerWidth;
          const wh = (window.innerWidth/16)*9;
          
          this.camera.aspect = ww / wh;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(ww, wh);
        }
      
        addFloor() {
          const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
          const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.08 });
          const plane = new THREE.Mesh(planeGeometry, planeMaterial);

          
          planeGeometry.rotateX(- Math.PI / 2);
      
          plane.position.y = -1;
          plane.receiveShadow = true;
      
          this.scene.add(plane);
        }
      
        moveRingGroup(group, value) {
          if(this.rotation)
          group.rotation.y += value;
        }
      
        addSpotLight() {
          const spotLight = new THREE.SpotLight(0xffffff);
      
          spotLight.position.set(0, 20, 1);
          spotLight.castShadow = true;
      
          this.scene.add(spotLight);
      
          const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        }
      
        addAmbientLight() {
          const light = new THREE.AmbientLight(0xffffff);
          
          this.scene.add(light);
        }
      
        animate() {
          //this.controls.update();
      
          this.drawWave();

          this.moveDisc();
      
          this.renderer.render(this.scene, this.camera);
      
          requestAnimationFrame(this.animate.bind(this));
        }

        moveDisc(){
          this.angle += 3;
          if(this.rotation)
          this.disc.setAttribute('style','transform:rotate('+this.angle+'deg)');
        }
      
        radians(degrees) {
          return degrees * Math.PI / 180;
        }
      
        drawWave() {
          //if (this.playing) {
            this.analyser.getByteFrequencyData(this.frequencyData);
      
            for (var i = 0; i < 140; i++) {
              const p = this.frequencyData[i];
              const s = this.objects[i];
              const z = s.position;
      
              TweenMax.to(z, .2, {
                y: p / 25
              });
            }
          //}
      
          this.moveRingGroup(this.firstRing, .01);
          this.moveRingGroup(this.secondRing, -.01);
          this.moveRingGroup(this.thirdRing, .02);
          this.moveRingGroup(this.fourthRing, -.02);
        }
      
        setupAudio() {
          this.audioElement = document.getElementById('audio');
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)
          this.analyser = this.audioCtx.createAnalyser();
      
          this.source = this.audioCtx.createMediaElementSource(this.audioElement);
          this.source.connect(this.analyser);
          this.source.connect(this.audioCtx.destination);
      
          this.bufferLength = this.analyser.frequencyBinCount;
      
          this.frequencyData = new Uint8Array(this.bufferLength);
          this.audioElement.volume = .5;
      
          document.querySelector('.interaction').addEventListener('mouseup', () => {      
            requestAnimationFrame(() => {
              document.querySelector('.interaction').style.cursor = '-moz-grab';
              document.querySelector('.interaction').style.cursor = '-webkit-grab';
            });
          });
      
          document.querySelector('.interaction').addEventListener('mousedown', () => {
            console.log('down');
            requestAnimationFrame(() => {
              document.querySelector('.interaction').style.cursor = '-moz-grabbing';
              document.querySelector('.interaction').style.cursor = '-webkit-grabbing';
            });
          });
          
          this.audioElement.addEventListener('playing', () => {
            this.playing = true;
          });
          
          this.audioElement.addEventListener('pause', () => {
            this.playing = false;
          });
          
          this.audioElement.addEventListener('ended', () => {
            this.playing = false;
          });
        }
      
        playSound(file) {
          setTimeout(() => {
            this.playIntro.addEventListener('click', (evt)=>{
              evt.currentTarget.classList.remove('control-show');
              this.btnBefore.classList.add('control-show');
              this.btnNext.classList.add('control-show');
              this.play();
              
            });
            
            this.audioElement.src = file;
          }, 500);
        }
      }
      
      window.app = new App();
      window.addEventListener('resize', app.onResize.bind(app));
})
