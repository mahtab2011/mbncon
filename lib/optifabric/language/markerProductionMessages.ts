/**
 * OptiFabric AI
 * RC5-004-023 — Marker Production Screen Messages (Step 18)
 *
 * Purpose:
 * - Bilingual (English/Bangla) longer-form sentences for the live marker
 *   production page — the conservative-assumption warning, the cutting-table
 *   exceeded explanation, and the engineering-review disclaimer.
 * - Uses the same EngineeringMessageDictionary shape and
 *   resolveEngineeringMessage()/EngineeringLanguageService.message() pattern
 *   already defined in engineeringLanguageService.ts. Single-word/short-label
 *   terms stay in engineeringDictionary.ts; only multi-sentence prose lives
 *   here, per that file's own separation of concerns.
 * - Technical meaning must match the English source exactly — these are not
 *   free paraphrases. Protected terms (Marker, Nap, Grain Line, etc.) are
 *   still resolved through engineeringDictionary.ts elsewhere; this file
 *   only owns the surrounding sentence structure.
 */

import type { EngineeringMessageDictionary } from "./engineeringLanguageService";

export const MARKER_PRODUCTION_MESSAGES: EngineeringMessageDictionary = {
  conservativeAssumptionNap: {
    en: "Nap is Unknown / Requires Confirmation, so OptiFabric applies the safest production restriction and treats this fabric as one-way.",
    bn: "ন্যাপ অনিশ্চিত / নিশ্চিত করা হয়নি, তাই OptiFabric নিরাপদ উৎপাদন নিশ্চিত করার জন্য এই কাপড়কে একমুখী হিসেবে ধরে সবচেয়ে সতর্ক সীমাবদ্ধতা প্রয়োগ করে।",
  },

  conservativeAssumptionDirectional: {
    en: "Directional Fabric is set to Requires Confirmation, so OptiFabric applies the safest production restriction and treats this fabric as directional.",
    bn: "দিক-নির্ভর কাপড়ের বৈশিষ্ট্য নিশ্চিত করা হয়নি, তাই OptiFabric নিরাপদ উৎপাদন নিশ্চিত করার জন্য এই কাপড়কে দিক-নির্ভর হিসেবে ধরে সবচেয়ে সতর্ক সীমাবদ্ধতা প্রয়োগ করে।",
  },

  conservativeAssumptionFooter: {
    en: "This can reduce achievable marker efficiency compared to a confirmed fabric. Confirming the actual property may or may not improve efficiency — OptiFabric never promises an improvement, only that the marker will use whatever rotation freedom is actually safe for the confirmed fabric.",
    bn: "কাপড়ের কোনো বৈশিষ্ট্য নিশ্চিত করা না থাকলে OptiFabric নিরাপদ উৎপাদন নিশ্চিত করার জন্য অধিক সতর্ক সীমাবদ্ধতা প্রয়োগ করতে পারে। বৈশিষ্ট্যটি নিশ্চিত না করা পর্যন্ত এর ফলে মার্কারের দক্ষতা কিছুটা কম হতে পারে। বৈশিষ্ট্য নিশ্চিত করলে দক্ষতা বাড়বেই এমন কোনো নিশ্চয়তা OptiFabric দেয় না — এটি শুধু নিশ্চিত করে যে, নিশ্চিত করা কাপড়ের জন্য যতটুকু ঘূর্ণন প্রকৃতপক্ষে নিরাপদ ততটুকুই মার্কারে ব্যবহৃত হবে।",
  },

  fabricConfirmationIntro: {
    en: "Fields marked \"Requires Confirmation\" are currently using a starting default, not a value confirmed for the fabric on hand.",
    bn: "\"নিশ্চিত করা প্রয়োজন\" চিহ্নিত ক্ষেত্রগুলো বর্তমানে একটি প্রাথমিক ডিফল্ট মান ব্যবহার করছে, হাতে থাকা প্রকৃত কাপড়ের জন্য নিশ্চিত করা মান নয়।",
  },

  markerExceedsTableLengthBody: {
    en: "Every required piece could not be safely placed within the confirmed maximum length — the marker was NOT silently grown past the limit, pieces were not dropped, and no spacing or rotation rule was weakened. Reduce garments per marker, increase the limit, or use a wider usable fabric width.",
    bn: "নিশ্চিত করা সর্বোচ্চ দৈর্ঘ্যের মধ্যে সব প্রয়োজনীয় পিস নিরাপদে স্থাপন করা সম্ভব হয়নি — মার্কারটি নীরবে সীমা অতিক্রম করে বড় করা হয়নি, কোনো পিস বাদ দেওয়া হয়নি, এবং কোনো স্পেসিং বা ঘূর্ণন নিয়ম শিথিল করা হয়নি। মার্কার প্রতি পোশাকের সংখ্যা কমান, সীমা বাড়ান, অথবা বেশি প্রশস্ত ব্যবহারযোগ্য কাপড় ব্যবহার করুন।",
  },

  engineeringReviewFooter: {
    en: "All physical safety checks not listed above passed. This marker has NOT been automatically production-released.",
    bn: "উপরে তালিকাভুক্ত নয় এমন সকল ফিজিক্যাল সেফটি পরীক্ষা সফল হয়েছে। এই মার্কারটি স্বয়ংক্রিয়ভাবে উৎপাদনের জন্য অনুমোদিত হয়নি।",
  },

  engineeringReviewNotUnsafe: {
    en: "A low Engineering Score or unconfirmed check requires human review — this does not by itself mean the marker is physically unsafe.",
    bn: "কম ইঞ্জিনিয়ারিং স্কোর অথবা নিশ্চিত করা হয়নি এমন কোনো বিষয়ের জন্য মানুষের পর্যালোচনা প্রয়োজন — এর অর্থ এই নয় যে মার্কারটি ফিজিক্যালি অনিরাপদ।",
  },

  productionRejectedReason: {
    en: "Production Rejected — Reason",
    bn: "উৎপাদন প্রত্যাখ্যাত — কারণ",
  },

  engineeringReviewReason: {
    en: "Engineering Review Required — Reason",
    bn: "ইঞ্জিনিয়ারিং পর্যালোচনা প্রয়োজন — কারণ",
  },

  fabricTypeHelperText: {
    en: "Fabric Type populates recommended starting defaults for the constraints below — confirm or change every value for the actual fabric on hand. The confirmed values, not the fabric type, control the marker.",
    bn: "কাপড়ের ধরন নিচের সীমাবদ্ধতাগুলোর জন্য সুপারিশকৃত প্রাথমিক ডিফল্ট মান নির্ধারণ করে — হাতে থাকা প্রকৃত কাপড়ের জন্য প্রতিটি মান নিশ্চিত করুন বা পরিবর্তন করুন। কাপড়ের ধরন নয়, নিশ্চিত করা মানগুলোই মার্কার নিয়ন্ত্রণ করে।",
  },

  shrinkageDisclaimer: {
    en: "Shrinkage is stored for engineering reference only — OptiFabric does not yet have an approved shrinkage-compensation mechanism, so these values are NOT applied to pattern geometry.",
    bn: "সংকোচনের মান শুধুমাত্র ইঞ্জিনিয়ারিং রেফারেন্সের জন্য সংরক্ষণ করা হয় — OptiFabric-এ এখনো অনুমোদিত সংকোচন-ক্ষতিপূরণ ব্যবস্থা নেই, তাই এই মানগুলো প্যাটার্নের জ্যামিতিতে প্রয়োগ করা হয় না।",
  },

  fabricRollIntelligenceNote: {
    en: "OptiFabric nests only inside the calculated usable width after excluding the left and right roll edges.",
    bn: "OptiFabric কাপড়ের রোলের বাম ও ডান প্রান্ত বাদ দেওয়ার পর যে ব্যবহারযোগ্য প্রস্থ হিসাব করা হয় তার মধ্যেই কেবল নেস্টিং করে।",
  },

  resultOptimised: {
    en: "Result: automatically optimised (equal-or-better than the deterministic baseline on both utilisation and marker length).",
    bn: "ফলাফল: স্বয়ংক্রিয়ভাবে অপটিমাইজ করা হয়েছে (ইউটিলাইজেশন এবং মার্কার দৈর্ঘ্য উভয় ক্ষেত্রেই ডিটারমিনিস্টিক বেসলাইনের সমান বা তার চেয়ে ভালো)।",
  },

  resultBaseline: {
    en: "Result: deterministic baseline (the optimiser either found nothing better, or was not attempted).",
    bn: "ফলাফল: ডিটারমিনিস্টিক বেসলাইন (অপটিমাইজার হয় এর চেয়ে ভালো কিছু পায়নি, অথবা চালানো হয়নি)।",
  },

  highestEfficiencyBlockedNotice: {
    en: "Highest-efficiency candidate detected, but Production Release remains blocked until engineering safety conditions are satisfied.",
    bn: "সর্বোচ্চ-এফিসিয়েন্সি সমাধান শনাক্ত হয়েছে, তবে ইঞ্জিনিয়ারিং সেফটি শর্ত পূরণ না হওয়া পর্যন্ত উৎপাদন অনুমোদন আটকে থাকবে।",
  },

  maximumTableLengthHelper: {
    en: "Examples only — enter the factory's actual available table/lay length. When set, the optimiser will not exceed it; see the exceeds-length report below if pieces cannot all fit.",
    bn: "এগুলো শুধু উদাহরণ — কারখানার প্রকৃত উপলব্ধ টেবিল/লে দৈর্ঘ্য দিন। মান নির্ধারণ করা হলে অপটিমাইজার তা অতিক্রম করবে না; সব পিস না ধরলে নিচের এক্সিড-লেংথ রিপোর্ট দেখুন।",
  },

  edgeExclusionError: {
    en: "Edge exclusions must be smaller than the nominal roll width.",
    bn: "প্রান্ত বাদ দেওয়ার পরিমাণ অবশ্যই কাপড়ের রোলের নামমাত্র প্রস্থের চেয়ে কম হতে হবে।",
  },

  matchingDisclaimer: {
    en: "Matching requirement and repeat values are recorded for engineering reference only — no stripe/check/print phase-matching algorithm runs against them yet, so nesting does not currently account for repeat alignment.",
    bn: "ম্যাচিং প্রয়োজনীয়তা এবং রিপিট মান শুধুমাত্র ইঞ্জিনিয়ারিং রেফারেন্সের জন্য সংরক্ষণ করা হয় — এখনো কোনো স্ট্রাইপ/চেক/প্রিন্ট ফেজ-ম্যাচিং অ্যালগরিদম এগুলোর ভিত্তিতে চলে না, তাই নেস্টিং বর্তমানে রিপিট অ্যালাইনমেন্ট বিবেচনা করে না।",
  },
};
