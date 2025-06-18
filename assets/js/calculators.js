// Calculator definitions
const calculators = {
    'crypto-futures-pnl': {
        title: 'Futures PnL Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'side', label: 'Position Side', type: 'select', options: ['Long', 'Short'] },
            { id: 'size', label: 'Position Size (Contracts)', type: 'number', placeholder: 'Enter position size' },
            { id: 'entry', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'exit', label: 'Exit Price ($)', type: 'number', placeholder: 'Enter exit price', step: '0.000001' },
            { id: 'leverage', label: 'Leverage (x)', type: 'number', placeholder: 'Enter leverage', step: '0.1' }
        ],
        calculate: function(inputs) {
            const size = parseFloat(inputs.size) || 0;
            const entry = parseFloat(inputs.entry) || 0;
            const exit = parseFloat(inputs.exit) || 0;
            const leverage = parseFloat(inputs.leverage) || 1;
            const isLong = inputs.side === 'Long';
            
            const initialMargin = (size * entry) / leverage;
            const pnl = isLong ? 
                (exit - entry) * size :
                (entry - exit) * size;
            const roi = (pnl / initialMargin) * 100;
            
            return `Profit/Loss: $${pnl.toFixed(2)}
ROI: ${roi.toFixed(2)}%
Initial Margin: $${initialMargin.toFixed(2)}
Effective Leverage: ${leverage.toFixed(2)}x`;
        }
    },

    'crypto-lending-returns': {
        title: 'Lending Returns Calculator',
        icon: 'fas fa-hand-holding-usd',
        inputs: [
            { id: 'principal', label: 'Principal Amount', type: 'number', placeholder: 'Enter lending amount' },
            { id: 'apy', label: 'APY (%)', type: 'number', placeholder: 'Enter APY', step: '0.01' },
            { id: 'period', label: 'Lending Period (days)', type: 'number', placeholder: 'Enter period' },
            { id: 'compounding', label: 'Compounding Frequency', type: 'select', options: ['Daily', 'Weekly', 'Monthly'] }
        ],
        calculate: function(inputs) {
            const principal = parseFloat(inputs.principal) || 0;
            const apy = parseFloat(inputs.apy) || 0;
            const period = parseFloat(inputs.period) || 0;
            let n = inputs.compounding === 'Daily' ? 365 : inputs.compounding === 'Weekly' ? 52 : 12;
            
            const r = apy / 100;
            const t = period / 365;
            const amount = principal * Math.pow(1 + r/n, n*t);
            const interest = amount - principal;
            
            return `Total Returns: $${interest.toFixed(2)}
Final Amount: $${amount.toFixed(2)}
Daily Interest: $${(interest/period).toFixed(2)}
APY: ${apy}%`;
        }
    },

    'crypto-compound-yield': {
        title: 'Compound Yield Calculator',
        icon: 'fas fa-chart-area',
        inputs: [
            { id: 'initial', label: 'Initial Investment', type: 'number', placeholder: 'Enter initial amount' },
            { id: 'contribution', label: 'Weekly Contribution', type: 'number', placeholder: 'Enter weekly addition' },
            { id: 'apy', label: 'APY (%)', type: 'number', placeholder: 'Enter APY', step: '0.01' },
            { id: 'years', label: 'Investment Period (years)', type: 'number', placeholder: 'Enter years', step: '0.1' }
        ],
        calculate: function(inputs) {
            const initial = parseFloat(inputs.initial) || 0;
            const contribution = parseFloat(inputs.contribution) || 0;
            const apy = parseFloat(inputs.apy) || 0;
            const years = parseFloat(inputs.years) || 0;
            
            const weeklyRate = Math.pow(1 + apy/100, 1/52) - 1;
            const weeks = years * 52;
            
            let balance = initial;
            for(let i = 0; i < weeks; i++) {
                balance = balance * (1 + weeklyRate) + contribution;
            }
            
            const totalContributed = initial + (contribution * weeks);
            const earnings = balance - totalContributed;
            
            return `Final Balance: $${balance.toFixed(2)}
Total Contributed: $${totalContributed.toFixed(2)}
Total Earnings: $${earnings.toFixed(2)}
Annual Return: ${apy}%`;
        }
    },

    'crypto-rebalancing': {
        title: 'Portfolio Rebalancing Calculator',
        icon: 'fas fa-sync',
        inputs: [
            { id: 'asset1Value', label: 'Asset 1 Current Value ($)', type: 'number', placeholder: 'Enter current value' },
            { id: 'asset2Value', label: 'Asset 2 Current Value ($)', type: 'number', placeholder: 'Enter current value' },
            { id: 'target1', label: 'Asset 1 Target Allocation (%)', type: 'number', placeholder: 'Enter target %', step: '0.1' },
            { id: 'target2', label: 'Asset 2 Target Allocation (%)', type: 'number', placeholder: 'Enter target %', step: '0.1' }
        ],
        calculate: function(inputs) {
            const asset1Value = parseFloat(inputs.asset1Value) || 0;
            const asset2Value = parseFloat(inputs.asset2Value) || 0;
            const target1 = parseFloat(inputs.target1) || 0;
            const target2 = parseFloat(inputs.target2) || 0;
            
            const totalValue = asset1Value + asset2Value;
            const current1Percent = (asset1Value / totalValue) * 100;
            const current2Percent = (asset2Value / totalValue) * 100;
            
            const target1Value = totalValue * (target1/100);
            const target2Value = totalValue * (target2/100);
            
            const adjust1 = target1Value - asset1Value;
            const adjust2 = target2Value - asset2Value;
            
            return `Rebalance Asset 1: ${adjust1 >= 0 ? 'Buy' : 'Sell'} $${Math.abs(adjust1).toFixed(2)}
Rebalance Asset 2: ${adjust2 >= 0 ? 'Buy' : 'Sell'} $${Math.abs(adjust2).toFixed(2)}
Current Ratio: ${current1Percent.toFixed(1)}%/${current2Percent.toFixed(1)}%
Target Ratio: ${target1}%/${target2}%`;
        }
    },

    'crypto-stop-loss': {
        title: 'Stop Loss Calculator',
        icon: 'fas fa-shield-alt',
        inputs: [
            { id: 'position', label: 'Position Size', type: 'number', placeholder: 'Enter position size' },
            { id: 'entry', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'risk', label: 'Risk Percentage (%)', type: 'number', placeholder: 'Enter risk %', step: '0.1' },
            { id: 'type', label: 'Position Type', type: 'select', options: ['Long', 'Short'] }
        ],
        calculate: function(inputs) {
            const position = parseFloat(inputs.position) || 0;
            const entry = parseFloat(inputs.entry) || 0;
            const risk = parseFloat(inputs.risk) || 0;
            const isLong = inputs.type === 'Long';
            
            const riskAmount = position * (risk/100);
            const priceChange = riskAmount / position;
            const stopPrice = isLong ? 
                entry * (1 - risk/100) :
                entry * (1 + risk/100);
            
            return `Stop Loss Price: $${stopPrice.toFixed(6)}
Risk Amount: $${riskAmount.toFixed(2)}
Price Change: ${(priceChange * 100).toFixed(2)}%
Position Value: $${(position * entry).toFixed(2)}`;
        }
    },

    'crypto-correlation': {
        title: 'Asset Correlation Calculator',
        icon: 'fas fa-link',
        inputs: [
            { id: 'asset1Returns', label: 'Asset 1 Daily Returns (%, comma-separated)', type: 'text', placeholder: 'e.g., 2.5,-1.3,0.8' },
            { id: 'asset2Returns', label: 'Asset 2 Daily Returns (%, comma-separated)', type: 'text', placeholder: 'e.g., 1.8,-0.9,1.2' }
        ],
        calculate: function(inputs) {
            const arr1 = inputs.asset1Returns.split(',').map(x => parseFloat(x));
            const arr2 = inputs.asset2Returns.split(',').map(x => parseFloat(x));
            
            if (arr1.length !== arr2.length || arr1.length < 2) {
                return 'Error: Please provide equal number of returns (at least 2) for both assets';
            }
            
            const mean1 = arr1.reduce((a,b) => a + b, 0) / arr1.length;
            const mean2 = arr2.reduce((a,b) => a + b, 0) / arr2.length;
            
            const variance1 = arr1.reduce((a,b) => a + Math.pow(b - mean1, 2), 0) / arr1.length;
            const variance2 = arr2.reduce((a,b) => a + Math.pow(b - mean2, 2), 0) / arr2.length;
            
            const covariance = arr1.reduce((a,b,i) => a + (b - mean1) * (arr2[i] - mean2), 0) / arr1.length;
            const correlation = covariance / (Math.sqrt(variance1) * Math.sqrt(variance2));
            
            return `Correlation Coefficient: ${correlation.toFixed(4)}
Strength: ${Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'}
Direction: ${correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'No correlation'}
Sample Size: ${arr1.length} data points`;
        }
    },

    'crypto-volume-analysis': {
        title: 'Volume Analysis Calculator',
        icon: 'fas fa-chart-bar',
        inputs: [
            { id: 'price', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'volume24h', label: '24h Volume ($)', type: 'number', placeholder: 'Enter 24h volume' },
            { id: 'marketCap', label: 'Market Cap ($)', type: 'number', placeholder: 'Enter market cap' }
        ],
        calculate: function(inputs) {
            const price = parseFloat(inputs.price) || 0;
            const volume24h = parseFloat(inputs.volume24h) || 0;
            const marketCap = parseFloat(inputs.marketCap) || 0;
            
            const volumeToMcRatio = (volume24h / marketCap) * 100;
            const turnover = volume24h / price;
            
            return `Volume/Market Cap Ratio: ${volumeToMcRatio.toFixed(2)}%
24h Turnover: ${turnover.toFixed(0)} units
Average Trade Size: $${(volume24h / (turnover / 24)).toFixed(2)}
Market Impact Score: ${volumeToMcRatio > 20 ? 'High' : volumeToMcRatio > 10 ? 'Medium' : 'Low'}`;
        }
    },

    'crypto-position-size': {
        title: 'Position Size Calculator',
        icon: 'fas fa-balance-scale-left',
        inputs: [
            { id: 'accountSize', label: 'Account Size ($)', type: 'number', placeholder: 'Enter account size' },
            { id: 'riskPercent', label: 'Risk Per Trade (%)', type: 'number', placeholder: 'Enter risk %', step: '0.1' },
            { id: 'entryPrice', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'stopLoss', label: 'Stop Loss Price ($)', type: 'number', placeholder: 'Enter stop loss', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const accountSize = parseFloat(inputs.accountSize) || 0;
            const riskPercent = parseFloat(inputs.riskPercent) || 0;
            const entryPrice = parseFloat(inputs.entryPrice) || 0;
            const stopLoss = parseFloat(inputs.stopLoss) || 0;
            
            const riskAmount = accountSize * (riskPercent/100);
            const priceRisk = Math.abs(entryPrice - stopLoss);
            const positionSize = riskAmount / priceRisk;
            const positionValue = positionSize * entryPrice;
            
            return `Position Size: ${positionSize.toFixed(6)} units
Position Value: $${positionValue.toFixed(2)}
Risk Amount: $${riskAmount.toFixed(2)}
Account Risk: ${riskPercent}%`;
        }
    },

    'crypto-funding-rate': {
        title: 'Funding Rate Calculator',
        icon: 'fas fa-percentage',
        inputs: [
            { id: 'positionSize', label: 'Position Size ($)', type: 'number', placeholder: 'Enter position size' },
            { id: 'fundingRate', label: 'Funding Rate (%)', type: 'number', placeholder: 'Enter funding rate', step: '0.001' },
            { id: 'leverageUsed', label: 'Leverage Used', type: 'number', placeholder: 'Enter leverage', step: '0.1' },
            { id: 'days', label: 'Hold Period (days)', type: 'number', placeholder: 'Enter days' }
        ],
        calculate: function(inputs) {
            const positionSize = parseFloat(inputs.positionSize) || 0;
            const fundingRate = parseFloat(inputs.fundingRate) || 0;
            const leverageUsed = parseFloat(inputs.leverageUsed) || 1;
            const days = parseFloat(inputs.days) || 0;
            
            const margin = positionSize / leverageUsed;
            const fundingPerDay = positionSize * (fundingRate/100) * 3; // Assuming 8-hour funding periods
            const totalFunding = fundingPerDay * days;
            const roi = (totalFunding / margin) * 100;
            
            return `Daily Funding: $${fundingPerDay.toFixed(2)}
Total Funding: $${totalFunding.toFixed(2)}
Funding ROI: ${roi.toFixed(2)}%
Effective Rate: ${(fundingRate * 3 * 365).toFixed(2)}% APR`;
        }
    },

    'crypto-drawdown': {
        title: 'Maximum Drawdown Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'prices', label: 'Historical Prices (comma-separated)', type: 'text', placeholder: 'e.g., 100,95,105,90,110' }
        ],
        calculate: function(inputs) {
            const prices = inputs.prices.split(',').map(x => parseFloat(x));
            
            if (prices.length < 2) {
                return 'Error: Please provide at least 2 price points';
            }
            
            let maxDrawdown = 0;
            let peak = prices[0];
            let peakIndex = 0;
            let valley = prices[0];
            let valleyIndex = 0;
            let currentPeak = prices[0];
            let currentPeakIndex = 0;
            
            for (let i = 1; i < prices.length; i++) {
                if (prices[i] > currentPeak) {
                    currentPeak = prices[i];
                    currentPeakIndex = i;
                }
                
                const drawdown = (currentPeak - prices[i]) / currentPeak;
                if (drawdown > maxDrawdown) {
                    maxDrawdown = drawdown;
                    peak = currentPeak;
                    peakIndex = currentPeakIndex;
                    valley = prices[i];
                    valleyIndex = i;
                }
            }
            
            return `Maximum Drawdown: ${(maxDrawdown * 100).toFixed(2)}%
Peak Value: $${peak.toFixed(2)} (point ${peakIndex + 1})
Valley Value: $${valley.toFixed(2)} (point ${valleyIndex + 1})
Recovery Required: ${((1/(1-maxDrawdown) - 1) * 100).toFixed(2)}%`;
        }
    },

    'crypto-swing-trade': {
        title: 'Swing Trading Calculator',
        icon: 'fas fa-wave-square',
        inputs: [
            { id: 'entryPrice', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'targetPrice', label: 'Target Price ($)', type: 'number', placeholder: 'Enter target price', step: '0.000001' },
            { id: 'stopLoss', label: 'Stop Loss ($)', type: 'number', placeholder: 'Enter stop loss', step: '0.000001' },
            { id: 'position', label: 'Position Size', type: 'number', placeholder: 'Enter position size' }
        ],
        calculate: function(inputs) {
            const entry = parseFloat(inputs.entryPrice) || 0;
            const target = parseFloat(inputs.targetPrice) || 0;
            const stop = parseFloat(inputs.stopLoss) || 0;
            const position = parseFloat(inputs.position) || 0;
            
            const potentialProfit = (target - entry) * position;
            const potentialLoss = (entry - stop) * position;
            const riskRewardRatio = Math.abs(potentialProfit / potentialLoss);
            const breakEvenMove = (entry * 0.001); // Assuming 0.1% trading fee
            
            return `Potential Profit: $${potentialProfit.toFixed(2)}
Potential Loss: $${potentialLoss.toFixed(2)}
Risk/Reward Ratio: ${riskRewardRatio.toFixed(2)}
Break-even Move: $${breakEvenMove.toFixed(6)} (0.1% fee)`;
        }
    },

    'crypto-accumulation': {
        title: 'DCA Accumulation Calculator',
        icon: 'fas fa-stream',
        inputs: [
            { id: 'monthlyInvestment', label: 'Monthly Investment ($)', type: 'number', placeholder: 'Enter monthly amount' },
            { id: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', placeholder: 'Enter expected return', step: '0.1' },
            { id: 'years', label: 'Investment Period (years)', type: 'number', placeholder: 'Enter years' },
            { id: 'currentPrice', label: 'Current Asset Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const monthly = parseFloat(inputs.monthlyInvestment) || 0;
            const returnRate = parseFloat(inputs.expectedReturn) || 0;
            const years = parseFloat(inputs.years) || 0;
            const price = parseFloat(inputs.currentPrice) || 0;
            
            const monthlyRate = Math.pow(1 + returnRate/100, 1/12) - 1;
            const months = years * 12;
            
            let finalBalance = 0;
            let totalInvested = 0;
            let totalUnits = 0;
            
            for(let i = 0; i < months; i++) {
                totalInvested += monthly;
                const units = monthly / price;
                totalUnits += units;
                finalBalance = (finalBalance + monthly) * (1 + monthlyRate);
            }
            
            return `Total Investment: $${totalInvested.toFixed(2)}
Final Balance: $${finalBalance.toFixed(2)}
Total Units: ${totalUnits.toFixed(6)}
Average Cost: $${(totalInvested/totalUnits).toFixed(6)}`;
        }
    },

    'crypto-volatility': {
        title: 'Volatility Calculator',
        icon: 'fas fa-bolt',
        inputs: [
            { id: 'prices', label: 'Daily Closing Prices (comma-separated)', type: 'text', placeholder: 'e.g., 100,102,98,103' }
        ],
        calculate: function(inputs) {
            const prices = inputs.prices.split(',').map(x => parseFloat(x));
            
            if (prices.length < 2) {
                return 'Error: Please provide at least 2 price points';
            }
            
            const returns = [];
            for(let i = 1; i < prices.length; i++) {
                returns.push((prices[i] - prices[i-1]) / prices[i-1]);
            }
            
            const mean = returns.reduce((a,b) => a + b, 0) / returns.length;
            const variance = returns.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / returns.length;
            const stdDev = Math.sqrt(variance);
            const annualizedVol = stdDev * Math.sqrt(365) * 100;
            
            return `Daily Volatility: ${(stdDev * 100).toFixed(2)}%
Annualized Volatility: ${annualizedVol.toFixed(2)}%
Max Daily Return: ${(Math.max(...returns) * 100).toFixed(2)}%
Min Daily Return: ${(Math.min(...returns) * 100).toFixed(2)}%`;
        }
    },

    // Unit Conversion Calculators
    'length': {
        title: 'Length Converter',
        icon: 'fas fa-ruler-horizontal',
        inputs: [
            { id: 'value', label: 'Value', type: 'number', placeholder: 'Enter value' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to meters first
            const toMeters = {
                'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
                'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344
            };
            
            const meters = value * toMeters[fromUnit];
            const result = meters / toMeters[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Meters: ${meters.toFixed(6)} m
Conversion Factor: ${(toMeters[fromUnit] / toMeters[toUnit]).toFixed(8)}`;
        }
    },

    'temperature': {
        title: 'Temperature Converter',
        icon: 'fas fa-thermometer-half',
        inputs: [
            { id: 'value', label: 'Temperature', type: 'number', placeholder: 'Enter temperature' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['C', 'F', 'K', 'R'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['C', 'F', 'K', 'R'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Celsius first
            let celsius;
            switch(fromUnit) {
                case 'C': celsius = value; break;
                case 'F': celsius = (value - 32) * 5/9; break;
                case 'K': celsius = value - 273.15; break;
                case 'R': celsius = (value - 491.67) * 5/9; break;
            }
            
            // Convert from Celsius to target unit
            let result;
            switch(toUnit) {
                case 'C': result = celsius; break;
                case 'F': result = celsius * 9/5 + 32; break;
                case 'K': result = celsius + 273.15; break;
                case 'R': result = celsius * 9/5 + 491.67; break;
            }
            
            return `${value}°${fromUnit} = ${result.toFixed(2)}°${toUnit}
Celsius: ${celsius.toFixed(2)}°C
Fahrenheit: ${(celsius * 9/5 + 32).toFixed(2)}°F
Kelvin: ${(celsius + 273.15).toFixed(2)}K`;
        }
    },

    'weight': {
        title: 'Weight Converter',
        icon: 'fas fa-weight-hanging',
        inputs: [
            { id: 'value', label: 'Weight', type: 'number', placeholder: 'Enter weight' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to grams first
            const toGrams = {
                'mg': 0.001, 'g': 1, 'kg': 1000, 't': 1000000,
                'oz': 28.3495, 'lb': 453.592, 'st': 6350.29
            };
            
            const grams = value * toGrams[fromUnit];
            const result = grams / toGrams[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Grams: ${grams.toFixed(3)} g
Kilograms: ${(grams/1000).toFixed(6)} kg
Pounds: ${(grams/453.592).toFixed(6)} lb`;
        }
    },

    'area': {
        title: 'Area Converter',
        icon: 'fas fa-square',
        inputs: [
            { id: 'value', label: 'Area', type: 'number', placeholder: 'Enter area' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'yd²', 'ac', 'ha'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'yd²', 'ac', 'ha'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to square meters first
            const toSqMeters = {
                'mm²': 0.000001, 'cm²': 0.0001, 'm²': 1, 'km²': 1000000,
                'in²': 0.00064516, 'ft²': 0.092903, 'yd²': 0.836127,
                'ac': 4046.86, 'ha': 10000
            };
            
            const sqMeters = value * toSqMeters[fromUnit];
            const result = sqMeters / toSqMeters[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Square Meters: ${sqMeters.toFixed(6)} m²
Square Feet: ${(sqMeters/0.092903).toFixed(3)} ft²
Hectares: ${(sqMeters/10000).toFixed(6)} ha`;
        }
    },

    'volume': {
        title: 'Volume Converter',
        icon: 'fas fa-cube',
        inputs: [
            { id: 'value', label: 'Volume', type: 'number', placeholder: 'Enter volume' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['ml', 'l', 'm³', 'fl oz', 'cup', 'pt', 'qt', 'gal'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['ml', 'l', 'm³', 'fl oz', 'cup', 'pt', 'qt', 'gal'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to liters first
            const toLiters = {
                'ml': 0.001, 'l': 1, 'm³': 1000,
                'fl oz': 0.0295735, 'cup': 0.236588, 'pt': 0.473176,
                'qt': 0.946353, 'gal': 3.78541
            };
            
            const liters = value * toLiters[fromUnit];
            const result = liters / toLiters[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Liters: ${liters.toFixed(6)} L
Milliliters: ${(liters*1000).toFixed(3)} mL
Gallons: ${(liters/3.78541).toFixed(6)} gal`;
        }
    },

    'speed': {
        title: 'Speed Converter',
        icon: 'fas fa-tachometer-alt',
        inputs: [
            { id: 'value', label: 'Speed', type: 'number', placeholder: 'Enter speed' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['m/s', 'km/h', 'mph', 'ft/s', 'knots'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['m/s', 'km/h', 'mph', 'ft/s', 'knots'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to m/s first
            const toMPS = {
                'm/s': 1, 'km/h': 1/3.6, 'mph': 0.44704,
                'ft/s': 0.3048, 'knots': 0.514444
            };
            
            const mps = value * toMPS[fromUnit];
            const result = mps / toMPS[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Meters/Second: ${mps.toFixed(6)} m/s
Kilometers/Hour: ${(mps*3.6).toFixed(3)} km/h
Miles/Hour: ${(mps/0.44704).toFixed(3)} mph`;
        }
    },

    'pressure': {
        title: 'Pressure Converter',
        icon: 'fas fa-compress',
        inputs: [
            { id: 'value', label: 'Pressure', type: 'number', placeholder: 'Enter pressure' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['Pa', 'kPa', 'MPa', 'bar', 'atm', 'psi', 'mmHg', 'inHg'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['Pa', 'kPa', 'MPa', 'bar', 'atm', 'psi', 'mmHg', 'inHg'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Pascals first
            const toPascals = {
                'Pa': 1, 'kPa': 1000, 'MPa': 1000000, 'bar': 100000,
                'atm': 101325, 'psi': 6894.76, 'mmHg': 133.322, 'inHg': 3386.39
            };
            
            const pascals = value * toPascals[fromUnit];
            const result = pascals / toPascals[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Pascals: ${pascals.toFixed(3)} Pa
Atmospheres: ${(pascals/101325).toFixed(6)} atm
PSI: ${(pascals/6894.76).toFixed(3)} psi`;
        }
    },

    'energy-conversion': {
        title: 'Energy Converter',
        icon: 'fas fa-bolt',
        inputs: [
            { id: 'value', label: 'Energy', type: 'number', placeholder: 'Enter energy value' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['J', 'kJ', 'MJ', 'cal', 'kcal', 'Wh', 'kWh', 'BTU', 'eV'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['J', 'kJ', 'MJ', 'cal', 'kcal', 'Wh', 'kWh', 'BTU', 'eV'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Joules first
            const toJoules = {
                'J': 1, 'kJ': 1000, 'MJ': 1000000, 'cal': 4.184,
                'kcal': 4184, 'Wh': 3600, 'kWh': 3600000, 'BTU': 1055.06, 'eV': 1.602e-19
            };
            
            const joules = value * toJoules[fromUnit];
            const result = joules / toJoules[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Joules: ${joules.toFixed(3)} J
Kilowatt-hours: ${(joules/3600000).toFixed(6)} kWh
Calories: ${(joules/4.184).toFixed(3)} cal`;
        }
    },

    'power-conversion': {
        title: 'Power Converter',
        icon: 'fas fa-plug',
        inputs: [
            { id: 'value', label: 'Power', type: 'number', placeholder: 'Enter power value' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['W', 'kW', 'MW', 'hp', 'BTU/h', 'cal/s'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['W', 'kW', 'MW', 'hp', 'BTU/h', 'cal/s'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Watts first
            const toWatts = {
                'W': 1, 'kW': 1000, 'MW': 1000000, 'hp': 745.7,
                'BTU/h': 0.293071, 'cal/s': 4.184
            };
            
            const watts = value * toWatts[fromUnit];
            const result = watts / toWatts[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Watts: ${watts.toFixed(3)} W
Kilowatts: ${(watts/1000).toFixed(6)} kW
Horsepower: ${(watts/745.7).toFixed(6)} hp`;
        }
    },

    'data-storage': {
        title: 'Data Storage Converter',
        icon: 'fas fa-hdd',
        inputs: [
            { id: 'value', label: 'Data Size', type: 'number', placeholder: 'Enter data size' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['bit', 'byte', 'KB', 'MB', 'GB', 'TB', 'PB'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['bit', 'byte', 'KB', 'MB', 'GB', 'TB', 'PB'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to bytes first
            const toBytes = {
                'bit': 0.125, 'byte': 1, 'KB': 1024, 'MB': 1048576,
                'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624
            };
            
            const bytes = value * toBytes[fromUnit];
            const result = bytes / toBytes[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Bytes: ${bytes.toFixed(0)} bytes
Megabytes: ${(bytes/1048576).toFixed(6)} MB
Gigabytes: ${(bytes/1073741824).toFixed(6)} GB`;
        }
    },

    'angle': {
        title: 'Angle Converter',
        icon: 'fas fa-circle-notch',
        inputs: [
            { id: 'value', label: 'Angle', type: 'number', placeholder: 'Enter angle' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['deg', 'rad', 'grad', 'turn', 'arcmin', 'arcsec'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['deg', 'rad', 'grad', 'turn', 'arcmin', 'arcsec'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to degrees first
            const toDegrees = {
                'deg': 1, 'rad': 180/Math.PI, 'grad': 0.9, 'turn': 360,
                'arcmin': 1/60, 'arcsec': 1/3600
            };
            
            const degrees = value * toDegrees[fromUnit];
            const result = degrees / toDegrees[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Degrees: ${degrees.toFixed(6)}°
Radians: ${(degrees * Math.PI/180).toFixed(6)} rad
Gradians: ${(degrees/0.9).toFixed(6)} grad`;
        }
    },

    'time-conversion': {
        title: 'Time Converter',
        icon: 'fas fa-clock',
        inputs: [
            { id: 'value', label: 'Time', type: 'number', placeholder: 'Enter time value' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['ms', 'sec', 'min', 'hr', 'day', 'week', 'month', 'year'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['ms', 'sec', 'min', 'hr', 'day', 'week', 'month', 'year'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to seconds first
            const toSeconds = {
                'ms': 0.001, 'sec': 1, 'min': 60, 'hr': 3600, 'day': 86400,
                'week': 604800, 'month': 2629746, 'year': 31556952
            };
            
            const seconds = value * toSeconds[fromUnit];
            const result = seconds / toSeconds[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Seconds: ${seconds.toFixed(3)} sec
Minutes: ${(seconds/60).toFixed(3)} min
Hours: ${(seconds/3600).toFixed(6)} hr
Days: ${(seconds/86400).toFixed(6)} days`;
        }
    },

    'frequency': {
        title: 'Frequency Converter',
        icon: 'fas fa-wave-square',
        inputs: [
            { id: 'value', label: 'Frequency', type: 'number', placeholder: 'Enter frequency' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['Hz', 'kHz', 'MHz', 'GHz', 'THz', 'rpm', 'rps'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['Hz', 'kHz', 'MHz', 'GHz', 'THz', 'rpm', 'rps'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Hz first
            const toHz = {
                'Hz': 1, 'kHz': 1000, 'MHz': 1000000, 'GHz': 1000000000,
                'THz': 1000000000000, 'rpm': 1/60, 'rps': 1
            };
            
            const hz = value * toHz[fromUnit];
            const result = hz / toHz[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Hertz: ${hz.toFixed(3)} Hz
Kilohertz: ${(hz/1000).toFixed(6)} kHz
Megahertz: ${(hz/1000000).toFixed(6)} MHz
RPM: ${(hz*60).toFixed(3)} rpm`;
        }
    },

    'currency': {
        title: 'Currency Converter',
        icon: 'fas fa-dollar-sign',
        inputs: [
            { id: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter amount' },
            { id: 'fromCurrency', label: 'From Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'] },
            { id: 'toCurrency', label: 'To Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'] },
            { id: 'exchangeRate', label: 'Exchange Rate', type: 'number', placeholder: 'Enter current exchange rate', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const amount = parseFloat(inputs.amount) || 0;
            const exchangeRate = parseFloat(inputs.exchangeRate) || 1;
            const fromCurrency = inputs.fromCurrency;
            const toCurrency = inputs.toCurrency;
            
            const convertedAmount = amount * exchangeRate;
            
            return `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}
Exchange Rate: 1 ${fromCurrency} = ${exchangeRate} ${toCurrency}
Note: Please enter current exchange rate for accurate conversion`;
        }
    },

    'fuel-economy-conversion': {
        title: 'Fuel Economy Converter',
        icon: 'fas fa-gas-pump',
        inputs: [
            { id: 'value', label: 'Fuel Economy', type: 'number', placeholder: 'Enter fuel economy' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['mpg', 'l/100km', 'km/l', 'mi/l'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['mpg', 'l/100km', 'km/l', 'mi/l'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to l/100km first (standard metric)
            let l100km;
            switch(fromUnit) {
                case 'mpg': l100km = 235.214 / value; break;
                case 'l/100km': l100km = value; break;
                case 'km/l': l100km = 100 / value; break;
                case 'mi/l': l100km = 160.934 / value; break;
            }
            
            // Convert from l/100km to target unit
            let result;
            switch(toUnit) {
                case 'mpg': result = 235.214 / l100km; break;
                case 'l/100km': result = l100km; break;
                case 'km/l': result = 100 / l100km; break;
                case 'mi/l': result = 160.934 / l100km; break;
            }
            
            return `${value} ${fromUnit} = ${result.toFixed(3)} ${toUnit}
L/100km: ${l100km.toFixed(3)} L/100km
MPG: ${(235.214/l100km).toFixed(3)} mpg
KM/L: ${(100/l100km).toFixed(3)} km/L`;
        }
    },

    'density': {
        title: 'Density Converter',
        icon: 'fas fa-weight',
        inputs: [
            { id: 'value', label: 'Density', type: 'number', placeholder: 'Enter density' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['kg/m³', 'g/cm³', 'g/ml', 'lb/ft³', 'oz/in³'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['kg/m³', 'g/cm³', 'g/ml', 'lb/ft³', 'oz/in³'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to kg/m³ first
            const toKgM3 = {
                'kg/m³': 1, 'g/cm³': 1000, 'g/ml': 1000,
                'lb/ft³': 16.0185, 'oz/in³': 1729.99
            };
            
            const kgm3 = value * toKgM3[fromUnit];
            const result = kgm3 / toKgM3[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
kg/m³: ${kgm3.toFixed(3)} kg/m³
g/cm³: ${(kgm3/1000).toFixed(6)} g/cm³
lb/ft³: ${(kgm3/16.0185).toFixed(3)} lb/ft³`;
        }
    },

    'force-conversion': {
        title: 'Force Converter',
        icon: 'fas fa-hand-rock',
        inputs: [
            { id: 'value', label: 'Force', type: 'number', placeholder: 'Enter force' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['N', 'kN', 'lbf', 'kgf', 'dyn', 'pdl'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['N', 'kN', 'lbf', 'kgf', 'dyn', 'pdl'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Newtons first
            const toNewtons = {
                'N': 1, 'kN': 1000, 'lbf': 4.44822, 'kgf': 9.80665,
                'dyn': 0.00001, 'pdl': 0.138255
            };
            
            const newtons = value * toNewtons[fromUnit];
            const result = newtons / toNewtons[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Newtons: ${newtons.toFixed(3)} N
Pounds-force: ${(newtons/4.44822).toFixed(3)} lbf
Kilograms-force: ${(newtons/9.80665).toFixed(3)} kgf`;
        }
    },

    'luminosity': {
        title: 'Luminosity Converter',
        icon: 'fas fa-lightbulb',
        inputs: [
            { id: 'value', label: 'Luminosity', type: 'number', placeholder: 'Enter luminosity' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['lm', 'cd', 'lx', 'fc'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['lm', 'cd', 'lx', 'fc'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Note: These conversions are approximate and context-dependent
            const conversions = {
                'lm': { 'lm': 1, 'cd': 0.0796, 'lx': 1, 'fc': 0.0929 },
                'cd': { 'lm': 12.57, 'cd': 1, 'lx': 12.57, 'fc': 1.168 },
                'lx': { 'lm': 1, 'cd': 0.0796, 'lx': 1, 'fc': 0.0929 },
                'fc': { 'lm': 10.764, 'cd': 0.857, 'lx': 10.764, 'fc': 1 }
            };
            
            const result = value * conversions[fromUnit][toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Note: Luminosity conversions depend on geometry and context
Lumens (lm): Luminous flux
Candela (cd): Luminous intensity
Lux (lx): Illuminance
Foot-candles (fc): Illuminance`;
        }
    },

    'magnetic-field': {
        title: 'Magnetic Field Converter',
        icon: 'fas fa-magnet',
        inputs: [
            { id: 'value', label: 'Magnetic Field', type: 'number', placeholder: 'Enter magnetic field' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['T', 'mT', 'μT', 'G', 'mG', 'Oe'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['T', 'mT', 'μT', 'G', 'mG', 'Oe'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Tesla first
            const toTesla = {
                'T': 1, 'mT': 0.001, 'μT': 0.000001,
                'G': 0.0001, 'mG': 0.0000001, 'Oe': 0.0000796
            };
            
            const tesla = value * toTesla[fromUnit];
            const result = tesla / toTesla[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Tesla: ${tesla.toFixed(9)} T
Gauss: ${(tesla/0.0001).toFixed(6)} G
Oersted: ${(tesla/0.0000796).toFixed(6)} Oe
Note: Earth's magnetic field ≈ 50 μT`;
        }
    },

    'radioactivity': {
        title: 'Radioactivity Converter',
        icon: 'fas fa-radiation',
        inputs: [
            { id: 'value', label: 'Radioactivity', type: 'number', placeholder: 'Enter radioactivity' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['Bq', 'kBq', 'MBq', 'GBq', 'Ci', 'mCi', 'μCi', 'nCi', 'pCi'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['Bq', 'kBq', 'MBq', 'GBq', 'Ci', 'mCi', 'μCi', 'nCi', 'pCi'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Becquerels first
            const toBq = {
                'Bq': 1, 'kBq': 1000, 'MBq': 1000000, 'GBq': 1000000000,
                'Ci': 3.7e10, 'mCi': 3.7e7, 'μCi': 37000, 'nCi': 37, 'pCi': 0.037
            };
            
            const bq = value * toBq[fromUnit];
            const result = bq / toBq[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Becquerels: ${bq.toExponential(3)} Bq
Curies: ${(bq/3.7e10).toExponential(3)} Ci
Note: 1 Ci = 3.7×10¹⁰ disintegrations/second`;
        }
    },

    'torque': {
        title: 'Torque Converter',
        icon: 'fas fa-cog',
        inputs: [
            { id: 'value', label: 'Torque', type: 'number', placeholder: 'Enter torque' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['Nm', 'kNm', 'lbft', 'lbin', 'kgfm', 'kgfcm', 'ozin'] },
            { id: 'toUnit', label: 'To Unit', type: 'select', options: ['Nm', 'kNm', 'lbft', 'lbin', 'kgfm', 'kgfcm', 'ozin'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const fromUnit = inputs.fromUnit;
            const toUnit = inputs.toUnit;
            
            // Convert to Newton-meters first
            const toNm = {
                'Nm': 1, 'kNm': 1000, 'lbft': 1.35582, 'lbin': 0.112985,
                'kgfm': 9.80665, 'kgfcm': 0.0980665, 'ozin': 0.00706155
            };
            
            const nm = value * toNm[fromUnit];
            const result = nm / toNm[toUnit];
            
            return `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}
Newton-meters: ${nm.toFixed(3)} Nm
Pound-feet: ${(nm/1.35582).toFixed(3)} lb·ft
Kilogram-force meters: ${(nm/9.80665).toFixed(3)} kgf·m`;
        }
    },

    'crypto-leverage-liquidation': {
        title: 'Leverage Liquidation Calculator',
        icon: 'fas fa-balance-scale-right',
        inputs: [
            { id: 'position', label: 'Position Size ($)', type: 'number', placeholder: 'Enter position size' },
            { id: 'leverage', label: 'Leverage (x)', type: 'number', placeholder: 'Enter leverage', step: '0.1' },
            { id: 'entryPrice', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'margin', label: 'Initial Margin ($)', type: 'number', placeholder: 'Enter initial margin' }
        ],
        calculate: function(inputs) {
            const position = parseFloat(inputs.position) || 0;
            const leverage = parseFloat(inputs.leverage) || 0;
            const entryPrice = parseFloat(inputs.entryPrice) || 0;
            const margin = parseFloat(inputs.margin) || 0;
            
            const maintenanceMargin = margin * 0.5; // 50% maintenance margin
            const liquidationPrice = entryPrice * (1 - (1/leverage));
            const maxLoss = margin - maintenanceMargin;
            
            return `Liquidation Price: $${liquidationPrice.toFixed(2)}
Maximum Loss: $${maxLoss.toFixed(2)}
Effective Leverage: ${(position/margin).toFixed(2)}x
Risk Level: ${((entryPrice - liquidationPrice) / entryPrice * 100).toFixed(2)}%`;
        }
    },
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
    'investment': {
        title: 'Investment Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'initial', label: 'Initial Investment ($)', type: 'number', placeholder: 'Enter initial investment' },
            { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', placeholder: 'Enter monthly contribution' },
            { id: 'rate', label: 'Annual Return Rate (%)', type: 'number', placeholder: 'Enter return rate', step: '0.1' },
            { id: 'years', label: 'Investment Period (years)', type: 'number', placeholder: 'Enter years' }
        ],
        calculate: function(inputs) {
            const initial = parseFloat(inputs.initial) || 0;
            const monthly = parseFloat(inputs.monthly) || 0;
            const rate = parseFloat(inputs.rate) / 100 / 12;
            const months = parseInt(inputs.years) * 12;
            
            let balance = initial;
            for (let i = 0; i < months; i++) {
                balance = (balance + monthly) * (1 + rate);
            }
            
            const totalContributions = initial + (monthly * months);
            const earnings = balance - totalContributions;
            
            return `Final Balance: $${balance.toFixed(2)}\nTotal Contributions: $${totalContributions.toFixed(2)}\nTotal Earnings: $${earnings.toFixed(2)}`;
        }
    },
    'savings': {
        title: 'Savings Calculator',
        icon: 'fas fa-piggy-bank',
        inputs: [
            { id: 'goal', label: 'Savings Goal ($)', type: 'number', placeholder: 'Enter target amount' },
            { id: 'current', label: 'Current Savings ($)', type: 'number', placeholder: 'Enter current savings' },
            { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'Enter interest rate', step: '0.1' },
            { id: 'years', label: 'Time Period (years)', type: 'number', placeholder: 'Enter years' }
        ],
        calculate: function(inputs) {
            const goal = parseFloat(inputs.goal) || 0;
            const current = parseFloat(inputs.current) || 0;
            const rate = parseFloat(inputs.rate) / 100 / 12;
            const months = parseInt(inputs.years) * 12;
            
            const monthlyPayment = (goal - current * Math.pow(1 + rate, months)) / 
                                 ((Math.pow(1 + rate, months) - 1) / rate);
            
            return `Required Monthly Savings: $${monthlyPayment.toFixed(2)}\nTotal Savings: $${goal.toFixed(2)}\nTime to Goal: ${months} months`;
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
    },
    // Math Calculators
    'percentage': {
        title: 'Percentage Calculator',
        icon: 'fas fa-percent',
        inputs: [
            { id: 'value', label: 'Value', type: 'number', placeholder: 'Enter value' },
            { id: 'percent', label: 'Percentage', type: 'number', placeholder: 'Enter percentage', step: '0.01' }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const percent = parseFloat(inputs.percent) || 0;
            const result = (value * percent) / 100;
            return `${percent}% of ${value} is: ${result.toFixed(2)}\nPercentage: ${percent}%\nResult: ${result.toFixed(2)}`;
        }
    },
    'fraction': {
        title: 'Fraction Calculator',
        icon: 'fas fa-divide',
        inputs: [
            { id: 'num1', label: 'Numerator 1', type: 'number', placeholder: 'Enter numerator' },
            { id: 'den1', label: 'Denominator 1', type: 'number', placeholder: 'Enter denominator' },
            { id: 'operation', label: 'Operation', type: 'select', options: ['+', '-', '×', '÷'] },
            { id: 'num2', label: 'Numerator 2', type: 'number', placeholder: 'Enter numerator' },
            { id: 'den2', label: 'Denominator 2', type: 'number', placeholder: 'Enter denominator' }
        ],
        calculate: function(inputs) {
            const num1 = parseInt(inputs.num1) || 0;
            const den1 = parseInt(inputs.den1) || 1;
            const num2 = parseInt(inputs.num2) || 0;
            const den2 = parseInt(inputs.den2) || 1;
            let resultNum, resultDen;
            
            switch(inputs.operation) {
                case '+':
                    resultNum = num1 * den2 + num2 * den1;
                    resultDen = den1 * den2;
                    break;
                case '-':
                    resultNum = num1 * den2 - num2 * den1;
                    resultDen = den1 * den2;
                    break;
                case '×':
                    resultNum = num1 * num2;
                    resultDen = den1 * den2;
                    break;
                case '÷':
                    resultNum = num1 * den2;
                    resultDen = den1 * num2;
                    break;
            }
            
            // Simplify fraction
            const gcd = (a, b) => b ? gcd(b, a % b) : a;
            const divisor = gcd(Math.abs(resultNum), Math.abs(resultDen));
            resultNum /= divisor;
            resultDen /= divisor;
            
            return `Result: ${resultNum}/${resultDen}\nDecimal: ${(resultNum/resultDen).toFixed(4)}`;
        }
    },
    'bmi': {
        title: 'BMI Calculator',
        icon: 'fas fa-weight',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) / 100 || 0; // convert to meters
            const bmi = weight / (height * height);
            
            let category;
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal weight';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';
            
            return `BMI: ${bmi.toFixed(1)}\nCategory: ${category}`;
        }
    },
    'calorie': {
        title: 'Calorie Calculator',
        icon: 'fas fa-fire',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' },
            { id: 'activity', label: 'Activity Level', type: 'select', 
              options: ['Sedentary', 'Light Exercise', 'Moderate Exercise', 'Heavy Exercise', 'Athlete'] }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            const age = parseInt(inputs.age) || 0;
            
            // Harris-Benedict BMR Formula
            let bmr;
            if (inputs.gender === 'Male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            
            // Activity multipliers
            const multipliers = {
                'Sedentary': 1.2,
                'Light Exercise': 1.375,
                'Moderate Exercise': 1.55,
                'Heavy Exercise': 1.725,
                'Athlete': 1.9
            };
            
            const tdee = bmr * multipliers[inputs.activity];
              return `BMR: ${Math.round(bmr)} calories/day\n` +
                   `Maintenance: ${Math.round(tdee)} calories/day\n` +
                   `Weight Loss: ${Math.round(tdee - 500)} calories/day\n` +
                   `Weight Gain: ${Math.round(tdee + 500)} calories/day`;
        }
    },

    'body-fat': {
        title: 'Body Fat Calculator',
        icon: 'fas fa-percent',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' },
            { id: 'neck', label: 'Neck Circumference (cm)', type: 'number', placeholder: 'Enter neck circumference' },
            { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', placeholder: 'Enter waist circumference' },
            { id: 'hip', label: 'Hip Circumference (cm)', type: 'number', placeholder: 'Enter hip (women only)' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            const neck = parseFloat(inputs.neck) || 0;
            const waist = parseFloat(inputs.waist) || 0;
            const hip = parseFloat(inputs.hip) || 0;
            
            let bodyFat;
            // US Navy Body Fat Formula
            if (inputs.gender === 'Male') {
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            } else {
                bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
            }
            
            let category;
            if (inputs.gender === 'Male') {
                if (bodyFat < 6) category = 'Essential Fat';
                else if (bodyFat < 14) category = 'Athletes';
                else if (bodyFat < 18) category = 'Fitness';
                else if (bodyFat < 25) category = 'Average';
                else category = 'Obese';
            } else {
                if (bodyFat < 14) category = 'Essential Fat';
                else if (bodyFat < 21) category = 'Athletes';
                else if (bodyFat < 25) category = 'Fitness';
                else if (bodyFat < 32) category = 'Average';
                else category = 'Obese';
            }
            
            const fatMass = weight * (bodyFat / 100);
            const leanMass = weight - fatMass;
            
            return `Body Fat: ${bodyFat.toFixed(1)}%
Category: ${category}
Fat Mass: ${fatMass.toFixed(1)} kg
Lean Mass: ${leanMass.toFixed(1)} kg`;
        }
    },

    'ideal-weight': {
        title: 'Ideal Weight Calculator',
        icon: 'fas fa-balance-scale',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' },
            { id: 'frame', label: 'Body Frame', type: 'select', options: ['Small', 'Medium', 'Large'] }
        ],
        calculate: function(inputs) {
            const height = parseFloat(inputs.height) || 0;
            const heightInches = height / 2.54; // Convert to inches
            
            // Hamwi Formula
            let idealWeight;
            if (inputs.gender === 'Male') {
                idealWeight = 48 + 2.7 * (heightInches - 60);
            } else {
                idealWeight = 45.5 + 2.2 * (heightInches - 60);
            }
            
            // Adjust for frame size
            const frameAdjustment = {
                'Small': 0.9,
                'Medium': 1.0,
                'Large': 1.1
            };
            
            idealWeight *= frameAdjustment[inputs.frame];
            
            const minWeight = idealWeight * 0.9;
            const maxWeight = idealWeight * 1.1;
            
            // BMI ranges for healthy weight
            const heightM = height / 100;
            const bmiMinWeight = 18.5 * heightM * heightM;
            const bmiMaxWeight = 24.9 * heightM * heightM;
            
            return `Ideal Weight (Hamwi): ${idealWeight.toFixed(1)} kg
Healthy Range: ${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg
BMI Range (18.5-24.9): ${bmiMinWeight.toFixed(1)} - ${bmiMaxWeight.toFixed(1)} kg
Frame Size: ${inputs.frame}`;
        }
    },

    'water-intake': {
        title: 'Water Intake Calculator',
        icon: 'fas fa-tint',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'activity', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Light Activity', 'Moderate Activity', 'High Activity', 'Very High Activity'] },
            { id: 'climate', label: 'Climate', type: 'select', options: ['Cool', 'Moderate', 'Hot'] },
            { id: 'health', label: 'Health Status', type: 'select', options: ['Healthy', 'Fever/Illness', 'Pregnancy', 'Breastfeeding'] }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            let baseWater = weight * 35; // 35ml per kg base requirement
            
            // Activity level adjustments
            const activityMultipliers = {
                'Sedentary': 1.0,
                'Light Activity': 1.2,
                'Moderate Activity': 1.4,
                'High Activity': 1.6,
                'Very High Activity': 1.8
            };
            
            baseWater *= activityMultipliers[inputs.activity];
            
            // Climate adjustments
            const climateAdjustments = {
                'Cool': 1.0,
                'Moderate': 1.1,
                'Hot': 1.3
            };
            
            baseWater *= climateAdjustments[inputs.climate];
            
            // Health status adjustments
            const healthAdjustments = {
                'Healthy': 1.0,
                'Fever/Illness': 1.15,
                'Pregnancy': 1.3,
                'Breastfeeding': 1.5
            };
            
            baseWater *= healthAdjustments[inputs.health];
            
            const waterLiters = baseWater / 1000;
            const waterCups = baseWater / 250; // 250ml per cup
            const waterOunces = baseWater / 29.5735; // ml to fl oz
            
            return `Daily Water Intake: ${Math.round(baseWater)} ml
In Liters: ${waterLiters.toFixed(1)} L
In Cups (250ml): ${Math.round(waterCups)} cups
In Fluid Ounces: ${Math.round(waterOunces)} fl oz
Activity Level: ${inputs.activity}
Climate: ${inputs.climate}`;
        }
    },

    'heart-rate-zone': {
        title: 'Heart Rate Zone Calculator',
        icon: 'fas fa-heartbeat',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'restingHR', label: 'Resting Heart Rate (optional)', type: 'number', placeholder: 'Enter resting HR' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const restingHR = parseInt(inputs.restingHR) || 60;
            const maxHR = 220 - age;
            const hrReserve = maxHR - restingHR;
            
            // Karvonen Formula zones
            const zone1Min = Math.round(restingHR + (hrReserve * 0.5));
            const zone1Max = Math.round(restingHR + (hrReserve * 0.6));
            const zone2Min = Math.round(restingHR + (hrReserve * 0.6));
            const zone2Max = Math.round(restingHR + (hrReserve * 0.7));
            const zone3Min = Math.round(restingHR + (hrReserve * 0.7));
            const zone3Max = Math.round(restingHR + (hrReserve * 0.8));
            const zone4Min = Math.round(restingHR + (hrReserve * 0.8));
            const zone4Max = Math.round(restingHR + (hrReserve * 0.9));
            const zone5Min = Math.round(restingHR + (hrReserve * 0.9));
            const zone5Max = maxHR;
            
            return `Maximum Heart Rate: ${maxHR} bpm
Zone 1 (50-60%): ${zone1Min}-${zone1Max} bpm - Active Recovery
Zone 2 (60-70%): ${zone2Min}-${zone2Max} bpm - Base Endurance
Zone 3 (70-80%): ${zone3Min}-${zone3Max} bpm - Aerobic Base
Zone 4 (80-90%): ${zone4Min}-${zone4Max} bpm - Lactate Threshold
Zone 5 (90-100%): ${zone5Min}-${zone5Max} bpm - VO2 Max`;
        }
    },

    'vo2-max': {
        title: 'VO2 Max Calculator',
        icon: 'fas fa-lungs',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'restingHR', label: 'Resting Heart Rate', type: 'number', placeholder: 'Enter resting HR' },
            { id: 'maxHR', label: 'Maximum Heart Rate (optional)', type: 'number', placeholder: 'Enter max HR' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const restingHR = parseInt(inputs.restingHR) || 0;
            const maxHR = parseInt(inputs.maxHR) || (220 - age);
            
            // Non-exercise VO2 max estimation (Jackson et al.)
            let vo2max;
            if (inputs.gender === 'Male') {
                vo2max = 15.3 * (maxHR / restingHR);
            } else {
                vo2max = 14.7 * (maxHR / restingHR);
            }
            
            // Age adjustment
            vo2max = vo2max - (age * 0.5);
            
            let fitnessLevel;
            const ageCategory = age < 30 ? 'young' : age < 40 ? 'middle' : 'older';
            
            if (inputs.gender === 'Male') {
                if (vo2max >= 50) fitnessLevel = 'Excellent';
                else if (vo2max >= 43) fitnessLevel = 'Good';
                else if (vo2max >= 35) fitnessLevel = 'Fair';
                else if (vo2max >= 28) fitnessLevel = 'Poor';
                else fitnessLevel = 'Very Poor';
            } else {
                if (vo2max >= 45) fitnessLevel = 'Excellent';
                else if (vo2max >= 38) fitnessLevel = 'Good';
                else if (vo2max >= 31) fitnessLevel = 'Fair';
                else if (vo2max >= 24) fitnessLevel = 'Poor';
                else fitnessLevel = 'Very Poor';
            }
            
            return `Estimated VO2 Max: ${vo2max.toFixed(1)} ml/kg/min
Fitness Level: ${fitnessLevel}
Max Heart Rate: ${maxHR} bpm
Resting Heart Rate: ${restingHR} bpm
Note: This is an estimation. Lab testing provides accurate results.`;
        }
    },

    'pregnancy-due-date': {
        title: 'Pregnancy Due Date Calculator',
        icon: 'fas fa-baby',
        inputs: [
            { id: 'lastPeriod', label: 'Last Menstrual Period (YYYY-MM-DD)', type: 'date', placeholder: 'Select date' },
            { id: 'cycleLength', label: 'Average Cycle Length (days)', type: 'number', placeholder: 'Enter cycle length (default: 28)', value: '28' }
        ],
        calculate: function(inputs) {
            const lmpDate = new Date(inputs.lastPeriod);
            const cycleLength = parseInt(inputs.cycleLength) || 28;
            
            if (!inputs.lastPeriod) {
                return 'Please enter your last menstrual period date';
            }
            
            // Naegele's Rule: Add 280 days to LMP
            const dueDate = new Date(lmpDate);
            dueDate.setDate(dueDate.getDate() + 280);
            
            // Adjust for cycle length if different from 28 days
            const adjustment = cycleLength - 28;
            dueDate.setDate(dueDate.getDate() + adjustment);
            
            const today = new Date();
            const weeksPregnant = Math.floor((today - lmpDate) / (7 * 24 * 60 * 60 * 1000));
            const daysIntoWeek = Math.floor(((today - lmpDate) % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
            
            const trimester = weeksPregnant < 13 ? 'First' : weeksPregnant < 27 ? 'Second' : 'Third';
            
            return `Due Date: ${dueDate.toDateString()}
Current Stage: ${weeksPregnant} weeks, ${daysIntoWeek} days pregnant
Trimester: ${trimester}
Conception Date: ${new Date(lmpDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toDateString()}`;
        }
    },

    'ovulation': {
        title: 'Ovulation Calculator',
        icon: 'fas fa-calendar-check',
        inputs: [
            { id: 'lastPeriod', label: 'Last Period Start Date (YYYY-MM-DD)', type: 'date', placeholder: 'Select date' },
            { id: 'cycleLength', label: 'Cycle Length (days)', type: 'number', placeholder: 'Enter cycle length (default: 28)', value: '28' }
        ],
        calculate: function(inputs) {
            const lastPeriodDate = new Date(inputs.lastPeriod);
            const cycleLength = parseInt(inputs.cycleLength) || 28;
            
            if (!inputs.lastPeriod) {
                return 'Please enter your last period start date';
            }
            
            // Ovulation typically occurs 14 days before next period
            const ovulationDate = new Date(lastPeriodDate);
            ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14);
            
            // Fertile window: 5 days before ovulation + ovulation day + 1 day after
            const fertilityStart = new Date(ovulationDate);
            fertilityStart.setDate(fertilityStart.getDate() - 5);
            
            const fertilityEnd = new Date(ovulationDate);
            fertilityEnd.setDate(fertilityEnd.getDate() + 1);
            
            const nextPeriod = new Date(lastPeriodDate);
            nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
            
            return `Ovulation Date: ${ovulationDate.toDateString()}
Fertile Window: ${fertilityStart.toDateString()} - ${fertilityEnd.toDateString()}
Next Period: ${nextPeriod.toDateString()}
Cycle Length: ${cycleLength} days`;
        }
    },

    'bmi-children': {
        title: 'Children BMI Calculator',
        icon: 'fas fa-child',
        inputs: [
            { id: 'age', label: 'Age (months)', type: 'number', placeholder: 'Enter age in months' },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) / 100 || 0; // convert to meters
            const age = parseInt(inputs.age) || 0;
            const bmi = weight / (height * height);
            
            // Simplified percentile classification for children
            let category;
            if (bmi < 5) category = 'Underweight (Below 5th percentile)';
            else if (bmi < 85) category = 'Healthy Weight (5th-85th percentile)';
            else if (bmi < 95) category = 'Overweight (85th-95th percentile)';
            else category = 'Obese (Above 95th percentile)';
            
            const ageYears = Math.floor(age / 12);
            const ageMonths = age % 12;
            
            return `Child's BMI: ${bmi.toFixed(1)}
Age: ${ageYears} years, ${ageMonths} months
Category: ${category}
Note: Children's BMI is interpreted using percentiles specific to age and gender.`;
        }
    },

    'macro-calculator': {
        title: 'Macro Calculator',
        icon: 'fas fa-chart-pie',
        inputs: [
            { id: 'calories', label: 'Daily Calories', type: 'number', placeholder: 'Enter daily calorie target' },
            { id: 'goal', label: 'Goal', type: 'select', options: ['Weight Loss', 'Maintenance', 'Muscle Gain', 'Athletic Performance'] },
            { id: 'activity', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Light', 'Moderate', 'High', 'Very High'] }
        ],
        calculate: function(inputs) {
            const calories = parseFloat(inputs.calories) || 0;
            let proteinPercent, carbPercent, fatPercent;
            
            // Macro ratios based on goal
            switch (inputs.goal) {
                case 'Weight Loss':
                    proteinPercent = 35;
                    carbPercent = 30;
                    fatPercent = 35;
                    break;
                case 'Muscle Gain':
                    proteinPercent = 30;
                    carbPercent = 45;
                    fatPercent = 25;
                    break;
                case 'Athletic Performance':
                    proteinPercent = 25;
                    carbPercent = 50;
                    fatPercent = 25;
                    break;
                default: // Maintenance
                    proteinPercent = 25;
                    carbPercent = 45;
                    fatPercent = 30;
            }
            
            const proteinCalories = calories * (proteinPercent / 100);
            const carbCalories = calories * (carbPercent / 100);
            const fatCalories = calories * (fatPercent / 100);
            
            const proteinGrams = proteinCalories / 4; // 4 cal/g
            const carbGrams = carbCalories / 4; // 4 cal/g
            const fatGrams = fatCalories / 9; // 9 cal/g
            
            return `Daily Macronutrients for ${inputs.goal}:
Protein: ${proteinGrams.toFixed(0)}g (${proteinPercent}%) - ${proteinCalories} cal
Carbs: ${carbGrams.toFixed(0)}g (${carbPercent}%) - ${carbCalories} cal
Fat: ${fatGrams.toFixed(0)}g (${fatPercent}%) - ${fatCalories} cal
Total Calories: ${calories}`;
        }
    },

    'protein-intake': {
        title: 'Protein Intake Calculator', 
        icon: 'fas fa-drumstick-bite',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'goal', label: 'Goal', type: 'select', options: ['Sedentary Adult', 'Active Adult', 'Endurance Athlete', 'Strength Athlete', 'Weight Loss'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const age = parseInt(inputs.age) || 0;
            let proteinPerKg;
            
            // Protein requirements by goal
            switch (inputs.goal) {
                case 'Sedentary Adult':
                    proteinPerKg = 0.8;
                    break;
                case 'Active Adult':
                    proteinPerKg = 1.2;
                    break;
                case 'Endurance Athlete':
                    proteinPerKg = 1.4;
                    break;
                case 'Strength Athlete':
                    proteinPerKg = 1.8;
                    break;
                case 'Weight Loss':
                    proteinPerKg = 1.6;
                    break;
                default:
                    proteinPerKg = 1.0;
            }
            
            // Age adjustment for older adults (65+)
            if (age >= 65) {
                proteinPerKg = Math.max(proteinPerKg, 1.2);
            }
            
            const dailyProtein = weight * proteinPerKg;
            const mealProtein = dailyProtein / 3; // Assuming 3 meals
            const proteinCalories = dailyProtein * 4; // 4 cal/g
            
            return `Daily Protein Requirement: ${dailyProtein.toFixed(0)}g
Per Kg Body Weight: ${proteinPerKg}g/kg
Per Meal (3 meals): ${mealProtein.toFixed(0)}g
Calories from Protein: ${proteinCalories.toFixed(0)} cal
Goal: ${inputs.goal}`;
        }
    },

    'body-measurement': {
        title: 'Body Measurement Tracker',
        icon: 'fas fa-ruler',
        inputs: [
            { id: 'chest', label: 'Chest (cm)', type: 'number', placeholder: 'Enter chest measurement' },
            { id: 'waist', label: 'Waist (cm)', type: 'number', placeholder: 'Enter waist measurement' },
            { id: 'hips', label: 'Hips (cm)', type: 'number', placeholder: 'Enter hip measurement' },
            { id: 'bicep', label: 'Bicep (cm)', type: 'number', placeholder: 'Enter bicep measurement' },
            { id: 'thigh', label: 'Thigh (cm)', type: 'number', placeholder: 'Enter thigh measurement' }
        ],
        calculate: function(inputs) {
            const chest = parseFloat(inputs.chest) || 0;
            const waist = parseFloat(inputs.waist) || 0;
            const hips = parseFloat(inputs.hips) || 0;
            const bicep = parseFloat(inputs.bicep) || 0;
            const thigh = parseFloat(inputs.thigh) || 0;
            
            // Waist-to-hip ratio
            const waistToHip = waist / hips;
            let whrCategory;
            if (waistToHip < 0.85) whrCategory = 'Low Risk';
            else if (waistToHip < 1.0) whrCategory = 'Moderate Risk';
            else whrCategory = 'High Risk';
            
            // Chest-to-waist ratio (V-taper)
            const chestToWaist = chest / waist;
            
            return `Body Measurements Summary:
Chest: ${chest} cm
Waist: ${waist} cm  
Hips: ${hips} cm
Bicep: ${bicep} cm
Thigh: ${thigh} cm

Ratios:
Waist-to-Hip: ${waistToHip.toFixed(2)} (${whrCategory})
Chest-to-Waist: ${chestToWaist.toFixed(2)}`;
        }
    },

    'sleep-calculator': {
        title: 'Sleep Calculator',
        icon: 'fas fa-bed',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'bedtime', label: 'Desired Bedtime', type: 'time', placeholder: 'Select bedtime' },
            { id: 'wakeup', label: 'Wake-up Time', type: 'time', placeholder: 'Select wake-up time' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            
            // Recommended sleep hours by age
            let recommendedSleep;
            if (age < 1) recommendedSleep = '14-17 hours';
            else if (age < 3) recommendedSleep = '11-14 hours';
            else if (age < 6) recommendedSleep = '10-13 hours';
            else if (age < 13) recommendedSleep = '9-11 hours';
            else if (age < 18) recommendedSleep = '8-10 hours';
            else if (age < 65) recommendedSleep = '7-9 hours';
            else recommendedSleep = '7-8 hours';
            
            let sleepAnalysis = '';
            if (inputs.bedtime && inputs.wakeup) {
                const bedtime = new Date(`1970-01-01T${inputs.bedtime}`);
                let wakeup = new Date(`1970-01-01T${inputs.wakeup}`);
                
                // Handle next day wake-up
                if (wakeup <= bedtime) {
                    wakeup.setDate(wakeup.getDate() + 1);
                }
                
                const sleepDuration = (wakeup - bedtime) / (1000 * 60 * 60); // hours
                
                // Sleep cycles (1.5 hours each)
                const sleepCycles = sleepDuration / 1.5;
                
                sleepAnalysis = `
Current Sleep Schedule:
Sleep Duration: ${sleepDuration.toFixed(1)} hours
Sleep Cycles: ${sleepCycles.toFixed(1)} cycles
Quality: ${Math.abs(sleepCycles - Math.round(sleepCycles)) < 0.2 ? 'Good (complete cycles)' : 'Could be better'}`;
            }
            
            return `Sleep Requirements for Age ${age}:
Recommended: ${recommendedSleep}${sleepAnalysis}

Sleep Tips:
- Maintain consistent sleep schedule
- Avoid screens 1 hour before bed
- Keep bedroom cool and dark
- Avoid caffeine 6 hours before bed`;
        }
    },

    'hydration-status': {
        title: 'Hydration Status Calculator',
        icon: 'fas fa-tint-slash',
        inputs: [
            { id: 'urineColor', label: 'Urine Color (1-8 scale)', type: 'select', 
              options: ['1 - Pale Yellow', '2 - Light Yellow', '3 - Yellow', '4 - Dark Yellow', '5 - Amber', '6 - Light Orange', '7 - Orange', '8 - Dark Orange'] },
            { id: 'frequency', label: 'Urination Frequency (times/day)', type: 'number', placeholder: 'Enter frequency' },
            { id: 'thirst', label: 'Thirst Level', type: 'select', options: ['None', 'Mild', 'Moderate', 'Strong'] },
            { id: 'fatigue', label: 'Fatigue Level', type: 'select', options: ['None', 'Mild', 'Moderate', 'Severe'] }
        ],
        calculate: function(inputs) {
            const urineColor = parseInt(inputs.urineColor.charAt(0)) || 1;
            const frequency = parseInt(inputs.frequency) || 0;
            
            let hydrationScore = 0;
            let status = '';
            
            // Urine color scoring
            if (urineColor <= 2) hydrationScore += 3;
            else if (urineColor <= 4) hydrationScore += 2;
            else if (urineColor <= 6) hydrationScore += 1;
            else hydrationScore += 0;
            
            // Frequency scoring (normal: 6-8 times/day)
            if (frequency >= 6 && frequency <= 8) hydrationScore += 2;
            else if (frequency >= 4 && frequency <= 10) hydrationScore += 1;
            else hydrationScore += 0;
            
            // Symptom scoring
            if (inputs.thirst === 'None') hydrationScore += 1;
            if (inputs.fatigue === 'None') hydrationScore += 1;
            
            // Determine hydration status
            if (hydrationScore >= 6) status = 'Well Hydrated';
            else if (hydrationScore >= 4) status = 'Mildly Dehydrated';
            else if (hydrationScore >= 2) status = 'Moderately Dehydrated';
            else status = 'Severely Dehydrated';
            
            let recommendations = '';
            if (hydrationScore < 6) {
                recommendations = `
Recommendations:
- Increase water intake immediately
- Drink small amounts frequently
- Monitor urine color improvement
- Seek medical attention if severe symptoms persist`;
            }
            
            return `Hydration Status: ${status}
Score: ${hydrationScore}/7
Urine Color: Level ${urineColor}
Frequency: ${frequency} times/day
Thirst: ${inputs.thirst}
Fatigue: ${inputs.fatigue}${recommendations}`;
        }
    },

    'fitness-level': {
        title: 'Fitness Level Calculator',
        icon: 'fas fa-running',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'restingHR', label: 'Resting Heart Rate', type: 'number', placeholder: 'Enter resting HR' },
            { id: 'pushups', label: 'Push-ups (max in 1 min)', type: 'number', placeholder: 'Enter max push-ups' },
            { id: 'situps', label: 'Sit-ups (max in 1 min)', type: 'number', placeholder: 'Enter max sit-ups' },
            { id: 'flexibility', label: 'Sit-and-reach (cm)', type: 'number', placeholder: 'Enter flexibility measurement' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const restingHR = parseInt(inputs.restingHR) || 0;
            const pushups = parseInt(inputs.pushups) || 0;
            const situps = parseInt(inputs.situps) || 0;
            const flexibility = parseFloat(inputs.flexibility) || 0;
            
            let fitnessScore = 0;
            let components = [];
            
            // Cardiovascular fitness (resting HR)
            let cardioLevel;
            if (inputs.gender === 'Male') {
                if (restingHR < 60) { cardioLevel = 'Excellent'; fitnessScore += 5; }
                else if (restingHR < 70) { cardioLevel = 'Good'; fitnessScore += 4; }
                else if (restingHR < 80) { cardioLevel = 'Average'; fitnessScore += 3; }
                else { cardioLevel = 'Below Average'; fitnessScore += 2; }
            } else {
                if (restingHR < 65) { cardioLevel = 'Excellent'; fitnessScore += 5; }
                else if (restingHR < 75) { cardioLevel = 'Good'; fitnessScore += 4; }
                else if (restingHR < 85) { cardioLevel = 'Average'; fitnessScore += 3; }
                else { cardioLevel = 'Below Average'; fitnessScore += 2; }
            }
            components.push(`Cardio: ${cardioLevel}`);
            
            // Muscular strength (push-ups)
            let strengthLevel;
            const pushupThresholds = inputs.gender === 'Male' ? [40, 30, 20, 10] : [30, 20, 15, 8];
            if (pushups >= pushupThresholds[0]) { strengthLevel = 'Excellent'; fitnessScore += 5; }
            else if (pushups >= pushupThresholds[1]) { strengthLevel = 'Good'; fitnessScore += 4; }
            else if (pushups >= pushupThresholds[2]) { strengthLevel = 'Average'; fitnessScore += 3; }
            else if (pushups >= pushupThresholds[3]) { strengthLevel = 'Below Average'; fitnessScore += 2; }
            else { strengthLevel = 'Poor'; fitnessScore += 1; }
            components.push(`Strength: ${strengthLevel}`);
            
            // Muscular endurance (sit-ups)
            let enduranceLevel;
            const situpThresholds = inputs.gender === 'Male' ? [45, 35, 25, 15] : [35, 25, 20, 12];
            if (situps >= situpThresholds[0]) { enduranceLevel = 'Excellent'; fitnessScore += 5; }
            else if (situps >= situpThresholds[1]) { enduranceLevel = 'Good'; fitnessScore += 4; }
            else if (situps >= situpThresholds[2]) { enduranceLevel = 'Average'; fitnessScore += 3; }
            else if (situps >= situpThresholds[3]) { enduranceLevel = 'Below Average'; fitnessScore += 2; }
            else { enduranceLevel = 'Poor'; fitnessScore += 1; }
            components.push(`Endurance: ${enduranceLevel}`);
            
            // Flexibility
            let flexLevel;
            if (flexibility >= 15) { flexLevel = 'Excellent'; fitnessScore += 5; }
            else if (flexibility >= 10) { flexLevel = 'Good'; fitnessScore += 4; }
            else if (flexibility >= 5) { flexLevel = 'Average'; fitnessScore += 3; }
            else if (flexibility >= 0) { flexLevel = 'Below Average'; fitnessScore += 2; }
            else { flexLevel = 'Poor'; fitnessScore += 1; }
            components.push(`Flexibility: ${flexLevel}`);
            
            // Overall fitness level
            const maxScore = 20;
            const percentage = (fitnessScore / maxScore) * 100;
            let overallLevel;
            if (percentage >= 85) overallLevel = 'Excellent';
            else if (percentage >= 70) overallLevel = 'Good';
            else if (percentage >= 55) overallLevel = 'Average';
            else if (percentage >= 40) overallLevel = 'Below Average';
            else overallLevel = 'Poor';
            
            return `Overall Fitness Level: ${overallLevel}
Fitness Score: ${fitnessScore}/${maxScore} (${percentage.toFixed(0)}%)

Component Breakdown:
${components.join('\n')}

Test Results:
Push-ups: ${pushups}
Sit-ups: ${situps}
Resting HR: ${restingHR} bpm
Flexibility: ${flexibility} cm`;
        }
    },

    'workout-intensity': {
        title: 'Workout Intensity Calculator',
        icon: 'fas fa-dumbbell',
        inputs: [
            { id: 'exerciseType', label: 'Exercise Type', type: 'select', 
              options: ['Walking', 'Jogging', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'HIIT', 'Yoga'] },
            { id: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: 'Enter workout duration' },
            { id: 'intensity', label: 'Perceived Intensity (1-10)', type: 'select', 
              options: ['1 - Very Light', '2 - Light', '3 - Light', '4 - Moderate', '5 - Moderate', '6 - Hard', '7 - Hard', '8 - Very Hard', '9 - Very Hard', '10 - Maximum'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' }
        ],
        calculate: function(inputs) {
            const duration = parseFloat(inputs.duration) || 0;
            const intensity = parseInt(inputs.intensity.charAt(0)) || 1;
            const weight = parseFloat(inputs.weight) || 70;
            
            // MET values for different exercises at moderate intensity
            const metValues = {
                'Walking': 3.5,
                'Jogging': 7.0,
                'Running': 11.0,
                'Cycling': 8.0,
                'Swimming': 8.0,
                'Weight Training': 6.0,
                'HIIT': 12.0,
                'Yoga': 2.5
            };
            
            const baseMET = metValues[inputs.exerciseType] || 5.0;
            
            // Adjust MET based on perceived intensity
            const intensityMultiplier = intensity / 5; // Scale around moderate (5)
            const adjustedMET = baseMET * intensityMultiplier;
            
            // Calculate calories burned
            const caloriesBurned = adjustedMET * weight * (duration / 60);
            
            // Determine training zone
            let trainingZone;
            if (intensity <= 3) trainingZone = 'Active Recovery';
            else if (intensity <= 5) trainingZone = 'Aerobic Base';
            else if (intensity <= 7) trainingZone = 'Tempo';
            else if (intensity <= 9) trainingZone = 'Lactate Threshold';
            else trainingZone = 'VO2 Max';
            
            // Recovery recommendation
            let recoveryTime;
            if (intensity <= 4) recoveryTime = '0-12 hours';
            else if (intensity <= 6) recoveryTime = '12-24 hours';
            else if (intensity <= 8) recoveryTime = '24-48 hours';
            else recoveryTime = '48-72 hours';
            
            return `Workout Analysis:
Exercise: ${inputs.exerciseType}
Duration: ${duration} minutes
Intensity: ${intensity}/10 (${trainingZone})
Calories Burned: ${Math.round(caloriesBurned)}
MET Value: ${adjustedMET.toFixed(1)}

Recovery Time: ${recoveryTime}
Training Effect: ${intensity >= 7 ? 'High' : intensity >= 5 ? 'Moderate' : 'Low'}`;
        }
    },

    'recovery-calculator': {
        title: 'Recovery Calculator',
        icon: 'fas fa-spa',
        inputs: [
            { id: 'workoutIntensity', label: 'Workout Intensity (1-10)', type: 'select', 
              options: ['1 - Very Light', '2 - Light', '3 - Light', '4 - Moderate', '5 - Moderate', '6 - Hard', '7 - Hard', '8 - Very Hard', '9 - Very Hard', '10 - Maximum'] },
            { id: 'workoutDuration', label: 'Workout Duration (minutes)', type: 'number', placeholder: 'Enter duration' },
            { id: 'sleepQuality', label: 'Sleep Quality Last Night', type: 'select', options: ['Poor', 'Fair', 'Good', 'Excellent'] },
            { id: 'stressLevel', label: 'Stress Level', type: 'select', options: ['Low', 'Moderate', 'High', 'Very High'] },
            { id: 'nutrition', label: 'Nutrition Quality', type: 'select', options: ['Poor', 'Fair', 'Good', 'Excellent'] }
        ],
        calculate: function(inputs) {
            const intensity = parseInt(inputs.workoutIntensity.charAt(0)) || 1;
            const duration = parseFloat(inputs.workoutDuration) || 0;
            
            let recoveryScore = 100; // Start with full recovery
            
            // Workout impact on recovery
            const workoutImpact = intensity * (duration / 60);
            recoveryScore -= workoutImpact * 5;
            
            // Sleep quality impact
            const sleepImpact = {
                'Poor': -30,
                'Fair': -15,
                'Good': 0,
                'Excellent': 10
            };
            recoveryScore += sleepImpact[inputs.sleepQuality] || 0;
            
            // Stress level impact
            const stressImpact = {
                'Low': 5,
                'Moderate': 0,
                'High': -15,
                'Very High': -25
            };
            recoveryScore += stressImpact[inputs.stressLevel] || 0;
            
            // Nutrition impact
            const nutritionImpact = {
                'Poor': -15,
                'Fair': -5,
                'Good': 0,
                'Excellent': 10
            };
            recoveryScore += nutritionImpact[inputs.nutrition] || 0;
            
            // Ensure score stays within bounds
            recoveryScore = Math.max(0, Math.min(100, recoveryScore));
            
            let recoveryStatus;
            let recommendation;
            
            if (recoveryScore >= 80) {
                recoveryStatus = 'Fully Recovered';
                recommendation = 'Ready for high-intensity training';
            } else if (recoveryScore >= 60) {
                recoveryStatus = 'Well Recovered';
                recommendation = 'Can handle moderate to high intensity';
            } else if (recoveryScore >= 40) {
                recoveryStatus = 'Partially Recovered';
                recommendation = 'Light to moderate exercise recommended';
            } else if (recoveryScore >= 20) {
                recoveryStatus = 'Poor Recovery';
                recommendation = 'Active recovery or rest day recommended';
            } else {
                recoveryStatus = 'Very Poor Recovery';
                recommendation = 'Complete rest day required';
            }
            
            return `Recovery Status: ${recoveryStatus}
Recovery Score: ${Math.round(recoveryScore)}/100

Factors:
Workout Impact: Intensity ${intensity}, Duration ${duration} min
Sleep: ${inputs.sleepQuality}
Stress: ${inputs.stressLevel}
Nutrition: ${inputs.nutrition}

Recommendation: ${recommendation}

Recovery Tips:
- Prioritize 7-9 hours of quality sleep
- Stay hydrated
- Eat protein within 2 hours post-workout
- Manage stress through relaxation techniques`;
        }
    },

    'training-load': {
        title: 'Training Load Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'sessions', label: 'Training Sessions This Week', type: 'text', placeholder: 'Format: duration,intensity (e.g., 60,7 90,5 45,8)' },
            { id: 'lastWeekLoad', label: 'Last Week Total Load (optional)', type: 'number', placeholder: 'Enter previous week load' }
        ],
        calculate: function(inputs) {
            const sessionsText = inputs.sessions || '';
            const lastWeekLoad = parseFloat(inputs.lastWeekLoad) || 0;
            
            if (!sessionsText.trim()) {
                return 'Please enter training sessions in format: duration,intensity (e.g., 60,7 90,5 45,8)';
            }
            
            const sessions = sessionsText.split(' ').map(session => {
                const [duration, intensity] = session.split(',').map(x => parseFloat(x));
                return { duration: duration || 0, intensity: intensity || 0 };
            }).filter(s => s.duration > 0 && s.intensity > 0);
            
            if (sessions.length === 0) {
                return 'Invalid session format. Use: duration,intensity (e.g., 60,7)';
            }
            
            // Calculate training load (duration × intensity)
            let totalLoad = 0;
            let sessionBreakdown = [];
            
            sessions.forEach((session, index) => {
                const load = session.duration * session.intensity;
                totalLoad += load;
                sessionBreakdown.push(`Session ${index + 1}: ${session.duration}min × ${session.intensity} = ${load} load`);
            });
            
            const averageIntensity = sessions.reduce((sum, s) => sum + s.intensity, 0) / sessions.length;
            const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
            
            let loadCategory;
            if (totalLoad < 1000) loadCategory = 'Light';
            else if (totalLoad < 2000) loadCategory = 'Moderate';
            else if (totalLoad < 3000) loadCategory = 'High';
            else loadCategory = 'Very High';
            
            let weeklyChange = '';
            if (lastWeekLoad > 0) {
                const changePercent = ((totalLoad - lastWeekLoad) / lastWeekLoad) * 100;
                const safeIncrease = changePercent <= 10;
                weeklyChange = `
Weekly Change: ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%
Status: ${safeIncrease ? 'Safe progression' : 'High increase - monitor recovery'}`;
            }
            
            return `Training Load Analysis:
Total Load: ${totalLoad.toFixed(0)} (${loadCategory})
Sessions: ${sessions.length}
Total Duration: ${totalDuration} minutes
Average Intensity: ${averageIntensity.toFixed(1)}/10${weeklyChange}

Session Breakdown:
${sessionBreakdown.join('\n')}

Guidelines:
- Increase load by max 10% per week
- Monitor recovery between sessions
- Balance high and low intensity days`;
        }
    },

    'body-age': {
        title: 'Body Age Calculator',
        icon: 'fas fa-calendar-alt',
        inputs: [
            { id: 'chronoAge', label: 'Chronological Age', type: 'number', placeholder: 'Enter actual age' },
            { id: 'restingHR', label: 'Resting Heart Rate', type: 'number', placeholder: 'Enter resting HR' },
            { id: 'exerciseFreq', label: 'Exercise Frequency (days/week)', type: 'number', placeholder: 'Enter exercise days' },
            { id: 'smoking', label: 'Smoking Status', type: 'select', options: ['Never', 'Former (>5 years)', 'Former (<5 years)', 'Current'] },
            { id: 'alcohol', label: 'Alcohol Consumption', type: 'select', options: ['None', 'Light (1-2 drinks/week)', 'Moderate (3-7 drinks/week)', 'Heavy (>7 drinks/week)'] },
            { id: 'sleep', label: 'Sleep Quality', type: 'select', options: ['Poor (<6 hours)', 'Fair (6-7 hours)', 'Good (7-8 hours)', 'Excellent (8+ hours)'] }
        ],
        calculate: function(inputs) {
            const chronoAge = parseInt(inputs.chronoAge) || 0;
            const restingHR = parseInt(inputs.restingHR) || 70;
            const exerciseFreq = parseInt(inputs.exerciseFreq) || 0;
            
            let bodyAge = chronoAge;
            let factors = [];
            
            // Resting heart rate impact
            if (restingHR < 60) {
                bodyAge -= 3;
                factors.push('Excellent resting HR (-3 years)');
            } else if (restingHR < 70) {
                bodyAge -= 1;
                factors.push('Good resting HR (-1 year)');
            } else if (restingHR > 80) {
                bodyAge += 2;
                factors.push('High resting HR (+2 years)');
            }
            
            // Exercise frequency impact
            if (exerciseFreq >= 5) {
                bodyAge -= 4;
                factors.push('Very active lifestyle (-4 years)');
            } else if (exerciseFreq >= 3) {
                bodyAge -= 2;
                factors.push('Active lifestyle (-2 years)');
            } else if (exerciseFreq >= 1) {
                bodyAge -= 1;
                factors.push('Some exercise (-1 year)');
            } else {
                bodyAge += 3;
                factors.push('Sedentary lifestyle (+3 years)');
            }
            
            // Smoking impact
            switch (inputs.smoking) {
                case 'Current':
                    bodyAge += 8;
                    factors.push('Current smoking (+8 years)');
                    break;
                case 'Former (<5 years)':
                    bodyAge += 2;
                    factors.push('Recent former smoker (+2 years)');
                    break;
                case 'Former (>5 years)':
                    bodyAge += 0;
                    factors.push('Long-term former smoker (0 years)');
                    break;
                default:
                    bodyAge -= 1;
                    factors.push('Never smoked (-1 year)');
            }
            
            // Alcohol impact
            switch (inputs.alcohol) {
                case 'None':
                    bodyAge += 0;
                    factors.push('No alcohol (0 years)');
                    break;
                case 'Light (1-2 drinks/week)':
                    bodyAge -= 1;
                    factors.push('Light alcohol consumption (-1 year)');
                    break;
                case 'Moderate (3-7 drinks/week)':
                    bodyAge += 1;
                    factors.push('Moderate alcohol consumption (+1 year)');
                    break;
                case 'Heavy (>7 drinks/week)':
                    bodyAge += 4;
                    factors.push('Heavy alcohol consumption (+4 years)');
                    break;
            }
            
            // Sleep impact
            switch (inputs.sleep) {
                case 'Excellent (8+ hours)':
                    bodyAge -= 2;
                    factors.push('Excellent sleep (-2 years)');
                    break;
                case 'Good (7-8 hours)':
                    bodyAge -= 1;
                    factors.push('Good sleep (-1 year)');
                    break;
                case 'Fair (6-7 hours)':
                    bodyAge += 1;
                    factors.push('Fair sleep (+1 year)');
                    break;
                case 'Poor (<6 hours)':
                    bodyAge += 3;
                    factors.push('Poor sleep (+3 years)');
                    break;
            }
            
            const ageDifference = bodyAge - chronoAge;
            let interpretation;
            
            if (ageDifference <= -5) {
                interpretation = 'Excellent! Your body is significantly younger than your age.';
            } else if (ageDifference <= -2) {
                interpretation = 'Great! Your body is younger than your chronological age.';
            } else if (ageDifference <= 2) {
                interpretation = 'Good! Your body age matches your chronological age.';
            } else if (ageDifference <= 5) {
                interpretation = 'Your body is aging faster than normal. Consider lifestyle improvements.';
            } else {
                interpretation = 'Significant lifestyle changes recommended to improve body age.';
            }
            
            return `Body Age Assessment:
Chronological Age: ${chronoAge} years
Biological Body Age: ${Math.round(bodyAge)} years
Difference: ${ageDifference > 0 ? '+' : ''}${ageDifference.toFixed(1)} years

${interpretation}

Contributing Factors:
${factors.join('\n')}

Recommendations:
- Maintain regular exercise routine
- Prioritize 7-9 hours of quality sleep
- Avoid smoking and limit alcohol
- Monitor cardiovascular health`;
        }
    },

    'power-consumption': {
        title: 'Power Consumption Calculator',
        icon: 'fas fa-plug',
        inputs: [
            { id: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'Enter voltage' },
            { id: 'current', label: 'Current (A)', type: 'number', placeholder: 'Enter current' },
            { id: 'hours', label: 'Usage Hours/Day', type: 'number', placeholder: 'Enter daily usage hours' },
            { id: 'rate', label: 'Rate ($/kWh)', type: 'number', placeholder: 'Enter electricity rate', step: '0.01' }
        ],
        calculate: function(inputs) {
            const voltage = parseFloat(inputs.voltage) || 0;
            const current = parseFloat(inputs.current) || 0;
            const hours = parseFloat(inputs.hours) || 0;
            const rate = parseFloat(inputs.rate) || 0;
            
            const power = voltage * current; // Watts
            const dailyConsumption = power * hours / 1000; // kWh
            const monthlyConsumption = dailyConsumption * 30;
            const dailyCost = dailyConsumption * rate;
            const monthlyCost = monthlyConsumption * rate;
            
            return `Power: ${power.toFixed(2)} W
Daily Consumption: ${dailyConsumption.toFixed(3)} kWh
Monthly Consumption: ${monthlyConsumption.toFixed(1)} kWh
Daily Cost: $${dailyCost.toFixed(2)}
Monthly Cost: $${monthlyCost.toFixed(2)}`;
        }
    },

    'resistor-color': {
        title: 'Resistor Color Code Calculator',
        icon: 'fas fa-palette',
        inputs: [
            { id: 'band1', label: 'Band 1', type: 'select', options: ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Gray', 'White'] },
            { id: 'band2', label: 'Band 2', type: 'select', options: ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Gray', 'White'] },
            { id: 'band3', label: 'Band 3 (Multiplier)', type: 'select', options: ['Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet', 'Gray', 'White', 'Gold', 'Silver'] },
            { id: 'band4', label: 'Band 4 (Tolerance)', type: 'select', options: ['Brown', 'Red', 'Gold', 'Silver'] }
        ],
        calculate: function(inputs) {
            const colors = {
                'Black': 0, 'Brown': 1, 'Red': 2, 'Orange': 3, 'Yellow': 4,
                'Green': 5, 'Blue': 6, 'Violet': 7, 'Gray': 8, 'White': 9
            };
            
            const multipliers = {
                'Black': 1, 'Brown': 10, 'Red': 100, 'Orange': 1000, 'Yellow': 10000,
                'Green': 100000, 'Blue': 1000000, 'Violet': 10000000, 'Gray': 100000000, 'White': 1000000000,
                'Gold': 0.1, 'Silver': 0.01
            };
            
            const tolerances = {
                'Brown': '±1%', 'Red': '±2%', 'Gold': '±5%', 'Silver': '±10%'
            };
            
            const band1 = colors[inputs.band1] || 0;
            const band2 = colors[inputs.band2] || 0;
            const multiplier = multipliers[inputs.band3] || 1;
            const tolerance = tolerances[inputs.band4] || '±5%';
            
            const resistance = (band1 * 10 + band2) * multiplier;
            
            let unit = 'Ω';
            let displayValue = resistance;
            
            if (resistance >= 1000000) {
                displayValue = resistance / 1000000;
                unit = 'MΩ';
            } else if (resistance >= 1000) {
                displayValue = resistance / 1000;
                unit = 'kΩ';
            }
            
            return `Resistance: ${displayValue.toFixed(2)} ${unit}
Raw Value: ${resistance.toFixed(2)} Ω
Tolerance: ${tolerance}
Color Code: ${inputs.band1}-${inputs.band2}-${inputs.band3}-${inputs.band4}`;
        }
    },

    'voltage-divider': {
        title: 'Voltage Divider Calculator',
        icon: 'fas fa-divide',
        inputs: [
            { id: 'vin', label: 'Input Voltage (V)', type: 'number', placeholder: 'Enter input voltage' },
            { id: 'r1', label: 'Resistor R1 (Ω)', type: 'number', placeholder: 'Enter R1 value' },
            { id: 'r2', label: 'Resistor R2 (Ω)', type: 'number', placeholder: 'Enter R2 value' }
        ],
        calculate: function(inputs) {
            const vin = parseFloat(inputs.vin) || 0;
            const r1 = parseFloat(inputs.r1) || 0;
            const r2 = parseFloat(inputs.r2) || 0;
            
            const vout = vin * (r2 / (r1 + r2));
            const totalResistance = r1 + r2;
            const current = vin / totalResistance;
            const powerR1 = current * current * r1;
            const powerR2 = current * current * r2;
            const totalPower = powerR1 + powerR2;
            
            return `Output Voltage: ${vout.toFixed(3)} V
Total Resistance: ${totalResistance.toFixed(2)} Ω
Current: ${(current * 1000).toFixed(2)} mA
Power in R1: ${(powerR1 * 1000).toFixed(2)} mW
Power in R2: ${(powerR2 * 1000).toFixed(2)} mW
Total Power: ${(totalPower * 1000).toFixed(2)} mW`;
        }
    },

    'capacitor': {
        title: 'Capacitor Calculator',
        icon: 'fas fa-battery-half',
        inputs: [
            { id: 'capacitance', label: 'Capacitance (µF)', type: 'number', placeholder: 'Enter capacitance' },
            { id: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'Enter voltage' },
            { id: 'frequency', label: 'Frequency (Hz)', type: 'number', placeholder: 'Enter frequency (optional)' }
        ],
        calculate: function(inputs) {
            const capacitance = parseFloat(inputs.capacitance) || 0;
            const voltage = parseFloat(inputs.voltage) || 0;
            const frequency = parseFloat(inputs.frequency) || 0;
            
            const capacitanceFarads = capacitance / 1000000; // Convert µF to F
            const energy = 0.5 * capacitanceFarads * voltage * voltage; // Joules
            const charge = capacitanceFarads * voltage; // Coulombs
            
            let result = `Energy Stored: ${(energy * 1000).toFixed(3)} mJ
Charge Stored: ${(charge * 1000000).toFixed(2)} µC
Capacitance: ${capacitance} µF`;
            
            if (frequency > 0) {
                const reactance = 1 / (2 * Math.PI * frequency * capacitanceFarads);
                result += `\nReactance at ${frequency} Hz: ${reactance.toFixed(2)} Ω`;
            }
            
            return result;
        }
    },    'transformer-turns': {
        title: 'Transformer Turns Ratio Calculator',
        icon: 'fas fa-exchange-alt',
        inputs: [
            { id: 'primaryVoltage', label: 'Primary Voltage (V)', type: 'number', placeholder: 'Enter primary voltage' },
            { id: 'secondaryVoltage', label: 'Secondary Voltage (V)', type: 'number', placeholder: 'Enter secondary voltage' },
            { id: 'primaryTurns', label: 'Primary Turns', type: 'number', placeholder: 'Enter primary turns (optional)' }
        ],
        calculate: function(inputs) {
            const vp = parseFloat(inputs.primaryVoltage) || 0;
            const vs = parseFloat(inputs.secondaryVoltage) || 0;
            const np = parseFloat(inputs.primaryTurns) || 0;
            
            const turnsRatio = vp / vs;
            const voltageRatio = vs / vp;
            
            let result = `Turns Ratio (Np:Ns): ${turnsRatio.toFixed(3)}:1
Voltage Ratio: 1:${voltageRatio.toFixed(3)}`;
            
            if (np > 0) {
                const ns = np / turnsRatio;
                result += `\nSecondary Turns: ${ns.toFixed(0)}`;
            }
            
            result += `\nTransformer Type: ${vp > vs ? 'Step-down' : vp < vs ? 'Step-up' : 'Isolation'}`;
            
            return result;
        }
    },

    'inductor-reactance': {
        title: 'Inductor Reactance Calculator',
        icon: 'fas fa-coil',
        inputs: [
            { id: 'inductance', label: 'Inductance (mH)', type: 'number', placeholder: 'Enter inductance' },
            { id: 'frequency', label: 'Frequency (Hz)', type: 'number', placeholder: 'Enter frequency' }
        ],
        calculate: function(inputs) {
            const inductance = parseFloat(inputs.inductance) || 0;
            const frequency = parseFloat(inputs.frequency) || 0;
            
            const inductanceHenries = inductance / 1000; // Convert mH to H
            const reactance = 2 * Math.PI * frequency * inductanceHenries;
            const impedance = reactance; // For pure inductor
            
            return `Inductive Reactance: ${reactance.toFixed(2)} Ω
Impedance: ${impedance.toFixed(2)} Ω
Angular Frequency: ${(2 * Math.PI * frequency).toFixed(2)} rad/s
Inductance: ${inductance} mH`;
        }
    },

    'rc-time-constant': {
        title: 'RC Time Constant Calculator',
        icon: 'fas fa-clock',
        inputs: [
            { id: 'resistance', label: 'Resistance (kΩ)', type: 'number', placeholder: 'Enter resistance' },
            { id: 'capacitance', label: 'Capacitance (µF)', type: 'number', placeholder: 'Enter capacitance' }
        ],
        calculate: function(inputs) {
            const resistance = parseFloat(inputs.resistance) || 0;
            const capacitance = parseFloat(inputs.capacitance) || 0;
            
            const resistanceOhms = resistance * 1000; // Convert kΩ to Ω
            const capacitanceFarads = capacitance / 1000000; // Convert µF to F
            const timeConstant = resistanceOhms * capacitanceFarads;
            
            const charge63 = timeConstant;
            const charge95 = timeConstant * 3;
            const charge99 = timeConstant * 5;
            
            return `Time Constant (τ): ${(timeConstant * 1000).toFixed(3)} ms
63% Charge Time: ${(charge63 * 1000).toFixed(3)} ms
95% Charge Time: ${(charge95 * 1000).toFixed(3)} ms
99% Charge Time: ${(charge99 * 1000).toFixed(3)} ms
Cutoff Frequency: ${(1/(2*Math.PI*timeConstant)).toFixed(2)} Hz`;
        }
    },

    'rlc-resonance': {
        title: 'RLC Resonance Calculator',
        icon: 'fas fa-wave-sine',
        inputs: [
            { id: 'resistance', label: 'Resistance (Ω)', type: 'number', placeholder: 'Enter resistance' },
            { id: 'inductance', label: 'Inductance (mH)', type: 'number', placeholder: 'Enter inductance' },
            { id: 'capacitance', label: 'Capacitance (µF)', type: 'number', placeholder: 'Enter capacitance' }
        ],
        calculate: function(inputs) {
            const R = parseFloat(inputs.resistance) || 0;
            const L = parseFloat(inputs.inductance) / 1000 || 0; // Convert mH to H
            const C = parseFloat(inputs.capacitance) / 1000000 || 0; // Convert µF to F
            
            const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(L * C));
            const qualityFactor = (1/R) * Math.sqrt(L/C);
            const bandwidth = resonantFreq / qualityFactor;
            const impedanceAtResonance = R;
            
            return `Resonant Frequency: ${resonantFreq.toFixed(2)} Hz
Quality Factor (Q): ${qualityFactor.toFixed(2)}
Bandwidth: ${bandwidth.toFixed(2)} Hz
Impedance at Resonance: ${impedanceAtResonance.toFixed(2)} Ω
Angular Frequency: ${(2 * Math.PI * resonantFreq).toFixed(2)} rad/s`;
        }
    },

    'parallel-resistance': {
        title: 'Parallel Resistance Calculator',
        icon: 'fas fa-equals',
        inputs: [
            { id: 'resistors', label: 'Resistor Values (Ω, comma-separated)', type: 'text', placeholder: 'e.g., 100,200,300' }
        ],
        calculate: function(inputs) {
            const resistorString = inputs.resistors || '';
            const resistors = resistorString.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r) && r > 0);
            
            if (resistors.length < 2) {
                return 'Error: Please enter at least 2 resistor values';
            }
            
            const reciprocalSum = resistors.reduce((sum, r) => sum + (1/r), 0);
            const totalResistance = 1 / reciprocalSum;
            
            const resistorList = resistors.join('Ω, ') + 'Ω';
            
            return `Parallel Resistance: ${totalResistance.toFixed(3)} Ω
Number of Resistors: ${resistors.length}
Resistor Values: ${resistorList}
Formula: 1/Rtotal = 1/R1 + 1/R2 + ...`;
        }
    },

    'series-resistance': {
        title: 'Series Resistance Calculator',
        icon: 'fas fa-link',
        inputs: [
            { id: 'resistors', label: 'Resistor Values (Ω, comma-separated)', type: 'text', placeholder: 'e.g., 100,200,300' }
        ],
        calculate: function(inputs) {
            const resistorString = inputs.resistors || '';
            const resistors = resistorString.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r) && r > 0);
            
            if (resistors.length < 2) {
                return 'Error: Please enter at least 2 resistor values';
            }
            
            const totalResistance = resistors.reduce((sum, r) => sum + r, 0);
            const resistorList = resistors.join('Ω + ') + 'Ω';
            
            return `Series Resistance: ${totalResistance.toFixed(3)} Ω
Number of Resistors: ${resistors.length}
Calculation: ${resistorList} = ${totalResistance.toFixed(3)}Ω
Formula: Rtotal = R1 + R2 + R3 + ...`;
        }
    },

    'power-factor': {
        title: 'Power Factor Calculator',
        icon: 'fas fa-angle-right',
        inputs: [
            { id: 'realPower', label: 'Real Power (W)', type: 'number', placeholder: 'Enter real power' },
            { id: 'apparentPower', label: 'Apparent Power (VA)', type: 'number', placeholder: 'Enter apparent power' }
        ],
        calculate: function(inputs) {
            const realPower = parseFloat(inputs.realPower) || 0;
            const apparentPower = parseFloat(inputs.apparentPower) || 0;
            
            if (apparentPower === 0) {
                return 'Error: Apparent power cannot be zero';
            }
            
            const powerFactor = realPower / apparentPower;
            const reactivePower = Math.sqrt(apparentPower * apparentPower - realPower * realPower);
            const phaseAngle = Math.acos(powerFactor) * (180/Math.PI);
            
            let pfType = 'Unity';
            if (powerFactor < 1 && powerFactor > 0) pfType = 'Lagging';
            if (powerFactor < 0) pfType = 'Leading';
              return `Power Factor: ${powerFactor.toFixed(3)}
Power Factor (%): ${(powerFactor * 100).toFixed(1)}%
Reactive Power: ${reactivePower.toFixed(2)} VAR
Phase Angle: ${phaseAngle.toFixed(2)}°
Power Factor Type: ${pfType}`;
        }
    },

    'three-phase-power': {
        title: 'Three-Phase Power Calculator',
        icon: 'fas fa-bolt',
        inputs: [
            { id: 'voltage', label: 'Line Voltage (V)', type: 'number', placeholder: 'Enter line voltage' },
            { id: 'current', label: 'Line Current (A)', type: 'number', placeholder: 'Enter line current' },
            { id: 'powerFactor', label: 'Power Factor', type: 'number', placeholder: 'Enter power factor (0-1)', min: '0', max: '1', step: '0.01' }
        ],
        calculate: function(inputs) {
            const voltage = parseFloat(inputs.voltage) || 0;
            const current = parseFloat(inputs.current) || 0;
            const pf = parseFloat(inputs.powerFactor) || 1;
            
            const realPower = Math.sqrt(3) * voltage * current * pf / 1000; // kW
            const apparentPower = Math.sqrt(3) * voltage * current / 1000; // kVA
            const reactivePower = Math.sqrt(apparentPower * apparentPower - realPower * realPower); // kVAR
            const phaseAngle = Math.acos(pf) * (180/Math.PI);
            
            return `Real Power: ${realPower.toFixed(2)} kW
Apparent Power: ${apparentPower.toFixed(2)} kVA
Reactive Power: ${reactivePower.toFixed(2)} kVAR
Power Factor: ${pf.toFixed(3)}
Phase Angle: ${phaseAngle.toFixed(2)}°
Line Voltage: ${voltage} V
Line Current: ${current} A`;
        }
    },

    'wire-gauge': {
        title: 'Wire Gauge Calculator',
        icon: 'fas fa-ruler',
        inputs: [
            { id: 'current', label: 'Current (A)', type: 'number', placeholder: 'Enter current' },
            { id: 'length', label: 'Wire Length (ft)', type: 'number', placeholder: 'Enter wire length' },
            { id: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'Enter voltage' },
            { id: 'voltDrop', label: 'Max Voltage Drop (%)', type: 'number', placeholder: 'Enter max voltage drop', value: '3' }
        ],
        calculate: function(inputs) {
            const current = parseFloat(inputs.current) || 0;
            const length = parseFloat(inputs.length) || 0;
            const voltage = parseFloat(inputs.voltage) || 0;
            const voltDropPercent = parseFloat(inputs.voltDrop) || 3;
            
            const maxVoltDrop = voltage * (voltDropPercent / 100);
            const resistance = maxVoltDrop / current;
            const resistancePerFoot = resistance / (2 * length); // Round trip
            
            // AWG resistance values (ohms per 1000 ft at 75°C)
            const awgData = {
                '14': 3.07, '12': 1.93, '10': 1.21, '8': 0.764, '6': 0.491,
                '4': 0.308, '2': 0.194, '1/0': 0.122, '2/0': 0.0967, '3/0': 0.0766,
                '4/0': 0.0608, '250': 0.0515, '300': 0.0429, '350': 0.0367, '400': 0.0321
            };
            
            let recommendedGauge = '400 MCM';
            for (const [gauge, resistance1000ft] of Object.entries(awgData)) {
                const actualResistance = resistance1000ft / 1000; // Per foot
                if (actualResistance <= resistancePerFoot) {
                    recommendedGauge = gauge + ' AWG';
                    break;
                }
            }
            
            return `Recommended Wire Gauge: ${recommendedGauge}
Maximum Voltage Drop: ${maxVoltDrop.toFixed(2)} V (${voltDropPercent}%)
Required Resistance: ${resistance.toFixed(4)} Ω
Resistance per Foot: ${(resistancePerFoot * 1000).toFixed(4)} mΩ/ft
Current: ${current} A
Wire Length: ${length} ft (one way)`;
        }
    },

    'led-resistor': {
        title: 'LED Resistor Calculator',
        icon: 'fas fa-lightbulb',
        inputs: [
            { id: 'supplyVoltage', label: 'Supply Voltage (V)', type: 'number', placeholder: 'Enter supply voltage' },
            { id: 'ledVoltage', label: 'LED Forward Voltage (V)', type: 'number', placeholder: 'Enter LED voltage', value: '2.1' },
            { id: 'ledCurrent', label: 'LED Current (mA)', type: 'number', placeholder: 'Enter LED current', value: '20' }
        ],
        calculate: function(inputs) {
            const supplyVoltage = parseFloat(inputs.supplyVoltage) || 0;
            const ledVoltage = parseFloat(inputs.ledVoltage) || 2.1;
            const ledCurrentMA = parseFloat(inputs.ledCurrent) || 20;
            
            const ledCurrentA = ledCurrentMA / 1000;
            const voltageDropAcrossResistor = supplyVoltage - ledVoltage;
            const resistance = voltageDropAcrossResistor / ledCurrentA;
            const powerDissipation = voltageDropAcrossResistor * ledCurrentA;
            
            // Standard resistor values
            const standardValues = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200, 10000];
            let closestResistor = standardValues.reduce((prev, curr) => 
                Math.abs(curr - resistance) < Math.abs(prev - resistance) ? curr : prev
            );
            
            const actualCurrent = voltageDropAcrossResistor / closestResistor * 1000;
            const recommendedWattage = powerDissipation < 0.125 ? '1/8W' : powerDissipation < 0.25 ? '1/4W' : powerDissipation < 0.5 ? '1/2W' : '1W';
            
            return `Required Resistance: ${resistance.toFixed(1)} Ω
Closest Standard Resistor: ${closestResistor} Ω
Actual LED Current: ${actualCurrent.toFixed(1)} mA
Power Dissipation: ${(powerDissipation * 1000).toFixed(1)} mW
Recommended Wattage: ${recommendedWattage}
Voltage Drop Across Resistor: ${voltageDropAcrossResistor.toFixed(2)} V`;
        }
    },

    'antenna-length': {
        title: 'Antenna Length Calculator',
        icon: 'fas fa-broadcast-tower',
        inputs: [
            { id: 'frequency', label: 'Frequency (MHz)', type: 'number', placeholder: 'Enter frequency' },
            { id: 'antennaType', label: 'Antenna Type', type: 'select', options: ['Quarter Wave', 'Half Wave', 'Full Wave', '5/8 Wave'] }
        ],
        calculate: function(inputs) {
            const frequency = parseFloat(inputs.frequency) || 0;
            const antennaType = inputs.antennaType || 'Quarter Wave';
            
            const wavelength = 300 / frequency; // meters (c = 300,000,000 m/s)
            const wavelengthFeet = wavelength * 3.28084;
            const wavelengthInches = wavelengthFeet * 12;
            
            let multiplier;
            switch(antennaType) {
                case 'Quarter Wave': multiplier = 0.25; break;
                case 'Half Wave': multiplier = 0.5; break;
                case 'Full Wave': multiplier = 1.0; break;
                case '5/8 Wave': multiplier = 0.625; break;
                default: multiplier = 0.25;
            }
            
            const antennaLengthM = wavelength * multiplier;
            const antennaLengthFt = wavelengthFeet * multiplier;
            const antennaLengthIn = wavelengthInches * multiplier;
            const antennaLengthCm = antennaLengthM * 100;
            
            return `${antennaType} Antenna Length:
${antennaLengthM.toFixed(3)} meters
${antennaLengthFt.toFixed(2)} feet
${antennaLengthIn.toFixed(1)} inches
${antennaLengthCm.toFixed(1)} cm

Full Wavelength: ${wavelength.toFixed(3)} m
Frequency: ${frequency} MHz
Velocity Factor: 0.95 (typical)`;
        }
    },

    'decibel-converter': {
        title: 'Decibel (dB) Converter',
        icon: 'fas fa-volume-up',
        inputs: [
            { id: 'value1', label: 'Value 1', type: 'number', placeholder: 'Enter first value' },
            { id: 'value2', label: 'Value 2', type: 'number', placeholder: 'Enter second value' },
            { id: 'conversionType', label: 'Conversion Type', type: 'select', options: ['Power Ratio to dB', 'Voltage Ratio to dB', 'dB to Power Ratio', 'dB to Voltage Ratio'] }
        ],
        calculate: function(inputs) {
            const value1 = parseFloat(inputs.value1) || 0;
            const value2 = parseFloat(inputs.value2) || 1;
            const conversionType = inputs.conversionType || 'Power Ratio to dB';
            
            let result = '';
            
            switch(conversionType) {
                case 'Power Ratio to dB':
                    const powerDB = 10 * Math.log10(value1 / value2);
                    result = `Power Ratio: ${(value1/value2).toFixed(6)}
Decibels: ${powerDB.toFixed(2)} dB
Formula: dB = 10 × log₁₀(P₁/P₂)`;
                    break;
                case 'Voltage Ratio to dB':
                    const voltageDB = 20 * Math.log10(value1 / value2);
                    result = `Voltage Ratio: ${(value1/value2).toFixed(6)}
Decibels: ${voltageDB.toFixed(2)} dB
Formula: dB = 20 × log₁₀(V₁/V₂)`;
                    break;
                case 'dB to Power Ratio':
                    const powerRatio = Math.pow(10, value1 / 10);
                    result = `Decibels: ${value1} dB
Power Ratio: ${powerRatio.toFixed(6)}
Formula: Ratio = 10^(dB/10)`;
                    break;
                case 'dB to Voltage Ratio':
                    const voltageRatio = Math.pow(10, value1 / 20);
                    result = `Decibels: ${value1} dB
Voltage Ratio: ${voltageRatio.toFixed(6)}
Formula: Ratio = 10^(dB/20)`;
                    break;
            }
            
            return result;
        }
    },

    'impedance-matching': {
        title: 'Impedance Matching Calculator',
        icon: 'fas fa-adjust',
        inputs: [
            { id: 'sourceImpedance', label: 'Source Impedance (Ω)', type: 'number', placeholder: 'Enter source impedance', value: '50' },
            { id: 'loadImpedance', label: 'Load Impedance (Ω)', type: 'number', placeholder: 'Enter load impedance' },
            { id: 'frequency', label: 'Frequency (MHz)', type: 'number', placeholder: 'Enter frequency' }
        ],
        calculate: function(inputs) {
            const rs = parseFloat(inputs.sourceImpedance) || 50;
            const rl = parseFloat(inputs.loadImpedance) || 0;
            const frequency = parseFloat(inputs.frequency) || 0;
            
            const reflectionCoeff = Math.abs((rl - rs) / (rl + rs));
            const vswr = (1 + reflectionCoeff) / (1 - reflectionCoeff);
            const returnLossDB = -20 * Math.log10(reflectionCoeff);
            const matchingRatio = rl / rs;
            
            // L-network matching
            const q = Math.sqrt(Math.abs(matchingRatio - 1));
            const xl = q * Math.min(rs, rl);
            const xc = Math.max(rs, rl) / q;
            
            // Calculate component values at given frequency
            let inductanceUH = 0;
            let capacitancePF = 0;
            
            if (frequency > 0) {
                const omega = 2 * Math.PI * frequency * 1000000; // Convert MHz to Hz
                inductanceUH = (xl / omega) * 1000000; // Convert to µH
                capacitancePF = 1 / (omega * xc) * 1000000000000; // Convert to pF
            }
            
            return `Impedance Matching Analysis:
Source Impedance: ${rs} Ω
Load Impedance: ${rl} Ω
VSWR: ${vswr.toFixed(2)}:1
Return Loss: ${returnLossDB.toFixed(1)} dB
Reflection Coefficient: ${reflectionCoeff.toFixed(4)}

L-Network Matching:
Required XL: ${xl.toFixed(1)} Ω
Required XC: ${xc.toFixed(1)} Ω
${frequency > 0 ? `\nAt ${frequency} MHz:
Inductance: ${inductanceUH.toFixed(1)} µH
Capacitance: ${capacitancePF.toFixed(1)} pF` : ''}`;
        }
    },

    'filter-frequency': {
        title: 'Filter Frequency Calculator',
        icon: 'fas fa-filter',
        inputs: [
            { id: 'resistance', label: 'Resistance (kΩ)', type: 'number', placeholder: 'Enter resistance' },
            { id: 'capacitance', label: 'Capacitance (µF)', type: 'number', placeholder: 'Enter capacitance' },
            { id: 'inductance', label: 'Inductance (mH)', type: 'number', placeholder: 'Enter inductance (for LC filters)' },
            { id: 'filterType', label: 'Filter Type', type: 'select', options: ['RC Low-pass', 'RC High-pass', 'LC Low-pass', 'LC High-pass', 'RLC Band-pass'] }
        ],
        calculate: function(inputs) {
            const resistance = parseFloat(inputs.resistance) || 0;
            const capacitance = parseFloat(inputs.capacitance) || 0;
            const inductance = parseFloat(inputs.inductance) || 0;
            const filterType = inputs.filterType || 'RC Low-pass';
            
            const resistanceOhms = resistance * 1000;
            const capacitanceFarads = capacitance / 1000000;
            const inductanceHenries = inductance / 1000;
            
            let cutoffFreq = 0;
            let result = '';
            
            switch(filterType) {
                case 'RC Low-pass':
                case 'RC High-pass':
                    cutoffFreq = 1 / (2 * Math.PI * resistanceOhms * capacitanceFarads);
                    result = `${filterType} Filter:
Cutoff Frequency: ${cutoffFreq.toFixed(2)} Hz
Cutoff Frequency: ${(cutoffFreq/1000).toFixed(3)} kHz
Time Constant: ${(resistanceOhms * capacitanceFarads * 1000).toFixed(3)} ms
Roll-off Rate: 20 dB/decade`;
                    break;
                case 'LC Low-pass':
                case 'LC High-pass':
                    cutoffFreq = 1 / (2 * Math.PI * Math.sqrt(inductanceHenries * capacitanceFarads));
                    const characteristicImpedance = Math.sqrt(inductanceHenries / capacitanceFarads);
                    result = `${filterType} Filter:
Cutoff Frequency: ${cutoffFreq.toFixed(2)} Hz
Cutoff Frequency: ${(cutoffFreq/1000).toFixed(3)} kHz
Characteristic Impedance: ${characteristicImpedance.toFixed(1)} Ω
Roll-off Rate: 40 dB/decade`;
                    break;
                case 'RLC Band-pass':
                    const centerFreq = 1 / (2 * Math.PI * Math.sqrt(inductanceHenries * capacitanceFarads));
                    const qualityFactor = (1/resistanceOhms) * Math.sqrt(inductanceHenries/capacitanceFarads);
                    const bandwidth = centerFreq / qualityFactor;
                    result = `RLC Band-pass Filter:
Center Frequency: ${centerFreq.toFixed(2)} Hz
Center Frequency: ${(centerFreq/1000).toFixed(3)} kHz
Quality Factor (Q): ${qualityFactor.toFixed(2)}
Bandwidth: ${bandwidth.toFixed(2)} Hz`;
                    break;
            }
            
            return result;
        }
    },

    'amplifier-gain': {
        title: 'Amplifier Gain Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'inputVoltage', label: 'Input Voltage (V)', type: 'number', placeholder: 'Enter input voltage' },
            { id: 'outputVoltage', label: 'Output Voltage (V)', type: 'number', placeholder: 'Enter output voltage' },
            { id: 'inputPower', label: 'Input Power (W)', type: 'number', placeholder: 'Enter input power (optional)' },
            { id: 'outputPower', label: 'Output Power (W)', type: 'number', placeholder: 'Enter output power (optional)' }
        ],
        calculate: function(inputs) {
            const vIn = parseFloat(inputs.inputVoltage) || 0;
            const vOut = parseFloat(inputs.outputVoltage) || 0;
            const pIn = parseFloat(inputs.inputPower) || 0;
            const pOut = parseFloat(inputs.outputPower) || 0;
            
            let result = 'Amplifier Gain Analysis:\n';
            
            if (vIn > 0 && vOut > 0) {
                const voltageGain = vOut / vIn;
                const voltageGainDB = 20 * Math.log10(voltageGain);
                result += `Voltage Gain: ${voltageGain.toFixed(3)}
Voltage Gain: ${voltageGainDB.toFixed(1)} dB\n`;
            }
            
            if (pIn > 0 && pOut > 0) {
                const powerGain = pOut / pIn;
                const powerGainDB = 10 * Math.log10(powerGain);
                const efficiency = (pOut / pIn) * 100;
                result += `Power Gain: ${powerGain.toFixed(3)}
Power Gain: ${powerGainDB.toFixed(1)} dB
Efficiency: ${efficiency.toFixed(1)}%\n`;
            }
            
            if (vIn > 0 && vOut > 0 && pIn > 0 && pOut > 0) {
                const inputImpedance = (vIn * vIn) / pIn;
                const outputImpedance = (vOut * vOut) / pOut;
                result += `Input Impedance: ${inputImpedance.toFixed(1)} Ω
Output Impedance: ${outputImpedance.toFixed(1)} Ω`;
            }
            
            return result || 'Please enter voltage or power values to calculate gain.';
        }
    },

    'beam-deflection': {
        title: 'Beam Deflection Calculator',
        icon: 'fas fa-ruler-horizontal',
        inputs: [
            { id: 'load', label: 'Load (N or lb)', type: 'number', placeholder: 'Enter load' },
            { id: 'length', label: 'Beam Length (m or ft)', type: 'number', placeholder: 'Enter beam length' },
            { id: 'momentOfInertia', label: 'Moment of Inertia (m⁴ or in⁴)', type: 'number', placeholder: 'Enter moment of inertia' },
            { id: 'elasticModulus', label: 'Elastic Modulus (Pa or psi)', type: 'number', placeholder: 'Enter elastic modulus' },
            { id: 'beamType', label: 'Beam Type', type: 'select', options: ['Simply Supported - Center Load', 'Simply Supported - Uniform Load', 'Cantilever - End Load', 'Cantilever - Uniform Load'] }
        ],
        calculate: function(inputs) {
            const load = parseFloat(inputs.load) || 0;
            const length = parseFloat(inputs.length) || 0;
            const momentOfInertia = parseFloat(inputs.momentOfInertia) || 0;
            const elasticModulus = parseFloat(inputs.elasticModulus) || 0;
            const beamType = inputs.beamType || 'Simply Supported - Center Load';
            
            let deflection = 0;
            let formula = '';
            
            switch(beamType) {
                case 'Simply Supported - Center Load':
                    deflection = (load * Math.pow(length, 3)) / (48 * elasticModulus * momentOfInertia);
                    formula = 'δ = PL³/(48EI)';
                    break;
                case 'Simply Supported - Uniform Load':
                    deflection = (5 * load * Math.pow(length, 4)) / (384 * elasticModulus * momentOfInertia);
                    formula = 'δ = 5wL⁴/(384EI)';
                    break;
                case 'Cantilever - End Load':
                    deflection = (load * Math.pow(length, 3)) / (3 * elasticModulus * momentOfInertia);
                    formula = 'δ = PL³/(3EI)';
                    break;
                case 'Cantilever - Uniform Load':
                    deflection = (load * Math.pow(length, 4)) / (8 * elasticModulus * momentOfInertia);
                    formula = 'δ = wL⁴/(8EI)';
                    break;
            }
            
            const maxStress = (load * length) / (4 * momentOfInertia); // Simplified for rectangular beam
            const deflectionMM = deflection * 1000; // Convert to mm if meters
            
            return `${beamType} Analysis:
Maximum Deflection: ${deflection.toFixed(6)} units
Maximum Deflection: ${deflectionMM.toFixed(3)} mm (if input in m)
Maximum Stress: ${maxStress.toFixed(2)} Pa (if input in SI units)
Formula Used: ${formula}

Input Parameters:
Load: ${load} N/lb
Length: ${length} m/ft
Moment of Inertia: ${momentOfInertia} m⁴/in⁴
Elastic Modulus: ${elasticModulus} Pa/psi`;
        }
    },

    'gear-ratio': {
        title: 'Gear Ratio Calculator',
        icon: 'fas fa-cog',
        inputs: [
            { id: 'inputTeeth', label: 'Input Gear Teeth', type: 'number', placeholder: 'Enter input gear teeth' },
            { id: 'outputTeeth', label: 'Output Gear Teeth', type: 'number', placeholder: 'Enter output gear teeth' },
            { id: 'inputRPM', label: 'Input RPM', type: 'number', placeholder: 'Enter input RPM (optional)' },
            { id: 'inputTorque', label: 'Input Torque (Nm)', type: 'number', placeholder: 'Enter input torque (optional)' }
        ],
        calculate: function(inputs) {
            const inputTeeth = parseFloat(inputs.inputTeeth) || 0;
            const outputTeeth = parseFloat(inputs.outputTeeth) || 0;
            const inputRPM = parseFloat(inputs.inputRPM) || 0;
            const inputTorque = parseFloat(inputs.inputTorque) || 0;
            
            const gearRatio = outputTeeth / inputTeeth;
            const speedReduction = inputTeeth / outputTeeth;
            const mechanicalAdvantage = outputTeeth / inputTeeth;
            
            let result = `Gear Ratio: ${gearRatio.toFixed(3)}:1
Speed Reduction: ${speedReduction.toFixed(3)}:1
Mechanical Advantage: ${mechanicalAdvantage.toFixed(3)}
Input Teeth: ${inputTeeth}
Output Teeth: ${outputTeeth}`;
            
            if (inputRPM > 0) {
                const outputRPM = inputRPM * speedReduction;
                result += `\n\nSpeed Analysis:
Input RPM: ${inputRPM}
Output RPM: ${outputRPM.toFixed(1)}`;
            }
            
            if (inputTorque > 0) {
                const outputTorque = inputTorque * mechanicalAdvantage;
                const efficiency = 0.95; // Typical gear efficiency
                const actualOutputTorque = outputTorque * efficiency;
                result += `\n\nTorque Analysis:
Input Torque: ${inputTorque} Nm
Theoretical Output Torque: ${outputTorque.toFixed(2)} Nm
Actual Output Torque: ${actualOutputTorque.toFixed(2)} Nm (95% efficiency)`;
            }
            
            return result;
        }
    },

    'pulley-system': {
        title: 'Pulley System Calculator',
        icon: 'fas fa-circle-o',
        inputs: [
            { id: 'load', label: 'Load Weight (kg)', type: 'number', placeholder: 'Enter load weight' },
            { id: 'pulleyType', label: 'Pulley System', type: 'select', options: ['Fixed Pulley', 'Movable Pulley', 'Block and Tackle (2:1)', 'Block and Tackle (3:1)', 'Block and Tackle (4:1)'] },
            { id: 'efficiency', label: 'System Efficiency (%)', type: 'number', placeholder: 'Enter efficiency', value: '85' }
        ],
        calculate: function(inputs) {
            const load = parseFloat(inputs.load) || 0;
            const pulleyType = inputs.pulleyType || 'Fixed Pulley';
            const efficiency = parseFloat(inputs.efficiency) || 85;
            
            let mechanicalAdvantage = 1;
            let description = '';
            
            switch(pulleyType) {
                case 'Fixed Pulley':
                    mechanicalAdvantage = 1;
                    description = 'Changes direction of force only';
                    break;
                case 'Movable Pulley':
                    mechanicalAdvantage = 2;
                    description = 'Reduces force by half';
                    break;
                case 'Block and Tackle (2:1)':
                    mechanicalAdvantage = 2;
                    description = 'Two supporting rope segments';
                    break;
                case 'Block and Tackle (3:1)':
                    mechanicalAdvantage = 3;
                    description = 'Three supporting rope segments';
                    break;
                case 'Block and Tackle (4:1)':
                    mechanicalAdvantage = 4;
                    description = 'Four supporting rope segments';
                    break;
            }
            
            const theoreticalForce = (load * 9.81) / mechanicalAdvantage; // Force in Newtons
            const actualForce = theoreticalForce / (efficiency / 100);
            const ropePull = mechanicalAdvantage; // Distance multiplier
            
            return `${pulleyType} Analysis:
Load Weight: ${load} kg (${(load * 9.81).toFixed(1)} N)
Mechanical Advantage: ${mechanicalAdvantage}:1
Theoretical Pull Force: ${theoreticalForce.toFixed(1)} N (${(theoreticalForce / 9.81).toFixed(1)} kg)
Actual Pull Force: ${actualForce.toFixed(1)} N (${(actualForce / 9.81).toFixed(1)} kg)
System Efficiency: ${efficiency}%
Rope Pull Distance: ${ropePull}x load distance
Description: ${description}`;
        }
    },

    'hydraulic-pressure': {
        title: 'Hydraulic Pressure Calculator',
        icon: 'fas fa-tint',
        inputs: [
            { id: 'force1', label: 'Input Force (N)', type: 'number', placeholder: 'Enter input force' },
            { id: 'area1', label: 'Input Piston Area (cm²)', type: 'number', placeholder: 'Enter input piston area' },
            { id: 'area2', label: 'Output Piston Area (cm²)', type: 'number', placeholder: 'Enter output piston area' },
            { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', type: 'number', placeholder: 'Enter fluid density', value: '850' }
        ],
        calculate: function(inputs) {
            const force1 = parseFloat(inputs.force1) || 0;
            const area1 = parseFloat(inputs.area1) || 0;
            const area2 = parseFloat(inputs.area2) || 0;
            const fluidDensity = parseFloat(inputs.fluidDensity) || 850;
            
            // Convert cm² to m²
            const area1M2 = area1 / 10000;
            const area2M2 = area2 / 10000;
            
            const pressure = force1 / area1M2; // Pascals
            const force2 = pressure * area2M2; // Output force
            const mechanicalAdvantage = area2 / area1;
            const pressureBar = pressure / 100000; // Convert to bar
            const pressurePSI = pressure * 0.000145038; // Convert to PSI
            
            // Distance ratio (inverse of force ratio)
            const distanceRatio = area1 / area2;
            
            return `Hydraulic System Analysis:
Input Force: ${force1} N
Input Piston Area: ${area1} cm² (${area1M2.toFixed(6)} m²)
Output Piston Area: ${area2} cm² (${area2M2.toFixed(6)} m²)

System Pressure: ${pressure.toFixed(0)} Pa
System Pressure: ${pressureBar.toFixed(2)} bar
System Pressure: ${pressurePSI.toFixed(1)} PSI

Output Force: ${force2.toFixed(1)} N
Mechanical Advantage: ${mechanicalAdvantage.toFixed(2)}:1
Distance Ratio: ${distanceRatio.toFixed(2)}:1

Fluid Density: ${fluidDensity} kg/m³`;
        }
    },

    'spring-constant': {
        title: 'Spring Constant Calculator',
        icon: 'fas fa-expand-arrows-alt',
        inputs: [
            { id: 'force', label: 'Applied Force (N)', type: 'number', placeholder: 'Enter applied force' },
            { id: 'displacement', label: 'Displacement (mm)', type: 'number', placeholder: 'Enter displacement' },
            { id: 'springLength', label: 'Free Length (mm)', type: 'number', placeholder: 'Enter free length (optional)' },
            { id: 'springType', label: 'Spring Type', type: 'select', options: ['Compression', 'Extension', 'Torsion'] }
        ],
        calculate: function(inputs) {
            const force = parseFloat(inputs.force) || 0;
            const displacement = parseFloat(inputs.displacement) || 0;
            const springLength = parseFloat(inputs.springLength) || 0;
            const springType = inputs.springType || 'Compression';
            
            const displacementM = displacement / 1000; // Convert mm to m
            const springConstant = force / displacementM; // N/m
            const springConstantNmm = force / displacement; // N/mm
            
            // Potential energy stored
            const potentialEnergy = 0.5 * springConstant * displacementM * displacementM; // Joules
            
            // Spring rate calculations
            const springRate = springConstant; // Same as spring constant
            
            let result = `${springType} Spring Analysis:
Spring Constant: ${springConstant.toFixed(1)} N/m
Spring Constant: ${springConstantNmm.toFixed(3)} N/mm
Applied Force: ${force} N
Displacement: ${displacement} mm (${displacementM.toFixed(6)} m)
Potential Energy: ${potentialEnergy.toFixed(4)} J
Spring Rate: ${springRate.toFixed(1)} N/m`;
            
            if (springLength > 0) {
                const compressedLength = springLength - displacement;
                const compressionRatio = (displacement / springLength) * 100;
                result += `\n\nGeometry:
Free Length: ${springLength} mm
Compressed/Extended Length: ${compressedLength.toFixed(1)} mm
Compression/Extension Ratio: ${compressionRatio.toFixed(1)}%`;
            }
            
            // Hooke's Law verification
            result += `\n\nHooke's Law: F = kx
Where F = ${force} N, k = ${springConstantNmm.toFixed(3)} N/mm, x = ${displacement} mm`;
            
            return result;
        }
    },

    'thermal-expansion': {
        title: 'Thermal Expansion Calculator',
        icon: 'fas fa-thermometer-half',
        inputs: [
            { id: 'originalLength', label: 'Original Length (mm)', type: 'number', placeholder: 'Enter original length' },
            { id: 'tempChange', label: 'Temperature Change (°C)', type: 'number', placeholder: 'Enter temperature change' },
            { id: 'material', label: 'Material', type: 'select', options: ['Steel', 'Aluminum', 'Copper', 'Brass', 'Concrete', 'Glass', 'Titanium', 'Stainless Steel', 'Custom'] },
            { id: 'customCoeff', label: 'Custom Coefficient (×10⁻⁶/°C)', type: 'number', placeholder: 'Enter coefficient if custom' }
        ],
        calculate: function(inputs) {
            const originalLength = parseFloat(inputs.originalLength) || 0;
            const tempChange = parseFloat(inputs.tempChange) || 0;
            const material = inputs.material || 'Steel';
            const customCoeff = parseFloat(inputs.customCoeff) || 0;
            
            // Linear expansion coefficients (×10⁻⁶ per °C)
            const coefficients = {
                'Steel': 12,
                'Aluminum': 24,
                'Copper': 17,
                'Brass': 19,
                'Concrete': 12,
                'Glass': 9,
                'Titanium': 8.6,
                'Stainless Steel': 17.3,
                'Custom': customCoeff
            };
            
            const coefficient = coefficients[material] || 12;
            const expansion = originalLength * coefficient * 0.000001 * tempChange;
            const finalLength = originalLength + expansion;
            const strainPercent = (expansion / originalLength) * 100;
            
            // Volume expansion (approximate for 3D)
            const volumeExpansion = 3 * coefficient * 0.000001 * tempChange;
            const volumeChangePercent = volumeExpansion * 100;
            
            return `Thermal Expansion Analysis:
Material: ${material}
Expansion Coefficient: ${coefficient} ×10⁻⁶/°C
Original Length: ${originalLength} mm
Temperature Change: ${tempChange}°C

Linear Expansion:
Length Change: ${expansion.toFixed(4)} mm
Final Length: ${finalLength.toFixed(4)} mm
Strain: ${strainPercent.toFixed(6)}%

Volume Expansion:
Volume Change: ${volumeChangePercent.toFixed(6)}%
Volume Coefficient: ${(3 * coefficient).toFixed(1)} ×10⁻⁶/°C

Formula: ΔL = L₀ × α × ΔT
Where α = ${coefficient} ×10⁻⁶/°C`;
        }
    },

    'motor-efficiency': {
        title: 'Motor Efficiency Calculator',
        icon: 'fas fa-fan',
        inputs: [
            { id: 'inputPower', label: 'Input Power (W)', type: 'number', placeholder: 'Enter input power' },
            { id: 'outputPower', label: 'Output Power (W)', type: 'number', placeholder: 'Enter output power' },
            { id: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'Enter voltage (optional)' },
            { id: 'current', label: 'Current (A)', type: 'number', placeholder: 'Enter current (optional)' },
            { id: 'powerFactor', label: 'Power Factor', type: 'number', placeholder: 'Enter power factor (optional)', value: '0.9' }
        ],
        calculate: function(inputs) {
            const inputPower = parseFloat(inputs.inputPower) || 0;
            const outputPower = parseFloat(inputs.outputPower) || 0;
            const voltage = parseFloat(inputs.voltage) || 0;
            const current = parseFloat(inputs.current) || 0;
            const powerFactor = parseFloat(inputs.powerFactor) || 0.9;
            
            let efficiency = 0;
            let powerLoss = 0;
            let result = 'Motor Efficiency Analysis:\n';
            
            if (inputPower > 0 && outputPower > 0) {
                efficiency = (outputPower / inputPower) * 100;
                powerLoss = inputPower - outputPower;
                
                result += `Input Power: ${inputPower} W
Output Power: ${outputPower} W
Efficiency: ${efficiency.toFixed(2)}%
Power Loss: ${powerLoss.toFixed(1)} W
Heat Dissipated: ${powerLoss.toFixed(1)} W`;
            }
            
            if (voltage > 0 && current > 0) {
                const apparentPower = voltage * current;
                const calculatedInputPower = apparentPower * powerFactor;
                result += `\n\nElectrical Analysis:
Voltage: ${voltage} V
Current: ${current} A
Power Factor: ${powerFactor}
Apparent Power: ${apparentPower.toFixed(1)} VA
Real Power: ${calculatedInputPower.toFixed(1)} W`;
                
                if (outputPower > 0) {
                    const calculatedEfficiency = (outputPower / calculatedInputPower) * 100;
                    result += `\nCalculated Efficiency: ${calculatedEfficiency.toFixed(2)}%`;
                }
            }
            
            // Energy cost calculation (optional)
            if (inputPower > 0) {
                const dailyConsumption = (inputPower * 8) / 1000; // 8 hours operation in kWh
                const monthlyConsumption = dailyConsumption * 30;
                result += `\n\nEnergy Consumption:
Daily (8 hrs): ${dailyConsumption.toFixed(2)} kWh
Monthly: ${monthlyConsumption.toFixed(1)} kWh`;
            }
            
            return result;
        }
    },

    'pipe-flow': {
        title: 'Pipe Flow Calculator',
        icon: 'fas fa-arrows-alt-h',
        inputs: [
            { id: 'diameter', label: 'Pipe Diameter (mm)', type: 'number', placeholder: 'Enter pipe diameter' },
            { id: 'flowRate', label: 'Flow Rate (L/min)', type: 'number', placeholder: 'Enter flow rate' },
            { id: 'fluidViscosity', label: 'Fluid Viscosity (cP)', type: 'number', placeholder: 'Enter viscosity', value: '1' },
            { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', type: 'number', placeholder: 'Enter density', value: '1000' },
            { id: 'pipeLength', label: 'Pipe Length (m)', type: 'number', placeholder: 'Enter pipe length (optional)' }
        ],
        calculate: function(inputs) {
            const diameter = parseFloat(inputs.diameter) || 0;
            const flowRate = parseFloat(inputs.flowRate) || 0;
            const viscosity = parseFloat(inputs.fluidViscosity) || 1;
            const density = parseFloat(inputs.fluidDensity) || 1000;
            const pipeLength = parseFloat(inputs.pipeLength) || 0;
            
            // Convert units
            const diameterM = diameter / 1000; // mm to m
            const flowRateM3s = flowRate / 60000; // L/min to m³/s
            const viscosityPas = viscosity / 1000; // cP to Pa·s
            
            // Calculate pipe area and velocity
            const area = Math.PI * Math.pow(diameterM / 2, 2); // m²
            const velocity = flowRateM3s / area; // m/s
            
            // Reynolds number
            const reynoldsNumber = (density * velocity * diameterM) / viscosityPas;
            
            // Flow regime
            let flowRegime = '';
            if (reynoldsNumber < 2300) flowRegime = 'Laminar';
            else if (reynoldsNumber < 4000) flowRegime = 'Transitional';
            else flowRegime = 'Turbulent';
            
            // Pressure drop calculation (Darcy-Weisbach equation)
            let frictionFactor = 0;
            if (reynoldsNumber < 2300) {
                frictionFactor = 64 / reynoldsNumber; // Laminar flow
            } else {
                frictionFactor = 0.316 / Math.pow(reynoldsNumber, 0.25); // Turbulent flow (Blasius)
            }
            
            let result = `Pipe Flow Analysis:
Pipe Diameter: ${diameter} mm (${diameterM.toFixed(4)} m)
Flow Rate: ${flowRate} L/min (${flowRateM3s.toFixed(6)} m³/s)
Pipe Area: ${(area * 10000).toFixed(2)} cm² (${area.toFixed(6)} m²)
Flow Velocity: ${velocity.toFixed(3)} m/s

Fluid Properties:
Density: ${density} kg/m³
Viscosity: ${viscosity} cP (${viscosityPas.toFixed(6)} Pa·s)

Flow Characteristics:
Reynolds Number: ${reynoldsNumber.toFixed(0)}
Flow Regime: ${flowRegime}
Friction Factor: ${frictionFactor.toFixed(6)}`;
            
            if (pipeLength > 0) {
                const pressureDrop = frictionFactor * (pipeLength / diameterM) * (density * velocity * velocity) / 2;
                const pressureDropBar = pressureDrop / 100000;
                const pressureDropPSI = pressureDrop * 0.000145038;
                
                result += `\n\nPressure Drop (${pipeLength} m length):
Pressure Drop: ${pressureDrop.toFixed(0)} Pa
Pressure Drop: ${pressureDropBar.toFixed(4)} bar
Pressure Drop: ${pressureDropPSI.toFixed(3)} PSI`;
            }
            
            return result;
        }
    },

    // Engineering Calculators
    'ohms-law': {
        title: 'Ohm\'s Law Calculator',
        icon: 'fas fa-bolt',
        inputs: [
            { id: 'voltage', label: 'Voltage (V)', type: 'number', placeholder: 'Enter voltage' },
            { id: 'current', label: 'Current (A)', type: 'number', placeholder: 'Enter current' },
            { id: 'resistance', label: 'Resistance (Ω)', type: 'number', placeholder: 'Enter resistance' }
        ],
        calculate: function(inputs) {
            const v = parseFloat(inputs.voltage);
            const i = parseFloat(inputs.current);
            const r = parseFloat(inputs.resistance);
            let result = '';
            
            if (!isNaN(v) && !isNaN(i)) {
                result += `Resistance: ${(v/i).toFixed(2)} Ω\n`;
            }
            if (!isNaN(v) && !isNaN(r)) {
                result += `Current: ${(v/r).toFixed(2)} A\n`;
            }
            if (!isNaN(i) && !isNaN(r)) {
                result += `Voltage: ${(i*r).toFixed(2)} V\n`;
            }
            
            result += `Power: ${(v*i).toFixed(2)} W`;
            return result;
        }
    },
    // Physics Calculators
    'velocity': {
        title: 'Velocity Calculator',
        icon: 'fas fa-tachometer-alt',
        inputs: [
            { id: 'distance', label: 'Distance (meters)', type: 'number', placeholder: 'Enter distance' },
            { id: 'time', label: 'Time (seconds)', type: 'number', placeholder: 'Enter time' }
        ],
        calculate: function(inputs) {
            const distance = parseFloat(inputs.distance) || 0;
            const time = parseFloat(inputs.time) || 1;
            const velocity = distance / time;
            return `Velocity: ${velocity.toFixed(2)} m/s\nVelocity: ${(velocity * 3.6).toFixed(2)} km/h\nVelocity: ${(velocity * 2.237).toFixed(2)} mph`;
        }
    },
    'energy': {
        title: 'Energy Calculator',
        icon: 'fas fa-atom',
        inputs: [
            { id: 'mass', label: 'Mass (kg)', type: 'number', placeholder: 'Enter mass' },
            { id: 'height', label: 'Height (m)', type: 'number', placeholder: 'Enter height' },
            { id: 'velocity', label: 'Velocity (m/s)', type: 'number', placeholder: 'Enter velocity' }
        ],
        calculate: function(inputs) {
            const mass = parseFloat(inputs.mass) || 0;
            const height = parseFloat(inputs.height) || 0;
            const velocity = parseFloat(inputs.velocity) || 0;
            const g = 9.81; // gravitational acceleration
            
            const potentialEnergy = mass * g * height;
            const kineticEnergy = 0.5 * mass * velocity * velocity;
            const totalEnergy = potentialEnergy + kineticEnergy;
            
            return `Potential Energy: ${potentialEnergy.toFixed(2)} Joules\nKinetic Energy: ${kineticEnergy.toFixed(2)} Joules\nTotal Energy: ${totalEnergy.toFixed(2)} Joules`;
        }
    },
    'force': {
        title: 'Force Calculator',
        icon: 'fas fa-compress-arrows-alt',
        inputs: [
            { id: 'mass', label: 'Mass (kg)', type: 'number', placeholder: 'Enter mass' },
            { id: 'acceleration', label: 'Acceleration (m/s²)', type: 'number', placeholder: 'Enter acceleration' }
        ],
        calculate: function(inputs) {
            const mass = parseFloat(inputs.mass) || 0;
            const acceleration = parseFloat(inputs.acceleration) || 0;
            const force = mass * acceleration;
            return `Force: ${force.toFixed(2)} Newtons\nWeight: ${(mass * 9.81).toFixed(2)} Newtons\nMass: ${mass.toFixed(2)} kg`;
        }
    },
    // Chemistry Calculators
    'molarity': {
        title: 'Molarity Calculator',
        icon: 'fas fa-flask',
        inputs: [
            { id: 'moles', label: 'Number of Moles', type: 'number', placeholder: 'Enter moles' },
            { id: 'volume', label: 'Volume (L)', type: 'number', placeholder: 'Enter volume' }
        ],
        calculate: function(inputs) {
            const moles = parseFloat(inputs.moles) || 0;
            const volume = parseFloat(inputs.volume) || 1;
            const molarity = moles / volume;
            return `Molarity: ${molarity.toFixed(4)} M\nMoles: ${moles.toFixed(4)} mol\nVolume: ${volume.toFixed(2)} L`;
        }
    },
    'ph': {
        title: 'pH Calculator',
        icon: 'fas fa-vial',
        inputs: [
            { id: 'concentration', label: 'H+ Concentration (mol/L)', type: 'number', placeholder: 'Enter concentration', step: '1e-14' }
        ],
        calculate: function(inputs) {
            const concentration = parseFloat(inputs.concentration) || 1e-7;
            const pH = -Math.log10(concentration);
            const pOH = 14 - pH;
            return `pH: ${pH.toFixed(2)}\npOH: ${pOH.toFixed(2)}\nH+ Concentration: ${concentration.toExponential(2)} mol/L`;
        }
    },
    'molecular-weight': {
        title: 'Molecular Weight Calculator',
        icon: 'fas fa-atom',
        inputs: [
            { id: 'formula', label: 'Chemical Formula', type: 'text', placeholder: 'e.g., H2O, NaCl' }
        ],
        calculate: function(inputs) {
            const weights = {
                'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811, 'C': 12.011,
                'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305,
                'Al': 26.982, 'Si': 28.086, 'P': 30.974, 'S': 32.065, 'Cl': 35.453, 'K': 39.098,
                'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.380, 'Ag': 107.868, 'Au': 196.967
            };
            
            const formula = inputs.formula.replace(/\s/g, '');
            let totalWeight = 0;
            let currentElement = '';
            let currentNumber = '';
            
            for(let i = 0; i < formula.length; i++) {
                if(/[A-Z]/.test(formula[i])) {
                    if(currentElement) {
                        const num = currentNumber || '1';
                        totalWeight += weights[currentElement] * parseInt(num);
                        currentNumber = '';
                    }
                    currentElement = formula[i];
                }
                else if(/[a-z]/.test(formula[i])) {
                    currentElement += formula[i];
                }
                else if(/[0-9]/.test(formula[i])) {
                    currentNumber += formula[i];
                }
            }
            
            if(currentElement) {
                const num = currentNumber || '1';
                totalWeight += weights[currentElement] * parseInt(num);
            }
            
            return `Molecular Weight: ${totalWeight.toFixed(3)} g/mol\nFormula: ${formula}\nElements: ${Object.keys(weights).join(', ')}`;
        }
    },
    // Cryptocurrency Calculators
    'crypto-profit': {
        title: 'Cryptocurrency Profit Calculator',
        icon: 'fas fa-coins',
        inputs: [
            { id: 'buyPrice', label: 'Buy Price ($)', type: 'number', placeholder: 'Enter buy price', step: '0.000001' },
            { id: 'sellPrice', label: 'Sell Price ($)', type: 'number', placeholder: 'Enter sell price', step: '0.000001' },
            { id: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter amount of coins', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const buyPrice = parseFloat(inputs.buyPrice) || 0;
            const sellPrice = parseFloat(inputs.sellPrice) || 0;
            const amount = parseFloat(inputs.amount) || 0;
            
            const investment = buyPrice * amount;
            const revenue = sellPrice * amount;
            const profit = revenue - investment;
            const roi = ((profit / investment) * 100) || 0;
            
            return `Investment: $${investment.toFixed(2)}
Revenue: $${revenue.toFixed(2)}
Profit/Loss: $${profit.toFixed(2)}
ROI: ${roi.toFixed(2)}%`;
        }
    },

    'crypto-dca': {
        title: 'Dollar Cost Average Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'investment', label: 'Regular Investment ($)', type: 'number', placeholder: 'Enter investment amount' },
            { id: 'frequency', label: 'Investment Frequency (days)', type: 'number', placeholder: 'Enter frequency in days' },
            { id: 'duration', label: 'Investment Duration (months)', type: 'number', placeholder: 'Enter duration' },
            { id: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', placeholder: 'Enter expected return', step: '0.1' }
        ],
        calculate: function(inputs) {
            const investment = parseFloat(inputs.investment) || 0;
            const frequency = parseFloat(inputs.frequency) || 30;
            const duration = parseFloat(inputs.duration) || 0;
            const expectedReturn = parseFloat(inputs.expectedReturn) || 0;
            
            const numberOfInvestments = (duration * 30) / frequency;
            const monthlyReturn = (Math.pow(1 + expectedReturn/100, 1/12) - 1);
            
            let totalInvestment = 0;
            let finalAmount = 0;
            
            for(let i = 0; i < numberOfInvestments; i++) {
                totalInvestment += investment;
                finalAmount = (finalAmount + investment) * (1 + monthlyReturn);
            }
            
            const profit = finalAmount - totalInvestment;
            
            return `Total Invested: $${totalInvestment.toFixed(2)}
Expected Final Amount: $${finalAmount.toFixed(2)}
Expected Profit: $${profit.toFixed(2)}
Expected Return: ${((profit/totalInvestment)*100).toFixed(2)}%`;
        }
    },

    'crypto-mining': {
        title: 'Mining Profitability Calculator',
        icon: 'fas fa-microchip',
        inputs: [
            { id: 'hashrate', label: 'Hashrate (H/s)', type: 'number', placeholder: 'Enter hashrate' },
            { id: 'power', label: 'Power Consumption (W)', type: 'number', placeholder: 'Enter power consumption' },
            { id: 'powerCost', label: 'Electricity Cost ($/kWh)', type: 'number', placeholder: 'Enter electricity cost', step: '0.01' },
            { id: 'poolFee', label: 'Pool Fee (%)', type: 'number', placeholder: 'Enter pool fee', step: '0.1' }
        ],
        calculate: function(inputs) {
            const hashrate = parseFloat(inputs.hashrate) || 0;
            const power = parseFloat(inputs.power) || 0;
            const powerCost = parseFloat(inputs.powerCost) || 0;
            const poolFee = parseFloat(inputs.poolFee) || 0;
            
            const dailyPowerCost = (power * 24 * powerCost) / 1000;
            const monthlyPowerCost = dailyPowerCost * 30;
            
            return `Daily Power Cost: $${dailyPowerCost.toFixed(2)}
Monthly Power Cost: $${monthlyPowerCost.toFixed(2)}
Annual Power Cost: $${(monthlyPowerCost * 12).toFixed(2)}
Pool Fee Cost (1 ETH): $${(2000 * poolFee / 100).toFixed(2)}`;
        }
    },

    'crypto-converter': {
        title: 'Cryptocurrency Converter',
        icon: 'fas fa-exchange-alt',
        inputs: [
            { id: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter amount', step: '0.000001' },
            { id: 'fromPrice', label: 'From Price ($)', type: 'number', placeholder: 'Enter from price', step: '0.000001' },
            { id: 'toPrice', label: 'To Price ($)', type: 'number', placeholder: 'Enter to price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const amount = parseFloat(inputs.amount) || 0;
            const fromPrice = parseFloat(inputs.fromPrice) || 0;
            const toPrice = parseFloat(inputs.toPrice) || 0;
            
            const valueInUSD = amount * fromPrice;
            const convertedAmount = valueInUSD / toPrice;
            
            return `Value in USD: $${valueInUSD.toFixed(2)}
Converted Amount: ${convertedAmount.toFixed(6)}
Rate: 1 = ${(toPrice/fromPrice).toFixed(6)}`;
        }
    },

    'impermanent-loss': {
        title: 'Impermanent Loss Calculator',
        icon: 'fas fa-percentage',
        inputs: [
            { id: 'token1Change', label: 'Token 1 Price Change (%)', type: 'number', placeholder: 'Enter price change', step: '0.1' },
            { id: 'token2Change', label: 'Token 2 Price Change (%)', type: 'number', placeholder: 'Enter price change', step: '0.1' },
            { id: 'poolShare', label: 'Pool Share (%)', type: 'number', placeholder: 'Enter your pool share', step: '0.01' }
        ],
        calculate: function(inputs) {
            const token1Change = parseFloat(inputs.token1Change) || 0;
            const token2Change = parseFloat(inputs.token2Change) || 0;
            const poolShare = parseFloat(inputs.poolShare) || 0;
            
            const r1 = 1 + (token1Change / 100);
            const r2 = 1 + (token2Change / 100);
            const sqrt = Math.sqrt(r1 * r2);
            const IL = ((2 * sqrt) / (r1 + r2)) - 1;
            
            return `Impermanent Loss: ${(IL * 100).toFixed(2)}%
Pool Value Change: ${((sqrt - 1) * 100).toFixed(2)}%
Your Pool Share Value: ${((sqrt - 1) * poolShare).toFixed(2)}%`;
        }
    },

    'staking-rewards': {
        title: 'Staking Rewards Calculator',
        icon: 'fas fa-hand-holding-usd',
        inputs: [
            { id: 'amount', label: 'Staking Amount', type: 'number', placeholder: 'Enter amount to stake' },
            { id: 'apy', label: 'Annual Percentage Yield (%)', type: 'number', placeholder: 'Enter APY', step: '0.01' },
            { id: 'period', label: 'Staking Period (days)', type: 'number', placeholder: 'Enter staking period' }
        ],
        calculate: function(inputs) {
            const amount = parseFloat(inputs.amount) || 0;
            const apy = parseFloat(inputs.apy) || 0;
            const period = parseFloat(inputs.period) || 0;
            
            const dailyRate = apy / 365;
            const rewards = amount * (dailyRate / 100) * period;
            const apy30 = amount * (dailyRate / 100) * 30;
            const apy365 = amount * (apy / 100);
            
            return `Daily Rewards: ${(amount * (dailyRate / 100)).toFixed(6)}
Expected Rewards (${period} days): ${rewards.toFixed(6)}
Monthly Estimate: ${apy30.toFixed(6)}
Yearly Estimate: ${apy365.toFixed(6)}`;
        }
    },

    'crypto-arbitrage': {
        title: 'Crypto Arbitrage Calculator',
        icon: 'fas fa-balance-scale',
        inputs: [
            { id: 'amount', label: 'Trading Amount ($)', type: 'number', placeholder: 'Enter trading amount' },
            { id: 'buyPrice', label: 'Buy Price on Exchange 1 ($)', type: 'number', placeholder: 'Enter buy price', step: '0.000001' },
            { id: 'sellPrice', label: 'Sell Price on Exchange 2 ($)', type: 'number', placeholder: 'Enter sell price', step: '0.000001' },
            { id: 'fees', label: 'Total Fees (%)', type: 'number', placeholder: 'Enter total fees', step: '0.01' }
        ],
        calculate: function(inputs) {
            const amount = parseFloat(inputs.amount) || 0;
            const buyPrice = parseFloat(inputs.buyPrice) || 0;
            const sellPrice = parseFloat(inputs.sellPrice) || 0;
            const fees = parseFloat(inputs.fees) || 0;
            
            const coinAmount = amount / buyPrice;
            const grossProfit = (sellPrice * coinAmount) - amount;
            const feesAmount = (amount * fees / 100) * 2; // Fees for both transactions
            const netProfit = grossProfit - feesAmount;
            const roi = (netProfit / amount) * 100;
            
            return `Coins Purchased: ${coinAmount.toFixed(8)}
Gross Profit: $${grossProfit.toFixed(2)}
Total Fees: $${feesAmount.toFixed(2)}
Net Profit: $${netProfit.toFixed(2)}
ROI: ${roi.toFixed(2)}%`;
        }
    },

    'margin-trading': {
        title: 'Margin Trading Calculator',
        icon: 'fas fa-chart-bar',
        inputs: [
            { id: 'collateral', label: 'Collateral Amount ($)', type: 'number', placeholder: 'Enter collateral amount' },
            { id: 'leverage', label: 'Leverage (x)', type: 'number', placeholder: 'Enter leverage', step: '0.1' },
            { id: 'entryPrice', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'exitPrice', label: 'Exit Price ($)', type: 'number', placeholder: 'Enter exit price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const collateral = parseFloat(inputs.collateral) || 0;
            const leverage = parseFloat(inputs.leverage) || 1;
            const entryPrice = parseFloat(inputs.entryPrice) || 0;
            const exitPrice = parseFloat(inputs.exitPrice) || 0;
            
            const positionSize = collateral * leverage;
            const priceDiff = exitPrice - entryPrice;
            const percentageChange = (priceDiff / entryPrice) * 100;
            const pnl = positionSize * (percentageChange / 100);
            const roi = (pnl / collateral) * 100;
            
            return `Position Size: $${positionSize.toFixed(2)}
Price Change: ${percentageChange.toFixed(2)}%
PnL: $${pnl.toFixed(2)}
ROI: ${roi.toFixed(2)}%
Liquidation Price: $${(entryPrice * (1 - (1/leverage))).toFixed(6)}`;
        }
    },

    'yield-farming': {
        title: 'Yield Farming Calculator',
        icon: 'fas fa-seedling',
        inputs: [
            { id: 'principal', label: 'Principal Amount ($)', type: 'number', placeholder: 'Enter principal amount' },
            { id: 'apy', label: 'APY (%)', type: 'number', placeholder: 'Enter APY', step: '0.01' },
            { id: 'compoundFrequency', label: 'Compounds per Year', type: 'number', placeholder: 'Enter compound frequency' },
            { id: 'timeInYears', label: 'Time Period (years)', type: 'number', placeholder: 'Enter time period', step: '0.1' }
        ],
        calculate: function(inputs) {
            const principal = parseFloat(inputs.principal) || 0;
            const apy = parseFloat(inputs.apy) || 0;
            const compoundFrequency = parseFloat(inputs.compoundFrequency) || 365;
            const timeInYears = parseFloat(inputs.timeInYears) || 1;
            
            const r = apy / 100;
            const n = compoundFrequency;
            const t = timeInYears;
            
            const amount = principal * Math.pow(1 + (r/n), n*t);
            const profit = amount - principal;
            
            return `Final Amount: $${amount.toFixed(2)}
Total Profit: $${profit.toFixed(2)}
Daily Profit: $${((profit / (t * 365))).toFixed(2)}
APY: ${apy}%`;
        }
    },

    'portfolio-tracker': {
        title: 'Crypto Portfolio Tracker',
        icon: 'fas fa-wallet',
        inputs: [
            { id: 'btcAmount', label: 'BTC Amount', type: 'number', placeholder: 'Enter BTC amount', step: '0.00000001' },
            { id: 'btcPrice', label: 'BTC Price ($)', type: 'number', placeholder: 'Enter BTC price' },
            { id: 'ethAmount', label: 'ETH Amount', type: 'number', placeholder: 'Enter ETH amount', step: '0.00000001' },
            { id: 'ethPrice', label: 'ETH Price ($)', type: 'number', placeholder: 'Enter ETH price' }
        ],
        calculate: function(inputs) {
            const btcAmount = parseFloat(inputs.btcAmount) || 0;
            const btcPrice = parseFloat(inputs.btcPrice) || 0;
            const ethAmount = parseFloat(inputs.ethAmount) || 0;
            const ethPrice = parseFloat(inputs.ethPrice) || 0;
            
            const btcValue = btcAmount * btcPrice;
            const ethValue = ethAmount * ethPrice;
            const totalValue = btcValue + ethValue;
            const btcShare = (btcValue / totalValue) * 100 || 0;
            const ethShare = (ethValue / totalValue) * 100 || 0;
            
            return `BTC Value: $${btcValue.toFixed(2)} (${btcShare.toFixed(2)}%)
ETH Value: $${ethValue.toFixed(2)} (${ethShare.toFixed(2)}%)
Total Portfolio Value: $${totalValue.toFixed(2)}`;
        }
    },
    // More calculators will be added based on categories
};

// Define calculator categories
const toolCategories = {
    financial: ['loan', 'mortgage', 'compound-interest', 'investment', 'savings'],
    math: ['percentage', 'fraction', 'algebra', 'quadratic', 'trigonometry'],
    health: [
        'bmi', 'calorie', 'body-fat', 'ideal-weight', 'water-intake',
        'heart-rate-zone', 'vo2-max', 'pregnancy-due-date', 'ovulation', 'bmi-children',
        'macro-calculator', 'protein-intake', 'body-measurement', 'sleep-calculator', 'hydration-status',
        'fitness-level', 'workout-intensity', 'recovery-calculator', 'training-load', 'body-age'
    ],
    crypto: [
        'crypto-profit',
        'crypto-leverage-liquidation',
        'crypto-futures-pnl',
        'crypto-lending-returns',
        'crypto-compound-yield',
        'crypto-rebalancing',
        'crypto-stop-loss',
        'crypto-correlation',
        'crypto-volume-analysis',
        'crypto-position-size',
        'crypto-funding-rate',
        'crypto-drawdown',
        'crypto-swing-trade',
        'crypto-accumulation',
        'crypto-volatility'
    ],
    physics: ['velocity', 'energy', 'force', 'momentum', 'power'],
    chemistry: ['molarity', 'ph', 'molecular-weight', 'gas-laws', 'stoichiometry'],    engineering: [
        'ohms-law', 'power-consumption', 'resistor-color', 'voltage-divider', 'capacitor',
        'transformer-turns', 'inductor-reactance', 'rc-time-constant', 'rlc-resonance', 'parallel-resistance',
        'series-resistance', 'power-factor', 'three-phase-power', 'wire-gauge', 'led-resistor',
        'antenna-length', 'decibel-converter', 'impedance-matching', 'filter-frequency', 'amplifier-gain',
        'beam-deflection', 'gear-ratio', 'pulley-system', 'hydraulic-pressure', 'spring-constant',
        'thermal-expansion', 'motor-efficiency', 'pipe-flow'
    ],
    construction: ['concrete', 'paint', 'brick', 'roof-pitch', 'flooring'],
    conversion: [
        'length', 'temperature', 'weight', 'area', 'volume', 'speed',
        'pressure', 'energy-conversion', 'power-conversion', 'data-storage',
        'angle', 'time-conversion', 'frequency', 'currency', 'fuel-economy-conversion',
        'density', 'force-conversion', 'luminosity', 'magnetic-field', 'radioactivity', 'torque'
    ],
    business: ['roi', 'break-even', 'markup', 'payroll', 'cash-flow'],
    time: ['age', 'date-difference', 'time-zone', 'working-days', 'countdown'],
    utility: ['grade', 'fuel-economy', 'password-strength', 'random-number', 'color-picker']
};
