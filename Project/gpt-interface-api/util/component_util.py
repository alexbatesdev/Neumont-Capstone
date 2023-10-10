from models.react_models import Component, Import
import pprint

pp = pprint.PrettyPrinter(indent=3)


def generate_component_code(component: Component, pre_import_code: list = []):
    code = ""

    # Add pre_import_code to the top of the file
    # This is needed for things like emotion inline styling or importing React in every component when you messed up config somewhere
    for line in pre_import_code:
        print(line)
        code += f"{line}\n"

    # if effects is not empty make sure to import useEffect
    if len(component.side_effects) > 0:
        hasAlreadyImportedUseEffect = False
        if len(component.imports) != 0:
            for component_import in component.imports:
                if (
                    component_import.from_ == "react"
                    and "useEffect" in component_import.import_
                ):
                    hasAlreadyImportedUseEffect = True
                    break

        if not hasAlreadyImportedUseEffect:
            component.imports.append(
                Import(
                    from_="react",
                    import_=["useEffect"],
                    isNamedImport=True,
                )
            )

    # if state is not empty make sure to import useState
    if len(component.state) > 0:
        hasAlreadyImportedUseState = False
        if len(component.imports) != 0:
            for component_import in component.imports:
                if (
                    component_import.from_ == "react"
                    and "useState" in component_import.import_
                ):
                    hasAlreadyImportedUseState = True
                    break

        if not hasAlreadyImportedUseState:
            component.imports.append(
                Import(
                    from_="react",
                    import_=["useState"],
                    isNamedImport=True,
                )
            )

    # Iterate through component component.imports and construct import statements
    pp.pprint(component.imports)
    for component_import in component.imports:
        pp.pprint(component_import)
        import_names = ", ".join(
            import_name for import_name in component_import.import_
        )
        from_module = component_import.from_
        import_statement = "import "
        if component_import.isNamedImport:
            import_statement += "{ "
            import_statement += import_names
            import_statement += " }"
        else:
            import_statement += import_names
        import_statement += f" from '{from_module}';\n"
        code += import_statement

    # Component function definition
    code += f"\nexport const {component.name} = (" + (
        "{\n    " if len(component.props) > 0 else ""
    )
    props_with_defaults = {}

    spread_prop = None

    # Iterate through component props and construct function parameters
    for prop in component.props:
        # If the prop name has "..." in it then it's a spread prop
        # Only one of these is allowed per component, and it must be the last prop
        if "..." in prop.name:
            spread_prop = prop.name
            continue
        # Props with default values have to be after props without default values
        # We add them to a dictionary so we can add them after the props without default values
        if prop.defaultValue != None:
            props_with_defaults[prop.name] = prop.defaultValue
            continue
        # If the prop has no default value then we add it to the function parameters
        code += f"{prop.name}"
        # if prop != component.props[-1] or spread_prop != None:
        if (component.props > 1 and prop != component.props[-1]) or spread_prop != None:
            code += f",\n    "

    # Add the props with default values to the function parameters
    for prop.name, prop.defaultValue in props_with_defaults.items():
        code += f"{prop.name} = {prop.defaultValue}"
        if prop != list(props_with_defaults.items())[-1] or spread_prop != None:
            code += f",\n    "

    # Add the spread prop to the function parameters
    if spread_prop != None:
        code += f"{spread_prop}"

    # Close the function parameters
    code += ("\n}" if len(component.props) > 0 else "") + ") => {\n    "

    # Iterate through component state and construct useState statements
    for state_item in component.state:
        setStateFunctionName = "set" + state_item.name.replace(
            state_item.name[0], state_item.name[0].upper(), 1
        )
        code += f"const [{state_item.name}, {setStateFunctionName}] = useState({state_item.initialValue});\n    "

    # Iterate through component_methods and construct them
    for component_function in component.component_methods:
        # Component method definition
        code += f"\n    const {component_function.name} = ("

        # Component method parameters
        # This is very similar or the same as the component props
        if component_function.parameters != []:
            parameters_with_defaults = {}
            # If the parameter has a default value then we add it to the parameters_with_defaults dictionary
            for parameter in component_function.parameters:
                if parameter.defaultValue != None:
                    parameters_with_defaults[parameter.name] = parameter.defaultValue
                    continue
                # If the parameter has no default value then we add it to the function parameters
                code += f"{parameter.name}"

                if parameter != component_function.parameters[-1]:
                    code += ", "

            # Add the parameters with default values to the function parameters after the parameters without default values
            for (
                parameter.name,
                parameter.defaultValue,
            ) in parameters_with_defaults.items():
                code += f"{parameter.name} = {parameter.defaultValue}"
                if parameter != list(parameters_with_defaults.items())[-1]:
                    code += ", "

        # Component method body gets
        function_body = "\n".join(
            [f"        {line}" for line in component_function.body]
        )
        code += f") => {{\n{function_body}\n    }}\n"

    # Iterate through component effects and construct them
    for effect in component.side_effects:
        effect_body = "\n".join([f"        {line}" for line in effect.body])
        code += f"\n    useEffect(() => {{\n"
        code += f"{effect_body}\n"
        # dependencies are the variables that the effect is watching for changes
        code += f"    }}, [{', '.join(effect.dependencies)}]);\n"

    # Construct the JSX
    code += f"\n    return (<>\n"
    code += "\n".join([f"         {line}" for line in component.JSX])
    code += "\n    </>);\n"

    code += "}\n\n"

    # Export the component
    code += f"export default {component.name};\n"

    pp.pprint(code)

    return code
