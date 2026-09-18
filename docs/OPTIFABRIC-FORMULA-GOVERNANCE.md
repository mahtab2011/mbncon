# OptiFabric — Formula / Simulation Governance

**Status: documents existing reality as of Stage 2F-3. Introduces no new rule that isn't already being followed in practice, and no new calculation.**

No dedicated formula-governance document existed for OptiFabric before this one. This document exists to make explicit, in one place, a distinction the code and UI already draw correctly: which OptiFabric numbers are real, persisted-data-driven production calculations, and which are illustrative training simulations — plus the rule for changing either kind going forward.

## A. Real / production calculations

**`lib/optifabric/markerFabricConsumptionEngine.ts`** (Stage 2D-1) — the one calculation engine in OptiFabric that is wired to a real project's persisted data and presented as an actual production figure. It computes usable roll length, fabric consumption per garment/set, markers per roll, garments per roll, roll remainder, total fabric required, and (when a cost is supplied) cost per garment — all from a selected `MarkerRun`'s marker length, a project's saved `FabricProfile` (usable fabric width, maximum marker length), `setsPerMarker`, and `orderQuantity`. Its own header comment is explicit that this is "no new arithmetic invented, only the existing, proven formulas [already live in the marker page] given explicit types, validation, and a home outside the page component." Integrated into the "Fabric Planning" / "Usable Roll Requirement" section of `app/optifabric/project/[projectId]/marker/page.tsx` (Stage 2D-2). Covered by 51 self-executing assertions in `lib/optifabric/markerFabricConsumptionEngine.test.ts` — see that file's own header for how to run them.

**`lib/optifabric/engineeringRecommendationsEngine.ts`** (Stage 2E-1) is not itself a calculation — its own header comment states this explicitly: it "does NOT make any engineering judgement of its own about marker safety or fabric consumption," only remaps issues already produced by `productionSafetyGateEngine.ts` and `markerFabricConsumptionEngine.ts` into one shared vocabulary, plus two pure presence/absence checks (does a `FabricProfile` exist, does a pattern piece have a traced grain line). Listed here because it participates in the same real, persisted-data pipeline as the engine above, gated on a saved profile (Stage 2E-4).

## B. Training simulations

Two calculators in the OptiFabric UI compute illustrative fabric-consumption figures that are **not** tied to any saved project data and are **not** the production calculation:

- `app/optifabric/engineering-wizard/page.tsx`
- `app/optifabric/cutting-assistant/fabric-consumption/page.tsx`

Both already carry an explicit amber "Training Simulation" banner in the UI (added in commit `03326a5`, "Clarify OptiFabric legacy consumption demos"), stating the figures are illustrative only and pointing the user to the real, project-based Marker-Based Fabric Consumption feature in the Project → Marker workflow (part A, above). This document does not change that UI or its wording — it only records that the distinction already exists and why.

## C. Formula change rule

- Do not introduce or modify any engineering, fabric-consumption, or marker-optimization formula without explicit review/approval first.
- Any approved formula change must be accompanied by tests proving it (matching the self-executing test convention already used in this directory — see `markerFabricConsumptionEngine.test.ts`, `engineeringRecommendationsEngine.test.ts`, and `apiClient.test.ts` for the pattern and how to run them without a test framework).
- A simulated/illustrative value (part B) must never be presented as, or silently promoted to, an actual production result. If a training simulation and the real engine ever need to share logic, the real engine (part A) is the one source of truth to extract from — never the reverse.

## D. Out of scope / not re-audited

The deeper marker nesting/optimization subsystem — `lib/optifabric/marker/*` (nesting, rotation, placement, quality, scoring, statistics engines) and `lib/optifabric/markerOptimization/*` (hole-filling, compaction, safety-gate, production-release-decision, and related engines) — was **not comprehensively re-audited** during the recent Stage 1 through 2F persistence/entitlement work. That work's scope was project/pattern/marker-run/fabric-profile **persistence** and **entitlement**, not the nesting/optimization algorithms themselves, which predate it and are substantially larger and more mature than anything touched in those stages.

**This document does not certify those deeper algorithms as correct, formula-approved, or audited.** It only records the one real production calculation (part A) that Stage 2D/2E's persistence work directly touched and tested. A future, separate audit of the nesting/optimization subsystem is a distinct piece of work from anything this document covers.
