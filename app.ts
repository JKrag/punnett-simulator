import {
    BlackSeriesAllele,
    AgoutiAllele, 
    DilutionAllele,
    WhiteSpottingAllele,
    HairLengthAllele,
    CatGenotype,
    Gene,
    createGenotype,
    getPhenotype,
    getPhenotypeColors,
    genotypeToString
} from './geneticsModel.js';

import {
    generatePunnettSquare,
    getPunnettSquareData,
    gameteToString,
    createColoredGameteDisplay,
    AlleleColors,
    Gamete
} from './punnettCalculator.js';

// Application state
interface AppState {
    parent1: CatGenotype;
    parent2: CatGenotype;
    savedSettings: SavedSetting[];
}

interface SavedSetting {
    id: string;
    name: string;
    parent1: CatGenotype;
    parent2: CatGenotype;
    date: string;
}

// Default state
const defaultState: AppState = {
    parent1: createGenotype(
        BlackSeriesAllele.Black,
        BlackSeriesAllele.Black,
        AgoutiAllele.Agouti,
        AgoutiAllele.NonAgouti,
        DilutionAllele.Normal,
        DilutionAllele.Normal,
        WhiteSpottingAllele.NoSpotting,
        WhiteSpottingAllele.NoSpotting,
        HairLengthAllele.Short,
        HairLengthAllele.Short
    ),
    parent2: createGenotype(
        BlackSeriesAllele.Brown,
        BlackSeriesAllele.Cinnamon,
        AgoutiAllele.NonAgouti,
        AgoutiAllele.NonAgouti,
        DilutionAllele.Normal,
        DilutionAllele.Diluted,
        WhiteSpottingAllele.Spotting,
        WhiteSpottingAllele.NoSpotting,
        HairLengthAllele.Short,
        HairLengthAllele.Long
    ),
    savedSettings: []
};

// Current application state
let appState: AppState = {...defaultState};

// DOM Elements
let calculateButton: HTMLButtonElement;
let saveButton: HTMLButtonElement;
let loadButton: HTMLButtonElement;
let punnettContainer: HTMLDivElement;
let offspringStatsContainer: HTMLDivElement;
let savedSettingsList: HTMLDivElement;
let parent1Preview: HTMLDivElement;
let parent2Preview: HTMLDivElement;
let legendContainer: HTMLDivElement;

// DOM elements for parent 1 genes
let parent1BlackAllele1: HTMLSelectElement;
let parent1BlackAllele2: HTMLSelectElement;
let parent1AgoutiAllele1: HTMLSelectElement;
let parent1AgoutiAllele2: HTMLSelectElement;
let parent1DilutionAllele1: HTMLSelectElement;
let parent1DilutionAllele2: HTMLSelectElement;
let parent1SpottingAllele1: HTMLSelectElement;
let parent1SpottingAllele2: HTMLSelectElement;
let parent1LengthAllele1: HTMLSelectElement;
let parent1LengthAllele2: HTMLSelectElement;

// DOM elements for parent 2 genes
let parent2BlackAllele1: HTMLSelectElement;
let parent2BlackAllele2: HTMLSelectElement;
let parent2AgoutiAllele1: HTMLSelectElement;
let parent2AgoutiAllele2: HTMLSelectElement;
let parent2DilutionAllele1: HTMLSelectElement;
let parent2DilutionAllele2: HTMLSelectElement;
let parent2SpottingAllele1: HTMLSelectElement;
let parent2SpottingAllele2: HTMLSelectElement;
let parent2LengthAllele1: HTMLSelectElement;
let parent2LengthAllele2: HTMLSelectElement;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeDOM();
    loadStateFromStorage();
    updateUI();
    setupEventListeners();
    renderLegend();
});

