from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager

from models.project_models import (
    ProjectDataDB,
    Directory,
    File,
    ProjectCreate,
    ProjectDataWithFiles,
)
from projectFileTemplates import (
    react_file_template,
    empty_file_template,
    next_file_template,
)

from jose import JWTError, jwt

from decouple import config

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from beanie import init_beanie
from bson import ObjectId
from datetime import datetime
from uuid import UUID

import httpx

import json

from pytz import utc
from tzlocal import get_localzone

from models.account_models import AccountWithToken


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    client = AsyncIOMotorClient(
        f"mongodb://{config('PROJECT_DB_AUTH')}@{config('PROJECT_DB_NAME')}:{config('PROJECT_DB_PORT')}"
    )
    app.state.gridFS = AsyncIOMotorGridFSBucket(client.project, "projectFilesystem")

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


async def filter_in_templates(projects: list[ProjectDataDB], user: AccountWithToken):
    output = []

    global_templates = await ProjectDataDB.find({"project_owner": None}).to_list()

    print("Getting Global Templates")
    for project in global_templates:
        if not project.is_template and project not in projects:
            continue
        else:
            print(project.project_name)
            output.append(project)

    for project in projects:
        if not project.is_template:
            continue
        else:
            output.append(project)

    return output


def verify_collaborator(project: ProjectDataDB, user: AccountWithToken):
    print(str(user.account_id) != project.project_owner)
    print(str(user.account_id) not in project.collaborators)
    if (
        user.account_id != project.project_owner
        and user.account_id not in project.collaborators
    ) and not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project ;P",
        )


def verify_owner(project: ProjectDataDB, user: AccountWithToken):
    if str(user.account_id) != str(project.project_owner) and not user.isAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this project",
        )


def verify_item_found(project):
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )


# GPT generated and entirely untested 😎
async def upload_filestructure_to_gridfs(filesystem_json: Directory, project_id: UUID):
    gridfs_bucket = app.state.gridFS

    # Check if a file for this project already exists
    cursor = gridfs_bucket.find({"filename": f"{project_id}_files.json"})
    while await cursor.fetch_next:
        existing_file = cursor.next_object()
        gridfs_bucket.delete(existing_file._id)

    filesystem_dict = filesystem_json.dict()

    filesystem_bytes = json.dumps(filesystem_dict).encode()
    file_id = await gridfs_bucket.upload_from_stream(
        f"{project_id}_files.json", filesystem_bytes
    )
    return ObjectId(file_id)


async def download_filestructure_from_gridfs(file_id: ObjectId):
    gridfs_bucket = app.state.gridFS
    grid_out = await gridfs_bucket.open_download_stream(file_id)
    filesystem_bytes = await grid_out.read()
    filesystem_json = json.loads(
        filesystem_bytes.decode("utf-8")
    )  # Convert bytes back to JSON
    filestructure_model = Directory(**filesystem_json)
    return filestructure_model


async def project_to_project_out(project: ProjectDataDB):
    project_out = ProjectDataWithFiles(
        project_id=project.project_id,
        project_owner=project.project_owner,
        project_name=project.project_name,
        project_description=project.project_description,
        start_command=project.start_command,
        creation_date=project.creation_date,
        last_modified_date=project.last_modified_date,
        is_private=project.is_private,
        is_template=project.is_template,
        collaborators=project.collaborators,
        forks=project.forks,
        file_structure=await download_filestructure_from_gridfs(project.file_structure),
    )

    return project_out


async def bulk_projects_out(projects: list[ProjectDataDB]):
    output = []
    for project in projects:
        project_out = await project_to_project_out(project)
        output.append(project_out)
    return output


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
    project.file_structure = await upload_filestructure_to_gridfs(
        Directory(empty_file_template),
        project.project_id,
    )
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
    except Exception as e:
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

    project_out = await project_to_project_out(project)

    return project_out


