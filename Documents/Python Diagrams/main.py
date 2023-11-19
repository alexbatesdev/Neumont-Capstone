from diagrams import Cluster, Diagram
from diagrams.aws.general import User
from diagrams.aws.network import APIGateway
from diagrams.aws.migration import ApplicationDiscoveryService
from diagrams.aws.ml import TensorflowOnAWS, Sagemaker
from diagrams.aws.compute import Compute
from diagrams.aws.database import DocumentdbMongodbCompatibility
from diagrams.aws.integration import SimpleQueueServiceSqs
from diagrams.onprem.ci import Gitlabci
from diagrams.programming.framework import React, Fastapi
from diagrams.onprem.database import Mongodb
from diagrams.onprem.queue import Kafka
from diagrams.onprem.network import Ocelot, Kong
from diagrams.programming.language import Nodejs

with Diagram("Capstone Project Architecture", show=False):
    users = User("Users")
    frontend = React("Frontend")

    with Cluster("Backend"):
        ChatGPTInterface = Fastapi("ChatGPT Interface API")
        accountAPI = Fastapi("Account API")
        projectAPI = Fastapi("File Operations API")
        ChatGPT = Sagemaker("ChatGPT")
        with Cluster("Authored by GPT"):
            expressImageProxy = Nodejs("Express Image Proxy")

        with Cluster("Databases"):
            userDatabase = Mongodb("User Database")
            projectDatbase = Mongodb("Project Database")

    users >> frontend
    frontend >> ChatGPTInterface >> ChatGPT
    frontend >> accountAPI >> userDatabase
    frontend >> projectAPI >> projectDatbase
    frontend >> expressImageProxy
