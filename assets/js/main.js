// Show categories (main page)
function showCategories() {
    document.getElementById('categories').style.display = 'block';
    document.querySelectorAll('.tools-section').forEach(section => {
        section.classList.remove('active');
    });
}

// Show specific category tools
function showCategory(category) {
    console.log('Showing category:', category); // Debug log
    
    // Hide all sections first
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected category's tools section
    const toolsSection = document.getElementById(category + '-tools');
    if (toolsSection) {
        toolsSection.style.display = 'block';
        
        // Load tools if not already loaded
        const grid = document.getElementById(category + '-grid');
        if (grid && grid.children.length === 0) {
            loadCategoryTools(category);
        }
    } else {
        console.error('Tools section not found for category:', category);
        return;
    }
    
    // Handle navigation
    const backBtn = document.createElement('div');
    backBtn.className = 'back-to-categories mb-4';
    backBtn.innerHTML = `<button onclick="showCategories()" class="btn btn-link">
        <i class="fas fa-arrow-left"></i> Back to Categories
    </button>`;
    
    const container = toolsSection.querySelector('.container');
    if (container && !container.querySelector('.back-to-categories')) {
        container.insertBefore(backBtn, container.firstChild);
    }
}

// Load tools for a specific category
function loadCategoryTools(category) {
    const grid = document.getElementById(category + '-grid');
    const tools = toolCategories[category] || [];
    
    grid.innerHTML = '';
    
    tools.forEach(toolId => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        
        // If the calculator exists, use its info, otherwise create a placeholder
        const tool = calculators[toolId] || {
            title: toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            icon: 'fas fa-calculator',
            inputs: [
                { id: 'value', label: 'Value', type: 'number', placeholder: 'Enter value' }
            ],
            calculate: function(inputs) {
                return 'Coming soon!';
            }
        };
        
        toolCard.onclick = () => openCalculator(toolId);
        
        toolCard.innerHTML = `
            <div class="tool-icon">
                <i class="${tool.icon}"></i>
            </div>
            <h4 class="tool-title">${tool.title}</h4>
            <p class="tool-description">Professional ${tool.title.toLowerCase()} with instant results</p>
        `;
        
        grid.appendChild(toolCard);
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
    const formContainer = document.getElementById('calculator-form');
    
    let formHTML = `<form id="calc-form" class="needs-validation" onsubmit="calculateResult(event, '${calcId}')">`;
    
    calc.inputs.forEach(input => {
        formHTML += `<div class="mb-3">`;
        
        // Add label
        formHTML += `<label for="${input.id}" class="form-label">${input.label}</label>`;
        
        // Add input field based on type
        if (input.type === 'select') {
            formHTML += `<select class="form-control" id="${input.id}" name="${input.id}" ${input.required ? 'required' : ''}>`;
            input.options.forEach(option => {
                formHTML += `<option value="${option}">${option}</option>`;
            });
            formHTML += `</select>`;
        } else if (input.type === 'text') {
            formHTML += `<input type="text" class="form-control" id="${input.id}" name="${input.id}"
                placeholder="${input.placeholder || ''}" ${input.required ? 'required' : ''}>`;
        } else {
            formHTML += `<input type="${input.type}" class="form-control" id="${input.id}" name="${input.id}"
                placeholder="${input.placeholder || ''}"
                ${input.step ? 'step="' + input.step + '"' : ''}
                ${input.min ? 'min="' + input.min + '"' : ''}
                ${input.max ? 'max="' + input.max + '"' : ''}
                ${input.required ? 'required' : ''}>`;
        }
        
        formHTML += `</div>`;
    });
    
    formHTML += `
        <div class="text-center">
            <button type="submit" class="btn btn-primary px-4">Calculate</button>
        </div>
    </form>`;
    
    formContainer.innerHTML = formHTML;
    document.getElementById('calculator-result').innerHTML = '';
    
    const modal = new bootstrap.Modal(document.getElementById('calculatorModal'));
    modal.show();
}

// Calculate result
function calculateResult(event, calcId) {
    event.preventDefault();
    
    const calc = calculators[calcId];
    if (!calc) {
        showError('Calculator not found');
        return;
    }
    
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
        <div class="alert alert-success mb-0">
            <pre class="mb-0" style="white-space: pre-wrap;">${result}</pre>
        </div>
    `;
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById('calculator-result');
    resultContainer.innerHTML = `
        <div class="alert alert-danger mb-0">
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showCategories();
});
