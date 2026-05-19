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
          name: label("AI Executive Report", "AI এক্সিকিউটিভ রিপোর্ট"),
          href: "/software/ai-executive-report",
        },
        {
          name: label("AI Executive KPI Command Centre", "AI এক্সিকিউটিভ KPI কমান্ড সেন্টার"),
          href: "/software/ai-executive-kpi-command-centre",
        },
        {
          name: label("AI Master Control Centre", "AI মাস্টার কন্ট্রোল সেন্টার"),
          href: "/software/ai-master-control-centre",
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
          name: label("AI Factory War Room Dashboard", "AI ফ্যাক্টরি ওয়ার রুম ড্যাশবোর্ড"),
          href: "/software/ai-factory-war-room-dashboard",
        },
        {
          name: label("AI Factory War Room Command Centre", "AI ফ্যাক্টরি ওয়ার রুম কমান্ড সেন্টার"),
          href: "/software/ai-factory-war-room-command-centre",
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
          name: label("Manufacturing Productivity", "ম্যানুফ্যাকচারিং প্রোডাক্টিভিটি"),
          href: "/software/manufacturing-productivity",
        },
        {
          name: label("Manufacturing KPI Dashboard", "ম্যানুফ্যাকচারিং KPI ড্যাশবোর্ড"),
          href: "/software/manufacturing-kpi-dashboard",
        },
        {
          name: label("Forecasting", "ফোরকাস্টিং"),
          href: "/software/forecasting",
        },
        {
          name: label("Value Added Productivity", "ভ্যালু অ্যাডেড প্রোডাক্টিভিটি"),
          href: "/software/manufacturing-productivity/value-added-productivity",
        },
        {
          name: label("Factory Loss Intelligence", "ফ্যাক্টরি লস ইন্টেলিজেন্স"),
          href: "/software/factory-loss-intelligence",
        },
        {
          name: label("Factory Loss Entry", "ফ্যাক্টরি লস এন্ট্রি"),
          href: "/software/factory-loss-intelligence-entry",
        },
        {
          name: label("Post Order Intelligence Entry", "পোস্ট অর্ডার ইন্টেলিজেন্স এন্ট্রি"),
          href: "/software/production-entry/post-order-intelligence-entry",
        },
        {
          name: label("AI Production Recovery Intelligence", "AI প্রোডাকশন রিকভারি ইন্টেলিজেন্স"),
          href: "/software/ai-production-recovery-intelligence",
        },
        {
          name: label("Production Bottleneck Intelligence", "প্রোডাকশন বটলনেক ইন্টেলিজেন্স"),
          href: "/software/production-entry/production-bottleneck-intelligence",
        },
        {
          name: label("Production Capacity Intelligence", "প্রোডাকশন ক্যাপাসিটি ইন্টেলিজেন্স"),
          href: "/software/production-entry/production-capacity-intelligence",
        },
        {
          name: label("Line Balancing Intelligence", "লাইন ব্যালান্সিং ইন্টেলিজেন্স"),
          href: "/software/line-balancing-intelligence",
        },
        {
          name: label("Machine Utilization Intelligence", "মেশিন ইউটিলাইজেশন ইন্টেলিজেন্স"),
          href: "/software/machine-utilization-intelligence",
        },
        {
          name: label("Machine Maintenance Intelligence", "মেশিন মেইনটেন্যান্স ইন্টেলিজেন্স"),
          href: "/software/machine-maintenance-intelligence",
        },
        {
          name: label("Preventive Maintenance Intelligence", "প্রিভেন্টিভ মেইনটেন্যান্স ইন্টেলিজেন্স"),
          href: "/software/production-entry/preventive-maintenance-intelligence",
        },
        {
          name: label("Industrial Engineering Intelligence", "ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং ইন্টেলিজেন্স"),
          href: "/software/ai-industrial-engineering-intelligence",
        },
      ],
    },
    {
      title: label("Manufacturing Productivity Tools", "ম্যানুফ্যাকচারিং প্রোডাক্টিভিটি টুলস"),
      links: [
        {
          name: label("AI Productivity Analytics", "AI প্রোডাক্টিভিটি অ্যানালিটিক্স"),
          href: "/software/manufacturing-productivity/ai-productivity-analytics",
        },
        {
          name: label("AI Productivity Assistant", "AI প্রোডাক্টিভিটি অ্যাসিস্ট্যান্ট"),
          href: "/software/manufacturing-productivity/ai-productivity-assistant",
        },
        {
          name: label("Bottleneck Analysis", "বটলনেক অ্যানালাইসিস"),
          href: "/software/manufacturing-productivity/bottleneck-analysis",
        },
        {
          name: label("Daily Management System", "ডেইলি ম্যানেজমেন্ট সিস্টেম"),
          href: "/software/manufacturing-productivity/daily-management-system",
        },
        {
          name: label("Daily Production Report", "ডেইলি প্রোডাকশন রিপোর্ট"),
          href: "/software/manufacturing-productivity/daily-production-report",
        },
        {
          name: label("Daily Production Reporting", "ডেইলি প্রোডাকশন রিপোর্টিং"),
          href: "/software/manufacturing-productivity/daily-production-reporting",
        },
        {
          name: label("Dashboard Demo", "ড্যাশবোর্ড ডেমো"),
          href: "/software/manufacturing-productivity/dashboard-demo",
        },
        {
          name: label("KPI Analytics Demo", "KPI অ্যানালিটিক্স ডেমো"),
          href: "/software/manufacturing-productivity/kpi-analytics-demo",
        },
        {
          name: label("Machine Downtime", "মেশিন ডাউনটাইম"),
          href: "/software/manufacturing-productivity/machine-downtime",
        },
        {
          name: label("OEE System", "OEE সিস্টেম"),
          href: "/software/manufacturing-productivity/oee-system",
        },
        {
          name: label("Waste Rejection Tracking", "ওয়েস্ট রিজেকশন ট্র্যাকিং"),
          href: "/software/manufacturing-productivity/waste-rejection-tracking",
        },
      ],
    },
    {
      title: label("Workforce & Productivity", "ওয়ার্কফোর্স ও প্রোডাক্টিভিটি"),
      links: [
        {
          name: label("Workforce Absence Intelligence", "ওয়ার্কফোর্স অ্যাবসেন্স ইন্টেলিজেন্স"),
          href: "/software/workforce-absence-intelligence",
        },
        {
          name: label("Idle Manpower Intelligence", "আইডল ম্যানপাওয়ার ইন্টেলিজেন্স"),
          href: "/software/idle-manpower-intelligence",
        },
        {
          name: label("Overtime Optimization", "ওভারটাইম অপ্টিমাইজেশন"),
          href: "/software/production-entry/overtime-optimization-intelligence",
        },
        {
          name: label("Department Ranking", "ডিপার্টমেন্ট র‍্যাংকিং"),
          href: "/software/department-ranking",
        },
        {
          name: label("Department Risk Heatmap", "ডিপার্টমেন্ট রিস্ক হিটম্যাপ"),
          href: "/software/department-risk-heatmap",
        },
        {
          name: label("Skill Matrix Training Intelligence", "স্কিল ম্যাট্রিক্স ট্রেনিং ইন্টেলিজেন্স"),
          href: "/software/skill-matrix-training-intelligence",
        },
        {
          name: label("Staff Skill Matrix", "স্টাফ স্কিল ম্যাট্রিক্স"),
          href: "/software/manufacturing-productivity/staff-skill-matrix",
        },
        {
          name: label("Employee Empowerment Intelligence", "এমপ্লয়ি এমপাওয়ারমেন্ট ইন্টেলিজেন্স"),
          href: "/software/employee-empowerment-intelligence",
        },
        {
          name: label("Empowerment Intelligence", "এমপাওয়ারমেন্ট ইন্টেলিজেন্স"),
          href: "/software/empowerment-intelligence",
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
          name: label("Raw Material Quality Entry", "র-মেটেরিয়াল কোয়ালিটি এন্ট্রি"),
          href: "/software/qulaity-assurance-entry-rawmaterials",
        },
        {
          name: label("AI Quality Failure Prediction", "AI কোয়ালিটি ফেলিওর প্রেডিকশন"),
          href: "/software/ai-quality-failure-prediction-engine",
        },
        {
          name: label("AI Rework Intelligence", "AI রিওয়ার্ক ইন্টেলিজেন্স"),
          href: "/software/ai-rework-intelligence-engine",
        },
        {
          name: label("AI Raw Material Consumption", "AI র-মেটেরিয়াল কনজাম্পশন"),
          href: "/software/ai-raw-material-consumption-intelligence",
        },
        {
          name: label("Compliance Audit Entry", "কমপ্লায়েন্স অডিট এন্ট্রি"),
          href: "/software/compliance-audit-entry",
        },
        {
          name: label("Compliance Audit Intelligence", "কমপ্লায়েন্স অডিট ইন্টেলিজেন্স"),
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
          name: label("Lean Manufacturing System", "লিন ম্যানুফ্যাকচারিং সিস্টেম"),
          href: "/software/lean-manufacturing-system",
        },
        {
          name: label("AI Lean Manufacturing Centre", "AI লিন ম্যানুফ্যাকচারিং সেন্টার"),
          href: "/software/ai-lean-manufacturing-intelligence-centre",
        },
        {
          name: label("AI Kaizen Improvement Tracker", "AI কাইজেন ইমপ্রুভমেন্ট ট্র্যাকার"),
          href: "/software/ai-kaizen-improvement-tracker",
        },
        {
          name: label("Kaizen System", "কাইজেন সিস্টেম"),
          href: "/software/manufacturing-productivity/kaizen-system",
        },
        {
          name: label("Root Cause Analysis", "রুট কজ অ্যানালাইসিস"),
          href: "/software/root-cause-analysis",
        },
        {
          name: label("Corrective Action System", "করেক্টিভ অ্যাকশন সিস্টেম"),
          href: "/software/corrective-action-system",
        },
        {
          name: label("Problem Solving Workflow", "প্রবলেম সলভিং ওয়ার্কফ্লো"),
          href: "/software/manufacturing-productivity/problem-solving-workflow",
        },
        {
          name: label("Continuous Improvement Tracker", "কন্টিনিউয়াস ইমপ্রুভমেন্ট ট্র্যাকার"),
          href: "/software/continuous-improvement-tracker",
        },
        {
          name: label("TQM Entry", "TQM এন্ট্রি"),
          href: "/software/tqm-entry",
        },
        {
          name: label("TQM Forms", "TQM ফর্মস"),
          href: "/software/tqm-forms",
        },
        {
          name: label("TQM System", "TQM সিস্টেম"),
          href: "/software/tqm-system",
        },
        {
          name: label("Manufacturing Productivity TQM System", "ম্যানুফ্যাকচারিং প্রোডাক্টিভিটি TQM সিস্টেম"),
          href: "/software/manufacturing-productivity/tqm-system",
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
          name: label("Buyer Risk Intelligence", "বায়ার রিস্ক ইন্টেলিজেন্স"),
          href: "/software/buyer-risk-intelligence",
        },
        {
          name: label("Buyer Behaviour Intelligence", "বায়ার বিহেভিয়ার ইন্টেলিজেন্স"),
          href: "/software/buyer-behaviour-intelligence",
        },
        {
          name: label("AI Buyer Satisfaction Intelligence", "AI বায়ার স্যাটিসফ্যাকশন ইন্টেলিজেন্স"),
          href: "/software/ai-buyer-satisfaction-intelligence",
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
          name: label("Profit Leakage Intelligence", "প্রফিট লিকেজ ইন্টেলিজেন্স"),
          href: "/software/profit-leakage-intelligence",
        },
        {
          name: label("Costing Profit Leakage", "কস্টিং প্রফিট লিকেজ"),
          href: "/software/costing-profit-leakage-intelligence",
        },
        {
          name: label("Costing & Profitability Entry", "কস্টিং ও প্রফিটেবিলিটি এন্ট্রি"),
          href: "/software/costing-profitability-entry",
        },
        {
          name: label("Accounts Receivable Cashflow", "অ্যাকাউন্টস রিসিভেবল ক্যাশফ্লো"),
          href: "/software/accounts-receivable-cashflow-intelligence",
        },
        {
          name: label("Order Cancellation Buyer Risk", "অর্ডার ক্যান্সেলেশন বায়ার রিস্ক"),
          href: "/software/production-entry/order-cancellation-buyer-risk-intelligence",
        },
        {
          name: label("Merchandising Order Tracking", "মার্চেন্ডাইজিং অর্ডার ট্র্যাকিং"),
          href: "/software/production-entry/merchandising-order-tracking-intelligence",
        },
        {
          name: label("Sample Development Intelligence", "স্যাম্পল ডেভেলপমেন্ট ইন্টেলিজেন্স"),
          href: "/software/sample-development-intelligence",
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
          name: label("Supplier Performance Intelligence", "সাপ্লায়ার পারফরম্যান্স ইন্টেলিজেন্স"),
          href: "/software/supplier-performance-intelligence",
        },
        {
          name: label("AI Supplier Performance Centre", "AI সাপ্লায়ার পারফরম্যান্স সেন্টার"),
          href: "/software/ai-supplier-performance-intelligence-centre",
        },
        {
          name: label("Material Entry", "মেটেরিয়াল এন্ট্রি"),
          href: "/software/material-entry",
        },
        {
          name: label("Components Accessories Supply", "কম্পোনেন্টস অ্যাকসেসরিজ সাপ্লাই"),
          href: "/software/components-accessories-supply-intelligence",
        },
        {
          name: label("Components Quality Checklist", "কম্পোনেন্টস কোয়ালিটি চেকলিস্ট"),
          href: "/software/components-quality-checklist",
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
          name: label("Warehouse Security", "ওয়্যারহাউস সিকিউরিটি"),
          href: "/software/warehouse-security-loss-intelligence",
        },
        {
          name: label("Inventory Stock Intelligence", "ইনভেন্টরি স্টক ইন্টেলিজেন্স"),
          href: "/software/inventory-stock-intelligence",
        },
        {
          name: label("AI Inventory Intelligence Engine", "AI ইনভেন্টরি ইন্টেলিজেন্স ইঞ্জিন"),
          href: "/software/ai-inventory-intelligence-engine",
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
          name: label("Shipment Delay Prediction", "শিপমেন্ট ডিলে প্রেডিকশন"),
          href: "/software/shipment-delay-prediction",
        },
        {
          name: label("AI Shipment Recovery", "AI শিপমেন্ট রিকভারি"),
          href: "/software/ai-shipment-recovery-intelligence",
        },
        {
          name: label("Air Shipment Risk", "এয়ার শিপমেন্ট রিস্ক"),
          href: "/software/air-shipment-risk",
        },
        {
          name: label("Executive Escalation Engine", "এক্সিকিউটিভ এস্কেলেশন ইঞ্জিন"),
          href: "/software/executive-escalation-engine",
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
          name: label("AI Factory Health Engine", "AI ফ্যাক্টরি হেলথ ইঞ্জিন"),
          href: "/software/ai-factory-health-engine",
        },
        {
          name: label("Change Management Intelligence", "চেঞ্জ ম্যানেজমেন্ট ইন্টেলিজেন্স"),
          href: "/software/change-management-intelligence",
        },
        {
          name: label("Digital Transformation Readiness", "ডিজিটাল ট্রান্সফরমেশন রেডিনেস"),
          href: "/software/digital-transformation-readiness",
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
          name: label("Leadership Intelligence", "লিডারশিপ ইন্টেলিজেন্স"),
          href: "/software/leadership-intelligence",
        },
        {
          name: label("Leadership Coaching Form", "লিডারশিপ কোচিং ফর্ম"),
          href: "/software/manufacturing-productivity/leadership-coaching-form",
        },
        {
          name: label("Inner Game of Tennis", "ইনার গেম অব টেনিস"),
          href: "/software/manufacturing-productivity/management-excellence/inner-game-of-tennis",
        },
        {
          name: label("Inner Game of Management", "ইনার গেম অব ম্যানেজমেন্ট"),
          href: "/software/manufacturing-productivity/management-excellence/inner-game-of-management",
        },
        {
          name: label("Leadership Challenge Resilience", "লিডারশিপ চ্যালেঞ্জ রেজিলিয়েন্স"),
          href: "/software/manufacturing-productivity/management-excellence/leadership-challenge-resilience",
        },
        {
          name: label("Management Assessment Form", "ম্যানেজমেন্ট অ্যাসেসমেন্ট ফর্ম"),
          href: "/software/manufacturing-productivity/management-excellence/management-assessment-form",
        },
        {
          name: label("Gemba Audit System", "গেম্বা অডিট সিস্টেম"),
          href: "/software/manufacturing-productivity/gemba-audit-system",
        },
        {
          name: label("Muda Intelligence", "মুডা ইন্টেলিজেন্স"),
          href: "/software/manufacturing-productivity/muda-intelligence",
        },
        {
          name: label("Value Stream Assessment", "ভ্যালু স্ট্রিম অ্যাসেসমেন্ট"),
          href: "/software/manufacturing-value-stream-assessment",
        },
        {
          name: label("Future Improvement Programme", "ফিউচার ইমপ্রুভমেন্ট প্রোগ্রাম"),
          href: "/software/future-improvement-programme",
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
          name: label("Global Search Module Finder", "গ্লোবাল সার্চ মডিউল ফাইন্ডার"),
          href: "/software/ai-global-search-module-finder",
        },
        {
          name: label("Sustainability & ESG", "সাসটেইনেবিলিটি ও ESG"),
          href: "/software/sustainability-esg-intelligence",
        },
        {
          name: label("Utility Cost Intelligence", "ইউটিলিটি কস্ট ইন্টেলিজেন্স"),
          href: "/software/utility-cost-intelligence",
        },
        {
          name: label("Utilities Consumption Intelligence", "ইউটিলিটি কনজাম্পশন ইন্টেলিজেন্স"),
          href: "/software/utilities-consumption-intelligence",
        },
        {
          name: label("AI Factory Energy Optimisation", "AI ফ্যাক্টরি এনার্জি অপ্টিমাইজেশন"),
          href: "/software/ai-factory-energy-optimisation-engine",
        },
        {
          name: label("AI Cost Reduction Intelligence", "AI কস্ট রিডাকশন ইন্টেলিজেন্স"),
          href: "/software/ai-cost-reduction-intelligence",
        },
        {
          name: label("AI Department Accountability Tracker", "AI ডিপার্টমেন্ট অ্যাকাউন্টেবিলিটি ট্র্যাকার"),
          href: "/software/ai-department-accountability-tracker",
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