# Assistant generated code starts

from pydantic import BaseModel, Field, root_validator, RootModel
from typing import Dict, Union, Any, Type, Optional
from beanie import Document
import uuid
from datetime import datetime


class File(BaseModel):
    contents: str


class Directory(RootModel[Dict[str, Union[File, "Directory"]]]):
    @root_validator(pre=True)
    def parse_input(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        parsed = {}
        for key, value in values.items():
            if isinstance(value, dict):
                # If the dictionary contains a "contents" key, it's a File
                if "contents" in value:
                    parsed[key] = {"file": File(**value)}
                # Otherwise, it's a Directory
                else:
                    parsed[key] = {"directory": Directory(**value)}
            else:
                raise ValueError(f"Unexpected value: {value}")
        return {"__root__": parsed}


Directory.model_rebuild()


class ProjectCreate(BaseModel):
    project_name: str = Field(default="New Project", max_length=100)
    project_description: str = Field(default="A new project", max_length=500)
    creation_date: datetime = Field(default_factory=datetime.now)
    last_modified_date: datetime = Field(default_factory=datetime.now)
    is_private: bool = Field(default=False)


class ProjectMetadata(ProjectCreate, Document):
    project_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    project_owner: str
    file_structure: Optional[Directory] = Field(default=Directory({}))


# Assistant generated code ends
