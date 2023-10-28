from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager

from models.project_models import (
    ProjectDataDB,
    Directory,
    File,
    ProjectCreate,
)
from reactFileTemplate import react_file_template

from jose import JWTError, jwt

from decouple import config

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from datetime import datetime
from uuid import UUID

import httpx

from pytz import utc
from tzlocal import get_localzone

from models.account_models import AccountWithToken


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    client = AsyncIOMotorClient("mongodb://admin:secret@project-db:27017")
    await init_beanie(
        database=client.project,
        document_models=[ProjectDataDB],
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

# --------------------------------------------- Methods --------------------------------------------- #


async def verify_token(token: str = Depends(oauth2_scheme)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/verify_token",
            json={"access_token": token, "token_type": "bearer"},
        )
        if response.status_code == 200:
            userDict = response.json()
            userDict["access_token"] = token
            user = AccountWithToken(**userDict)
            return user
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json()["detail"],
            )


def filter_out_private_projects(projects: list[ProjectDataDB], user: AccountWithToken):
    output = []

    for project in projects:
        if (
            project.is_private and project.project_owner != str(user.account_id)
        ) and not user.isAdmin:
            continue
        else:
            output.append(project)

    return output


def filter_in_templates(projects: list[ProjectDataDB], user: AccountWithToken):
    output = []

    for project in projects:
        if not project.is_template:
            continue
        else:
            output.append(project)

    return output


def verify_collaborator(project: ProjectDataDB, user: AccountWithToken):
    if (
        str(user.account_id) != project.project_owner
        and str(user.account_id) not in project.collaborators
    ) and not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project",
        )


def verify_owner(project: ProjectDataDB, user: AccountWithToken):
    if str(user.account_id) != project.project_owner and not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project",
        )


def verify_item_found(project):
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )


# --------------------------------------------- Endpoints --------------------------------------------- #


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# new project
@app.post("/new")
async def insert_new_project(
    body: ProjectCreate, user: AccountWithToken = Depends(verify_token)
):
    body_dict = body.model_dump()
    body_dict["project_owner"] = user.account_id
    project = ProjectDataDB(**body_dict)
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_project_reference/{str(project.project_id)}",
                headers={"Authorization": f"Bearer {user.access_token}"},
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
            # undo the add_project_reference
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
@app.post("/new/from_template/{template_id}")
async def insert_react_template(
    body: ProjectCreate,
    template_id: UUID,
    user: AccountWithToken = Depends(verify_token),
):
    body_dict = body.model_dump()

    body_dict["project_owner"] = user.account_id

    template = await ProjectDataDB.find_one({"project_id": template_id})
    verify_item_found(template)
    if not template.is_template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project you are trying to use as a template is not a template",
        )

    body_dict["file_structure"] = template.file_structure
    project = ProjectDataDB(**body_dict)

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_project_reference/{str(project.project_id)}",
                headers={"Authorization": f"Bearer {user.access_token}"},
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

    try:
        await project.insert()
    except Exception as e:
        print(e)
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
async def get_all_projects(user: AccountWithToken = Depends(verify_token)):
    projects = await ProjectDataDB.find({}).to_list()

    projects = filter_out_private_projects(projects, user)

    verify_item_found(projects)

    return projects


# completely untested 😎
# get all templates
@app.get("/all/templates")
async def get_all_projects(user: AccountWithToken = Depends(verify_token)):
    projects = await ProjectDataDB.find({}).to_list()

    projects = filter_out_private_projects(projects, user)
    projects = filter_in_templates(projects, user)

    verify_item_found(projects)

    return projects


# get project by id
@app.get("/by_id/{project_id}")
async def get_project(project_id: UUID, user: AccountWithToken = Depends(verify_token)):
    project = await ProjectDataDB.find_one({"project_id": project_id})

    verify_collaborator(project, user)

    verify_item_found(project)
    return project


# get projects by owner
@app.get("/by_owner/{project_owner}")
async def get_projects(
    project_owner: UUID, user: AccountWithToken = Depends(verify_token)
):
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()

    projects = filter_out_private_projects(projects, user)

    verify_item_found(projects)

    return projects


# Get templates by owner
@app.get("/by_owner/{project_owner}/templates")
async def get_projects(
    project_owner: UUID, user: AccountWithToken = Depends(verify_token)
):
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()

    projects = filter_out_private_projects(projects, user)
    projects = filter_in_templates(projects, user)

    verify_item_found(projects)

    return projects


