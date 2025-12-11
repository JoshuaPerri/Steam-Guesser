from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.query import Query
import os
from PIL import Image, ImageFilter
import requests
from io import BytesIO

def main(context):
    
    # Set project and set API key
    client = (
        Client()
            .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
            .set_key(context.req.headers["x-appwrite-key"])
    )

    tablesDB = TablesDB(client)
    response = tablesDB.list_rows(
        database_id = "6931cde4003199800b9d",
        table_id = "games",
        queries = [Query.order_desc("$createdAt"), Query.limit(1)]
    )
    context.log(response["rows"][0]["image-url"])
    # try:
    #     tablesDB.create_row(
    #         database_id="<DATABASE_ID>",
    #         table_id="<TABLE_ID>",
    #         row_id=ID.unique(),
    #         data={}
    #     )
    # except Exception as e:
    #     context.error("Failed to create row: " + e.message)
    #     return context.response.text("Failed to create row")

    # return context.response.text("Row created")
    
    
    
    
    
    
    
    response = requests.get("https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg")

    with Image.open(BytesIO(response.content)) as im:
        im = im.filter(ImageFilter.GaussianBlur(radius=50))
        output = BytesIO()
        im.save(output, format='JPEG')
        return context.res.binary(output.getvalue(), 200, {"content-type": "image/jpeg"})

    if context.req.path == "/ping":
        # Use res object to respond with text(), json(), or binary()
        # Don't forget to return a response!
        return context.res.text("Pong")

    return context.res.json(
        {
            "motto": "Build like a team of hundreds_",
            "learn": "https://appwrite.io/docs",
            "connect": "https://appwrite.io/discord",
            "getInspired": "https://builtwith.appwrite.io"
        }
    )