# ONE-CLICK DEPLOYMENT TO GITHUB
# This script will upload ALL your files to GitHub automatically

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CALCHUB - AUTOMATIC GITHUB DEPLOYMENT" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectPath = "c:\Users\ILTIJA\Desktop\VERSION 15 (add indexable urls)"
Set-Location $projectPath

# Step 1: Check if Git is installed
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run: install_git.ps1 first" -ForegroundColor Yellow
    Write-Host "Or visit: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 2: Initialize Git repository if needed
Write-Host "Step 2: Setting up Git repository..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

Write-Host ""

# Step 3: Get GitHub repository URL
Write-Host "Step 3: Configure GitHub repository..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Yellow
Write-Host "Example: https://github.com/SaraAli-engr/Calc-Hub.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ No repository URL provided!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Remove existing remote if exists
git remote remove origin 2>$null

# Add new remote
git remote add origin $repoUrl
Write-Host "✅ Repository configured: $repoUrl" -ForegroundColor Green

Write-Host ""

# Step 4: Configure Git user (required for commits)
Write-Host "Step 4: Configure Git user..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your name:" -ForegroundColor Yellow
$userName = Read-Host "Your Name"
Write-Host ""
Write-Host "Please enter your email:" -ForegroundColor Yellow
$userEmail = Read-Host "Your Email"

if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "❌ Name and email are required!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

git config user.name "$userName"
git config user.email "$userEmail"
Write-Host "✅ Git user configured" -ForegroundColor Green

Write-Host ""

# Step 5: Stage all files
Write-Host "Step 5: Preparing files for upload..." -ForegroundColor Cyan
git add .
$fileCount = (git diff --cached --numstat | Measure-Object).Count
Write-Host "✅ Ready to upload $fileCount files" -ForegroundColor Green

Write-Host ""

# Step 6: Create commit
Write-Host "Step 6: Creating commit..." -ForegroundColor Cyan
$commitMessage = "Fix: Add 200 static HTML pages for Google indexing - Resolve 404 errors

- Generated 12 category index pages with SEO optimization
- Generated 188 individual calculator pages
- Updated sitemap.xml with 203 URLs
- Optimized robots.txt for search engine crawling
- Added structured data (Schema.org) to all pages
- Implemented canonical URLs and Open Graph tags
- Resolved Google Search Console indexing errors"

git commit -m "$commitMessage"
Write-Host "✅ Commit created successfully" -ForegroundColor Green

Write-Host ""

# Step 7: Push to GitHub
Write-Host "Step 7: Uploading to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  You may be asked to login to GitHub" -ForegroundColor Yellow
Write-Host "   Use your GitHub username and Personal Access Token (not password)" -ForegroundColor Yellow
Write-Host ""
Write-Host "   How to get a Personal Access Token:" -ForegroundColor Cyan
Write-Host "   1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   3. Check 'repo' scope" -ForegroundColor White
Write-Host "   4. Generate and copy the token" -ForegroundColor White
Write-Host "   5. Use it as password when prompted" -ForegroundColor White
Write-Host ""

try {
    git push -u origin main 2>&1 | ForEach-Object { Write-Host $_ }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "  ✅ SUCCESS! FILES UPLOADED TO GITHUB!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Your website files are now on GitHub!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
        Write-Host "   1. Go to your GitHub repository" -ForegroundColor White
        Write-Host "   2. Click 'Settings' → 'Pages'" -ForegroundColor White
        Write-Host "   3. Under 'Source', select: main branch, / (root)" -ForegroundColor White
        Write-Host "   4. Click 'Save'" -ForegroundColor White
        Write-Host "   5. Wait 2-5 minutes for deployment" -ForegroundColor White
        Write-Host "   6. Visit: https://www.tahir.engineer" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Submit to Google Search Console:" -ForegroundColor Cyan
        Write-Host "   https://search.google.com/search-console" -ForegroundColor White
        Write-Host "   Add sitemap: https://www.tahir.engineer/sitemap.xml" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Trying with 'master' branch..." -ForegroundColor Yellow
        git branch -M main
        git push -u origin main 2>&1 | ForEach-Object { Write-Host $_ }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SUCCESS! Files uploaded!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Upload failed. Please check:" -ForegroundColor Red
            Write-Host "   - Repository URL is correct" -ForegroundColor Yellow
            Write-Host "   - You have write access to the repository" -ForegroundColor Yellow
            Write-Host "   - You're using Personal Access Token (not password)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error during upload: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
