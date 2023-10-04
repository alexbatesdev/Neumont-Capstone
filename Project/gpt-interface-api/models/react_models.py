from pydantic import BaseModel, Field
from typing import List, Optional


class Prop(BaseModel):
    name: str = Field(..., alias="propertyName")
    defaultValue: Optional[str] = Field(None, alias="propertyDefaultValue")


class StateVariable(BaseModel):
    name: str = Field(..., alias="variableName")
    initialValue: str = Field(..., alias="variableInitialValue")


class Effect(BaseModel):
    dependencies: List[str] = Field([], alias="variablesToWatch")
    body: List[str] = Field([], alias="effectBody")


class ComponentMethodParameter(BaseModel):
    name: str = Field(..., alias="parameterName")
    defaultValue: Optional[str] = Field(None, alias="parameterDefaultValue")


class ComponentMethod(BaseModel):
    name: str = Field(..., alias="functionName")
    parameters: List[ComponentMethodParameter] = Field([], alias="parameters")
    body: List[str] = Field(..., alias="functionBody")


class Component(BaseModel):
    imports: List[str] = Field([], alias="dependencies")
    name: str = Field(..., alias="componentName")
    props: List[Prop] = Field([], alias="properties")
    state: List[StateVariable] = Field([], alias="stateVariables")
    effects: List[Effect] = Field([], alias="componentSideEffects")
    JSX: List[str] = Field(..., alias="JSX or render body")
    component_methods: List[ComponentMethod] = Field([], alias="componentMethods")
