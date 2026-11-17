@echo off
title Hospital Emergency Management System (HEMS)
color 0B
cls
echo ===============================================================================
echo                   HOSPITAL EMERGENCY MANAGEMENT SYSTEM (HEMS)
echo ===============================================================================
echo.
echo [*] Compiling main.c using MinGW GCC...
gcc -Wall -Wextra -std=c99 -O2 -o hems.exe main.c

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Compilation failed! Please check if gcc is added to PATH.
    pause
    exit /b %ERRORLEVEL%
)

echo [*] Compilation completed successfully: hems.exe
echo.
echo Press any key to run Hospital Emergency Management System...
pause >nul
cls
.\hems.exe
echo.
echo Program finished execution.
pause
