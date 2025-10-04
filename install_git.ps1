# Automatic Git Installation Script
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  GIT INSTALLATION - CALCHUB DEPLOYMENT" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is already installed
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git is already installed: $gitVersion" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Git not found. Installing..." -ForegroundColor Yellow
}

Write-Host "📥 Downloading Git for Windows..." -ForegroundColor Cyan

# Download Git installer
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.2/Git-2.42.0.2-64-bit.exe"
$installerPath = "$env:TEMP\GitInstaller.exe"

try {
    # Download with progress
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $gitUrl -OutFile $installerPath -ErrorAction Stop
    Write-Host "✅ Download complete!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🔧 Installing Git..." -ForegroundColor Cyan
    Write-Host "   This will open an installer window." -ForegroundColor Yellow
    Write-Host "   Please follow these steps:" -ForegroundColor Yellow
    Write-Host "   1. Click 'Next' on all screens (use default settings)" -ForegroundColor Yellow
    Write-Host "   2. Wait for installation to complete" -ForegroundColor Yellow
    Write-Host "   3. Close the installer when done" -ForegroundColor Yellow
    Write-Host ""
    
    # Run installer
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host ""
    Write-Host "✅ Git installation completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: You need to close and reopen PowerShell" -ForegroundColor Yellow
    Write-Host "   Then run the deployment script again." -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Error downloading Git: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Manual Installation:" -ForegroundColor Cyan
    Write-Host "   1. Visit: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "   2. Download and install Git" -ForegroundColor White
    Write-Host "   3. Restart PowerShell" -ForegroundColor White
    Write-Host "   4. Run this script again" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
Read-Host
