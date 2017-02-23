
//shadow rendering example
var demo = (function(){
  "use strict";

  // Physijs.scripts.worker = 'libs/physijs_worker.js';
  // Physijs.scripts.ammo = 'ammo.js';

  var scene = new THREE.Scene(),
  renderer = new THREE.WebGLRenderer({antialias: true}),
  camera,
  controls,
  stats,
  depthScale = 1.0;

  var params = {
    frameColor: 'Red'
  };

  var frameMat;
  // plane_top;
  function initScene() {
    stats = initStats();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color (0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var axes = new THREE.AxisHelper(40);

    scene.add(axes);
    var path = "models/pisa/";
    var format = '.png';
    var urls = [
      path + 'px'+ format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];


    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    var refractionCube = new THREE.CubeTextureLoader().load(urls);
    refractionCube.mapping = THREE.CubeRefractionMapping;


    document.getElementById('webgl-container').appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      1000000
    );

    // camera.rotation.set((90*(Math.PI/2)), 0, 0);
    camera.position.set(0, -50, 600);
    camera.lookAt(scene.position);


    scene.add(camera);


    var loaderFunc = function(scene, src, mat, bool1, bool2){
      var loader = new THREE.JSONLoader();
      var createMesh = function(geometry){

        var mesh = new THREE.Mesh(geometry, mat);
        mesh.scale.set(1,1,1);
        mesh.position.set(0,-150,0);
        mesh.castShadow = bool1;
        mesh.receiveShadow = bool2;
        mesh.geometry.mergeVertices();
        mesh.geometry.computeVertexNormals();
        scene.add(mesh);
      };
      loader.load(src, createMesh);
    };

    //Frame Geometry Mesh...........................................

    var texture = new THREE.TextureLoader().load("models/carColorMap.png");
    frameMat = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0x0000ff,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfFrame.js", frameMat, true, false);

    //Tires Geometry Mesh..........................................

    var texture = new THREE.TextureLoader().load("models/tire_color_map.png");
    var textureBump = new THREE.TextureLoader().load("models/tire_bump_map.png")
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: textureBump,
      bumpScale: .2,
      specular: 0x000000,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfTires.js", mat, true, true);

    // //Rims Geometry Meshes.....................................

    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: 1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfRims.js", mat, true, true);

    //Undercarriage Geometry Mesh................................

    var mat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x000000,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfUnderCarriage.js", mat, false, false);

    // // //Side Slats Geometry Mesh...............................
    //
    // var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    // var mat = new THREE.MeshLambertMaterial({
    //   map: texture,
    //   envMap: reflectionCube,
    //   combine: THREE.MixOperation,
    //   reflectivity: .2,
    //   shading: THREE.SmoothShading,
    //   side: THREE.DoubleSide
    // });
    //
    // loaderFunc(scene, "models/sideSlats.js", mat, false, false);
    //
    //  Windows Geometry Mesh...............................


    var mat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .3,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfWindows.js", mat, false, false);

    // Wipers Geometry Mesh...............................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfWipers.js", mat, true, false);

    // Brake Discs Geometry Mesh..........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/rcfBrakeDiscs.js", mat, true, true);


    // Grill Trim Geometry Mesh......................

    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: 1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });
    loaderFunc(scene, "models/rcfGrillTrim.js", mat, false, false);

    // Vent and grill backing Geometry Mesh..........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x000000,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

    loaderFunc(scene, "models/rcfVentBacking.js", mat, true, false);


    // Vents Geometry Mesh...........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x000000,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

    loaderFunc(scene, "models/rcfVents.js", mat, false, false);

    // Door Trim Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .3,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/rcfDoorTrim.js", mat, false, false);

    // Muffler Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .7,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/rcfMufflers.js", mat, true, false);

    // Tag plate Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/tagColorMap.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .5,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/rcfTag.js", mat, true, false);

    // Tail Pipes Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0x000000,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

      loaderFunc(scene, "models/rcfPipes.js", mat, true, true);


    // Ornaments Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: 1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

      loaderFunc(scene, "models/rcfOrnament.js", mat, true, true);

    // Mirrors Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: 1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

      loaderFunc(scene, "models/rcfMirrors.js", mat, true, true);


    // Fog Lights Mesh...........................
    //
    var mat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .8,
      opacity: .9,
      transparent: true,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

      loaderFunc(scene, "models/rcfFogLights.js", mat, false, false);

      //  Headlight Lenses Mesh...............................


      var mat = new THREE.MeshLambertMaterial({
        color: 0x000000,
        envMap: reflectionCube,
        combine: THREE.MixOperation,
        reflectivity: .8,
        opacity: .9,
        transparent: true,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide
      });

      loaderFunc(scene, "models/rcfHeadlightLenses.js", mat, false, false);


      // Inner Tail Lights Mesh...............................

      var mat = new THREE.MeshLambertMaterial({
        color: 0x999999,
        envMap: reflectionCube,
        combine: THREE.MixOperation,
        reflectivity: .2,
        opacity: 1,
        transparent: true,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide
      });

      loaderFunc(scene, "models/rcfWhiteTailLights.js", mat, false, false);


        //  Tail light Lenses Mesh...............................
        var texture = new THREE.TextureLoader().load("models/tailLightColorMap.png");
        var mat = new THREE.MeshLambertMaterial({
          map: texture,
          envMap: reflectionCube,
          combine: THREE.MixOperation,
          reflectivity: .1,
          opacity: 1,
          transparent: true,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide
        });

        loaderFunc(scene, "models/rcfRedTailLights.js", mat, false, false);

        // Rear Bottom Plate Mesh...............................

        var texture = new THREE.TextureLoader().load("models/metal.png");
        var mat = new THREE.MeshPhongMaterial({
          map: texture,
          reflectivity: .5,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide,
        });

        loaderFunc(scene, "models/rcfBottomPlate.js", mat, false, false);


        // Rear Bottom Backing Plate Mesh...............................

        var texture = new THREE.TextureLoader().load("models/darkMetal.png");
        var mat = new THREE.MeshPhongMaterial({
          map: texture,
          reflectivity: .7,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide,
        });

        loaderFunc(scene, "models/rcfBacking.js", mat, false, false);

        // Door Plenum Mesh...............................

        var texture = new THREE.TextureLoader().load("models/metal.png");
        var mat = new THREE.MeshLambertMaterial({
          map: texture,
          envMap: reflectionCube,
          combine: THREE.MixOperation,
          reflectivity: 1,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide
        });

        loaderFunc(scene, "models/rcfDoorPlenum.js", mat, false, false);


        // Door End Mesh...............................

        var texture = new THREE.TextureLoader().load("models/darkMetal.png");
        var mat = new THREE.MeshPhongMaterial({
          map: texture,
          reflectivity: .1,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide,
        });

          loaderFunc(scene, "models/rcfDoorEnd.js", mat, false, false);







    //Lights..................................


    function lights( color, intensity, distance, x, y, z, bool1, bool2, width, height){
      var light =new THREE.PointLight(color, intensity, distance);
      light.position.set(x, y, z);
      light.castShadow = bool1;
      light.physicalAttenuation = bool2;
      light.shadow.mapSize.width =width;
      light.shadow.mapSize.height =height;
      scene.add(light);
    };


    //Point light #1.........................................
    lights(0xffffff, .8, 950, -700, 70, 225, true, true, 2048, 2048);

    //Point light #2.........................................
    lights(0xffffff, .8, 950, 700, 70, 225, false, true, 0, 0);

    //Point light #3.........................................
    lights(0xffffff, .8, 950, 250, 70, 225, false, true, 0, 0);

    //Point light #4.........................................
    lights(0xffffff, .8, 950, -250, 70, 225, false, true, 0, 0);

    //Point light #5.........................................
    lights(0xffffff, .8, 1200, -650, 70, -410, false, true, 0, 0);

    //Point light #6.........................................
    lights(0xffffff, .8, 1000, 100, 70, -350, true, true, 1024, 1024);

    // var rectLight = new THREE.RectAreaLight(0xFFFFFF, undefined, 5000, 5000);
    // rectLight.matrixAutoUpdate = true;
    // rectLight.intensity = 1000000.0;
    // rectLight.position.set(0, 115, 700);
    // rectLight.rotation.y = 180 * (Math.PI/180);
    //
    // var rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);
    //
    // scene.add(rectLight);


    //GUI....................................................
    var gui = new dat.GUI();

    gui.add(params, 'frameColor', ['Red', 'White', 'Blue', 'Green', 'Black']);
    gui.open();

    // Camera Controller......................................
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.addEventListener('change', render);

    // controls.minPolarAngle = 0;
    // controls.maxPolarAngle = 90*(Math.PI/2);
    // controls.minAzimuthAngle = -90*(Math.PI/2);
    // controls.maxAzimuthAngle = 90*(Math.PI/2);



    // controls = new THREE.FirstPersonControls(camera);
    // controls.movementSpeed = 100;
    // controls.domElement = document.getElementById('webgl-container');
    // controls.rollSpeed = Math.PI/24;



    //Call to Render Scene Function
    render();
  }

  function animate(){
    render();
    requestAnimationFrame(animate);
    frameMat.update();
    // controls.update();
  };

  function initStats(){
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
  };

  function render(){
    if (frameMat !== undefined) {
      var newColor = frameMat.color;
      switch( params.frameColor ) {
        case 'Red': newColor = new THREE.Color(0x990000); break;
        case 'White': newColor = new THREE.Color(0x888888); break;
        case 'Blue': newColor = new THREE.Color(0x0066FF); break;
        case 'Green': newColor = new THREE.Color(0x008800); break;
        case 'Black': newColor = new THREE.Color(0x000000); break;
      };
      frameMat.color = newColor;
      frameMat.needsUpdate = true;
    };
    stats.update();
    renderer.render(scene, camera);
  };


  function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth , window.innerHeight);
  };

  window.onload = initScene;
  window.addEventListener('resize', onResize, false);


  return {
    scene: scene
  }

})();
