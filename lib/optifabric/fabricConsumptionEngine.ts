export interface FabricConsumptionInput {
  garmentAreaSqInches: number;
  markerAreaSqInches: number;
  fabricWidthInches: number;
  garmentsPerMarker: number;
  orderQuantity: number;
  fabricPricePerYard: number;
}

export interface FabricConsumptionResult {
  garmentAreaSqInches: number;

  markerAreaSqInches: number;

  markerEfficiency: number;

  airAreaSqInches: number;

  utilizationPercent: number;

  linearLengthPerMarkerInches: number;

  consumptionPerGarmentYards: number;

  totalOrderYards: number;

  estimatedFabricCost: number;

  notes: string[];
}

export function calculateFabricConsumption(
  input: FabricConsumptionInput
): FabricConsumptionResult {

  const markerEfficiency =
    (input.garmentAreaSqInches /
      input.markerAreaSqInches) * 100;

  const airArea =
    input.markerAreaSqInches -
    input.garmentAreaSqInches;

  const linearLength =
    input.markerAreaSqInches /
    input.fabricWidthInches;

  const garmentLength =
    linearLength /
    input.garmentsPerMarker;

  const garmentYards =
    garmentLength / 36;

  const totalYards =
    garmentYards *
    input.orderQuantity;

  const totalCost =
    totalYards *
    input.fabricPricePerYard;

  return {

    garmentAreaSqInches:
      Number(input.garmentAreaSqInches.toFixed(2)),

    markerAreaSqInches:
      Number(input.markerAreaSqInches.toFixed(2)),

    markerEfficiency:
      Number(markerEfficiency.toFixed(2)),

    airAreaSqInches:
      Number(airArea.toFixed(2)),

    utilizationPercent:
      Number(markerEfficiency.toFixed(2)),

    linearLengthPerMarkerInches:
      Number(linearLength.toFixed(2)),

    consumptionPerGarmentYards:
      Number(garmentYards.toFixed(4)),

    totalOrderYards:
      Number(totalYards.toFixed(2)),

    estimatedFabricCost:
      Number(totalCost.toFixed(2)),

    notes: [
      "Marker area calculated.",
      "Fabric utilization calculated.",
      "Air area calculated.",
      "Linear consumption calculated.",
      "Commercial fabric cost estimated.",
    ],
  };

}