// Initialize DOM element references
function initializeDOM() {
    // Buttons
    calculateButton = document.getElementById('calculate-btn') as HTMLButtonElement;
    saveButton = document.getElementById('save-btn') as HTMLButtonElement;
    loadButton = document.getElementById('load-btn') as HTMLButtonElement;
    
    // Containers
    punnettContainer = document.getElementById('punnett-container') as HTMLDivElement;
    offspringStatsContainer = document.getElementById('offspring-stats-container') as HTMLDivElement;
    savedSettingsList = document.getElementById('saved-settings-list') as HTMLDivElement;
    parent1Preview = document.getElementById('parent1-preview') as HTMLDivElement;
    parent2Preview = document.getElementById('parent2-preview') as HTMLDivElement;
    legendContainer = document.getElementById('genetics-legend') as HTMLDivElement;
    
    // Parent 1 gene selects
    parent1BlackAllele1 = document.getElementById('parent1-black-allele1') as HTMLSelectElement;
    parent1BlackAllele2 = document.getElementById('parent1-black-allele2') as HTMLSelectElement;
    parent1AgoutiAllele1 = document.getElementById('parent1-agouti-allele1') as HTMLSelectElement;
    parent1AgoutiAllele2 = document.getElementById('parent1-agouti-allele2') as HTMLSelectElement;
    parent1DilutionAllele1 = document.getElementById('parent1-dilution-allele1') as HTMLSelectElement;
    parent1DilutionAllele2 = document.getElementById('parent1-dilution-allele2') as HTMLSelectElement;
    parent1SpottingAllele1 = document.getElementById('parent1-spotting-allele1') as HTMLSelectElement;
    parent1SpottingAllele2 = document.getElementById('parent1-spotting-allele2') as HTMLSelectElement;
    parent1LengthAllele1 = document.getElementById('parent1-length-allele1') as HTMLSelectElement;
    parent1LengthAllele2 = document.getElementById('parent1-length-allele2') as HTMLSelectElement;
    
    // Parent 2 gene selects
    parent2BlackAllele1 = document.getElementById('parent2-black-allele1') as HTMLSelectElement;
    parent2BlackAllele2 = document.getElementById('parent2-black-allele2') as HTMLSelectElement;
    parent2AgoutiAllele1 = document.getElementById('parent2-agouti-allele1') as HTMLSelectElement;
    parent2AgoutiAllele2 = document.getElementById('parent2-agouti-allele2') as HTMLSelectElement;
    parent2DilutionAllele1 = document.getElementById('parent2-dilution-allele1') as HTMLSelectElement;
    parent2DilutionAllele2 = document.getElementById('parent2-dilution-allele2') as HTMLSelectElement;
    parent2SpottingAllele1 = document.getElementById('parent2-spotting-allele1') as HTMLSelectElement;
    parent2SpottingAllele2 = document.getElementById('parent2-spotting-allele2') as HTMLSelectElement;
    parent2LengthAllele1 = document.getElementById('parent2-length-allele1') as HTMLSelectElement;
    parent2LengthAllele2 = document.getElementById('parent2-length-allele2') as HTMLSelectElement;

    // Color the select dropdowns
    setupAlleleSelects();
}

function setupAlleleSelects() {
    // Add CSS classes and colors to the allele selects
    colorizeAlleleSelect(parent1BlackAllele1, 'blackSeries');
    colorizeAlleleSelect(parent1BlackAllele2, 'blackSeries');
    colorizeAlleleSelect(parent2BlackAllele1, 'blackSeries');
    colorizeAlleleSelect(parent2BlackAllele2, 'blackSeries');
    
    colorizeAlleleSelect(parent1AgoutiAllele1, 'agouti');
    colorizeAlleleSelect(parent1AgoutiAllele2, 'agouti');
    colorizeAlleleSelect(parent2AgoutiAllele1, 'agouti');
    colorizeAlleleSelect(parent2AgoutiAllele2, 'agouti');
    
    colorizeAlleleSelect(parent1DilutionAllele1, 'dilution');
    colorizeAlleleSelect(parent1DilutionAllele2, 'dilution');
    colorizeAlleleSelect(parent2DilutionAllele1, 'dilution');
    colorizeAlleleSelect(parent2DilutionAllele2, 'dilution');
    
    colorizeAlleleSelect(parent1SpottingAllele1, 'whiteSpotting');
    colorizeAlleleSelect(parent1SpottingAllele2, 'whiteSpotting');
    colorizeAlleleSelect(parent2SpottingAllele1, 'whiteSpotting');
    colorizeAlleleSelect(parent2SpottingAllele2, 'whiteSpotting');
    
    colorizeAlleleSelect(parent1LengthAllele1, 'hairLength');
    colorizeAlleleSelect(parent1LengthAllele2, 'hairLength');
    colorizeAlleleSelect(parent2LengthAllele1, 'hairLength');
    colorizeAlleleSelect(parent2LengthAllele2, 'hairLength');
}

