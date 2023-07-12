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

with Diagram("Capstone Project Architecture", show=False):
    users = User("Users")
    frontend = React("Frontend")

    with Cluster("Backend"):
        gateway = Kong("API Gateway")
        serviceDiscovery = ApplicationDiscoveryService("Service Discovery")
        gitlab = Gitlabci("Gitlab")
        ChatGPTInterface = Fastapi("ChatGPT Interface API")
        ChatGPT = Sagemaker("ChatGPT")
        userAPI = Fastapi("User API")

        with Cluster("Editor API Group"):
            fileOperationsAPI = Fastapi("File Operations API")
            metadataAPI = Fastapi("Project Metadata API")
            editorAPI = Fastapi("Editor API")
            queue = Kafka("Kafka Queue")

        with Cluster("Databases"):
            userDatabase = Mongodb("User Database")
            projectDatbase = Mongodb("Project Database")

    users >> frontend >> gateway
    gateway >> ChatGPTInterface >> ChatGPT
    gateway >> userAPI >> userDatabase
    gateway >> editorAPI >> queue
    # queue >> fileOperationsAPI >> gitlab
    fileOperationsAPI << queue
    fileOperationsAPI >> gitlab
    queue >> metadataAPI >> projectDatbase
