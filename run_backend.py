import subprocess
import sys
import os

os.chdir(r'd:\version6car\8lines\backend')

python_exe = r'.\venv\Scripts\python.exe'

# Pin setuptools (latest versions remove pkg_resources, breaking razorpay 1.4.1)
subprocess.run([python_exe, '-m', 'pip', 'install', 'setuptools==69.5.1'])

# Install requirements
subprocess.run([python_exe, '-m', 'pip', 'install', '-r', 'requirements.txt'])

# Run uvicorn
subprocess.run([python_exe, '-m', 'uvicorn', 'main:app', '--port', '8000'])
