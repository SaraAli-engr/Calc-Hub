// Show categories (main page)
function showCategories() {
    document.getElementById('categories').style.display = 'block';
    document.querySelectorAll('.tools-section').forEach(section => {
        section.classList.remove('active');
    });
}

// Show specific category tools
function showCategory(category) {
    document.getElementById('categories').style.display = 'none';
    document.querySelectorAll('.tools-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const toolsSection = document.getElementById(category + '-tools');
    if (toolsSection) {
        toolsSection.classList.add('active');
        loadCategoryTools(category);
    }
}

// Load tools for a specific category
function loadCategoryTools(category) {
    const grid = document.getElementById(category + '-grid');
    const tools = toolCategories[category] || [];
    
    grid.innerHTML = '';
    
    tools.forEach(toolId => {
        const tool = calculators[toolId];
        if (tool) {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.onclick = () => openCalculator(toolId);
            
            toolCard.innerHTML = `
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <h4 class="tool-title">${tool.title}</h4>
                <p class="tool-description">Professional ${tool.title.toLowerCase()} with instant results</p>
            `;
            
            grid.appendChild(toolCard);
        }
    });
}

// Open calculator modal
function openCalculator(calcId) {
    const calc = calculators[calcId];
    if (!calc) {
        alert('Calculator not found');
        return;
    }
    
    document.getElementById('calculator-title').textContent = calc.title;
    
    let formHTML = `<form onsubmit="calculateResult(event, '${calcId}')">`;
    
    calc.inputs.forEach(input => {
        if (input.type === 'select') {
            formHTML += `
                <div class="form-group">
                    <label class="form-label">${input.label}</label>
                    <select class="form-control" id="${input.id}" required>
                        ${input.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (input.type === 'textarea') {
            formHTML += `
                <div class="form-group">
                    <label class="form-label">${input.label}</label>
                    <textarea class="form-control" id="${input.id}" placeholder="${input.placeholder}" rows="4" style="resize: vertical; min-height: 100px;"></textarea>
                </div>
            `;
        } else {
            formHTML += `
                <div class="form-group">
                    <label class="form-label">${input.label}</label>
                    <input type="${input.type}" class="form-control" id="${input.id}" 
                           placeholder="${input.placeholder}" 
                           ${input.step ? `step="${input.step}"` : ''}
                           ${input.type === 'number' && !input.placeholder.includes('leave empty') ? 'required' : ''}>
                </div>
            `;
        }
    });
    
    formHTML += '<button type="submit" class="calculate-btn">Calculate Result</button></form>';
    
    document.getElementById('calculator-form').innerHTML = formHTML;
    document.getElementById('result-section').classList.remove('show');
    document.getElementById('calculator-modal').classList.add('active');
}

// Close calculator modal
function closeCalculator() {
    document.getElementById('calculator-modal').classList.remove('active');
}

// Calculate result
function calculateResult(event, calcId) {
    event.preventDefault();
    
    const calc = calculators[calcId];
    if (!calc) {
        showError('Calculator not found');
        return;
    }
    
    try {
        const inputs = {};
        let hasError = false;
        
        calc.inputs.forEach(input => {
            const element = document.getElementById(input.id);
            if (!element) {
                hasError = true;
                return;
            }
            
            const value = element.value.trim();
            if (input.type === 'number' && value !== '' && isNaN(parseFloat(value))) {
                hasError = true;
                element.classList.add('error');
                return;
            }
            
            inputs[input.id] = value;
        });
        
        if (hasError) {
            showError('Please check your inputs and try again');
            return;
        }
        
        const result = calc.calculate(inputs);
        if (!result) {
            showError('Calculation failed. Please try again with different inputs.');
            return;
        }
        
        document.getElementById('result-value').innerHTML = result.replace(/\n/g, '<br>');
        document.getElementById('result-section').classList.add('show');
        
        // Clear any previous errors
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    } catch (error) {
        showError(error.message || 'An unexpected error occurred');
    }
}

function showError(message) {
    document.getElementById('result-value').innerHTML = `<span class="text-danger"><i class="fas fa-exclamation-circle"></i> ${message}</span>`;
    document.getElementById('result-section').classList.add('show');
}
}

// Search functionality
function searchCalculators() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    for (const [category, tools] of Object.entries(toolCategories)) {
        const categoryKeywords = {
            financial: ['loan', 'mortgage', 'investment', 'money', 'finance'],
            math: ['math', 'calculation', 'algebra', 'geometry'],
            health: ['bmi', 'calorie', 'health', 'fitness'],
            engineering: ['engineering', 'electrical', 'mechanical'],
            conversion: ['convert', 'unit', 'measurement'],
            business: ['business', 'roi', 'profit'],
            time: ['time', 'date', 'age'],
            pdf: ['pdf', 'document'],
            text: ['text', 'word', 'string'],
            utility: ['utility', 'tool', 'calculator']
        };

        const keywords = categoryKeywords[category] || [];
        const toolNames = tools.map(t => calculators[t]?.title.toLowerCase() || '');
        
        if (keywords.some(k => searchTerm.includes(k)) || 
            toolNames.some(t => t.includes(searchTerm))) {
            showCategory(category);
            return;
        }
    }
    
    alert('No calculators found for: ' + searchTerm);
}

// Close modal when clicking outside
document.getElementById('calculator-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCalculator();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    showCategories();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