# update project
@app.put("/by_id/{project_id}")
async def update_project(
    project_id: UUID,
    body: ProjectDataDB,
    user: AccountWithToken = Depends(verify_token),
):
    if project_id != body.project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project id in the url does not match the project id in the request body",
        )
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_item_found(project)
    if project.project_id != body.project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project you are trying to edit does not match the project id in the request body",
        )
    if project.project_owner != body.project_owner:
        # This one could technically be merged with the next if statement, but I think it's better to keep them separate for readability
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project",
        )
    verify_collaborator(project, user)

    # project.project_id = body.project_id # Doesn't actually ever get changed
    # project.project_owner = body.project_owner # Doesn't actually ever get changed
    project.project_name = body.project_name
    project.project_description = body.project_description
    project.creation_date = body.creation_date
    project.last_modified_date = datetime.now()
    project.is_private = body.is_private
    project.file_structure = body.file_structure
    project.is_private = body.is_private
    project.is_template = body.is_template
    project.collaborators = body.collaborators

    await project.replace()
    return project


# update project name
@app.patch("/by_id/{project_id}/new_name/{new_name}")
async def update_project_name(
    project_id: UUID, new_name: str, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_collaborator(project, user)
    verify_item_found(project)
    if project.project_name == new_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new name is the same as the old name",
        )

    project.last_modified_date = datetime.now()
    project.project_name = new_name
    await project.replace()
    return project


# update project description
@app.patch("/by_id/{project_id}/new_description/{new_description}")
async def update_project_description(
    project_id: UUID,
    new_description: str,
    user: AccountWithToken = Depends(verify_token),
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_collaborator(project, user)
    verify_item_found(project)
    if project.project_description == new_description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new description is the same as the old description",
        )

    project.last_modified_date = datetime.now()
    project.project_description = new_description
    await project.replace()
    return project


# update project privacy
@app.patch("/by_id/{project_id}/new_privacy/{new_privacy}")
async def update_project_privacy(
    project_id: UUID, new_privacy: bool, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)
    if project.is_private == new_privacy:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project is already set to that privacy setting",
        )

    project.last_modified_date = datetime.now()
    project.is_private = new_privacy
    await project.replace()
    return project


# update project file structure
@app.patch("/by_id/{project_id}/replace_file_structure")
async def update_project_file_structure(
    project_id: UUID, body: Directory, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_collaborator(project, user)
    verify_item_found(project)

    project.last_modified_date = datetime.now()
    project.file_structure = body
    await project.replace()
    return project


# add collaborator
@app.patch("/by_id/{project_id}/add_collaborator/{collaborator}")
async def add_collaborator(
    project_id: UUID, collaborator: str, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)
    if collaborator in project.collaborators:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The collaborator is already in the project",
        )

    project.last_modified_date = datetime.now()
    project.collaborators.append(collaborator)

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_collaborator/{str(project.project_id)}/{collaborator}",
                headers={"Authorization": f"Bearer {user.access_token}"},
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The collaborator could not be added",
        )

    try:
        await project.replace()
    except:
        async with httpx.AsyncClient() as client:
            # undo the add_collaborator
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/remove_collaborator/{str(project.project_id)}/{collaborator}"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The collaborator could not be added",
        )

    return project


# remove collaborator
@app.patch("/by_id/{project_id}/remove_collaborator/{collaborator}")
async def remove_collaborator(
    project_id: UUID, collaborator: str, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})

    # If the user is the collaborator, they can remove themselves
    if user.account_id != collaborator:
        # otherwise, they have to be the owner
        verify_owner(project, user)

    verify_item_found(project)
    if collaborator not in project.collaborators:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The collaborator is not in the project",
        )

    project.last_modified_date = datetime.now()
    project.collaborators.remove(collaborator)
    await project.replace()
    return project


# set project is_template
@app.patch("/by_id/{project_id}/set_template/{is_template}")
async def set_project_is_template(
    project_id: UUID, is_template: bool, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)
    if project.is_template == is_template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project is already set to that template setting",
        )

    project.last_modified_date = datetime.now()
    project.is_template = is_template
    await project.replace()
    return project


# update project owner - this is for account merging
@app.patch("/by_id/{project_id}/new_owner/{new_owner}")
async def update_project_owner(
    project_id: UUID, new_owner: str, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)
    if project.project_owner == new_owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The new owner is the same as the old owner",
        )

    project.last_modified_date = datetime.now()
    project.project_owner = new_owner
    await project.replace()
    return project


# delete all projects by owner
@app.delete("/by_owner/{project_owner}")
async def delete_projects(
    project_owner: UUID, user: AccountWithToken = Depends(verify_token)
):
    if not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete these projects",
        )
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()
    verify_item_found(projects)
    for project in projects:
        await project.delete()


# delete project
@app.delete("/by_id/{project_id}")
async def delete_project(
    project_id: UUID, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)
    await project.delete()
