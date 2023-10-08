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


# https://cookbook.openai.com
# Add a field for a sample component!!! This is for refactoring!
@app.post("/prompt")
async def prompt(prompt_in: PromptInput = Body(...)):
    pp = pprint.PrettyPrinter(indent=3)

    old_system_prompt = {
        "role": "system",
        "content": "You are assisting in the development of a javascript React application. When you generate a component it should be a functional component. Include inline styles to make things look nice. Try to use material ui components from @mui/material whenever makes sense. Be sure to supply valid JSON for the component definition.",
    }

    # Test me!!!!!~ 😎
    # Add some context about the available packages 💭
    # Mui shouldn't be hard coded, it should be a variable that can be changed 💭
    system_prompt = {
        "role": "system",
        "content": """You are tasked with assisting in the development of a JavaScript React application. Please adhere to the following guidelines when generating code:
                    - Create Functional Components: Each generated component should be a functional component.
                    - Style Appropriately: Incorporate inline styles to enhance the appearance of the components. Ensure the styles are clean and organized.
                    - Utilize Material-UI: Integrate components from the '@mui/material' library where appropriate and logical. Familiarize yourself with the library's documentation to make effective use of its components.
                    - Provide Valid JSON: The component definition should be supplied in a valid JSON format.
                    Please ensure your code is clean, efficient, and follows React and Material-UI best practices.""",
    }

    messages = [system_prompt] + jsonable_encoder(prompt_in.messages)

    if prompt_in.apikey != None:
        openai.api_key = prompt_in.apikey

    function_call = "auto"

    # If tthe function_call is not auto or none then we need to pass GPT the function in a different format
    if (
        prompt_in.function != GPTFunction.auto
        and prompt_in.function != GPTFunction.none
    ):
        function_call = {"name": prompt_in.function.value}
    # Otherwise we can just pass it the string value
    else:
        function_call = prompt_in.function.value

    # If context is getting eaten up by functions then we may want to only provide the function when it's needed
    completion = openai.ChatCompletion.create(
        model=prompt_in.model.value,
        messages=messages,
        functions=functions,
        function_call=function_call,
    )
    # if the completion.choices[0].message has the attribute "function_call" then that means the function was called
    if hasattr(completion.choices[0].message, "function_call"):
        if (
            completion.choices[0].message.function_call.name
            == GPTFunction.generate_component_code.value
        ):
            try:
                component_json = json.loads(
                    completion.choices[0].message.function_call.arguments
                )
            except Exception as e:
                pp.pprint(e)
                return Prompt_Output(
                    agentResponse="Something went wrong, please try again.",
                    userPrompt=prompt_in.messages[-1].content,
                    agentModel=completion.model,
                )

            # Try catch around this that throws the json back to GPT if it's not valid
            component_modeled = Component(**component_json)

            output = Prompt_Output(
                agentResponse=generate_component_code(
                    component_modeled, prompt_in.pre_import_code
                ),
                userPrompt=prompt_in.messages[-1].content,
                function=completion.choices[0].message.function_call.name,
                agentModel=completion.model,
            )
            # send the output to a code linter and formatter to make sure it's valid and pretty
    else:
        function_call = "none"
        if hasattr(completion.choices[0].message, "function_call"):
            function_call = completion.choices[0].message.function_call.name

        output = Prompt_Output(
            agentResponse=completion.choices[0].message.content,
            userPrompt=prompt_in.messages[-1].content,
            function=function_call,
            agentModel=completion.model,
        )

    return output
