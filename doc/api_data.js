define({ "api": [
  {
    "type": "post",
    "url": "/all",
    "title": "Convert ProvDocument to Comic frames",
    "description": "<p>Render ProvDocument as single images that are returned in a ZIP folder</p>",
    "name": "GetAllComicFrames",
    "group": "Comic",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>ProvDocument as JSON String</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "size",
            "description": "<p>Size of the generated image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Zip",
            "optional": false,
            "field": "Base64",
            "description": "<p>encoded zip archive</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParsingError",
            "description": "<p>ProvDocument could not be parsed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ComicApi.js",
    "groupTitle": "Comic"
  },
  {
    "type": "post",
    "url": "/complete",
    "title": "Convert ProvDocument to Comic image",
    "description": "<p>Render ProvDocument as a single image and return it</p>",
    "name": "GetComic",
    "group": "Comic",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>ProvDocument as JSON String</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "size",
            "description": "<p>Size of the generated image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "SVG",
            "optional": false,
            "field": "SVG",
            "description": "<p>image of the comic</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParsingError",
            "description": "<p>ProvDocument could not be parsed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ComicApi.js",
    "groupTitle": "Comic"
  },
  {
    "type": "get",
    "url": "/store/:documentId",
    "title": "Download and render provenance document from ProvStore",
    "description": "<p>Downloads specific Document from ProvStore and returns it rendered as single image (see /complete)</p>",
    "name": "GetComicFromProvStore",
    "group": "Comic",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "documentId",
            "description": "<p>id of the ProvStore document</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "size",
            "description": "<p>Size of the generated image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "SVG",
            "optional": false,
            "field": "SVG",
            "description": "<p>image of the converted and downloaded Provenance Graph</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParsingError",
            "description": "<p>ProvDocument could not be parsed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ComicApi.js",
    "groupTitle": "Comic"
  },
  {
    "type": "post",
    "url": "/stripe",
    "title": "Convert ProvDocument Activity to Comic Stripe",
    "description": "<p>Convert ProvDocument and return a specific activity as rendered comic stripe</p>",
    "name": "GetComicStripe",
    "group": "Comic",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>ProvDocument as JSON String</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activity",
            "description": "<p>Index number of the stripe you want to get, starts with 0</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "size",
            "description": "<p>Size of the generated image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "SVG",
            "optional": false,
            "field": "SVG",
            "description": "<p>image of the wanted comic stripe</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParsingError",
            "description": "<p>ProvDocument could not be parsed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ComicApi.js",
    "groupTitle": "Comic"
  },
  {
    "type": "post",
    "url": "/stripes",
    "title": "Convert ProvDocument to folder of Comic Stripe",
    "description": "<p>Render activities of a ProvDocument as list of comic stripes that are returned in a ZIP folder</p>",
    "name": "GetComicStripes",
    "group": "Comic",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>ProvDocument as JSON String</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "size",
            "description": "<p>Size of the generated image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ZIP",
            "optional": false,
            "field": "ZIP",
            "description": "<p>folder of SVG images of the comic stripes</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParsingError",
            "description": "<p>ProvDocument could not be parsed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ComicApi.js",
    "groupTitle": "Comic"
  },
  {
    "type": "get",
    "url": "/image/:name/:mode/:format/:act?",
    "title": "Get a ProvDocument in the specified format",
    "description": "<p>Get a ProvDocument in a specified format and size, has to be uploaded before</p>",
    "name": "ConvertDocument",
    "group": "Doc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the ProvDocument, is returned with the UploadDocument function</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mode",
            "description": "<p>Defines which action will be performed on the document ('createComicFrames', 'createAllStripes', 'createStripe', 'createComic')</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "format",
            "description": "<p>Image Type and Size, has to be given in this format: <Type>.<Size>; <Type> can be png, svg or jpg; <Size> can be any integer numnber</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "act",
            "description": "<p>If you used the mode 'createStripe' this specifies the activity id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Url",
            "optional": false,
            "field": "url",
            "description": "<p>URL for the created file</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GenerationError",
            "description": "<p>ProvDocument could not be created, converted or send</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ConverterApi.js",
    "groupTitle": "Doc"
  },
  {
    "type": "post",
    "url": "/add",
    "title": "Upload a ProvDocument",
    "description": "<p>Upload ProvDocument to use it in later API calls</p>",
    "name": "UploadDocument",
    "group": "Doc",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>ProvDocument as JSON String</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Url",
            "optional": false,
            "field": "url",
            "description": "<p>URL for the created file</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UploadError",
            "description": "<p>ProvDocument could not be uploaded</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controller/ConverterApi.js",
    "groupTitle": "Doc"
  }
] });
