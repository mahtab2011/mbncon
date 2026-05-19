"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/software/LanguageProvider";

type SidebarLink = {
  name: string;
  href: string;
};

type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const label = (en: string, bn: string) => (language === "bn" ? bn : en);

  const sections: SidebarSection[] = [
    {
      title: label("Executive Intelligence", "এক্সিকিউটিভ ইন্টেলিজেন্স"),
      links: [
        {
          name: label("Executive Dashboard", "এক্সিকিউটিভ ড্যাশবোর্ড"),
          href: "/software/executive-dashboard",
        },
        {
          name: label("Executive Command Centre", "এক্সিকিউটিভ কমান্ড সেন্টার"),
          href: "/software/executive-command-centre",
        },
        {
          name: label("Executive Decision Dashboard", "এক্সিকিউটিভ ডিসিশন ড্যাশবোর্ড"),
          href: "/software/executive-decision-dashboard",
        },
        {
          name: label("Executive Analytics Dashboard", "এক্সিকিউটিভ অ্যানালিটিক্স ড্যাশবোর্ড"),
          href: "/software/executive-analytics-dashboard",
        },
        {
          name: label("Executive Recovery Dashboard", "এক্সিকিউটিভ রিকভারি ড্যাশবোর্ড"),
          href: "/software/executive-recovery-dashboard",
        },
        {
          name: label("Executive Report Generator", "এক্সিকিউটিভ রিপোর্ট জেনারেটর"),
          href: "/software/executive-report-generator",
        },
        {
          name: label("AI Enterprise Report Generator", "AI এন্টারপ্রাইজ রিপোর্ট জেনারেটর"),
          href: "/software/ai-enterprise-report-generator",
        },
        {
          name: label("Leadership Dashboard", "লিডারশিপ ড্যাশবোর্ড"),
          href: "/software/leadership-dashboard",
        },
        {
          name: label("AI Management Review Centre", "AI ম্যানেজমেন্ট রিভিউ সেন্টার"),
          href: "/software/ai-management-review-centre",
        },
        {
          name: label("AI Factory War Room", "AI ফ্যাক্টরি ওয়ার রুম"),
          href: "/software/ai-factory-war-room-dashboard",
        },
      ],
    },
    {
      title: label("Demo & Consultancy", "ডেমো ও কনসালটেন্সি"),
      links: [
        {
          name: label("Bangladesh Apparel Demo", "বাংলাদেশ অ্যাপারেল ডেমো"),
          href: "/software/executive-dashboard",
        },
        {
          name: label("Executive Report Demo", "এক্সিকিউটিভ রিপোর্ট ডেমো"),
          href: "/software/executive-report-generator",
        },
        {
          name: label("Lean Kaizen Demo", "লিন কাইজেন ডেমো"),
          href: "/software/lean-kaizen-dashboard",
        },
        {
          name: label("Consultancy Demo", "কনসালটেন্সি ডেমো"),
          href: "/software/consultancy-demo",
        },
        {
          name: label("Assessment Report Generator", "অ্যাসেসমেন্ট রিপোর্ট জেনারেটর"),
          href: "/software/assessment-report-generator",
        },
        {
          name: label("Training Manual", "ট্রেনিং ম্যানুয়াল"),
          href: "/software/training-manual",
        },
      ],
    },
    {
      title: label("Factory Operations", "ফ্যাক্টরি অপারেশনস"),
      links: [
        {
          name: label("Production Entry", "প্রোডাকশন এন্ট্রি"),
          href: "/software/production-entry",
        },
        {
          name: label("Production Planning", "প্রোডাকশন প্ল্যানিং"),
          href: "/software/production-planning-line-balancing",
        },
        {
          name: label("Workforce Entry", "ওয়ার্কফোর্স এন্ট্রি"),
          href: "/software/workforce-entry",
        },
        {
          name: label("Wastage Entry", "ওয়েস্টেজ এন্ট্রি"),
          href: "/software/wastage-entry",
        },
        {
          name: label("Inventory Entry", "ইনভেন্টরি এন্ট্রি"),
          href: "/software/inventory-entry",
        },
        {
          name: label("Maintenance Entry", "মেইনটেন্যান্স এন্ট্রি"),
          href: "/software/maintenance-entry",
        },
        {
          name: label("Utilities Entry", "ইউটিলিটি এন্ট্রি"),
          href: "/software/utilities-entry",
        },
        {
          name: label("Export Entry", "এক্সপোর্ট এন্ট্রি"),
          href: "/software/export-entry",
        },
      ],
    },
    {
      title: label("Manufacturing Intelligence", "ম্যানুফ্যাকচারিং ইন্টেলিজেন্স"),
      links: [
        {
          name: label("Predictive Intelligence", "প্রেডিক্টিভ ইন্টেলিজেন্স"),
          href: "/software/predictive-intelligence",
        },
        {
          name: label("Forecasting Intelligence", "ফোরকাস্টিং ইন্টেলিজেন্স"),
          href: "/software/forecasting-intelligence",
        },
        {
          name: label("Value Added Productivity", "ভ্যালু অ্যাডেড প্রোডাক্টিভিটি"),
          href: "/software/value-added-productivity",
        },
        {
          name: label("Factory Loss Intelligence", "ফ্যাক্টরি লস ইন্টেলিজেন্স"),
          href: "/software/factory-loss-intelligence",
        },
        {
          name: label("Post Order Recovery", "পোস্ট অর্ডার রিকভারি"),
          href: "/software/post-order-recovery-intelligence",
        },
        {
          name: label("Production Bottleneck Intelligence", "প্রোডাকশন বটলনেক ইন্টেলিজেন্স"),
          href: "/software/ai-production-bottleneck-intelligence",
        },
        {
          name: label("Production Capacity Intelligence", "প্রোডাকশন ক্যাপাসিটি ইন্টেলিজেন্স"),
          href: "/software/ai-production-capacity-intelligence",
        },
        {
          name: label("Line Balancing Intelligence", "লাইন ব্যালান্সিং ইন্টেলিজেন্স"),
          href: "/software/ai-line-balancing-intelligence",
        },
        {
          name: label("Machine Utilization Intelligence", "মেশিন ইউটিলাইজেশন ইন্টেলিজেন্স"),
          href: "/software/ai-machine-utilization-intelligence",
        },
        {
          name: label("Preventive Maintenance Intelligence", "প্রিভেন্টিভ মেইনটেন্যান্স ইন্টেলিজেন্স"),
          href: "/software/ai-preventive-maintenance-intelligence",
        },
      ],
    },
    {
      title: label("Workforce & Productivity", "ওয়ার্কফোর্স ও প্রোডাক্টিভিটি"),
      links: [
        {
          name: label("Workforce Intelligence", "ওয়ার্কফোর্স ইন্টেলিজেন্স"),
          href: "/software/workforce-intelligence",
        },
        {
          name: label("AI Idle Manpower Intelligence", "AI আইডল ম্যানপাওয়ার ইন্টেলিজেন্স"),
          href: "/software/ai-idle-manpower-intelligence",
        },
        {
          name: label("AI Overtime Optimization", "AI ওভারটাইম অপ্টিমাইজেশন"),
          href: "/software/ai-overtime-optimization-intelligence",
        },
        {
          name: label("AI Department Performance Ranking", "AI ডিপার্টমেন্ট পারফরম্যান্স র‍্যাংকিং"),
          href: "/software/ai-department-performance-ranking",
        },
        {
          name: label("AI Department Risk Heatmap", "AI ডিপার্টমেন্ট রিস্ক হিটম্যাপ"),
          href: "/software/ai-department-risk-heatmap",
        },
        {
          name: label("AI Productivity Intelligence", "AI প্রোডাক্টিভিটি ইন্টেলিজেন্স"),
          href: "/software/ai-productivity-intelligence",
        },
      ],
    },
    {
      title: label("Quality, Lean & Improvement", "কোয়ালিটি, লিন ও উন্নয়ন"),
      links: [
        {
          name: label("Quality Entry", "কোয়ালিটি এন্ট্রি"),
          href: "/software/quality-entry",
        },
        {
          name: label("Quality Intelligence", "কোয়ালিটি ইন্টেলিজেন্স"),
          href: "/software/quality-intelligence",
        },
        {
          name: label("Raw Material Quality", "র-মেটেরিয়াল কোয়ালিটি"),
          href: "/software/raw-material-quality-entry",
        },
        {
          name: label("Compliance Audit", "কমপ্লায়েন্স অডিট"),
          href: "/software/compliance-audit-intelligence",
        },
        {
          name: label("Lean Kaizen Dashboard", "লিন কাইজেন ড্যাশবোর্ড"),
          href: "/software/lean-kaizen-dashboard",
        },
        {
          name: label("Lean Kaizen Entry", "লিন কাইজেন এন্ট্রি"),
          href: "/software/lean-kaizen-entry",
        },
        {
          name: label("Lean Audit Checklist", "লিন অডিট চেকলিস্ট"),
          href: "/software/lean-audit-checklist",
        },
        {
          name: label("Kaizen Action Tracker", "কাইজেন অ্যাকশন ট্র্যাকার"),
          href: "/software/kaizen-action-tracker",
        },
        {
          name: label("Root Cause Analysis", "রুট কজ অ্যানালাইসিস"),
          href: "/software/root-cause-analysis",
        },
        {
          name: label("Corrective Action Tracker", "করেক্টিভ অ্যাকশন ট্র্যাকার"),
          href: "/software/corrective-action-tracker",
        },
        {
          name: label("TQM Entry", "TQM এন্ট্রি"),
          href: "/software/tqm-entry",
        },
        {
          name: label("AI TQM Intelligence Centre", "AI TQM ইন্টেলিজেন্স সেন্টার"),
          href: "/software/ai-tqm-intelligence-centre",
        },
        {
          name: label("Business Excellence", "বিজনেস এক্সেলেন্স"),
          href: "/software/business-excellence-maturity",
        },
      ],
    },
    {
      title: label("Buyer, Order & Profitability", "বায়ার, অর্ডার ও প্রফিটেবিলিটি"),
      links: [
        {
          name: label("Buyer Order Entry", "বায়ার অর্ডার এন্ট্রি"),
          href: "/software/buyer-order-entry",
        },
        {
          name: label("Universal Manufacturing Order Entry", "ইউনিভার্সাল ম্যানুফ্যাকচারিং অর্ডার এন্ট্রি"),
          href: "/software/universal-manufacturing-order-entry",
        },
        {
          name: label("Buyer Executive Summary", "বায়ার এক্সিকিউটিভ সামারি"),
          href: "/software/buyer-executive-summary",
        },
        {
          name: label("AI Buyer Risk Intelligence", "AI বায়ার রিস্ক ইন্টেলিজেন্স"),
          href: "/software/ai-buyer-risk-intelligence",
        },
        {
          name: label("AI Buyer Profitability", "AI বায়ার প্রফিটেবিলিটি"),
          href: "/software/ai-buyer-profitability-intelligence",
        },
        {
          name: label("AI Order Profitability", "AI অর্ডার প্রফিটেবিলিটি"),
          href: "/software/ai-order-profitability-intelligence",
        },
        {
          name: label("AI Profit Leakage Intelligence", "AI প্রফিট লিকেজ ইন্টেলিজেন্স"),
          href: "/software/ai-profit-leakage-intelligence",
        },
        {
          name: label("Costing & Profitability Entry", "কস্টিং ও প্রফিটেবিলিটি এন্ট্রি"),
          href: "/software/costing-profitability-entry",
        },
        {
          name: label("Accounts Receivable Cashflow", "অ্যাকাউন্টস রিসিভেবল ক্যাশফ্লো"),
          href: "/software/accounts-receivable-cashflow-intelligence",
        },
      ],
    },
    {
      title: label("Supply Chain & Logistics", "সাপ্লাই চেইন ও লজিস্টিকস"),
      links: [
        {
          name: label("Supplier Order Entry", "সাপ্লায়ার অর্ডার এন্ট্রি"),
          href: "/software/supplier-order-entry",
        },
        {
          name: label("Supplier Delay Intelligence", "সাপ্লায়ার ডিলে ইন্টেলিজেন্স"),
          href: "/software/supplier-delay-intelligence",
        },
        {
          name: label("Material Entry", "মেটেরিয়াল এন্ট্রি"),
          href: "/software/material-entry",
        },
        {
          name: label("Shipment Entry", "শিপমেন্ট এন্ট্রি"),
          href: "/software/shipment-entry",
        },
        {
          name: label("Shipment Schedule", "শিপমেন্ট শিডিউল"),
          href: "/software/shipment-schedule-entry",
        },
        {
          name: label("Shipping Line Booking", "শিপিং লাইন বুকিং"),
          href: "/software/shipping-line-booking-entry",
        },
        {
          name: label("Local Transport Booking", "লোকাল ট্রান্সপোর্ট বুকিং"),
          href: "/software/local-transport-booking-entry",
        },
        {
          name: label("Transport & Logistics", "ট্রান্সপোর্ট ও লজিস্টিকস"),
          href: "/software/transport-logistics-intelligence",
        },
        {
          name: label("Warehouse Productivity", "ওয়্যারহাউস প্রোডাক্টিভিটি"),
          href: "/software/warehouse-productivity-intelligence",
        },
        {
          name: label("Warehouse Security", "ওয়্যারহাউস সিকিউরিটি"),
          href: "/software/warehouse-security-loss-intelligence",
        },
      ],
    },
    {
      title: label("Risk, Alerts & Recovery", "রিস্ক, অ্যালার্ট ও রিকভারি"),
      links: [
        {
          name: label("AI Cashflow Risk", "AI ক্যাশফ্লো রিস্ক"),
          href: "/software/ai-cashflow-risk-intelligence",
        },
        {
          name: label("AI Compliance Risk", "AI কমপ্লায়েন্স রিস্ক"),
          href: "/software/ai-compliance-risk-intelligence",
        },
        {
          name: label("AI Shipment Delay Prediction", "AI শিপমেন্ট ডিলে প্রেডিকশন"),
          href: "/software/ai-shipment-delay-prediction-engine",
        },
        {
          name: label("AI Air Shipment Risk", "AI এয়ার শিপমেন্ট রিস্ক"),
          href: "/software/ai-air-shipment-risk-engine",
        },
        {
          name: label("AI Executive Escalation Engine", "AI এক্সিকিউটিভ এস্কেলেশন ইঞ্জিন"),
          href: "/software/ai-executive-escalation-engine",
        },
        {
          name: label("AI Notification & Escalation", "AI নোটিফিকেশন ও এস্কেলেশন"),
          href: "/software/ai-notification-escalation-centre",
        },
        {
          name: label("Risk Escalation Entry", "রিস্ক এস্কেলেশন এন্ট্রি"),
          href: "/software/risk-escalation-entry",
        },
        {
          name: label("Anomaly Detection", "অ্যানোমালি ডিটেকশন"),
          href: "/software/anomaly-detection",
        },
        {
          name: label("Factory Benchmark", "ফ্যাক্টরি বেঞ্চমার্ক"),
          href: "/software/factory-benchmark",
        },
      ],
    },
    {
      title: label("Leadership & Human Performance", "লিডারশিপ ও মানব পারফরম্যান্স"),
      links: [
        {
          name: label("Adaptive Leadership", "অ্যাডাপটিভ লিডারশিপ"),
          href: "/software/adaptive-leadership-assessment",
        },
        {
          name: label("Inner Game of Tennis", "ইনার গেম অব টেনিস"),
          href: "/software/inner-game-of-tennis",
        },
        {
          name: label("Inner Game of Management", "ইনার গেম অব ম্যানেজমেন্ট"),
          href: "/software/inner-game-of-management",
        },
        {
          name: label("Gemba Observation", "গেম্বা অবজারভেশন"),
          href: "/software/gemba-observation",
        },
        {
          name: label("Muda Scoring", "মুডা স্কোরিং"),
          href: "/software/muda-scoring",
        },
        {
          name: label("Value Stream Mapping", "ভ্যালু স্ট্রিম ম্যাপিং"),
          href: "/software/value-stream-mapping",
        },
      ],
    },
    {
      title: label("Governance, Security & ESG", "গভর্ন্যান্স, সিকিউরিটি ও ESG"),
      links: [
        {
          name: label("Document & Evidence Control", "ডকুমেন্ট ও এভিডেন্স কন্ট্রোল"),
          href: "/software/ai-document-evidence-control-centre",
        },
        {
          name: label("User Role & Access Control", "ইউজার রোল ও অ্যাক্সেস কন্ট্রোল"),
          href: "/software/ai-user-role-access-control-centre",
        },
        {
          name: label("Sustainability & ESG", "সাসটেইনেবিলিটি ও ESG"),
          href: "/software/sustainability-esg-intelligence",
        },
        {
          name: label("Energy & Utility Cost Intelligence", "এনার্জি ও ইউটিলিটি কস্ট ইন্টেলিজেন্স"),
          href: "/software/ai-utility-cost-intelligence",
        },
        {
          name: label("Butcher Shop Intelligence", "বুচার শপ ইন্টেলিজেন্স"),
          href: "/software/butcher-shop-intelligence",
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r border-white/10 bg-black text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-black px-6 py-6">
        <h1 className="break-words text-2xl font-bold tracking-wide text-cyan-400">
          MBNCON
        </h1>

        <p className="mt-2 break-words text-sm leading-relaxed text-neutral-400">
          {t.platformTitle}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8 pb-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {section.title}
              </h2>

              <div className="space-y-1">
                {section.links.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-200 break-words ${
                        active
                          ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10"
                          : "text-neutral-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 p-4 text-xs text-neutral-500">
        © 2026 MBNCON Intelligence Systems
      </div>
    </aside>
  );
}