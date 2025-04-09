// Cat Genetics Model
// This file defines the genetic traits and inheritance patterns for cats

// Define the trait types
export enum BlackSeriesAllele {
    Black = 'B',      // Black - dominant
    Brown = 'b',      // Brown - recessive to B
    Cinnamon = "b'"   // Cinnamon - recessive to B and b
}

export enum AgoutiAllele {
    Agouti = 'A',     // Tabby pattern - dominant
    NonAgouti = 'a'   // Solid color - recessive
}

export enum DilutionAllele {
    Normal = 'D',     // Normal color - dominant
    Diluted = 'd'     // Diluted color - recessive
}

export enum WhiteSpottingAllele {
    Spotting = 'S',   // White spotting - dominant
    NoSpotting = 's'  // No white spotting - recessive
}

export enum HairLengthAllele {
    Short = 'L',      // Short hair - dominant
    Long = 'l'        // Long hair - recessive
}

// Define a gene with two alleles (diploid)
export interface Gene<T> {
    allele1: T;
    allele2: T;
}

// Define the full cat genotype
export interface CatGenotype {
    blackSeries: Gene<BlackSeriesAllele>;
    agouti: Gene<AgoutiAllele>;
    dilution: Gene<DilutionAllele>;
    whiteSpotting: Gene<WhiteSpottingAllele>;
    hairLength: Gene<HairLengthAllele>;
}

// Define the cat phenotype (physical appearance)
export interface CatPhenotype {
    baseColor: string;  // Black, Brown, Cinnamon
    pattern: string;    // Tabby or Solid
    dilution: string;   // Normal or Diluted
    spotting: string;   // With or without white spots
    hairLength: string; // Short or Long
    description: string; // Full description
}

// Get the phenotype from a genotype
export function getPhenotype(genotype: CatGenotype): CatPhenotype {
    // Determine base color (Black series)
    let baseColor = determineBaseColor(genotype.blackSeries);
    
    // Determine pattern (Agouti)
    let pattern = determinePattern(genotype.agouti);
    
    // Determine dilution
    let dilution = determineDilution(genotype.dilution);
    
    // Determine white spotting
    let spotting = determineSpotting(genotype.whiteSpotting);
    
    // Determine hair length
    let hairLength = determineHairLength(genotype.hairLength);
    
    // Create full description
    let description = `${dilution} ${baseColor} ${pattern} with ${hairLength} hair${spotting}`;
    
    return {
        baseColor,
        pattern,
        dilution,
        spotting,
        hairLength,
        description
    };
}

// Helper functions to determine phenotype from genotype

// Determine base color based on Black series gene
function determineBaseColor(gene: Gene<BlackSeriesAllele>): string {
    // B is dominant over b and b'
    // b is dominant over b'
    if (gene.allele1 === BlackSeriesAllele.Black || gene.allele2 === BlackSeriesAllele.Black) {
        return "Black";
    } else if (gene.allele1 === BlackSeriesAllele.Brown || gene.allele2 === BlackSeriesAllele.Brown) {
        return "Brown";
    } else {
        return "Cinnamon";
    }
}

// Determine pattern based on Agouti gene
function determinePattern(gene: Gene<AgoutiAllele>): string {
    // A is dominant over a
    if (gene.allele1 === AgoutiAllele.Agouti || gene.allele2 === AgoutiAllele.Agouti) {
        return "Tabby";
    } else {
        return "Solid";
    }
}

// Determine dilution based on Dilution gene
function determineDilution(gene: Gene<DilutionAllele>): string {
    // D is dominant over d
    if (gene.allele1 === DilutionAllele.Normal || gene.allele2 === DilutionAllele.Normal) {
        return "Normal";
    } else {
        return "Diluted";
    }
}

// Determine white spotting based on White spotting gene
function determineSpotting(gene: Gene<WhiteSpottingAllele>): string {
    // S is dominant over s
    if (gene.allele1 === WhiteSpottingAllele.Spotting || gene.allele2 === WhiteSpottingAllele.Spotting) {
        return " with white spots";
    } else {
        return "";
    }
}

