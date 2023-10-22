from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager

from models.project_models import ProjectMetadata, Directory, File, ProjectCreate
from reactFileTemplate import react_file_template

from jose import JWTError, jwt

from decouple import config

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from datetime import datetime
from uuid import UUID

import httpx


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    client = AsyncIOMotorClient("mongodb://admin:secret@project-db:27017")
    await init_beanie(
        database=client.project,
        document_models=[ProjectMetadata],
    )
    yield
    # Stop


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")
# To enable prometheus metrics, uncomment the following lines and install the dependencies
# from starlette_exporter import PrometheusMiddleware, handle_metrics

# app.add_middleware(PrometheusMiddleware)
# app.add_route("/metrics", handle_metrics)


async def verify_token(token: str = Depends(oauth2_scheme)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/verify_token",
            json={"access_token": token, "token_type": "bearer"},
        )
        if response.status_code == 200:
            user = response.json()
            user["access_token"] = token
            return user
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()["detail"],
            )


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# new project
@app.post("/new")
async def insert_new_project(body: ProjectCreate, user: dict = Depends(verify_token)):
    body_dict = body.model_dump()
    body_dict["project_owner"] = user[
        "account_id"
    ]  # I might want to add the Account model to this api, but it feels a little unnecessary at this current time 💭
    project = ProjectMetadata(**body_dict)
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_project_reference/{str(project.project_id)}",
                headers={"Authorization": f"Bearer {user['access_token']}"},
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

    try:
        await project.insert()
    except:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/remove_project_reference/{str(project.project_id)}"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

    return project


# new project from template
@app.post("/new/template/{template_name}")
async def insert_react_template(
    body: ProjectCreate, template_name: str, user: dict = Depends(verify_token)
):
    body_dict = body.model_dump()

    body_dict["project_owner"] = user["account_id"]

    # Depending on how many templates get made this might be a good candidate for a switch statement 💭
    if template_name.lower() == "react":
        body_dict["file_structure"] = Directory(**react_file_template)
    project = ProjectMetadata(**body_dict)

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_project_reference/{str(project.project_id)}",
                headers={"Authorization": f"Bearer {user['access_token']}"},
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

    try:
        await project.insert()
    except:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/remove_project_reference/{str(project.project_id)}"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

    return project


# get all projects
@app.get("/all")
async def get_all_projects():
    projects = await ProjectMetadata.find({}).to_list()

    if not projects:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return projects


# get project by id
@app.get("/by_id/{project_id}")
async def get_project(project_id: UUID):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return project


# get projects by owner
@app.get("/by_owner/{project_owner}")
async def get_projects(project_owner: str):
    projects = await ProjectMetadata.find({"project_owner": project_owner}).to_list()
    if not projects:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    return projects


# update project
@app.put("/by_id/{project_id}")
async def update_project(project_id: UUID, body: ProjectMetadata):
    if project_id != body.project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project id in the url does not match the project id in the request body",
        )
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    if project.project_owner != body.project_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project",
        )
    if project.project_id != body.project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project you are trying to edit does not match the project id in the request body",
        )

    # project.project_id = body.project_id # Doesn't actually ever get changed
    # project.project_owner = body.project_owner # Doesn't actually ever get changed
    project.project_name = body.project_name
    project.project_description = body.project_description
    project.creation_date = body.creation_date
    project.last_modified_date = datetime.now()
    project.is_private = body.is_private
    project.file_structure = body.file_structure

    await project.replace()
    return project


# update project name
@app.patch("/by_id/{project_id}/new_name/{new_name}")
async def update_project_name(project_id: UUID, new_name: str):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    if project.project_name == new_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new name is the same as the old name",
        )

    project.last_modified_date = datetime.now()
    project.project_name = new_name
    await project.replace(project)
    return project


# update project description
@app.patch("/by_id/{project_id}/new_description/{new_description}")
async def update_project_description(project_id: UUID, new_description: str):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    if project.project_description == new_description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new description is the same as the old description",
        )

    project.last_modified_date = datetime.now()
    project.project_description = new_description
    await project.replace(project)
    return project


# update project privacy
@app.patch("/by_id/{project_id}/new_privacy/{new_privacy}")
async def update_project_privacy(project_id: UUID, new_privacy: bool):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    if project.is_private == new_privacy:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project is already set to that privacy setting",
        )

    project.last_modified_date = datetime.now()
    project.is_private = new_privacy
    await project.replace(project)
    return project


# update project file structure
@app.patch("/by_id/{project_id}/replace_file_structure")
async def update_project_file_structure(project_id: UUID, body: Directory):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    project.last_modified_date = datetime.now()
    project.file_structure = body
    await project.replace(project)
    return project


# update project owner - this is for account merging
@app.patch("/by_id/{project_id}/new_owner/{new_owner}")
async def update_project_owner(project_id: UUID, new_owner: str):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    if project.project_owner == new_owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new owner is the same as the old owner",
        )

    project.last_modified_date = datetime.now()
    project.project_owner = new_owner
    await project.replace(project)
    return project


# delete all projects by owner
@app.delete("/by_owner/{project_owner}")
async def delete_projects(project_owner: str):
    projects = await ProjectMetadata.find({"project_owner": project_owner}).to_list()
    if not projects:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    for project in projects:
        await project.delete()


# delete project
@app.delete("/by_id/{project_id}")
async def delete_project(project_id: UUID):
    project = await ProjectMetadata.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )
    await project.delete()
