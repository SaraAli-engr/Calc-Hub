// Show categories (main page)
// Ensure functions are globally accessible
window.showCategory = showCategory;
window.showCategories = showCategories;
window.showCalculator = showCalculator;
window.backToCalculatorList = backToCalculatorList;
window.calculateResult = calculateResult;
window.goToHomePage = goToHomePage;

// Global variable to track current category
let currentCategory = null;

// Windows Calculator Global Functions
window.initWindowsCalculator = function() {
    // Calculator state
    window.currentValue = '0';
    window.previousValue = null;
    window.operator = null;
    window.waitingForOperand = false;
    window.calculatorMemory = 0;
    window.calculatorHistory = [];
    window.currentMode = 'standard';
    window.angleUnit = 'deg'; // 'deg' or 'rad'
    window.currentBase = 'DEC'; // 'HEX', 'DEC', 'OCT', 'BIN'
    window.inverseMode = false;
    window.graphScale = 1;
    window.graphOffsetX = 0;
    window.graphOffsetY = 0;
    
    // Initialize display
    window.updateDisplay();
    window.updateMemoryDisplay();
    window.updateHistoryDisplay();
    
    // Initialize programmer mode base buttons
    setTimeout(() => {
        window.updateBaseButtons();
        window.updateBitDisplay(0);
    }, 200);
    
    // Add keyboard event listener
    document.addEventListener('keydown', window.handleKeyboardInput);
};

// Display functions
window.updateDisplay = function() {
    const resultElement = document.getElementById('calc-result');
    if (resultElement) {
        resultElement.textContent = window.currentValue;
    }
};

window.updateExpression = function(expression) {
    const expressionElement = document.getElementById('calc-expression');
    if (expressionElement) {
        expressionElement.textContent = expression;
    }
};

// Mode switching functions
window.switchMode = function(mode) {
    window.currentMode = mode;
    
    // Update mode buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Hide all keypads
    const keypads = document.querySelectorAll('.calculator-mode-panel');
    keypads.forEach(keypad => keypad.style.display = 'none');
    
    // Show selected keypad
    const targetKeypad = document.getElementById(`${mode}-keypad`);
    if (targetKeypad) targetKeypad.style.display = 'block';
    
    // Update display based on mode
    if (mode === 'programmer') {
        window.updateProgrammerDisplay();
        window.updateBaseButtons();
        window.updateBitDisplay(window.getCurrentDecimal());
    } else if (mode === 'graphing') {
        setTimeout(() => {
            window.initGraphingMode();
        }, 100);
    }
    
    // Clear current calculation when switching modes
    window.clearAll();
};

// Scientific calculator functions
window.calculateTrig = function(func) {
    const value = parseFloat(window.currentValue);
    let angleValue = value;
    
    // Convert to radians if in degree mode
    if (window.angleUnit === 'deg') {
        angleValue = value * (Math.PI / 180);
    }
    
    let result;
    const isInverse = window.inverseMode;
    
    switch(func) {
        case 'sin':
            result = isInverse ? Math.asin(value) : Math.sin(angleValue);
            break;
        case 'cos':
            result = isInverse ? Math.acos(value) : Math.cos(angleValue);
            break;
        case 'tan':
            result = isInverse ? Math.atan(value) : Math.tan(angleValue);
            break;
    }
    
    // Convert back to degrees if needed for inverse functions
    if (isInverse && window.angleUnit === 'deg') {
        result = result * (180 / Math.PI);
    }
    
    window.currentValue = String(result);
    window.updateDisplay();
    window.updateExpression(`${isInverse ? 'arc' : ''}${func}(${value})`);
    window.inverseMode = false; // Reset inverse mode
    window.updateInverseButton();
};

