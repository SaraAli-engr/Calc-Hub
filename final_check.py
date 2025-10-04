#!/usr/bin/env python3
"""
Final verification and cleanup before GitHub deployment
"""

import os
from pathlib import Path

def main():
    base_path = Path(__file__).parent
    
    print("=" * 70)
    print("CALCHUB - FINAL PRE-DEPLOYMENT CHECK")
    print("=" * 70)
    print()
    
    # Essential files for GitHub Pages
    essential_files = {
        'index.html': 'Main homepage',
        'CNAME': 'Custom domain configuration',
        'sitemap.xml': 'SEO sitemap',
        'robots.txt': 'Search engine directives',
        '.htaccess': 'Apache server configuration',
        'blogs.html': 'Blog page',
        'convertors.html': 'Converters page',
        '404.html': 'Custom 404 page',
        'favicon.ico': 'Site favicon',
        'apple-touch-icon.png': 'Apple touch icon',
        'site.webmanifest': 'Web app manifest'
    }
    
    print("✅ ESSENTIAL FILES CHECK:")
    all_essential_present = True
    for file, description in essential_files.items():
        file_path = base_path / file
        if file_path.exists():
            print(f"  ✅ {file:<25} - {description}")
        else:
            print(f"  ❌ {file:<25} - MISSING - {description}")
            all_essential_present = False
    
    print()
    print("📁 CALCULATOR CATEGORIES:")
    categories = [
        'financial-calculators', 'math-calculators', 'health-calculators',
        'crypto-calculators', 'physics-calculators', 'chemistry-calculators',
        'engineering-calculators', 'construction-calculators', 'conversion-tools',
        'business-calculators', 'time-calculators', 'utility-tools'
    ]
    
    all_categories_present = True
    for category in categories:
        cat_path = base_path / category
        index_path = cat_path / 'index.html'
        
        if cat_path.exists() and cat_path.is_dir():
            html_files = list(cat_path.glob('*.html'))
            print(f"  ✅ {category:<30} ({len(html_files)} files)")
        else:
            print(f"  ❌ {category:<30} - MISSING")
            all_categories_present = False
    
    print()
    print("📦 ASSETS CHECK:")
    asset_dirs = ['assets/css', 'assets/js', 'assets/images']
    for asset_dir in asset_dirs:
        dir_path = base_path / asset_dir
        if dir_path.exists():
            files = list(dir_path.glob('*.*'))
            print(f"  ✅ {asset_dir:<20} ({len(files)} files)")
        else:
            print(f"  ❌ {asset_dir:<20} - MISSING")
    
    print()
    print("📚 DOCUMENTATION FILES (Optional - can be kept):")
    docs = {
        'README.md': 'Project documentation',
        'SOLUTION_SUMMARY.md': 'Implementation summary',
        'DEPLOYMENT_GUIDE.md': 'Deployment instructions',
        'DEPLOYMENT_CHECKLIST.md': 'Pre-deployment checklist'
    }
    
    for doc, desc in docs.items():
        doc_path = base_path / doc
        if doc_path.exists():
            size = doc_path.stat().st_size / 1024
            print(f"  ✅ {doc:<30} - {desc} ({size:.1f} KB)")
    
    print()
    print("🔧 UTILITY SCRIPTS (Keep for maintenance):")
    scripts = {
        'generate_pages.py': 'Generate calculator pages',
        'generate_sitemap.py': 'Generate sitemap',
        'verify_files.py': 'Verify file structure'
    }
    
    for script, desc in scripts.items():
        script_path = base_path / script
        if script_path.exists():
            print(f"  ✅ {script:<30} - {desc}")
    
    print()
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    if all_essential_present and all_categories_present:
        print("✅ ALL ESSENTIAL FILES PRESENT - READY FOR DEPLOYMENT!")
        print()
        print("📋 WHAT TO UPLOAD TO GITHUB:")
        print("  ✅ All HTML files (index.html, blogs.html, 404.html, etc.)")
        print("  ✅ All calculator category folders with .html files")
        print("  ✅ assets/ folder (CSS, JS, images)")
        print("  ✅ CNAME file (for custom domain)")
        print("  ✅ sitemap.xml and robots.txt")
        print("  ✅ .htaccess (for Apache server)")
        print("  ✅ All favicon files")
        print("  ✅ Documentation files (README.md, etc.) - Optional")
        print("  ✅ Python scripts - Optional (for future updates)")
        print()
        print("❌ WHAT NOT TO UPLOAD:")
        print("  ❌ node_modules/ (if exists)")
        print("  ❌ .env files")
        print("  ❌ .DS_Store or system files")
        print("  ❌ __pycache__/ or .pyc files")
        print()
        print("🚀 DEPLOYMENT STEPS:")
        print("  1. Commit all changes to Git")
        print("  2. Push to GitHub repository")
        print("  3. Enable GitHub Pages in repository settings")
        print("  4. Set source to main branch, root folder")
        print("  5. Custom domain will be auto-configured from CNAME")
        print("  6. Wait 2-5 minutes for deployment")
        print("  7. Visit https://www.tahir.engineer to verify")
        print("  8. Submit sitemap to Google Search Console")
        print()
        return True
    else:
        print("⚠️  WARNING: Some essential files are missing!")
        print("Please run generate_pages.py and generate_sitemap.py first.")
        return False

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
