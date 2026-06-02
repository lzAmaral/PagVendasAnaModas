from PIL import Image
import shutil
import os

def crop_logo():
    logo_path = 'public/logo.png'
    backup_path = 'public/logo_original.png'
    
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found.")
        return

    # Backup original
    if not os.path.exists(backup_path):
        shutil.copy(logo_path, backup_path)
        print("Created backup of original logo.")

    # Open image
    img = Image.open(logo_path).convert("RGBA")
    width, height = img.size
    pix = img.load()

    # Determine background (white/transparent) vs foreground
    # We will make any white or near-white pixels completely transparent
    for y in range(height):
        for x in range(width):
            r, g, b, a = pix[x, y]
            # If color is white/near-white or alpha is low
            if (r > 240 and g > 240 and b > 240) or a < 10:
                pix[x, y] = (255, 255, 255, 0)

    # Get bounding box of non-transparent content
    bbox = img.getbbox()
    if bbox:
        # Add some padding around the cropped box so it doesn't touch the edges completely
        padding = 20
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save(logo_path)
        print(f"Logo cropped successfully! Old size: {img.size}, New size: {cropped_img.size}")
    else:
        print("Could not find any non-white/non-transparent content to crop.")

if __name__ == '__main__':
    crop_logo()