# new project from template
@app.post("/new/from_template/{template_id}")
async def insert_template(
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

    project = ProjectDataDB(**body_dict)

    template_filestructure = await download_filestructure_from_gridfs(
        template.file_structure
    )

    project.file_structure = await upload_filestructure_to_gridfs(
        template_filestructure,
        project.project_id,
    )

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

    project_out = await project_to_project_out(project)

    return project_out


# new project from template
@app.post("/old/from_template/{template_name}")
async def insert_react_template(
    body: ProjectCreate,
    template_name: str,
    user: AccountWithToken = Depends(verify_token),
):
    body_dict = body.model_dump()

    body_dict["project_owner"] = user.account_id

    if template_name == "react":
        file_structure = Directory(react_file_template)
    elif template_name == "empty":
        file_structure = Directory(empty_file_template)
    elif template_name == "next":
        file_structure = Directory(next_file_template)

    project = ProjectDataDB(**body_dict)

    project.file_structure = await upload_filestructure_to_gridfs(
        file_structure,
        project.project_id,
    )

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

    project_out = await project_to_project_out(project)

    return project_out


# fork a project
@app.post("/fork/{project_id}")
async def fork_project(
    body: ProjectCreate,
    project_id: UUID,
    user: AccountWithToken = Depends(verify_token),
):
    body_dict = body.model_dump()

    body_dict["project_owner"] = user.account_id
    body_dict["creation_date"] = datetime.now()

    template = await ProjectDataDB.find_one({"project_id": project_id})
    verify_item_found(template)

    project = ProjectDataDB(
        **body_dict,
    )
    template_filestructure = await download_filestructure_from_gridfs(
        template.file_structure
    )
    project.file_structure = await upload_filestructure_to_gridfs(
        template_filestructure,
        project.project_id,
    )
    template.forks.append(project.project_id)
    print(template.forks)
    try:
        await template.save()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be created",
        )

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

    project_out = await project_to_project_out(project)

    return project_out


# get all projects
@app.get("/all")
async def get_all_projects(user: AccountWithToken = Depends(verify_token)):
    projects = await ProjectDataDB.find({}).to_list()

    projects = filter_out_private_projects(projects, user)

    verify_item_found(projects)

    projects_out = await bulk_projects_out(projects)

    return projects_out


# get all templates
@app.get("/all/templates")
async def get_all_templates(user: AccountWithToken = Depends(verify_token)):
    projects = await ProjectDataDB.find({}).to_list()

    projects = filter_out_private_projects(projects, user)
    projects = await filter_in_templates(projects, user)

    verify_item_found(projects)

    projects_out = await bulk_projects_out(projects)

    return projects_out


# get project by id
@app.get("/by_id/{project_id}")
async def get_project(project_id: UUID):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_item_found(project)
    if project.is_private:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this project, or you used the wrong endpoint",
        )

    project_out = await project_to_project_out(project)

    return project_out


