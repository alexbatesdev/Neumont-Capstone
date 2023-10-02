from pydantic import BaseModel, Field
from typing import Optional


class PromptInput(BaseModel):
    prompt: str
    model: Optional[str] = Field("gpt-3.5-turbo")
    apikey: Optional[str] = Field(None)
