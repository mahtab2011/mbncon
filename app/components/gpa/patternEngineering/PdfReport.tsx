import SectionCard from "./SectionCard";

export default function PdfReport() {
  return (
    <SectionCard>
      <h2 className="text-2xl font-bold text-slate-800">
        15. PDF Optimization Report
      </h2>

      <p className="mt-2 text-slate-600">
        GPA compiles all engineering calculations into a professional
        optimisation report ready for production review and future PDF export.
      </p>

      <div className="mt-6 rounded-xl bg-indigo-50 p-6">
        <h3 className="text-xl font-bold text-indigo-700">
          Executive Engineering Summary
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Marker Efficiency", "87.8%"],
            ["Fabric / Garment", "1.81 m"],
            ["Estimated Saving", "3.1%"],
            ["Overall AI Rating", "A+"],
          ].map((item) => (
            <div key={item[0]}>
              <div className="text-sm text-slate-600">{item[0]}</div>
              <div className="text-3xl font-bold text-indigo-700">
                {item[1]}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-6 rounded-xl bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800">
          Generate Engineering PDF Report
        </button>
      </div>
    </SectionCard>
  );
}