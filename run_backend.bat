@echo off
cd /d d:\version6car\8lines\backend
C:\Users\dell\AppData\Local\Programs\Python\Python312\python.exe -m pip install --upgrade setuptools -q
C:\Users\dell\AppData\Local\Programs\Python\Python312\python.exe -m uvicorn main:app --port 8000
