from pydantic import BaseModel, Field
from typing import Optional
from models.enum_models import GPTModel, GPTFunction


class PromptInput(BaseModel):
    prompt: str
    pre_import_code: Optional[list] = Field(
        [],
        alias="preImportCode",
        description="Sometimes React likes to break in weird ways when you (me/inexperienced developers) mess with config. Sometimes this means you need to have a pragma at the top of every component (my experiences with emotion inline styling), or that you have to import React in every component, with this you can specify those needs.",
    )
    model: Optional[GPTModel] = Field(GPTModel.gpt_3_5)
    function: Optional[GPTFunction] = Field(GPTFunction.auto)
    apikey: Optional[str] = Field(None)
