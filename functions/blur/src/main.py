# from appwrite.client import Client
from PIL import Image, ImageFilter
import requests
from io import BytesIO

def main(context):
    response = requests.get("https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg")

    with Image.open(BytesIO(response.content)) as im:
        im = im.filter(ImageFilter.GaussianBlur(radius=50))
        output = BytesIO()
        im.save(output, format='JPEG')
        return context.res.binary(output.getvalue())

    context.log(context.req.body_text)

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