// Add color backgrounds to the select options
function colorizeAlleleSelect(selectElement: HTMLSelectElement, alleleType: string) {
    // Make sure the select element exists
    if (!selectElement) return;
    
    // Add a change listener to update option colors
    selectElement.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const alleleValue = selectedOption.value;
        const color = getAlleleColor(alleleType, alleleValue);
        
        // Set the background color of the select
        this.style.backgroundColor = color;
        this.style.color = getContrastingTextColor(color);
    });
    
    // Set initial color
    const initialValue = selectElement.value;
    const initialColor = getAlleleColor(alleleType, initialValue);
    selectElement.style.backgroundColor = initialColor;
    selectElement.style.color = getContrastingTextColor(initialColor);
    
    // Also color each option
    Array.from(selectElement.options).forEach(option => {
        const optionColor = getAlleleColor(alleleType, option.value);
        option.style.backgroundColor = optionColor;
        option.style.color = getContrastingTextColor(optionColor);
    });
}

// Helper function to get the color for an allele
function getAlleleColor(alleleType: string, allele: string): string {
    switch(alleleType) {
        case 'blackSeries':
            return AlleleColors.BlackSeries[allele as BlackSeriesAllele];
        case 'agouti':
            return AlleleColors.Agouti[allele as AgoutiAllele];
        case 'dilution':
            return AlleleColors.Dilution[allele as DilutionAllele];
        case 'whiteSpotting':
            return AlleleColors.WhiteSpotting[allele as WhiteSpottingAllele];
        case 'hairLength':
            return AlleleColors.HairLength[allele as HairLengthAllele];
        default:
            return '#cccccc'; // Default gray
    }
}

// Determine if text should be black or white based on background color
function getContrastingTextColor(hexColor: string): string {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors and white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Set up event listeners
function setupEventListeners() {
    // Button click handlers
    calculateButton.addEventListener('click', () => {
        calculatePunnettSquare();
    });
    
    saveButton.addEventListener('click', () => {
        saveCurrentSettings();
    });
    
    loadButton.addEventListener('click', () => {
        showSavedSettings();
    });
    
    // Parent 1 gene change handlers
    [
        parent1BlackAllele1, parent1BlackAllele2,
        parent1AgoutiAllele1, parent1AgoutiAllele2,
        parent1DilutionAllele1, parent1DilutionAllele2,
        parent1SpottingAllele1, parent1SpottingAllele2,
        parent1LengthAllele1, parent1LengthAllele2
    ].forEach(select => {
        select.addEventListener('change', () => {
            updateParent1Genotype();
            updateParentPreviews();
        });
    });
    
    // Parent 2 gene change handlers
    [
        parent2BlackAllele1, parent2BlackAllele2,
        parent2AgoutiAllele1, parent2AgoutiAllele2,
        parent2DilutionAllele1, parent2DilutionAllele2,
        parent2SpottingAllele1, parent2SpottingAllele2,
        parent2LengthAllele1, parent2LengthAllele2
    ].forEach(select => {
        select.addEventListener('change', () => {
            updateParent2Genotype();
            updateParentPreviews();
        });
    });
}

// Render the color legend
function renderLegend() {
    legendContainer.innerHTML = '';
    
    // Create legend sections
    const legendSections = [
        {
            title: "Black Series (B)",
            trait: "blackSeries",
            colors: AlleleColors.BlackSeries,
            alleles: [
                { value: BlackSeriesAllele.Black, label: "Black (B) - Dominant" },
                { value: BlackSeriesAllele.Brown, label: "Brown (b)" },
                { value: BlackSeriesAllele.Cinnamon, label: "Cinnamon (b')" }
            ]
        },
        {
            title: "Agouti (A)",
            trait: "agouti",
            colors: AlleleColors.Agouti,
            alleles: [
                { value: AgoutiAllele.Agouti, label: "Tabby (A) - Dominant" },
                { value: AgoutiAllele.NonAgouti, label: "Solid (a)" }
            ]
        },
        {
            title: "Dilution (D)",
            trait: "dilution",
            colors: AlleleColors.Dilution,
            alleles: [
                { value: DilutionAllele.Normal, label: "Normal (D) - Dominant" },
                { value: DilutionAllele.Diluted, label: "Diluted (d)" }
            ]
        },
        {
            title: "White Spotting (S)",
            trait: "whiteSpotting",
            colors: AlleleColors.WhiteSpotting,
            alleles: [
                { value: WhiteSpottingAllele.Spotting, label: "White spots (S) - Dominant" },
                { value: WhiteSpottingAllele.NoSpotting, label: "No spots (s)" }
            ]
        },
        {
            title: "Hair Length (L)",
            trait: "hairLength",
            colors: AlleleColors.HairLength,
            alleles: [
                { value: HairLengthAllele.Short, label: "Short (L) - Dominant" },
                { value: HairLengthAllele.Long, label: "Long (l)" }
            ]
        }
    ];
    
    // Create the legend
    legendSections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'legend-section';
        
        // Add section title
        const titleDiv = document.createElement('h4');
        titleDiv.textContent = section.title;
        sectionDiv.appendChild(titleDiv);
        
        // Add alleles
        section.alleles.forEach(allele => {
            const alleleDiv = document.createElement('div');
            alleleDiv.className = 'legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = getAlleleColor(section.trait, allele.value);
            
            const label = document.createElement('span');
            label.textContent = allele.label;
            
            alleleDiv.appendChild(colorBox);
            alleleDiv.appendChild(label);
            sectionDiv.appendChild(alleleDiv);
        });
        
        legendContainer.appendChild(sectionDiv);
    });
}

