# Samsung S25 Ultra Android Emulator (Standalone)

This repository provides a standalone, portable setup for running a Samsung S25 Ultra emulator on Windows without requiring Android Studio. It includes scripts to automatically set up the Android SDK, create the AVD (Android Virtual Device) with S25 Ultra specifications, and launch it.

## Features

- **Standalone Windows App**: Sleek GUI for managing and launching emulators without command lines.
- **No Android Studio Required**: Operates using a local standalone Android SDK.
- **Samsung S25 Ultra Specifications**:
  - Resolution: 1440 x 3120
  - Density: 500 DPI
  - RAM: 4GB (x86_64) / 8GB (ARM64)
- **High Compatibility**: Includes both x86_64 (standard) and ARM64 (native) versions.
- **Play Store Support**: Includes Google Play Store support.
- **Custom Skin**: Includes a frame skin for the S25 Ultra aesthetic.

## Versions

| Version | Script | Launcher | Best For |
|---------|--------|----------|----------|
| **Standard (x86_64)** | `setup_s25_ultra.ps1` | `launch_s25_ultra.bat` | Performance on Intel/AMD PCs |
| **ARM64 Native** | `setup_s25_ultra_arm.ps1` | `launch_s25_ultra_arm.bat` | Testing ARM64-only apps |

> [!WARNING]
> **ARM64 Native** emulation is extremely slow on standard Intel/AMD processors. Use the **Standard (x86_64)** version for a smooth experience unless you specifically need to test ARM64 apps.

## Installation

1. **Clone the repository**:
   ```powershell
   git clone https://github.com/Zohaib8090/andriod-emu.git
   cd andriod-emu
   ```

2. **Run the Setup Script**:
   Right-click `setup_s25_ultra.ps1` and select **Run with PowerShell**, or run it from a terminal:
   ```powershell
   .\setup_s25_ultra.ps1
   ```
   *This will download the Android Command Line Tools, Emulator, and System Images into a local `android_sdk` folder (approx. 2-3GB).*

## Usage

### Method 1: Windows App (Recommended)
1. Double-click `start_manager.bat` in the root folder.
2. The **S25 Ultra Manager** will open.
3. Click **Setup** for your chosen version, then click **Launch**.

### Method 2: Manual Batch Files
Simply run the batch file for your chosen version:

- **Launch Standard**: Double-click `launch_s25_ultra.bat`
- **Launch ARM64**: Double-click `launch_s25_ultra_arm.bat`

## Troubleshooting

- **Virtualization**: Ensure "Virtual Machine Platform" and "Windows Hypervisor Platform" are enabled in Windows Features.
- **Disk Space**: Ensure you have at least 10GB of free space for the SDK and AVD data.
- **Execution Policy**: If the PowerShell script fails to run, try:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

## File Structure

- `android_sdk/`: (Generated) Local Android SDK storage.
- `skins/`: Custom S25 Ultra display frames.
- `setup_*.ps1`: Installation and configuration scripts.
- `launch_*.bat`: Emulator startup scripts.
- `.gitignore`: Configured to exclude the large `android_sdk` folder from Git.
