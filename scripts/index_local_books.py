import os
import sys
import argparse
import shutil
import json
import re
import math
from pathlib import Path

# Configure UTF-8 encoding for standard output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='ignore')

try:
    import pypdf
except ImportError:
    pypdf = None

SUPPORTED_EXTENSIONS = {'.pdf', '.epub', '.docx', '.pptx', '.djvu'}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB limit per volume for instant 5-second uploads

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def format_file_size(bytes_num):
    if bytes_num >= 1024 * 1024:
        return f"{bytes_num / (1024 * 1024):.1f} MB"
    elif bytes_num >= 1024:
        return f"{bytes_num / 1024:.0f} KB"
    return f"{bytes_num} Bytes"

def parse_metadata(filename):
    stem = Path(filename).stem
    fn_lower = filename.lower()
    
    if 'doran' in fn_lower:
        return 'Bioprocess Engineering Principles', 'Pauline M. Doran'
    if 'stanbury' in fn_lower:
        return 'Principles of Fermentation Technology', 'P.F. Stanbury, A. Whitaker & S.J. Hall'
    if 'himmelblau' in fn_lower:
        return 'Basic Principles and Calculations in Chemical Engineering', 'David M. Himmelblau'
    if 'villadsen' in fn_lower:
        return 'Bioreaction Engineering Principles', 'John Villadsen, Jens Nielsen & Gunnar Lidén'
    if 'waites' in fn_lower:
        return 'Industrial Microbiology: An Introduction', 'M.J. Waites et al.'
    if 'pepper' in fn_lower:
        return 'Environmental Microbiology: A Laboratory Manual', 'Ian L. Pepper'
    if 'steffe' in fn_lower:
        return 'Bioprocessing Pipelines, Rheology and Analysis', 'James Freeman Steffe'
    if 'menon' in fn_lower:
        return 'Piping Calculations Manual', 'Shashi Menon'
    if 'shun_lin' in fn_lower:
        return 'Water and Wastewater Calculations Manual', 'Shun Lin & C. Lee'
    if 'dickenson' in fn_lower:
        return 'Valves, Piping and Pipelines Handbook', 'T.C. Dickenson'
    if 'printgn' in fn_lower:
        return 'Genetics & Molecular Biology Notes', 'Reference Library'
    if 'kingston' in fn_lower:
        return 'ABC of Clinical Genetics', 'Helen M. Kingston'
    if 'passarge' in fn_lower:
        return 'Color Atlas of Genetics', 'Eberhard Passarge'
    if 'maynard smith' in fn_lower:
        return 'Evolutionary Genetics', 'John Maynard Smith'
    if 'brownstein' in fn_lower:
        return 'Functional Genomics', 'Michael J. Brownstein & Arkady B. Khodursky'
    if 'pierce' in fn_lower:
        return 'Genetics: A Conceptual Approach', 'Benjamin A. Pierce'
    if 'weiss' in fn_lower:
        return 'Genetics and the Logic of Evolution', 'Kenneth M. Weiss'
    if 'hartl' in fn_lower:
        return 'Genetics: Principles and Analysis', 'Daniel L. Hartl'
    if 'ridley' in fn_lower:
        return 'Genome: The Autobiography of a Species in 23 Chapters', 'Matt Ridley'
    if 'suhai' in fn_lower:
        return 'Genomics and Proteomics: Functional and Computational Aspects', 'Sándor Suhai'
    if 'starkey' in fn_lower:
        return 'Genomics Protocols', 'Michael P. Starkey & Ramnath Elaswarapu'
    if 'liebler' in fn_lower:
        return 'Introduction to Proteomics: Tools for the New Biology', 'Daniel C. Liebler'
    if 'streips' in fn_lower:
        return 'Modern Microbial Genetics', 'Uldis N. Streips'
    if 'cullis' in fn_lower:
        return 'Plant Genomics and Proteomics', 'Christopher A. Cullis'
    if 'gillespie' in fn_lower:
        return 'Population Genetics: A Concise Guide', 'John H. Gillespie'
    if 'tamarin' in fn_lower:
        return 'Principles of Genetics', 'Robert H. Tamarin'
    if 'albala' in fn_lower:
        return 'Protein Arrays, Biochips, and Proteomics', 'Joanna S. Albala'
    if 'naven' in fn_lower:
        return 'Proteomics in Practice: A Laboratory Manual of Proteome Analysis', 'Tom Naven'
    if 'stansfield' in fn_lower:
        return "Schaum's Outline of Theory and Problems of Genetics", 'William D. Stansfield'
    if 'jang' in fn_lower:
        return 'The Behavioral Genetics of Psychopathology: A Clinical Guide', 'Kerry L. Jang'
    if 'novartis' in fn_lower:
        return 'The Genetics and Biology of Sex Determination', 'Novartis Foundation'
    if 'gina smith' in fn_lower:
        return 'The Genomics Age: How DNA Technology Is Transforming the Way We Live', 'Gina Smith'
    if 'kuby' in fn_lower and '3rd' in fn_lower:
        return 'Immunology (3rd Edition)', 'Janis Kuby'
    if 'kuby' in fn_lower:
        return 'Kuby Immunology', 'Janis Kuby et al.'
    if 'fundamental immunology' in fn_lower or 'paul' in fn_lower:
        return 'Fundamental Immunology', 'William E. Paul'
    if 'really essential' in fn_lower:
        return 'Really Essential Immunology', 'Ivan Roitt & Arthur Rabson'
    if 'essential immunology' in fn_lower or 'roitt' in fn_lower:
        return "Roitt's Essential Immunology (10th Edition)", 'Ivan Roitt & Peter Delves'

    if ' - ' in stem:
        parts = stem.split(' - ')
        title = parts[0].replace('_', ' ').strip()
        author = ' - '.join(parts[1:]).replace('_', ' ').strip()
    else:
        title = stem.replace('_', ' ').strip()
        author = "Reference Library"
    
    title = re.sub(r'\s+', ' ', title)
    author = re.sub(r'\s+', ' ', author)
    return title, author

