from pydantic import BaseModel, Field
from typing import Optional
from models.enum_models import GPTModel, GPTFunction


class Message(BaseModel):
    role: str = Field(alias="role")
    content: str = Field(alias="content")
    file_ids: Optional[list[str]] = Field([], alias="fileIds")


class Dependency(BaseModel):
    name: str = Field(alias="name")
    version: str = Field(alias="version")


class PromptInput(BaseModel):
    message: Message = Field(alias="message")
    # TODO: Add an endpoint to refactor already existing code, it will use this field 💭
    component_to_refactor: Optional[str] = Field("", alias="componentToRefactor")
    dependencies: Optional[list[Dependency]] = Field([], alias="dependencies")
    model: Optional[GPTModel] = Field(GPTModel.gpt_3, alias="model")
    function: Optional[GPTFunction] = Field(GPTFunction.auto, alias="function")
    api_key: Optional[str] = Field(None, alias="apikey")
