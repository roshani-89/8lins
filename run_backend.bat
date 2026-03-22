@echo off
cd /d d:\version6car\8lines\backend
.\venv\Scripts\python.exe -m pip install setuptools==69.5.1 -q
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