// Update the UI based on current state
function updateUI() {
    // Set parent 1 gene select values
    parent1BlackAllele1.value = appState.parent1.blackSeries.allele1;
    parent1BlackAllele2.value = appState.parent1.blackSeries.allele2;
    parent1AgoutiAllele1.value = appState.parent1.agouti.allele1;
    parent1AgoutiAllele2.value = appState.parent1.agouti.allele2;
    parent1DilutionAllele1.value = appState.parent1.dilution.allele1;
    parent1DilutionAllele2.value = appState.parent1.dilution.allele2;
    parent1SpottingAllele1.value = appState.parent1.whiteSpotting.allele1;
    parent1SpottingAllele2.value = appState.parent1.whiteSpotting.allele2;
    parent1LengthAllele1.value = appState.parent1.hairLength.allele1;
    parent1LengthAllele2.value = appState.parent1.hairLength.allele2;
    
    // Set parent 2 gene select values
    parent2BlackAllele1.value = appState.parent2.blackSeries.allele1;
    parent2BlackAllele2.value = appState.parent2.blackSeries.allele2;
    parent2AgoutiAllele1.value = appState.parent2.agouti.allele1;
    parent2AgoutiAllele2.value = appState.parent2.agouti.allele2;
    parent2DilutionAllele1.value = appState.parent2.dilution.allele1;
    parent2DilutionAllele2.value = appState.parent2.dilution.allele2;
    parent2SpottingAllele1.value = appState.parent2.whiteSpotting.allele1;
    parent2SpottingAllele2.value = appState.parent2.whiteSpotting.allele2;
    parent2LengthAllele1.value = appState.parent2.hairLength.allele1;
    parent2LengthAllele2.value = appState.parent2.hairLength.allele2;
    
    // Update color of select elements
    setupAlleleSelects();
    
    // Update parent previews
    updateParentPreviews();
    
    // Update saved settings list
    renderSavedSettingsList();
    
    // Calculate initial Punnett square
    calculatePunnettSquare();
}

// Update parent 1 genotype from UI
function updateParent1Genotype() {
    appState.parent1 = createGenotype(
        parent1BlackAllele1.value as BlackSeriesAllele,
        parent1BlackAllele2.value as BlackSeriesAllele,
        parent1AgoutiAllele1.value as AgoutiAllele,
        parent1AgoutiAllele2.value as AgoutiAllele,
        parent1DilutionAllele1.value as DilutionAllele,
        parent1DilutionAllele2.value as DilutionAllele,
        parent1SpottingAllele1.value as WhiteSpottingAllele,
        parent1SpottingAllele2.value as WhiteSpottingAllele,
        parent1LengthAllele1.value as HairLengthAllele,
        parent1LengthAllele2.value as HairLengthAllele
    );
    saveStateToStorage();
}

// Update parent 2 genotype from UI
function updateParent2Genotype() {
    appState.parent2 = createGenotype(
        parent2BlackAllele1.value as BlackSeriesAllele,
        parent2BlackAllele2.value as BlackSeriesAllele,
        parent2AgoutiAllele1.value as AgoutiAllele,
        parent2AgoutiAllele2.value as AgoutiAllele,
        parent2DilutionAllele1.value as DilutionAllele,
        parent2DilutionAllele2.value as DilutionAllele,
        parent2SpottingAllele1.value as WhiteSpottingAllele,
        parent2SpottingAllele2.value as WhiteSpottingAllele,
        parent2LengthAllele1.value as HairLengthAllele,
        parent2LengthAllele2.value as HairLengthAllele
    );
    saveStateToStorage();
}

