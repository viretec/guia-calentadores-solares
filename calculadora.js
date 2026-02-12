// ===== SOLAR CALCULATOR =====

// Solar radiation index by state (kWh/m²/day)
const SOLAR_RADIATION_INDEX = {
    'Aguascalientes': 5.5,
    'Baja California': 6.0,
    'Baja California Sur': 6.3,
    'Campeche': 5.2,
    'Chiapas': 5.0,
    'Chihuahua': 5.8,
    'Ciudad de México': 5.1,
    'Coahuila': 5.7,
    'Colima': 5.4,
    'Durango': 5.9,
    'Estado de México': 5.1,
    'Guanajuato': 5.4,
    'Guerrero': 5.3,
    'Hidalgo': 5.0,
    'Jalisco': 5.3,
    'Michoacán': 5.3,
    'Morelos': 5.2,
    'Nayarit': 5.4,
    'Nuevo León': 5.4,
    'Oaxaca': 5.2,
    'Puebla': 5.1,
    'Querétaro': 5.3,
    'Quintana Roo': 5.5,
    'San Luis Potosí': 5.3,
    'Sinaloa': 5.6,
    'Sonora': 6.2,
    'Tabasco': 4.8,
    'Tamaulipas': 5.3,
    'Tlaxcala': 5.0,
    'Veracruz': 4.8,
    'Yucatán': 5.5,
    'Zacatecas': 5.6,
    'DEFAULT': 5.2
};

// State descriptions for solar potential
const STATE_QUALITY = {
    excellent: { min: 5.8, label: 'Excelente', emoji: '🔥', color: '#22c55e' },
    good: { min: 5.3, label: 'Muy buena', emoji: '☀️', color: '#f59e0b' },
    moderate: { min: 4.9, label: 'Buena', emoji: '⛅', color: '#3b82f6' },
    low: { min: 0, label: 'Moderada', emoji: '🌤️', color: '#94a3b8' }
};

// Calculator state
let calcData = {
    monthlyGasBill: 800,
    waterHeatPercent: 0.50,
    householdSize: 2,
    state: '',
    name: '',
    email: ''
};

let currentStep = 1;

// ===== NAVIGATION =====
function startCalculator() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('calculator').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) return;

    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + step).classList.add('active');

    // Update progress
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, i) => {
        if (i + 1 < step) {
            dot.classList.add('done');
            dot.classList.remove('active');
        } else if (i + 1 === step) {
            dot.classList.add('active');
            dot.classList.remove('done');
        } else {
            dot.classList.remove('active', 'done');
        }
    });

    document.getElementById('progressFill').style.width = (step * 20) + '%';
    currentStep = step;
    window.scrollTo({ top: document.getElementById('calculator').offsetTop - 50, behavior: 'smooth' });
}

function prevStep(step) {
    document.getElementById('step' + currentStep).classList.remove('active');
    document.getElementById('step' + step).classList.add('active');

    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, i) => {
        if (i + 1 < step) {
            dot.classList.add('done');
            dot.classList.remove('active');
        } else if (i + 1 === step) {
            dot.classList.add('active');
            dot.classList.remove('done');
        } else {
            dot.classList.remove('active', 'done');
        }
    });

    document.getElementById('progressFill').style.width = (step * 20) + '%';
    currentStep = step;
}

function goToStep5() {
    const state = document.getElementById('stateSelect').value;
    if (!state) {
        document.getElementById('stateSelect').style.borderColor = '#ef4444';
        setTimeout(() => {
            document.getElementById('stateSelect').style.borderColor = '';
        }, 2000);
        return;
    }
    calcData.state = state;
    nextStep(5);
}

function validateStep(step) {
    if (step === 1) {
        calcData.monthlyGasBill = parseInt(document.getElementById('gasSlider').value);
        return calcData.monthlyGasBill >= 100;
    }
    return true;
}

// ===== INPUT HANDLERS =====
function updateGasDisplay(val) {
    document.getElementById('gasDisplay').textContent = parseInt(val).toLocaleString('es-MX');
    document.getElementById('gasInput').value = val;
    calcData.monthlyGasBill = parseInt(val);
}

