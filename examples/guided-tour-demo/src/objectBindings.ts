import type { ObjectBinding } from "@liveroom-tech/react-immersive";

export const objectBindings: Record<string, ObjectBinding> = {
  "Object_4": {
    "id": "object-4",
    "modelObjectId": "Object_4",
    "type": "light",
    "label": "Ceiling Light Panel",
    "status": "normal",
    "selectable": true,
    "hoverable": true,
    "visible": true,
    "style": {},
    "actions": [
      {
        "id": "change-color",
        "label": "Change Color",
        "type": "command"
      },
      {
        "id": "change-material",
        "label": "Change Material",
        "type": "command"
      },
      {
        "id": "toggle-visibility",
        "label": "Toggle Visibility",
        "type": "command"
      }
    ],
    "metrics": {},
    "metadata": {}
  },
  "Object_6": {
    "id": "object-6",
    "modelObjectId": "Object_6",
    "type": "interior",
    "label": "Gallery Room Shell",
    "status": "normal",
    "selectable": true,
    "hoverable": true,
    "visible": true,
    "style": {},
    "actions": [
      {
        "id": "change-color",
        "label": "Change Color",
        "type": "command"
      },
      {
        "id": "change-material",
        "label": "Change Material",
        "type": "command"
      },
      {
        "id": "toggle-visibility",
        "label": "Toggle Visibility",
        "type": "command"
      }
    ],
    "metrics": {},
    "metadata": {}
  }
};
