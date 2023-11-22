import os
import json
import pprint
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.logger import logger
from contextlib import asynccontextmanager
from decouple import config

from util.component_util import generate_component_code
from models.input_models import PromptInput
from models.enum_models import GPTModel, GPTFunction
from models.react_models import Component
from models.output_models import Prompt_Output
from util.gpt_function_definitions import functions

import logging
import time

gunicorn_logger = logging.getLogger("gunicorn.error")
logger.handlers = gunicorn_logger.handlers
if __name__ != "main":
    logger.setLevel(gunicorn_logger.level)
else:
    logger.setLevel(logging.DEBUG)


import openai


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

@app.post("/new/thread/{api_key}")
async def new_thread(api_key: str):
    key = api_key
    if key == "None":
        key = config("OPENAI_KEY")

    client = openai.OpenAI(
        api_key=key,
        organization=config("OPENAI_ORG"),
    )
    thread = client.beta.threads.create()
    return thread.id


@app.post("/prompt/{thread_id}")
async def beta_prompt(thread_id: str, data_in: PromptInput = Body(...)):
    key = data_in.api_key
    print(key)
    if key == '""' or key == None:
        key = config("OPENAI_KEY")

    client = openai.OpenAI(
        api_key=key,
        organization=config("OPENAI_ORG"),
    )
    if len(data_in.dependencies) > 0:
        dependencies_string = ""
        for dependency in data_in.dependencies:
            print(dependency)
            dependencies_string += f"{dependency.name} {dependency.version}, "
        dependencies_prompt = f"The project you are working on uses the following dependencies: {dependencies_string}"
    else:
        dependencies_prompt = ""

    assistant = client.beta.assistants.create(
        name="JavaScript Assistant",
        instructions="You are assisting the development of a JavaScript application. Provide high quality and concise feedback and code snippets to help the developer. Be sure to follow best practices. Ask follow up questions that make original connections with topics that at first glance may not seem related but nonetheless are."
        + dependencies_prompt,
        model=data_in.model.value,
    )

    thread = client.beta.threads.retrieve(thread_id=thread_id)

    client.beta.threads.messages.create(
        thread_id=thread.id,
        role=data_in.message.role,
        content=data_in.message.content,
    )

    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )

    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        time.sleep(1)

    messages = client.beta.threads.messages.list(thread_id=thread.id)
    print(messages)

    return messages
