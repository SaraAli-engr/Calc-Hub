// Calculator definitions
const calculators = {
    // BMR Calculator
    'muscle-mass': {
        title: 'Muscle Mass Calculator',
        icon: 'fas fa-dumbbell',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' },
            { id: 'wrist', label: 'Wrist Circumference (cm)', type: 'number', placeholder: 'Enter wrist measurement' },
            { id: 'activity', label: 'Activity Level', type: 'select', 
              options: ['Sedentary', 'Moderate', 'Active', 'Very Active'] }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            const wrist = parseFloat(inputs.wrist) || 0;
            
            // Calculate frame size based on height and wrist circumference
            const frameIndex = wrist / (height / 100);
            let frame;
            if (inputs.gender === 'Male') {
                if (frameIndex < 0.1) frame = 'Small';
                else if (frameIndex < 0.11) frame = 'Medium';
                else frame = 'Large';
            } else {
                if (frameIndex < 0.09) frame = 'Small';
                else if (frameIndex < 0.1) frame = 'Medium';
                else frame = 'Large';
            }
            
            // Calculate base muscle mass (Martin-Berkhan formula modified)
            let muscleMass;
            if (inputs.gender === 'Male') {
                muscleMass = (height * 0.325) + (weight * 0.482) - (wrist * 0.15);
            } else {
                muscleMass = (height * 0.294) + (weight * 0.434) - (wrist * 0.14);
            }
            
            // Adjust for activity level
            const activityMultiplier = {
                'Sedentary': 0.9,
                'Moderate': 1.0,
                'Active': 1.1,
                'Very Active': 1.2
            };
            
            muscleMass *= activityMultiplier[inputs.activity];
            
            const muscleMassPercent = (muscleMass / weight) * 100;
            
            return `Estimated Muscle Mass: ${muscleMass.toFixed(1)} kg
Muscle Mass Percentage: ${muscleMassPercent.toFixed(1)}%
Frame Size: ${frame}
Activity Level: ${inputs.activity}

Typical Ranges:
Males: 35-45% of body weight
Females: 30-40% of body weight

Note: This is an estimate based on anthropometric measurements.`;
        }
    },

    'meal-planner': {
        title: 'Meal Planner Calculator',
        icon: 'fas fa-utensils',
        inputs: [
            { id: 'calories', label: 'Daily Calories', type: 'number', placeholder: 'Enter daily calorie target' },
            { id: 'meals', label: 'Number of Meals', type: 'select', options: ['3', '4', '5', '6'] },
            { id: 'goal', label: 'Goal', type: 'select', options: ['Weight Loss', 'Maintenance', 'Muscle Gain'] },
            { id: 'diet', label: 'Diet Type', type: 'select', 
              options: ['Balanced', 'High Protein', 'Low Carb', 'Mediterranean'] }
        ],
        calculate: function(inputs) {
            const calories = parseFloat(inputs.calories) || 2000;
            const meals = parseInt(inputs.meals) || 3;
            
            // Macro ratios based on diet type
            let proteinRatio, carbRatio, fatRatio;
            switch(inputs.diet) {
                case 'High Protein':
                    proteinRatio = 0.40;
                    carbRatio = 0.30;
                    fatRatio = 0.30;
                    break;
                case 'Low Carb':
                    proteinRatio = 0.35;
                    carbRatio = 0.25;
                    fatRatio = 0.40;
                    break;
                case 'Mediterranean':
                    proteinRatio = 0.25;
                    carbRatio = 0.45;
                    fatRatio = 0.30;
                    break;
                default: // Balanced
                    proteinRatio = 0.30;
                    carbRatio = 0.45;
                    fatRatio = 0.25;
            }
            
            // Adjust ratios based on goal
            if (inputs.goal === 'Weight Loss') {
                proteinRatio += 0.05;
                carbRatio -= 0.05;
            } else if (inputs.goal === 'Muscle Gain') {
                proteinRatio += 0.05;
                fatRatio -= 0.05;
            }
            
            const caloriesPerMeal = calories / meals;
            const proteinCal = calories * proteinRatio;
            const carbCal = calories * carbRatio;
            const fatCal = calories * fatRatio;
            
            const proteinGrams = proteinCal / 4;
            const carbGrams = carbCal / 4;
            const fatGrams = fatCal / 9;
            
            return `Daily Plan (${calories} calories):
Meals per Day: ${meals}
Calories per Meal: ${Math.round(caloriesPerMeal)}

Daily Macros:
Protein: ${Math.round(proteinGrams)}g (${Math.round(proteinCal)} cal)
Carbs: ${Math.round(carbGrams)}g (${Math.round(carbCal)} cal)
Fat: ${Math.round(fatGrams)}g (${Math.round(fatCal)} cal)

Per Meal:
Protein: ${Math.round(proteinGrams/meals)}g
Carbs: ${Math.round(carbGrams/meals)}g
Fat: ${Math.round(fatGrams/meals)}g`;
        }
    },

    'macros-converter': {
        title: 'Macros to Calories Converter',
        icon: 'fas fa-calculator',
        inputs: [
            { id: 'protein', label: 'Protein (g)', type: 'number', placeholder: 'Enter protein grams' },
            { id: 'carbs', label: 'Carbohydrates (g)', type: 'number', placeholder: 'Enter carb grams' },
            { id: 'fat', label: 'Fat (g)', type: 'number', placeholder: 'Enter fat grams' },
            { id: 'fiber', label: 'Fiber (g)', type: 'number', placeholder: 'Enter fiber grams' }
        ],
        calculate: function(inputs) {
            const protein = parseFloat(inputs.protein) || 0;
            const carbs = parseFloat(inputs.carbs) || 0;
            const fat = parseFloat(inputs.fat) || 0;
            const fiber = parseFloat(inputs.fiber) || 0;
            
            const proteinCal = protein * 4;
            const carbsCal = carbs * 4;
            const fatCal = fat * 9;
            const fiberCal = fiber * 2;
            
            const totalCal = proteinCal + carbsCal + fatCal;
            const netCarbs = Math.max(0, carbs - fiber);
            
            const proteinPercent = (proteinCal / totalCal * 100) || 0;
            const carbsPercent = (carbsCal / totalCal * 100) || 0;
            const fatPercent = (fatCal / totalCal * 100) || 0;
            
            return `Total Calories: ${Math.round(totalCal)}

Breakdown by Macro:
Protein: ${proteinCal} cal (${proteinPercent.toFixed(1)}%)
Carbs: ${carbsCal} cal (${carbsPercent.toFixed(1)}%)
Fat: ${fatCal} cal (${fatPercent.toFixed(1)}%)

Additional Info:
Net Carbs: ${netCarbs}g
Fiber: ${fiber}g (${Math.round(fiberCal)} cal)`;
        }
    },

    'exercise-calories': {
        title: 'Exercise Calorie Burn Calculator',
        icon: 'fas fa-running',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: 'Enter duration' },
            { id: 'exerciseType', label: 'Exercise Type', type: 'select', 
              options: ['Walking (3.5 mph)', 'Jogging (5 mph)', 'Running (7.5 mph)', 'Cycling (12-14 mph)', 
                       'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Dancing', 'Elliptical'] }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const duration = parseInt(inputs.duration) || 0;
            
            // MET values for different exercises
            const metValues = {
                'Walking (3.5 mph)': 3.5,
                'Jogging (5 mph)': 7.0,
                'Running (7.5 mph)': 11.5,
                'Cycling (12-14 mph)': 8.0,
                'Swimming': 7.0,
                'Weight Training': 3.5,
                'Yoga': 2.5,
                'HIIT': 8.0,
                'Dancing': 4.5,
                'Elliptical': 5.0
            };
            
            const met = metValues[inputs.exerciseType];
            const calories = (met * 3.5 * weight * duration) / 200;
            
            return `Calories Burned: ${Math.round(calories)} calories
Exercise: ${inputs.exerciseType}
Duration: ${duration} minutes
Intensity: ${met} METs

Note: Actual calorie burn may vary based on:
- Fitness level
- Exercise intensity
- Age and gender
- Environmental conditions`;
        }
    },

    'body-fat-distribution': {
        title: 'Body Fat Distribution Calculator',
        icon: 'fas fa-child',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', placeholder: 'Enter waist measurement' },
            { id: 'hip', label: 'Hip Circumference (cm)', type: 'number', placeholder: 'Enter hip measurement' },
            { id: 'neck', label: 'Neck Circumference (cm)', type: 'number', placeholder: 'Enter neck measurement' }
        ],
        calculate: function(inputs) {
            const waist = parseFloat(inputs.waist) || 0;
            const hip = parseFloat(inputs.hip) || 0;
            const neck = parseFloat(inputs.neck) || 0;
            
            const whr = waist / hip;
            const whtr = waist / (hip - neck);
            
            let bodyType;
            let healthRisk;
            
            if (inputs.gender === 'Male') {
                if (whr < 0.85) {
                    bodyType = 'Gynoid (Pear)';
                    healthRisk = 'Lower';
                } else if (whr < 0.95) {
                    bodyType = 'Balanced';
                    healthRisk = 'Moderate';
                } else {
                    bodyType = 'Android (Apple)';
                    healthRisk = 'Higher';
                }
            } else {
                if (whr < 0.75) {
                    bodyType = 'Gynoid (Pear)';
                    healthRisk = 'Lower';
                } else if (whr < 0.85) {
                    bodyType = 'Balanced';
                    healthRisk = 'Moderate';
                } else {
                    bodyType = 'Android (Apple)';
                    healthRisk = 'Higher';
                }
            }
            
            return `Body Shape Analysis:
Body Type: ${bodyType}
Waist-to-Hip Ratio: ${whr.toFixed(2)}
Waist-to-Height Ratio: ${whtr.toFixed(2)}
Health Risk Level: ${healthRisk}

Notes:
- Android (apple) shape: Higher metabolic risk
- Gynoid (pear) shape: Lower metabolic risk
- Regular exercise and healthy diet recommended`;
        }
    },

    'blood-sugar': {
        title: 'Blood Sugar Converter',
        icon: 'fas fa-syringe',
        inputs: [
            { id: 'value', label: 'Blood Sugar Value', type: 'number', placeholder: 'Enter blood sugar value' },
            { id: 'fromUnit', label: 'From Unit', type: 'select', options: ['mg/dL', 'mmol/L'] },
            { id: 'timing', label: 'Timing', type: 'select', 
              options: ['Fasting', 'Before Meal', 'After Meal', 'Random'] }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            let mgdl, mmol;
            
            if (inputs.fromUnit === 'mg/dL') {
                mgdl = value;
                mmol = value / 18.0182;
            } else {
                mmol = value;
                mgdl = value * 18.0182;
            }
            
            let range;
            switch(inputs.timing) {
                case 'Fasting':
                    range = 'Normal range: 70-99 mg/dL (3.9-5.5 mmol/L)';
                    break;
                case 'Before Meal':
                    range = 'Normal range: 70-130 mg/dL (3.9-7.2 mmol/L)';
                    break;
                case 'After Meal':
                    range = 'Normal range: <180 mg/dL (<10.0 mmol/L)';
                    break;
                default:
                    range = 'Target range varies by individual';
            }
            
            return `${value} ${inputs.fromUnit} =
${mgdl.toFixed(1)} mg/dL
${mmol.toFixed(1)} mmol/L

${range}

Note: Target ranges may vary by individual and condition.`;
        }
    },

    'blood-pressure': {
        title: 'Blood Pressure Category Calculator',
        icon: 'fas fa-heart',
        inputs: [
            { id: 'systolic', label: 'Systolic Pressure (mmHg)', type: 'number', placeholder: 'Enter systolic pressure' },
            { id: 'diastolic', label: 'Diastolic Pressure (mmHg)', type: 'number', placeholder: 'Enter diastolic pressure' }
        ],
        calculate: function(inputs) {
            const systolic = parseInt(inputs.systolic) || 0;
            const diastolic = parseInt(inputs.diastolic) || 0;
            
            let category;
            let risk;
            
            if (systolic < 90 || diastolic < 60) {
                category = 'Low Blood Pressure';
                risk = 'Consult healthcare provider if symptomatic';
            } else if (systolic < 120 && diastolic < 80) {
                category = 'Normal';
                risk = 'Maintain healthy lifestyle';
            } else if (systolic < 130 && diastolic < 80) {
                category = 'Elevated';
                risk = 'Risk of developing hypertension';
            } else if (systolic < 140 || diastolic < 90) {
                category = 'Stage 1 Hypertension';
                risk = 'Lifestyle changes and possible medication';
            } else {
                category = 'Stage 2 Hypertension';
                risk = 'Lifestyle changes and likely medication';
            }
            
            return `Blood Pressure: ${systolic}/${diastolic} mmHg
Category: ${category}
Risk Level: ${risk}

Recommendations:
- Regular monitoring
- Maintain healthy diet
- Regular exercise
- Limit sodium intake
- Manage stress`;
        }
    },

    'blood-alcohol': {
        title: 'Blood Alcohol Content Calculator',
        icon: 'fas fa-wine-glass',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'drinks', label: 'Number of Drinks', type: 'number', placeholder: 'Enter number of drinks' },
            { id: 'hours', label: 'Hours Since First Drink', type: 'number', placeholder: 'Enter hours' },
            { id: 'drinkType', label: 'Drink Type', type: 'select', 
              options: ['Beer (5%)', 'Wine (12%)', 'Spirits (40%)'] }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const drinks = parseFloat(inputs.drinks) || 0;
            const hours = parseFloat(inputs.hours) || 0;
            
            // Alcohol percentage by drink type
            const alcoholPercent = {
                'Beer (5%)': 0.05,
                'Wine (12%)': 0.12,
                'Spirits (40%)': 0.40
            };
            
            // Standard drink volume (ml)
            const drinkVolume = {
                'Beer (5%)': 355,
                'Wine (12%)': 148,
                'Spirits (40%)': 44
            };
            
            // Calculate total alcohol consumed (grams)
            const alcoholGrams = drinks * drinkVolume[inputs.drinkType] * alcoholPercent[inputs.drinkType] * 0.789;
            
            // Widmark formula
            const genderConstant = inputs.gender === 'Male' ? 0.68 : 0.55;
            let bac = (alcoholGrams / (weight * 1000 * genderConstant)) * 100;
            
            // Subtract alcohol metabolized (roughly 0.015% per hour)
            bac = bac - (0.015 * hours);
            bac = Math.max(0, bac);
            
            let effect;
            if (bac === 0) effect = 'No impairment';
            else if (bac < 0.03) effect = 'Mild mood changes';
            else if (bac < 0.06) effect = 'Relaxation, mild euphoria';
            else if (bac < 0.10) effect = 'Impaired judgment and coordination';
            else effect = 'Significant impairment - DO NOT DRIVE';
            
            return `Blood Alcohol Content: ${bac.toFixed(3)}%
Effects: ${effect}
Time to Sober: ${Math.max(0, (bac / 0.015)).toFixed(1)} hours
WARNING: This is an estimate only. Do not drive after drinking.`;
        }
    },

    'weight-loss-planner': {
        title: 'Weight Loss Planner',
        icon: 'fas fa-weight',
        inputs: [
            { id: 'currentWeight', label: 'Current Weight (kg)', type: 'number', placeholder: 'Enter current weight' },
            { id: 'targetWeight', label: 'Target Weight (kg)', type: 'number', placeholder: 'Enter target weight' },
            { id: 'timeframe', label: 'Timeframe (weeks)', type: 'number', placeholder: 'Enter desired timeframe' },
            { id: 'activity', label: 'Activity Level', type: 'select', 
              options: ['Sedentary', 'Light Exercise', 'Moderate Exercise', 'Heavy Exercise'] }
        ],
        calculate: function(inputs) {
            const currentWeight = parseFloat(inputs.currentWeight) || 0;
            const targetWeight = parseFloat(inputs.targetWeight) || 0;
            const timeframe = parseInt(inputs.timeframe) || 1;
            
            const weightDiff = currentWeight - targetWeight;
            const weeklyLoss = weightDiff / timeframe;
            
            // 1 kg of fat = 7700 calories
            const dailyDeficit = (weeklyLoss * 7700) / 7;
            
            const activityMultipliers = {
                'Sedentary': 1.2,
                'Light Exercise': 1.375,
                'Moderate Exercise': 1.55,
                'Heavy Exercise': 1.725
            };
            
            // Base metabolic rate (simplified)
            const bmr = currentWeight * 24 * activityMultipliers[inputs.activity];
            
            return `Required Daily Deficit: ${Math.round(dailyDeficit)} calories
Weekly Weight Loss: ${weeklyLoss.toFixed(1)} kg
Suggested Daily Calories: ${Math.round(bmr - dailyDeficit)} calories
Total Weight Loss: ${weightDiff.toFixed(1)} kg
Note: Maximum safe weight loss is 0.5-1 kg per week`;
        }
    },

    'resting-energy': {
        title: 'Resting Energy Expenditure Calculator',
        icon: 'fas fa-bed',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            
            // Penn State Equation
            let ree;
            if (inputs.gender === 'Male') {
                ree = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                ree = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            
            // Adjustment factors
            const stress = ree * 0.1; // 10% for basic stress
            const thermal = ree * 0.13; // 13% for thermal effect of feeding
            
            return `Resting Energy Expenditure: ${Math.round(ree)} calories/day
With Stress Factor: ${Math.round(ree + stress)} calories/day
With Thermal Effect: ${Math.round(ree + thermal)} calories/day
Total REE (all factors): ${Math.round(ree + stress + thermal)} calories/day`;
        }
    },

    'lean-body-mass': {
        title: 'Lean Body Mass Calculator',
        icon: 'fas fa-dumbbell',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            
            // Boer Formula
            let lbm;
            if (inputs.gender === 'Male') {
                lbm = 0.407 * weight + 0.267 * height - 19.2;
            } else {
                lbm = 0.252 * weight + 0.473 * height - 48.3;
            }
            
            return `Lean Body Mass: ${lbm.toFixed(1)} kg
Fat Mass: ${(weight - lbm).toFixed(1)} kg
LBM Percentage: ${((lbm / weight) * 100).toFixed(1)}%`;
        }
    },

    'body-surface-area': {
        title: 'Body Surface Area Calculator',
        icon: 'fas fa-child',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            
            // Mosteller formula
            const bsa = Math.sqrt((weight * height) / 3600);
            return `Body Surface Area: ${bsa.toFixed(2)} m²
Method: Mosteller Formula
Common Uses: Drug dosing, metabolic rate calculations`;
        }
    },

    'target-heart-rate': {
        title: 'Target Heart Rate Calculator',
        icon: 'fas fa-heartbeat',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'restingHR', label: 'Resting Heart Rate', type: 'number', placeholder: 'Enter resting HR' },
            { id: 'intensity', label: 'Training Intensity', type: 'select', 
              options: ['Light (40-50%)', 'Moderate (50-70%)', 'Hard (70-85%)', 'Maximum (85-95%)'] }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const restingHR = parseInt(inputs.restingHR) || 60;
            const maxHR = 220 - age;
            const hrReserve = maxHR - restingHR;
            
            const intensity = inputs.intensity.match(/\((\d+)-(\d+)%\)/);
            const lower = restingHR + (hrReserve * parseInt(intensity[1]) / 100);
            const upper = restingHR + (hrReserve * parseInt(intensity[2]) / 100);
            
            return `Target Heart Rate Zone: ${Math.round(lower)}-${Math.round(upper)} BPM
Maximum Heart Rate: ${maxHR} BPM
Selected Intensity: ${inputs.intensity}`;
        }
    },

    'bmr': {
        title: 'BMR Calculator',
        icon: 'fas fa-fire-alt',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' }
        ],
        calculate: function(inputs) {
            const age = parseInt(inputs.age) || 0;
            const weight = parseFloat(inputs.weight) || 0;
            const height = parseFloat(inputs.height) || 0;
            
            let bmr;
            if (inputs.gender === 'Male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            
            return `BMR: ${Math.round(bmr)} calories/day
Daily calorie needs:
Sedentary: ${Math.round(bmr * 1.2)} calories
Light Exercise: ${Math.round(bmr * 1.375)} calories
Moderate Exercise: ${Math.round(bmr * 1.55)} calories
Heavy Exercise: ${Math.round(bmr * 1.725)} calories
Athlete: ${Math.round(bmr * 1.9)} calories`;
        }
    },

    // Waist-to-Hip Ratio Calculator
    'waist-hip-ratio': {
        title: 'Waist-to-Hip Ratio Calculator',
        icon: 'fas fa-ruler-horizontal',
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
            { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', placeholder: 'Enter waist measurement' },
            { id: 'hip', label: 'Hip Circumference (cm)', type: 'number', placeholder: 'Enter hip measurement' }
        ],
        calculate: function(inputs) {
            const waist = parseFloat(inputs.waist) || 0;
            const hip = parseFloat(inputs.hip) || 0;
            const whr = waist / hip;
            
            let risk = inputs.gender === 'Male' ? 
                (whr < 0.9 ? 'Low' : whr < 0.95 ? 'Moderate' : 'High') :
                (whr < 0.8 ? 'Low' : whr < 0.85 ? 'Moderate' : 'High');
            
            return `Waist-to-Hip Ratio: ${whr.toFixed(2)}
Health Risk: ${risk}
Body Shape: ${whr >= (inputs.gender === 'Male' ? 0.9 : 0.8) ? 'Apple' : 'Pear'}`;
        }
    },
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
    },    'fuel-economy-conversion': {
        title: 'Fuel Economy Converter',
        icon: 'fas fa-gas-pump',
        inputs: [
            { id: 'value', label: 'Fuel Economy', type: 'number', placeholder: 'Enter fuel economy value' },
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

    // Mathematics Calculator Implementation
    'algebra': {
        title: 'Algebra Solver',
        icon: 'fas fa-square-root-alt',
        inputs: [
            { id: 'equation', label: 'Equation Type', type: 'select', 
              options: ['Linear (ax + b = c)', 'System of Linear Equations', 'Simplify Expression'] },
            { id: 'a', label: 'Coefficient a', type: 'number', placeholder: 'Enter coefficient a' },
            { id: 'b', label: 'Coefficient b', type: 'number', placeholder: 'Enter coefficient b' },
            { id: 'c', label: 'Constant c', type: 'number', placeholder: 'Enter constant c' }
        ],
        calculate: function(inputs) {
            const a = parseFloat(inputs.a) || 0;
            const b = parseFloat(inputs.b) || 0;
            const c = parseFloat(inputs.c) || 0;
            
            if (inputs.equation === 'Linear (ax + b = c)') {
                if (a === 0) return 'Error: Coefficient a cannot be zero for linear equation';
                const x = (c - b) / a;
                return `Linear Equation: ${a}x + ${b} = ${c}\nSolution: x = ${x.toFixed(4)}\nVerification: ${a}(${x.toFixed(4)}) + ${b} = ${(a * x + b).toFixed(4)}`;
            }
            return 'Please select equation type and enter coefficients';
        }
    },

    'quadratic': {
        title: 'Quadratic Equation Solver',
        icon: 'fas fa-superscript',
        inputs: [
            { id: 'a', label: 'Coefficient a (x²)', type: 'number', placeholder: 'Enter coefficient of x²' },
            { id: 'b', label: 'Coefficient b (x)', type: 'number', placeholder: 'Enter coefficient of x' },
            { id: 'c', label: 'Constant c', type: 'number', placeholder: 'Enter constant term' }
        ],
        calculate: function(inputs) {
            const a = parseFloat(inputs.a) || 0;
            const b = parseFloat(inputs.b) || 0;
            const c = parseFloat(inputs.c) || 0;
            
            if (a === 0) return 'Error: Coefficient a cannot be zero for quadratic equation';
            
            const discriminant = b * b - 4 * a * c;
            const vertex_x = -b / (2 * a);
            const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;
            
            let solutions = '';
            if (discriminant > 0) {
                const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                solutions = `Two Real Solutions:\nx₁ = ${x1.toFixed(4)}\nx₂ = ${x2.toFixed(4)}`;
            } else if (discriminant === 0) {
                const x = -b / (2 * a);
                solutions = `One Real Solution:\nx = ${x.toFixed(4)}`;
            } else {
                const realPart = -b / (2 * a);
                const imagPart = Math.sqrt(-discriminant) / (2 * a);
                solutions = `Two Complex Solutions:\nx₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i\nx₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
            }
            
            return `Quadratic Equation: ${a}x² + ${b}x + ${c} = 0\nDiscriminant: ${discriminant.toFixed(4)}\nVertex: (${vertex_x.toFixed(4)}, ${vertex_y.toFixed(4)})\n${solutions}`;
        }
    },

    'trigonometry': {
        title: 'Trigonometry Calculator',
        icon: 'fas fa-wave-square',
        inputs: [
            { id: 'angle', label: 'Angle', type: 'number', placeholder: 'Enter angle', step: '0.01' },
            { id: 'unit', label: 'Unit', type: 'select', options: ['Degrees', 'Radians'] },
            { id: 'function', label: 'Trigonometric Function', type: 'select', 
              options: ['All Functions', 'sin', 'cos', 'tan', 'csc', 'sec', 'cot'] }
        ],
        calculate: function(inputs) {
            let angle = parseFloat(inputs.angle) || 0;
            
            // Convert to radians if input is in degrees
            const radians = inputs.unit === 'Degrees' ? angle * (Math.PI / 180) : angle;
            
            const sin = Math.sin(radians);
            const cos = Math.cos(radians);
            const tan = Math.tan(radians);
            const csc = 1 / sin;
            const sec = 1 / cos;
            const cot = 1 / tan;
            
            if (inputs.function === 'All Functions') {
                return `Angle: ${angle}° (${radians.toFixed(4)} rad)\n\nPrimary Functions:\nsin(${angle}°) = ${sin.toFixed(6)}\ncos(${angle}°) = ${cos.toFixed(6)}\ntan(${angle}°) = ${tan.toFixed(6)}\n\nReciprocal Functions:\ncsc(${angle}°) = ${csc.toFixed(6)}\nsec(${angle}°) = ${sec.toFixed(6)}\ncot(${angle}°) = ${cot.toFixed(6)}`;
            } else {
                const values = { sin, cos, tan, csc, sec, cot };
                const result = values[inputs.function];
                return `${inputs.function}(${angle}°) = ${result.toFixed(6)}\nAngle in radians: ${radians.toFixed(4)}`;
            }
        }
    },

    'scientific-calculator': {
        title: 'Scientific Calculator',
        icon: 'fas fa-calculator',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Power (x^y)', 'Square Root', 'Cube Root', 'Logarithm (log₁₀)', 'Natural Log (ln)', 'Exponential (e^x)', 'Factorial'] },
            { id: 'x', label: 'Value X', type: 'number', placeholder: 'Enter first value', step: '0.000001' },
            { id: 'y', label: 'Value Y (if needed)', type: 'number', placeholder: 'Enter second value', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const x = parseFloat(inputs.x) || 0;
            const y = parseFloat(inputs.y) || 0;
            
            let result;
            switch(inputs.operation) {
                case 'Power (x^y)':
                    result = Math.pow(x, y);
                    return `${x}^${y} = ${result}`;
                case 'Square Root':
                    if (x < 0) return 'Error: Cannot calculate square root of negative number';
                    result = Math.sqrt(x);
                    return `√${x} = ${result.toFixed(6)}`;
                case 'Cube Root':
                    result = Math.cbrt(x);
                    return `∛${x} = ${result.toFixed(6)}`;
                case 'Logarithm (log₁₀)':
                    if (x <= 0) return 'Error: Logarithm undefined for non-positive numbers';
                    result = Math.log10(x);
                    return `log₁₀(${x}) = ${result.toFixed(6)}`;
                case 'Natural Log (ln)':
                    if (x <= 0) return 'Error: Natural logarithm undefined for non-positive numbers';
                    result = Math.log(x);
                    return `ln(${x}) = ${result.toFixed(6)}`;
                case 'Exponential (e^x)':
                    result = Math.exp(x);
                    return `e^${x} = ${result.toFixed(6)}`;
                case 'Factorial':
                    if (x < 0 || !Number.isInteger(x)) return 'Error: Factorial only defined for non-negative integers';
                    if (x > 170) return 'Error: Number too large for factorial calculation';
                    result = 1;
                    for (let i = 2; i <= x; i++) result *= i;
                    return `${x}! = ${result}`;
                default:
                    return 'Please select an operation';
            }
        }
    },

    'statistics-calculator': {
        title: 'Statistics Calculator',
        icon: 'fas fa-chart-bar',
        inputs: [
            { id: 'data', label: 'Data Set (comma separated)', type: 'text', placeholder: 'e.g., 1,2,3,4,5' },
            { id: 'calculation', label: 'Calculation Type', type: 'select', 
              options: ['All Statistics', 'Mean', 'Median', 'Mode', 'Standard Deviation', 'Variance'] }
        ],
        calculate: function(inputs) {
            const dataStr = inputs.data || '';
            const data = dataStr.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
            
            if (data.length === 0) return 'Error: Please enter valid numeric data';
            
            // Sort data for median calculation
            const sortedData = [...data].sort((a, b) => a - b);
            
            // Mean
            const mean = data.reduce((sum, x) => sum + x, 0) / data.length;
            
            // Median
            const median = data.length % 2 === 0 
                ? (sortedData[data.length / 2 - 1] + sortedData[data.length / 2]) / 2
                : sortedData[Math.floor(data.length / 2)];
            
            // Mode
            const frequency = {};
            data.forEach(x => frequency[x] = (frequency[x] || 0) + 1);
            const maxFreq = Math.max(...Object.values(frequency));
            const mode = Object.keys(frequency).filter(x => frequency[x] === maxFreq);
            
            // Variance and Standard Deviation
            const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
            const stdDev = Math.sqrt(variance);
            
            // Range
            const range = Math.max(...data) - Math.min(...data);
            
            if (inputs.calculation === 'All Statistics') {
                return `Data: [${data.join(', ')}]\nCount: ${data.length}\n\nMeasures of Central Tendency:\nMean: ${mean.toFixed(4)}\nMedian: ${median.toFixed(4)}\nMode: ${mode.join(', ')}\n\nMeasures of Dispersion:\nRange: ${range.toFixed(4)}\nVariance: ${variance.toFixed(4)}\nStandard Deviation: ${stdDev.toFixed(4)}\n\nMinimum: ${Math.min(...data)}\nMaximum: ${Math.max(...data)}`;
            } else {
                const results = {
                    'Mean': mean.toFixed(4),
                    'Median': median.toFixed(4),
                    'Mode': mode.join(', '),
                    'Standard Deviation': stdDev.toFixed(4),
                    'Variance': variance.toFixed(4)
                };
                return `${inputs.calculation}: ${results[inputs.calculation]}`;
            }
        }
    },

    'matrix-calculator': {
        title: 'Matrix Calculator',
        icon: 'fas fa-th',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Determinant (2x2)', 'Determinant (3x3)', 'Matrix Addition', 'Matrix Multiplication'] },
            { id: 'matrix', label: 'Matrix Elements (comma separated)', type: 'text', 
              placeholder: 'For 2x2: a,b,c,d (row by row)' }
        ],
        calculate: function(inputs) {
            const elements = inputs.matrix.split(',').map(x => parseFloat(x.trim()));
            
            if (inputs.operation === 'Determinant (2x2)') {
                if (elements.length !== 4) return 'Error: Please enter exactly 4 elements for 2x2 matrix';
                const [a, b, c, d] = elements;
                const det = a * d - b * c;
                return `Matrix:\n[${a} ${b}]\n[${c} ${d}]\n\nDeterminant: ${det}`;
            }
            
            if (inputs.operation === 'Determinant (3x3)') {
                if (elements.length !== 9) return 'Error: Please enter exactly 9 elements for 3x3 matrix';
                const [a, b, c, d, e, f, g, h, i] = elements;
                const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
                return `Matrix:\n[${a} ${b} ${c}]\n[${d} ${e} ${f}]\n[${g} ${h} ${i}]\n\nDeterminant: ${det}`;
            }
            
            return 'Please select an operation and enter matrix elements';
        }
    },

    'geometry-calculator': {
        title: 'Geometry Calculator',
        icon: 'fas fa-shapes',
        inputs: [
            { id: 'shape', label: 'Shape', type: 'select', 
              options: ['Circle', 'Triangle', 'Rectangle', 'Square', 'Trapezoid', 'Sphere', 'Cylinder'] },
            { id: 'dimension1', label: 'Dimension 1', type: 'number', placeholder: 'Enter first dimension', step: '0.01' },
            { id: 'dimension2', label: 'Dimension 2 (if needed)', type: 'number', placeholder: 'Enter second dimension', step: '0.01' },
            { id: 'dimension3', label: 'Dimension 3 (if needed)', type: 'number', placeholder: 'Enter third dimension', step: '0.01' }
        ],
        calculate: function(inputs) {
            const d1 = parseFloat(inputs.dimension1) || 0;
            const d2 = parseFloat(inputs.dimension2) || 0;
            const d3 = parseFloat(inputs.dimension3) || 0;
            
            switch(inputs.shape) {
                case 'Circle':
                    const circleArea = Math.PI * d1 * d1;
                    const circlePerimeter = 2 * Math.PI * d1;
                    return `Circle (radius = ${d1})\nArea: ${circleArea.toFixed(4)}\nPerimeter: ${circlePerimeter.toFixed(4)}`;
                
                case 'Triangle':
                    if (d2 === 0) return 'Error: Please enter base and height';
                    const triangleArea = 0.5 * d1 * d2;
                    return `Triangle (base = ${d1}, height = ${d2})\nArea: ${triangleArea.toFixed(4)}`;
                
                case 'Rectangle':
                    if (d2 === 0) return 'Error: Please enter length and width';
                    const rectArea = d1 * d2;
                    const rectPerimeter = 2 * (d1 + d2);
                    return `Rectangle (length = ${d1}, width = ${d2})\nArea: ${rectArea.toFixed(4)}\nPerimeter: ${rectPerimeter.toFixed(4)}`;
                
                case 'Square':
                    const squareArea = d1 * d1;
                    const squarePerimeter = 4 * d1;
                    return `Square (side = ${d1})\nArea: ${squareArea.toFixed(4)}\nPerimeter: ${squarePerimeter.toFixed(4)}`;
                
                case 'Sphere':
                    const sphereVolume = (4/3) * Math.PI * Math.pow(d1, 3);
                    const sphereSurface = 4 * Math.PI * d1 * d1;
                    return `Sphere (radius = ${d1})\nVolume: ${sphereVolume.toFixed(4)}\nSurface Area: ${sphereSurface.toFixed(4)}`;
                
                case 'Cylinder':
                    if (d2 === 0) return 'Error: Please enter radius and height';
                    const cylinderVolume = Math.PI * d1 * d1 * d2;
                    const cylinderSurface = 2 * Math.PI * d1 * (d1 + d2);
                    return `Cylinder (radius = ${d1}, height = ${d2})\nVolume: ${cylinderVolume.toFixed(4)}\nSurface Area: ${cylinderSurface.toFixed(4)}`;
                
                default:
                    return 'Please select a shape and enter dimensions';
            }
        }
    },

    'calculus-calculator': {
        title: 'Basic Calculus Calculator',
        icon: 'fas fa-integral',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Derivative', 'Definite Integral (Riemann Sum)', 'Limit'] },
            { id: 'function', label: 'Function Type', type: 'select', 
              options: ['Polynomial (ax² + bx + c)', 'Exponential (ae^x)', 'Trigonometric (a sin(x))', 'Power (ax^n)'] },
            { id: 'a', label: 'Coefficient a', type: 'number', placeholder: 'Enter coefficient a', step: '0.01' },
            { id: 'b', label: 'Coefficient b', type: 'number', placeholder: 'Enter coefficient b', step: '0.01' },
            { id: 'c', label: 'Coefficient c', type: 'number', placeholder: 'Enter coefficient c', step: '0.01' },
            { id: 'x', label: 'Point x (for derivative)', type: 'number', placeholder: 'Enter x value', step: '0.01' }
        ],
        calculate: function(inputs) {
            const a = parseFloat(inputs.a) || 0;
            const b = parseFloat(inputs.b) || 0;
            const c = parseFloat(inputs.c) || 0;
            const x = parseFloat(inputs.x) || 0;
            
            if (inputs.operation === 'Derivative' && inputs.function === 'Polynomial (ax² + bx + c)') {
                // Derivative of ax² + bx + c is 2ax + b
                const derivative = 2 * a * x + b;
                return `Function: f(x) = ${a}x² + ${b}x + ${c}\nDerivative: f'(x) = ${2*a}x + ${b}\nf'(${x}) = ${derivative.toFixed(4)}`;
            }
            
            return 'Basic calculus operations available. Select function type and operation.';
        }
    },

    'number-theory': {
        title: 'Number Theory Calculator',
        icon: 'fas fa-hashtag',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['GCD (Greatest Common Divisor)', 'LCM (Least Common Multiple)', 'Prime Check', 'Prime Factorization', 'Fibonacci Sequence'] },
            { id: 'num1', label: 'Number 1', type: 'number', placeholder: 'Enter first number' },
            { id: 'num2', label: 'Number 2 (if needed)', type: 'number', placeholder: 'Enter second number' }
        ],
        calculate: function(inputs) {
            const num1 = parseInt(inputs.num1) || 0;
            const num2 = parseInt(inputs.num2) || 0;
            
            const gcd = (a, b) => b ? gcd(b, a % b) : a;
            const lcm = (a, b) => (a * b) / gcd(a, b);
            const isPrime = (n) => {
                if (n < 2) return false;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                    if (n % i === 0) return false;
                }
                return true;
            };
            
            switch(inputs.operation) {
                case 'GCD (Greatest Common Divisor)':
                    if (num2 === 0) return 'Error: Please enter two numbers';
                    return `GCD(${num1}, ${num2}) = ${gcd(Math.abs(num1), Math.abs(num2))}`;
                
                case 'LCM (Least Common Multiple)':
                    if (num2 === 0) return 'Error: Please enter two numbers';
                    return `LCM(${num1}, ${num2}) = ${lcm(Math.abs(num1), Math.abs(num2))}`;
                
                case 'Prime Check':
                    if (num1 < 0) return 'Error: Please enter a positive number';
                    return `${num1} is ${isPrime(num1) ? 'prime' : 'not prime'}`;
                
                case 'Prime Factorization':
                    if (num1 < 2) return 'Error: Please enter a number ≥ 2';
                    let n = num1;
                    const factors = [];
                    for (let i = 2; i <= n; i++) {
                        while (n % i === 0) {
                            factors.push(i);
                            n /= i;
                        }
                    }
                    return `Prime factorization of ${num1}: ${factors.join(' × ')}`;
                
                case 'Fibonacci Sequence':
                    if (num1 < 1 || num1 > 50) return 'Error: Please enter a number between 1 and 50';
                    const fib = [0, 1];
                    for (let i = 2; i < num1; i++) {
                        fib[i] = fib[i-1] + fib[i-2];
                    }
                    return `First ${num1} Fibonacci numbers:\n${fib.slice(0, num1).join(', ')}`;
                
                default:
                    return 'Please select an operation';
            }
        }
    },

    'probability-calculator': {
        title: 'Probability Calculator',
        icon: 'fas fa-dice',
        inputs: [
            { id: 'type', label: 'Calculation Type', type: 'select', 
              options: ['Combination (nCr)', 'Permutation (nPr)', 'Dice Probability', 'Coin Flip'] },
            { id: 'n', label: 'Total Items (n)', type: 'number', placeholder: 'Enter total items' },
            { id: 'r', label: 'Selected Items (r)', type: 'number', placeholder: 'Enter selected items' },
            { id: 'events', label: 'Number of Events', type: 'number', placeholder: 'Enter number of events' }
        ],
        calculate: function(inputs) {
            const n = parseInt(inputs.n) || 0;
            const r = parseInt(inputs.r) || 0;
            const events = parseInt(inputs.events) || 1;
            
            const factorial = (num) => {
                if (num < 0) return 0;
                if (num === 0 || num === 1) return 1;
                let result = 1;
                for (let i = 2; i <= num; i++) result *= i;
                return result;
            };
            
            switch(inputs.type) {
                case 'Combination (nCr)':
                    if (r > n) return 'Error: r cannot be greater than n';
                    const nCr = factorial(n) / (factorial(r) * factorial(n - r));
                    return `Combination: C(${n}, ${r}) = ${nCr}\nFormula: n! / (r! × (n-r)!)`;
                
                case 'Permutation (nPr)':
                    if (r > n) return 'Error: r cannot be greater than n';
                    const nPr = factorial(n) / factorial(n - r);
                    return `Permutation: P(${n}, ${r}) = ${nPr}\nFormula: n! / (n-r)!`;
                
                case 'Dice Probability':
                    if (events < 1 || events > 6) return 'Error: Dice events must be between 1 and 6';
                    const diceProb = 1 / 6;
                    return `Probability of rolling ${events} on a fair die: ${diceProb.toFixed(4)} or ${(diceProb * 100).toFixed(2)}%`;
                
                case 'Coin Flip':
                    return `Probability of heads (or tails): 0.5 or 50%\nProbability of ${events} consecutive heads: ${Math.pow(0.5, events).toFixed(6)} or ${(Math.pow(0.5, events) * 100).toFixed(4)}%`;
                
                default:
                    return 'Please select a calculation type';
            }
        }
    },

    'complex-numbers': {
        title: 'Complex Numbers Calculator',
        icon: 'fas fa-infinity',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Magnitude', 'Argument'] },
            { id: 'real1', label: 'Real Part (First)', type: 'number', placeholder: 'Enter real part', step: '0.01' },
            { id: 'imag1', label: 'Imaginary Part (First)', type: 'number', placeholder: 'Enter imaginary part', step: '0.01' },
            { id: 'real2', label: 'Real Part (Second)', type: 'number', placeholder: 'Enter real part', step: '0.01' },
            { id: 'imag2', label: 'Imaginary Part (Second)', type: 'number', placeholder: 'Enter imaginary part', step: '0.01' }
        ],
        calculate: function(inputs) {
            const r1 = parseFloat(inputs.real1) || 0;
            const i1 = parseFloat(inputs.imag1) || 0;
            const r2 = parseFloat(inputs.real2) || 0;
            const i2 = parseFloat(inputs.imag2) || 0;
            
            const formatComplex = (real, imag) => {
                if (imag === 0) return `${real}`;
                if (real === 0) return imag === 1 ? 'i' : imag === -1 ? '-i' : `${imag}i`;
                const sign = imag >= 0 ? '+' : '-';
                const imagPart = Math.abs(imag) === 1 ? 'i' : `${Math.abs(imag)}i`;
                return `${real} ${sign} ${imagPart}`;
            };
            
            let result_real, result_imag;
            
            switch(inputs.operation) {
                case 'Addition':
                    result_real = r1 + r2;
                    result_imag = i1 + i2;
                    return `(${formatComplex(r1, i1)}) + (${formatComplex(r2, i2)}) = ${formatComplex(result_real, result_imag)}`;
                
                case 'Subtraction':
                    result_real = r1 - r2;
                    result_imag = i1 - i2;
                    return `(${formatComplex(r1, i1)}) - (${formatComplex(r2, i2)}) = ${formatComplex(result_real, result_imag)}`;
                
                case 'Multiplication':
                    result_real = r1 * r2 - i1 * i2;
                    result_imag = r1 * i2 + i1 * r2;
                    return `(${formatComplex(r1, i1)}) × (${formatComplex(r2, i2)}) = ${formatComplex(result_real, result_imag)}`;
                
                case 'Division':
                    const denominator = r2 * r2 + i2 * i2;
                    if (denominator === 0) return 'Error: Division by zero';
                    result_real = (r1 * r2 + i1 * i2) / denominator;
                    result_imag = (i1 * r2 - r1 * i2) / denominator;
                    return `(${formatComplex(r1, i1)}) ÷ (${formatComplex(r2, i2)}) = ${formatComplex(result_real.toFixed(4), result_imag.toFixed(4))}`;
                
                case 'Magnitude':
                    const magnitude = Math.sqrt(r1 * r1 + i1 * i1);
                    return `Magnitude of ${formatComplex(r1, i1)} = ${magnitude.toFixed(4)}`;
                
                case 'Argument':
                    const argument = Math.atan2(i1, r1);
                    const argumentDegrees = argument * (180 / Math.PI);
                    return `Argument of ${formatComplex(r1, i1)} = ${argument.toFixed(4)} rad = ${argumentDegrees.toFixed(2)}°`;
                
                default:
                    return 'Please select an operation';
            }
        }
    },

    'sequence-series': {
        title: 'Sequence & Series Calculator',
        icon: 'fas fa-list-ol',
        inputs: [
            { id: 'type', label: 'Type', type: 'select', 
              options: ['Arithmetic Sequence', 'Geometric Sequence', 'Arithmetic Series', 'Geometric Series'] },
            { id: 'first', label: 'First Term (a₁)', type: 'number', placeholder: 'Enter first term', step: '0.01' },
            { id: 'difference', label: 'Common Difference/Ratio', type: 'number', placeholder: 'Enter difference or ratio', step: '0.01' },
            { id: 'n', label: 'Number of Terms (n)', type: 'number', placeholder: 'Enter number of terms' }
        ],
        calculate: function(inputs) {
            const a1 = parseFloat(inputs.first) || 0;
            const d = parseFloat(inputs.difference) || 0;
            const n = parseInt(inputs.n) || 0;
            
            if (n <= 0) return 'Error: Number of terms must be positive';
            
            switch(inputs.type) {
                case 'Arithmetic Sequence':
                    const an_arith = a1 + (n - 1) * d;
                    return `Arithmetic Sequence\nFirst term (a₁): ${a1}\nCommon difference (d): ${d}\nNth term (a${n}): ${an_arith}\nFormula: aₙ = a₁ + (n-1)d`;
                
                case 'Geometric Sequence':
                    if (d === 0) return 'Error: Common ratio cannot be zero';
                    const an_geom = a1 * Math.pow(d, n - 1);
                    return `Geometric Sequence\nFirst term (a₁): ${a1}\nCommon ratio (r): ${d}\nNth term (a${n}): ${an_geom.toFixed(6)}\nFormula: aₙ = a₁ × r^(n-1)`;
                
                case 'Arithmetic Series':
                    const sum_arith = (n / 2) * (2 * a1 + (n - 1) * d);
                    return `Arithmetic Series\nFirst term (a₁): ${a1}\nCommon difference (d): ${d}\nSum of ${n} terms: ${sum_arith}\nFormula: Sₙ = n/2 × [2a₁ + (n-1)d]`;
                
                case 'Geometric Series':
                    if (d === 0) return 'Error: Common ratio cannot be zero';
                    let sum_geom;
                    if (d === 1) {
                        sum_geom = n * a1;
                    } else {
                        sum_geom = a1 * (1 - Math.pow(d, n)) / (1 - d);
                    }
                    return `Geometric Series\nFirst term (a₁): ${a1}\nCommon ratio (r): ${d}\nSum of ${n} terms: ${sum_geom.toFixed(6)}\nFormula: Sₙ = a₁ × (1-r^n)/(1-r)`;
                
                default:
                    return 'Please select a sequence/series type';
            }
        }
    },

    'logarithm-calculator': {
        title: 'Advanced Logarithm Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Common Log (log₁₀)', 'Natural Log (ln)', 'Custom Base Log', 'Antilog (10^x)', 'Exponential (e^x)'] },
            { id: 'value', label: 'Value', type: 'number', placeholder: 'Enter value', step: '0.000001' },
            { id: 'base', label: 'Base (for custom)', type: 'number', placeholder: 'Enter base', step: '0.01' }
        ],
        calculate: function(inputs) {
            const value = parseFloat(inputs.value) || 0;
            const base = parseFloat(inputs.base) || 10;
            
            switch(inputs.operation) {
                case 'Common Log (log₁₀)':
                    if (value <= 0) return 'Error: Logarithm undefined for non-positive numbers';
                    const log10Result = Math.log10(value);
                    return `log₁₀(${value}) = ${log10Result.toFixed(6)}\nVerification: 10^${log10Result.toFixed(6)} = ${Math.pow(10, log10Result).toFixed(6)}`;
                
                case 'Natural Log (ln)':
                    if (value <= 0) return 'Error: Natural logarithm undefined for non-positive numbers';
                    const lnResult = Math.log(value);
                    return `ln(${value}) = ${lnResult.toFixed(6)}\nVerification: e^${lnResult.toFixed(6)} = ${Math.exp(lnResult).toFixed(6)}`;
                
                case 'Custom Base Log':
                    if (value <= 0) return 'Error: Logarithm undefined for non-positive numbers';
                    if (base <= 0 || base === 1) return 'Error: Base must be positive and not equal to 1';
                    const customLogResult = Math.log(value) / Math.log(base);
                    return `log₍${base}₎(${value}) = ${customLogResult.toFixed(6)}\nVerification: ${base}^${customLogResult.toFixed(6)} = ${Math.pow(base, customLogResult).toFixed(6)}`;
                
                case 'Antilog (10^x)':
                    const antilogResult = Math.pow(10, value);
                    return `Antilog (10^${value}) = ${antilogResult.toFixed(6)}\nVerification: log₁₀(${antilogResult.toFixed(6)}) = ${Math.log10(antilogResult).toFixed(6)}`;
                
                case 'Exponential (e^x)':
                    const expResult = Math.exp(value);
                    return `e^${value} = ${expResult.toFixed(6)}\nVerification: ln(${expResult.toFixed(6)}) = ${Math.log(expResult).toFixed(6)}`;
                
                default:
                    return 'Please select an operation';
            }
        }
    },

    'polynomial-calculator': {
        title: 'Polynomial Calculator',
        icon: 'fas fa-square-root-alt',
        inputs: [
            { id: 'degree', label: 'Polynomial Degree', type: 'select', options: ['2', '3', '4'] },
            { id: 'a', label: 'Coefficient a (highest degree)', type: 'number', placeholder: 'Enter coefficient a', step: '0.01' },
            { id: 'b', label: 'Coefficient b', type: 'number', placeholder: 'Enter coefficient b', step: '0.01' },
            { id: 'c', label: 'Coefficient c', type: 'number', placeholder: 'Enter coefficient c', step: '0.01' },
            { id: 'd', label: 'Coefficient d (if degree 3+)', type: 'number', placeholder: 'Enter coefficient d', step: '0.01' },
            { id: 'e', label: 'Coefficient e (if degree 4)', type: 'number', placeholder: 'Enter coefficient e', step: '0.01' },
            { id: 'x', label: 'Evaluate at x =', type: 'number', placeholder: 'Enter x value', step: '0.01' }
        ],
        calculate: function(inputs) {
            const degree = parseInt(inputs.degree) || 2;
            const a = parseFloat(inputs.a) || 0;
            const b = parseFloat(inputs.b) || 0;
            const c = parseFloat(inputs.c) || 0;
            const d = parseFloat(inputs.d) || 0;
            const e = parseFloat(inputs.e) || 0;
            const x = parseFloat(inputs.x) || 0;
            
            let polynomial, value, derivative;
            
            switch(degree) {
                case 2:
                    polynomial = `f(x) = ${a}x² + ${b}x + ${c}`;
                    value = a * x * x + b * x + c;
                    derivative = `f'(x) = ${2*a}x + ${b}`;
                    break;
                case 3:
                    polynomial = `f(x) = ${a}x³ + ${b}x² + ${c}x + ${d}`;
                    value = a * x * x * x + b * x * x + c * x + d;
                    derivative = `f'(x) = ${3*a}x² + ${2*b}x + ${c}`;
                    break;
                case 4:
                    polynomial = `f(x) = ${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e}`;
                    value = a * Math.pow(x, 4) + b * Math.pow(x, 3) + c * x * x + d * x + e;
                    derivative = `f'(x) = ${4*a}x³ + ${3*b}x² + ${2*c}x + ${d}`;
                    break;
            }
            
            return `Polynomial: ${polynomial}\nEvaluation: f(${x}) = ${value.toFixed(6)}\nDerivative: ${derivative}`;
        }
    },

    'windows-calculator': {
        title: 'Windows 10 Calculator',
        icon: 'fab fa-windows',
        isCustomInterface: true,
        inputs: [],
        calculate: function(inputs) {
            return 'Calculator ready for use';
        },
        renderCustomInterface: function() {
            // Initialize calculator when interface is rendered
            setTimeout(() => {
                if (typeof window.initWindowsCalculator === 'function') {
                    window.initWindowsCalculator();
                }
            }, 100);
            
            return `
                <div class="windows-calculator-container">
                    <div class="calculator-header">
                        <div class="calculator-mode-selector">
                            <button class="mode-btn active" data-mode="standard" onclick="window.switchMode('standard')">
                                <i class="fas fa-calculator"></i>
                                <span>Standard</span>
                            </button>
                            <button class="mode-btn" data-mode="scientific" onclick="window.switchMode('scientific')">
                                <i class="fas fa-atom"></i>
                                <span>Scientific</span>
                            </button>
                            <button class="mode-btn" data-mode="graphing" onclick="window.switchMode('graphing')">
                                <i class="fas fa-chart-line"></i>
                                <span>Graphing</span>
                            </button>
                            <button class="mode-btn" data-mode="programmer" onclick="window.switchMode('programmer')">
                                <i class="fas fa-code"></i>
                                <span>Programmer</span>
                            </button>
                        </div>
                        <div class="calculator-history-memory">
                            <button class="history-btn" onclick="window.toggleHistory()" title="View History">
                                <i class="fas fa-history"></i>
                            </button>
                            <button class="memory-btn" onclick="window.toggleMemory()" title="View Memory">
                                <i class="fas fa-memory"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="calculator-display-section">
                        <div class="calculator-expression" id="calc-expression"></div>
                        <div class="calculator-result" id="calc-result">0</div>
                    </div>
                    
                    <div class="calculator-body">
                        <div class="calculator-sidebar" id="calc-sidebar" style="display: none;">
                            <div class="sidebar-content" id="sidebar-content">
                                <div class="history-panel" id="history-panel">
                                    <h4>History</h4>
                                    <div class="history-list" id="history-list">
                                        <p class="no-history">There's no history yet.</p>
                                    </div>
                                    <button class="clear-history-btn" onclick="window.clearHistory()">
                                        <i class="fas fa-trash"></i> Clear all
                                    </button>
                                </div>
                                <div class="memory-panel" id="memory-panel" style="display: none;">
                                    <h4>Memory</h4>
                                    <div class="memory-list" id="memory-list">
                                        <p class="no-memory">There's nothing saved in memory.</p>
                                    </div>
                                    <button class="clear-memory-btn" onclick="window.clearMemory()">
                                        <i class="fas fa-trash"></i> Clear all
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="calculator-keypad">
                            <!-- Standard Mode Keypad -->
                            <div id="standard-keypad" class="calculator-mode-panel">
                                <!-- Memory Row -->
                                <div class="memory-row">
                                    <button class="memory-btn-key" onclick="window.memoryOperation('clear')" title="Memory Clear">MC</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('recall')" title="Memory Recall">MR</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('add')" title="Memory Add">M+</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('subtract')" title="Memory Subtract">M-</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('store')" title="Memory Store">MS</button>
                                    <button class="memory-btn-key" onclick="window.toggleMemory()" title="Memory View">M∨</button>
                                </div>
                                
                                <!-- Function Row 1 -->
                                <div class="function-row">
                                    <button class="function-btn" onclick="window.calculatePercentage()" title="Percentage">%</button>
                                    <button class="function-btn" onclick="window.clearEntry()" title="Clear Entry">CE</button>
                                    <button class="function-btn" onclick="window.clearAll()" title="Clear All">C</button>
                                    <button class="function-btn" onclick="window.backspace()" title="Backspace">
                                        <i class="fas fa-backspace"></i>
                                    </button>
                                </div>
                                
                                <!-- Function Row 2 -->
                                <div class="function-row">
                                    <button class="function-btn" onclick="window.calculateReciprocal()" title="1/x">¹⁄ₓ</button>
                                    <button class="function-btn" onclick="window.calculateSquare()" title="Square">x²</button>
                                    <button class="function-btn" onclick="window.calculateSquareRoot()" title="Square Root">²√x</button>
                                    <button class="operation-btn" onclick="window.inputOperation('÷')" title="Divide">÷</button>
                                </div>
                                
                                <!-- Number Row 1 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('7')">7</button>
                                    <button class="number-btn" onclick="window.inputNumber('8')">8</button>
                                    <button class="number-btn" onclick="window.inputNumber('9')">9</button>
                                    <button class="operation-btn" onclick="window.inputOperation('×')" title="Multiply">×</button>
                                </div>
                                
                                <!-- Number Row 2 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('4')">4</button>
                                    <button class="number-btn" onclick="window.inputNumber('5')">5</button>
                                    <button class="number-btn" onclick="window.inputNumber('6')">6</button>
                                    <button class="operation-btn" onclick="window.inputOperation('-')" title="Subtract">−</button>
                                </div>
                                
                                <!-- Number Row 3 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('1')">1</button>
                                    <button class="number-btn" onclick="window.inputNumber('2')">2</button>
                                    <button class="number-btn" onclick="window.inputNumber('3')">3</button>
                                    <button class="operation-btn" onclick="window.inputOperation('+')" title="Add">+</button>
                                </div>
                                
                                <!-- Bottom Row -->
                                <div class="bottom-row">
                                    <button class="function-btn" onclick="window.toggleSign()" title="Plus/Minus">±</button>
                                    <button class="number-btn zero-btn" onclick="window.inputNumber('0')">0</button>
                                    <button class="function-btn" onclick="window.inputDecimal()" title="Decimal">.</button>
                                    <button class="equals-btn" onclick="window.calculateResultWin()" title="Equals">=</button>
                                </div>
                            </div>

                            <!-- Scientific Mode Keypad -->
                            <div id="scientific-keypad" class="calculator-mode-panel" style="display: none;">
                                <!-- Memory Row -->
                                <div class="memory-row">
                                    <button class="memory-btn-key" onclick="window.memoryOperation('clear')" title="Memory Clear">MC</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('recall')" title="Memory Recall">MR</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('add')" title="Memory Add">M+</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('subtract')" title="Memory Subtract">M-</button>
                                    <button class="memory-btn-key" onclick="window.memoryOperation('store')" title="Memory Store">MS</button>
                                    <button class="memory-btn-key" onclick="window.toggleMemory()" title="Memory View">M∨</button>
                                </div>

                                <!-- Scientific Function Row 1 -->
                                <div class="scientific-row">
                                    <button class="function-btn" onclick="window.toggleAngleUnit()" title="Degrees/Radians" id="angle-unit-btn">DEG</button>
                                    <button class="function-btn" onclick="window.calculateFunction('factorial')" title="Factorial">n!</button>
                                    <button class="function-btn" onclick="window.inputBracket('(')" title="Open Bracket">(</button>
                                    <button class="function-btn" onclick="window.inputBracket(')')" title="Close Bracket">)</button>
                                    <button class="function-btn" onclick="window.calculatePercentage()" title="Percentage">%</button>
                                    <button class="function-btn" onclick="window.clearEntry()" title="Clear Entry">CE</button>
                                </div>

                                <!-- Scientific Function Row 2 -->
                                <div class="scientific-row">
                                    <button class="function-btn" onclick="window.calculateFunction('inv')" title="Inverse" id="inv-btn">Inv</button>
                                    <button class="function-btn" onclick="window.calculateTrig('sin')" title="Sine">sin</button>
                                    <button class="function-btn" onclick="window.calculateTrig('cos')" title="Cosine">cos</button>
                                    <button class="function-btn" onclick="window.calculateTrig('tan')" title="Tangent">tan</button>
                                    <button class="function-btn" onclick="window.calculateFunction('ln')" title="Natural Log">ln</button>
                                    <button class="function-btn" onclick="window.clearAll()" title="Clear All">C</button>
                                </div>

                                <!-- Scientific Function Row 3 -->
                                <div class="scientific-row">
                                    <button class="function-btn" onclick="window.inputConstant('π')" title="Pi">π</button>
                                    <button class="function-btn" onclick="window.calculateFunction('log')" title="Log Base 10">log</button>
                                    <button class="function-btn" onclick="window.calculateFunction('exp')" title="e^x">eˣ</button>
                                    <button class="function-btn" onclick="window.calculatePower()" title="Power">xʸ</button>
                                    <button class="function-btn" onclick="window.calculateFunction('sqrt')" title="Square Root">√x</button>
                                    <button class="function-btn" onclick="window.backspace()" title="Backspace">⌫</button>
                                </div>

                                <!-- Scientific Function Row 4 -->
                                <div class="scientific-row">
                                    <button class="function-btn" onclick="window.inputConstant('e')" title="Euler's Number">e</button>
                                    <button class="function-btn" onclick="window.calculateFunction('pow10')" title="10^x">10ˣ</button>
                                    <button class="function-btn" onclick="window.calculateSquare()" title="Square">x²</button>
                                    <button class="function-btn" onclick="window.calculateFunction('cubert')" title="Cube Root">³√x</button>
                                    <button class="function-btn" onclick="window.calculateReciprocal()" title="Reciprocal">1/x</button>
                                    <button class="operation-btn" onclick="window.inputOperation('÷')" title="Divide">÷</button>
                                </div>
                                
                                <!-- Number Row 1 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('7')">7</button>
                                    <button class="number-btn" onclick="window.inputNumber('8')">8</button>
                                    <button class="number-btn" onclick="window.inputNumber('9')">9</button>
                                    <button class="operation-btn" onclick="window.inputOperation('×')" title="Multiply">×</button>
                                </div>
                                
                                <!-- Number Row 2 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('4')">4</button>
                                    <button class="number-btn" onclick="window.inputNumber('5')">5</button>
                                    <button class="number-btn" onclick="window.inputNumber('6')">6</button>
                                    <button class="operation-btn" onclick="window.inputOperation('-')" title="Subtract">−</button>
                                </div>
                                
                                <!-- Number Row 3 -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('1')">1</button>
                                    <button class="number-btn" onclick="window.inputNumber('2')">2</button>
                                    <button class="number-btn" onclick="window.inputNumber('3')">3</button>
                                    <button class="operation-btn" onclick="window.inputOperation('+')" title="Add">+</button>
                                </div>
                                
                                <!-- Bottom Row -->
                                <div class="bottom-row">
                                    <button class="function-btn" onclick="window.toggleSign()" title="Plus/Minus">±</button>
                                    <button class="number-btn zero-btn" onclick="window.inputNumber('0')">0</button>
                                    <button class="function-btn" onclick="window.inputDecimal()" title="Decimal">.</button>
                                    <button class="equals-btn" onclick="window.calculateResultWin()" title="Equals">=</button>
                                </div>
                            </div>

                            <!-- Programmer Mode Keypad -->
                            <div id="programmer-keypad" class="calculator-mode-panel" style="display: none;">
                                <!-- Programmer Controls -->
                                <div class="programmer-controls">
                                    <div class="base-selector">
                                        <button class="base-btn active" onclick="window.switchBase('HEX')" data-base="HEX">HEX</button>
                                        <button class="base-btn" onclick="window.switchBase('DEC')" data-base="DEC">DEC</button>
                                        <button class="base-btn" onclick="window.switchBase('OCT')" data-base="OCT">OCT</button>
                                        <button class="base-btn" onclick="window.switchBase('BIN')" data-base="BIN">BIN</button>
                                    </div>
                                    <div class="bit-display" id="bit-display">
                                        <span class="bit-group">0000</span>
                                        <span class="bit-group">0000</span>
                                        <span class="bit-group">0000</span>
                                        <span class="bit-group">0000</span>
                                    </div>
                                </div>

                                <!-- Programmer Functions Row 1 -->
                                <div class="programmer-row">
                                    <button class="function-btn" onclick="window.calculateBitwise('lsh')" title="Left Shift">Lsh</button>
                                    <button class="function-btn" onclick="window.calculateBitwise('rsh')" title="Right Shift">Rsh</button>
                                    <button class="function-btn" onclick="window.calculateBitwise('or')" title="OR">Or</button>
                                    <button class="function-btn" onclick="window.calculateBitwise('xor')" title="XOR">Xor</button>
                                    <button class="function-btn" onclick="window.calculateBitwise('not')" title="NOT">Not</button>
                                    <button class="function-btn" onclick="window.calculateBitwise('and')" title="AND">And</button>
                                </div>

                                <!-- Programmer Functions Row 2 -->
                                <div class="programmer-row">
                                    <button class="function-btn" onclick="window.clearEntry()" title="Clear Entry">CE</button>
                                    <button class="function-btn" onclick="window.clearAll()" title="Clear All">C</button>
                                    <button class="function-btn" onclick="window.backspace()" title="Backspace">⌫</button>
                                    <button class="operation-btn" onclick="window.inputOperation('÷')" title="Divide">÷</button>
                                </div>

                                <!-- Hex Row -->
                                <div class="hex-row">
                                    <button class="hex-btn" onclick="window.inputNumber('A')" id="btn-A">A</button>
                                    <button class="hex-btn" onclick="window.inputNumber('B')" id="btn-B">B</button>
                                    <button class="hex-btn" onclick="window.inputNumber('C')" id="btn-C">C</button>
                                    <button class="hex-btn" onclick="window.inputNumber('D')" id="btn-D">D</button>
                                    <button class="hex-btn" onclick="window.inputNumber('E')" id="btn-E">E</button>
                                    <button class="hex-btn" onclick="window.inputNumber('F')" id="btn-F">F</button>
                                </div>
                                
                                <!-- Number Rows for Programmer Mode -->
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('7')" id="btn-7">7</button>
                                    <button class="number-btn" onclick="window.inputNumber('8')" id="btn-8">8</button>
                                    <button class="number-btn" onclick="window.inputNumber('9')" id="btn-9">9</button>
                                    <button class="operation-btn" onclick="window.inputOperation('×')" title="Multiply">×</button>
                                </div>
                                
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('4')" id="btn-4">4</button>
                                    <button class="number-btn" onclick="window.inputNumber('5')" id="btn-5">5</button>
                                    <button class="number-btn" onclick="window.inputNumber('6')" id="btn-6">6</button>
                                    <button class="operation-btn" onclick="window.inputOperation('-')" title="Subtract">−</button>
                                </div>
                                
                                <div class="number-row">
                                    <button class="number-btn" onclick="window.inputNumber('1')" id="btn-1">1</button>
                                    <button class="number-btn" onclick="window.inputNumber('2')" id="btn-2">2</button>
                                    <button class="number-btn" onclick="window.inputNumber('3')" id="btn-3">3</button>
                                    <button class="operation-btn" onclick="window.inputOperation('+')" title="Add">+</button>
                                </div>
                                
                                <div class="bottom-row">
                                    <button class="function-btn" onclick="window.toggleSign()" title="Plus/Minus">±</button>
                                    <button class="number-btn zero-btn" onclick="window.inputNumber('0')" id="btn-0">0</button>
                                    <button class="function-btn" onclick="window.inputDecimal()" title="Decimal">.</button>
                                    <button class="equals-btn" onclick="window.calculateResultWin()" title="Equals">=</button>
                                </div>
                            </div>

                            <!-- Graphing Mode Keypad -->
                            <div id="graphing-keypad" class="calculator-mode-panel" style="display: none;">
                                <div class="graphing-container">
                                    <div class="function-input-area">
                                        <input type="text" id="function-input" placeholder="Enter function: f(x) = " class="function-input">
                                        <button class="graph-btn" onclick="window.plotFunction()" title="Plot Function">Plot</button>
                                        <button class="graph-btn" onclick="window.clearGraph()" title="Clear Graph">Clear</button>
                                    </div>
                                    <canvas id="graphing-canvas" width="400" height="300"></canvas>
                                    <div class="graphing-controls">
                                        <div class="zoom-controls">
                                            <button onclick="window.zoomIn()">Zoom In</button>
                                            <button onclick="window.zoomOut()">Zoom Out</button>
                                            <button onclick="window.resetView()">Reset View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                .windows-calculator-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(145deg, #1e1e1e, #2d2d2d);
                    border-radius: 12px;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    border: 1px solid #404040;
                }
                
                .calculator-header {
                    background: linear-gradient(145deg, #2d2d2d, #3a3a3a);
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #404040;
                }
                
                .calculator-mode-selector {
                    display: flex;
                    gap: 8px;
                }
                
                .mode-btn {
                    background: linear-gradient(145deg, #404040, #505050);
                    border: none;
                    color: #ffffff;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .mode-btn i {
                    font-size: 14px;
                }
                
                .mode-btn span {
                    font-size: 12px;
                }
                
                .mode-btn.active {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    box-shadow: 0 4px 12px rgba(0, 120, 212, 0.3);
                    transform: translateY(-1px);
                }
                
                .mode-btn:hover:not(.active) {
                    background: linear-gradient(145deg, #525252, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .calculator-history-memory {
                    display: flex;
                    gap: 12px;
                }
                
                .history-btn, .memory-btn {
                    background: linear-gradient(145deg, #404040, #505050);
                    border: none;
                    color: #ffffff;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .history-btn:hover, .memory-btn:hover {
                    background: linear-gradient(145deg, #525252, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .calculator-display-section {
                    background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
                    padding: 25px;
                    text-align: right;
                    min-height: 140px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    border-bottom: 1px solid #404040;
                }
                
                .calculator-expression {
                    color: #888;
                    font-size: 18px;
                    margin-bottom: 12px;
                    min-height: 22px;
                    font-weight: 300;
                    letter-spacing: 0.5px;
                }
                
                .calculator-result {
                    color: #ffffff;
                    font-size: 52px;
                    font-weight: 200;
                    line-height: 1;
                    word-break: break-all;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                
                .calculator-body {
                    display: flex;
                    background: linear-gradient(145deg, #1e1e1e, #252525);
                }
                
                .calculator-sidebar {
                    width: 350px;
                    background: linear-gradient(145deg, #2d2d2d, #3a3a3a);
                    border-right: 1px solid #404040;
                    transition: all 0.3s ease;
                }
                
                .sidebar-content {
                    padding: 25px;
                    height: 450px;
                    overflow-y: auto;
                }
                
                .sidebar-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .sidebar-content::-webkit-scrollbar-track {
                    background: #1e1e1e;
                    border-radius: 3px;
                }
                
                .sidebar-content::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 3px;
                }
                
                .sidebar-content h4 {
                    color: #ffffff;
                    margin-bottom: 20px;
                    font-size: 20px;
                    font-weight: 300;
                }
                
                .history-list, .memory-list {
                    min-height: 320px;
                }
                
                .no-history, .no-memory {
                    color: #888;
                    text-align: center;
                    margin-top: 80px;
                    font-size: 15px;
                    font-style: italic;
                }
                
                .clear-history-btn, .clear-memory-btn {
                    background: linear-gradient(145deg, #404040, #505050);
                    border: 1px solid #555;
                    color: #ffffff;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .clear-history-btn:hover, .clear-memory-btn:hover {
                    background: linear-gradient(145deg, #525252, #606060);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .calculator-keypad {
                    flex: 1;
                    padding: 25px;
                    background: linear-gradient(145deg, #1e1e1e, #252525);
                }
                
                .memory-row, .function-row, .number-row, .bottom-row {
                    display: grid;
                    gap: 4px;
                    margin-bottom: 4px;
                }
                
                .scientific-row, .programmer-row, .hex-row {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 4px;
                    margin-bottom: 4px;
                }
                
                .memory-row {
                    grid-template-columns: repeat(6, 1fr);
                    margin-bottom: 8px;
                }
                
                .function-row, .number-row {
                    grid-template-columns: repeat(4, 1fr);
                }
                
                .bottom-row {
                    grid-template-columns: 1fr 2fr 1fr 1fr;
                }
                
                .calculator-mode-panel {
                    transition: all 0.3s ease;
                }
                
                .memory-btn-key, .function-btn, .number-btn, .operation-btn, .equals-btn {
                    height: 65px;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    position: relative;
                    overflow: hidden;
                }
                
                .memory-btn-key {
                    background: linear-gradient(145deg, #323232, #404040);
                    color: #ffffff;
                    font-size: 14px;
                }
                
                .function-btn {
                    background: linear-gradient(145deg, #323232, #404040);
                    color: #ffffff;
                }
                
                .number-btn {
                    background: linear-gradient(145deg, #404040, #525252);
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: 300;
                }
                
                .operation-btn {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    color: #ffffff;
                    font-size: 20px;
                }
                
                .equals-btn {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    color: #ffffff;
                    font-size: 22px;
                    font-weight: 600;
                }
                
                .memory-btn-key:hover {
                    background: linear-gradient(145deg, #505050, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .function-btn:hover {
                    background: linear-gradient(145deg, #505050, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .number-btn:hover {
                    background: linear-gradient(145deg, #525252, #656565);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .operation-btn:hover {
                    background: linear-gradient(145deg, #106ebe, #1e88e5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 120, 212, 0.4);
                }
                
                .equals-btn:hover {
                    background: linear-gradient(145deg, #106ebe, #1e88e5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 120, 212, 0.4);
                }
                
                .memory-btn-key:active, .function-btn:active, .number-btn:active, .operation-btn:active {
                    transform: translateY(0px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .equals-btn:active {
                    transform: translateY(0px);
                    box-shadow: 0 2px 8px rgba(0, 120, 212, 0.3);
                }
                
                .zero-btn {
                    grid-column: span 1;
                }
                
                .history-item, .memory-item {
                    background: linear-gradient(145deg, #404040, #525252);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .history-item:hover, .memory-item:hover {
                    background: linear-gradient(145deg, #525252, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .history-expression {
                    font-size: 14px;
                    color: #ccc;
                    margin-bottom: 6px;
                    font-weight: 300;
                }
                
                .history-result {
                    font-size: 20px;
                    font-weight: 500;
                }
                
                /* Programmer Mode Styles */
                .programmer-controls {
                    margin-bottom: 20px;
                    padding: 20px;
                    background: linear-gradient(145deg, #2d2d2d, #3a3a3a);
                    border-radius: 10px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }
                
                .base-selector {
                    display: flex;
                    gap: 6px;
                    margin-bottom: 18px;
                }
                
                .base-btn {
                    background: linear-gradient(145deg, #404040, #525252);
                    border: none;
                    color: #ffffff;
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    flex: 1;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .base-btn.active {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    color: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 120, 212, 0.4);
                }
                
                .base-btn:hover:not(.active) {
                    background: linear-gradient(145deg, #525252, #656565);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .bit-display {
                    display: flex;
                    gap: 10px;
                    font-family: 'Courier New', monospace;
                    font-size: 18px;
                    font-weight: bold;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #404040;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                }
                
                .bit-group {
                    color: #0078d4;
                    letter-spacing: 3px;
                    text-shadow: 0 0 8px rgba(0, 120, 212, 0.3);
                }
                
                .hex-btn {
                    background: linear-gradient(145deg, #323232, #404040);
                    border: none;
                    color: #ffffff;
                    height: 65px;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .hex-btn:hover {
                    background: linear-gradient(145deg, #505050, #606060);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                .hex-btn:active {
                    transform: translateY(0px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .hex-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                /* Scientific Mode Styles */
                .function-btn.active {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    color: #ffffff;
                    box-shadow: 0 4px 16px rgba(0, 120, 212, 0.4);
                    transform: translateY(-1px);
                }
                
                /* Graphing Mode Styles */
                .graphing-container {
                    padding: 25px;
                    background: linear-gradient(145deg, #2d2d2d, #3a3a3a);
                    border-radius: 10px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }
                
                .function-input-area {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                    align-items: center;
                }
                
                .function-input {
                    flex: 1;
                    background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
                    border: 1px solid #404040;
                    color: #ffffff;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 16px;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }
                
                .function-input:focus {
                    outline: none;
                    border-color: #0078d4;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(0, 120, 212, 0.3);
                }
                
                .graph-btn {
                    background: linear-gradient(145deg, #0078d4, #106ebe);
                    border: none;
                    color: #ffffff;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 120, 212, 0.3);
                }
                
                .graph-btn:hover {
                    background: linear-gradient(145deg, #106ebe, #1e88e5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 120, 212, 0.4);
                }
                
                #graphing-canvas {
                    border: 1px solid #404040;
                    border-radius: 8px;
                    background: linear-gradient(145deg, #1e1e1e, #252525);
                    display: block;
                    margin: 0 auto 20px;
                    box-shadow: inset 0 2px 16px rgba(0, 0, 0, 0.3);
                }
                
                .graphing-controls {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                
                .zoom-controls button {
                    background: linear-gradient(145deg, #404040, #525252);
                    border: none;
                    color: #ffffff;
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .zoom-controls button:hover {
                    background: linear-gradient(145deg, #525252, #656565);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                
                @media (max-width: 768px) {
                    .windows-calculator-container {
                        max-width: 95%;
                        margin: 10px auto;
                    }
                    
                    .calculator-header {
                        flex-direction: column;
                        gap: 15px;
                        padding: 20px;
                    }
                    
                    .calculator-mode-selector {
                        width: 100%;
                        justify-content: space-between;
                    }
                    
                    .mode-btn {
                        flex: 1;
                        padding: 12px 8px;
                    }
                    
                    .mode-btn span {
                        display: none;
                    }
                    
                    .mode-btn i {
                        font-size: 16px;
                    }
                    
                    .calculator-body {
                        flex-direction: column;
                    }
                    
                    .calculator-sidebar {
                        width: 100%;
                        border-right: none;
                        border-top: 1px solid #404040;
                    }
                    
                    .sidebar-content {
                        height: 300px;
                    }
                    
                    .calculator-result {
                        font-size: 42px;
                    }
                    
                    .calculator-expression {
                        font-size: 16px;
                    }
                    
                    .memory-btn-key, .function-btn, .number-btn, .operation-btn, .equals-btn, .hex-btn {
                        height: 55px;
                        font-size: 16px;
                    }
                    
                    .number-btn {
                        font-size: 22px;
                    }
                    
                    .calculator-keypad {
                        padding: 20px;
                    }
                    
                    .bit-display {
                        font-size: 16px;
                        gap: 8px;
                        padding: 12px;
                    }
                    
                    .bit-group {
                        letter-spacing: 2px;
                    }
                    
                    .function-input-area {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .graph-btn {
                        width: 100%;
                        padding: 15px;
                    }
                    
                    #graphing-canvas {
                        width: 100%;
                        height: 250px;
                    }
                    
                    .zoom-controls {
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    
                    .zoom-controls button {
                        flex: 1;
                        min-width: 80px;
                    }
                }
                
                @media (max-width: 480px) {
                    .calculator-display-section {
                        padding: 20px;
                        min-height: 120px;
                    }
                    
                    .calculator-result {
                        font-size: 36px;
                    }
                    
                    .memory-btn-key, .function-btn, .number-btn, .operation-btn, .equals-btn, .hex-btn {
                        height: 50px;
                        font-size: 14px;
                    }
                    
                    .number-btn {
                        font-size: 20px;
                    }
                    
                    .calculator-keypad {
                        padding: 15px;
                    }
                    
                    .memory-row, .function-row, .number-row, .bottom-row, .scientific-row, .programmer-row, .hex-row {
                        gap: 3px;
                        margin-bottom: 3px;
                    }
                }
                </style>
            `;
        }
    },

    'binary-calculator': {
        title: 'Binary & Base Conversion',
        icon: 'fas fa-binary',
        inputs: [
            { id: 'operation', label: 'Operation', type: 'select', 
              options: ['Decimal to Binary', 'Binary to Decimal', 'Decimal to Hex', 'Hex to Decimal', 'Binary Addition', 'Binary Subtraction'] },
            { id: 'input1', label: 'Input 1', type: 'text', placeholder: 'Enter first number' },
            { id: 'input2', label: 'Input 2 (if needed)', type: 'text', placeholder: 'Enter second number' }
        ],
        calculate: function(inputs) {
            const input1 = inputs.input1 || '';
            const input2 = inputs.input2 || '';
            
            switch(inputs.operation) {
                case 'Decimal to Binary':
                    const decimal = parseInt(input1);
                    if (isNaN(decimal)) return 'Error: Please enter a valid decimal number';
                    const binary = decimal.toString(2);
                    return `Decimal: ${decimal}\nBinary: ${binary}\nVerification: ${parseInt(binary, 2)}`;
                
                case 'Binary to Decimal':
                    if (!/^[01]+$/.test(input1)) return 'Error: Please enter a valid binary number (only 0s and 1s)';
                    const decimalResult = parseInt(input1, 2);
                    return `Binary: ${input1}\nDecimal: ${decimalResult}\nVerification: ${decimalResult.toString(2)}`;
                
                case 'Decimal to Hex':
                    const decimalHex = parseInt(input1);
                    if (isNaN(decimalHex)) return 'Error: Please enter a valid decimal number';
                    const hex = decimalHex.toString(16).toUpperCase();
                    return `Decimal: ${decimalHex}\nHexadecimal: ${hex}\nVerification: ${parseInt(hex, 16)}`;
                
                case 'Hex to Decimal':
                    if (!/^[0-9A-Fa-f]+$/.test(input1)) return 'Error: Please enter a valid hexadecimal number';
                    const decimalFromHex = parseInt(input1, 16);
                    return `Hexadecimal: ${input1.toUpperCase()}\nDecimal: ${decimalFromHex}\nVerification: ${decimalFromHex.toString(16).toUpperCase()}`;
                
                case 'Binary Addition':
                    if (!/^[01]+$/.test(input1) || !/^[01]+$/.test(input2)) return 'Error: Please enter valid binary numbers';
                    const sum = (parseInt(input1, 2) + parseInt(input2, 2)).toString(2);
                    return `${input1} + ${input2} = ${sum}\nDecimal verification: ${parseInt(input1, 2)} + ${parseInt(input2, 2)} = ${parseInt(sum, 2)}`;
                
                case 'Binary Subtraction':
                    if (!/^[01]+$/.test(input1) || !/^[01]+$/.test(input2)) return 'Error: Please enter valid binary numbers';
                    const diff = (parseInt(input1, 2) - parseInt(input2, 2)).toString(2);
                    return `${input1} - ${input2} = ${diff}\nDecimal verification: ${parseInt(input1, 2)} - ${parseInt(input2, 2)} = ${parseInt(diff, 2)}`;
                
                default:
                    return 'Please select an operation';
            }
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

    // 15 New Advanced Cryptocurrency Calculators
    'crypto-yield-farming': {
        title: 'Yield Farming Calculator',
        icon: 'fas fa-seedling',
        inputs: [
            { id: 'lpTokens', label: 'LP Tokens Amount', type: 'number', placeholder: 'Enter LP tokens amount', step: '0.000001' },
            { id: 'apy', label: 'Farm APY (%)', type: 'number', placeholder: 'Enter farm APY', step: '0.01' },
            { id: 'rewardTokenPrice', label: 'Reward Token Price ($)', type: 'number', placeholder: 'Enter reward token price', step: '0.000001' },
            { id: 'period', label: 'Farming Period (days)', type: 'number', placeholder: 'Enter farming period' }
        ],
        calculate: function(inputs) {
            const lpTokens = parseFloat(inputs.lpTokens) || 0;
            const apy = parseFloat(inputs.apy) || 0;
            const rewardTokenPrice = parseFloat(inputs.rewardTokenPrice) || 0;
            const period = parseFloat(inputs.period) || 0;
            
            const dailyApy = apy / 365;
            const dailyRewards = lpTokens * (dailyApy / 100);
            const totalRewards = dailyRewards * period;
            const rewardValue = totalRewards * rewardTokenPrice;
            
            return `Daily Rewards: ${dailyRewards.toFixed(6)} tokens
Total Rewards (${period} days): ${totalRewards.toFixed(6)} tokens
USD Value: $${rewardValue.toFixed(2)}
Annual Projection: ${(dailyRewards * 365).toFixed(6)} tokens`;
        }
    },

    'crypto-bridge-fees': {
        title: 'Cross-Chain Bridge Fee Calculator',
        icon: 'fas fa-bridge',
        inputs: [
            { id: 'amount', label: 'Bridge Amount', type: 'number', placeholder: 'Enter amount to bridge', step: '0.000001' },
            { id: 'tokenPrice', label: 'Token Price ($)', type: 'number', placeholder: 'Enter token price', step: '0.000001' },
            { id: 'bridgeFee', label: 'Bridge Fee (%)', type: 'number', placeholder: 'Enter bridge fee percentage', step: '0.01' },
            { id: 'gasFee', label: 'Gas Fee ($)', type: 'number', placeholder: 'Enter gas fee', step: '0.01' }
        ],
        calculate: function(inputs) {
            const amount = parseFloat(inputs.amount) || 0;
            const tokenPrice = parseFloat(inputs.tokenPrice) || 0;
            const bridgeFee = parseFloat(inputs.bridgeFee) || 0;
            const gasFee = parseFloat(inputs.gasFee) || 0;
            
            const totalValue = amount * tokenPrice;
            const bridgeFeeAmount = (totalValue * bridgeFee) / 100;
            const totalFees = bridgeFeeAmount + gasFee;
            const finalAmount = amount - (bridgeFeeAmount / tokenPrice);
            
            return `Bridge Amount: ${amount.toFixed(6)} tokens
Total Value: $${totalValue.toFixed(2)}
Bridge Fee: $${bridgeFeeAmount.toFixed(2)}
Gas Fee: $${gasFee.toFixed(2)}
Total Fees: $${totalFees.toFixed(2)}
Amount Received: ${finalAmount.toFixed(6)} tokens`;
        }
    },

    'crypto-tax-calculator': {
        title: 'Crypto Tax Calculator',
        icon: 'fas fa-receipt',
        inputs: [
            { id: 'shortTermGains', label: 'Short-term Gains ($)', type: 'number', placeholder: 'Enter short-term gains' },
            { id: 'longTermGains', label: 'Long-term Gains ($)', type: 'number', placeholder: 'Enter long-term gains' },
            { id: 'income', label: 'Annual Income ($)', type: 'number', placeholder: 'Enter annual income' },
            { id: 'filingStatus', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] }
        ],
        calculate: function(inputs) {
            const shortTerm = parseFloat(inputs.shortTermGains) || 0;
            const longTerm = parseFloat(inputs.longTermGains) || 0;
            const income = parseFloat(inputs.income) || 0;
            
            // Simplified tax brackets (2024)
            let shortTermRate = 0.22; // Average rate for demonstration
            let longTermRate = 0.15;  // Average rate for demonstration
            
            if (income < 40000) {
                shortTermRate = 0.12;
                longTermRate = 0;
            } else if (income < 85000) {
                shortTermRate = 0.22;
                longTermRate = 0.15;
            } else {
                shortTermRate = 0.32;
                longTermRate = 0.20;
            }
            
            const shortTermTax = shortTerm * shortTermRate;
            const longTermTax = longTerm * longTermRate;
            const totalTax = shortTermTax + longTermTax;
            
            return `Short-term Capital Gains Tax: $${shortTermTax.toFixed(2)}
Long-term Capital Gains Tax: $${longTermTax.toFixed(2)}
Total Tax Liability: $${totalTax.toFixed(2)}
Effective Tax Rate: ${((totalTax / (shortTerm + longTerm)) * 100).toFixed(2)}%
Note: This is a simplified calculation. Consult a tax professional.`;
        }
    },

    'crypto-hodl-calculator': {
        title: 'HODL Strategy Calculator',
        icon: 'fas fa-hand-holding',
        inputs: [
            { id: 'initialInvestment', label: 'Initial Investment ($)', type: 'number', placeholder: 'Enter initial investment' },
            { id: 'initialPrice', label: 'Initial Crypto Price ($)', type: 'number', placeholder: 'Enter initial price', step: '0.000001' },
            { id: 'currentPrice', label: 'Current Crypto Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'holdingPeriod', label: 'Holding Period (months)', type: 'number', placeholder: 'Enter holding period' }
        ],
        calculate: function(inputs) {
            const initialInvestment = parseFloat(inputs.initialInvestment) || 0;
            const initialPrice = parseFloat(inputs.initialPrice) || 0;
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const holdingPeriod = parseFloat(inputs.holdingPeriod) || 0;
            
            const cryptoAmount = initialInvestment / initialPrice;
            const currentValue = cryptoAmount * currentPrice;
            const totalGain = currentValue - initialInvestment;
            const percentageGain = ((totalGain / initialInvestment) * 100);
            const annualizedReturn = (Math.pow(currentValue / initialInvestment, 12 / holdingPeriod) - 1) * 100;
            
            return `Crypto Amount: ${cryptoAmount.toFixed(6)}
Current Portfolio Value: $${currentValue.toFixed(2)}
Total Gain/Loss: $${totalGain.toFixed(2)}
Percentage Gain/Loss: ${percentageGain.toFixed(2)}%
Annualized Return: ${annualizedReturn.toFixed(2)}%
Return Multiple: ${(currentValue / initialInvestment).toFixed(2)}x`;
        }
    },

    'crypto-rainbow-chart': {
        title: 'Rainbow Chart Price Bands',
        icon: 'fas fa-rainbow',
        inputs: [
            { id: 'currentPrice', label: 'Current BTC Price ($)', type: 'number', placeholder: 'Enter current BTC price' },
            { id: 'movingAverage', label: '200-Day Moving Average ($)', type: 'number', placeholder: 'Enter 200-day MA' },
            { id: 'regressionBase', label: 'Regression Base Price ($)', type: 'number', placeholder: 'Enter regression base' }
        ],
        calculate: function(inputs) {
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const ma200 = parseFloat(inputs.movingAverage) || 0;
            const regression = parseFloat(inputs.regressionBase) || 0;
            
            // Rainbow chart bands (simplified calculation)
            const bands = {
                'Fire Sale': regression * 0.5,
                'Buy': regression * 0.75,
                'Accumulate': regression * 1.0,
                'Still Cheap': regression * 1.5,
                'HODL': regression * 2.0,
                'Is This A Bubble?': regression * 3.0,
                'FOMO Intensifies': regression * 4.0,
                'Sell. Seriously, SELL!': regression * 5.0,
                'Maximum Bubble Territory': regression * 6.0
            };
            
            let currentBand = 'Unknown';
            for (const [band, price] of Object.entries(bands)) {
                if (currentPrice <= price) {
                    currentBand = band;
                    break;
                }
            }
            
            return `Current Price Band: ${currentBand}
Fire Sale: $${bands['Fire Sale'].toFixed(0)}
Buy Zone: $${bands['Buy'].toFixed(0)}
Accumulate: $${bands['Accumulate'].toFixed(0)}
Still Cheap: $${bands['Still Cheap'].toFixed(0)}
HODL Zone: $${bands['HODL'].toFixed(0)}
Bubble Territory: $${bands['Is This A Bubble?'].toFixed(0)}
Maximum Bubble: $${bands['Maximum Bubble Territory'].toFixed(0)}`;
        }
    },

    'crypto-fear-greed': {
        title: 'Fear & Greed Index Calculator',
        icon: 'fas fa-chart-pie',
        inputs: [
            { id: 'volatility', label: 'Volatility Score (0-100)', type: 'number', placeholder: 'Enter volatility score', min: '0', max: '100' },
            { id: 'volume', label: 'Volume Score (0-100)', type: 'number', placeholder: 'Enter volume score', min: '0', max: '100' },
            { id: 'momentum', label: 'Momentum Score (0-100)', type: 'number', placeholder: 'Enter momentum score', min: '0', max: '100' },
            { id: 'social', label: 'Social Media Score (0-100)', type: 'number', placeholder: 'Enter social sentiment', min: '0', max: '100' }
        ],
        calculate: function(inputs) {
            const volatility = parseFloat(inputs.volatility) || 0;
            const volume = parseFloat(inputs.volume) || 0;
            const momentum = parseFloat(inputs.momentum) || 0;
            const social = parseFloat(inputs.social) || 0;
            
            const fearGreedIndex = (volatility + volume + momentum + social) / 4;
            
            let sentiment, color, action;
            if (fearGreedIndex <= 25) {
                sentiment = 'Extreme Fear';
                color = 'Red';
                action = 'Excellent buying opportunity';
            } else if (fearGreedIndex <= 45) {
                sentiment = 'Fear';
                color = 'Orange';
                action = 'Good time to buy';
            } else if (fearGreedIndex <= 55) {
                sentiment = 'Neutral';
                color = 'Yellow';
                action = 'Wait and watch';
            } else if (fearGreedIndex <= 75) {
                sentiment = 'Greed';
                color = 'Light Green';
                action = 'Consider taking profits';
            } else {
                sentiment = 'Extreme Greed';
                color = 'Green';
                action = 'Time to sell/take profits';
            }
            
            return `Fear & Greed Index: ${fearGreedIndex.toFixed(0)}
Market Sentiment: ${sentiment}
Signal Color: ${color}
Recommended Action: ${action}
Volatility Component: ${volatility}
Volume Component: ${volume}
Momentum Component: ${momentum}
Social Media Component: ${social}`;
        }
    },

    'crypto-hash-rate': {
        title: 'Network Hash Rate Calculator',
        icon: 'fas fa-server',
        inputs: [
            { id: 'difficulty', label: 'Network Difficulty', type: 'number', placeholder: 'Enter network difficulty' },
            { id: 'blockTime', label: 'Block Time (seconds)', type: 'number', placeholder: 'Enter target block time' },
            { id: 'hashRateUnit', label: 'Hash Rate Unit', type: 'select', options: ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'] }
        ],
        calculate: function(inputs) {
            const difficulty = parseFloat(inputs.difficulty) || 0;
            const blockTime = parseFloat(inputs.blockTime) || 600; // Default 10 minutes for Bitcoin
            const unit = inputs.hashRateUnit || 'TH/s';
            
            // Calculate network hash rate (simplified)
            const hashRate = difficulty * (Math.pow(2, 32)) / blockTime;
            
            const units = {
                'H/s': 1,
                'KH/s': 1000,
                'MH/s': 1000000,
                'GH/s': 1000000000,
                'TH/s': 1000000000000,
                'PH/s': 1000000000000000,
                'EH/s': 1000000000000000000
            };
            
            const convertedHashRate = hashRate / units[unit];
            const securityLevel = hashRate > 100000000000000 ? 'Very High' : hashRate > 10000000000000 ? 'High' : 'Moderate';
            
            return `Network Hash Rate: ${convertedHashRate.toFixed(2)} ${unit}
Raw Hash Rate: ${hashRate.toExponential(2)} H/s
Security Level: ${securityLevel}
Difficulty: ${difficulty.toLocaleString()}
Block Time: ${blockTime} seconds`;
        }
    },

    'crypto-whale-tracker': {
        title: 'Whale Movement Impact Calculator',
        icon: 'fas fa-fish',
        inputs: [
            { id: 'whaleAmount', label: 'Whale Transaction Amount', type: 'number', placeholder: 'Enter whale transaction size' },
            { id: 'marketCap', label: 'Market Cap ($)', type: 'number', placeholder: 'Enter current market cap' },
            { id: 'dailyVolume', label: 'Daily Volume ($)', type: 'number', placeholder: 'Enter daily trading volume' },
            { id: 'transactionType', label: 'Transaction Type', type: 'select', options: ['Buy', 'Sell', 'Transfer'] }
        ],
        calculate: function(inputs) {
            const whaleAmount = parseFloat(inputs.whaleAmount) || 0;
            const marketCap = parseFloat(inputs.marketCap) || 0;
            const dailyVolume = parseFloat(inputs.dailyVolume) || 0;
            const transactionType = inputs.transactionType || 'Transfer';
            
            const percentOfMarketCap = (whaleAmount / marketCap) * 100;
            const percentOfVolume = (whaleAmount / dailyVolume) * 100;
            
            let impact, priceEffect;
            if (percentOfVolume > 10) {
                impact = 'Very High';
                priceEffect = transactionType === 'Buy' ? '+5% to +15%' : transactionType === 'Sell' ? '-5% to -15%' : 'Neutral';
            } else if (percentOfVolume > 5) {
                impact = 'High';
                priceEffect = transactionType === 'Buy' ? '+2% to +5%' : transactionType === 'Sell' ? '-2% to -5%' : 'Neutral';
            } else if (percentOfVolume > 1) {
                impact = 'Moderate';
                priceEffect = transactionType === 'Buy' ? '+0.5% to +2%' : transactionType === 'Sell' ? '-0.5% to -2%' : 'Neutral';
            } else {
                impact = 'Low';
                priceEffect = 'Minimal';
            }
            
            return `Transaction Impact: ${impact}
% of Market Cap: ${percentOfMarketCap.toFixed(4)}%
% of Daily Volume: ${percentOfVolume.toFixed(2)}%
Expected Price Effect: ${priceEffect}
Transaction Type: ${transactionType}
Whale Amount: $${whaleAmount.toLocaleString()}`;
        }
    },

    'crypto-flash-loan': {
        title: 'Flash Loan Arbitrage Calculator',
        icon: 'fas fa-bolt',
        inputs: [
            { id: 'loanAmount', label: 'Flash Loan Amount ($)', type: 'number', placeholder: 'Enter loan amount' },
            { id: 'priceDifference', label: 'Price Difference (%)', type: 'number', placeholder: 'Enter price difference', step: '0.01' },
            { id: 'flashLoanFee', label: 'Flash Loan Fee (%)', type: 'number', placeholder: 'Enter flash loan fee', step: '0.01' },
            { id: 'gasCost', label: 'Gas Cost ($)', type: 'number', placeholder: 'Enter estimated gas cost' }
        ],
        calculate: function(inputs) {
            const loanAmount = parseFloat(inputs.loanAmount) || 0;
            const priceDifference = parseFloat(inputs.priceDifference) || 0;
            const flashLoanFee = parseFloat(inputs.flashLoanFee) || 0;
            const gasCost = parseFloat(inputs.gasCost) || 0;
            
            const grossProfit = loanAmount * (priceDifference / 100);
            const loanFee = loanAmount * (flashLoanFee / 100);
            const netProfit = grossProfit - loanFee - gasCost;
            const roi = (netProfit / loanAmount) * 100;
            const profitability = netProfit > 0 ? 'Profitable' : 'Not Profitable';
            
            return `Gross Profit: $${grossProfit.toFixed(2)}
Flash Loan Fee: $${loanFee.toFixed(2)}
Gas Cost: $${gasCost.toFixed(2)}
Net Profit: $${netProfit.toFixed(2)}
ROI: ${roi.toFixed(4)}%
Status: ${profitability}
Break-even Price Diff: ${((loanFee + gasCost) / loanAmount * 100).toFixed(4)}%`;
        }
    },

    'crypto-liquidity-pool': {
        title: 'Liquidity Pool Returns Calculator',
        icon: 'fas fa-water',
        inputs: [
            { id: 'token1Amount', label: 'Token 1 Amount', type: 'number', placeholder: 'Enter token 1 amount', step: '0.000001' },
            { id: 'token2Amount', label: 'Token 2 Amount', type: 'number', placeholder: 'Enter token 2 amount', step: '0.000001' },
            { id: 'token1Price', label: 'Token 1 Price ($)', type: 'number', placeholder: 'Enter token 1 price', step: '0.000001' },
            { id: 'token2Price', label: 'Token 2 Price ($)', type: 'number', placeholder: 'Enter token 2 price', step: '0.000001' },
            { id: 'tradingFeeApr', label: 'Trading Fee APR (%)', type: 'number', placeholder: 'Enter trading fee APR', step: '0.01' }
        ],
        calculate: function(inputs) {
            const token1Amount = parseFloat(inputs.token1Amount) || 0;
            const token2Amount = parseFloat(inputs.token2Amount) || 0;
            const token1Price = parseFloat(inputs.token1Price) || 0;
            const token2Price = parseFloat(inputs.token2Price) || 0;
            const tradingFeeApr = parseFloat(inputs.tradingFeeApr) || 0;
            
            const token1Value = token1Amount * token1Price;
            const token2Value = token2Amount * token2Price;
            const totalLiquidity = token1Value + token2Value;
            
            const dailyFeeReturn = (totalLiquidity * tradingFeeApr) / 365 / 100;
            const monthlyFeeReturn = dailyFeeReturn * 30;
            const yearlyFeeReturn = dailyFeeReturn * 365;
            
            return `Total Liquidity: $${totalLiquidity.toFixed(2)}
Token 1 Value: $${token1Value.toFixed(2)}
Token 2 Value: $${token2Value.toFixed(2)}
Daily Fee Returns: $${dailyFeeReturn.toFixed(2)}
Monthly Fee Returns: $${monthlyFeeReturn.toFixed(2)}
Yearly Fee Returns: $${yearlyFeeReturn.toFixed(2)}
Effective APR: ${tradingFeeApr.toFixed(2)}%`;
        }
    },

    'crypto-options-pricing': {
        title: 'Crypto Options Pricing Calculator',
        icon: 'fas fa-chart-bar',
        inputs: [
            { id: 'spotPrice', label: 'Current Spot Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.01' },
            { id: 'strikePrice', label: 'Strike Price ($)', type: 'number', placeholder: 'Enter strike price', step: '0.01' },
            { id: 'timeToExpiry', label: 'Days to Expiry', type: 'number', placeholder: 'Enter days to expiry' },
            { id: 'volatility', label: 'Implied Volatility (%)', type: 'number', placeholder: 'Enter volatility', step: '0.1' },
            { id: 'optionType', label: 'Option Type', type: 'select', options: ['Call', 'Put'] }
        ],
        calculate: function(inputs) {
            const spotPrice = parseFloat(inputs.spotPrice) || 0;
            const strikePrice = parseFloat(inputs.strikePrice) || 0;
            const timeToExpiry = parseFloat(inputs.timeToExpiry) || 0;
            const volatility = parseFloat(inputs.volatility) || 0;
            const optionType = inputs.optionType || 'Call';
            
            // Simplified Black-Scholes approximation
            const timeInYears = timeToExpiry / 365;
            const moneyness = spotPrice / strikePrice;
            const volEffect = volatility / 100 * Math.sqrt(timeInYears);
            
            let intrinsicValue, timeValue, totalValue;
            
            if (optionType === 'Call') {
                intrinsicValue = Math.max(0, spotPrice - strikePrice);
                timeValue = spotPrice * volEffect * 0.4; // Simplified calculation
            } else {
                intrinsicValue = Math.max(0, strikePrice - spotPrice);
                timeValue = strikePrice * volEffect * 0.4; // Simplified calculation
            }
            
            totalValue = intrinsicValue + timeValue;
            const delta = optionType === 'Call' ? 0.5 + (moneyness - 1) * 0.3 : -0.5 + (1 - moneyness) * 0.3;
            
            return `Option Value: $${totalValue.toFixed(2)}
Intrinsic Value: $${intrinsicValue.toFixed(2)}
Time Value: $${timeValue.toFixed(2)}
Moneyness: ${(moneyness * 100).toFixed(1)}%
Estimated Delta: ${delta.toFixed(3)}
Time Decay per Day: $${(timeValue / timeToExpiry).toFixed(3)}
Note: This is a simplified calculation`;
        }
    },

    'crypto-defi-yield': {
        title: 'DeFi Yield Optimization Calculator',
        icon: 'fas fa-chart-area',
        inputs: [
            { id: 'principal', label: 'Principal Amount ($)', type: 'number', placeholder: 'Enter principal amount' },
            { id: 'protocol1Apy', label: 'Protocol 1 APY (%)', type: 'number', placeholder: 'Enter protocol 1 APY', step: '0.01' },
            { id: 'protocol2Apy', label: 'Protocol 2 APY (%)', type: 'number', placeholder: 'Enter protocol 2 APY', step: '0.01' },
            { id: 'protocol3Apy', label: 'Protocol 3 APY (%)', type: 'number', placeholder: 'Enter protocol 3 APY', step: '0.01' },
            { id: 'gasCost', label: 'Gas Cost per Transaction ($)', type: 'number', placeholder: 'Enter gas cost per move' }
        ],
        calculate: function(inputs) {
            const principal = parseFloat(inputs.principal) || 0;
            const apy1 = parseFloat(inputs.protocol1Apy) || 0;
            const apy2 = parseFloat(inputs.protocol2Apy) || 0;
            const apy3 = parseFloat(inputs.protocol3Apy) || 0;
            const gasCost = parseFloat(inputs.gasCost) || 0;
            
            const protocols = [
                { name: 'Protocol 1', apy: apy1 },
                { name: 'Protocol 2', apy: apy2 },
                { name: 'Protocol 3', apy: apy3 }
            ].sort((a, b) => b.apy - a.apy);
            
            const bestProtocol = protocols[0];
            const dailyReturn = (principal * bestProtocol.apy) / 365 / 100;
            const monthlyReturn = dailyReturn * 30;
            const yearlyReturn = dailyReturn * 365;
            
            const switchingBenefit = (principal * (bestProtocol.apy - protocols[1].apy)) / 100;
            const switchingProfitable = switchingBenefit > gasCost;
            
            return `Optimal Protocol: ${bestProtocol.name}
Best APY: ${bestProtocol.apy.toFixed(2)}%
Daily Returns: $${dailyReturn.toFixed(2)}
Monthly Returns: $${monthlyReturn.toFixed(2)}
Yearly Returns: $${yearlyReturn.toFixed(2)}
Switching Benefit: $${switchingBenefit.toFixed(2)}
Gas Cost: $${gasCost.toFixed(2)}
Switching Profitable: ${switchingProfitable ? 'Yes' : 'No'}`;
        }
    },

    'crypto-nft-valuation': {
        title: 'NFT Valuation Calculator',
        icon: 'fas fa-palette',
        inputs: [
            { id: 'floorPrice', label: 'Collection Floor Price (ETH)', type: 'number', placeholder: 'Enter floor price', step: '0.001' },
            { id: 'rarity', label: 'Rarity Rank', type: 'number', placeholder: 'Enter rarity rank' },
            { id: 'totalSupply', label: 'Total Supply', type: 'number', placeholder: 'Enter total supply' },
            { id: 'volume', label: '30-Day Volume (ETH)', type: 'number', placeholder: 'Enter 30-day volume' },
            { id: 'ethPrice', label: 'ETH Price ($)', type: 'number', placeholder: 'Enter ETH price' }
        ],
        calculate: function(inputs) {
            const floorPrice = parseFloat(inputs.floorPrice) || 0;
            const rarity = parseFloat(inputs.rarity) || 0;
            const totalSupply = parseFloat(inputs.totalSupply) || 0;
            const volume = parseFloat(inputs.volume) || 0;
            const ethPrice = parseFloat(inputs.ethPrice) || 0;
            
            const rarityPercentage = (rarity / totalSupply) * 100;
            let rarityMultiplier = 1;
            
            if (rarityPercentage <= 1) rarityMultiplier = 3.0;
            else if (rarityPercentage <= 5) rarityMultiplier = 2.0;
            else if (rarityPercentage <= 10) rarityMultiplier = 1.5;
            else if (rarityPercentage <= 25) rarityMultiplier = 1.2;
            
            const volumeMultiplier = volume > 100 ? 1.3 : volume > 50 ? 1.2 : volume > 10 ? 1.1 : 1.0;
            
            const estimatedValue = floorPrice * rarityMultiplier * volumeMultiplier;
            const usdValue = estimatedValue * ethPrice;
            
            return `Estimated NFT Value: ${estimatedValue.toFixed(3)} ETH
USD Value: $${usdValue.toFixed(2)}
Rarity Rank: ${rarity} / ${totalSupply}
Rarity Percentile: Top ${rarityPercentage.toFixed(1)}%
Rarity Multiplier: ${rarityMultiplier}x
Volume Multiplier: ${volumeMultiplier}x
Floor Price: ${floorPrice} ETH`;
        }
    },

    'crypto-gas-optimizer': {
        title: 'Gas Fee Optimizer',
        icon: 'fas fa-gas-pump',
        inputs: [
            { id: 'gasLimit', label: 'Gas Limit', type: 'number', placeholder: 'Enter gas limit' },
            { id: 'baseFee', label: 'Base Fee (Gwei)', type: 'number', placeholder: 'Enter base fee' },
            { id: 'priorityFee', label: 'Priority Fee (Gwei)', type: 'number', placeholder: 'Enter priority fee' },
            { id: 'ethPrice', label: 'ETH Price ($)', type: 'number', placeholder: 'Enter ETH price' },
            { id: 'urgency', label: 'Transaction Urgency', type: 'select', options: ['Low', 'Standard', 'Fast', 'Rapid'] }
        ],
        calculate: function(inputs) {
            const gasLimit = parseFloat(inputs.gasLimit) || 21000;
            const baseFee = parseFloat(inputs.baseFee) || 0;
            const priorityFee = parseFloat(inputs.priorityFee) || 0;
            const ethPrice = parseFloat(inputs.ethPrice) || 0;
            const urgency = inputs.urgency || 'Standard';
            
            const urgencyMultipliers = {
                'Low': 0.8,
                'Standard': 1.0,
                'Fast': 1.3,
                'Rapid': 1.8
            };
            
            const adjustedPriorityFee = priorityFee * urgencyMultipliers[urgency];
            const totalGasPrice = baseFee + adjustedPriorityFee;
            const gasCostGwei = gasLimit * totalGasPrice;
            const gasCostEth = gasCostGwei / 1000000000;
            const gasCostUsd = gasCostEth * ethPrice;
            
            const estimatedTime = urgency === 'Low' ? '5-10 min' : 
                                  urgency === 'Standard' ? '2-5 min' : 
                                  urgency === 'Fast' ? '30 sec - 2 min' : '< 30 sec';
              return `Gas Cost: ${gasCostEth.toFixed(6)} ETH
USD Cost: $${gasCostUsd.toFixed(2)}
Total Gas Price: ${totalGasPrice.toFixed(1)} Gwei
Base Fee: ${baseFee} Gwei
Priority Fee: ${adjustedPriorityFee.toFixed(1)} Gwei
Estimated Confirmation: ${estimatedTime}
Urgency Level: ${urgency}`;
        }
    },

    // 17 Additional Advanced Cryptocurrency Calculators
    'crypto-portfolio-tracker': {
        title: 'Crypto Portfolio Tracker',
        icon: 'fas fa-briefcase',
        inputs: [
            { id: 'asset1', label: 'Asset 1 Amount', type: 'number', placeholder: 'Enter asset 1 amount', step: '0.000001' },
            { id: 'asset1Price', label: 'Asset 1 Price ($)', type: 'number', placeholder: 'Enter asset 1 price', step: '0.000001' },
            { id: 'asset2', label: 'Asset 2 Amount', type: 'number', placeholder: 'Enter asset 2 amount', step: '0.000001' },
            { id: 'asset2Price', label: 'Asset 2 Price ($)', type: 'number', placeholder: 'Enter asset 2 price', step: '0.000001' },
            { id: 'asset3', label: 'Asset 3 Amount', type: 'number', placeholder: 'Enter asset 3 amount', step: '0.000001' },
            { id: 'asset3Price', label: 'Asset 3 Price ($)', type: 'number', placeholder: 'Enter asset 3 price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const asset1 = parseFloat(inputs.asset1) || 0;
            const asset1Price = parseFloat(inputs.asset1Price) || 0;
            const asset2 = parseFloat(inputs.asset2) || 0;
            const asset2Price = parseFloat(inputs.asset2Price) || 0;
            const asset3 = parseFloat(inputs.asset3) || 0;
            const asset3Price = parseFloat(inputs.asset3Price) || 0;
            
            const value1 = asset1 * asset1Price;
            const value2 = asset2 * asset2Price;
            const value3 = asset3 * asset3Price;
            const totalValue = value1 + value2 + value3;
            
            const percent1 = totalValue > 0 ? (value1 / totalValue) * 100 : 0;
            const percent2 = totalValue > 0 ? (value2 / totalValue) * 100 : 0;
            const percent3 = totalValue > 0 ? (value3 / totalValue) * 100 : 0;
            
            return `Total Portfolio Value: $${totalValue.toFixed(2)}
Asset 1: $${value1.toFixed(2)} (${percent1.toFixed(1)}%)
Asset 2: $${value2.toFixed(2)} (${percent2.toFixed(1)}%)
Asset 3: $${value3.toFixed(2)} (${percent3.toFixed(1)}%)
Diversification Score: ${(100 - Math.max(percent1, percent2, percent3)).toFixed(1)}%`;
        }
    },

    'crypto-leverage-calculator': {
        title: 'Advanced Leverage Calculator',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'capital', label: 'Trading Capital ($)', type: 'number', placeholder: 'Enter trading capital' },
            { id: 'leverage', label: 'Leverage Ratio (x)', type: 'number', placeholder: 'Enter leverage ratio' },
            { id: 'entryPrice', label: 'Entry Price ($)', type: 'number', placeholder: 'Enter entry price', step: '0.000001' },
            { id: 'priceChange', label: 'Price Change (%)', type: 'number', placeholder: 'Enter price change', step: '0.01' },
            { id: 'tradingFee', label: 'Trading Fee (%)', type: 'number', placeholder: 'Enter trading fee', step: '0.01' }
        ],
        calculate: function(inputs) {
            const capital = parseFloat(inputs.capital) || 0;
            const leverage = parseFloat(inputs.leverage) || 1;
            const entryPrice = parseFloat(inputs.entryPrice) || 0;
            const priceChange = parseFloat(inputs.priceChange) || 0;
            const tradingFee = parseFloat(inputs.tradingFee) || 0;
            
            const positionSize = capital * leverage;
            const leveragedReturn = priceChange * leverage;
            const tradingFees = (positionSize * tradingFee) / 100 * 2; // Open + Close
            const grossPnL = (capital * leveragedReturn) / 100;
            const netPnL = grossPnL - tradingFees;
            const liquidationPrice = entryPrice * (1 - (1 / leverage) * 0.8); // 80% margin level
            
            return `Position Size: $${positionSize.toFixed(2)}
Leveraged Return: ${leveragedReturn.toFixed(2)}%
Gross P&L: $${grossPnL.toFixed(2)}
Trading Fees: $${tradingFees.toFixed(2)}
Net P&L: $${netPnL.toFixed(2)}
ROI: ${((netPnL / capital) * 100).toFixed(2)}%
Liquidation Price: $${liquidationPrice.toFixed(6)}`;
        }
    },

    'crypto-sharpe-ratio': {
        title: 'Crypto Sharpe Ratio Calculator',
        icon: 'fas fa-chart-bar',
        inputs: [
            { id: 'portfolioReturn', label: 'Portfolio Return (%)', type: 'number', placeholder: 'Enter portfolio return', step: '0.01' },
            { id: 'riskFreeRate', label: 'Risk-Free Rate (%)', type: 'number', placeholder: 'Enter risk-free rate', step: '0.01' },
            { id: 'volatility', label: 'Portfolio Volatility (%)', type: 'number', placeholder: 'Enter volatility', step: '0.01' }
        ],
        calculate: function(inputs) {
            const portfolioReturn = parseFloat(inputs.portfolioReturn) || 0;
            const riskFreeRate = parseFloat(inputs.riskFreeRate) || 0;
            const volatility = parseFloat(inputs.volatility) || 0;
            
            const excessReturn = portfolioReturn - riskFreeRate;
            const sharpeRatio = volatility > 0 ? excessReturn / volatility : 0;
            
            let rating;
            if (sharpeRatio > 2) rating = 'Excellent';
            else if (sharpeRatio > 1) rating = 'Good';
            else if (sharpeRatio > 0.5) rating = 'Acceptable';
            else if (sharpeRatio > 0) rating = 'Poor';
            else rating = 'Very Poor';
            
            return `Sharpe Ratio: ${sharpeRatio.toFixed(3)}
Excess Return: ${excessReturn.toFixed(2)}%
Portfolio Volatility: ${volatility.toFixed(2)}%
Risk Rating: ${rating}
Interpretation: ${sharpeRatio > 1 ? 'Risk-adjusted returns are favorable' : 'Consider reducing risk or improving returns'}`;
        }
    },

    'crypto-dollar-hedge': {
        title: 'Dollar Cost Hedging Calculator',
        icon: 'fas fa-shield-alt',
        inputs: [
            { id: 'cryptoAmount', label: 'Crypto Amount', type: 'number', placeholder: 'Enter crypto amount', step: '0.000001' },
            { id: 'cryptoPrice', label: 'Current Crypto Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'hedgeRatio', label: 'Hedge Ratio (%)', type: 'number', placeholder: 'Enter hedge percentage', step: '1' },
            { id: 'expectedVolatility', label: 'Expected Volatility (%)', type: 'number', placeholder: 'Enter expected volatility', step: '0.1' }
        ],
        calculate: function(inputs) {
            const cryptoAmount = parseFloat(inputs.cryptoAmount) || 0;
            const cryptoPrice = parseFloat(inputs.cryptoPrice) || 0;
            const hedgeRatio = parseFloat(inputs.hedgeRatio) || 0;
            const expectedVolatility = parseFloat(inputs.expectedVolatility) || 0;
            
            const portfolioValue = cryptoAmount * cryptoPrice;
            const hedgeAmount = (portfolioValue * hedgeRatio) / 100;
            const unhedgedAmount = portfolioValue - hedgeAmount;
            
            const dailyVaR = (portfolioValue * expectedVolatility / 100) / Math.sqrt(365);
            const hedgedVaR = (unhedgedAmount * expectedVolatility / 100) / Math.sqrt(365);
            const riskReduction = ((dailyVaR - hedgedVaR) / dailyVaR) * 100;
            
            return `Portfolio Value: $${portfolioValue.toFixed(2)}
Hedged Amount: $${hedgeAmount.toFixed(2)}
Unhedged Amount: $${unhedgedAmount.toFixed(2)}
Daily VaR (95%): $${dailyVaR.toFixed(2)}
Hedged VaR: $${hedgedVaR.toFixed(2)}
Risk Reduction: ${riskReduction.toFixed(1)}%`;
        }
    },

    'crypto-momentum-indicator': {
        title: 'Crypto Momentum Indicator',
        icon: 'fas fa-tachometer-alt',
        inputs: [
            { id: 'price1Day', label: '1-Day Price ($)', type: 'number', placeholder: 'Enter 1-day ago price', step: '0.000001' },
            { id: 'price7Day', label: '7-Day Price ($)', type: 'number', placeholder: 'Enter 7-day ago price', step: '0.000001' },
            { id: 'price30Day', label: '30-Day Price ($)', type: 'number', placeholder: 'Enter 30-day ago price', step: '0.000001' },
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'volume24h', label: '24h Volume ($)', type: 'number', placeholder: 'Enter 24h volume' }
        ],
        calculate: function(inputs) {
            const price1Day = parseFloat(inputs.price1Day) || 0;
            const price7Day = parseFloat(inputs.price7Day) || 0;
            const price30Day = parseFloat(inputs.price30Day) || 0;
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const volume24h = parseFloat(inputs.volume24h) || 0;
            
            const change1Day = ((currentPrice - price1Day) / price1Day) * 100;
            const change7Day = ((currentPrice - price7Day) / price7Day) * 100;
            const change30Day = ((currentPrice - price30Day) / price30Day) * 100;
            
            const momentumScore = (change1Day * 0.5) + (change7Day * 0.3) + (change30Day * 0.2);
            
            let momentum;
            if (momentumScore > 10) momentum = 'Very Bullish';
            else if (momentumScore > 5) momentum = 'Bullish';
            else if (momentumScore > -5) momentum = 'Neutral';
            else if (momentumScore > -10) momentum = 'Bearish';
            else momentum = 'Very Bearish';
            
            return `Momentum Score: ${momentumScore.toFixed(2)}
1-Day Change: ${change1Day.toFixed(2)}%
7-Day Change: ${change7Day.toFixed(2)}%
30-Day Change: ${change30Day.toFixed(2)}%
Overall Momentum: ${momentum}
24h Volume: $${volume24h.toLocaleString()}`;
        }
    },

    'crypto-technical-levels': {
        title: 'Technical Support/Resistance Levels',
        icon: 'fas fa-layer-group',
        inputs: [
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'highPrice', label: '52-Week High ($)', type: 'number', placeholder: 'Enter 52-week high', step: '0.000001' },
            { id: 'lowPrice', label: '52-Week Low ($)', type: 'number', placeholder: 'Enter 52-week low', step: '0.000001' },
            { id: 'volume', label: 'Average Volume', type: 'number', placeholder: 'Enter average volume' }
        ],
        calculate: function(inputs) {
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const highPrice = parseFloat(inputs.highPrice) || 0;
            const lowPrice = parseFloat(inputs.lowPrice) || 0;
            const volume = parseFloat(inputs.volume) || 0;
            
            // Fibonacci retracement levels
            const range = highPrice - lowPrice;
            const fib236 = highPrice - (range * 0.236);
            const fib382 = highPrice - (range * 0.382);
            const fib618 = highPrice - (range * 0.618);
            
            // Pivot point
            const pivot = (highPrice + lowPrice + currentPrice) / 3;
            const resistance1 = (2 * pivot) - lowPrice;
            const support1 = (2 * pivot) - highPrice;
            
            const pricePosition = ((currentPrice - lowPrice) / range) * 100;
            
            return `Current Position: ${pricePosition.toFixed(1)}% of range
Pivot Point: $${pivot.toFixed(6)}
Resistance 1: $${resistance1.toFixed(6)}
Support 1: $${support1.toFixed(6)}
Fibonacci Levels:
  23.6%: $${fib236.toFixed(6)}
  38.2%: $${fib382.toFixed(6)}
  61.8%: $${fib618.toFixed(6)}
52-Week Range: $${lowPrice.toFixed(6)} - $${highPrice.toFixed(6)}`;
        }
    },

    'crypto-altcoin-season': {
        title: 'Altcoin Season Indicator',
        icon: 'fas fa-coins',
        inputs: [
            { id: 'btcDominance', label: 'BTC Dominance (%)', type: 'number', placeholder: 'Enter BTC dominance', step: '0.1' },
            { id: 'btcPrice', label: 'BTC Price ($)', type: 'number', placeholder: 'Enter BTC price' },
            { id: 'btc30DayChange', label: 'BTC 30-Day Change (%)', type: 'number', placeholder: 'Enter BTC 30-day change', step: '0.1' },
            { id: 'altcoinAvgChange', label: 'Top 50 Altcoin Avg Change (%)', type: 'number', placeholder: 'Enter altcoin average change', step: '0.1' }
        ],
        calculate: function(inputs) {
            const btcDominance = parseFloat(inputs.btcDominance) || 0;
            const btcPrice = parseFloat(inputs.btcPrice) || 0;
            const btc30DayChange = parseFloat(inputs.btc30DayChange) || 0;
            const altcoinAvgChange = parseFloat(inputs.altcoinAvgChange) || 0;
            
            let altSeasonScore = 0;
            
            // BTC Dominance factor (lower dominance = more altcoin friendly)
            if (btcDominance < 40) altSeasonScore += 30;
            else if (btcDominance < 50) altSeasonScore += 20;
            else if (btcDominance < 60) altSeasonScore += 10;
            
            // Relative performance factor
            const relativePerformance = altcoinAvgChange - btc30DayChange;
            if (relativePerformance > 20) altSeasonScore += 40;
            else if (relativePerformance > 10) altSeasonScore += 30;
            else if (relativePerformance > 0) altSeasonScore += 20;
            else if (relativePerformance > -10) altSeasonScore += 10;
            
            // BTC trend factor
            if (btc30DayChange > 10) altSeasonScore += 30; // Bull market helps alts
            else if (btc30DayChange > 0) altSeasonScore += 20;
            else if (btc30DayChange > -10) altSeasonScore += 10;
            
            let season;
            if (altSeasonScore >= 80) season = 'Strong Altcoin Season';
            else if (altSeasonScore >= 60) season = 'Moderate Altcoin Season';
            else if (altSeasonScore >= 40) season = 'Weak Altcoin Season';
            else season = 'Bitcoin Season';
            
            return `Altcoin Season Score: ${altSeasonScore}/100
Market Phase: ${season}
BTC Dominance: ${btcDominance.toFixed(1)}%
Relative Performance: ${relativePerformance.toFixed(1)}%
BTC 30-Day: ${btc30DayChange.toFixed(1)}%
Altcoin Avg: ${altcoinAvgChange.toFixed(1)}%`;
        }
    },

    'crypto-market-cap-calc': {
        title: 'Market Cap & Supply Calculator',
        icon: 'fas fa-calculator-alt',
        inputs: [
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'circulatingSupply', label: 'Circulating Supply', type: 'number', placeholder: 'Enter circulating supply' },
            { id: 'maxSupply', label: 'Max Supply', type: 'number', placeholder: 'Enter max supply' },
            { id: 'targetPrice', label: 'Target Price ($)', type: 'number', placeholder: 'Enter target price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const circulatingSupply = parseFloat(inputs.circulatingSupply) || 0;
            const maxSupply = parseFloat(inputs.maxSupply) || 0;
            const targetPrice = parseFloat(inputs.targetPrice) || 0;
            
            const currentMarketCap = currentPrice * circulatingSupply;
            const targetMarketCap = targetPrice * circulatingSupply;
            const fullyDilutedValue = currentPrice * maxSupply;
            const supplyRatio = maxSupply > 0 ? (circulatingSupply / maxSupply) * 100 : 100;
            const marketCapIncrease = ((targetMarketCap - currentMarketCap) / currentMarketCap) * 100;
            
            return `Current Market Cap: $${currentMarketCap.toLocaleString()}
Target Market Cap: $${targetMarketCap.toLocaleString()}
Fully Diluted Value: $${fullyDilutedValue.toLocaleString()}
Circulating Supply: ${circulatingSupply.toLocaleString()}
Max Supply: ${maxSupply.toLocaleString()}
Supply Ratio: ${supplyRatio.toFixed(1)}%
Required MC Increase: ${marketCapIncrease.toFixed(1)}%`;
        }
    },

    'crypto-pairs-trading': {
        title: 'Crypto Pairs Trading Calculator',
        icon: 'fas fa-exchange-alt',
        inputs: [
            { id: 'asset1Price', label: 'Asset 1 Price ($)', type: 'number', placeholder: 'Enter asset 1 price', step: '0.000001' },
            { id: 'asset2Price', label: 'Asset 2 Price ($)', type: 'number', placeholder: 'Enter asset 2 price', step: '0.000001' },
            { id: 'historicalRatio', label: 'Historical Average Ratio', type: 'number', placeholder: 'Enter historical ratio', step: '0.001' },
            { id: 'tradingAmount', label: 'Trading Amount ($)', type: 'number', placeholder: 'Enter trading amount' },
            { id: 'spreadThreshold', label: 'Spread Threshold (%)', type: 'number', placeholder: 'Enter spread threshold', step: '0.1' }
        ],
        calculate: function(inputs) {
            const asset1Price = parseFloat(inputs.asset1Price) || 0;
            const asset2Price = parseFloat(inputs.asset2Price) || 0;
            const historicalRatio = parseFloat(inputs.historicalRatio) || 0;
            const tradingAmount = parseFloat(inputs.tradingAmount) || 0;
            const spreadThreshold = parseFloat(inputs.spreadThreshold) || 0;
            
            const currentRatio = asset1Price / asset2Price;
            const ratioDeviation = ((currentRatio - historicalRatio) / historicalRatio) * 100;
            const spread = Math.abs(ratioDeviation);
            
            let signal, action;
            if (spread > spreadThreshold) {
                if (ratioDeviation > 0) {
                    signal = 'Long Asset 2, Short Asset 1';
                    action = 'Asset 1 is overvalued relative to Asset 2';
                } else {
                    signal = 'Long Asset 1, Short Asset 2';
                    action = 'Asset 2 is overvalued relative to Asset 1';
                }
            } else {
                signal = 'No Trade';
                action = 'Spread is within normal range';
            }
            
            const potentialProfit = tradingAmount * (spread / 100);
            
            return `Current Ratio: ${currentRatio.toFixed(4)}
Historical Ratio: ${historicalRatio.toFixed(4)}
Ratio Deviation: ${ratioDeviation.toFixed(2)}%
Spread: ${spread.toFixed(2)}%
Trading Signal: ${signal}
Action: ${action}
Potential Profit: $${potentialProfit.toFixed(2)}`;
        }
    },

    'crypto-grid-trading': {
        title: 'Grid Trading Calculator',
        icon: 'fas fa-th',
        inputs: [
            { id: 'basePrice', label: 'Base Price ($)', type: 'number', placeholder: 'Enter base price', step: '0.000001' },
            { id: 'gridSpacing', label: 'Grid Spacing (%)', type: 'number', placeholder: 'Enter grid spacing', step: '0.1' },
            { id: 'numberOfGrids', label: 'Number of Grids', type: 'number', placeholder: 'Enter number of grids' },
            { id: 'investmentAmount', label: 'Total Investment ($)', type: 'number', placeholder: 'Enter investment amount' }
        ],
        calculate: function(inputs) {
            const basePrice = parseFloat(inputs.basePrice) || 0;
            const gridSpacing = parseFloat(inputs.gridSpacing) || 0;
            const numberOfGrids = parseInt(inputs.numberOfGrids) || 0;
            const investmentAmount = parseFloat(inputs.investmentAmount) || 0;
            
            const amountPerGrid = investmentAmount / numberOfGrids;
            const gridsAbove = Math.floor(numberOfGrids / 2);
            const gridsBelow = numberOfGrids - gridsAbove;
            
            let gridLevels = [];
            
            // Buy grids (below base price)
            for (let i = 1; i <= gridsBelow; i++) {
                const price = basePrice * (1 - (gridSpacing / 100) * i);
                gridLevels.push({ type: 'Buy', price: price.toFixed(6), amount: amountPerGrid });
            }
            
            // Sell grids (above base price)
            for (let i = 1; i <= gridsAbove; i++) {
                const price = basePrice * (1 + (gridSpacing / 100) * i);
                gridLevels.push({ type: 'Sell', price: price.toFixed(6), amount: amountPerGrid });
            }
            
            const lowestBuyPrice = basePrice * (1 - (gridSpacing / 100) * gridsBelow);
            const highestSellPrice = basePrice * (1 + (gridSpacing / 100) * gridsAbove);
            const totalRange = ((highestSellPrice - lowestBuyPrice) / basePrice) * 100;
            
            return `Grid Strategy Setup:
Base Price: $${basePrice.toFixed(6)}
Grid Spacing: ${gridSpacing}%
Total Grids: ${numberOfGrids}
Amount per Grid: $${amountPerGrid.toFixed(2)}
Price Range: $${lowestBuyPrice.toFixed(6)} - $${highestSellPrice.toFixed(6)}
Total Range: ${totalRange.toFixed(1)}%
Buy Grids: ${gridsBelow} | Sell Grids: ${gridsAbove}`;
        }
    },

    'crypto-rsi-calculator': {
        title: 'RSI & Technical Indicators',
        icon: 'fas fa-chart-line',
        inputs: [
            { id: 'price1', label: 'Price 14 Days Ago ($)', type: 'number', placeholder: 'Enter price 14 days ago', step: '0.000001' },
            { id: 'price2', label: 'Price 7 Days Ago ($)', type: 'number', placeholder: 'Enter price 7 days ago', step: '0.000001' },
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'volume', label: 'Average Volume', type: 'number', placeholder: 'Enter average volume' }
        ],
        calculate: function(inputs) {
            const price1 = parseFloat(inputs.price1) || 0;
            const price2 = parseFloat(inputs.price2) || 0;
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const volume = parseFloat(inputs.volume) || 0;
            
            // Simplified RSI calculation
            const change1 = currentPrice - price2;
            const change2 = price2 - price1;
            const avgGain = Math.max(0, (Math.max(0, change1) + Math.max(0, change2)) / 2);
            const avgLoss = Math.max(0.01, (Math.max(0, -change1) + Math.max(0, -change2)) / 2);
            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            
            let rsiSignal;
            if (rsi > 70) rsiSignal = 'Overbought - Consider Selling';
            else if (rsi < 30) rsiSignal = 'Oversold - Consider Buying';
            else rsiSignal = 'Neutral Range';
            
            // Simple momentum
            const momentum = ((currentPrice - price1) / price1) * 100;
            
            return `RSI (14): ${rsi.toFixed(1)}
RSI Signal: ${rsiSignal}
Price Momentum: ${momentum.toFixed(2)}%
Recent Trend: ${change1 > 0 ? 'Bullish' : 'Bearish'}
Average Volume: ${volume.toLocaleString()}
Technical Summary: ${rsi > 50 && momentum > 0 ? 'Bullish' : rsi < 50 && momentum < 0 ? 'Bearish' : 'Mixed'}`;
        }
    },

    'crypto-funding-arbitrage': {
        title: 'Funding Rate Arbitrage Calculator',
        icon: 'fas fa-percent',
        inputs: [
            { id: 'spotPrice', label: 'Spot Price ($)', type: 'number', placeholder: 'Enter spot price', step: '0.000001' },
            { id: 'futuresPrice', label: 'Futures Price ($)', type: 'number', placeholder: 'Enter futures price', step: '0.000001' },
            { id: 'fundingRate', label: 'Funding Rate (%)', type: 'number', placeholder: 'Enter 8h funding rate', step: '0.001' },
            { id: 'tradingAmount', label: 'Trading Amount ($)', type: 'number', placeholder: 'Enter trading amount' },
            { id: 'holdingPeriod', label: 'Holding Period (days)', type: 'number', placeholder: 'Enter holding period' }
        ],
        calculate: function(inputs) {
            const spotPrice = parseFloat(inputs.spotPrice) || 0;
            const futuresPrice = parseFloat(inputs.futuresPrice) || 0;
            const fundingRate = parseFloat(inputs.fundingRate) || 0;
            const tradingAmount = parseFloat(inputs.tradingAmount) || 0;
            const holdingPeriod = parseFloat(inputs.holdingPeriod) || 0;
            
            const basisSpread = ((futuresPrice - spotPrice) / spotPrice) * 100;
            const fundingPayments = 3; // 3 funding periods per day
            const totalFundingPeriods = holdingPeriod * fundingPayments;
            const totalFundingEarned = (tradingAmount * fundingRate / 100) * totalFundingPeriods;
            
            let strategy;
            if (fundingRate > 0.02) {
                strategy = 'Short Perpetual, Long Spot (Collect Funding)';
            } else if (fundingRate < -0.02) {
                strategy = 'Long Perpetual, Short Spot (Pay Funding)';
            } else {
                strategy = 'Funding rates too low for arbitrage';
            }
            
            const dailyYield = (totalFundingEarned / tradingAmount / holdingPeriod) * 100;
            const annualizedYield = dailyYield * 365;
            
            return `Basis Spread: ${basisSpread.toFixed(4)}%
8h Funding Rate: ${fundingRate.toFixed(4)}%
Total Funding Earned: $${totalFundingEarned.toFixed(2)}
Daily Yield: ${dailyYield.toFixed(3)}%
Annualized Yield: ${annualizedYield.toFixed(1)}%
Recommended Strategy: ${strategy}
Risk Level: ${Math.abs(fundingRate) > 0.1 ? 'High' : 'Low'}`;
        }
    },

    'crypto-volatility-smile': {
        title: 'Crypto Volatility Surface Calculator',
        icon: 'fas fa-chart-area',
        inputs: [
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' },
            { id: 'strike1', label: 'Strike 1 ($)', type: 'number', placeholder: 'Enter strike price 1', step: '0.000001' },
            { id: 'vol1', label: 'Implied Vol 1 (%)', type: 'number', placeholder: 'Enter implied volatility 1', step: '0.1' },
            { id: 'strike2', label: 'Strike 2 ($)', type: 'number', placeholder: 'Enter strike price 2', step: '0.000001' },
            { id: 'vol2', label: 'Implied Vol 2 (%)', type: 'number', placeholder: 'Enter implied volatility 2', step: '0.1' },
            { id: 'daysToExpiry', label: 'Days to Expiry', type: 'number', placeholder: 'Enter days to expiry' }
        ],
        calculate: function(inputs) {
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            const strike1 = parseFloat(inputs.strike1) || 0;
            const vol1 = parseFloat(inputs.vol1) || 0;
            const strike2 = parseFloat(inputs.strike2) || 0;
            const vol2 = parseFloat(inputs.vol2) || 0;
            const daysToExpiry = parseFloat(inputs.daysToExpiry) || 0;
            
            const moneyness1 = strike1 / currentPrice;
            const moneyness2 = strike2 / currentPrice;
            const volSkew = vol2 - vol1;
            const timeToExpiry = daysToExpiry / 365;
            
            // Calculate volatility smile metrics
            const atmVol = (vol1 + vol2) / 2; // Simplified ATM vol
            const skewPerStrike = volSkew / Math.abs(moneyness2 - moneyness1);
            
            let skewDirection;
            if (volSkew > 2) skewDirection = 'Strong Put Skew (Fear)';
            else if (volSkew > 0) skewDirection = 'Moderate Put Skew';
            else if (volSkew < -2) skewDirection = 'Call Skew (Greed)';
            else skewDirection = 'Relatively Flat';
            
            const volOfVol = Math.abs(volSkew) / atmVol * 100;
            
            return `ATM Implied Volatility: ${atmVol.toFixed(1)}%
Volatility Skew: ${volSkew.toFixed(1)}%
Skew Direction: ${skewDirection}
Skew per Strike: ${skewPerStrike.toFixed(2)}%
Vol of Vol: ${volOfVol.toFixed(1)}%
Market Sentiment: ${volSkew > 0 ? 'Risk Averse' : 'Risk Seeking'}
Time to Expiry: ${timeToExpiry.toFixed(3)} years`;
        }
    },

    'crypto-carry-trade': {
        title: 'Crypto Carry Trade Calculator',
        icon: 'fas fa-piggy-bank',
        inputs: [
            { id: 'baseCurrency', label: 'Base Currency Rate (%)', type: 'number', placeholder: 'Enter base currency rate', step: '0.01' },
            { id: 'targetCurrency', label: 'Target Currency Rate (%)', type: 'number', placeholder: 'Enter target currency rate', step: '0.01' },
            { id: 'exchangeRate', label: 'Current Exchange Rate', type: 'number', placeholder: 'Enter current exchange rate', step: '0.000001' },
            { id: 'principal', label: 'Principal Amount', type: 'number', placeholder: 'Enter principal amount' },
            { id: 'leverage', label: 'Leverage (x)', type: 'number', placeholder: 'Enter leverage ratio' }
        ],
        calculate: function(inputs) {
            const baseCurrency = parseFloat(inputs.baseCurrency) || 0;
            const targetCurrency = parseFloat(inputs.targetCurrency) || 0;
            const exchangeRate = parseFloat(inputs.exchangeRate) || 0;
            const principal = parseFloat(inputs.principal) || 0;
            const leverage = parseFloat(inputs.leverage) || 1;
            
            const interestRateDiff = targetCurrency - baseCurrency;
            const leveragedPosition = principal * leverage;
            const dailyCarry = (leveragedPosition * interestRateDiff / 100) / 365;
            const monthlyCarry = dailyCarry * 30;
            const annualCarry = dailyCarry * 365;
            
            const carryYield = (annualCarry / principal) * 100;
            const breakEvenMove = Math.abs(interestRateDiff / leverage);
            
            let riskAssessment;
            if (leverage > 5) riskAssessment = 'High Risk';
            else if (leverage > 2) riskAssessment = 'Moderate Risk';
            else riskAssessment = 'Low Risk';
            
            return `Interest Rate Differential: ${interestRateDiff.toFixed(2)}%
Daily Carry: $${dailyCarry.toFixed(2)}
Monthly Carry: $${monthlyCarry.toFixed(2)}
Annual Carry: $${annualCarry.toFixed(2)}
Carry Yield: ${carryYield.toFixed(2)}%
Break-even FX Move: ${breakEvenMove.toFixed(2)}%
Risk Assessment: ${riskAssessment}`;
        }
    },

    'crypto-basis-trading': {
        title: 'Crypto Basis Trading Calculator',
        icon: 'fas fa-chart-area',
        inputs: [
            { id: 'spotPrice', label: 'Spot Price ($)', type: 'number', placeholder: 'Enter spot price', step: '0.000001' },
            { id: 'futuresPrice', label: 'Futures Price ($)', type: 'number', placeholder: 'Enter futures price', step: '0.000001' },
            { id: 'daysToExpiry', label: 'Days to Expiry', type: 'number', placeholder: 'Enter days to expiry' },
            { id: 'tradingAmount', label: 'Trading Amount ($)', type: 'number', placeholder: 'Enter trading amount' },
            { id: 'interestRate', label: 'Risk-Free Rate (%)', type: 'number', placeholder: 'Enter risk-free rate', step: '0.01' }
        ],
        calculate: function(inputs) {
            const spotPrice = parseFloat(inputs.spotPrice) || 0;
            const futuresPrice = parseFloat(inputs.futuresPrice) || 0;
            const daysToExpiry = parseFloat(inputs.daysToExpiry) || 0;
            const tradingAmount = parseFloat(inputs.tradingAmount) || 0;
            const interestRate = parseFloat(inputs.interestRate) || 0;
            
            const basis = futuresPrice - spotPrice;
            const basisPercentage = (basis / spotPrice) * 100;
            const timeToExpiry = daysToExpiry / 365;
            const annualizedBasis = basisPercentage / timeToExpiry;
            
            const theoreticalFuturesPrice = spotPrice * Math.exp(interestRate / 100 * timeToExpiry);
            const mispricing = futuresPrice - theoreticalFuturesPrice;
            const mispricingPercentage = (mispricing / spotPrice) * 100;
            
            let strategy;
            if (mispricingPercentage > 1) {
                strategy = 'Short Futures, Long Spot (Futures Overpriced)';
            } else if (mispricingPercentage < -1) {
                strategy = 'Long Futures, Short Spot (Futures Underpriced)';
            } else {
                strategy = 'No arbitrage opportunity';
            }
            
            const expectedProfit = Math.abs(mispricing) * (tradingAmount / spotPrice);
            
            return `Basis: $${basis.toFixed(6)}
Basis Percentage: ${basisPercentage.toFixed(3)}%
Annualized Basis: ${annualizedBasis.toFixed(2)}%
Theoretical Futures Price: $${theoreticalFuturesPrice.toFixed(6)}
Mispricing: ${mispricingPercentage.toFixed(3)}%
Strategy: ${strategy}
Expected Profit: $${expectedProfit.toFixed(2)}`;
        }
    },

    'crypto-social-sentiment': {
        title: 'Social Sentiment Impact Calculator',
        icon: 'fas fa-comments',
        inputs: [
            { id: 'socialScore', label: 'Social Sentiment Score (0-100)', type: 'number', placeholder: 'Enter social sentiment score', min: '0', max: '100' },
            { id: 'twitterMentions', label: 'Twitter Mentions (24h)', type: 'number', placeholder: 'Enter Twitter mentions' },
            { id: 'redditScore', label: 'Reddit Activity Score (0-100)', type: 'number', placeholder: 'Enter Reddit score', min: '0', max: '100' },
            { id: 'newsScore', label: 'News Sentiment Score (0-100)', type: 'number', placeholder: 'Enter news sentiment', min: '0', max: '100' },
            { id: 'currentPrice', label: 'Current Price ($)', type: 'number', placeholder: 'Enter current price', step: '0.000001' }
        ],
        calculate: function(inputs) {
            const socialScore = parseFloat(inputs.socialScore) || 0;
            const twitterMentions = parseFloat(inputs.twitterMentions) || 0;
            const redditScore = parseFloat(inputs.redditScore) || 0;
            const newsScore = parseFloat(inputs.newsScore) || 0;
            const currentPrice = parseFloat(inputs.currentPrice) || 0;
            
            const compositeSentiment = (socialScore * 0.3) + (redditScore * 0.3) + (newsScore * 0.4);
            const viralityScore = Math.min(100, twitterMentions / 100); // Scale mentions to 0-100
            const overallSentiment = (compositeSentiment * 0.7) + (viralityScore * 0.3);
            
            let sentimentLevel;
            if (overallSentiment >= 80) sentimentLevel = 'Extremely Bullish';
            else if (overallSentiment >= 60) sentimentLevel = 'Bullish';
            else if (overallSentiment >= 40) sentimentLevel = 'Neutral';
            else if (overallSentiment >= 20) sentimentLevel = 'Bearish';
            else sentimentLevel = 'Extremely Bearish';
            
            const predictedPriceImpact = (overallSentiment - 50) * 0.5; // Max 25% impact
            const priceTarget = currentPrice * (1 + predictedPriceImpact / 100);
            
            let recommendation;
            if (overallSentiment > 70) recommendation = 'Strong Buy Signal';
            else if (overallSentiment > 55) recommendation = 'Buy Signal';
            else if (overallSentiment < 30) recommendation = 'Strong Sell Signal';
            else if (overallSentiment < 45) recommendation = 'Sell Signal';
            else recommendation = 'Hold/Wait';
            
            return `Overall Sentiment: ${overallSentiment.toFixed(1)}/100
Sentiment Level: ${sentimentLevel}
Composite Score: ${compositeSentiment.toFixed(1)}
Virality Score: ${viralityScore.toFixed(1)}
Predicted Price Impact: ${predictedPriceImpact.toFixed(1)}%
Price Target: $${priceTarget.toFixed(6)}
Recommendation: ${recommendation}`;
        }
    },
    // More calculators will be added based on categories
};

// Define calculator categories
const toolCategories = {
    financial: ['loan', 'mortgage', 'compound-interest', 'investment', 'savings'],
    math: [
        'percentage', 'fraction', 'algebra', 'quadratic', 'trigonometry', 
        'scientific-calculator', 'statistics-calculator', 'matrix-calculator', 
        'geometry-calculator', 'calculus-calculator', 'number-theory', 
        'probability-calculator', 'complex-numbers', 'sequence-series', 
        'logarithm-calculator', 'polynomial-calculator', 'binary-calculator',
        'windows-calculator'
    ],    health: [
        'bmi', 'calorie', 'body-fat', 'ideal-weight', 'water-intake',
        'heart-rate-zone', 'vo2-max', 'pregnancy-due-date', 'ovulation', 'bmi-children',
        'macro-calculator', 'protein-intake', 'body-measurement', 'sleep-calculator', 'hydration-status',
        'fitness-level', 'workout-intensity', 'recovery-calculator', 'training-load', 'body-age',
        // New calculators
        'bmr', 'waist-hip-ratio', 'target-heart-rate', 'body-surface-area', 'lean-body-mass',
        'resting-energy', 'weight-loss-planner', 'blood-alcohol', 'blood-pressure', 'blood-sugar',
        'body-fat-distribution', 'exercise-calories', 'macros-converter', 'meal-planner', 'muscle-mass'
    ],    crypto: [
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
        'crypto-volatility',
        'crypto-dca',
        'crypto-mining',
        'crypto-converter',
        'impermanent-loss',
        'staking-rewards',
        'crypto-arbitrage',
        // 15 Advanced Cryptocurrency Calculators (Previously Added)
        'crypto-yield-farming',
        'crypto-bridge-fees',
        'crypto-tax-calculator',
        'crypto-hodl-calculator',
        'crypto-rainbow-chart',
        'crypto-fear-greed',
        'crypto-hash-rate',
        'crypto-whale-tracker',
        'crypto-flash-loan',
        'crypto-liquidity-pool',
        'crypto-options-pricing',
        'crypto-defi-yield',
        'crypto-nft-valuation',
        'crypto-gas-optimizer',
        // 17 Additional Advanced Cryptocurrency Calculators
        'crypto-portfolio-tracker',
        'crypto-leverage-calculator',
        'crypto-sharpe-ratio',
        'crypto-dollar-hedge',
        'crypto-momentum-indicator',
        'crypto-technical-levels',
        'crypto-altcoin-season',
        'crypto-market-cap-calc',
        'crypto-pairs-trading',
        'crypto-grid-trading',
        'crypto-rsi-calculator',
        'crypto-funding-arbitrage',
        'crypto-volatility-smile',
        'crypto-carry-trade',
        'crypto-basis-trading',
        'crypto-social-sentiment'
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
