// Calculator definitions
const calculators = {
    // Financial Calculators
    'loan': {
        title: 'Loan Calculator',
        icon: 'fas fa-money-check-alt',
        inputs: [
            { id: 'principal', label: 'Loan Amount ($)', type: 'number', placeholder: 'Enter loan amount' },
            { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'Enter interest rate', step: '0.01' },
            { id: 'years', label: 'Loan Term (years)', type: 'number', placeholder: 'Enter loan term' }
        ],
        calculate: function(inputs) {
            const principal = parseFloat(inputs.principal) || 0;
            const rate = parseFloat(inputs.rate) / 100 / 12;
            const payments = parseInt(inputs.years) * 12;
            
            if (rate === 0) {
                return `Monthly Payment: $${(principal / payments).toFixed(2)}`;
            }
            
            const monthlyPayment = principal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
            const totalPayment = monthlyPayment * payments;
            const totalInterest = totalPayment - principal;
            
            return `Monthly Payment: $${monthlyPayment.toFixed(2)}\nTotal Interest: $${totalInterest.toFixed(2)}\nTotal Amount: $${totalPayment.toFixed(2)}`;
        }
    },
    'mortgage': {
        title: 'Mortgage Calculator',
        icon: 'fas fa-home',
        inputs: [
            { id: 'homePrice', label: 'Home Price ($)', type: 'number', placeholder: 'Enter home price' },
            { id: 'downPayment', label: 'Down Payment ($)', type: 'number', placeholder: 'Enter down payment' },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: 'Enter interest rate', step: '0.01' },
            { id: 'years', label: 'Loan Term (years)', type: 'number', placeholder: 'Enter loan term' }
        ],
        calculate: function(inputs) {
            const homePrice = parseFloat(inputs.homePrice) || 0;
            const downPayment = parseFloat(inputs.downPayment) || 0;
            const principal = homePrice - downPayment;
            const rate = parseFloat(inputs.rate) / 100 / 12;
            const payments = parseInt(inputs.years) * 12;
            
            if (rate === 0) {
                return `Monthly Payment: $${(principal / payments).toFixed(2)}`;
            }
            
            const monthlyPayment = principal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
            const downPaymentPercent = (downPayment / homePrice * 100).toFixed(1);
            
            return `Monthly Payment: $${monthlyPayment.toFixed(2)}\nLoan Amount: $${principal.toFixed(2)}\nDown Payment: ${downPaymentPercent}%`;
        }
    },
    'compound-interest': {
        title: 'Compound Interest Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'principal', label: 'Initial Investment ($)', type: 'number', placeholder: 'Enter initial amount' },
            { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'Enter interest rate', step: '0.01' },
            { id: 'years', label: 'Investment Period (years)', type: 'number', placeholder: 'Enter number of years' },
            { id: 'compound', label: 'Compounding Frequency', type: 'select', options: ['Annually', 'Semi-annually', 'Quarterly', 'Monthly', 'Daily'] }
        ],
        calculate: function(inputs) {
            const principal = parseFloat(inputs.principal) || 0;
            const rate = parseFloat(inputs.rate) / 100;
            const years = parseInt(inputs.years) || 0;
            
            const frequencies = {
                'Annually': 1,
                'Semi-annually': 2,
                'Quarterly': 4,
                'Monthly': 12,
                'Daily': 365
            };
            
            const n = frequencies[inputs.compound] || 1;
            const amount = principal * Math.pow(1 + rate / n, n * years);
            const interest = amount - principal;
            
            return `Final Amount: $${amount.toFixed(2)}\nInterest Earned: $${interest.toFixed(2)}\nTotal Return: ${((interest / principal) * 100).toFixed(2)}%`;
        }
    }
    // More calculators will be added based on categories
};

// Tool categories with all calculators
const toolCategories = {
    financial: ['loan', 'mortgage', 'compound-interest', 'investment', 'savings', 'retirement', 'tax', 'budget', 'car-loan', 'credit-card', 'depreciation'],
    math: ['percentage', 'fraction', 'algebra', 'quadratic', 'trigonometry', 'scientific', 'statistics', 'fibonacci', 'prime', 'gcd-lcm', 'factorial'],
    health: ['bmi', 'calorie', 'body-fat', 'ideal-weight', 'water-intake', 'heart-rate', 'pregnancy', 'protein', 'sleep'],
    engineering: ['ohms-law', 'power-consumption', 'resistor-color', 'voltage-divider', 'capacitor', 'inductor'],
    conversion: ['length-conversion', 'temperature-conversion', 'weight-conversion', 'area-conversion', 'volume-conversion', 'speed-conversion'],
    business: ['roi', 'break-even', 'markup', 'payroll', 'cash-flow'],
    time: ['age-calculator', 'date-difference', 'time-zone', 'working-days'],
    pdf: ['pdf-merge', 'pdf-split', 'pdf-compress'],
    text: ['word-count', 'case-converter', 'text-reverse'],
    utility: ['grade', 'fuel-economy', 'password-strength', 'random-generator', 'unit-price', 'color-converter']
};
