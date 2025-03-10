import subprocess
import os
import base64
import openai

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Depends
from pydantic import BaseModel
from supabase import create_client
from backgroundremover.bg import remove

load_dotenv()

SUPABASE_URL=os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY=os.environ.get("SUPABASE_SERVICE_KEY")

OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY");
SWIFTBITE_API_KEY=os.environ.get("SWIFTBITE_API_KEY")

app = FastAPI()
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

os.makedirs("./.tmp", exist_ok=True)
openai.api_key = OPENAI_API_KEY;

class GenerateRequest(BaseModel):
    uuid: str
    title: str

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != SWIFTBITE_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

def generate_icon(title: str) -> bytes:
    prompt = (f"prompt the text to Dall-e exactly, with no modifications: high quality simple and minimal 3d render, feature ${title}, made of plasticine, on a plain white background, perfect and simple composition, realistic and bright color palette, rendered with octane and global illumination, ambient occlusion, ray tracing and color mapping")

    response = openai.Image.create(
        prompt=prompt,
        size="1024x1024",
        model="dall-e-3",
        response_format="b64_json",
    )

    response_base64 = response["data"][0]["b64_json"]
    response_bytes = base64.b64decode(response_base64)

    return response_bytes

def process_with_imagemagick(uuid: str) -> None:
    path_transparent = f"./.tmp/{uuid}-transparent"
    path_trimmed = f"./.tmp/{uuid}-trimmed"
    path_feathered = f"./.tmp/{uuid}-feathered"
    path_final = f"./.tmp/{uuid}"
    path_mask = f"./.tmp/{uuid}-mask"

    # Trim transparent areas
    trim_cmd = [
        "convert",
        path_transparent,
        "-fuzz", "4%",
        "-trim",
        path_trimmed,
    ]

    subprocess.run(trim_cmd, check=True)

    # Create a blurred alpha mask to feather the edges
    mask_cmd = [
        "convert",
        path_trimmed,
        "-alpha", "extract",
        "-blur", "0x8",
        "-threshold", "50%",
        path_mask,
    ]

    subprocess.run(mask_cmd, check=True)

    # Apply the mask to create feathering while keeping transparency
    feather_cmd = [
        "convert",
        path_trimmed,
        path_mask,
        "-alpha", "off",
        "-compose", "Copy_Opacity",
        "-composite",
        path_feathered,
    ]

    subprocess.run(feather_cmd, check=True)

    # Resize to 128x128 while preserving transparency
    resize_cmd = [
        "convert",
        path_feathered,
        "-resize", "128x128",
        path_final,
    ]

    subprocess.run(resize_cmd, check=True)

def upload_icon(filename: str, bytes: bytes) -> None:
    storage = supabase.storage.from_("icon")
    storage.upload(filename, bytes, {"content-type": "image/png"})

    print(f"Uploaded {filename} to Supabase storage.")

@app.get("/")
async def root():
    return {}

@app.post("/generate-icon")
async def generate_endpoint(
    request: GenerateRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    try:
        # Step 1: Generate the icon using OpenAI
        icon_bytes = generate_icon(request.title)
        icon_path = f"./.tmp/{request.uuid}-original"

        with open(icon_path, "wb") as f:
            f.write(icon_bytes)

        # Step 2: Remove the background using the BackgroundRemover library
        transparent_memory = remove(icon_bytes, "u2net")
        transparent_bytes = bytes(transparent_memory)
        transparent_path = f"./.tmp/{request.uuid}-transparent"
        
        with open(transparent_path, "wb") as f:
            f.write(transparent_bytes)

        # Step 3: Process the image with ImageMagick (trim and resize)
        process_with_imagemagick(request.uuid)

        # Upload the final resized image
        mask_path = f"./.tmp/{request.uuid}-mask"
        final_path = f"./.tmp/{request.uuid}"
        trimmed_path = f"./.tmp/{request.uuid}-trimmed"
        feathered_path = f"./.tmp/{request.uuid}-feathered"

        with open(final_path, "rb") as f:
            upload_icon(request.uuid, f.read())

        with open(mask_path, "rb") as f:
            mask_bytes = f.read()

        with open(trimmed_path, "rb") as f:
            trimmed_bytes = f.read()

        with open(feathered_path, "rb") as f:
            feathered_bytes = f.read()

        # Upload the remaining images in the background
        background_tasks.add_task(upload_icon, f"{request.uuid}-mask", mask_bytes)
        background_tasks.add_task(upload_icon, f"{request.uuid}-original", icon_bytes)
        background_tasks.add_task(upload_icon, f"{request.uuid}-trimmed", trimmed_bytes)
        background_tasks.add_task(upload_icon, f"{request.uuid}-feathered", feathered_bytes)
        background_tasks.add_task(upload_icon, f"{request.uuid}-transparent", transparent_bytes)
        
        background_tasks.add_task(os.remove, icon_path)
        background_tasks.add_task(os.remove, mask_path)
        background_tasks.add_task(os.remove, final_path)
        background_tasks.add_task(os.remove, trimmed_path)
        background_tasks.add_task(os.remove, feathered_path)
        background_tasks.add_task(os.remove, transparent_path)

        return {};
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))