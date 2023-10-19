from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from decouple import config
from beanie import init_beanie
from pydantic import BaseModel, EmailStr
import uuid
import json
from models.account_models import (
    Account,
    AccountIn,
    AccountOut,
    OAuthAccount,
    AccountAuth,
    AccountNewPassword,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    client = AsyncIOMotorClient("mongodb://admin:secret@auth-db:27017")
    await init_beanie(
        database=client.auth,
        document_models=[Account],  # I need models before I can init beanie 💭
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

# To enable prometheus metrics, uncomment the following lines and install the dependencies
# from starlette_exporter import PrometheusMiddleware, handle_metrics

# app.add_middleware(PrometheusMiddleware)
# app.add_route("/metrics", handle_metrics)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# New user
@app.post("/register")
async def new_user(account: AccountIn):
    if (account.email is None) or (account.password is None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password required",
        )

    if account.name is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name required, it doesn't have to be your real name! :D",
        )

    # Check if account exists
    # Lookup by email

    newAccount = Account(
        **account.dict(),
    )
    await newAccount.insert()

    # Send verification email 💭

    # Maybe instead of returning the account return a redirect url to the login page 💭
    # Failure can redirect to the register page with an error message
    output = AccountOut(**newAccount.dict())
    return output


# get user by id
@app.get("/by_id/{account_id}")
async def get_user_by_id(account_id: uuid.UUID):
    account = await Account.find_one({"account_id": account_id})
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return AccountOut(**account.dict())


# get user by email
@app.get("/by_email/{email}")
async def get_user_by_email(email: EmailStr):
    account = await Account.find_one({"email": email})
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return AccountOut(**account.dict())


# Entirely untested 😎
# get user by Oauth id
@app.get("/by_oauth_id/{oauth_id}")
async def get_user_by_oauth_id(oauth_id: str):
    account = await Account.find_one({"oauth_accounts.oauth_id": oauth_id})
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )
    return AccountOut(**account.dict())


# Entirely untested 😎
# create user from oauth info
@app.post("/new/oauth")
async def new_oauth_user(oauth_account: OAuthAccount):
    # Check if account exists
    # Lookup by email

    newAccount = Account(
        name=oauth_account.name,
        email=oauth_account.email,
        oauth_accounts=[oauth_account],
    )
    await newAccount.insert()

    # Maybe instead of returning the account return a redirect url to the login page 💭
    # Failure can redirect to the register page with an error message
    output = AccountOut(**newAccount.dict())
    return output


# Entirely untested 😎
# check if oauth account exists
@app.get("/oauth_exists/{oauth_id}")
async def oauth_account_exists(oauth_id: str):
    account = await Account.find_one({"oauth_accounts.oauth_id": oauth_id})
    if account is None:
        return {"exists": False}
    return {"exists": True}


# Endpoints TODO:
# - login
@app.post("/authenticate")
async def authenticate_user(credentials: AccountAuth):
    pass


# - verify email
@app.get("/verify_email/{JW_token_probably}")
async def verify_email(JW_token_probably: str):
    pass


# - change password
@app.post("/change_password")
async def change_password(credentials: AccountNewPassword):
    pass


# - change name
@app.post("/change_name")
async def change_name(new_name: str):
    pass


# - deactivate account
@app.delete("/deactivate/{account_id}")
async def deactivate_account(account_id: str):
    # if account_id is None:
    #    Delete logged in account
    # else:
    #    Make sure the user is an admin, then delete the account
    pass
