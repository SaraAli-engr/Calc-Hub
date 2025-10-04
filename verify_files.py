#!/usr/bin/env python3
"""
Quick verification script to check if all generated files exist
"""

import os
from pathlib import Path

# Tool categories
URL_MAPPING = {
    'financial': 'financial-calculators',
    'math': 'math-calculators',
    'health': 'health-calculators',
    'crypto': 'crypto-calculators',
    'physics': 'physics-calculators',
    'chemistry': 'chemistry-calculators',
    'engineering': 'engineering-calculators',
    'construction': 'construction-calculators',
    'conversion': 'conversion-tools',
    'business': 'business-calculators',
    'time': 'time-calculators',
    'utility': 'utility-tools'
}

TOOL_CATEGORIES = {
    'financial': ['loan', 'mortgage', 'compound-interest', 'investment', 'savings'],
    'math': [
        'percentage', 'fraction', 'algebra', 'quadratic', 'trigonometry', 
        'scientific-calculator', 'statistics-calculator', 'matrix-calculator', 
        'geometry-calculator', 'calculus-calculator', 'number-theory', 
        'probability-calculator', 'complex-numbers', 'sequence-series', 
        'logarithm-calculator', 'polynomial-calculator', 'binary-calculator',
        'windows-calculator'
    ],
    'health': [
        'bmi', 'calorie', 'body-fat', 'ideal-weight', 'water-intake',
        'heart-rate-zone', 'vo2-max', 'pregnancy-due-date', 'ovulation', 'bmi-children',
        'macro-calculator', 'protein-intake', 'body-measurement', 'sleep-calculator', 'hydration-status',
        'fitness-level', 'workout-intensity', 'recovery-calculator', 'training-load', 'body-age',
        'bmr', 'waist-hip-ratio', 'target-heart-rate', 'body-surface-area', 'lean-body-mass',
        'resting-energy', 'weight-loss-planner', 'blood-alcohol', 'blood-pressure', 'blood-sugar',
        'body-fat-distribution', 'exercise-calories', 'macros-converter', 'meal-planner', 'muscle-mass'
    ],
    'crypto': [
        'crypto-profit', 'crypto-leverage-liquidation', 'crypto-futures-pnl',
        'crypto-lending-returns', 'crypto-compound-yield', 'crypto-rebalancing',
        'crypto-stop-loss', 'crypto-correlation', 'crypto-volume-analysis',
        'crypto-position-size', 'crypto-funding-rate', 'crypto-drawdown',
        'crypto-swing-trade', 'crypto-accumulation', 'crypto-volatility',
        'crypto-dca', 'crypto-mining', 'crypto-converter', 'impermanent-loss',
        'staking-rewards', 'crypto-arbitrage', 'crypto-yield-farming',
        'crypto-bridge-fees', 'crypto-tax-calculator', 'crypto-hodl-calculator',
        'crypto-rainbow-chart', 'crypto-fear-greed', 'crypto-hash-rate',
        'crypto-whale-tracker', 'crypto-flash-loan', 'crypto-liquidity-pool',
        'crypto-options-pricing', 'crypto-defi-yield', 'crypto-nft-valuation',
        'crypto-gas-optimizer', 'crypto-portfolio-tracker', 'crypto-leverage-calculator',
        'crypto-sharpe-ratio', 'crypto-dollar-hedge', 'crypto-momentum-indicator',
        'crypto-technical-levels', 'crypto-altcoin-season', 'crypto-market-cap-calc',
        'crypto-pairs-trading', 'crypto-grid-trading', 'crypto-rsi-calculator',
        'crypto-funding-arbitrage', 'crypto-volatility-smile', 'crypto-carry-trade',
        'crypto-basis-trading', 'crypto-social-sentiment'
    ],
    'physics': ['velocity', 'energy', 'force', 'momentum', 'power'],
    'chemistry': ['molarity', 'ph', 'molecular-weight', 'gas-laws', 'stoichiometry'],
    'engineering': [
        'ohms-law', 'power-consumption', 'resistor-color', 'voltage-divider', 'capacitor',
        'transformer-turns', 'inductor-reactance', 'rc-time-constant', 'rlc-resonance',
        'parallel-resistance', 'series-resistance', 'power-factor', 'three-phase-power',
        'wire-gauge', 'led-resistor', 'antenna-length', 'decibel-converter',
        'impedance-matching', 'filter-frequency', 'amplifier-gain', 'beam-deflection',
        'gear-ratio', 'pulley-system', 'hydraulic-pressure', 'spring-constant',
        'thermal-expansion', 'motor-efficiency', 'pipe-flow'
    ],
    'construction': ['concrete', 'paint', 'brick', 'roof-pitch', 'flooring'],
    'conversion': [
        'length', 'temperature', 'weight', 'area', 'volume', 'speed',
        'pressure', 'energy-conversion', 'power-conversion', 'data-storage',
        'angle', 'time-conversion', 'frequency', 'currency', 'fuel-economy-conversion',
        'density', 'force-conversion', 'luminosity', 'magnetic-field', 'radioactivity', 'torque'
    ],
    'business': ['roi', 'break-even', 'markup', 'payroll', 'cash-flow'],
    'time': ['age', 'date-difference', 'time-zone', 'working-days', 'countdown'],
    'utility': ['grade', 'fuel-economy', 'password-strength', 'random-number', 'color-picker']
}

