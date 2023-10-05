from models.enum_models import GPTFunction

generate_component_code = {
    "name": GPTFunction.generate_component_code.value,
    "description": "Writes a functional react component defined by the given parameters",
    "parameters": {
        "type": "object",
        "properties": {
            "component_name": {
                "type": "string",
                "description": "The name of the react component",
            },
            "imports": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "An object defining what to import, where it's being imported from, and if it's a named import",
                    "properties": {
                        "from_": {
                            "type": "string",
                            "description": "The module that content is getting imported from",
                        },
                        "import_": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "description": "The dependency to import",
                            },
                            "description": "The list of dependencies to import from this source. Do not mix named imports with default imports.",
                        },
                        "isNamedImport": {
                            "type": "boolean",
                            "description": "This determines if the import is a named import or a default import",
                        },
                    },
                    "required": ["from_", "import_", "isNamedImport"],
                },
                "description": "The lines of code that import the necessary dependencies for our component",
            },
            "props": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "An object that defines a prop and its default value",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the prop",
                        },
                        "defaultValue": {
                            "type": "string",
                            "description": "The default value of the property if nothing is passed in. If there is no default value set it to null",
                        },
                    },
                },
                "description": "The properties that the component can take in",
            },
            "state": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "An object that defines a state variable and its initial value",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the state variable",
                        },
                        "initialValue": {
                            "type": "string",
                            "description": "The initial value of the state variable if nothing is passed in. If there is no default value set it to null",
                        },
                    },
                },
                "description": "The state variables and their initial values that the component will have",
            },
            "side_effects": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "An object that defines any effects this react component has",
                    "properties": {
                        "dependencies": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "description": "The name of the variable being tracked",
                            },
                            "description": "The list of variables that React will watch for changes",
                        },
                        "body": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "description": "A line of javascript code",
                            },
                            "description": "The lines of javascript code that make up the effect",
                        },
                    },
                    "required": ["dependencies", "body"],
                },
                "description": "The lines of code that import the necessary dependencies for our component",
            },
            "component_methods": {
                "type": "array",
                "items": {
                    "type": "object",
                    "description": "An object that defines a component method",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the component method",
                        },
                        "parameters": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "description": "An object that defines a parameter and its optional default value",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "description": "The name of the parameter",
                                    },
                                    "defaultValue": {
                                        "type": "string",
                                        "description": "The default value of the property if nothing is passed in. Only provide a default value when it is necessary",
                                    },
                                },
                            },
                            "description": "The parameters that the component can take in",
                        },
                        "body": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "description": "A line of javascript code within the component method",
                            },
                            "description": "The lines of javascript code that make up the body of the component method",
                        },
                    },
                    "required": ["name", "body"],
                },
            },
            "JSX": {
                "type": "array",
                "items": {
                    "type": "string",
                    "description": "A line of JSX code",
                },
                "description": "The lines of JSX that make up the rendering of the component",
            },
        },
        "required": ["component_name", "JSX"],
    },
}

functions = [
    generate_component_code,
]
