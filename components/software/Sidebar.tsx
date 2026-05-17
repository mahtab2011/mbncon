"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/software/LanguageProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const label = (en: string, bn: string) =>
    language === "bn" ? bn : en;

  const sectionCardClass =
  "block rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-200 break-words";
  const sections = [
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
          name: label("Leadership Dashboard", "লিডারশিপ ড্যাশবোর্ড"),
          href: "/software/leadership-dashboard",
        },
        {
          name: label(
            "AI Management Review Centre",
            "AI ম্যানেজমেন্ট রিভিউ সেন্টার"
          ),
          href: "/software/ai-management-review-centre",
        },
        {
          name: label(
            "AI Enterprise Report Generator",
            "AI এন্টারপ্রাইজ রিপোর্ট জেনারেটর"
          ),
          href: "/software/ai-enterprise-report-generator",
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
          name: label("Compliance Audit", "কমপ্লায়েন্স অডিট"),
          href: "/software/compliance-audit-intelligence",
        },
        {
          name: label("Lean Kaizen Entry", "লিন কাইজেন এন্ট্রি"),
          href: "/software/lean-kaizen-entry",
        },
        {
          name: label("TQM Entry", "TQM এন্ট্রি"),
          href: "/software/tqm-entry",
        },
        {
          name: label("Business Excellence", "বিজনেস এক্সেলেন্স"),
          href: "/software/business-excellence-maturity",
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
          name: label("Shipment Entry", "শিপমেন্ট এন্ট্রি"),
          href: "/software/shipment-entry",
        },
        {
          name: label("Export Entry", "এক্সপোর্ট এন্ট্রি"),
          href: "/software/export-entry",
        },
        {
          name: label("Transport & Logistics", "ট্রান্সপোর্ট ও লজিস্টিকস"),
          href: "/software/transport-logistics-intelligence",
        },
        {
          name: label("Warehouse Security", "ওয়্যারহাউস সিকিউরিটি"),
          href: "/software/warehouse-security-loss-intelligence",
        },
      ],
    },

    {
      title: label("AI Risk & Profitability", "AI ঝুঁকি ও প্রফিটেবিলিটি"),
      links: [
        {
          name: label("AI Cashflow Risk", "AI ক্যাশফ্লো রিস্ক"),
          href: "/software/ai-cashflow-risk-intelligence",
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
          name: label(
            "AI Notification & Escalation",
            "AI নোটিফিকেশন ও এস্কেলেশন"
          ),
          href: "/software/ai-notification-escalation-centre",
        },
        {
          name: label("Risk Escalation Entry", "রিস্ক এস্কেলেশন এন্ট্রি"),
          href: "/software/risk-escalation-entry",
        },
      ],
    },

    {
      title: label("Governance & Security", "গভর্ন্যান্স ও সিকিউরিটি"),
      links: [
        {
          name: label(
            "Document & Evidence Control",
            "ডকুমেন্ট ও এভিডেন্স কন্ট্রোল"
          ),
          href: "/software/ai-document-evidence-control-centre",
        },
        {
          name: label(
            "User Role & Access Control",
            "ইউজার রোল ও অ্যাক্সেস কন্ট্রোল"
          ),
          href: "/software/ai-user-role-access-control-centre",
        },
        {
          name: label("Training Manual", "ট্রেনিং ম্যানুয়াল"),
          href: "/software/training-manual",
        },
        {
          name: label("Adaptive Leadership", "অ্যাডাপটিভ লিডারশিপ"),
          href: "/software/adaptive-leadership-assessment",
        },
        {
          name: label("Sustainability & ESG", "সাসটেইনেবিলিটি ও ESG"),
          href: "/software/sustainability-esg-intelligence",
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r border-white/10 bg-black text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-black px-6 py-6">
        <h1 className="break-up-word text-2xl font-bold tracking-wide text-cyan-400">
          MBNCON
        </h1>

        <p className="mt-2 break-up-word text-sm leading-relaxed text-neutral-400">
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
                      className={`block rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-200 break-up-word ${
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