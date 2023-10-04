import os
import json
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.logger import logger
from contextlib import asynccontextmanager
from decouple import config

from util.component_util import generate_component_code
from models.input_models import PromptInput
from models.enum_models import GPTModel, GPTFunction
from models.react_models import Component
from util.gpt_function_definitions import functions

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


# 😎 Untested changes 😎
@app.post("/prompt")
async def prompt(prompt_in: PromptInput = Body(...)):
    print(prompt_in)

    user_prompt = {"role": "user", "content": prompt_in.prompt}

    if prompt_in.apikey != None:
        openai.api_key = prompt_in.apikey

    # If context is getting eaten up by functions then we may want to only provide the function when it's needed
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[user_prompt],
        functions=[functions],
        function_call=prompt_in.function.value,
    )

    # if the completion.choices[0].message has the attribute "function_call" then that means the function was called
    if hasattr(completion.choices[0].message, "function_call"):
        if (
            completion.choices[0].message.function_call.name
            == GPTFunction.generate_component_code.value
        ):
            component_json = json.loads(
                completion.choices[0].message.function_call.arguments
            )
            component_modeled = Component(**component_json)
            output = generate_component_code(
                component_modeled, prompt_in.pre_import_code
            )
            # send the output to a code linter and formatter to make sure it's valid and pretty
    else:
        output = {
            "prompt": user_prompt,
            "completion": completion,
            "completion_message": completion.choices[0].message,
        }

    return output
