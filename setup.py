from cx_Freeze import setup, Executable
import os

# Dependencies are automatically detected, but it might need fine-tuning.
build_exe_options = {
    "packages": ["os", "sys", "docx", "json", "tkinter"],
    "include_files": []
}

# Set the base to None for a console application
base = None

setup(
    name = "WordDocExtractor",
    version = "0.1",
    description = "Extract data from a Word document and save it to JSON",
    options = {"build_exe": build_exe_options},
    executables = [Executable("extract_data.py", base=base)]
)
