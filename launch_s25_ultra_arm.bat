@echo off
setlocal

REM Set paths to local standalone SDK
set "SCRIPT_DIR=%~dp0"
set "SDK_ROOT=%SCRIPT_DIR%android_sdk"
set "ANDROID_HOME=%SDK_ROOT%"
set "ANDROID_SDK_ROOT=%SDK_ROOT%"
set "ANDROID_USER_HOME=%SDK_ROOT%\.android"
set "ANDROID_AVD_HOME=%SDK_ROOT%\.android\avd"

set "EMULATOR=%SDK_ROOT%\emulator\qemu\windows-x86_64\qemu-system-aarch64.exe"

echo Launching S25 Ultra (ARM64 Native)...
set "PATH=%SDK_ROOT%\emulator\lib64;%SDK_ROOT%\emulator\lib64\qt\lib;%PATH%"

"%EMULATOR%" -avd S25_Ultra_ARM -dns-server 8.8.8.8,8.8.4.4 -no-audio

endlocal
