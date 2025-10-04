#!/usr/bin/env python3
"""
Generate individual HTML pages for each calculator to make them indexable by Google.
This script creates SEO-friendly pages that redirect via JavaScript after page load.
"""

import os
import json
from datetime import datetime

# URL mapping (matches main.js)
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

# Category titles
CATEGORY_TITLES = {
    'financial': 'Financial Calculators',
    'math': 'Mathematics Calculators',
    'health': 'Health & Fitness Calculators',
    'crypto': 'Cryptocurrency Calculators',
    'physics': 'Physics Calculators',
    'chemistry': 'Chemistry Calculators',
    'engineering': 'Engineering Calculators',
    'construction': 'Construction Calculators',
    'conversion': 'Unit Conversion Tools',
    'business': 'Business Calculators',
    'time': 'Date & Time Calculators',
    'utility': 'Utility Tools'
}

def format_calculator_name(calc_id):
    """Convert calculator ID to readable name."""
    # Remove -calculator suffix if present
    name = calc_id.replace('-calculator', '')
    # Replace hyphens with spaces and capitalize
    return ' '.join(word.capitalize() for word in name.split('-'))

def generate_calculator_html(category_key, category_url, calc_id, base_url="https://www.tahir.engineer"):
    """Generate HTML page for a single calculator."""
    calc_name = format_calculator_name(calc_id)
    category_title = CATEGORY_TITLES.get(category_key, 'Calculators')
    calc_url_path = calc_id
    
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{calc_name} Calculator | Free Online Tool | CalcHub</title>
    <meta name="description" content="Free online {calc_name.lower()} calculator. Professional, accurate, and easy-to-use tool for {calc_name.lower()} calculations. Part of CalcHub's collection of 150+ free calculator tools.">
    <meta name="keywords" content="{calc_name.lower()}, {calc_name.lower()} calculator, online {calc_name.lower()} calculator, free {calc_name.lower()} tool, {category_key} calculator">
    
    <!-- Enhanced SEO Meta Tags -->
    <meta name="author" content="CalcHub - Professional Calculator Tools">
    <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">
    <meta name="googlebot" content="index, follow">
    <meta name="language" content="English">
    <meta name="revisit-after" content="7 days">
    <meta name="rating" content="General">
    <meta name="distribution" content="Global">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{base_url}/{category_url}/{calc_url_path}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{calc_name} Calculator | Free Online Tool | CalcHub">
    <meta property="og:description" content="Free online {calc_name.lower()} calculator. Professional and accurate tool for all your {calc_name.lower()} calculation needs.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{base_url}/{category_url}/{calc_url_path}">
    <meta property="og:image" content="{base_url}/assets/images/calchub-og.png">
    <meta property="og:site_name" content="CalcHub">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{calc_name} Calculator | CalcHub">
    <meta name="twitter:description" content="Free online {calc_name.lower()} calculator. Professional and accurate.">
    <meta name="twitter:image" content="{base_url}/assets/images/calchub-og.png">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "{calc_name} Calculator",
        "alternateName": "CalcHub {calc_name} Calculator",
        "url": "{base_url}/{category_url}/{calc_url_path}",
        "description": "Free online {calc_name.lower()} calculator for accurate and professional calculations.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires HTML5 support",
        "offers": {{
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }},
        "isPartOf": {{
            "@type": "WebSite",
            "name": "CalcHub",
            "url": "{base_url}/"
        }},
        "breadcrumb": {{
            "@type": "BreadcrumbList",
            "itemListElement": [
                {{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "{base_url}/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "{category_title}",
                    "item": "{base_url}/{category_url}"
                }},
                {{
                    "@type": "ListItem",
                    "position": 3,
                    "name": "{calc_name} Calculator",
                    "item": "{base_url}/{category_url}/{calc_url_path}"
                }}
            ]
        }}
    }}
    </script>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <!-- Redirect Script with Delay for SEO -->
    <script>
        // Allow search engines to crawl the page before redirecting
        setTimeout(function() {{
            window.location.href = '/?calc={category_key}/{calc_id}';
        }}, 100);
    </script>