def verify_files():
    """Verify all generated files exist"""
    base_path = Path(__file__).parent
    
    print("=" * 60)
    print("CALCHUB - FILE VERIFICATION")
    print("=" * 60)
    print()
    
    # Track results
    missing_files = []
    existing_files = []
    
    # Check critical files
    print("📋 Checking Critical Files:")
    critical_files = [
        'index.html',
        'sitemap.xml',
        'robots.txt',
        '.htaccess',
        'assets/js/main.js',
        'assets/js/calculators.js',
        'assets/css/style.css'
    ]
    
    for file in critical_files:
        file_path = base_path / file
        if file_path.exists():
            print(f"  ✅ {file}")
            existing_files.append(file)
        else:
            print(f"  ❌ {file} - MISSING")
            missing_files.append(file)
    
    print()
    print("📁 Checking Category Folders:")
    
    # Check category folders and index files
    for category_key, category_url in URL_MAPPING.items():
        category_dir = base_path / category_url
        index_file = category_dir / 'index.html'
        
        if category_dir.exists():
            print(f"  ✅ {category_url}/")
            existing_files.append(f"{category_url}/")
        else:
            print(f"  ❌ {category_url}/ - MISSING")
            missing_files.append(f"{category_url}/")
            
        if index_file.exists():
            print(f"    ✅ index.html")
            existing_files.append(f"{category_url}/index.html")
        else:
            print(f"    ❌ index.html - MISSING")
            missing_files.append(f"{category_url}/index.html")
    
    print()
    print("🧮 Checking Calculator Pages:")
    
    # Check individual calculator files
    total_calcs = 0
    missing_calcs = 0
    
    for category_key, tools in TOOL_CATEGORIES.items():
        category_url = URL_MAPPING[category_key]
        category_dir = base_path / category_url
        
        print(f"\n  {category_key.title()} ({len(tools)} calculators):")
        
        for tool in tools:
            total_calcs += 1
            calc_file = category_dir / f"{tool}.html"
            
            if calc_file.exists():
                print(f"    ✅ {tool}.html")
                existing_files.append(f"{category_url}/{tool}.html")
            else:
                print(f"    ❌ {tool}.html - MISSING")
                missing_files.append(f"{category_url}/{tool}.html")
                missing_calcs += 1
    
    # Summary
    print()
    print("=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    print(f"Total files checked: {len(existing_files) + len(missing_files)}")
    print(f"✅ Existing files: {len(existing_files)}")
    print(f"❌ Missing files: {len(missing_files)}")
    print()
    print(f"Critical files: {len([f for f in critical_files if (base_path / f).exists()])}/{len(critical_files)}")
    print(f"Category folders: {len([k for k in URL_MAPPING.keys() if (base_path / URL_MAPPING[k]).exists()])}/{len(URL_MAPPING)}")
    print(f"Category index pages: {len([k for k in URL_MAPPING.keys() if (base_path / URL_MAPPING[k] / 'index.html').exists()])}/{len(URL_MAPPING)}")
    print(f"Calculator pages: {total_calcs - missing_calcs}/{total_calcs}")
    print()
    
    if missing_files:
        print("⚠️  WARNING: Some files are missing!")
        print()
        print("Missing files:")
        for file in missing_files[:10]:  # Show first 10
            print(f"  - {file}")
        if len(missing_files) > 10:
            print(f"  ... and {len(missing_files) - 10} more")
        print()
        print("💡 Run 'python generate_pages.py' to regenerate missing files")
        return False
    else:
        print("🎉 SUCCESS! All files are present and ready for deployment!")
        print()
        print("📤 Next Steps:")
        print("  1. Upload all files to your web server")
        print("  2. Submit sitemap to Google Search Console")
        print("  3. Request indexing for priority pages")
        print("  4. Monitor indexing progress")
        print()
        print("📚 Documentation:")
        print("  - SOLUTION_SUMMARY.md - Complete solution overview")
        print("  - DEPLOYMENT_GUIDE.md - Detailed deployment steps")
        print("  - README.md - Project documentation")
        return True

if __name__ == '__main__':
    success = verify_files()
    exit(0 if success else 1)
