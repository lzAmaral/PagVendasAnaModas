import sys
import os

try:
    import pypdf
    print("pypdf is installed")
except ImportError:
    print("pypdf is NOT installed. Attempting to install...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf

def extract_pdf_text(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    
    for i, page in enumerate(reader.pages):
        print(f"\n--- PAGE {i + 1} ---")
        text = page.extract_text()
        print(text)

if __name__ == "__main__":
    pdf_path = "/Users/luizamaral/Documents/pagVendasUni/ana-modas/produtos.pdf"
    if os.path.exists(pdf_path):
        extract_pdf_text(pdf_path)
    else:
        print(f"File not found: {pdf_path}")
