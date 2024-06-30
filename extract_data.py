import docx
import json
import os
import sys
from tkinter import Tk
from tkinter.filedialog import askopenfilename

def extract_data_from_docx(docx_path):
    doc = docx.Document(docx_path)
    data = []
    id_counter = 1
    
    for table in doc.tables:
        for row in table.rows[1:]:  # Skip the header row
            row_data = {
                'id': id_counter,
                'hrs': row.cells[0].text.strip(),
                'mins': row.cells[1].text.strip(),
                'sec': row.cells[2].text.strip(),
                'si.no': row.cells[3].text.strip(),
                'activity_name': row.cells[4].text.strip(),
                'confirmed_by': row.cells[5].text.strip()
            }
            data.append(row_data)
            id_counter += 1
    
    return data

if __name__ == "__main__":
    if len(sys.argv) != 2:
        # Hide the main tkinter window
        Tk().withdraw()
        docx_path = askopenfilename(
            title="Select DOCX File",
            filetypes=(("Word files", "*.docx"), ("All files", "*.*"))
        )

        if not docx_path:
            print("No file selected. Exiting.")
            sys.exit(1)
    else:
        docx_path = sys.argv[1]

    if not os.path.exists(docx_path):
        print(f"Error: The file {docx_path} does not exist.")
        sys.exit(1)

    activities = extract_data_from_docx(docx_path)
    
    output_dir = 'backend'
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'activities.json')
    
    with open(output_path, 'w') as f:
        json.dump(activities, f, indent=4)

    print(f"Data extracted and saved to {output_path}")
