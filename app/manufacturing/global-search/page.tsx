"use client";

import { useMemo, useState } from "react";

type SearchItem = {
  category: string;
  code: string;
  description: string;
  location: string;
};

const searchData: SearchItem[] = [
  {
    category: "Style",
    code: "HNM-2401",
    description: "H&M Polo Shirt",
    location: "Production Line L-002",
  },
  {
    category: "Style",
    code: "PRM-3307",
    description: "Primark Fleece Hoodie",
    location: "Cutting Command Centre",
  },
  {
    category: "Bundle",
    code: "BDL-008",
    description: "Bundle 008",
    location: "Roll & Bundle Traceability",
  },
  {
    category: "Roll",
    code: "R-014",
    description: "Fabric Roll 014",
    location: "Fabric Inspection",
  },
  {
    category: "Machine",
    code: "MC-014",
    description: "High Risk Sewing Machine",
    location: "Maintenance Intelligence",
  },
  {
    category: "Buyer",
    code: "Primark",
    description: "Buyer Profile",
    location: "Executive Dashboard",
  },
  {
    category: "Buyer",
    code: "H&M",
    description: "Buyer Profile",
    location: "Executive Dashboard",
  },
  {
    category: "Lot",
    code: "LOT-240602",
    description: "Fabric Lot",
    location: "Shade Management",
  },
];

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return searchData.filter((item) =>
      `${item.category} ${item.code} ${item.description} ${item.location}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          AI Global Search Centre
        </h1>

        <p className="mt-2 text-gray-600">
          Search styles, buyers, rolls, bundles, machines,
          lots and manufacturing intelligence from one place.
        </p>

      </div>

      <section className="rounded-xl bg-white p-6 shadow">

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Style, Buyer, Bundle, Roll, Machine..."
          className="w-full rounded-lg border p-4 text-lg outline-none focus:border-blue-500"
        />

      </section>

      <div className="mt-8">

        {query.trim() === "" ? (

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

            <h2 className="text-xl font-bold text-blue-700">
              Suggested Searches
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {[
                "Primark",
                "H&M",
                "MC-014",
                "BDL-008",
                "R-014",
                "LOT-240602",
                "PRM-3307",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="rounded-full bg-white px-4 py-2 shadow hover:bg-blue-100"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

        ) : (

          <div className="space-y-4">

            {results.length === 0 ? (

              <div className="rounded-xl bg-white p-8 text-center shadow">

                <h2 className="text-2xl font-bold text-red-600">
                  No Results Found
                </h2>

              </div>

            ) : (

              results.map((item) => (

                <div
                  key={`${item.category}-${item.code}`}
                  className="rounded-xl bg-white p-6 shadow"
                >

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {item.category}
                      </span>

                      <h2 className="mt-3 text-2xl font-bold text-blue-700">
                        {item.code}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        {item.description}
                      </p>

                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

                      <p className="text-sm text-gray-500">
                        Found In
                      </p>

                      <h3 className="font-bold text-blue-700">
                        {item.location}
                      </h3>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        )}

      </div>

    </main>
  );
}