window.calculateFunction = function(func) {
    const value = parseFloat(window.currentValue);
    let result;
    
    switch(func) {
        case 'ln':
            result = Math.log(value);
            break;
        case 'log':
            result = Math.log10(value);
            break;
        case 'exp':
            result = Math.exp(value);
            break;
        case 'pow10':
            result = Math.pow(10, value);
            break;
        case 'sqrt':
            result = Math.sqrt(value);
            break;
        case 'cubert':
            result = Math.cbrt(value);
            break;
        case 'factorial':
            if (value >= 0 && Number.isInteger(value) && value <= 170) {
                result = window.factorial(value);
            } else {
                window.showError('Factorial only works with non-negative integers ≤ 170');
                return;
            }
            break;
        case 'inv':
            window.inverseMode = !window.inverseMode;
            window.updateInverseButton();
            return;
    }
    
    window.currentValue = String(result);
    window.updateDisplay();
    window.updateExpression(`${func}(${value})`);
};

window.factorial = function(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

window.calculatePower = function() {
    if (window.operator === null) {
        window.previousValue = parseFloat(window.currentValue);
        window.operator = '^';
        window.waitingForOperand = true;
        window.updateExpression(window.currentValue + '^');
    }
};

window.inputConstant = function(constant) {
    switch(constant) {
        case 'π':
            window.currentValue = String(Math.PI);
            break;
        case 'e':
            window.currentValue = String(Math.E);
            break;
    }
    window.updateDisplay();
};

window.inputBracket = function(bracket) {
    // For now, just add to display - full expression parsing would need more complex implementation
    if (window.waitingForOperand) {
        window.currentValue = bracket;
        window.waitingForOperand = false;
    } else {
        window.currentValue += bracket;
    }
    window.updateDisplay();
};

window.toggleAngleUnit = function() {
    window.angleUnit = window.angleUnit === 'deg' ? 'rad' : 'deg';
    const angleBtn = document.getElementById('angle-unit-btn');
    if (angleBtn) {
        angleBtn.textContent = window.angleUnit.toUpperCase();
    }
};

window.updateInverseButton = function() {
    const invBtn = document.getElementById('inv-btn');
    if (invBtn) {
        invBtn.classList.toggle('active', window.inverseMode);
    }
};

// Programmer mode functions
window.switchBase = function(base) {
    const currentDecimal = window.getCurrentDecimal();
    window.currentBase = base;
    
    // Update base buttons
    const baseButtons = document.querySelectorAll('.base-btn');
    baseButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-base="${base}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Convert and display in new base
    window.currentValue = window.convertFromDecimal(currentDecimal, base);
    window.updateDisplay();
    window.updateBaseButtons();
    window.updateBitDisplay(currentDecimal);
};

window.getCurrentDecimal = function() {
    switch(window.currentBase) {
        case 'HEX':
            return parseInt(window.currentValue, 16) || 0;
        case 'DEC':
            return parseInt(window.currentValue, 10) || 0;
        case 'OCT':
            return parseInt(window.currentValue, 8) || 0;
        case 'BIN':
            return parseInt(window.currentValue, 2) || 0;
        default:
            return parseInt(window.currentValue, 10) || 0;
    }
};

window.convertFromDecimal = function(decimal, base) {
    switch(base) {
        case 'HEX':
            return decimal.toString(16).toUpperCase();
        case 'DEC':
            return decimal.toString(10);
        case 'OCT':
            return decimal.toString(8);
        case 'BIN':
            return decimal.toString(2);
        default:
            return decimal.toString(10);
    }
};

window.updateBaseButtons = function() {
    // Enable/disable number buttons based on current base
    const buttons = {
        'BIN': ['0', '1'],
        'OCT': ['0', '1', '2', '3', '4', '5', '6', '7'],
        'DEC': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'HEX': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    };
    
    const enabledButtons = buttons[window.currentBase] || buttons['DEC'];
    
    // Disable/enable number buttons
    for (let i = 0; i <= 9; i++) {
        const btn = document.getElementById(`btn-${i}`);
        if (btn) {
            btn.disabled = !enabledButtons.includes(String(i));
            btn.style.opacity = btn.disabled ? '0.3' : '1';
        }
    }
    
    // Disable/enable hex buttons
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => {
        const btn = document.getElementById(`btn-${letter}`);
        if (btn) {
            btn.disabled = !enabledButtons.includes(letter);
            btn.style.opacity = btn.disabled ? '0.3' : '1';
        }
    });
};

