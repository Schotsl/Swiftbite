import subprocess
import os
import base64
import requests
import re

from dotenv import load_dotenv
from requests_toolbelt.multipart.encoder import MultipartEncoder
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Depends
from pydantic import BaseModel
from supabase import create_client
from backgroundremover.bg import remove

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
STABILITY_API_KEY = os.environ.get("STABILITY_API_KEY")
SWIFTBITE_API_KEY = os.environ.get("SWIFTBITE_API_KEY")

app = FastAPI()
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

os.makedirs("./.tmp", exist_ok=True)

class GenerateRequest(BaseModel):
    uuid: str
    title: str

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != SWIFTBITE_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

def generate_icon(title: str):
    host = "https://api.stability.ai/v2beta/stable-image/generate/sd3"

    prompt = (f"High-quality, very simple, and minimal 3D render featuring {title} with simple details (since it will be used as an icon), even lighting from every side, crafted from plasticine on an evenly lit white background that contrasts with the subject. A perfect, simple composition with a realistic, bright color palette, rendered with Octane using global illumination, ambient occlusion, ray tracing, and color mapping, captured from a eye-level / side angle, shot at the same level as the subject, creating a natural, relatable perspective.")

    multipart_data = MultipartEncoder(
        fields={
            "model": "sd3.5-large-turbo",
            "prompt": prompt,
            "aspect_ratio": "1:1",
            "style_preset": "isometric",
            "output_format": "png",
            "negative_prompt": "shadows, color labels, decorative elements around the subject (droplets, beans, oils, random greens), colored background, unnecessary details"
        }
    )

    headers = {
        "Accept": "application/json",
        "Content-Type": multipart_data.content_type,
        "Authorization": f"Bearer {STABILITY_API_KEY}",
    }

    response = requests.post(host, headers=headers, data=multipart_data)
    response_json = response.json()

    image = response_json["image"]
    image_bytes = base64.b64decode(image)

    return image_bytes

def process_with_imagemagick(uuid: str) -> None:
    path_transparent = f"./.tmp/{uuid}-transparent"

    path_composite = f"./.tmp/{uuid}-composite"
    path_composite_trimmed = f"./.tmp/{uuid}-composite-trimmed"
    path_composite_trimmed_resized = f"./.tmp/{uuid}-composite-trimmed-resized"

    path_mask = f"./.tmp/{uuid}-mask"
    path_mask_largest = f"./.tmp/{uuid}-mask-largest"

    # First create a simple mask of the image from which we'll isolate the largest component and we'll trim later
    mask_cmd = [
        "convert",
        path_transparent,
        "-alpha", "extract",
        "-blur", "0x2",
        "-threshold", "50%",
        path_mask,
    ]

    subprocess.run(mask_cmd, check=True)

    # Create a list of the components
    components_cmd = [
        "convert",
        path_mask,
        "-define", "connected-components:verbose=true",
        "-connected-components", "8",
        "null:"
    ]

    stderr = subprocess.STDOUT
    output = subprocess.check_output(components_cmd, stderr).decode("utf-8")

    largest_id = None
    largest_area = 0

    for line in output.splitlines():
        # Skip the first line
        if "Objects" in line:
            continue

        # Use regex to capture area and color
        match = re.match(r"\s+(\d+): \d+x\d+\+\d+\+\d+ (\d+\.\d+),\d+\.\d+ (\d+) (.+)", line)

        if match:
            id = int(match.group(1))
            area = int(match.group(3))
            color = match.group(4)
 
            # Skip the background color
            if color == "gray(0)":
                continue

            if area > largest_area:
                largest_id = id
                largest_area = area

    if largest_area is None:
        return

    # Isolate the largest component
    isolate_cmd = [
        "convert",
        path_mask,
        "-define", f"connected-components:keep={largest_id}",
        "-define", "connected-components:mean-color=true",
        "-connected-components", "8",
        path_mask_largest
    ]
    
    # Log output of error if occurs
    subprocess.run(isolate_cmd, check=True)

    # Feather the edges of the mask
    soften_cmd = [
        "convert",
        path_mask_largest,
        "-morphology", "Erode", "Disk:4",
        "-blur", "0x2",
        path_mask_largest,
    ]

    subprocess.run(soften_cmd, check=True)

    # Overlay the mask on the original image
    composite_cmd = [
        "convert",
        path_transparent,
        path_mask_largest,
        "-compose", "copy-opacity",
        "-composite",
        path_composite
    ]
    
    subprocess.run(composite_cmd, check=True)

    # Trim transparent areas but add 8 pixel padding.
    trim_cmd = [
        "convert",
        "-fuzz", "4%",
        "-trim",
        "-border", "8",
        "-bordercolor", "none",
        "+repage",
        path_composite,
        path_composite_trimmed
    ]

    subprocess.run(trim_cmd, check=True)

    # Resize to 128x128 while preserving transparency.
    resize_cmd = [
        "convert",
        path_composite_trimmed,
        "-resize", "128x128",
        path_composite_trimmed_resized
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
        # Step 1: Generate the icon using Stability API.
        icon_bytes = generate_icon(request.title)
        icon_path = f"./.tmp/{request.uuid}-original"

        with open(icon_path, "wb") as f:
            f.write(icon_bytes)

        # Step 2: Remove the background using the BackgroundRemover library.
        transparent_memory = remove(icon_bytes, "u2net")
        transparent_bytes = bytes(transparent_memory)
        transparent_path = f"./.tmp/{request.uuid}-transparent"

        with open(transparent_path, "wb") as f:
            f.write(transparent_bytes)

        # Step 3: Process the image with ImageMagick (trim, isolate largest component, feather, and resize).
        process_with_imagemagick(request.uuid)

        # Upload the final resized image.
        final_path = f"./.tmp/{request.uuid}-composite-trimmed-resized"

        with open(final_path, "rb") as f:
            final_bytes = f.read()

        upload_icon(f"{request.uuid}", final_bytes)

        # Upload the remaining images in the background.
        background_tasks.add_task(upload_icon, f"{request.uuid}-original", icon_bytes)
        background_tasks.add_task(upload_icon, f"{request.uuid}-transparent", transparent_bytes)

        composite_path = f"./.tmp/{request.uuid}-composite"
        composite_trimmed_path = f"./.tmp/{request.uuid}-composite-trimmed"

        mask_path = f"./.tmp/{request.uuid}-mask"
        mask_largest_path = f"./.tmp/{request.uuid}-mask-largest"
        
        background_tasks.add_task(os.remove, icon_path)
        background_tasks.add_task(os.remove, final_path)
        background_tasks.add_task(os.remove, transparent_path)

        background_tasks.add_task(os.remove, composite_path)
        background_tasks.add_task(os.remove, composite_trimmed_path)

        background_tasks.add_task(os.remove, mask_path)
        background_tasks.add_task(os.remove, mask_largest_path)

        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
