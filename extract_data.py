import docx
import json
import os

def extract_data_from_docx(docx_path):
    doc = docx.Document(docx_path)
    data = []
    id_counter = 1

    for table in doc.tables:
        for row in table.rows[1:]:  # Skip the header row
            is_bold = any(run.bold for cell in row.cells for paragraph in cell.paragraphs for run in paragraph.runs)
            si_no = row.cells[3].text.strip()
            confirmed_by = row.cells[5].text.strip()
            is_checked = bool(confirmed_by) or "." in si_no
            row_data = {
                'id': id_counter,
                'hrs': row.cells[0].text.strip(),
                'mins': row.cells[1].text.strip(),
                'sec': row.cells[2].text.strip(),
                'si.no': si_no,
                'activity_name': row.cells[4].text.strip(),
                'confirmed_by': confirmed_by,
                'is_bold': is_bold,
                'is_checked': is_checked
            }
            data.append(row_data)
            id_counter += 1

    return data

if __name__ == "__main__":
    docx_path = input("Please provide the path to the Word document: ")
    activities = extract_data_from_docx(docx_path)
    
    output_path = os.path.join('backend', 'activities.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(activities, f, indent=4)

    print(f"Data extracted and saved to {output_path}")