window.updateBitDisplay = function(decimal) {
    const bitDisplay = document.getElementById('bit-display');
    if (bitDisplay) {
        const binary = Math.abs(decimal).toString(2).padStart(16, '0');
        const bitGroups = [];
        for (let i = 0; i < 16; i += 4) {
            bitGroups.push(binary.substr(i, 4));
        }
        bitDisplay.innerHTML = bitGroups.map(group => 
            `<span class="bit-group">${group}</span>`
        ).join('');
    }
};

window.calculateBitwise = function(operation) {
    const current = window.getCurrentDecimal();
    
    if (operation === 'not') {
        const result = ~current & 0xFFFFFFFF; // 32-bit NOT
        window.currentValue = window.convertFromDecimal(result, window.currentBase);
        window.updateDisplay();
        window.updateBitDisplay(result);
        return;
    }
    
    // For other bitwise operations, set up for two-operand calculation
    if (window.operator === null) {
        window.previousValue = current;
        window.operator = operation;
        window.waitingForOperand = true;
        window.updateExpression(window.currentValue + ' ' + operation.toUpperCase());
    }
};

// Graphing mode functions
window.plotFunction = function() {
    const functionInput = document.getElementById('function-input');
    if (!functionInput) return;
    
    const funcText = functionInput.value.trim();
    if (!funcText) return;
    
    const canvas = document.getElementById('graphing-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    window.drawAxes(ctx, width, height);
    
    // Parse and plot function
    try {
        window.plotMathFunction(ctx, funcText, width, height);
    } catch (error) {
        alert('Error plotting function: ' + error.message);
    }
};

window.drawAxes = function(ctx, width, height) {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    const gridSize = 20 * window.graphScale;
    
    for (let x = width / 2 % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = height / 2 % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
};

window.plotMathFunction = function(ctx, funcText, width, height) {
    // Simple function parser - supports basic math functions
    const func = new Function('x', `return ${funcText.replace(/\^/g, '**')}`);
    
    ctx.strokeStyle = '#0078d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    let firstPoint = true;
    const scale = window.graphScale;
    const centerX = width / 2 + window.graphOffsetX;
    const centerY = height / 2 + window.graphOffsetY;
    
    for (let px = 0; px < width; px++) {
        const x = (px - centerX) / (20 * scale);
        try {
            const y = func(x);
            const py = centerY - y * 20 * scale;
            
            if (isFinite(y) && py >= 0 && py <= height) {
                if (firstPoint) {
                    ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, py);
                }
            } else {
                firstPoint = true;
            }
        } catch (e) {
            firstPoint = true;
        }
    }
    
    ctx.stroke();
};

window.clearGraph = function() {
    const canvas = document.getElementById('graphing-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.drawAxes(ctx, canvas.width, canvas.height);
    }
    
    const functionInput = document.getElementById('function-input');
    if (functionInput) {
        functionInput.value = '';
    }
};

window.zoomIn = function() {
    window.graphScale *= 1.2;
    window.plotFunction();
};

window.zoomOut = function() {
    window.graphScale /= 1.2;
    window.plotFunction();
};

window.resetView = function() {
    window.graphScale = 1;
    window.graphOffsetX = 0;
    window.graphOffsetY = 0;
    window.plotFunction();
};

// Sidebar functions
window.toggleHistory = function() {
    const sidebar = document.getElementById('calc-sidebar');
    const historyPanel = document.getElementById('history-panel');
    const memoryPanel = document.getElementById('memory-panel');
    
    if (sidebar.style.display === 'none' || !historyPanel.style.display || historyPanel.style.display === 'none') {
        sidebar.style.display = 'block';
        historyPanel.style.display = 'block';
        memoryPanel.style.display = 'none';
    } else {
        sidebar.style.display = 'none';
    }
};

window.toggleMemory = function() {
    const sidebar = document.getElementById('calc-sidebar');
    const historyPanel = document.getElementById('history-panel');
    const memoryPanel = document.getElementById('memory-panel');
    
    if (sidebar.style.display === 'none' || !memoryPanel.style.display || memoryPanel.style.display === 'none') {
        sidebar.style.display = 'block';
        memoryPanel.style.display = 'block';
        historyPanel.style.display = 'none';
    } else {
        sidebar.style.display = 'none';
    }
};

// Enhanced keyboard support
window.handleKeyboardInput = function(event) {
    const key = event.key;
    
    // Prevent default for calculator keys
    if ('0123456789+-*/=.'.includes(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
    }
    
    // Number input
    if (/[0-9]/.test(key)) {
        window.inputNumber(key);
    }
    // Operators
    else if (key === '+') {
        window.inputOperation('+');
    }
    else if (key === '-') {
        window.inputOperation('-');
    }
    else if (key === '*') {
        window.inputOperation('×');
    }
    else if (key === '/') {
        window.inputOperation('÷');
    }
    // Decimal point
    else if (key === '.') {
        window.inputDecimal();
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        window.calculateResultWin();
    }
    // Clear
    else if (key === 'Escape') {
        window.clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        window.backspace();
    }
    // Programmer mode hex input
    else if (window.currentMode === 'programmer' && /[A-F]/.test(key.toUpperCase())) {
        window.inputNumber(key.toUpperCase());
    }
};

// Enhanced calculation with power operator
window.performCalculation = function() {
    const prev = window.previousValue;
    const current = parseFloat(window.currentValue);
    
    switch (window.operator) {
        case '+':
            return prev + current;
        case '-':
        case '−':
            return prev - current;
        case '×':
            return prev * current;
        case '÷':
            return current !== 0 ? prev / current : 0;
        case '^':
            return Math.pow(prev, current);
        case 'and':
            return prev & current;
        case 'or':
            return prev | current;
        case 'xor':
            return prev ^ current;
        case 'lsh':
            return prev << current;
        case 'rsh':
            return prev >> current;
        default:
            return current;
    }
};

// Enhanced number input for programmer mode
window.inputNumber = function(num) {
    // Check if the input is valid for current base in programmer mode
    if (window.currentMode === 'programmer') {
        const validChars = {
            'BIN': ['0', '1'],
            'OCT': ['0', '1', '2', '3', '4', '5', '6', '7'],
            'DEC': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            'HEX': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        };
        
        if (!validChars[window.currentBase].includes(num)) {
            return; // Invalid input for current base
        }
    }
    
    if (window.waitingForOperand) {
        window.currentValue = num;
        window.waitingForOperand = false;
    } else {
        window.currentValue = window.currentValue === '0' ? num : window.currentValue + num;
    }
    
    window.updateDisplay();
    
    // Update bit display in programmer mode
    if (window.currentMode === 'programmer') {
        window.updateBitDisplay(window.getCurrentDecimal());
    }
};

// Error display function for Windows Calculator
window.showError = function(message) {
    window.currentValue = 'Error';
    window.updateDisplay();
    window.updateExpression(message);
    setTimeout(() => {
        window.clearAll();
    }, 2000);
};

// Enhanced programmer mode display update
window.updateProgrammerDisplay = function() {
    if (window.currentMode === 'programmer') {
        const decimal = window.getCurrentDecimal();
        window.updateBitDisplay(decimal);
    }
};

// Additional scientific functions
window.calculateLog = function(base) {
    const value = parseFloat(window.currentValue);
    let result;
    
    if (base === 'e') {
        result = Math.log(value);
        window.updateExpression(`ln(${value})`);
    } else if (base === '10') {
        result = Math.log10(value);
        window.updateExpression(`log(${value})`);
    } else if (base === '2') {
        result = Math.log2(value);
        window.updateExpression(`log2(${value})`);
    }
    
    window.currentValue = String(result);
    window.updateDisplay();
};

// Additional utility functions
window.calculateCube = function() {
    const value = parseFloat(window.currentValue);
    const result = Math.pow(value, 3);
    window.currentValue = String(result);
    window.updateDisplay();
    window.updateExpression('cube(' + value + ')');
};

window.calculateAbs = function() {
    const value = parseFloat(window.currentValue);
    const result = Math.abs(value);
    window.currentValue = String(result);
    window.updateDisplay();
    window.updateExpression('abs(' + value + ')');
};

// Initialize graphing canvas when switching to graphing mode
window.initGraphingMode = function() {
    if (window.currentMode === 'graphing') {
        const canvas = document.getElementById('graphing-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            window.drawAxes(ctx, canvas.width, canvas.height);
        }
    }
};

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
    // Store current category
    currentCategory = category;
    
    // Update URL
    const categoryUrl = urlMapping[category];
    if (categoryUrl) {
        updateUrl('/' + categoryUrl);
    }
    
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
    
    // Update URL for individual calculator
    if (currentCategory) {
        const categoryUrl = urlMapping[currentCategory];
        const calculatorUrl = getCalculatorUrl(calcId);
        if (categoryUrl && calculatorUrl) {
            updateUrl('/' + categoryUrl + '/' + calculatorUrl);
        }
    }
    
    // Show the form container and hide the calculator list
    document.getElementById('calculator-list-items').style.display = 'none';
    document.getElementById('calculator-form-container').style.display = 'block';
    document.getElementById('calculator-form-title').textContent = calc.title;
    
    // Hide the "Back to Categories" button as we're in a specific tool now
    if (document.getElementById('back-button')) {
        document.getElementById('back-button').style.display = 'none';
    }
    
    // Check if this is a custom interface calculator
    if (calc.isCustomInterface && calc.renderCustomInterface) {
        // Render custom interface (like Windows Calculator)
        document.getElementById('calculator-content').innerHTML = calc.renderCustomInterface();
        document.getElementById('calculator-result').style.display = 'none';
        return;
    }
    
    // Standard form-based calculator interface
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
                Back to Tools
            </button>
        </div>
    `;    document.getElementById('calculator-content').innerHTML = formHTML;
    document.getElementById('calculator-result').style.display = 'none';
}

// Back to calculator list function
function backToCalculatorList() {
    // Update URL back to category page
    if (currentCategory) {
        const categoryUrl = urlMapping[currentCategory];
        if (categoryUrl) {
            updateUrl('/' + categoryUrl);
        }
    }
    
    // Clean up Windows Calculator if it was active
    if (typeof window.handleKeyboardInput === 'function') {
        document.removeEventListener('keydown', window.handleKeyboardInput);
    }
    
    // Show the tools list and hide the calculator form
    document.getElementById('calculator-list-items').style.display = 'grid';
    document.getElementById('calculator-form-container').style.display = 'none';
    document.getElementById('calculator-result').style.display = 'none';
    
    // Show the "Back to Categories" button again
    if (document.getElementById('back-button')) {
        document.getElementById('back-button').style.display = 'inline-flex';
    }
}

// Function to show categories (go back from category view to home)
function showCategories() {
    updateUrl('/');
    goToHomePage();
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

// Windows Calculator Global Functions
window.initWindowsCalculator = function() {
    // Calculator state
    window.currentValue = '0';
    window.previousValue = null;
    window.operator = null;
    window.waitingForOperand = false;
    window.calculatorMemory = 0;
    window.calculatorHistory = [];
    window.currentMode = 'standard';
    window.angleUnit = 'deg'; // 'deg' or 'rad'
    window.currentBase = 'DEC'; // 'HEX', 'DEC', 'OCT', 'BIN'
    window.inverseMode = false;
    window.graphScale = 1;
    window.graphOffsetX = 0;
    window.graphOffsetY = 0;
    
    // Initialize display
    window.updateDisplay();
    window.updateMemoryDisplay();
    window.updateHistoryDisplay();
    
    // Initialize programmer mode base buttons
    setTimeout(() => {
        window.updateBaseButtons();
        window.updateBitDisplay(0);
    }, 200);
    
    // Add keyboard event listener
    document.addEventListener('keydown', window.handleKeyboardInput);
};

// Display functions
window.updateDisplay = function() {
    const resultElement = document.getElementById('calc-result');
    if (resultElement) {
        resultElement.textContent = window.currentValue;
    }
};

window.updateExpression = function(expression) {
    const expressionElement = document.getElementById('calc-expression');
    if (expressionElement) {
        expressionElement.textContent = expression;
    }
};

// Decimal input
window.inputDecimal = function() {
    if (window.waitingForOperand) {
        window.currentValue = '0.';
        window.waitingForOperand = false;
    } else if (window.currentValue.indexOf('.') === -1) {
        window.currentValue += '.';
    }
    window.updateDisplay();
};

// Clear functions
window.clearAll = function() {
    window.currentValue = '0';
    window.previousValue = null;
    window.operator = null;
    window.waitingForOperand = false;
    window.updateDisplay();
    window.updateExpression('');
};

window.clearEntry = function() {
    window.currentValue = '0';
    window.updateDisplay();
};

window.backspace = function() {
    if (window.currentValue.length > 1) {
        window.currentValue = window.currentValue.slice(0, -1);
    } else {
        window.currentValue = '0';
    }
    window.updateDisplay();
};

// Operations
window.inputOperation = function(nextOperator) {
    const inputValue = parseFloat(window.currentValue);
    
    if (window.previousValue === null) {
        window.previousValue = inputValue;
    } else if (window.operator) {
        const result = window.performCalculation();
        window.currentValue = String(result);
        window.previousValue = result;
        window.updateDisplay();
    }
    
    window.waitingForOperand = true;
    window.operator = nextOperator;
    window.updateExpression(window.previousValue + ' ' + nextOperator);
};

window.calculateResultWin = function() {
    const inputValue = parseFloat(window.currentValue);
    
    if (window.previousValue !== null && window.operator) {
        const result = window.performCalculation();
        const expression = window.previousValue + ' ' + window.operator + ' ' + window.currentValue + ' =';
        
        // Add to history
        window.addToHistory(expression, result);
        
        window.currentValue = String(result);
        window.previousValue = null;
        window.operator = null;
        window.waitingForOperand = true;
        
        window.updateDisplay();
        window.updateExpression(expression);
    }
};

// Advanced functions
window.calculatePercentage = function() {
    const value = parseFloat(window.currentValue);
    window.currentValue = String(value / 100);
    window.updateDisplay();
};

window.calculateSquare = function() {
    const value = parseFloat(window.currentValue);
    const result = Math.pow(value, 2);
    window.currentValue = String(result);
    window.updateDisplay();
    window.updateExpression('sqr(' + value + ')');
};

window.calculateSquareRoot = function() {
    const value = parseFloat(window.currentValue);
    if (value >= 0) {
        const result = Math.sqrt(value);
        window.currentValue = String(result);
        window.updateDisplay();
        window.updateExpression('√(' + value + ')');
    }
};

window.calculateReciprocal = function() {
    const value = parseFloat(window.currentValue);
    if (value !== 0) {
        const result = 1 / value;
        window.currentValue = String(result);
        window.updateDisplay();
        window.updateExpression('1/(' + value + ')');
    }
};

window.toggleSign = function() {
    if (window.currentValue !== '0') {
        window.currentValue = window.currentValue.startsWith('-') 
            ? window.currentValue.slice(1) 
            : '-' + window.currentValue;
        window.updateDisplay();
    }
};

// Memory functions
window.memoryOperation = function(operation) {
    const value = parseFloat(window.currentValue);
    
    switch (operation) {
        case 'clear':
            window.calculatorMemory = 0;
            window.updateMemoryDisplay();
            break;
        case 'recall':
            window.currentValue = String(window.calculatorMemory);
            window.updateDisplay();
            break;
        case 'add':
            window.calculatorMemory += value;
            window.updateMemoryDisplay();
            break;
        case 'subtract':
            window.calculatorMemory -= value;
            window.updateMemoryDisplay();
            break;
        case 'store':
            window.calculatorMemory = value;
            window.updateMemoryDisplay();
            break;
    }
};

window.updateMemoryDisplay = function() {
    const memoryList = document.getElementById('memory-list');
    if (memoryList) {
        if (window.calculatorMemory !== 0) {
            memoryList.innerHTML = '<div class="memory-item" onclick="window.recallMemory()">' + 
                                 '<div class="history-result">' + window.calculatorMemory + '</div></div>';
        } else {
            memoryList.innerHTML = '<p class="no-memory">There\'s nothing saved in memory.</p>';
        }
    }
};

window.recallMemory = function() {
    window.currentValue = String(window.calculatorMemory);
    window.updateDisplay();
};

window.clearMemory = function() {
    window.calculatorMemory = 0;
    window.updateMemoryDisplay();
};

// History functions
window.addToHistory = function(expression, result) {
    window.calculatorHistory.unshift({ expression, result });
    if (window.calculatorHistory.length > 20) {
        window.calculatorHistory = window.calculatorHistory.slice(0, 20);
    }
    window.updateHistoryDisplay();
};

window.updateHistoryDisplay = function() {
    const historyList = document.getElementById('history-list');
    if (historyList) {
        if (window.calculatorHistory.length > 0) {
            historyList.innerHTML = window.calculatorHistory.map(item => 
                '<div class="history-item" onclick="window.recallHistory(' + item.result + ')">' +
                '<div class="history-expression">' + item.expression + '</div>' +
                '<div class="history-result">' + item.result + '</div>' +
                '</div>'
            ).join('');
        } else {
            historyList.innerHTML = '<p class="no-history">There\'s no history yet.</p>';
        }
    }
};

window.recallHistory = function(result) {
    window.currentValue = String(result);
    window.updateDisplay();
};

window.clearHistory = function() {
    window.calculatorHistory = [];
    window.updateHistoryDisplay();
};

// Function to navigate back to home page
function goToHomePage() {
    // Update URL to home
    updateUrl('/');
    
    // Reset current category
    currentCategory = null;
    
    // Reset all UI states
    const calculatorDisplay = document.getElementById('calculator-display');
    if (calculatorDisplay) {
        calculatorDisplay.style.display = 'none';
    }
    
    const calculatorFormContainer = document.getElementById('calculator-form-container');
    if (calculatorFormContainer) {
        calculatorFormContainer.style.display = 'none';
    }
    
    const calculatorListItems = document.getElementById('calculator-list-items');
    if (calculatorListItems) {
        calculatorListItems.style.display = 'grid';
    }
    
    // Show categories section
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        categoriesSection.style.display = 'block';
    }
    
    // Show home section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.style.display = 'flex';
        homeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// URL routing system for SEO-friendly URLs
const urlMapping = {
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
};

const reverseUrlMapping = {};
Object.keys(urlMapping).forEach(key => {
    reverseUrlMapping[urlMapping[key]] = key;
});

// Calculator name to URL mapping
function getCalculatorUrl(calcId) {
    return calcId.replace(/([A-Z])/g, '-$1').toLowerCase() + '-calculator';
}

function getCalculatorIdFromUrl(url) {
    return url.replace(/-calculator$/, '').replace(/-/g, '_');
}

// Update URL without page reload
function updateUrl(path) {
    if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
        updateMetaTags(path);
        // Track page view for analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-C5XH1MXSQQ', {
                page_path: path,
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }
}

// Update meta tags for SEO
function updateMetaTags(path) {
    const pathParts = path.replace(/^\/+|\/+$/g, '').split('/');
    let title = 'CalcHub - 150+ Free Online Calculator Tools';
    let description = 'CalcHub offers 150+ free online calculator tools for financial planning, health monitoring, mathematical calculations, and engineering projects.';
    let keywords = 'calculator, online calculator, financial calculator, math calculator, free calculator tools';
    
    if (pathParts.length === 1 && pathParts[0]) {
        // Category page
        const categoryKey = reverseUrlMapping[pathParts[0]];
        if (categoryKey) {
            const categoryTitles = {
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
            };
            
            const categoryTitle = categoryTitles[categoryKey];
            title = `${categoryTitle} | Free Online Tools | CalcHub`;
            description = `Professional ${categoryTitle.toLowerCase()} for accurate calculations. Free, fast, and reliable tools for all your calculation needs.`;
            keywords = `${categoryKey} calculator, ${categoryTitle.toLowerCase()}, online ${categoryKey} tools, free calculator`;
        }
    } else if (pathParts.length === 2) {
        // Individual calculator page
        const categoryKey = reverseUrlMapping[pathParts[0]];
        const calculatorUrl = pathParts[1];
        const calcId = getCalculatorIdFromUrl(calculatorUrl);
        
        if (categoryKey && calculators[calcId]) {
            const calc = calculators[calcId];
            title = `${calc.title} | Free Online Tool | CalcHub`;
            description = `Free ${calc.title.toLowerCase()} - Professional online tool for accurate calculations. Fast, reliable, and easy to use.`;
            keywords = `${calc.title.toLowerCase()}, ${categoryKey} calculator, online calculator tool, free calculator`;
        }
    }
    
    // Update title
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Open Graph title and description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', title);
    }
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
        ogDesc.setAttribute('content', description);
    }
    
    // Update Twitter card title and description
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
    }
    
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
        twitterDesc.setAttribute('content', description);
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.setAttribute('href', `https://www.tahir.engineer${path}`);
    }
}

