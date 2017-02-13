
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
    scene.background = reflectionCube;

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
      envMap: reflectionCube,
      // metalness: .8,
      // specular: 0xCCCCCC,
      // shininess: 0,
      combine: THREE.MixOperation,
      reflectivity: .4,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/frame.js", mat, false, false);

    //Tires Geometry Mesh..........................................

    var texture = new THREE.TextureLoader().load("models/tire_color_map.png");
    var textureBump = new THREE.TextureLoader().load("models/tire_bump_map.png")
    var mat = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: textureBump,
      bumpScale: .2,
      // specular: 0xCCCCCC,
      shininess: 0,
      shading: THREE.SmoothShading,
      side: THREE.DoubleSide
    });

    loaderFunc(scene, "models/tires.js", mat, false, true);

    // //Rims Geometry Meshes.....................................

      var texture = new THREE.TextureLoader().load("models/metal.png");
      var mat = new THREE.MeshLambertMaterial({
        map: texture,
        envMap: reflectionCube,
        combine: THREE.MixOperation,
        reflectivity: .7,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide
      });

    loaderFunc(scene, "models/rims.js", mat, false, false);

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

    // //Recessed Lights Geometry Mesh...............................
    //
    //   var texture = new THREE.TextureLoader().load("models/metal.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     metalness: 1.0,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/recessed_lights.js", mat, false, false);
    //
    // //Lenses Geometry Meshes...........................
    //
    //   var texture = new THREE.TextureLoader().load("models/recessLightColorMap.png");
    //   var mat = new THREE.MeshPhongMaterial({
    //     map: texture,
    //     color: 0xffffff,
    //     specular: 0x000000,
    //     shininess: 0,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide,
    //     emissive: 0xffffff,
    //     emissiveMap: texture
    //   });
    //
    //   loaderFunc(scene, "models/lenses.js", mat, false, false);
    //
    // //Desktop #2 Geometry Mesh..........................
    //
    //
    //   var texture = new THREE.TextureLoader().load("models/desktopColorMap.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .2,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    // loaderFunc(scene, "models/desktop.js", mat, true, true);
    //
    // //Desktop Lift Geometry Mesh..........................
    //
    //
    //   var texture = new THREE.TextureLoader().load("models/desktopColorMap.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .2,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/deskTopLift.js", mat, true,true);
    //
    //
    // //Hinges Geometry Mesh......................
    //
    //   var texture = new THREE.TextureLoader().load("models/metal.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .2,
    //     metalness: 1.0,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/hinges.js", mat, false, false);
    //
    // //Table Legs Geometry Mesh..........................
    //
    //   var texture = new THREE.TextureLoader().load("models/metal.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .2,
    //     metalness: 1.0,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/legs.js", mat, true, false);
    //
    //
    // //Track Lights Geometry Mesh...........................
    //
    //   var texture = new THREE.TextureLoader().load("models/trackLightingColorMap.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .2,
    //     metalness: .3,
    //     color: 0xffffff,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/track_lights.js", mat, false, false);
    //
    // //Doors Geometry Mesh...........................
    //
    //   var texture = new THREE.TextureLoader().load("models/desktopColorMap.png");
    //   var mat = new THREE.MeshPhysicalMaterial({
    //     map: texture,
    //     reflectivity: .3,
    //     color: 0xffffff,
    //     shading: THREE.FlatShading,
    //     side: THREE.DoubleSide
    //   });
    //
    //   loaderFunc(scene, "models/doors.js", mat, false, false);
    //
    //

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
    lights(0xffffff, .7, 950, -700, 20, 225, true, true, 2048, 2048);

    //Point light #2.........................................
    lights(0xffffff, .7, 950, 700, 20, 225, false, true, 0, 0);

    //Point light #3.........................................
    lights(0xffffff, .7, 950, 250, 20, 225, false, true, 0, 0);

    //Point light #4.........................................
    lights(0xffffff, .7, 950, -250, 20, 225, false, true, 0, 0);

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
