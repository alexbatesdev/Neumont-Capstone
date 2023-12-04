from typing import Annotated

# Fastapi stuff
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Auth stuff
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Password hashing stuff # https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
from passlib.context import CryptContext
from jose import JWTError, jwt

# DB stuff
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Type stuff
from pydantic import BaseModel, EmailStr
from uuid import UUID
import json
from models.account_models import (
    AccountDB,
    AccountIn,
    AccountOut,
    OAuthAccount,
    AccountAuth,
    AccountWithToken,
    AccountNameEmailOnly,
)
from datetime import timedelta, datetime

# Misc imports
from decouple import config

import httpx


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    client = AsyncIOMotorClient(
        f"mongodb://{config('ACCOUNT_DB_AUTH')}@{config('ACCOUNT_DB_NAME')}:{config('ACCOUNT_DB_PORT')}"
    )
    await init_beanie(
        database=client.account,
        document_models=[AccountDB],
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


# To enable prometheus metrics, uncomment the following lines and install the dependencies
# from starlette_exporter import PrometheusMiddleware, handle_metrics

# app.add_middleware(PrometheusMiddleware)
# app.add_route("/metrics", handle_metrics)


# I should maybe move these to a different file 💭
# ---------------------------------- Utility functions -------------------------------------


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(email: str, password: str):
    user = await AccountDB.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user.password):
        print("passwords don't match")
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        MINUTES = int(config("ACCESS_TOKEN_EXPIRE_MINUTES"))
        expire = datetime.utcnow() + timedelta(minutes=MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, config("SECRET_KEY"), algorithm=config("ALGORITHM")
    )
    return encoded_jwt


def filter_out_deactivated_accounts(accounts):
    # Copilot snippet
    return [account for account in accounts if not account.isDeactivated]


# ---------------------------------- Dependency functions ----------------------------------


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, config("SECRET_KEY"), algorithms=[config("ALGORITHM")]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await AccountDB.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return user


async def get_current_user_with_token(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, config("SECRET_KEY"), algorithms=[config("ALGORITHM")]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await AccountDB.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return AccountWithToken(**user.model_dump(), access_token=token)


async def get_current_active_user(
    current_user: Annotated[AccountDB, Depends(get_current_user)]
):
    if current_user.isDeactivated:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def verify_account_found(Account):
    if not Account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )


# ------------------------- Endpoints -------------------------------------------------------


@app.post("/verify_token")
async def verify_token(token: Token):
    user = await get_current_user_with_token(token.access_token)
    return AccountOut(**user.model_dump())


# Response of this endpoint must be json
@app.post("/auth")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)
    )
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    # This format must be kept to follow open api standards
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me")
async def read_groot(current_user: Annotated[AccountDB, Depends(get_current_user)]):
    return {"user": AccountOut(**current_user.model_dump())}


@app.get("/test")
async def read_groot(token: str = Depends(oauth2_scheme)):
    return {"token": token}


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# New user
@app.post("/register")
async def new_user(Account: AccountIn):
    accountExist = await AccountDB.find_one({"email": Account.email})
    if accountExist is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already exists",
        )

    account_dict = Account.model_dump()
    account_dict["password"] = get_password_hash(account_dict["password"])

    newAccount = AccountDB(
        **account_dict,
    )
    await newAccount.insert()

    # Generate JWT for new user

    return {"success": True}


@app.patch("/update_account")
async def update_account(
    account_in: AccountNameEmailOnly,
    current_user: Annotated[AccountDB, Depends(get_current_user)],
):
    current_user.name = account_in.name
    current_user.email = account_in.email
    await current_user.save()
    return {"success": True}


# get user by email
@app.get("/by_email/{email}")
async def get_user_by_email(email: EmailStr):
    Account = await AccountDB.find_one({"email": email})
    verify_account_found(Account)
    return AccountOut(**Account.model_dump())


# get user by id
@app.get("/by_id/{account_id}")
async def get_user_by_id(account_id: UUID):
    account = await AccountDB.find_one({"account_id": account_id})
    verify_account_found(account)
    return AccountOut(**account.model_dump())


# Entirely untested 😎
# get user by Oauth id
@app.get("/by_oauth_id/{oauth_id}")
async def get_user_by_oauth_id(oauth_id: str):
    Account = await AccountDB.find_one({"oauth_accounts.oauth_id": oauth_id})
    verify_account_found(Account)
    return AccountOut(**Account.model_dump())


# Entirely untested 😎
# create user from oauth info
@app.post("/new/oauth")
async def new_oauth_user(oauth_account: OAuthAccount):
    # Check if Account exists
    # Lookup by email

    newAccount = AccountDB(
        name=oauth_account.name,
        email=oauth_account.email,
        oauth_accounts=[oauth_account],
    )
    await newAccount.insert()

    # Maybe instead of returning the Account return a redirect url to the login page 💭
    # Failure can redirect to the register page with an error message
    output = AccountOut(**newAccount.model_dump())
    return output


# Entirely untested 😎
# check if oauth Account exists
@app.get("/oauth_exists/{oauth_id}")
async def oauth_account_exists(oauth_id: str):
    Account = await AccountDB.find_one({"oauth_accounts.oauth_id": oauth_id})
    if Account is None:
        return {"exists": False}
    return {"exists": True}


