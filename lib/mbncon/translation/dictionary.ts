/*
==========================================================

MBNCON AI Global Translation Engine

dictionary.ts

Version : RC1

Purpose

Manufacturing terminology dictionary shared by all
MBNCON AI applications.

==========================================================
*/

export type TranslationKey =
  | "app.optifabric.name"
  | "app.optifabric.subtitle"
  | "workflow.explanation.title"
  | "workflow.explanation.description"
  | "workflow.scale.title"
  | "workflow.scale.why"
  | "workflow.scale.aiUse"
  | "workflow.scale.benefit"
  | "term.marker"
  | "term.markerEfficiency"
  | "term.fabricWidth"
  | "term.layLength"
  | "term.patternPiece"
  | "term.fabricSaving";

export type LanguageDictionary = {
  [key in TranslationKey]: string;
};

export const en: LanguageDictionary = {
  "app.optifabric.name": "OptiFabric AI",
  "app.optifabric.subtitle": "AI Fabric Cutting & Marker Optimization",

  "workflow.explanation.title": "How OptiFabric AI Works",
  "workflow.explanation.description":
    "Understand why we ask for pattern photos, scale, fabric width, article ID and current consumption — and how AI generates optimized layouts and savings reports.",

  "workflow.scale.title": "Why use a 12-inch or 30 cm scale?",
  "workflow.scale.why":
    "AI sees a photo in pixels. A known scale allows the system to convert pixels into real measurements.",
  "workflow.scale.aiUse":
    "The AI uses the scale to measure the real size of each pattern piece before creating the cutting layout.",
  "workflow.scale.benefit":
    "This improves measurement accuracy, fabric consumption calculation and marker optimization.",

  "term.marker": "Marker",
  "term.markerEfficiency": "Marker Efficiency",
  "term.fabricWidth": "Fabric Width",
  "term.layLength": "Lay Length",
  "term.patternPiece": "Pattern Piece",
  "term.fabricSaving": "Fabric Saving",
};

export const bn: LanguageDictionary = {
  "app.optifabric.name": "অপ্টিফ্যাব্রিক এআই",
  "app.optifabric.subtitle": "এআই ফ্যাব্রিক কাটিং ও মার্কার অপ্টিমাইজেশন",

  "workflow.explanation.title": "অপ্টিফ্যাব্রিক এআই কীভাবে কাজ করে",
  "workflow.explanation.description":
    "কেন আমরা প্যাটার্নের ছবি, স্কেল, ফ্যাব্রিক প্রস্থ, আর্টিকেল আইডি এবং বর্তমান কনজাম্পশন চাই — এবং কীভাবে এআই অপ্টিমাইজড লেআউট ও সেভিংস রিপোর্ট তৈরি করে তা বুঝুন।",

  "workflow.scale.title": "কেন ১২ ইঞ্চি বা ৩০ সেমি স্কেল ব্যবহার করতে হবে?",
  "workflow.scale.why":
    "এআই ছবি দেখে পিক্সেল হিসেবে। একটি নির্দিষ্ট স্কেল দিলে সিস্টেম পিক্সেলকে বাস্তব মাপে রূপান্তর করতে পারে।",
  "workflow.scale.aiUse":
    "এআই কাটিং লেআউট তৈরির আগে প্রতিটি প্যাটার্ন পিসের বাস্তব মাপ বের করতে স্কেল ব্যবহার করে।",
  "workflow.scale.benefit":
    "এতে মাপের নির্ভুলতা, ফ্যাব্রিক কনজাম্পশন হিসাব এবং মার্কার অপ্টিমাইজেশন উন্নত হয়।",

  "term.marker": "মার্কার",
  "term.markerEfficiency": "মার্কার দক্ষতা",
  "term.fabricWidth": "ফ্যাব্রিক প্রস্থ",
  "term.layLength": "লে দৈর্ঘ্য",
  "term.patternPiece": "প্যাটার্ন পিস",
  "term.fabricSaving": "ফ্যাব্রিক সেভিং",
};

export const dictionaries = {
  en,
  bn,
};