function updateGasSlider(val) {
    const num = parseInt(val);
    if (num >= 100 && num <= 10000) {
        document.getElementById('gasSlider').value = Math.min(num, 3000);
        document.getElementById('gasDisplay').textContent = num.toLocaleString('es-MX');
        calcData.monthlyGasBill = num;
    }
}

function selectOption(el, field) {
    // Deselect siblings
    el.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    const value = parseFloat(el.dataset.value);
    calcData[field] = value;
}

// State selection handler
document.getElementById('stateSelect').addEventListener('change', function () {
    const state = this.value;
    if (!state) return;

    calcData.state = state;
    const radiation = SOLAR_RADIATION_INDEX[state] || SOLAR_RADIATION_INDEX['DEFAULT'];

    let quality;
    if (radiation >= STATE_QUALITY.excellent.min) quality = STATE_QUALITY.excellent;
    else if (radiation >= STATE_QUALITY.good.min) quality = STATE_QUALITY.good;
    else if (radiation >= STATE_QUALITY.moderate.min) quality = STATE_QUALITY.moderate;
    else quality = STATE_QUALITY.low;

    document.getElementById('stateInfo').innerHTML = `
    <div class="state-radiation">
      <span class="radiation-icon">${quality.emoji}</span>
      <span>
        <strong>${state}</strong>: radiación solar 
        <span class="radiation-highlight" style="color:${quality.color}">${radiation} kWh/m²/día</span> 
        — ${quality.label}
      </span>
    </div>
  `;
});

// ===== CALCULATE & SHOW RESULTS =====
function showResults() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();

    if (!name || name.length < 2) {
        document.getElementById('userName').style.borderColor = '#ef4444';
        document.getElementById('userName').focus();
        setTimeout(() => { document.getElementById('userName').style.borderColor = ''; }, 2000);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('userEmail').style.borderColor = '#ef4444';
        document.getElementById('userEmail').focus();
        setTimeout(() => { document.getElementById('userEmail').style.borderColor = ''; }, 2000);
        return;
    }

    calcData.name = name;
    calcData.email = email;

    // Calculate
    const results = calculateSolarSavings(calcData);

    // Hide calculator, show results
    document.getElementById('calculator').classList.remove('active');
    document.getElementById('results').classList.add('active');

    // Populate results
    populateResults(results);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateSolarSavings({ monthlyGasBill, waterHeatPercent, householdSize, state }) {
    // Monthly water heating cost
    const monthlyWaterHeatingCost = monthlyGasBill * waterHeatPercent;
    const annualWaterHeatingCost = monthlyWaterHeatingCost * 12;

    // Solar radiation for state
    const solarIndex = SOLAR_RADIATION_INDEX[state] || SOLAR_RADIATION_INDEX['DEFAULT'];

    // Solar coverage factor (70% base, adjusted by radiation)
    const solarCoverageBase = 0.70;
    const solarCoverage = Math.min(solarCoverageBase + (solarIndex - 5.0) * 0.05, 0.90);

    // Annual savings
    const annualSavings = annualWaterHeatingCost * solarCoverage;
    const monthlySavings = annualSavings / 12;

    // Equipment cost by household size
    const equipmentCosts = { 1: 14000, 2: 18000, 3: 24000 };
    const equipmentCost = equipmentCosts[householdSize] || 18000;

    // ROI in years
    const roiYears = equipmentCost / annualSavings;

    // Projections
    const savings5years = (annualSavings * 5) - equipmentCost;
    const savings10years = (annualSavings * 10) - equipmentCost;

    // CO2 avoided (kg) - 0.45 kg CO2 per kWh of gas approx
    const co2Avoided = (annualSavings / 12) * 0.45 * 12;

    // Remaining gas cost
    const remainingGasCost = annualWaterHeatingCost - annualSavings;

    return {
        monthlyWaterHeatingCost: Math.round(monthlyWaterHeatingCost),
        annualWaterHeatingCost: Math.round(annualWaterHeatingCost),
        annualSavings: Math.round(annualSavings),
        monthlySavings: Math.round(monthlySavings),
        solarCoveragePercent: Math.round(solarCoverage * 100),
        equipmentCost,
        roiYears: Math.round(roiYears * 10) / 10,
        savings5years: Math.round(savings5years),
        savings10years: Math.round(savings10years),
        co2Avoided: Math.round(co2Avoided),
        remainingGasCost: Math.round(remainingGasCost),
        solarIndex
    };
}

