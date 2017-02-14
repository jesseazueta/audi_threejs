
//shadow rendering example
var demo = (function(){
  "use strict";

  // Physijs.scripts.worker = 'libs/physijs_worker.js';
  // Physijs.scripts.ammo = 'ammo.js';

  var scene = new THREE.Scene(),
  renderer = new THREE.WebGLRenderer({antialias: true}),
  camera,
  geo,
  controls,
  ssaoPass,
  depthMaterial,
  effectComposer,
  depthRenderTarget,
  stats,
  depthScale = 1.0;
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
    camera.position.set(0, 10, 0);
    camera.lookAt(scene.position);


    scene.add(camera);


    var loaderFunc = function(scene, src, mat, bool1, bool2){
      var loader = new THREE.JSONLoader();
      var createMesh = function(geometry){

        var mesh = new THREE.Mesh(geometry, mat);
        mesh.scale.set(1,1,1);
        mesh.position.set(0,-200,0);
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
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0x990000,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/frame.js", mat, true, false);

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

    loaderFunc(scene, "models/tires.js", mat, true, true);

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

    loaderFunc(scene, "models/rims.js", mat, true, true);

    //Undercarriage Geometry Mesh................................

    var mat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x000000,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/under_carriage.js", mat, false, false);

    // //Side Slats Geometry Mesh...............................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/sideSlats.js", mat, false, false);

    //  Windows Geometry Mesh...............................


    var mat = new THREE.MeshLambertMaterial({
      color: 0x000000,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: .3,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/glass.js", mat, false, false);

    // Wipers Lights Geometry Mesh...............................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/wipers.js", mat, true, false);

    // //Blades Geometry Meshes...........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .5,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

    loaderFunc(scene, "models/blades.js", mat, true, false);
    //
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

    loaderFunc(scene, "models/brakeDiscs.js", mat, true, true);

    // Gas Tank Geometry Mesh..........................

    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      envMap: reflectionCube,
      combine: THREE.MixOperation,
      reflectivity: 1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });


    loaderFunc(scene, "models/gasTank.js", mat, false,true);


    // Grill Geometry Mesh......................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x000000,
      reflectivity: .5,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });
    loaderFunc(scene, "models/grill.js", mat, false, false);

    // Vent and grill backing Geometry Mesh..........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x000000,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

    loaderFunc(scene, "models/backing.js", mat, true, false);

    //
    // Vents Geometry Mesh...........................

    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x000000,
      reflectivity: .2,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

    loaderFunc(scene, "models/vents.js", mat, false, false);

    // Window Separators Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .3,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/windowSeparator.js", mat, false, false);


    // Air Slats Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .7,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/airSlats.js", mat, true, true);

    // TailPipe Backing Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .7,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/tailPipeBacking.js", mat, true, false);

    // Tag plate Geometry Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .5,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/tagPlate.js", mat, true, false);

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

      loaderFunc(scene, "models/pipes.js", mat, true, true);


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

      loaderFunc(scene, "models/ornaments.js", mat, true, true);

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

      loaderFunc(scene, "models/mirrors.js", mat, true, true);


    // Headlights Base Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/metal.png");
    var mat = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0xffffff,
      reflectivity:1,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

      loaderFunc(scene, "models/headLightBase.js", mat, false, false);

    // Headlights Bulbs Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/headLightColorMap.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      specular: 0x000000,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveMap: texture
    });

      loaderFunc(scene, "models/headLightBulbs.js", mat, false, false);


    // Headlights Reflector Mesh...........................
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

      loaderFunc(scene, "models/headLightReflector.js", mat, false, false);

    // LED Base Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/darkMetal.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      reflectivity: .5,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
    });

      loaderFunc(scene, "models/ledBase.js", mat, false, false);

    // LED's Mesh...........................
    //
    var texture = new THREE.TextureLoader().load("models/carColorMap.png");
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      specular: 0x000000,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveMap: texture
    });

      loaderFunc(scene, "models/led.js", mat, false, false);

      //  Headlight Lenses Mesh...............................


      var mat = new THREE.MeshLambertMaterial({
        color: 0x000000,
        envMap: reflectionCube,
        combine: THREE.MixOperation,
        reflectivity: .8,
        opacity: .7,
        transparent: true,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide
      });

      loaderFunc(scene, "models/headLightLenses.js", mat, false, false);


      // Inner Tail Lights Mesh...............................

      var texture = new THREE.TextureLoader().load("models/darkMetal.png");
      var mat = new THREE.MeshPhongMaterial({
        map: texture,
        reflectivity: .5,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
      });

      loaderFunc(scene, "models/innerTailLights.js", mat, false, false);

      // Tail Lights Mesh...........................

      var texture = new THREE.TextureLoader().load("models/tailLightEmissiveColorMap.png");
      var mat = new THREE.MeshPhongMaterial({
        map: texture,
        specular: 0x000000,
        shininess: 0,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        emissive: 0xffffff,
        emissiveMap: texture
      });

        loaderFunc(scene, "models/tailLights.js", mat, false, false);

        //  Tail light Lenses Mesh...............................
        var texture = new THREE.TextureLoader().load("models/tailLightColorMap.png");
        var mat = new THREE.MeshLambertMaterial({
          map: texture,
          envMap: reflectionCube,
          combine: THREE.MixOperation,
          reflectivity: .1,
          opacity: .85,
          transparent: true,
          shading: THREE.SmoothShading,
          side: THREE.DoubleSide
        });

        loaderFunc(scene, "models/tailLightLeneses.js", mat, false, false);






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
    lights(0xffffff, .8, 950, -700, 20, 225, true, true, 2048, 2048);

    //Point light #2.........................................
    lights(0xffffff, .8, 950, 700, 20, 225, false, true, 0, 0);

    //Point light #3.........................................
    lights(0xffffff, .8, 950, 250, 20, 225, false, true, 0, 0);

    //Point light #4.........................................
    lights(0xffffff, .8, 950, -250, 20, 225, false, true, 0, 0);

    //Point light #5.........................................
    lights(0xffffff, .5, 1200, -650, 20, -410, false, true, 0, 0);

    //Point light #6.........................................
    lights(0xffffff, .4, 1000, -100, 20, -410, true, true, 1024, 1024);

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


    // Camera Controller......................................

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.minPolarAngle = 0;
    // controls.maxPolarAngle = 90*(Math.PI/2);
    // controls.minAzimuthAngle = -90*(Math.PI/2);
    // controls.maxAzimuthAngle = 90*(Math.PI/2);
    controls.addEventListener('change', render);

    // controls = new THREE.FirstPersonControls(camera);
    // controls.movementSpeed = 100;
    // controls.domElement = document.getElementById('webgl-container');
    // controls.rollSpeed = Math.PI/24;
    // initPostprocessing();

    //Call to Render Scene Function
    render();
  }
  //
  // function initPostprocessing(){
  //   //Set up render pass
  //   var renderPass = new THREE.RenderPass(scene, camera);
  //
  //   //Set up depth pass
  //   depthMaterial = new THREE.MeshDepthMaterial();
  //   depthMaterial.depthPacking = THREE.RGBADepthPacking;
  //   depthMaterial.blending = THREE.NoBlending;
  //
  //   var pars = {miniFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false};
  //
  //   depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);
  //   depthRenderTarget.texture.name = "SSAOShader.rt"
  //
  //   //Set up Antialiasing
  //   // var ssaaRenderPass = new THREE.SSAARenderPass(scene, camera);
  //   // ssaaRenderPass.unbiased = false;
  //   // ssaaRenderPass.sampleLevel = 2;
  //
  //   //SSAO pass
  //   ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
  //   ssaoPass.renderToScreen = true;
  //   ssaoPass.uniforms["tDepth"].value = depthRenderTarget.texture;
  //   ssaoPass.uniforms['size'].value.set(window.innerWidth, window.innerHeight);
  //   ssaoPass.uniforms['cameraNear'].value = camera.near;
  //   ssaoPass.uniforms['cameraFar'].value = camera.far;
  //   ssaoPass.uniforms['aoClamp'].value = 0.3;
  //   ssaoPass.uniforms['lumInfluence'].value = 0.5;
  //
  //   //Copy pass
  //   var copyPass = new THREE.ShaderPass(THREE.CopyShader);
  //   copyPass.renderToScreen = true;
  //
  //   //Add pass to Effect Composer
  //   effectComposer = new THREE.EffectComposer(renderer);
  //   effectComposer.addPass(renderPass);
  //   // effectComposer.addPass(ssaaRenderPass);
  //   effectComposer.addPass(ssaoPass);
  //   // effectComposer.addPass(copyPass);
  //
  // };

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    // render();
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
    stats.update();


    // scene.overrideMaterial = depthMaterial;
    renderer.render(scene, camera);

    // Render renderpass and SSAO shader pass
    // scene.overrideMaterial = null;
    // effectComposer.render();



  };
  window.addEventListener('resize', onResize, false);

  function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth , window.innerHeight);
  };

  window.onload = initScene;

  return {
    scene: scene
  }

})();