// Determine hair length based on Hair length gene
function determineHairLength(gene: Gene<HairLengthAllele>): string {
    // L is dominant over l
    if (gene.allele1 === HairLengthAllele.Short || gene.allele2 === HairLengthAllele.Short) {
        return "short";
    } else {
        return "long";
    }
}

// Get gene representation as string
export function geneToString<T>(gene: Gene<T>): string {
    return `${gene.allele1}${gene.allele2}`;
}

// Get full genotype representation as string
export function genotypeToString(genotype: CatGenotype): string {
    return `${geneToString(genotype.blackSeries)} ${geneToString(genotype.agouti)} ${geneToString(genotype.dilution)} ${geneToString(genotype.whiteSpotting)} ${geneToString(genotype.hairLength)}`;
}

// Create a genotype from allele strings
export function createGenotype(
    blackSeries1: BlackSeriesAllele,
    blackSeries2: BlackSeriesAllele,
    agouti1: AgoutiAllele,
    agouti2: AgoutiAllele,
    dilution1: DilutionAllele,
    dilution2: DilutionAllele,
    whiteSpotting1: WhiteSpottingAllele,
    whiteSpotting2: WhiteSpottingAllele,
    hairLength1: HairLengthAllele,
    hairLength2: HairLengthAllele
): CatGenotype {
    return {
        blackSeries: { allele1: blackSeries1, allele2: blackSeries2 },
        agouti: { allele1: agouti1, allele2: agouti2 },
        dilution: { allele1: dilution1, allele2: dilution2 },
        whiteSpotting: { allele1: whiteSpotting1, allele2: whiteSpotting2 },
        hairLength: { allele1: hairLength1, allele2: hairLength2 }
    };
}

// Get CSS color for phenotype visualization
export function getPhenotypeColors(phenotype: CatPhenotype): {
    baseColor: string;
    patternColor: string;
    dilutionModifier: number;
    spottingColor: string | null;
    hairLengthModifier: number;
} {
    let baseColorHex = '';
    let dilutionModifier = 1.0; // 1.0 means no change
    let patternColor = '';
    let spottingColor: string | null = null;
    let hairLengthModifier = 1.0; // 1.0 means no change

    // Set base color based on the Black series
    switch (phenotype.baseColor) {
        case 'Black':
            baseColorHex = '#000000'; // Black
            break;
        case 'Brown':
            baseColorHex = '#5e4b3b'; // Brown
            break;
        case 'Cinnamon':
            baseColorHex = '#9c7a5a'; // Cinnamon
            break;
    }

    // Set pattern color
    switch (phenotype.pattern) {
        case 'Tabby':
            patternColor = '#1e5631'; // Dark green for Agouti
            break;
        case 'Solid':
            patternColor = '#a1cca5'; // Light green for Non-Agouti
            break;
    }

    // Set dilution modifier
    switch (phenotype.dilution) {
        case 'Normal':
            dilutionModifier = 1.0;
            break;
        case 'Diluted':
            dilutionModifier = 0.6; // Makes colors lighter
            break;
    }

    // Set spotting color
    if (phenotype.spotting === ' with white spots') {
        spottingColor = '#0047ab'; // Blue for white spotting
    }

    // Set hair length modifier
    switch (phenotype.hairLength) {
        case 'short':
            hairLengthModifier = 1.0;
            break;
        case 'long':
            hairLengthModifier = 0.8; // Slightly lighter for long hair
            break;
    }

    return {
        baseColor: baseColorHex,
        patternColor,
        dilutionModifier,
        spottingColor,
        hairLengthModifier
    };
}

// Get representation of genetic dominance for a specific gene
export function isDominant<T>(gene: Gene<T>, dominantAllele: T): boolean {
    return gene.allele1 === dominantAllele || gene.allele2 === dominantAllele;
}