import os
import sys
import subprocess
import json
import math

# ── AUTOCONFIG: Auto-install dependencies if missing ──
REQUIRED_PACKAGES = ["opencv-python", "Pillow", "supabase"]
for package in REQUIRED_PACKAGES:
    try:
        if package == "opencv-python":
            import cv2
        elif package == "Pillow":
            from PIL import Image
        elif package == "supabase":
            import supabase
        else:
            __import__(package)
    except ImportError:
        print(f"Installing missing dependency: {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

import cv2
import numpy as np
from PIL import Image
from supabase import create_client

# ── CONFIGURATION ──
VIDEO_DIR = r"C:\Users\sebas\OneDrive\Escritorio\Videos YPF FULL"
OUTPUT_DIR = r"c:\YPF - El Puente\ypf-el-puente\public\assets\ypf imagenes\extraidas"
ENV_PATH = r"c:\YPF - El Puente\ypf-el-puente\.env.local"

# ── SUPABASE CLIENT ──
def get_supabase_client():
    if not os.path.exists(ENV_PATH):
        print(f"Error: env file not found at {ENV_PATH}")
        return None
    
    env_vars = {}
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip().replace('"', '').replace("'", "")
                
    url = env_vars.get("NEXT_PUBLIC_SUPABASE_URL")
    key = env_vars.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("Missing Supabase credentials in env file")
        return None
        
    return create_client(url, key)

def get_db_products(supabase_client):
    try:
        res = supabase_client.table("productos").select("codigo_plu, nombre, categoria_slug").execute()
        return res.data
    except Exception as e:
        print(f"Error reading products from database: {e}")
        return []

# ── MATCHING LOGIC ──
def find_matching_product(filename, db_products):
    clean_filename = filename.lower().replace("_", " ").replace("-", " ")
    best_match = None
    max_score = 0
    
    for p in db_products:
        name_words = p["nombre"].lower().split()
        score = 0
        for word in name_words:
            if len(word) > 3 and word in clean_filename:
                score += 1
        
        if score > max_score:
            max_score = score
            best_match = p
            
    return best_match if max_score > 0 else None

# ── INTELLIGENT OBJECT DETECTION (CONTOURS) ──
def detect_and_crop_products(frame, min_area=15000, max_area_ratio=0.7):
    """
    Analyzes the frame, detects high-contrast objects (like products on digital screens),
    and crops them dynamically with bounding boxes and safety paddings.
    """
    h, w, _ = frame.shape
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Apply bilateral filter to preserve edges while smoothing flat areas
    blurred = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Use Otsu's thresholding + Adaptive thresholding to segment candidate objects
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Clean up small noise with morphological operations (Closing/Opening)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    opened = cv2.morphologyEx(closed, cv2.MORPH_OPEN, kernel)
    
    # Find external contours
    contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    crops = []
    max_area = h * w * max_area_ratio
    
    for idx, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue
            
        x, y, w_box, h_box = cv2.boundingRect(cnt)
        
        # Filter by aspect ratio to skip very long lines or screen dividers
        aspect_ratio = float(w_box) / h_box
        if aspect_ratio < 0.2 or aspect_ratio > 5.0:
            continue
            
        # Filter by absolute width/height bounds
        if w_box < 100 or h_box < 100:
            continue
            
        # Add safety padding around the object
        pad = int(min(w_box, h_box) * 0.1) # 10% padding
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(w, x + w_box + pad)
        y2 = min(h, y + h_box + pad)
        
        crop = frame[y1:y2, x1:x2]
        if crop.size > 0:
            crops.append({
                "image": crop,
                "bbox": (x1, y1, x2 - x1, y2 - y1),
                "area": area
            })
            
    # Sort crops from left to right based on X coordinate of bounding box
    crops.sort(key=lambda c: c["bbox"][0])
    return crops

# ── PROCESS VIDEO ──
def process_video(video_path, db_products):
    video_name = os.path.basename(video_path)
    print(f"\n=========================================")
    print(f"Processing video: {video_name}...")
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        return
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration_sec = total_frames / fps if fps > 0 else 0
    
    print(f"- FPS: {fps:.2f} | Total Frames: {total_frames} | Duration: {duration_sec:.1f}s")
    
    matched_prod = find_matching_product(video_name, db_products)
    prefix = matched_prod["nombre"].replace("/", "-").replace(" ", "_") if matched_prod else os.path.splitext(video_name)[0]
    plu_code = matched_prod["codigo_plu"] if matched_prod else "GENERIC"
    
    # Extract frames every 3 seconds to ensure diverse screenshots
    interval_frames = int(fps * 3) if fps > 0 else 45
    
    frame_idx = 0
    extracted_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_idx % interval_frames == 0:
            time_sec = frame_idx / fps if fps > 0 else 0
            time_tag = f"{time_sec:.1f}s".replace(".", "-")
            
            # 1. Save full frame
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_full = Image.fromarray(frame_rgb)
            full_name = f"{plu_code}_{prefix}_{time_tag}_completo.jpg"
            pil_full.save(os.path.join(OUTPUT_DIR, full_name), "JPEG", quality=85)
            extracted_count += 1
            
            # 2. Extract intelligent crops of products
            product_crops = detect_and_crop_products(frame)
            
            for c_idx, crop_data in enumerate(product_crops):
                crop_img = crop_data["image"]
                crop_rgb = cv2.cvtColor(crop_img, cv2.COLOR_BGR2RGB)
                pil_crop = Image.fromarray(crop_rgb)
                
                # Naming: [PLU]_[PRODUCT-NAME]_[TIME]_recorte-[INDEX].jpg
                crop_name = f"{plu_code}_{prefix}_{time_tag}_recorte-{c_idx+1}.jpg"
                pil_crop.save(os.path.join(OUTPUT_DIR, crop_name), "JPEG", quality=90)
                extracted_count += 1
                
                print(f"  + Extracted product crop #{c_idx+1} at {time_sec:.1f}s (BBox: {crop_data['bbox']})")
                
        frame_idx += 1
        
    cap.release()
    print(f"Finished {video_name}. Saved {extracted_count} images (including intelligent product cuts).")

def main():
    if not os.path.exists(VIDEO_DIR):
        print(f"Error: Video directory does not exist: {VIDEO_DIR}")
        print("Please check if the OneDrive folder path is correct.")
        return
        
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Connect to Supabase
    client = get_supabase_client()
    db_products = get_db_products(client) if client else []
    print(f"Database products loaded: {len(db_products)}")
    
    # Scan for video files
    extensions = (".mp4", ".mov", ".avi", ".mkv", ".webm")
    video_files = [f for f in os.listdir(VIDEO_DIR) if f.lower().endswith(extensions)]
    
    if not video_files:
        print(f"No video files found in {VIDEO_DIR}")
        return
        
    print(f"Found {len(video_files)} videos to process.")
    for vf in video_files:
        video_path = os.path.join(VIDEO_DIR, vf)
        process_video(video_path, db_products)
        
    print(f"\n=========================================")
    print(f"All extractions complete! Recalled images saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
