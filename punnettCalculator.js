import { BlackSeriesAllele, AgoutiAllele, DilutionAllele, WhiteSpottingAllele, HairLengthAllele, createGenotype, getPhenotype, genotypeToString } from './geneticsModel.js';
// Define color representations for each allele
export const AlleleColors = {
    BlackSeries: {
        [BlackSeriesAllele.Black]: '#000000', // Black (dominant)
        [BlackSeriesAllele.Brown]: '#5e4b3b', // Brown
        [BlackSeriesAllele.Cinnamon]: '#9c7a5a' // Cinnamon/light brown
    },
    Agouti: {
        [AgoutiAllele.Agouti]: '#1e5631', // Dark green (dominant)
        [AgoutiAllele.NonAgouti]: '#a1cca5' // Light green
    },
    Dilution: {
        [DilutionAllele.Normal]: '#6a0dad', // Dark purple (dominant)
        [DilutionAllele.Diluted]: '#d8bfd8' // Light purple
    },
    WhiteSpotting: {
        [WhiteSpottingAllele.Spotting]: '#0047ab', // Dark blue (dominant)
        [WhiteSpottingAllele.NoSpotting]: '#add8e6' // Light blue
    },
    HairLength: {
        [HairLengthAllele.Short]: '#808080', // Dark grey (dominant)
        [HairLengthAllele.Long]: '#d3d3d3' // Light grey
    }
};
// Generate all possible gametes from a parent's genotype
export function generateGametes(parent) {
    // For each gene, we can have two possible alleles
    // Total combinations = 2^5 = 32 possible gametes per parent
    const blackSeriesOptions = [parent.blackSeries.allele1, parent.blackSeries.allele2];
    const agoutiOptions = [parent.agouti.allele1, parent.agouti.allele2];
    const dilutionOptions = [parent.dilution.allele1, parent.dilution.allele2];
    const whiteSpottingOptions = [parent.whiteSpotting.allele1, parent.whiteSpotting.allele2];
    const hairLengthOptions = [parent.hairLength.allele1, parent.hairLength.allele2];
    const gametes = [];
    // Generate all combinations (2^5 = 32 gametes)
    for (const blackSeries of blackSeriesOptions) {
        for (const agouti of agoutiOptions) {
            for (const dilution of dilutionOptions) {
                for (const whiteSpotting of whiteSpottingOptions) {
                    for (const hairLength of hairLengthOptions) {
                        gametes.push({
                            blackSeries,
                            agouti,
                            dilution,
                            whiteSpotting,
                            hairLength
                        });
                    }
                }
            }
        }
    }
    return removeDuplicateGametes(gametes);
}
// Remove duplicate gametes (when parent is homozygous for a gene)
function removeDuplicateGametes(gametes) {
    const uniqueGametes = [];
    const seen = new Set();
    for (const gamete of gametes) {
        const key = `${gamete.blackSeries}${gamete.agouti}${gamete.dilution}${gamete.whiteSpotting}${gamete.hairLength}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueGametes.push(gamete);
        }
    }
    return uniqueGametes;
}
// Combine two gametes to create a zygote (new genotype)
export function combineGametes(gamete1, gamete2) {
    return createGenotype(gamete1.blackSeries, gamete2.blackSeries, gamete1.agouti, gamete2.agouti, gamete1.dilution, gamete2.dilution, gamete1.whiteSpotting, gamete2.whiteSpotting, gamete1.hairLength, gamete2.hairLength);
}
// Generate the Punnett square for two parents
export function generatePunnettSquare(parent1, parent2) {
    const parent1Gametes = generateGametes(parent1);
    const parent2Gametes = generateGametes(parent2);
    const genotypes = new Map();
    const phenotypeCount = new Map();
    let totalCount = 0;
    // Fill the Punnett square by crossing all possible gametes
    for (const gamete1 of parent1Gametes) {
        for (const gamete2 of parent2Gametes) {
            const offspring = combineGametes(gamete1, gamete2);
            const genotypeString = genotypeToString(offspring);
            // Count genotypes
            if (genotypes.has(genotypeString)) {
                genotypes.get(genotypeString).count++;
            }
            else {
                genotypes.set(genotypeString, { genotype: offspring, count: 1 });
            }
            // Count phenotypes
            const phenotype = getPhenotype(offspring);
            const phenotypeString = phenotype.description;
            if (phenotypeCount.has(phenotypeString)) {
                phenotypeCount.set(phenotypeString, phenotypeCount.get(phenotypeString) + 1);
            }
            else {
                phenotypeCount.set(phenotypeString, 1);
            }
            totalCount++;
        }
    }
    // Calculate phenotype statistics
    const phenotypeStats = new Map();
    phenotypeCount.forEach((count, phenotype) => {
        const percentage = (count / totalCount) * 100;
        phenotypeStats.set(phenotype, { count, percentage });
    });
    return {
        genotypes,
        totalCount,
        phenotypeStats
    };
}
// Get the data for displaying a Punnett square in the UI
export function getPunnettSquareData(parent1, parent2) {
    const parent1Gametes = generateGametes(parent1);
    const parent2Gametes = generateGametes(parent2);
    const cells = [];
    for (const gamete1 of parent1Gametes) {
        for (const gamete2 of parent2Gametes) {
            const offspring = combineGametes(gamete1, gamete2);
            cells.push({
                gamete1,
                gamete2,
                offspring
            });
        }
    }
    return {
        parent1Gametes,
        parent2Gametes,
        cells
    };
}
// Format gamete for display
export function gameteToString(gamete) {
    return `${gamete.blackSeries}${gamete.agouti}${gamete.dilution}${gamete.whiteSpotting}${gamete.hairLength}`;
}
// Get the color representation for a gamete allele
export function getAlleleColor(alleleType, allele) {
    switch (alleleType) {
        case 'blackSeries':
            return AlleleColors.BlackSeries[allele];
        case 'agouti':
            return AlleleColors.Agouti[allele];
        case 'dilution':
            return AlleleColors.Dilution[allele];
        case 'whiteSpotting':
            return AlleleColors.WhiteSpotting[allele];
        case 'hairLength':
            return AlleleColors.HairLength[allele];
        default:
            return '#cccccc'; // Default gray
    }
}
// Create a colored gamete representation for display
export function createColoredGameteDisplay(gamete) {
    // Create span elements with colored backgrounds for each allele
    return `
        <span class="allele-box" style="background-color: ${AlleleColors.BlackSeries[gamete.blackSeries]}" title="Black Series: ${gamete.blackSeries}">${gamete.blackSeries}</span>
        <span class="allele-box" style="background-color: ${AlleleColors.Agouti[gamete.agouti]}" title="Agouti: ${gamete.agouti}">${gamete.agouti}</span>
        <span class="allele-box" style="background-color: ${AlleleColors.Dilution[gamete.dilution]}" title="Dilution: ${gamete.dilution}">${gamete.dilution}</span>
        <span class="allele-box" style="background-color: ${AlleleColors.WhiteSpotting[gamete.whiteSpotting]}" title="White Spotting: ${gamete.whiteSpotting}">${gamete.whiteSpotting}</span>
        <span class="allele-box" style="background-color: ${AlleleColors.HairLength[gamete.hairLength]}" title="Hair Length: ${gamete.hairLength}">${gamete.hairLength}</span>
    `;
}
//# sourceMappingURL=punnettCalculator.js.map