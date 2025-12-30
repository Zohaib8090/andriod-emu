<#
.SYNOPSIS
    Automated Setup for Samsung S25 Ultra Emulator (Standalone / No Studio)
.DESCRIPTION
    This script creates a local, portable Android SDK environment in the './android_sdk' folder.
    It downloads the Command Line Tools, installs the Emulator and System Images, and creates the S25 Ultra AVD.
#>

$ScriptDir = $PSScriptRoot
$SDK_ROOT = "$ScriptDir\android_sdk"
$CMDLINE_TOOLS_URL = "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip"
$CMDLINE_TOOLS_ZIP = "$SDK_ROOT\cmdline-tools.zip"
$CMDLINE_TOOLS_DIR = "$SDK_ROOT\cmdline-tools"

# 1. Setup Local SDK Directory
if (-not (Test-Path $SDK_ROOT)) {
    New-Item -ItemType Directory -Force -Path $SDK_ROOT | Out-Null
}

# 2. Download Command Line Tools if missing
# The structure MUST be cmdline-tools/latest/bin/sdkmanager.bat
if (-not (Test-Path "$CMDLINE_TOOLS_DIR\latest\bin\sdkmanager.bat")) {
    Write-Host "Downloading Android Command Line Tools..."
    Invoke-WebRequest -Uri $CMDLINE_TOOLS_URL -OutFile $CMDLINE_TOOLS_ZIP -UseBasicParsing

    Write-Host "Extracting Tools..."
    Expand-Archive -Path $CMDLINE_TOOLS_ZIP -DestinationPath "$SDK_ROOT\temp_extract" -Force

    # Move to correct structure: cmdline-tools/latest/
    if (-not (Test-Path "$CMDLINE_TOOLS_DIR\latest")) {
        New-Item -ItemType Directory -Force -Path "$CMDLINE_TOOLS_DIR\latest" | Out-Null
    }
    
    # The zip extracts as "cmdline-tools/..." so we move contents
    Move-Item "$SDK_ROOT\temp_extract\cmdline-tools\*" "$CMDLINE_TOOLS_DIR\latest" -Force
    
    # Cleanup
    Remove-Item $CMDLINE_TOOLS_ZIP -Force
    Remove-Item "$SDK_ROOT\temp_extract" -Recurse -Force
    Write-Host "Android Tools Installed."
} else {
    Write-Host "Android Tools already preset."
}

# 3. Configure Environment for Session
$env:ANDROID_HOME = $SDK_ROOT
$env:ANDROID_SDK_ROOT = $SDK_ROOT
$env:ANDROID_USER_HOME = "$SDK_ROOT\.android" # Store AVDs locally too!

if (-not (Test-Path $env:ANDROID_USER_HOME)) {
    New-Item -ItemType Directory -Force -Path $env:ANDROID_USER_HOME | Out-Null
}

$SDKMANAGER = "$CMDLINE_TOOLS_DIR\latest\bin\sdkmanager.bat"
$AVDMANAGER = "$CMDLINE_TOOLS_DIR\latest\bin\avdmanager.bat"

# 4. Install Components
# system-images;android-34;google_apis_playstore;x86_64
# emulator
# platform-tools
$COMPONENTS = @(
    "platform-tools",
    "emulator",
    "system-images;android-34;google_apis_playstore;x86_64"
)

Write-Host "Installing Emulator and Images (This may take a while)..."
# accept licenses via piping "y"
foreach ($comp in $COMPONENTS) {
    if (-not (Test-Path "$SDK_ROOT\$($comp.Replace(';', '\'))")) {
       Write-Host "Installing $comp..." 
       echo "y" | & $SDKMANAGER --install $comp | Out-Null
    }
}

# 5. Create AVD
$AVD_NAME = "S25_Ultra_Simulator"
Write-Host "Creating AVD: $AVD_NAME..."
# Force delete if exists
echo "no" | & $AVDMANAGER create avd -n $AVD_NAME -k "system-images;android-34;google_apis_playstore;x86_64" -f

# 6. Patch Config
$AVD_PATH = "$env:ANDROID_USER_HOME\avd\$AVD_NAME.avd"
$CONFIG_INI = "$AVD_PATH\config.ini"

if (Test-Path $CONFIG_INI) {
    Write-Host "Patching S25 Ultra Specs..."
    $Content = Get-Content $CONFIG_INI
    
    function Set-IniKey {
        param($Content, $Key, $Value)
        if ($Content -match "^$Key=") {
            return $Content -replace "^$Key=.*", "$Key=$Value"
        } else {
            return $Content + "$Key=$Value"
        }
    }

    $Content = Set-IniKey -Content $Content -Key "hw.lcd.height" -Value "3120"
    $Content = Set-IniKey -Content $Content -Key "hw.lcd.width" -Value "1440"
    $Content = Set-IniKey -Content $Content -Key "hw.lcd.density" -Value "500"
    $Content = Set-IniKey -Content $Content -Key "hw.ramSize" -Value "4096"
    $Content = Set-IniKey -Content $Content -Key "disk.dataPartition.size" -Value "6G"
    $Content = Set-IniKey -Content $Content -Key "hw.keyboard" -Value "yes"
    # Point to custom skin
    $SkinPath = "$ScriptDir\skins\S25Ultra"
    # $Content = Set-IniKey -Content $Content -Key "skin.path" -Value $SkinPath # config.ini expects relative or absolute? absolute usually fine
    
    $Content | Set-Content $CONFIG_INI
}

Write-Host "Setup Complete!"
Write-Host "Start the emulator using: .\launch_s25_ultra.bat"