def process_and_index_folder(source_folder, category_name, pdf_only=False):
    source_path = Path(source_folder)
    if not source_path.exists():
        print(f"Error: Source directory '{source_folder}' does not exist.")
        return []

    category_slug = slugify(category_name)
    dest_dir = Path("public/assets/books") / category_slug
    dest_dir.mkdir(parents=True, exist_ok=True)

    allowed_exts = {'.pdf'} if pdf_only else SUPPORTED_EXTENSIONS

    print(f"\nScanning '{source_folder}' for category '{category_name}'...")
    print(f"Filter: {'PDF files only' if pdf_only else 'All supported formats'}")
    print(f"Destination directory: '{dest_dir}'\n")

    new_indexed_items = []

    for file_item in sorted(source_path.iterdir()):
        if file_item.is_dir() or file_item.suffix.lower() not in allowed_exts:
            continue

        file_size = file_item.stat().st_size
        filename = file_item.name
        ext = file_item.suffix.lower()
        title, author = parse_metadata(filename)

        # Large PDF splitting safeguard (> 15MB)
        if ext == '.pdf' and file_size > MAX_FILE_SIZE_BYTES and pypdf:
            print(f"[Large PDF] {filename} ({format_file_size(file_size)}). Splitting into volume chunks (< 15MB)...")
            reader = pypdf.PdfReader(str(file_item))
            total_pages = len(reader.pages)
            num_vols = max(2, math.ceil(file_size / (6 * 1024 * 1024)))
            pages_per_vol = total_pages // num_vols

            for v in range(num_vols):
                start_p = v * pages_per_vol
                end_p = total_pages if v == num_vols - 1 else (v + 1) * pages_per_vol
                vol_name = f"{file_item.stem} (Vol {v+1}).pdf"
                vol_dest = dest_dir / vol_name

                writer = pypdf.PdfWriter()
                for page_num in range(start_p, end_p):
                    writer.add_page(reader.pages[page_num])

                with open(vol_dest, "wb") as out_f:
                    writer.write(out_f)

                vol_size = vol_dest.stat().st_size
                item_id = slugify(f"{vol_name}-{category_slug}")
                vol_title = f"{title} (Vol {v+1})"

                new_indexed_items.append({
                    "id": item_id,
                    "title": vol_title,
                    "filename": vol_name,
                    "format": "PDF",
                    "file_size": format_file_size(vol_size),
                    "bytes": vol_size,
                    "category": category_name,
                    "author": author,
                    "file_path": f"/assets/books/{category_slug}/{vol_name}"
                })
                print(f"  + Created volume: {vol_name} ({format_file_size(vol_size)})")
        else:
            dest_file = dest_dir / filename
            shutil.copy2(str(file_item), str(dest_file))
            item_id = slugify(f"{filename}-{category_slug}")
            format_str = ext.replace('.', '').upper()

            new_indexed_items.append({
                "id": item_id,
                "title": title,
                "filename": filename,
                "format": format_str,
                "file_size": format_file_size(file_size),
                "bytes": file_size,
                "category": category_name,
                "author": author,
                "file_path": f"/assets/books/{category_slug}/{filename}"
            })
            print(f"  + Indexed: {filename} ({format_file_size(file_size)})")

    # Update Registry Files
    json_paths = [
        Path("data/extra_books.json"),
        Path("lib/data/extra_books.json"),
        Path("src/data/extra_books.json")
    ]

    for json_p in json_paths:
        json_p.parent.mkdir(parents=True, exist_ok=True)
        existing_data = []

        if json_p.exists():
            try:
                with open(json_p, "r", encoding="utf-8") as f:
                    existing_data = json.load(f)
            except Exception:
                existing_data = []

        existing_ids = {item["id"] for item in existing_data}
        combined = list(existing_data)

        for item in new_indexed_items:
            if item["id"] not in existing_ids:
                combined.append(item)
                existing_ids.add(item["id"])
            else:
                combined = [item if old["id"] == item["id"] else old for old in combined]

        with open(json_p, "w", encoding="utf-8") as f:
            json.dump(combined, f, indent=2, ensure_ascii=False)

        print(f"SUCCESS: Registry updated at '{json_p}' with {len(combined)} items.")

    return new_indexed_items

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Index local books into BioConnect Extra Books section.")
    parser.add_argument("--source", type=str, default=r"E:\e books\Bioinformatics", help="Target local folder path")
    parser.add_argument("--category", type=str, default="Bioinformatics", help="Category tag for books")
    parser.add_argument("--only-pdf", action="store_true", help="Only index PDF files")

    args = parser.parse_args()

    source_p = args.source
    if not os.path.exists(source_p) and os.path.exists(r"E:\Bioinformatics"):
        source_p = r"E:\Bioinformatics"

    process_and_index_folder(source_p, args.category, pdf_only=args.only_pdf)