// Main routing handler
function handleRouting(path) {
    path = path || window.location.pathname;
    
    // Remove leading and trailing slashes
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    
    if (!cleanPath || cleanPath === '') {
        // Home page
        goToHomePage();
        return;
    }
    
    const pathParts = cleanPath.split('/');
    
    if (pathParts.length === 1) {
        // Category page (e.g., /math-calculators)
        const categoryKey = reverseUrlMapping[pathParts[0]];
        if (categoryKey) {
            showCategory(categoryKey);
            return;
        }
    } else if (pathParts.length === 2) {
        // Individual calculator page (e.g., /math-calculators/quadratic-equation-calculator)
        const categoryKey = reverseUrlMapping[pathParts[0]];
        const calculatorUrl = pathParts[1];
        
        if (categoryKey && calculatorUrl) {
            const calcId = getCalculatorIdFromUrl(calculatorUrl);
            
            // Check if calculator exists in the category
            if (toolCategories[categoryKey] && toolCategories[categoryKey].includes(calcId)) {
                showCategory(categoryKey);
                setTimeout(() => showCalculator(calcId), 500);
                return;
            }
        }
    }
    
    // If no route matches, go to home page
    goToHomePage();
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to the CalcHub logo to navigate home
    const brandLogo = document.querySelector('.modern-brand');
    if (brandLogo) {
        brandLogo.addEventListener('click', function(e) {
            // Prevent default only if we're handling navigation internally
            // (not if we're already on a different page)
            if (!brandLogo.getAttribute('href').includes('.html')) {
                e.preventDefault();
                updateUrl('/');
                goToHomePage();
            }
        });
    }
    
    // Check for URL query parameter (from generated pages redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const calcParam = urlParams.get('calc');
    
    if (calcParam) {
        // Format: calc=category/calculator-id
        const parts = calcParam.split('/');
        if (parts.length === 2) {
            const categoryKey = parts[0];
            const calcId = parts[1];
            
            if (toolCategories[categoryKey] && toolCategories[categoryKey].includes(calcId)) {
                // Clean URL by removing query parameter
                window.history.replaceState({}, '', `/${urlMapping[categoryKey]}/${calcId}`);
                
                // Navigate to calculator
                showCategory(categoryKey);
                setTimeout(() => showCalculator(calcId), 300);
                return;
            }
        }
    }
    
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        // Format: category=categoryKey
        if (toolCategories[categoryParam]) {
            // Clean URL
            window.history.replaceState({}, '', `/${urlMapping[categoryParam]}`);
            showCategory(categoryParam);
            return;
        }
    }
    
    // Handle initial page load routing (for direct URL access)
    handleRouting();
    
    // Check if we have a hash in URL that indicates a section to navigate to (legacy support)
    if (window.location.hash === '#home') {
        updateUrl('/');
        goToHomePage();
    } else if (window.location.hash === '#categories') {
        updateUrl('/');
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.style.display = 'flex';
        }
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
            categoriesSection.style.display = 'block';
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