@app.get("/search/{search_term}")
async def search(search_term: str):
    AccountsByEmail = await AccountDB.find(
        {"email": {"$regex": search_term, "$options": "i"}}
    ).to_list()
    AccountsByName = await AccountDB.find(
        {"name": {"$regex": search_term, "$options": "i"}}
    ).to_list()
    AccountsByID = await AccountDB.find(
        {"account_id": {"$regex": search_term, "$options": "i"}}
    ).to_list()
    Accounts = AccountsByEmail + AccountsByName + AccountsByID
    Accounts = filter_out_deactivated_accounts(Accounts)
    return {"results": [AccountOut(**Account.model_dump()) for Account in Accounts]}


# Endpoints TODO:


# entirelly untested 😎
# - change password
@app.post("/change_password")
async def change_password(
    credentials: AccountAuth,
    current_user: Annotated[AccountDB, Depends(get_current_user)],
):
    if credentials.password != current_user.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords don't match",
        )
    if (current_user.password != get_password_hash(credentials.password)) and (
        current_user.password is not None
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password",
        )
    current_user.password = get_password_hash(credentials.password)
    await current_user.save()
    return {"success": True}


# entirelly untested 😎
# - change name
@app.post("/change_name")
async def change_name(
    new_name: str, current_user: Annotated[AccountDB, Depends(get_current_user)]
):
    current_user.name = new_name
    await current_user.save()
    return {"success": True}


# entirelly untested 😎
# - change email
@app.post("/change_email")
async def change_email(
    new_email: EmailStr, current_user: Annotated[AccountDB, Depends(get_current_user)]
):
    current_user.email = new_email
    current_user.emailVerified = False
    await current_user.save()
    return {"success": True}


# entirelly untested 😎
# - deactivate Account
@app.delete("/deactivate/{account_id}")
async def deactivate_account(
    account_id: UUID, current_user: Annotated[AccountDB, Depends(get_current_user)]
):
    # if account_id is None:
    #    Delete logged in Account
    # else:
    #    Make sure the user is an admin, then delete the Account
    if (current_user.account_id != account_id) and (current_user.isAdmin is False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to deactivate this Account",
        )
    else:
        Account = await AccountDB.find_one({"account_id": account_id})
        verify_account_found(Account)
        Account.isDeactivated = True
        await Account.save()
        return {"success": True}


# - add project to Account
@app.post("/add_project_reference/{project_id}")
async def add_project(
    current_user: Annotated[AccountDB, Depends(get_current_user)], project_id: str
):
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if project_id in current_user.projects:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project already added",
        )
    current_user.projects.append(project_id)
    await AccountDB(**current_user.model_dump()).save()
    return {"project_list": current_user.projects}


@app.delete("/remove_project_reference/{project_id}")
async def remove_project(
    current_user: Annotated[AccountDB, Depends(get_current_user)], project_id: str
):
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if project_id not in current_user.projects:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not in project list",
        )
    current_user.projects.remove(project_id)
    await current_user.save()
    return {"project_list": current_user.projects}


@app.post("/add_collaborator/{project_id}/{collaborator_id}")
async def add_collaborator(
    current_user: Annotated[AccountDB, Depends(get_current_user)],
    project_id: str,
    collaborator_id: str,
):
    collaborator_account = await AccountDB.find_one({"account_id": collaborator_id})
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if collaborator_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collaborator id required",
        )
    if project_id not in current_user.projects:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not in project list",
        )
    await collaborator_account.save()
    return {"success": True}


@app.post("/remove_collaborator/{project_id}/{collaborator_id}")
async def remove_collaborator(
    current_user: Annotated[AccountDB, Depends(get_current_user)],
    project_id: str,
    collaborator_id: str,
):
    collaborator_account = await AccountDB.find_one({"account_id": collaborator_id})
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if collaborator_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collaborator id required",
        )
    if project_id not in current_user.projects:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not in project list",
        )
    await collaborator_account.save()
    return {"success": True}


@app.post("/add_template/{project_id}")
async def add_template(
    current_user: Annotated[AccountDB, Depends(get_current_user)], project_id: str
):
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if project_id in current_user.my_templates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project already added",
        )
    current_user.my_templates.append(project_id)
    await current_user.save()
    return {"template_list": current_user.my_templates}


@app.delete("/remove_template/{project_id}")
async def remove_template(
    current_user: Annotated[AccountDB, Depends(get_current_user)], project_id: str
):
    if project_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project id required",
        )
    if project_id not in current_user.my_templates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project not in template list",
        )
    current_user.my_templates.remove(project_id)
    await current_user.save()
    return {"template_list": current_user.my_templates}


# Following - Currently untested 😎
@app.post("/follow/{account_id}")
async def follow_account(
    current_user: Annotated[AccountDB, Depends(get_current_user)], account_id: UUID
):
    if account_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account id required",
        )
    if account_id in current_user.following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already followed",
        )
    current_user.following.append(account_id)
    await current_user.save()
    return {"following_list": current_user.following}


@app.delete("/unfollow/{account_id}")
async def unfollow_account(
    current_user: Annotated[AccountDB, Depends(get_current_user)], account_id: UUID
):
    if account_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account id required",
        )
    if account_id not in current_user.following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not in following list",
        )
    current_user.following.remove(account_id)
    await current_user.save()
    return {"following_list": current_user.following}


@app.get("/following/{account_id}")
async def get_following(account_id: UUID):
    if account_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account id required",
        )
    Account = await AccountDB.find_one({"account_id": account_id})
    verify_account_found(Account)
    following_list = []
    for account_id in Account.following:
        following_list.append(await AccountDB.find_one({"account_id": account_id}))

    return {"following_list": following_list}