// Update phenotype previews for both parents
function updateParentPreviews() {
    const parent1Phenotype = getPhenotype(appState.parent1);
    const parent2Phenotype = getPhenotype(appState.parent2);
    
    renderPhenotypePreview(parent1Preview, parent1Phenotype);
    renderPhenotypePreview(parent2Preview, parent2Phenotype);
}

// Render a phenotype preview
function renderPhenotypePreview(container: HTMLDivElement, phenotype: any) {
    const colors = getPhenotypeColors(phenotype);
    
    // Clear the container
    container.innerHTML = '';
    
    // Create a cat silhouette
    const catDiv = document.createElement('div');
    catDiv.className = 'cat-silhouette';
    catDiv.style.backgroundColor = colors.baseColor;
    
    // Apply pattern overlay
    if (phenotype.pattern === 'Tabby') {
        catDiv.classList.add('tabby-pattern');
        catDiv.style.setProperty('--pattern-color', AlleleColors.Agouti[AgoutiAllele.Agouti]);
    }
    
    // Apply dilution effect
    if (phenotype.dilution === 'Diluted') {
        catDiv.style.opacity = '0.7';
        catDiv.style.setProperty('--dilution-color', AlleleColors.Dilution[DilutionAllele.Diluted]);
    }
    
    // Add white spotting if present
    if (phenotype.spotting === ' with white spots') {
        catDiv.classList.add('white-spots');
        catDiv.style.setProperty('--spotting-color', AlleleColors.WhiteSpotting[WhiteSpottingAllele.Spotting]);
    }
    
    // Apply hair length effect
    if (phenotype.hairLength === 'long') {
        catDiv.classList.add('long-hair');
        catDiv.style.setProperty('--hair-color', AlleleColors.HairLength[HairLengthAllele.Long]);
    } else {
        catDiv.style.setProperty('--hair-color', AlleleColors.HairLength[HairLengthAllele.Short]);
    }
    
    // Add genotype visualization
    const genotypeDiv = document.createElement('div');
    genotypeDiv.className = 'genotype-visualization';
    
    // Display each gene with appropriate colors
    const blackSeriesDiv = createGeneVisualization('Black Series', appState.parent1.blackSeries, 'blackSeries');
    const agoutiDiv = createGeneVisualization('Agouti', appState.parent1.agouti, 'agouti');
    const dilutionDiv = createGeneVisualization('Dilution', appState.parent1.dilution, 'dilution');
    const spottingDiv = createGeneVisualization('White Spotting', appState.parent1.whiteSpotting, 'whiteSpotting');
    const hairLengthDiv = createGeneVisualization('Hair Length', appState.parent1.hairLength, 'hairLength');
    
    genotypeDiv.appendChild(blackSeriesDiv);
    genotypeDiv.appendChild(agoutiDiv);
    genotypeDiv.appendChild(dilutionDiv);
    genotypeDiv.appendChild(spottingDiv);
    genotypeDiv.appendChild(hairLengthDiv);
    
    // Create phenotype description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'phenotype-description';
    descriptionDiv.textContent = phenotype.description;
    
    // Add elements to container
    container.appendChild(catDiv);
    container.appendChild(descriptionDiv);
}

// Create a colored visualization for a gene
function createGeneVisualization(name: string, gene: Gene<any>, traitType: string): HTMLElement {
    const geneDiv = document.createElement('div');
    geneDiv.className = 'gene-visualization';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'gene-name';
    nameSpan.textContent = name + ': ';
    
    const allele1Span = document.createElement('span');
    allele1Span.className = 'allele';
    allele1Span.textContent = gene.allele1;
    allele1Span.style.backgroundColor = getAlleleColor(traitType, gene.allele1);
    allele1Span.style.color = getContrastingTextColor(getAlleleColor(traitType, gene.allele1));
    
    const allele2Span = document.createElement('span');
    allele2Span.className = 'allele';
    allele2Span.textContent = gene.allele2;
    allele2Span.style.backgroundColor = getAlleleColor(traitType, gene.allele2);
    allele2Span.style.color = getContrastingTextColor(getAlleleColor(traitType, gene.allele2));
    
    geneDiv.appendChild(nameSpan);
    geneDiv.appendChild(allele1Span);
    geneDiv.appendChild(allele2Span);
    
    return geneDiv;
}

