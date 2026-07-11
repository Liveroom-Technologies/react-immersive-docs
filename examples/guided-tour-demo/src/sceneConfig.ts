import type { SceneConfig } from "@liveroom-tech/react-immersive";

export const sceneConfig: SceneConfig = {
  "model": {
    "rotation": [
      0,
      0,
      0
    ],
    "showAdvancedRotation": false,
    "renderer": "pbr",
    "shading": "lit"
  },
  "camera": {
    "fieldOfView": 50,
    "showAdvancedSettings": false
  },
  "lighting": {
    "ambient": {
      "intensity": 0.25,
      "color": "#ffffff"
    },
    "lights": [
      {
        "id": "light-hemi",
        "type": "hemisphere",
        "color": "#ffffff",
        "intensity": 9.3,
        "position": [
          0,
          1,
          0
        ],
        "attachedToCamera": false,
        "castShadow": true,
        "shadowBias": -0.0005,
        "visible": true
      },
      {
        "id": "light-key",
        "type": "directional",
        "color": "#ffffff",
        "intensity": 2.5,
        "position": [
          6,
          12,
          6
        ],
        "attachedToCamera": false,
        "castShadow": true,
        "shadowBias": -0.0005,
        "visible": true
      },
      {
        "id": "light-fill",
        "type": "directional",
        "color": "#ffffff",
        "intensity": 0,
        "position": [
          -6,
          8,
          -6
        ],
        "attachedToCamera": false,
        "castShadow": false,
        "shadowBias": -0.0005,
        "visible": true
      }
    ]
  },
  "shadows": {
    "enabled": true,
    "mapSize": 2048,
    "bias": -0.0005,
    "normalBias": 0.02,
    "radius": 3
  },
  "environment": {
    "source": "preset",
    "preset": "apartment",
    "customEnvironmentUrl": "",
    "intensity": 0.25,
    "rotation": 0,
    "shadowLight": {
      "enabled": false,
      "intensity": 2.5,
      "bias": -0.0005
    }
  },
  "wireframe": {
    "enabled": false,
    "color": "#000000",
    "opacity": 1
  },
  "background": {
    "enabled": false,
    "type": "color",
    "color": "#1c1c1d",
    "imageUrl": ""
  },
  "groundShadows": {
    "enabled": false,
    "mode": "shadowCatcher",
    "intensity": 0.7,
    "borderFade": 1,
    "height": 0,
    "size": 10
  },
  "postProcessing": {
    "autofocus": {
      "enabled": false,
      "focusDistance": 5,
      "focusRange": 5,
      "focalLength": 0.02,
      "bokehScale": 6,
      "target": [
        0,
        0,
        0
      ],
      "mouse": true,
      "debug": 0,
      "manual": false,
      "smoothTime": 0.25
    },
    "toneMapping": {
      "enabled": false,
      "mode": "aces",
      "exposure": 1,
      "resolution": 256,
      "whitePoint": 4,
      "middleGrey": 0.6,
      "minLuminance": 0.01,
      "averageLuminance": 1,
      "adaptationRate": 1
    },
    "brightnessContrast": {
      "enabled": false,
      "brightness": 0,
      "contrast": 0
    },
    "hueSaturation": {
      "enabled": false,
      "hue": 0,
      "saturation": 0
    },
    "colorAverage": {
      "enabled": false
    },
    "dotScreen": {
      "enabled": false,
      "angle": 1.5707963267948966,
      "scale": 1
    },
    "glitch": {
      "enabled": false,
      "mode": "sporadic",
      "delay": [
        1.5,
        3.5
      ],
      "duration": [
        0.6,
        1
      ],
      "strength": [
        0.3,
        1
      ],
      "chromaticAberrationOffset": [
        0,
        0
      ],
      "columns": 0.05,
      "ratio": 0.85
    },
    "ssao": {
      "enabled": false,
      "samples": 30,
      "rings": 4,
      "intensity": 8,
      "radius": 0.25,
      "bias": 0.025,
      "luminanceInfluence": 0.6,
      "fade": 0.01,
      "minRadiusScale": 0.33,
      "worldDistanceThreshold": 20,
      "worldDistanceFalloff": 5,
      "worldProximityThreshold": 6,
      "worldProximityFalloff": 3
    },
    "bloom": {
      "enabled": false,
      "intensity": 0.3,
      "luminanceThreshold": 0.9,
      "luminanceSmoothing": 0.2,
      "mipmapBlur": true,
      "radius": 0,
      "levels": 8
    },
    "godRays": {
      "enabled": false,
      "sunPosition": [
        5,
        10,
        5
      ],
      "samples": 60,
      "density": 0.96,
      "decay": 0.9,
      "weight": 0.4,
      "exposure": 0.6,
      "clampMax": 1,
      "blur": true,
      "kernelSize": "small"
    },
    "grid": {
      "enabled": false,
      "scale": 1,
      "lineWidth": 0
    },
    "noise": {
      "enabled": false,
      "opacity": 1,
      "premultiply": false
    },
    "depthOfField": {
      "enabled": false,
      "focusDistance": 5,
      "focusRange": 5,
      "focalLength": 0.02,
      "bokehScale": 6
    },
    "chromaticAberration": {
      "enabled": false,
      "offsetX": 0.002,
      "offsetY": 0.002,
      "radialModulation": false,
      "modulationOffset": 0.15
    },
    "lensflare": {
      "enabled": false,
      "lensPosition": [
        -25,
        6,
        -60
      ],
      "smoothTime": 0.07,
      "glareSize": 0.2,
      "flareSize": 0.01,
      "flareSpeed": 0.01,
      "flareShape": 0.01,
      "animated": true,
      "anamorphic": false,
      "colorGain": "#141414",
      "haloScale": 0.5,
      "secondaryGhosts": true,
      "aditionalStreaks": true,
      "ghostScale": 0,
      "opacity": 1,
      "starBurst": false
    },
    "vignette": {
      "enabled": false,
      "offset": 0.3,
      "darkness": 0.3,
      "eskil": false
    },
    "smaa": {
      "enabled": false
    },
    "sepia": {
      "enabled": false,
      "intensity": 0
    },
    "scanline": {
      "enabled": false,
      "density": 1.25
    },
    "pixelation": {
      "enabled": false,
      "granularity": 5
    },
    "outline": {
      "enabled": false,
      "selectionLayer": 10,
      "edgeStrength": 2.5,
      "pulseSpeed": 0,
      "visibleEdgeColor": "#ffffff",
      "hiddenEdgeColor": "#22090a",
      "kernelSize": "large",
      "blur": false,
      "xRay": true
    },
    "selectiveBloom": {
      "enabled": false,
      "selectionLayer": 10,
      "intensity": 1,
      "luminanceThreshold": 0.9,
      "luminanceSmoothing": 0.025,
      "kernelSize": "large",
      "mipmapBlur": true,
      "inverted": false,
      "ignoreBackground": false
    },
    "ramp": {
      "enabled": false,
      "rampType": "linear",
      "rampStart": [
        0.5,
        0.5
      ],
      "rampEnd": [
        1,
        1
      ],
      "startColor": "#000000",
      "endColor": "#ffffff",
      "rampBias": 0.5,
      "rampGain": 0.5,
      "rampMask": false,
      "rampInvert": false
    }
  },
  "animations": {
    "clips": [],
    "autoplayClip": null
  },
  "annotations": [
    {
      "id": 1,
      "worldPosition": [
        7.586737699198749,
        1.9495461601747592,
        10.07877235772969
      ],
      "localPosition": [
        7.586737699198749,
        1.9495461601747592,
        10.07877235772969
      ],
      "worldNormal": [
        0,
        -2.220446049250313e-16,
        -1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        758.6737868775557,
        1007.8772583007815,
        -194.95462037505106
      ],
      "title": "Image 1",
      "description": ""
    },
    {
      "id": 2,
      "worldPosition": [
        2.2837307524606376,
        2.427837697626708,
        10.078772357729692
      ],
      "localPosition": [
        2.2837307524606376,
        2.427837697626708,
        10.078772357729692
      ],
      "worldNormal": [
        0,
        -2.220446049250313e-16,
        -1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        228.37308035059993,
        1007.8772583007816,
        -242.7837751893109
      ],
      "title": "Image 2",
      "description": ""
    },
    {
      "id": 3,
      "worldPosition": [
        -2.362529786135708,
        2.867760369326841,
        10.073604511165513
      ],
      "localPosition": [
        -2.362529786135708,
        2.867760369326841,
        10.073604511165513
      ],
      "worldNormal": [
        0,
        -2.220446049250313e-16,
        -1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        -236.25298389423654,
        1007.3604736328128,
        -286.77604334262804
      ],
      "title": "Image 3",
      "description": ""
    },
    {
      "id": 4,
      "worldPosition": [
        -14.229106177840299,
        2.324876482078498,
        10.07877235772969
      ],
      "localPosition": [
        -14.229106177840299,
        2.324876482078498,
        10.07877235772969
      ],
      "worldNormal": [
        0,
        -2.220446049250313e-16,
        -1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        -1422.9106495885617,
        1007.8772583007815,
        -232.48765340435364
      ],
      "title": "Image 4",
      "description": ""
    },
    {
      "id": 5,
      "worldPosition": [
        -17.43988974690683,
        2.2798250863255354,
        -7.197365235592613
      ],
      "localPosition": [
        -17.43988974690683,
        2.2798250863255354,
        -7.197365235592613
      ],
      "worldNormal": [
        1,
        0,
        0
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        -1743.9890136718755,
        -719.7365396466267,
        -227.98251372836003
      ],
      "title": "Image 5",
      "description": ""
    },
    {
      "id": 6,
      "worldPosition": [
        -0.39093457337043036,
        1.4480132551808058,
        -10.073604511165515
      ],
      "localPosition": [
        -0.39093457337043036,
        1.4480132551808058,
        -10.073604511165515
      ],
      "worldNormal": [
        0,
        2.220446049250313e-16,
        1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        -39.09345821084993,
        -1007.3604736328128,
        -144.80132875464275
      ],
      "title": "Image 6",
      "description": ""
    },
    {
      "id": 7,
      "worldPosition": [
        5.4018098686592975,
        2.9981637548109936,
        -10.073604511165515
      ],
      "localPosition": [
        5.4018098686592975,
        2.9981637548109936,
        -10.073604511165515
      ],
      "worldNormal": [
        0,
        2.220446049250313e-16,
        1
      ],
      "anchorNodeName": "Object_6",
      "anchorLocalPosition": [
        540.1809989399161,
        -1007.3604736328127,
        -299.816382182518
      ],
      "title": "Image 7",
      "description": ""
    }
  ]
};
