@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing packages, please wait...
  call npm install
)
start "" cmd /c "timeout /t 10 >nul & start http://localhost:3000"
call npm run dev
pause
