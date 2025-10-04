# ⭐ START HERE - UPLOAD YOUR FILES TO GITHUB ⭐

## 🎯 YOU NEED TO DO ONLY 3 THINGS:

### 1️⃣ INSTALL GIT (ONE TIME ONLY - 5 MINUTES)
   
   **Right-click on this file → "Run with PowerShell":**
   ```
   install_git.ps1
   ```
   
   → Click "Next" on all screens
   → Wait for it to finish
   → Close PowerShell when done

---

### 2️⃣ GET READY (3 MINUTES)

   **Go to GitHub and get 3 things:**
   
   A) **Repository URL:**
      - Visit: https://github.com/SaraAli-engr/Calc-Hub
      - Click green "Code" button
      - Copy the URL ending in `.git`
   
   B) **Your Username:**
      - Example: `SaraAli-engr`
   
   C) **Personal Access Token (special password):**
      - Visit: https://github.com/settings/tokens
      - Click "Generate new token (classic)"
      - Name it: "CalcHub"
      - Check box: "repo"
      - Click "Generate token"
      - **COPY THE TOKEN** (save it in Notepad!)

---

### 3️⃣ UPLOAD EVERYTHING (2 MINUTES)

   **Right-click on this file → "Run with PowerShell":**
   ```
   deploy_to_github.ps1
   ```
   
   → It will ask you questions
   → Paste the URL, username, and token when asked
   → Wait 1-2 minutes
   → Done! ✅

---

## 🎉 THAT'S IT!

After step 3, all your files will be on GitHub!

Then:
1. Go to your repo Settings → Pages
2. Enable GitHub Pages (main branch, root folder)
3. Wait 5 minutes
4. Visit: https://www.tahir.engineer

**YOUR WEBSITE IS LIVE! 🚀**

---

## 📚 NEED MORE HELP?

Read these files in order:

1. **EASY_VISUAL_GUIDE.md** ← Most detailed, step-by-step
2. **SIMPLE_UPLOAD_GUIDE.md** ← Alternative guide
3. **FINAL_DEPLOYMENT_REPORT.md** ← Complete documentation

---

## ❓ PROBLEMS?

### "Scripts are disabled"
- Open PowerShell as Administrator
- Type: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Type: `Y` and press Enter

### "Authentication failed"
- Use the **Personal Access Token**, NOT your password
- Make sure you copied the full token from GitHub

### "Git not found"
- Run `install_git.ps1` first
- Close and reopen PowerShell after installing

---

## ✅ QUICK CHECKLIST

Before you start:
- [ ] I have access to my GitHub account
- [ ] I know my repository URL
- [ ] I have 15 minutes free time

During upload:
- [ ] Git installed successfully
- [ ] Got Personal Access Token from GitHub
- [ ] Ran deploy_to_github.ps1
- [ ] Entered: URL, name, email, username, token
- [ ] Saw "SUCCESS!" message

After upload:
- [ ] Enabled GitHub Pages in repo settings
- [ ] Website works at www.tahir.engineer
- [ ] No 404 errors on calculator pages

---

**🎯 TOTAL TIME: 10-15 MINUTES TO COMPLETE EVERYTHING!**

---

*Last Updated: October 4, 2025*
*CalcHub Deployment - www.tahir.engineer*
