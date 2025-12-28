import os
import glob

def find_usages():
    # Get all images
    images_dir = r"e:\FSWD\E-Commerce-Frontend\public\images\home"
    images = [f for f in os.listdir(images_dir) if os.path.isfile(os.path.join(images_dir, f))]
    
    # Source dir
    src_dir = r"e:\FSWD\E-Commerce-Frontend\src"
    
    usages = {img: 0 for img in images}
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.tsx', '.ts', '.css')):
                with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for img in images:
                        if img in content:
                            usages[img] += 1
                            
    print("USAGES:")
    for img, count in usages.items():
        print(f"{img}: {count}")

find_usages()
