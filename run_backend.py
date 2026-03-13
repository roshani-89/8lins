import subprocess
import sys
import os

os.chdir(r'd:\version6car\8lines\backend')

python_exe = r'C:\Users\dell\AppData\Local\Programs\Python\Python312\python.exe'

# Upgrade setuptools
subprocess.run([python_exe, '-m', 'pip', 'install', '--upgrade', 'setuptools'])

# Install requirements
subprocess.run([python_exe, '-m', 'pip', 'install', '-r', 'requirements.txt'])

# Run uvicorn
subprocess.run([python_exe, '-m', 'uvicorn', 'main:app', '--port', '8000'])
