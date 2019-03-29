export namespace ConstantsMapComponent {

  export const CESIUM_VIEWER_OPTIONS = {
    scene3DOnly: true,
    requestRenderMode : true,
    selectionIndicator: false,
    baseLayerPicker: false,
    timeline: false,
    maximumRenderTimeChange : Infinity,
    debugShowFramesPerSecond: true,
    animation: false,
    fullScreenButton: false,
    infoBox: false
  };

  export const CESIUM_CAMERA_OPTIONS = {
    destination : Cesium.Cartesian3.fromDegrees(8.81311007672116, 53.080680898810655, 200),
    orientation: {
      heading : 0.0,
      pitch : 0.4 * -Cesium.Math.PI_OVER_TWO,
      roll : 0.0
    }
  };

  export const CESIUM_IMAGERYPROVIDER_OPTIONS = {
    url: 'https://a.tile.openstreetmap.org/',
    credit: 'MapQuest, Open Street Map and contributors, CC-BY-SA'};

  export const CESIUM_MAX_ZOOM = 1300;
  export const CESIUM_MAX_PITCH = -.4;
  export const CESIUM_BUILDING_COLOR = '#cfd8dc';
  export const CESIUM_DISPLAYCONDITION_MAX = 3000;
  export const CESIUM_DISPLAYCONDITION_MIN = 0;

  export const FALLBACK_HEIGHT = 6;
  export const CESIUM_TILE_LEVEL = 14;

  export const DETAIL_POPUP_WIDTH = '600px';
  export const NEWPROPOSAL_POPUP_WIDTH = '400px';

  export const PIN_BUILDER_ACCEPT_COLOR = '#29ffff';
  export const PIN_BUILDER_DECLINE_COLOR = '#ab3838';
  export const PIN_BUILDER_SIZE = 40;
  export const PIN_BUILDER_ACCEPT_TEXT = '√';
  export const PIN_BUILDER_DECLINE_TEXT = 'X';
  export const PROPOSAL_TEXT = '!';
}

