from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from decouple import config

import os
import openai

openai.organization = config("OPENAI_ORG")
openai.api_key = config("OPENAI_KEY")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start
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
