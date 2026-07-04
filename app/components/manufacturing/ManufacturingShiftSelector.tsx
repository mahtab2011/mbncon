"use client";

type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

const shifts: Shift[] = [
  {
    id: "shift-a",
    name: "Shift A",
    startTime: "08:00",
    endTime: "17:00",
  },
  {
    id: "shift-b",
    name: "Shift B",
    startTime: "17:00",
    endTime: "02:00",
  },
  {
    id: "general",
    name: "General Shift",
    startTime: "09:00",
    endTime: "18:00",
  },
];

type Props = {
  value?: string;
  onChange?: (shiftId: string) => void;
};

export default function ManufacturingShiftSelector({
  value = "shift-a",
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        Shift
      </label>

      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        {shifts.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {shift.name} ({shift.startTime} - {shift.endTime})
          </option>
        ))}
      </select>
    </div>
  );
}