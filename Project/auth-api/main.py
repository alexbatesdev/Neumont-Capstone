from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from decouple import config
from beanie import init_beanie
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import uuid
import json


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
    # client = AsyncIOMotorClient("mongodb://admin:secret@auth-db:27017")
    # await init_beanie(
    #     database=client.auth,
    #     document_models=[User], # I need models before I can init beanie 💭
    # )
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

# get user by id

# get user by email

# get user by Oauth id