function populateResults(r) {
    // Name
    document.getElementById('resultsName').textContent = `Resultados para ${calcData.name}`;

    // Main savings
    animateValue('annualSavings', 0, r.annualSavings, 1500, '$', ' MXN');
    animateValue('monthlySavings', 0, r.monthlySavings, 1200, '$', '');

    // Coverage ring
    const circum = 327;
    const offset = circum - (circum * r.solarCoveragePercent / 100);
    setTimeout(() => {
        document.getElementById('coverageRing').style.transition = 'stroke-dashoffset 1.5s ease';
        document.getElementById('coverageRing').setAttribute('stroke-dashoffset', offset);
    }, 300);
    document.getElementById('coveragePercent').textContent = r.solarCoveragePercent + '%';

    // Grid cards
    document.getElementById('savings5y').textContent = '$' + r.savings5years.toLocaleString('es-MX');
    document.getElementById('savings10y').textContent = '$' + r.savings10years.toLocaleString('es-MX');
    document.getElementById('roiYears').textContent = r.roiYears + ' años';
    document.getElementById('co2Avoided').textContent = r.co2Avoided + ' kg';

    // Comparison bars
    const maxVal = r.annualWaterHeatingCost;
    setTimeout(() => {
        document.getElementById('barGas').style.width = '100%';
        document.getElementById('barGasVal').textContent = '$' + r.annualWaterHeatingCost.toLocaleString('es-MX') + '/año';

        const solarWidth = Math.max((r.remainingGasCost / maxVal) * 100, 15);
        document.getElementById('barSolar').style.width = solarWidth + '%';
        document.getElementById('barSolarVal').textContent = '$' + r.remainingGasCost.toLocaleString('es-MX') + '/año';
    }, 500);

    // Equipment
    const sizeNames = { 1: 'Sistema pequeño', 2: 'Sistema mediano', 3: 'Sistema grande' };
    const sizeDescs = { 1: 'Ideal para 1-2 personas', 2: 'Ideal para 3-4 personas', 3: 'Ideal para 5+ personas' };
    document.getElementById('equipSize').textContent = sizeNames[calcData.householdSize] || 'Sistema mediano';
    document.getElementById('equipDesc').textContent = sizeDescs[calcData.householdSize] || '';
    document.getElementById('equipPrice').textContent = '$' + r.equipmentCost.toLocaleString('es-MX') + ' MXN';
}

function animateValue(elementId, start, end, duration, prefix, suffix) {
    const el = document.getElementById(elementId);
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (range * eased));

        el.textContent = prefix + current.toLocaleString('es-MX') + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== RESET =====
function resetCalculator() {
    // Reset data
    calcData = {
        monthlyGasBill: 800,
        waterHeatPercent: 0.50,
        householdSize: 2,
        state: '',
        name: '',
        email: ''
    };
    currentStep = 1;

    // Reset UI
    document.getElementById('results').classList.remove('active');
    document.getElementById('landing').style.display = '';

    // Reset steps
    document.querySelectorAll('.calc-step').forEach((s, i) => {
        s.classList.toggle('active', i === 0);
    });

    document.querySelectorAll('.step-dot').forEach((d, i) => {
        d.classList.toggle('active', i === 0);
        d.classList.remove('done');
    });

    document.getElementById('progressFill').style.width = '20%';
    document.getElementById('gasSlider').value = 800;
    document.getElementById('gasDisplay').textContent = '800';
    document.getElementById('gasInput').value = 800;
    document.getElementById('stateSelect').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';

    // Reset bars
    document.getElementById('barGas').style.width = '0';
    document.getElementById('barSolar').style.width = '0';

    // Reset ring
    document.getElementById('coverageRing').setAttribute('stroke-dashoffset', '327');
    document.getElementById('coverageRing').style.transition = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
