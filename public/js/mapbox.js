var attribution = new ol.control.Attribution({
  collapsible: false,
});

var map = new ol.Map({
  controls: ol.control.defaults({ attribution: false }).extend([attribution]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png",
        attributions: [
          ol.source.OSM.ATTRIBUTION,
          'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        ],
        maxZoom: 18,
      }),
    }),
  ],
  target: "map",
  view: new ol.View({
    center: ol.proj.fromLonLat([4.35247, 50.84673]),
    maxZoom: 18,
    zoom: 12,
  }),
});

var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([4.35247, 50.84673])),
      }),
    ],
  }),
});
map.addLayer(layer);

var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([4.390177, 50.850726])),
      }),
    ],
  }),
});
map.addLayer(layer);

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
map.addOverlay(overlay);

// closer.onclick = function () {
//   overlay.setPosition(undefined);
//   closer.blur();
//   return false;
// };

if (content) {
  content.innerHTML = "<b>Hello world!</b><br />I am a popup.";
  overlay.setPosition(ol.proj.fromLonLat([4.35247, 50.84673]));
}

// map.on("singleclick", function (event) {
//   if (map.hasFeatureAtPixel(event.pixel) === true) {
//     var coordinate = event.coordinate;

//     content.innerHTML = "<b>Hello world!</b><br />I am a popup.";
//     overlay.setPosition(coordinate);
//   } else {
//     overlay.setPosition(undefined);
//     closer.blur();
//   }
// });

// var layers = [
//   new ol.layer.Tile({
//     source: new ol.source.OSM(),
//   }),
//   new ol.layer.Tile({
//     extent: [-13884991, 2870341, -7455066, 6338219],
//     source: new ol.source.TileWMS({
//       url: "https://ahocevar.com/geoserver/wms",
//       params: { LAYERS: "topp:states", TILED: true },
//       serverType: "geoserver",
//       // Countries have transparency, so do not fade tiles:
//       transition: 0,
//     }),
//   }),
// ];
// var map = new ol.Map({
//   layers: layers,
//   target: "map",
//   view: new ol.View({
//     center: [-10997148, 4569099],
//     zoom: 4,
//   }),
// });
