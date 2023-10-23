import { useEffect, useState } from "react";
import { loadModules } from "esri-loader";
// import { connectMqtt, disconnectMqtt, options } from '../service/mqtthive.js';

let view = null;

const MapView = () => {
  const [floorFilter, setFloorFilter] = useState("1=1");
  const [buildingFilter, setBuildingFilter] = useState("'M'");

  useEffect(() => {
    // connectMqtt(options,'floorFilter', setFloorFilter);
    // connectMqtt(options,'buildingFilter', setBuildingFilter);

    loadModules([
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Legend",
      "esri/widgets/LayerList",
    ])
      .then(([WebScene, SceneView, Legend, LayerList]) => {
        if (!view) {
          let webscene = new WebScene({
            portalItem: {
              id: "7685f7ba6b47426ea20d6f640cf98596",
            },
          });

          view = new SceneView({
            container: "viewDiv",
            map: webscene,
            environment: {
              lighting: {
                directShadowsEnabled: true,
              },
            },
          });

          view.when(() => {
            var legend = new Legend({
              view: view,
              layerInfos: [
                {
                  layer: webscene.layers.getItemAt(0),
                  title: "Legend",
                },
              ],
            });

            // Add the legend to the bottom right corner of the view
            view.ui.add(legend, "bottom-right");
          });

          var layerList = new LayerList({
            view: view,
          });

          // Add the layer list to the top right corner of the view
          view.ui.add(layerList, "top-right");
        }
        // Update layers
        view.when(() => {
          const buildingQuery = {
            // "Building Wireframe": `BUILDINGID = '${buildingFilter}' AND "floorFilter = "${floorFilter}`,
            // "Interior Space": `BUILDING = '${buildingFilter}' AND ${floorFilter}`,
            // Walls: `BUILDINGKEY = '${buildingFilter}' AND ${floorFilter}`,
            // Doors: `BUILDINGKEY = '${buildingFilter}' AND ${floorFilter}`,
            "Building Wireframe":"BUILDINGID = 'Q'", //هنا بتقولة انت عايز مبني اية الل يظهر )العمدان)
            "Interior Space": "BUILDING = 'Q'",
            Walls: "BUILDINGKEY = 'Q'",
            Doors: "BUILDINGKEY = 'Q'"
          };

          if (view) {
            view.map.layers.forEach((layer) => {
              layer.definitionExpression = buildingQuery[layer.title] + " AND " +floorFilter;
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [buildingFilter,floorFilter]);

  return (
    <div>
      <div id="optionsDiv">
        <b>Filter building by floor:</b>

      

        <select
          id="floorSelect"
          onChange={(e) => setFloorFilter(e.target.value)}
        >
          <option value="1=1">All</option>
          <option value="FLOOR = '1'">1</option>
          <option value="FLOOR = '2'">2</option>
          <option value="FLOOR = '3'">3</option>
        </select>
      </div>
      <div id="viewDiv" style={{ width: "100%", height: "100%" }}></div>

    </div>
  );
};

export default MapView;
