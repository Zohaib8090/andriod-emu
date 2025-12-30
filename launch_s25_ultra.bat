@echo off
setlocal

REM Set paths to local standalone SDK
set "SCRIPT_DIR=%~dp0"
set "SDK_ROOT=%SCRIPT_DIR%android_sdk"
set "ANDROID_HOME=%SDK_ROOT%"
set "ANDROID_SDK_ROOT=%SDK_ROOT%"
set "ANDROID_USER_HOME=%SDK_ROOT%\.android"
set "ANDROID_AVD_HOME=%SDK_ROOT%\.android\avd"

set "EMULATOR=%SDK_ROOT%\emulator\emulator.exe"

if not exist "%EMULATOR%" (
    echo Emulator not found! Please run setup_s25_ultra.ps1 first.
    pause
    exit /b
)

echo Launching S25 Ultra (Standalone)...
echo Skin: %SCRIPT_DIR%skins\S25Ultra
"%EMULATOR%" -avd S25_Ultra_Simulator -dns-server 8.8.8.8,8.8.4.4

endlocal
