export class UpdatePatternPieceDto {
  name!: string;
  sequence?: number;
  cutQuantity?: number;
  cutOnFold?: boolean;
  required?: boolean;
  custom?: boolean;
}
