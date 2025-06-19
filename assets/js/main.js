// Show categories (main page)
// Ensure functions are globally accessible
window.showCategory = showCategory;
window.showCategories = showCategories;
window.showCalculator = showCalculator;
window.backToCalculatorList = backToCalculatorList;
window.calculateResult = calculateResult;

function showCategories() {
    // Hide calculator display
    document.getElementById('calculator-display').style.display = 'none';
    
    // Show categories section
    document.getElementById('categories').style.display = 'block';
    
    // Scroll to categories
    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
}

// Show specific category tools
function showCategory(category) {
    // Hide categories section
    const categoriesEl = document.getElementById('categories');
    if (categoriesEl) {
        categoriesEl.style.display = 'none';
    }
    
    // Show calculator display
    const calcDisplayEl = document.getElementById('calculator-display');
    if (calcDisplayEl) {
        calcDisplayEl.style.display = 'block';
    }
    
    // Update category title
    const categoryTitles = {
        'financial': 'Financial Calculators',
        'math': 'Mathematics Calculators',
        'health': 'Health & Fitness Calculators',
        'engineering': 'Engineering Calculators',
        'conversion': 'Unit Conversion Tools',
        'business': 'Business Calculators',
        'crypto': 'Cryptocurrency Tools',
        'physics': 'Physics Calculators',
        'chemistry': 'Chemistry Calculators',
        'construction': 'Construction Tools',
        'time': 'Date & Time Tools',
        'utility': 'Utility Tools'
    };
    
    document.getElementById('category-title').textContent = categoryTitles[category] || 'Calculators';
    
    // Load calculator list
    loadCategoryTools(category);
    
    // Scroll to top
    document.getElementById('calculator-display').scrollIntoView({ behavior: 'smooth' });
}

// Load tools for a specific category
function loadCategoryTools(category) {
    const listContainer = document.getElementById('calculator-list-items');
    const tools = toolCategories[category] || [];
    
    let html = '';
    tools.forEach(tool => {
        const calc = calculators[tool];
        if (calc) {
            // Generate a simple description based on the calculator title
            const description = `Professional ${calc.title.toLowerCase()} for accurate calculations`;
            
            html += `
                <div class="modern-calculator-item fade-in-up" onclick="showCalculator('${tool}')">
                    <div class="calculator-item-icon">
                        <i class="${calc.icon}"></i>
                    </div>
                    <div class="calculator-item-content">
                        <div class="calculator-item-title">${calc.title}</div>
                        <div class="calculator-item-description">${description}</div>
                    </div>
                    <div class="calculator-item-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            `;
        }
    });
    
    listContainer.innerHTML = html || '<p class="text-muted text-center">No calculators available in this category.</p>';
}

// Show calculator function
function showCalculator(calcId) {
    const calc = calculators[calcId];
    if (!calc) {
        document.getElementById('calculator-content').innerHTML = '<p class="text-danger">Calculator not found</p>';
        return;
    }
    
    // Show the form container and hide the calculator list
    document.getElementById('calculator-list-items').style.display = 'none';
    document.getElementById('calculator-form-container').style.display = 'block';
    document.getElementById('calculator-form-title').textContent = calc.title;
    
    let formHTML = `
        <form id="calc-form" onsubmit="calculateResult(event, '${calcId}')">
    `;
    
    calc.inputs.forEach(input => {
        formHTML += `
            <div class="mb-4">
                <label class="form-label">${input.label}</label>
        `;
        
        if (input.type === 'select') {
            formHTML += `<select class="form-select" id="${input.id}" required>`;
            input.options.forEach(option => {
                formHTML += `<option value="${option}">${option}</option>`;
            });
            formHTML += `</select>`;
        } else {
            formHTML += `<input type="${input.type}" class="form-control" id="${input.id}" placeholder="${input.placeholder || ''}" ${input.step ? `step="${input.step}"` : ''} required>`;
        }
        
        formHTML += `</div>`;
    });
    
    formHTML += `
            <div class="text-center">
                <button type="submit" class="calculator-submit-btn">
                    <i class="fas fa-calculator"></i>
                    Calculate Results
                </button>
            </div>
        </form>
        <div class="text-center mt-3">
            <button class="modern-btn modern-btn-outline" onclick="backToCalculatorList()">
                <i class="fas fa-arrow-left"></i>
                Back to Calculator List
            </button>
        </div>
    `;
    
    document.getElementById('calculator-content').innerHTML = formHTML;
    document.getElementById('calculator-result').style.display = 'none';
}

// Back to calculator list function
function backToCalculatorList() {
    document.getElementById('calculator-list-items').style.display = 'grid';
    document.getElementById('calculator-form-container').style.display = 'none';
    document.getElementById('calculator-result').style.display = 'none';
}

// Calculate result function
function calculateResult(event, calcId) {
    event.preventDefault();
    
    const calc = calculators[calcId];
    if (!calc) return;
    
    const inputs = {};
    calc.inputs.forEach(input => {
        const element = document.getElementById(input.id);
        inputs[input.id] = element.value;
    });
    
    try {
        const result = calc.calculate(inputs);
        showResult(result);
    } catch (error) {
        showError(error.message || 'Error in calculation');
    }
}

// Show calculation result
function showResult(result) {
    const resultContainer = document.getElementById('calculator-result');
    resultContainer.innerHTML = `
        <div class="calculator-result-section">
            <h5><i class="fas fa-check-circle me-2"></i>Calculation Results</h5>
            <div class="calculator-result-content">${result}</div>
        </div>
    `;
    resultContainer.style.display = 'block';
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById('calculator-result');
    resultContainer.innerHTML = `
        <div class="alert alert-danger">
            <h5><i class="fas fa-exclamation-circle me-2"></i>Calculation Error</h5>
            <p class="mb-0">${message}</p>
        </div>
    `;
    resultContainer.style.display = 'block';
}

// Search functionality
function searchCalculators() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) return;
    
    // Simple search through all calculators
    let found = false;
    for (const [category, tools] of Object.entries(toolCategories)) {
        for (const tool of tools) {
            const calc = calculators[tool];
            if (calc && calc.title.toLowerCase().includes(query)) {
                showCategory(category);
                setTimeout(() => showCalculator(tool), 500);
                found = true;
                break;
            }
        }
        if (found) break;
    }
    
    if (!found) {
        alert('Calculator not found. Please try a different search term.');
    }
}

// Search for specific term
function searchFor(term) {
    document.getElementById('searchInput').value = term;
    searchCalculators();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showCategories();
    
    // Add click event listeners to category cards
    const categoryCards = document.querySelectorAll('.modern-category-card');
    categoryCards.forEach(card => {
        const onclick = card.getAttribute('onclick');
        if (onclick) {
            const category = onclick.match(/showCategory\('(.+?)'\)/)[1];
            card.addEventListener('click', function() {
                showCategory(category);
            });
        }
    });
});
