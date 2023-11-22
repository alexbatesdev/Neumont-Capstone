# These models were made with AI assistance
# I had already been working with the data in the frontend
# so I asked the AI to generate the models for me based on the data
# It was unable to make the Directory model properly, so I had to make that one myself
from datetime import datetime
from tzlocal import get_localzone
from pydantic import BaseModel, Field, root_validator, RootModel
from typing import Dict, Union, Any, Type, Optional
from beanie import Document
from uuid import UUID, uuid4
from datetime import datetime

# It would be more DRY to import this from the main module, but that would cause a circular import
# from main import get_local_time


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
    start_command: str = Field(default="")
    creation_date: datetime = Field(default_factory=datetime.now)
    is_private: bool = Field(default=False)
    is_template: bool = Field(default=False)


class ProjectData(ProjectCreate):
    project_id: UUID = Field(default_factory=uuid4)
    project_owner: UUID | None = Field(
        default=None
    )  # Type | None is the same as Optional[Type]
    # I think it's interesting how the context of a situation can change the way we think about doing the same thing
    # When defining my models I think "Oh this field is optional, so I'll make it Optional[Type]"
    # But I just barely thought "This field can be a UUID or it can be None, so I'll make it UUID | None"
    # I know consistency is important, but I think it's interesting how the context of a situation can change the way we think about doing the same thing
    # I'm leaving this here because I think it's interesting
    last_modified_date: datetime = Field(default_factory=datetime.now)
    collaborators: list[UUID] = Field(default=[])
    # Filestructure needs to not be empty, at the very least it needs to have a package.json
    file_structure: Optional[Directory] = Field(default=Directory({}))


class ProjectDataDB(ProjectData, Document):
    class Settings:
        name = "ProjectData"
