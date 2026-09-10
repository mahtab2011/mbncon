"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  createEngineeringProject,
  garmentSelectionHierarchy,
  GarmentCategory,
  GarmentMainCategory,
  GarmentSubcategory,
  getGarmentDisplayName,
  getGarmentsBySubcategory,
  getGarmentSubcategories,
} from "@/lib/optifabric/projectMaster";
import {
  createProject as createServerProject,
  mapPatternsToInitialPatterns,
  type CachedProject,
} from "@/lib/optifabric/projectApi";

function formatHierarchyLabel(value: string): string {
  return value
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function NewEngineeringProjectPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState(
    "EDS-001 Men's Basic Shirt"
  );

  const [customer, setCustomer] = useState(
    "OptiFabric Engineering Demo"
  );

  const [styleNumber, setStyleNumber] = useState("EDS-001");

  const [mainCategory, setMainCategory] =
    useState<GarmentMainCategory>("woven");

  const [subcategory, setSubcategory] =
    useState<GarmentSubcategory>("tops");

  const [garmentCategory, setGarmentCategory] =
    useState<GarmentCategory>("shirt");

  const [fabricWidth, setFabricWidth] = useState("60");
  const [orderQuantity, setOrderQuantity] = useState("1200");
  const [scaleLength, setScaleLength] = useState("12");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableSubcategories = useMemo(() => {
    return getGarmentSubcategories(mainCategory);
  }, [mainCategory]);

  const availableGarments = useMemo(() => {
    return getGarmentsBySubcategory(
      mainCategory,
      subcategory
    );
  }, [mainCategory, subcategory]);

  const selectedMainCategory = useMemo(() => {
    return garmentSelectionHierarchy.find(
      (category) => category.id === mainCategory
    );
  }, [mainCategory]);

  const selectedSubcategory = useMemo(() => {
    return availableSubcategories.find(
      (item) => item.id === subcategory
    );
  }, [availableSubcategories, subcategory]);

  const selectedGarment = useMemo(() => {
    return availableGarments.find(
      (garment) => garment.id === garmentCategory
    );
  }, [availableGarments, garmentCategory]);

  function handleMainCategoryChange(
    selectedMainCategoryId: GarmentMainCategory
  ) {
    setMainCategory(selectedMainCategoryId);
    setError("");

    const nextSubcategories =
      getGarmentSubcategories(selectedMainCategoryId);

    const firstSubcategory = nextSubcategories[0];

    if (!firstSubcategory) {
      setSubcategory("custom");
      setGarmentCategory("other");
      return;
    }

    setSubcategory(firstSubcategory.id);

    const firstGarment = firstSubcategory.garments[0];

    setGarmentCategory(
      firstGarment?.id ?? "other"
    );
  }

  function handleSubcategoryChange(
    selectedSubcategoryId: GarmentSubcategory
  ) {
    setSubcategory(selectedSubcategoryId);
    setError("");

    const nextGarments = getGarmentsBySubcategory(
      mainCategory,
      selectedSubcategoryId
    );

    setGarmentCategory(
      nextGarments[0]?.id ?? "other"
    );
  }

  function handleGarmentChange(
    selectedGarmentCategory: GarmentCategory
  ) {
    setGarmentCategory(selectedGarmentCategory);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const width = Number(fabricWidth);
    const quantity = Number(orderQuantity);
    const scale = Number(scaleLength);

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!customer.trim()) {
      setError("Please enter the customer or factory name.");
      return;
    }

    if (!styleNumber.trim()) {
      setError("Please enter the style number.");
      return;
    }

    if (!mainCategory) {
      setError("Please select a main garment category.");
      return;
    }

    if (!subcategory) {
      setError("Please select a garment subcategory.");
      return;
    }

    if (!garmentCategory) {
      setError("Please select a garment.");
      return;
    }

    if (!Number.isFinite(width) || width <= 0) {
      setError(
        "Fabric width must be greater than zero."
      );
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      setError(
        "Order quantity must be a whole number greater than zero."
      );
      return;
    }

    if (!Number.isFinite(scale) || scale <= 0) {
      setError(
        "Calibration scale length must be greater than zero."
      );
      return;
    }

    // Built locally first (pure, synchronous — unchanged logic) so its
    // standard pattern set can be sent to the server in the same request
    // that creates the project, rather than needing N follow-up calls.
    const localProject = createEngineeringProject(
      projectName.trim(),
      customer.trim(),
      styleNumber.trim(),
      garmentCategory,
      width,
      quantity,
      scale
    );

    // Server-first: POST the complete basic project (plus its initial
    // pattern set) before anything is written locally. The server's
    // id/code/createdAt/updatedAt/archivedAt are authoritative — if this
    // fails (network, validation, offline, auth), nothing is saved
    // anywhere and the user is told plainly, rather than silently falling
    // back to a local-only "saved" project.
    setSubmitting(true);

    let serverProject;

    try {
      serverProject = await createServerProject({
        name: projectName.trim(),
        customer: customer.trim(),
        styleNumber: styleNumber.trim(),
        garmentCategory,
        mainCategory,
        subcategory,
        fabricWidth: width,
        orderQuantity: quantity,
        scaleLength: scale,
        patterns: mapPatternsToInitialPatterns(localProject.patterns),
      });
    } catch (submitError) {
      console.error(
        "Unable to create OptiFabric project on the server:",
        submitError
      );

      setError(
        "The project could not be saved. Please check your connection and try again — nothing was saved."
      );

      setSubmitting(false);
      return;
    }

    // The local working copy keeps its existing shape (patterns, hierarchy
    // lookups, etc. — createEngineeringProject's own logic, unchanged) but
    // adopts the server's authoritative id/createdAt, tagged with the
    // server metadata so later pages know this project is server-backed.
    const cachedProject: CachedProject = {
      ...localProject,
      id: serverProject.id,
      createdAt: serverProject.createdAt,
      _server: {
        code: serverProject.code,
        updatedAt: serverProject.updatedAt,
        archivedAt: serverProject.archivedAt,
      },
    };

    localStorage.setItem(
      `optifabric-project-${serverProject.id}`,
      JSON.stringify(cachedProject)
    );

    localStorage.setItem(
      "optifabric-active-project-id",
      serverProject.id
    );

    router.push(
      `/optifabric/project/${serverProject.id}`
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-7 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            OptiFabric AI RC2
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Create Engineering Project
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            Select the garment through the engineering
            hierarchy, create the project and load the
            correct standard pattern library automatically.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8"
        >
          <section>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Project identification
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Project Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="font-bold text-slate-200">
                  Project Name
                </span>

                <input
                  value={projectName}
                  onChange={(event) =>
                    setProjectName(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Example: EDS-001 Men's Basic Shirt"
                />
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  Customer or Factory
                </span>

                <input
                  value={customer}
                  onChange={(event) =>
                    setCustomer(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Customer or factory name"
                />
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  Style Number
                </span>

                <input
                  value={styleNumber}
                  onChange={(event) =>
                    setStyleNumber(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Example: EDS-001"
                />
              </label>
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-slate-950/50 p-5 sm:p-7">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Garment engineering hierarchy
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Select Garment
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-400">
              Select the main category first, then the
              subcategory and finally the exact garment.
              OptiFabric will load the corresponding
              engineering pattern master.
            </p>

            <div className="mt-7 grid gap-6 lg:grid-cols-3">
              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  1. Main Category
                </span>

                <select
                  value={mainCategory}
                  onChange={(event) =>
                    handleMainCategoryChange(
                      event.target
                        .value as GarmentMainCategory
                    )
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  {garmentSelectionHierarchy.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  2. Subcategory
                </span>

                <select
                  value={subcategory}
                  onChange={(event) =>
                    handleSubcategoryChange(
                      event.target
                        .value as GarmentSubcategory
                    )
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  {availableSubcategories.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  3. Garment
                </span>

                <select
                  value={garmentCategory}
                  onChange={(event) =>
                    handleGarmentChange(
                      event.target
                        .value as GarmentCategory
                    )
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  {availableGarments.map(
                    (garment) => (
                      <option
                        key={garment.id}
                        value={garment.id}
                      >
                        {garment.name}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              <SelectionCard
                number="01"
                label="Main Category"
                value={
                  selectedMainCategory?.name ??
                  formatHierarchyLabel(mainCategory)
                }
                description={
                  selectedMainCategory?.description ??
                  "Selected garment division."
                }
              />

              <SelectionCard
                number="02"
                label="Subcategory"
                value={
                  selectedSubcategory?.name ??
                  formatHierarchyLabel(subcategory)
                }
                description={
                  selectedSubcategory?.description ??
                  "Selected garment subcategory."
                }
              />

              <SelectionCard
                number="03"
                label="Garment"
                value={getGarmentDisplayName(
                  garmentCategory
                )}
                description={
                  selectedGarment?.description ??
                  "Selected garment engineering master."
                }
              />
            </div>
          </section>

          <section className="mt-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Engineering inputs
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Order and Calibration Data
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  Fabric Width (inches)
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={fabricWidth}
                  onChange={(event) =>
                    setFabricWidth(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-200">
                  Order Quantity (pieces)
                </span>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={orderQuantity}
                  onChange={(event) =>
                    setOrderQuantity(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="font-bold text-slate-200">
                  Calibration Scale Length (inches)
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={scaleLength}
                  onChange={(event) =>
                    setScaleLength(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-5">
            <h2 className="font-black text-cyan-300">
              Why does AI ask for this?
            </h2>

            <p className="mt-2 leading-7 text-slate-300">
              The category hierarchy tells OptiFabric which
              engineering pattern library to load. The
              customer, style, fabric width, order quantity
              and calibration scale then remain connected to
              every uploaded pattern, marker calculation,
              consumption result and engineering report.
            </p>
          </section>

          {error ? (
            <p className="mt-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 font-semibold text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Saving Project..."
              : `Create ${getGarmentDisplayName(
                  garmentCategory
                )} Engineering Project`}
          </button>
        </form>
      </div>
    </main>
  );
}

function SelectionCard({
  number,
  label,
  value,
  description,
}: {
  number: string;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950">
          {number}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-black text-white">
        {value}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}