from enum import Enum


# Supported models
class GPTModel(str, Enum):
    gpt_3: str = "gpt-3.5-turbo-1106"
    gpt_4: str = "gpt-4-1106-preview"


# The values of this enum match the defined functions that can be called by GPT
class GPTFunction(str, Enum):
    # auto lets GPT decide which function to use
    auto: str = "auto"
    # specifying the function name directly will force GPT to use that function
    generate_component_code: str = "generate_component_code"
    # tells GPT not to use any functions
    none: str = "none"
