import { InitialPatternPieceDto } from "./initial-pattern-piece.dto";

// Mirrors lib/optifabric/projectMaster.ts's EngineeringProject core fields
// (Stage 1B) so the frontend can round-trip its project object through this
// backend — mainCategory/subcategory are optional here for the same reason
// they're optional on EngineeringProject itself (garmentMainCategory?/
// garmentSubcategory?): older locally-stored projects may not carry them.
export class CreateProjectDto {
  name!: string;
  customer!: string;
  styleNumber!: string;
  garmentCategory!: string;
  mainCategory?: string;
  subcategory?: string;
  fabricWidth!: number;
  orderQuantity!: number;
  scaleLength!: number;
  // Stage 2A: the standard/initial pattern-piece set createEngineeringProject
  // populates client-side (lib/optifabric/projectMaster.ts), persisted
  // atomically with the project so it survives on a fresh device/browser —
  // see ProjectsService.createProject. Geometry is never included here.
  patterns?: InitialPatternPieceDto[];
}
