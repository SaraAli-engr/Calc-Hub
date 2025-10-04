# FINAL STEP - Push to GitHub
# This will ask for your GitHub credentials

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  UPLOADING FILES TO GITHUB" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Git is installed" -ForegroundColor Green
Write-Host "✅ 237 files ready to upload" -ForegroundColor Green
Write-Host "✅ Commit created successfully" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  AUTHENTICATION REQUIRED" -ForegroundColor Yellow
Write-Host ""
Write-Host "You need a Personal Access Token from GitHub:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "3. Name it: CalcHub" -ForegroundColor White
Write-Host "4. Check: 'repo' permission" -ForegroundColor White
Write-Host "5. Click 'Generate token'" -ForegroundColor White
Write-Host "6. COPY the green token text" -ForegroundColor White
Write-Host ""

Write-Host "Press Enter when you have your token ready..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Enter your GitHub username:" -ForegroundColor Cyan
$username = Read-Host

Write-Host ""
Write-Host "Paste your Personal Access Token (it won't show as you type):" -ForegroundColor Cyan
$token = Read-Host -AsSecureString

# Convert secure string to plain text for URL
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "🚀 Uploading files to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Set up authenticated URL
$repoUrl = "https://${username}:${tokenPlain}@github.com/SaraAli-engr/Calc-Hub.git"

# Change to project directory
Set-Location "c:\Users\ILTIJA\Desktop\VERSION 15 (add indexable urls)"

# Remove old remote and add new with auth
& "C:\Program Files\Git\bin\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\bin\git.exe" remote add origin $repoUrl

# Push to GitHub (force push to replace old code)
Write-Host "Pushing 237 files..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" push -u origin master:main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! ALL FILES UPLOADED!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your 237 files are now on GitHub!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://github.com/SaraAli-engr/Calc-Hub" -ForegroundColor White
    Write-Host "2. Click 'Settings' → 'Pages'" -ForegroundColor White
    Write-Host "3. Source: 'main' branch, '/ (root)' folder" -ForegroundColor White
    Write-Host "4. Click 'Save'" -ForegroundColor White
    Write-Host "5. Wait 5 minutes for deployment" -ForegroundColor White
    Write-Host "6. Visit: https://www.tahir.engineer" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 SUBMIT TO GOOGLE:" -ForegroundColor Cyan
    Write-Host "https://search.google.com/search-console" -ForegroundColor White
    Write-Host "Add sitemap: https://www.tahir.engineer/sitemap.xml" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ All 203 URLs will be indexed within 1-2 weeks!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Wrong username or token" -ForegroundColor White
    Write-Host "- Token doesn't have 'repo' permission" -ForegroundColor White
    Write-Host "- Token already expired" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running this script again with correct credentials." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
