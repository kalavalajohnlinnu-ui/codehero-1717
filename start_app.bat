@echo off
title PythonMastery Studio
cd /d "%~dp0"
echo ========================================================
echo    PythonMastery Studio - Zero to Hero Python Web App
echo ========================================================
echo.
echo Starting application server...
start http://127.0.0.1:5173/
cmd.exe /c "npm.cmd run dev -- --host 127.0.0.1 --port 5173"
pause
