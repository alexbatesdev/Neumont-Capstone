# Json models

## GweepedReactComponent

# CHANGES HAVE BEEN MADE AND THIS IS OUTDATED, CHECK TEST.PY FOR MODEL DEGINITION

```json
{
  //Anything that may need to come before the imports
  //Example: /** @jsxImportSource @emotion/react */
  "preCode": ["preCode"], 
  "imports": [
    {
      "from": "react",
      "import": ["React"],
      "isNamedImport": false
    },
    {
        "from": "react",
        "import": ["useState", "useEffect"],
        "isNamedImport": true
    }
  ],
  "type": "function",
  "name": "ComponentName",
  "props": [{
    "name": "propName",
    "type": "propType",
    "initValue": "propValue"
  }],
  "state": [
    {
        "name": "stateName",
        "type": "stateType",
        "initValue": "stateValue",
        "isConst": true
    }
  ],
  "effects": [
    {
      "dependencies": ["dependencyName"],
      "body": ["effectBody"]
    }
  ],
  "return": ["returnBody"],
  "customFunctions": [
    {
      "name": "functionName",
      "args": {
        "argName": "argType"
    },
      "body": ["functionBody"]
    }
  ]
}
```

## Variable

```json
{
    "name": "stateName",
    "initValue": "stateValue",
    "isConst": true //Optional
}
```

## Import

```json
{
  "from": "module",
  "import": ["importName"],
  "isNamedImport": false
},
```