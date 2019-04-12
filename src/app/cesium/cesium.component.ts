import {Component, ElementRef, OnInit} from '@angular/core';
import {ConstantsMapComponent} from './constants';


@Component({
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.css']
})
export class CesiumComponent implements OnInit {

  // global stuff
  scale = 0.1;
  orientation = 0.0
  translation = {
	  x:0,
	  y:0,
	  z:0,
	  orientation:0
  }
  position = {
    x: 0,
    y: 0,
    z: 0
  };
  
  clickPosition = {
	  longitude: NaN,
	  latitude:NaN
  };
  
  viewer: any;
  selectedModel: any;

  constructor(private el: ElementRef) { }

  ngOnInit() {
	  

    // init the viewer
    // most of the settings are stored in the constants.ts
    this.viewer = new Cesium.Viewer(this.el.nativeElement, ConstantsMapComponent.CESIUM_VIEWER_OPTIONS);
    this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0));
    this.viewer.imageryLayers.addImageryProvider(
      Cesium.createOpenStreetMapImageryProvider(
        ConstantsMapComponent.CESIUM_IMAGERYPROVIDER_OPTIONS));
    const homeCameraView = ConstantsMapComponent.CESIUM_CAMERA_OPTIONS;
    homeCameraView.destination = Cesium.Cartesian3.fromDegrees('8.806422', '53.073635', 100);
    this.viewer.scene.camera.setView(homeCameraView);
    this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
      e.cancel = true;
      this.viewer.scene.camera.flyTo(homeCameraView);
    });
    // add a sample 3d model
    this.add3dModel();
    // create a cesium click listener
    new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction((click) => {
		  this.pick3dModel(click);
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	/*var scene = this.viewer.scene;
	if (!scene.pickPositionSupported) {
		console.log('This browser does not support pickPosition.');
	}
	new Cesium.ScreenSpaceEventHandler(scene.canvas).setInputAction(function(movement) {
        var cartesian = scene.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        if (cartesian) {
			console.log("Event souris true");
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);
			console.log(longitudeString);
        } else {
            entity.label.show = false;
			console.log("Event souris false");
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);*/
  }

  // func to add a 3d model to the viewer
  add3dModel() {
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(8.805850, 53.074925, 0.0));
    this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
      url : './../assets/General/building_04.glb',
      modelMatrix : modelMatrix,
      scale : 0.1
    }));
  }
  
  public add3dModelee(path) {
	 var nameFile = path.slice(12);
	 var pathFile = "./../assets/General/";
	 pathFile = pathFile.concat(nameFile);

	if(this.clickPosition.longitude)
	{
		const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(this.clickPosition.longitude, this.clickPosition.latitude, 0.0));
		this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
		  url : pathFile,
		  modelMatrix : modelMatrix,
		  scale : 0.1
		}));
		/*
		var camera = this.viewer.camera;
		var positionCartographic = camera.positionCartographic;
		var height = positionCartographic.height;
		var lat = this.clickPosition.latitude;
		var lon = this.clickPosition.longitude;
		console.log(camera);
		camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(lon, lat, 100),
			duration: 1.0
		});*/
	}
    
  }

  private pick3dModel (click) {
    const pickedObject = this.viewer.scene.pick(click.position);
	
    // a defined object is everything except the map
	console.log("Clique souris:");
	console.log(click.position);
    if (Cesium.defined(pickedObject)) {
      this.selectedModel = pickedObject;
      // show control panel (simple html div)
      document.getElementById('menu').style.visibility = 'visible';
    } else {
		document.getElementById('menu').style.visibility = 'hidden';
		this.selectedModel = undefined;
		this.translation.x = 0;
		this.translation.y = 0;
		this.translation.z = 0;
		this.translation.orientation = 0;
		
		var scene = this.viewer.scene;
		if (!scene.pickPositionSupported) {
			console.log('This browser does not support pickPosition.');
		}
		console.log("click");
		console.log(click);
		var cartesian = scene.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
		console.log("cartesian");
		console.log(cartesian);
		if (cartesian) {
			console.log("Event souris true");
			var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			
			var longitude = Cesium.Math.toDegrees(cartographic.longitude);
			var latitude = Cesium.Math.toDegrees(cartographic.latitude);
			this.clickPosition.longitude = longitude;
			this.clickPosition.latitude = latitude;
		} else {
			/*entity.label.show = false;*/
			console.log("Event souris false");
		}	
	}
  }

  // transform functions
  public transformModelScale(scale: number) {
    if (this.selectedModel) {
      this.scale = scale
      this.selectedModel.primitive.scale = this.scale;
      this.viewer.scene.requestRender();
    }
  }

  public transformModelOrientation(orientation: number) {
	  
    if (this.selectedModel) {
	  this.orientation = orientation - this.translation.orientation;
	  this.translation.orientation = orientation;
      const modMatrix = Cesium.Matrix4.multiply(
        this.selectedModel.primitive.modelMatrix,
        new Cesium.Matrix4.fromRotationTranslation(
          new Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(this.orientation))),
        new Cesium.Matrix4);
      this.selectedModel.primitive.modelMatrix = modMatrix;
      
      this.viewer.scene.requestRender();
    }
  }

  public transformXPos(xRotation: number) {
    this.position.x = xRotation - this.translation.x;
	this.translation.x = xRotation;
	this.position.y = 0;
	this.position.z = 0;
    this.transformModel();
  }

  public transformYPos(yRotation: number) {
    this.position.y = yRotation - this.translation.y;
	this.translation.y = yRotation;
	this.position.x = 0;
	this.position.z = 0;
    this.transformModel();
  }

  public transformZPos(zRotation: number) {
    this.position.z = zRotation - this.translation.z;
	this.translation.z = zRotation;
	this.position.x = 0;
	this.position.y = 0;
    this.transformModel();
  }

  private transformModel() {
    let modMatrix = Cesium.Matrix4.multiplyByTranslation(
      this.selectedModel.primitive.modelMatrix,
      new Cesium.Cartesian3(this.position.x, this.position.y, this.position.z),
      new Cesium.Matrix4());
    if (this.getPositionFromMatrix4(this.getPositionFromMatrix(modMatrix), modMatrix).altitude < 0) {
      modMatrix = Cesium.Matrix4.multiplyByTranslation(
        this.selectedModel.primitive.modelMatrix,
        new Cesium.Cartesian3(this.position.x, this.position.y, Cesium.Cartesian3.ZERO),
        new Cesium.Matrix4());
    }
    this.selectedModel.primitive.modelMatrix = modMatrix;
    //this.position.x = 0.0;
    //this.position.y = 0.0;
    //this.position.z = 0.0;
    this.viewer.scene.requestRender();
  }

  private getPositionFromMatrix4: (cartographicPosition: any, matrix4: any) => any = function (cartographicPosition, matrix4) {
    const longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
    const latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
    const altitude = cartographicPosition.height;
    const number = {longitude, latitude, altitude};
    return number;
  }

  private getPositionFromMatrix(matrix4): number {
    const position = Cesium.Matrix4.getTranslation(matrix4, new Cesium.Cartesian3());
    return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
  }

}
