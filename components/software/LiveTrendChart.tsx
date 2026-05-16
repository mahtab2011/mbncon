"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useLanguage } from "@/components/software/LanguageProvider";

type TrendData = {
  period: string;
  value: number;
};

type Props = {
  title: string;
  data: TrendData[];
  dataKey?: string;
};

export default function LiveTrendChart({
  title,
  data,
  dataKey = "value",
}: Props) {
  const { language } = useLanguage();

  const labels = {
    en: {
      subtitle: "Live operational trend visualization",
    },
    bn: {
      subtitle: "লাইভ অপারেশনাল ট্রেন্ড ভিজ্যুয়ালাইজেশন",
    },
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-neutral-500">
          {labels[language].subtitle}
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="period" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}