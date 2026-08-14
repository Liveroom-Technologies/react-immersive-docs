import {
  defineObjectBindings,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";

function binding(
  id: string,
  modelObjectId: string,
  label: string,
): ObjectBinding {
  return {
    id,
    modelObjectId,
    type: "other",
    label,
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  };
}

export const objectBindings = defineObjectBindings({
  Object_4: binding("apartment-glass", "Object_4", "Window glass"),
  bake_1: binding("apartment-baked-lighting", "bake_1", "Baked lighting"),
  Object_6: binding("apartment-shell", "Object_6", "Apartment shell"),
  rendertotexture_2: binding("apartment-textures", "rendertotexture_2", "Interior textures"),
  Object_8: binding("apartment-kitchen", "Object_8", "Kitchen"),
  Object_9: binding("apartment-living-area", "Object_9", "Living area"),
  bakeplantas_3: binding("apartment-plants", "bakeplantas_3", "Plants"),
  Object_11: binding("apartment-furniture", "Object_11", "Furniture"),
  "B-ACC-06-Plant_4": binding("apartment-plant", "B-ACC-06-Plant_4", "Accent plant"),
  Object_13: binding("apartment-details", "Object_13", "Interior details"),
});
