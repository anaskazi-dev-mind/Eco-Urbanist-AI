"""
Create Test Images for API Testing
Generates sample building masks and satellite images
"""

import numpy as np
import cv2
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


def create_building_mask(size=256, save_path="data/test/building_mask.png"):
    """Create a simple building footprint mask"""
    # Create white background
    img = np.ones((size, size, 3), dtype=np.uint8) * 255
    
    # Draw black rectangles representing buildings
    # Building 1 (large)
    cv2.rectangle(img, (50, 50), (150, 150), (0, 0, 0), -1)
    
    # Building 2 (medium)
    cv2.rectangle(img, (170, 60), (230, 120), (0, 0, 0), -1)
    
    # Building 3 (small)
    cv2.rectangle(img, (80, 170), (140, 220), (0, 0, 0), -1)
    
    # Building 4 (tall)
    cv2.rectangle(img, (180, 150), (220, 230), (0, 0, 0), -1)
    
    # Save
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(save_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    
    print(f"✅ Created building mask: {save_path}")
    return save_path


def create_satellite_image(size=256, green_percentage=60, save_path="data/test/satellite_green.png"):
    """Create a synthetic satellite image with greenery"""
    # Create base image
    img = np.zeros((size, size, 3), dtype=np.uint8)
    
    # Background (urban/concrete - gray)
    img[:, :] = [120, 120, 120]
    
    # Add green patches (vegetation)
    num_green_pixels = int(size * size * green_percentage / 100)
    
    # Random green patches
    for _ in range(num_green_pixels // 100):
        x = np.random.randint(0, size - 20)
        y = np.random.randint(0, size - 20)
        w = np.random.randint(10, 30)
        h = np.random.randint(10, 30)
        
        # Different shades of green
        green_shade = np.random.randint(80, 180)
        img[y:y+h, x:x+w] = [30, green_shade, 30]  # RGB green
    
    # Add some variation (trees, grass)
    for _ in range(50):
        x = np.random.randint(5, size - 5)
        y = np.random.randint(5, size - 5)
        radius = np.random.randint(3, 8)
        green_val = np.random.randint(100, 200)
        cv2.circle(img, (x, y), radius, (20, green_val, 40), -1)
    
    # Save
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(save_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    
    print(f"✅ Created satellite image ({green_percentage}% green): {save_path}")
    return save_path


def create_urban_image(size=256, save_path="data/test/satellite_urban.png"):
    """Create an urban satellite image with minimal greenery"""
    img = np.zeros((size, size, 3), dtype=np.uint8)
    
    # Concrete/asphalt base
    img[:, :] = [100, 100, 100]
    
    # Buildings (darker)
    for _ in range(15):
        x = np.random.randint(0, size - 40)
        y = np.random.randint(0, size - 40)
        w = np.random.randint(20, 50)
        h = np.random.randint(20, 50)
        gray_val = np.random.randint(60, 90)
        img[y:y+h, x:x+w] = [gray_val, gray_val, gray_val]
    
    # Very few green areas (5%)
    for _ in range(10):
        x = np.random.randint(5, size - 5)
        y = np.random.randint(5, size - 5)
        radius = np.random.randint(2, 5)
        img[y-radius:y+radius, x-radius:x+radius] = [30, 120, 30]
    
    # Save
    Path(save_path).parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(save_path, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    
    print(f"✅ Created urban image (low green): {save_path}")
    return save_path


def create_test_dataset():
    """Create a complete test dataset"""
    print("=" * 60)
    print("Creating Test Images Dataset")
    print("=" * 60)
    
    # Create test directory
    test_dir = Path("data/test")
    test_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate images
    print("\n📸 Generating test images...\n")
    
    mask1 = create_building_mask(256, "data/test/building_mask_1.png")
    mask2 = create_building_mask(256, "data/test/building_mask_2.png")
    
    sat1 = create_satellite_image(256, 60, "data/test/satellite_high_green.png")
    sat2 = create_satellite_image(256, 30, "data/test/satellite_medium_green.png")
    sat3 = create_urban_image(256, "data/test/satellite_low_green.png")
    
    print("\n" + "=" * 60)
    print("✅ Test Dataset Created Successfully!")
    print("=" * 60)
    print(f"\n📁 Location: {test_dir.absolute()}\n")
    print("Files created:")
    print("  • building_mask_1.png")
    print("  • building_mask_2.png")
    print("  • satellite_high_green.png (60% green)")
    print("  • satellite_medium_green.png (30% green)")
    print("  • satellite_low_green.png (5% green)")
    print("\n🧪 Ready for API testing!")
    print("=" * 60)


if __name__ == "__main__":
    create_test_dataset()