# get private project by id
@app.get("/private/by_id/{project_id}")
async def get_private_project(
    project_id: UUID, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_collaborator(project, user)
    verify_item_found(project)

    project_out = await project_to_project_out(project)

    return project_out


# get projects by owner
@app.get("/by_owner/{project_owner}")
async def get_projects(
    project_owner: UUID, user: AccountWithToken = Depends(verify_token)
):
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()

    projects = filter_out_private_projects(projects, user)

    projects_out = await bulk_projects_out(projects)

    return projects_out


# get projects by owner
@app.get("/public/by_owner/{project_owner}")
async def get_public_projects(project_owner: UUID):
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()

    for project in projects:
        if project.is_private:
            projects.remove(project)

    projects_out = await bulk_projects_out(projects)

    return projects_out


# Get templates by owner
@app.get("/by_owner/{project_owner}/templates")
async def get_projects(
    project_owner: UUID, user: AccountWithToken = Depends(verify_token)
):
    projects = await ProjectDataDB.find({"project_owner": project_owner}).to_list()

    projects = filter_out_private_projects(projects, user)
    projects = await filter_in_templates(projects, user)

    projects_out = await bulk_projects_out(projects)

    return projects_out


@app.get("/get_dashboard/{current_user_ID}")
async def get_dashboard_projects(
    current_user_ID: UUID, user: AccountWithToken = Depends(verify_token)
):
    projectsByOwner = await ProjectDataDB.find(
        {"project_owner": current_user_ID}
    ).to_list()
    projectsSharedWithUser = await ProjectDataDB.find(
        {"collaborators": current_user_ID}
    ).to_list()

    projects = projectsByOwner + projectsSharedWithUser

    projects_out = await bulk_projects_out(projects)
    print(projects_out)
    return projects_out


# update project
@app.put("/by_id/{project_id}")
async def update_project(
    project_id: UUID,
    body: ProjectDataWithFiles,
    user: AccountWithToken = Depends(verify_token),
):
    print("1")
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
    print("2")

    # project.project_id = body.project_id # Doesn't actually ever get changed
    # project.project_owner = body.project_owner # Doesn't actually ever get changed
    project.project_name = body.project_name
    project.project_description = body.project_description
    project.creation_date = body.creation_date
    project.last_modified_date = datetime.now()
    project.is_private = body.is_private
    project.file_structure = await upload_filestructure_to_gridfs(
        body.file_structure,
        project.project_id,
    )
    project.is_private = body.is_private
    project.is_template = body.is_template
    project.collaborators = body.collaborators
    project.forks = body.forks
    print("-------------------------------------")
    await project.replace()
    print("=====================================")
    project_out = await project_to_project_out(project)

    return project_out


# update project metadata
@app.patch("/by_id/{project_id}/projectData")
async def update_project_metadata(
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
    # project.creation_date = body.creation_date # Doesn't actually ever get changed
    project.project_name = body.project_name
    project.project_description = body.project_description
    project.is_private = body.is_private
    project.start_command = body.start_command
    # project.file_structure = body.file_structure
    project.is_private = body.is_private
    project.is_template = body.is_template
    project.collaborators = body.collaborators
    project.forks = body.forks

    project.last_modified_date = datetime.now()
    await project.replace()

    project_out = await project_to_project_out(project)

    return project_out


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

    project_out = await project_to_project_out(project)

    return project_out


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

    project.project_description = new_description
    project.last_modified_date = datetime.now()
    await project.replace()

    project_out = await project_to_project_out(project)

    return project_out


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

    project_out = await project_to_project_out(project)

    return project_out


# update project file structure
@app.patch("/by_id/{project_id}/replace_file_structure")
async def update_project_file_structure(
    project_id: UUID, body: Directory, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_collaborator(project, user)
    verify_item_found(project)

    project.last_modified_date = datetime.now()
    project.file_structure = await upload_filestructure_to_gridfs(
        body,
        project.project_id,
    )
    await project.replace()

    project_out = await project_to_project_out(project)

    return project_out


# add collaborator
@app.patch("/by_id/{project_id}/add_collaborator/{collaborator}")
async def add_collaborator(
    project_id: UUID, collaborator: UUID, user: AccountWithToken = Depends(verify_token)
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

    project_out = await project_to_project_out(project)

    return project_out


# remove collaborator
@app.patch("/by_id/{project_id}/remove_collaborator/{collaborator}")
async def remove_collaborator(
    project_id: UUID, collaborator: UUID, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})

    # If the user is the collaborator, they can remove themselves
    if user.account_id != collaborator:
        # otherwise, they have to be the owner
        verify_owner(project, user)

    verify_item_found(project)
    print(project.collaborators)
    if collaborator not in project.collaborators:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The collaborator is not in the project",
        )

    project.last_modified_date = datetime.now()
    project.collaborators.remove(collaborator)
    await project.replace()

    project_out = await project_to_project_out(project)

    return project_out


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

    project_out = await project_to_project_out(project)

    return project_out


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

    project_out = await project_to_project_out(project)

    return project_out


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
        app.state.gridFS.delete(project.file_structure)
        await project.delete()


# delete project
@app.delete("/by_id/{project_id}")
async def delete_project(
    project_id: UUID, user: AccountWithToken = Depends(verify_token)
):
    project = await ProjectDataDB.find_one({"project_id": project_id})
    verify_owner(project, user)
    verify_item_found(project)

    try:
        async with httpx.AsyncClient() as client:
            await client.delete(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/remove_project_reference/{str(project.project_id)}"
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be deleted",
        )

    try:
        app.state.gridFS.delete(project.file_structure)
        await project.delete()
    except:
        async with httpx.AsyncClient() as client:
            await client.post(
                # I should be future proofing like this more, also another technical debt relief round will be getting old hardcoded URLs 💭
                f"http://{config('ACCOUNT_API_HOST')}:{config('ACCOUNT_API_PORT')}/add_project_reference/{str(project.project_id)}"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The project could not be deleted",
        )
