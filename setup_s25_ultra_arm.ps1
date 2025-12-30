<#
.SYNOPSIS
    Automated Setup for Samsung S25 Ultra Emulator (ARM64 Version)
.DESCRIPTION
    Creates an ARM64-based AVD.
    WARNING: THIS WILL BE VERY SLOW ON INTEL/AMD COMPUTERS.
#>

$ScriptDir = $PSScriptRoot
$SDK_ROOT = "$ScriptDir\android_sdk"
$env:ANDROID_HOME = $SDK_ROOT
$env:ANDROID_SDK_ROOT = $SDK_ROOT
$env:ANDROID_USER_HOME = "$SDK_ROOT\.android"

$SDKMANAGER = "$SDK_ROOT\cmdline-tools\latest\bin\sdkmanager.bat"
$AVDMANAGER = "$SDK_ROOT\cmdline-tools\latest\bin\avdmanager.bat"

# Image package to install - ARM64 Version (Android 11 / API 30 is more stable for emu)
$PACKAGE_ID = "system-images;android-33;google_apis_playstore;arm64-v8a"

Write-Host "Installing ARM64 System Image (This is large)..."
echo "y" | & $SDKMANAGER --install $PACKAGE_ID | Out-Null

$AVD_NAME = "S25_Ultra_ARM"
Write-Host "Creating AVD: $AVD_NAME..."
echo "no" | & $AVDMANAGER create avd -n $AVD_NAME -k $PACKAGE_ID -f

# Patch Config
$AVD_PATH = "$env:ANDROID_USER_HOME\avd\$AVD_NAME.avd"
$CONFIG_INI = "$AVD_PATH\config.ini"

if (Test-Path $CONFIG_INI) {
    Write-Host "Patching S25 Ultra Specs (ARM)..."
    $Content = Get-Content $CONFIG_INI
    
    function Set-IniKey {
        param($Content, $Key, $Value)
        if ($Content -match "^$Key=") {
            return $Content -replace "^$Key=.*", "$Key=$Value"
        } else {
            return $Content + "$Key=$Value"
        }
    }

    $Content = Set-IniKey -Content $Content -Key "PlayStore.enabled" -Value "yes"
    $Content = Set-IniKey -Content $Content -Key "avd.ini.displayname" -Value "S25 Ultra (ARM)"
    $Content = Set-IniKey -Content $Content -Key "hw.lcd.height" -Value "3120"
    $Content = Set-IniKey -Content $Content -Key "hw.lcd.width" -Value "1440"
    $Content = Set-IniKey -Content $Content -Key "hw.lcd.density" -Value "500"
    $Content = Set-IniKey -Content $Content -Key "hw.ramSize" -Value "8192" # 8GB for ARM to be safe
    $Content = Set-IniKey -Content $Content -Key "disk.dataPartition.size" -Value "64G"
    
    $Content | Set-Content $CONFIG_INI
}

Write-Host "Setup Complete!"
Write-Host "Launch with: .\launch_s25_ultra_arm.bat"
