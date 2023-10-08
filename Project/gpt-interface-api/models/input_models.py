from pydantic import BaseModel, Field
from typing import Optional
from models.enum_models import GPTModel, GPTFunction


class PromptInput(BaseModel):
    messages: list[str] = Field(alias="messages")
    pre_import_code: Optional[list] = Field(
        [],
        alias="preImportCode",
        description="Sometimes React likes to break in weird ways when you (me/inexperienced developers) mess with config. Sometimes this means you need to have a pragma at the top of every component (my experiences with emotion inline styling), or that you have to import React in every component, with this you can specify those needs.",
    )
    # TODO: Add an endpoint to refactor already existing code, it will use this field 💭
    component_to_refactor: Optional[str] = Field("", alias="componentToRefactor")
    node_packages: Optional[list[str]] = Field([], alias="nodePackages")
    model: Optional[GPTModel] = Field(GPTModel.gpt_3_5, alias="model")
    function: Optional[GPTFunction] = Field(GPTFunction.auto, alias="function")
    apikey: Optional[str] = Field(None, alias="apikey")
