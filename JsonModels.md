# Json models

## GweepedReactComponent

```json
{
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
      "name": "effectName",
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
    "type": "stateType",
    "initValue": "stateValue",
    "isConst": true //Optional
}
```