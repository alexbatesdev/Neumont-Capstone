def generate_component_code(component_json):
    component_name = component_json["name"]
    component_imports = component_json["imports"]
    props = component_json["props"]
    state = component_json["state"]
    effects = component_json["effects"]
    return_code = component_json["return"]
    custom_functions = component_json["customFunctions"]

    code = ""

    for pre_code in component_json["preCode"]:
        code += f"{pre_code}\n"

    # for component_import in component_imports:
    #     code += f"import {', '.join([f'{import_name}' for import_name in component_import['import']])} from '{component_import['from']}';\n"

    # Iterate through component imports and construct import statements
    for component_import in component_imports:
        import_names = ", ".join(
            import_name for import_name in component_import["import"]
        )
        from_module = component_import["from"]
        import_statement = "import "
        if component_import["isNamedImport"]:
            import_statement += "{ "
            import_statement += import_names
            import_statement += " }"
        else:
            import_statement += import_names
        import_statement += f" from '{from_module}';\n"
        code += import_statement

    code += f"const {component_name} = ("
    for prop in props:
        code += f"{prop['name']}"
        if prop["type"] != "":
            code += f": {prop['type']}"
        if prop["default"] != "":
            code += f" = {prop['default']}"
        if prop != props[-1]:
            code += ", "
    code += ") => {\n"

    for state_name, state_value in state.items():
        code += f"  const [{state_name}, set{state_name.capitalize()}] = useState("
        if state_value.isnumeric():
            code += f"{state_value}"
        else:
            code += f"'{state_value}'"
        code += ");\n"

    for effect in effects:
        effect_name = effect["name"]
        effect_body = "\n".join([f"    {line}" for line in effect["body"]])
        code += f"  {effect_body}\n"

    for custom_function in custom_functions:
        function_name = custom_function["name"]
        function_body = "\n".join([f"    {line}" for line in custom_function["body"]])
        code += f"\n  const {function_name} = ("
        for arg in custom_function["args"]:
            code += f"{arg['name']}"
            if arg["type"] != "":
                code += f": {arg['type']}"
            if arg["default"] != "":
                code += f" = {arg['default']}"

            if arg != custom_function["args"][-1]:
                code += ", "
        code += f") => {{\n{function_body}\n  }}\n"

    code += f"\n  return (\n"
    code += "\n".join([f"    {line}" for line in return_code])
    code += "\n  );\n"

    code += "}\n\n"

    code += f"export default {component_name};\n"

    return code


# Example JSON object
component_json = {
    "preCode": ["/** @jsxImportSource @emotion/react */"],
    "imports": [],
    "name": "Bubble",
    "props": [
        {
            "name": "children",
            "type": "",
            "default": "",
        },
        {
            "name": "className",
            "type": "",
            "default": "",
        },
        {
            "name": "imageURL",
            "type": "",
            "default": "",
        },
        {
            "name": "onClick",
            "type": "",
            "default": "",
        },
        {
            "name": "...props",
            "type": "",
            "default": "",
        },
    ],
    "state": {"tint": 6},
    "effects": [],
    "return": [
        "<div ",
        '  className={"Bubble"} ',
        "  css={{",
        "      width: '10vh',",
        "      height: '10vh',",
        "      border: '5px solid black',",
        "      borderRadius: '50%',",
        "      backgroundImage: `url(${imageURL})`,",
        "      backgroundSize: 'cover',",
        "      backgroundRepeat: 'no-repeat',",
        "      backgroundPosition: 'center',",
        "  }}",
        "  >",
        "  {children}",
        "  <div ",
        '    className="lens"',
        "    css={{",
        "        width: '100%',",
        "        height: '100%',",
        "        borderRadius: '50%',",
        "        backgroundColor: 'rgba(0, 0, 50, 0.4)',",
        "    }}",
        "    onMouseOver={mouseOverHandler}",
        "  onClick={onClick}",
        "  >",
        "  </div>",
        "</div>",
    ],
    "customFunctions": [
        {
            "name": "mouseOverHandler",
            "args": [{"name": "event", "type": "", "default": ""}],
            "body": [
                "console.log('Mouse over');",
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint})`;",
                "console.log(event.target.style.backgroundColor);",
                "event.target.addEventListener('mousedown', mouseDownHandler);",
                "event.target.addEventListener('mouseout', mouseOutHandler);",
            ],
        },
        {
            "name": "mouseOutHandler",
            "args": [{"name": "event", "type": "", "default": ""}],
            "body": [
                "console.log('Mouse out');",
                "console.log(tint - 2);",
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint - 2})`;",
                "event.target.removeEventListener('mousedown', mouseDownHandler);",
                "event.target.removeEventListener('mouseout', mouseOutHandler);",
            ],
        },
        {
            "name": "mouseDownHandler",
            "args": [{"name": "event", "type": "", "default": ""}],
            "body": [
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint + 2})`;",
                "event.target.addEventListener('mouseup', mouseUpHandler);",
            ],
        },
        {
            "name": "mouseUpHandler",
            "args": [{"name": "event", "type": "", "default": ""}],
            "body": [
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint})`;",
                "event.target.removeEventListener('mouseup', mouseUpHandler);",
            ],
        },
    ],
}

component_json_2 = {
    "preCode": ["/** @jsxImportSource @emotion/react */"],
    "imports": [
        {"from": "react", "import": ["useState"], "isNamedImport": True},
        {
            "from": "../components/bubble.jsx",
            "import": ["Bubble"],
            "isNamedImport": False,
        },
        {
            "from": "../src/components/window.jsx",
            "import": ["Window"],
            "isNamedImport": False,
        },
    ],
    "name": "Home",
    "props": [],
    "state": {
        "headerHeight": "11vh",
        "footerHeight": "11vh",
        "mainHeight": "",
        "headerPadding": "1vh",
        "headerWidth": "",
        "footerPadding": "1vh",
        "footerWidth": "",
        "window": "null",
    },
    "effects": [],
    "return": [
        "<div style={{",
        "    display: 'flex',",
        "    flexDirection: 'column',",
        "    justifyContent: 'space-between',",
        "    alignItems: 'center',",
        "    height: '100vh',",
        "    width: '100vw',",
        "    position: 'absolute',",
        "    top: '0',",
        "    left: '0',",
        "}}>",
        "    <header style={{",
        "        height: state.headerHeight,",
        "        width: state.headerWidth,",
        "        padding: state.headerPadding,",
        "        backgroundColor: '#69f',",
        "    }}>",
        "        {/* Profile */}",
        "        <Bubble",
        "            onClick={profileClickHandler}",
        "            imageURL='https://cataas.com/cat?width=100&height=100'",
        "        />",
        "    </header>",
        "    <main style={{",
        "        height: state.mainHeight,",
        "        width: '100vw',",
        "        backgroundColor: '#58e'",
        "    }}>",
        "        {state.window}",
        "    </main>",
        "    <footer style={{",
        "        height: state.footerHeight,",
        "        width: state.footerWidth,",
        "        padding: state.footerPadding,",
        "        backgroundColor: '#69f',",
        "    }}>",
        "    </footer>",
        "</div>",
    ],
    "customFunctions": [
        {
            "name": "profileClickHandler",
            "args": [],
            "body": [
                "console.log('Profile clicked');",
                "// add a window-like div that has a profile switcher",
                "state.window = (",
                "    <Window",
                "        width={'200px'}",
                "        height={'400px'}",
                "        className={'TestWindow'}",
                "        doXButton={false}",
                "    >",
                "    </Window>",
                ");",
            ],
        }
    ],
}


component_code = generate_component_code(component_json_2)
print(component_code)
