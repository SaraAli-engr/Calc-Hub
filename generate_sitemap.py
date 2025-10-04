#!/usr/bin/env python3
"""
Generate sitemap.xml with all calculator URLs
"""

from datetime import datetime

# Tool categories (matches calculators.js)
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

def generate_sitemap(base_url="https://www.tahir.engineer"):
    """Generate complete sitemap.xml"""
    today = datetime.now().strftime('%Y-%m-%d')
    
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Homepage -->
    <url>
        <loc>{base_url}/</loc>
        <lastmod>{today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>{base_url}/assets/images/calchub-og.png</image:loc>
            <image:title>CalcHub - Professional Calculator Tools</image:title>
            <image:caption>150+ free online calculator tools for financial, health, math and engineering calculations</image:caption>
        </image:image>
    </url>
    
    <!-- Static Pages -->
    <url>
        <loc>{base_url}/blogs.html</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <url>
        <loc>{base_url}/convertors.html</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Category Pages -->
'''
    
    # Add category pages
    for category_key, category_url in URL_MAPPING.items():
        sitemap += f'''    <url>
        <loc>{base_url}/{category_url}/</loc>
        <lastmod>{today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    
'''
    
    # Add individual calculator pages
    sitemap += "    <!-- Individual Calculator Pages -->\n"
    
    for category_key, tools in TOOL_CATEGORIES.items():
        category_url = URL_MAPPING[category_key]
        sitemap += f"\n    <!-- {category_key.title()} Calculators -->\n"
        
        for tool in tools:
            sitemap += f'''    <url>
        <loc>{base_url}/{category_url}/{tool}.html</loc>
        <lastmod>{today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
'''
    
    sitemap += "</urlset>"
    
    return sitemap

def main():
    """Generate and save sitemap"""
    import os
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    sitemap_content = generate_sitemap()
    
    sitemap_file = os.path.join(base_path, 'sitemap.xml')
    with open(sitemap_file, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print(f"Sitemap generated successfully!")
    print(f"File: {sitemap_file}")
    print(f"Total URLs: {sitemap_content.count('<url>')}")
    
    # Calculate totals
    total_calcs = sum(len(tools) for tools in TOOL_CATEGORIES.values())
    print(f"Categories: {len(URL_MAPPING)}")
    print(f"Individual Calculators: {total_calcs}")
    print(f"Static Pages: 3")
    print(f"Total: {len(URL_MAPPING) + total_calcs + 3}")

if __name__ == '__main__':
    main()
