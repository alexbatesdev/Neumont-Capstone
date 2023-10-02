def generate_component_code(
    component_name,
    JSX,
    pre_import_code=[],
    imports=[],
    props={},
    state={},
    effects=[],
    component_methods=[],
):
    code = ""

    for line in pre_import_code:
        code += f"{line}\n"

    # if effects is not empty make sure to import useEffect
    if len(effects) > 0:
        hasAlreadyImportedUseEffect = False
        if len(imports) != 0:
            for component_import in imports:
                if (
                    component_import["from"] == "react"
                    and "useEffect" in component_import["import"]
                ):
                    hasAlreadyImportedUseEffect = True
                    break

        if not hasAlreadyImportedUseEffect:
            imports.append(
                {
                    "from": "react",
                    "import": ["useEffect"],
                    "isNamedImport": True,
                }
            )

    # if state is not empty make sure to import useState
    if len(state) > 0:
        hasAlreadyImportedUseState = False
        if len(imports) != 0:
            for component_import in imports:
                if (
                    component_import["from"] == "react"
                    and "useState" in component_import["import"]
                ):
                    hasAlreadyImportedUseState = True
                    break

        if not hasAlreadyImportedUseState:
            imports.append(
                {
                    "from": "react",
                    "import": ["useState"],
                    "isNamedImport": True,
                }
            )

    # Iterate through component imports and construct import statements
    for component_import in imports:
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

    code += f"\nexport const {component_name} = (" + (
        "{{\n    " if len(props) > 0 else ""
    )
    props_with_defaults = {}

    spread_prop = None

    for prop in props:
        if "..." in prop["name"]:
            spread_prop = prop["name"]
            continue
        if prop["defaultValue"] != None:
            props_with_defaults[prop["name"]] = prop["defaultValue"]
            continue
        code += f"{prop['name']}"
        if prop != props[-1] or spread_prop != None:
            code += f",\n    "

    for prop["name"], prop["defaultValue"] in props_with_defaults.items():
        code += f"{prop['name']} = {prop['defaultValue']}"
        if prop != list(props_with_defaults.items())[-1] or spread_prop != None:
            code += f",\n    "

    if spread_prop != None:
        code += f"{spread_prop}"

    code += ("\n}" if len(props) > 0 else "") + ") => {\n    "

    for state_item in state:
        setStateFunctionName = "set" + state_item["name"].replace(
            state_item["name"][0], state_item["name"][0].upper(), 1
        )
        code += f"const [{state_item['name']}, {setStateFunctionName}] = useState({state_item['initialValue']});\n    "

    for component_function in component_methods:
        function_name = component_function["name"]
        function_body = "\n".join(
            [f"        {line}" for line in component_function["body"]]
        )
        code += f"\n    const {function_name} = ("

        if component_function.get("parameters") != None:
            parameters_with_defaults = {}
            for parameter in component_function["parameters"]:
                if parameter["defaultValue"] != None:
                    parameters_with_defaults[parameter["name"]] = parameter[
                        "defaultValue"
                    ]
                    continue

                code += f"{parameter['name']}"

                if parameter != component_function["parameters"][-1]:
                    code += ", "

            for (
                parameter["name"],
                parameter["defaultValue"],
            ) in parameters_with_defaults.items():
                code += f"{parameter['name']} = {parameter['defaultValue']}"
                if parameter != list(parameters_with_defaults.items())[-1]:
                    code += ", "

        code += f") => {{\n{function_body}\n    }}\n"

    for effect in effects:
        effect_body = "\n".join([f"        {line}" for line in effect["body"]])
        code += f"\n    useEffect(() => {{\n"
        code += f"{effect_body}\n"
        code += f"    }}, [{', '.join(effect['dependencies'])}]);\n"

    code += f"\n    return (<>\n"
    code += "\n".join([f"         {line}" for line in JSX])
    code += "\n    </>);\n"

    code += "}\n\n"

    code += f"export default {component_name};\n"

    return code
