from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.query import Query
import os
from PIL import Image, ImageFilter
import requests
import json
from io import BytesIO

def main(context):
    
    client = (
        Client()
            .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
            .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
            .set_key(context.req.headers["x-appwrite-key"])
    )

    tablesDB = TablesDB(client)

    if context.req.path == "/game":

        response = tablesDB.list_rows(
            database_id = "6931cde4003199800b9d",
            table_id = "games",
            queries = [
                Query.greater_than("total-reviews", 1500), 
                Query.order_random(), 
                Query.limit(1)
            ]
        )

        context.log(response)

        return context.res.json(
            json.dumps(response["rows"][0]), 200, {
                # "Access-Control-Allow-Origin": "https://steam-guesser.appwrite.network",
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
        })

    elif context.req.path == "/image":
        
        try:
            rowId = context.req.query["id"]
        except KeyError:
            rowId = "693a3e77785892a9c4d5"

        response = tablesDB.list_rows(
            database_id = "6931cde4003199800b9d",
            table_id = "games",
            queries = [Query.select(["image-url"]), Query.equal("$id", [rowId])]
        )
        url = response["rows"][0]["image-url"]

        response = requests.get(url)

        with Image.open(BytesIO(response.content)) as im:
            im = im.filter(ImageFilter.GaussianBlur(radius=50))
            output = BytesIO()
            im.save(output, format='JPEG')
            return context.res.binary(output.getvalue(), 200, {
                'content-type': 'image/jpeg',
                # "Access-Control-Allow-Origin": "https://steam-guesser.appwrite.network",
                'Access-Control-Allow-Origin': '*',
            })
    else:
        return context.res.empty()
    # response = tablesDB.list_rows(
    #     database_id = "6931cde4003199800b9d",
    #     table_id = "games",
    #     queries = [Query.order_desc("$createdAt"), Query.limit(1)]
    # )
    # context.log(response["rows"][0]["image-url"])
