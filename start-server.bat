@echo off
echo ===================================================
echo   TITAN FORGE(TM) - Ultra-Performance Athletic Club
echo ===================================================
echo Starting local web server on port 3000...
start http://localhost:3000
python -m http.server 3000
pause
