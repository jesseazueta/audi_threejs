var pointerLock = (function(){
  var controls;

  function init(camera, scene){
    this.controls = new THREE.PointerLockControls(camera);

    //pointerlock needs to click toactivate
    document.addEventListener('click', function(event){
      var element = document.getElementbyTagName("canvas")[0];

      function pointerlockchange(event){

        if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element){
          pointerLock.controls.enabled = true;
        } else{
          pointerLock.controls.enabled = false;
        }
      };

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      element.requestPointerLock = element.requestPointerLock ||
        element.mozRequestPointerLock || element.webkitRequestPointerLock;

      element.requestPointerLock();

    }, false);
  };
  return {
    init: init,
    controls: controls
  };

})();
