from pydantic import BaseModel, Field
from typing import List, Optional


class Import(BaseModel):
    import_: List[str] = Field(..., alias="import_")
    from_: str = Field(..., alias="from_")
    isNamedImport: bool = Field(..., alias="isNamedImport")


class StateVariable(BaseModel):
    name: str = Field(..., alias="name")
    initialValue: str = Field(..., alias="initialValue")


class Effect(BaseModel):
    dependencies: List[str] = Field([], alias="dependencies")
    body: List[str] = Field([], alias="body")


# Both for props and regular method parameters (because props are just parameters for functional componentss)
class Parameter(BaseModel):
    name: str = Field(..., alias="name")
    defaultValue: Optional[str] = Field(None, alias="defaultValue")


class ComponentMethod(BaseModel):
    name: str = Field(..., alias="name")
    parameters: List[Parameter] = Field([], alias="parameters")
    body: List[str] = Field(..., alias="body")


class Component(BaseModel):
    imports: List[Import] = Field([], alias="imports")
    name: str = Field(..., alias="component_name")
    props: List[Parameter] = Field([], alias="props")
    state: List[StateVariable] = Field([], alias="state")
    effects: List[Effect] = Field([], alias="effects")
    JSX: List[str] = Field(..., alias="JSX")
    component_methods: List[ComponentMethod] = Field([], alias="component_methods")
