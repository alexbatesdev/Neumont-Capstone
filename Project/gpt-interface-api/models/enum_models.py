from enum import Enum


# Supported models
class GPTModel(str, Enum):
    gpt_3_5: str = "gpt-3.5-turbo-0613"
    gpt_4: str = "gpt-4-0613"


# The values of this enum match the defined functions that can be called by GPT
class GPTFunction(str, Enum):
    # auto lets GPT decide which function to use
    auto: str = "auto"
    # specifying the function name directly will force GPT to use that function
    generate_component_code: str = "generate_component_code"
