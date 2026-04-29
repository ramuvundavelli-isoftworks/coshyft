@echo off
title CoShift Dev

echo Starting CoShift...

start "CoShift Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

start "CoShift Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

start "CoShift Mobile" cmd /k "cd /d %~dp0mobile && npm start"

echo.
echo All three services are starting in separate windows:
echo   Backend  -^> http://localhost:8000
echo   Frontend -^> http://localhost:5173
echo   Mobile   -^> Expo DevTools
echo.
