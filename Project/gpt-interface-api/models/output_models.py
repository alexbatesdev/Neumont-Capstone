from pydantic import BaseModel, Field
from typing import Optional
from models.enum_models import GPTModel, GPTFunction


class Prompt_Output(BaseModel):
    agent_response: str = Field(alias="agentResponse")
    user_prompt: str = Field(alias="userPrompt")
    agent_model: GPTModel = Field(alias="agentModel")
    function: Optional[GPTFunction] = Field(GPTFunction.none, alias="executedFunction")