</head>
<body>
    <!-- Content visible to search engines before redirect -->
    <div class="container mt-5 pt-5">
        <div class="text-center">
            <h1 class="mb-4">{calc_name} Calculator</h1>
            <p class="lead">Free online {calc_name.lower()} calculator. Professional, accurate, and easy to use.</p>
            <p>Loading calculator...</p>
            <div class="spinner-border text-primary mt-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        
        <div class="mt-5">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/{category_url}">{category_title}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{calc_name} Calculator</li>
                </ol>
            </nav>
        </div>
        
        <div class="mt-4">
            <h2>About {calc_name} Calculator</h2>
            <p>This free online {calc_name.lower()} calculator is part of CalcHub's comprehensive collection of over 150 professional calculator tools. It provides accurate, fast, and reliable calculations for all your {calc_name.lower()} needs.</p>
            <p><strong>Category:</strong> {category_title}</p>
            <p><strong>Features:</strong></p>
            <ul>
                <li>100% Free to use</li>
                <li>No registration required</li>
                <li>Professional and accurate results</li>
                <li>User-friendly interface</li>
                <li>Mobile responsive design</li>
            </ul>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>'''
    
    return html_content

def generate_category_html(category_key, category_url, base_url="https://www.tahir.engineer"):
    """Generate HTML page for a category listing."""
    category_title = CATEGORY_TITLES.get(category_key, 'Calculators')
    tools = TOOL_CATEGORIES.get(category_key, [])
    
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{category_title} | Free Online Tools | CalcHub</title>
    <meta name="description" content="Professional {category_title.lower()} for accurate calculations. Free, fast, and reliable tools. Browse our collection of {len(tools)} calculators.">
    <meta name="keywords" content="{category_key} calculator, {category_title.lower()}, online {category_key} tools, free calculator">
    
    <!-- Enhanced SEO Meta Tags -->
    <meta name="author" content="CalcHub - Professional Calculator Tools">
    <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large">
    <meta name="googlebot" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{base_url}/{category_url}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{category_title} | Free Online Tools | CalcHub">
    <meta property="og:description" content="Professional {category_title.lower()} for accurate calculations. {len(tools)} free tools available.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{base_url}/{category_url}">
    <meta property="og:site_name" content="CalcHub">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "{category_title}",
        "description": "Professional {category_title.lower()} for accurate calculations. Free, fast, and reliable tools.",
        "url": "{base_url}/{category_url}",
        "isPartOf": {{
            "@type": "WebSite",
            "name": "CalcHub",
            "url": "{base_url}/"
        }},
        "breadcrumb": {{
            "@type": "BreadcrumbList",
            "itemListElement": [
                {{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "{base_url}/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "{category_title}",
                    "item": "{base_url}/{category_url}"
                }}
            ]
        }}
    }}
    </script>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <!-- Redirect Script -->
    <script>
        setTimeout(function() {{
            window.location.href = '/?category={category_key}';
        }}, 100);
    </script>
</head>
<body>
    <div class="container mt-5 pt-5">
        <div class="text-center">
            <h1 class="mb-4">{category_title}</h1>
            <p class="lead">Browse our collection of {len(tools)} professional {category_key} calculators</p>
            <p>Loading calculators...</p>
            <div class="spinner-border text-primary mt-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        
        <div class="mt-5">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{category_title}</li>
                </ol>
            </nav>
        </div>
        
        <div class="mt-4">
            <h2>Available Calculators</h2>
            <ul class="list-unstyled">
'''
    
    # Add calculator links
    for tool in tools:
        tool_name = format_calculator_name(tool)
        html_content += f'                <li class="mb-2"><a href="/{category_url}/{tool}">{tool_name} Calculator</a></li>\n'
    
    html_content += '''            </ul>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>'''
    
    return html_content

def main():
    """Generate all calculator and category pages."""
    base_path = os.path.dirname(os.path.abspath(__file__))
    created_files = []
    
    print("Starting page generation...")
    print(f"Base path: {base_path}")
    
    # Generate category pages and calculator pages
    for category_key, category_url in URL_MAPPING.items():
        # Create category directory
        category_dir = os.path.join(base_path, category_url)
        os.makedirs(category_dir, exist_ok=True)
        
        # Generate category index page
        category_html = generate_category_html(category_key, category_url)
        category_file = os.path.join(category_dir, 'index.html')
        with open(category_file, 'w', encoding='utf-8') as f:
            f.write(category_html)
        created_files.append(category_file)
        print(f"Created: {category_file}")
        
        # Generate individual calculator pages
        tools = TOOL_CATEGORIES.get(category_key, [])
        for calc_id in tools:
            # Create calculator page
            calc_html = generate_calculator_html(category_key, category_url, calc_id)
            calc_file = os.path.join(category_dir, f'{calc_id}.html')
            with open(calc_file, 'w', encoding='utf-8') as f:
                f.write(calc_html)
            created_files.append(calc_file)
    
    print(f"\nGeneration complete!")
    print(f"Total files created: {len(created_files)}")
    print(f"\nCategories: {len(URL_MAPPING)}")
    print(f"Total calculators: {sum(len(tools) for tools in TOOL_CATEGORIES.values())}")
    
    return created_files

if __name__ == '__main__':
    main()