// Calculate Punnett square
function calculatePunnettSquare() {
    const result = generatePunnettSquare(appState.parent1, appState.parent2);
    const squareData = getPunnettSquareData(appState.parent1, appState.parent2);
    
    renderPunnettSquare(squareData);
    renderOffspringStats(result);
}

// Render the Punnett square
function renderPunnettSquare(squareData: any) {
    const { parent1Gametes, parent2Gametes, cells } = squareData;
    
    // Clear the container
    punnettContainer.innerHTML = '';
    
    // Create the table
    const table = document.createElement('table');
    table.className = 'punnett-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    
    // Empty cell in top-left corner
    const cornerCell = document.createElement('th');
    cornerCell.className = 'corner-cell';
    headerRow.appendChild(cornerCell);
    
    // Add parent 2 gametes as column headers
    parent2Gametes.forEach((gamete: Gamete) => {
        const th = document.createElement('th');
        th.className = 'gamete-header';
        th.innerHTML = createColoredGameteDisplay(gamete);
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    // Create rows for each parent 1 gamete
    parent1Gametes.forEach((gamete1: Gamete, rowIndex: number) => {
        const row = document.createElement('tr');
        
        // Add parent 1 gamete as row header
        const th = document.createElement('th');
        th.className = 'gamete-header';
        th.innerHTML = createColoredGameteDisplay(gamete1);
        row.appendChild(th);
        
        // Add offspring cells
        parent2Gametes.forEach((gamete2: Gamete, colIndex: number) => {
            const cellIndex = rowIndex * parent2Gametes.length + colIndex;
            const cell = cells[cellIndex];
            const td = document.createElement('td');
            td.className = 'punnett-cell';
            
            const genotype = cell.offspring;
            const phenotype = getPhenotype(genotype);
            const phenotypeColors = getPhenotypeColors(phenotype);
            
            // Create a mini cat representation
            const catDiv = document.createElement('div');
            catDiv.className = 'mini-cat';
            catDiv.style.backgroundColor = phenotypeColors.baseColor;
            
            if (phenotype.pattern === 'Tabby') {
                catDiv.classList.add('mini-tabby');
            }
            
            if (phenotype.dilution === 'Diluted') {
                catDiv.style.opacity = '0.7';
            }
            
            if (phenotype.spotting === ' with white spots') {
                catDiv.classList.add('mini-spots');
            }
            
            if (phenotype.hairLength === 'long') {
                catDiv.classList.add('mini-long-hair');
            }
            
            // Create colored allele display
            const genotypeDiv = document.createElement('div');
            genotypeDiv.className = 'cell-genotype';
            
            // Create colored boxes for each gene
            const blackSeriesDiv = document.createElement('div');
            blackSeriesDiv.className = 'gene-pair';
            blackSeriesDiv.innerHTML = `
                <span class="allele-box" style="background-color: ${getAlleleColor('blackSeries', genotype.blackSeries.allele1)}">${genotype.blackSeries.allele1}</span>
                <span class="allele-box" style="background-color: ${getAlleleColor('blackSeries', genotype.blackSeries.allele2)}">${genotype.blackSeries.allele2}</span>
            `;
            
            const agoutiDiv = document.createElement('div');
            agoutiDiv.className = 'gene-pair';
            agoutiDiv.innerHTML = `
                <span class="allele-box" style="background-color: ${getAlleleColor('agouti', genotype.agouti.allele1)}">${genotype.agouti.allele1}</span>
                <span class="allele-box" style="background-color: ${getAlleleColor('agouti', genotype.agouti.allele2)}">${genotype.agouti.allele2}</span>
            `;
            
            const dilutionDiv = document.createElement('div');
            dilutionDiv.className = 'gene-pair';
            dilutionDiv.innerHTML = `
                <span class="allele-box" style="background-color: ${getAlleleColor('dilution', genotype.dilution.allele1)}">${genotype.dilution.allele1}</span>
                <span class="allele-box" style="background-color: ${getAlleleColor('dilution', genotype.dilution.allele2)}">${genotype.dilution.allele2}</span>
            `;
            
            const spottingDiv = document.createElement('div');
            spottingDiv.className = 'gene-pair';
            spottingDiv.innerHTML = `
                <span class="allele-box" style="background-color: ${getAlleleColor('whiteSpotting', genotype.whiteSpotting.allele1)}">${genotype.whiteSpotting.allele1}</span>
                <span class="allele-box" style="background-color: ${getAlleleColor('whiteSpotting', genotype.whiteSpotting.allele2)}">${genotype.whiteSpotting.allele2}</span>
            `;
            
            const hairLengthDiv = document.createElement('div');
            hairLengthDiv.className = 'gene-pair';
            hairLengthDiv.innerHTML = `
                <span class="allele-box" style="background-color: ${getAlleleColor('hairLength', genotype.hairLength.allele1)}">${genotype.hairLength.allele1}</span>
                <span class="allele-box" style="background-color: ${getAlleleColor('hairLength', genotype.hairLength.allele2)}">${genotype.hairLength.allele2}</span>
            `;
            
            genotypeDiv.appendChild(blackSeriesDiv);
            genotypeDiv.appendChild(agoutiDiv);
            genotypeDiv.appendChild(dilutionDiv);
            genotypeDiv.appendChild(spottingDiv);
            genotypeDiv.appendChild(hairLengthDiv);
            
            const phenotypeDiv = document.createElement('div');
            phenotypeDiv.className = 'cell-phenotype';
            phenotypeDiv.textContent = phenotype.description;
            
            // Add elements to cell
            td.appendChild(catDiv);
            td.appendChild(genotypeDiv);
            td.appendChild(phenotypeDiv);
            
            row.appendChild(td);
        });
        
        table.appendChild(row);
    });
    
    punnettContainer.appendChild(table);
}

// Render offspring statistics
function renderOffspringStats(result: any) {
    const { phenotypeStats, totalCount } = result;
    
    // Clear the container
    offspringStatsContainer.innerHTML = '';
    
    // Sort phenotypes by frequency (descending)
    type PhenotypeEntry = [string, { count: number, percentage: number }];
    const entries = Array.from(phenotypeStats.entries()) as PhenotypeEntry[];
    const sortedPhenotypes = entries.sort((a, b) => b[1].count - a[1].count);
    
    // Create a list of phenotypes
    const list = document.createElement('ul');
    list.className = 'phenotype-list';
    
    sortedPhenotypes.forEach(([phenotypeString, stats]) => {
        const listItem = document.createElement('li');
        listItem.className = 'phenotype-item';
        
        const { count, percentage } = stats;
        
        listItem.innerHTML = `
            <div class="phenotype-description">
                ${phenotypeString}
            </div>
            <div class="phenotype-probability">
                ${percentage.toFixed(1)}% (${count}/${totalCount})
            </div>
        `;
        
        list.appendChild(listItem);
    });
    
    offspringStatsContainer.appendChild(list);
}

// Save current settings to storage
function saveCurrentSettings() {
    const name = prompt('Enter a name for these settings:');
    
    if (!name) return;
    
    const newSetting: SavedSetting = {
        id: generateId(),
        name,
        parent1: { ...appState.parent1 },
        parent2: { ...appState.parent2 },
        date: new Date().toLocaleString()
    };
    
    appState.savedSettings.push(newSetting);
    saveStateToStorage();
    renderSavedSettingsList();
}

// Show saved settings
function showSavedSettings() {
    // Toggle visibility of saved settings list
    savedSettingsList.style.display = 
        savedSettingsList.style.display === 'none' ? 'block' : 'none';
}

// Render saved settings list
function renderSavedSettingsList() {
    // Clear the container
    savedSettingsList.innerHTML = '';
    
    if (appState.savedSettings.length === 0) {
        savedSettingsList.innerHTML = '<p>No saved settings</p>';
        return;
    }
    
    // Create a list of saved settings
    appState.savedSettings.forEach(setting => {
        const listItem = document.createElement('div');
        listItem.className = 'saved-setting-item';
        
        listItem.innerHTML = `
            <div class="setting-name">${setting.name}</div>
            <div class="setting-date">${setting.date}</div>
            <div class="setting-actions">
                <button class="load-setting-btn" data-id="${setting.id}">Load</button>
                <button class="delete-setting-btn" data-id="${setting.id}">Delete</button>
            </div>
        `;
        
        savedSettingsList.appendChild(listItem);
    });
    
    // Add event listeners to buttons
    const loadButtons = document.querySelectorAll('.load-setting-btn');
    const deleteButtons = document.querySelectorAll('.delete-setting-btn');
    
    loadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = (button as HTMLElement).dataset.id;
            loadSetting(id);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = (button as HTMLElement).dataset.id;
            deleteSetting(id);
        });
    });
}

