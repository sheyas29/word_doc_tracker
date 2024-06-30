from cx_Freeze import setup, Executable
import os
import sys

PYTHON_INSTALL_DIR = os.path.dirname(sys.executable)
os.environ['TCL_LIBRARY'] = os.path.join(PYTHON_INSTALL_DIR, 'tcl', 'tcl8.6')
os.environ['TK_LIBRARY'] = os.path.join(PYTHON_INSTALL_DIR, 'tcl', 'tk8.6')

build_exe_options = {
    "packages": ["os", "sys", "docx", "json", "tkinter"],
    "includes": [],
    "include_files": [
        os.path.join(PYTHON_INSTALL_DIR, "DLLs", "tk86t.dll"),
        os.path.join(PYTHON_INSTALL_DIR, "DLLs", "tcl86t.dll"),
        os.path.join(PYTHON_INSTALL_DIR, "python3.dll"),
        os.path.join(PYTHON_INSTALL_DIR, "vcruntime140.dll"),
        os.path.join(PYTHON_INSTALL_DIR, "python312.dll"),
    ],
}

setup(
    name="extract_data",
    version="0.1",
    description="Extract data from DOCX and convert to JSON",
    options={"build_exe": build_exe_options},
    executables=[Executable("extract_data.py")],
)
