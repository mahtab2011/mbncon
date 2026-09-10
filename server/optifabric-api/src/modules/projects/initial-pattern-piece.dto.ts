// One entry of CreateProjectDto.patterns — the same fields
// UpdatePatternPieceDto accepts, plus patternId (which PATCH .../patterns/
// :patternId normally takes from the URL; here there is no URL segment per
// piece, since the whole set is created atomically with the project).
export class InitialPatternPieceDto {
  patternId!: string;
  name!: string;
  sequence?: number;
  cutQuantity?: number;
  cutOnFold?: boolean;
  required?: boolean;
  custom?: boolean;
}