// Load a saved setting
function loadSetting(id: string | undefined) {
    if (!id) return;
    
    const setting = appState.savedSettings.find(s => s.id === id);
    
    if (setting) {
        appState.parent1 = { ...setting.parent1 };
        appState.parent2 = { ...setting.parent2 };
        updateUI();
        saveStateToStorage();
    }
}

// Delete a saved setting
function deleteSetting(id: string | undefined) {
    if (!id) return;
    
    appState.savedSettings = appState.savedSettings.filter(s => s.id !== id);
    saveStateToStorage();
    renderSavedSettingsList();
}

// Generate a unique ID
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Save state to local storage
function saveStateToStorage() {
    try {
        localStorage.setItem('catGeneticsState', JSON.stringify(appState));
    } catch (error) {
        console.error('Failed to save state to local storage:', error);
    }
}

// Load state from local storage
function loadStateFromStorage() {
    try {
        const savedState = localStorage.getItem('catGeneticsState');
        
        if (savedState) {
            appState = JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Failed to load state from local storage:', error);
    }
}

// Add CSS styles for the cat silhouette and colored elements
const style = document.createElement('style');
style.textContent = `
    .cat-silhouette {
        width: 60px;
        height: 60px;
        background-color: #000;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        position: relative;
        margin: 0 auto;
    }
    
    .cat-silhouette::before,
    .cat-silhouette::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid currentColor;
        top: -10px;
        border-radius: 50% 50% 0 0;
    }
    
    .cat-silhouette::before {
        left: 0px;
        transform: rotate(-30deg);
    }
    
    .cat-silhouette::after {
        right: 0px;
        transform: rotate(30deg);
    }
    
    .tabby-pattern {
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            rgba(30, 86, 49, 0.3) 5px,
            rgba(30, 86, 49, 0.3) 10px
        );
    }
    
    .white-spots::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #0047ab;
        opacity: 0.7;
        border-radius: 50%;
        bottom: 5px;
        left: 20px;
    }
    
    .long-hair {
        box-shadow: 0 0 0 5px rgba(211, 211, 211, 0.5);
    }
    
    .allele-box {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin: 0 2px;
        border-radius: 3px;
    }
    
    .gene-visualization {
        margin: 5px 0;
        display: flex;
        align-items: center;
    }
    
    .gene-name {
        margin-right: 5px;
        font-size: 0.8em;
    }
    
    .allele {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin: 0 2px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    .phenotype-description {
        margin-top: 10px;
        font-size: 0.9em;
        text-align: center;
    }
    
    .punnett-table {
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    .punnett-table th, .punnett-table td {
        border: 1px solid #ccc;
        padding: 10px;
    }
    
    .corner-cell {
        background-color: #f0f0f0;
    }
    
    .gamete-header {
        background-color: #f5f5f5;
    }
    
    .punnett-cell {
        padding: 10px;
        vertical-align: top;
    }
    
    .mini-cat {
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        margin: 0 auto 5px;
    }
    
    .mini-tabby {
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(30, 86, 49, 0.3) 3px,
            rgba(30, 86, 49, 0.3) 6px
        );
    }
    
    .mini-spots::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #0047ab;
        opacity: 0.7;
        border-radius: 50%;
        bottom: 2px;
        left: 10px;
    }
    
    .mini-long-hair {
        box-shadow: 0 0 0 3px rgba(211, 211, 211, 0.5);
    }
    
    .cell-genotype {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
        font-size: 0.8em;
    }
    
    .gene-pair {
        display: flex;
        margin: 1px 0;
    }
    
    .cell-phenotype {
        font-size: 0.8em;
        text-align: center;
    }
    
    .phenotype-list {
        list-style-type: none;
        padding: 0;
    }
    
    .phenotype-item {
        margin: 10px 0;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 5px;
    }
    
    .phenotype-probability {
        margin-top: 5px;
        font-weight: bold;
    }
    
    .saved-setting-item {
        margin: 10px 0;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 5px;
    }
    
    .setting-actions {
        margin-top: 5px;
    }
    
    .legend-section {
        margin-bottom: 15px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin: 5px 0;
    }
    
    .color-box {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        border-radius: 3px;
    }
`;

document.head.appendChild(style);