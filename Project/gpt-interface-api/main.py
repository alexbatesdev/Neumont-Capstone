import os
import json
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.logger import logger
from contextlib import asynccontextmanager
from decouple import config

from util.component_util import generate_component_code
from models.input_models import PromptInput

import logging

gunicorn_logger = logging.getLogger("gunicorn.error")
logger.handlers = gunicorn_logger.handlers
if __name__ != "main":
    logger.setLevel(gunicorn_logger.level)
else:
    logger.setLevel(logging.DEBUG)


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


@app.get("/list")
async def read_root():
    return openai.Model.list()


@app.post("/prompt")
async def generate_component(prompt_in: PromptInput = Body(...)):
    print(prompt_in)

    user_prompt = {"role": "user", "content": prompt_in.prompt}

    if prompt_in.apikey != None:
        openai.api_key = prompt_in.apikey

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=[user_prompt]
    )

    output = {
        "prompt": user_prompt,
        "completion": completion,
        "completion_message": completion.choices[0].message,
    }

    # output = {"prompt": user_prompt, "completion": completion.choices[0].message}
    # print(output)
    return output
