// Shared source data for OptiFabric's user manual — used by the combined
// bilingual page (app/optifabric/user-manual/page.tsx) and the two
// single-language pages (app/optifabric/user-manual/en and /bn), so all three
// stay in sync from one place instead of drifting apart as separate copies.
export type ManualRole = {
  id: string;
  roleEnglish: string;
  roleBangla: string;
  responsibilityEnglish: string;
  responsibilityBangla: string;
  sections: ManualSection[];
};

export type ManualSection = {
  screenNumber: string;
  screenTitle: string;
  screenTitleBangla: string;
  route: string;
  purpose: string;
  purposeBangla: string;
  whyAiAsks: string;
  whyAiAsksBangla: string;
  steps: string[];
  stepsBangla: string[];
  expectedResult: string;
  expectedResultBangla: string;
  commonMistakes: string[];
  commonMistakesBangla: string[];
  bestPractices: string[];
  bestPracticesBangla: string[];
};

export const manualRoles: ManualRole[] = [
  {
    id: "cutting-master",
    roleEnglish: "Cutting Master",
    roleBangla: "কাটিং মাস্টার",
    responsibilityEnglish:
      "Prepare accurate pattern information, trace pattern boundaries and review AI marker recommendations before cutting.",
    responsibilityBangla:
      "সঠিক প্যাটার্ন তথ্য প্রস্তুত করা, প্যাটার্নের সীমানা ট্রেস করা এবং কাটিংয়ের আগে AI marker recommendation যাচাই করা।",
    sections: [
      {
        screenNumber: "01",
        screenTitle: "Pattern Photo Preparation",
        screenTitleBangla: "প্যাটার্নের ছবি প্রস্তুত করা",
        route: "/optifabric/cutting-assistant/upload",
        purpose:
          "Prepare a clear pattern image that the application can use for engineering measurement.",
        purposeBangla:
          "এমন একটি পরিষ্কার প্যাটার্নের ছবি প্রস্তুত করা, যা অ্যাপ্লিকেশন engineering measurement-এর জন্য ব্যবহার করতে পারে।",
        whyAiAsks:
          "AI needs a clear top-down image and a known measurement reference to calculate the real pattern size.",
        whyAiAsksBangla:
          "প্যাটার্নের বাস্তব মাপ গণনা করার জন্য AI-এর পরিষ্কার উপর থেকে তোলা ছবি এবং পরিচিত measurement reference প্রয়োজন।",
        steps: [
          "Place one pattern piece on a clean, flat and contrasting background.",
          "Place a 12-inch ruler or 30-centimetre scale beside the pattern.",
          "Keep the ruler and pattern on the same flat surface.",
          "Take the photograph directly from above.",
          "Ensure the entire pattern and ruler are visible.",
          "Check that there is no shadow, fold or obstruction.",
        ],
        stepsBangla: [
          "একটি প্যাটার্ন পিস পরিষ্কার, সমতল এবং বিপরীত রঙের background-এর ওপর রাখুন।",
          "প্যাটার্নের পাশে ১২ ইঞ্চি ruler অথবা ৩০ centimetre scale রাখুন।",
          "Ruler এবং pattern একই সমতল স্থানে রাখুন।",
          "ছবিটি একেবারে উপর থেকে তুলুন।",
          "সম্পূর্ণ প্যাটার্ন এবং ruler যেন ছবিতে দেখা যায় তা নিশ্চিত করুন।",
          "ছবিতে shadow, fold অথবা কোনো বাধা আছে কি না পরীক্ষা করুন।",
        ],
        expectedResult:
          "A complete and clearly visible pattern image suitable for calibration and tracing.",
        expectedResultBangla:
          "Calibration এবং tracing-এর উপযোগী সম্পূর্ণ ও পরিষ্কার প্যাটার্ন ছবি।",
        commonMistakes: [
          "Taking the photograph from an angle.",
          "Using a ruler that is partly hidden.",
          "Including more than one overlapping pattern piece.",
          "Using a background similar to the pattern colour.",
          "Cutting off part of the pattern in the photograph.",
        ],
        commonMistakesBangla: [
          "কোণ থেকে ছবি তোলা।",
          "আংশিক ঢাকা ruler ব্যবহার করা।",
          "একাধিক overlapping pattern piece রাখা।",
          "প্যাটার্নের মতো একই রঙের background ব্যবহার করা।",
          "ছবিতে প্যাটার্নের কিছু অংশ বাদ পড়ে যাওয়া।",
        ],
        bestPractices: [
          "Use strong, even lighting.",
          "Use one photograph for each pattern piece.",
          "Use a white background for dark patterns.",
          "Check image sharpness before uploading.",
        ],
        bestPracticesBangla: [
          "পর্যাপ্ত ও সমান আলো ব্যবহার করুন।",
          "প্রতিটি pattern piece-এর জন্য আলাদা ছবি ব্যবহার করুন।",
          "গাঢ় রঙের প্যাটার্নের জন্য সাদা background ব্যবহার করুন।",
          "Upload করার আগে ছবির sharpness পরীক্ষা করুন।",
        ],
      },
      {
        screenNumber: "02",
        screenTitle: "Upload Pattern",
        screenTitleBangla: "প্যাটার্ন আপলোড",
        route: "/optifabric/cutting-assistant/upload",
        purpose:
          "Upload the prepared pattern image or document into the OptiFabric workflow.",
        purposeBangla:
          "প্রস্তুত করা প্যাটার্নের ছবি অথবা document OptiFabric workflow-তে upload করা।",
        whyAiAsks:
          "The uploaded file is the engineering source used for scale calibration, tracing and area calculation.",
        whyAiAsksBangla:
          "Upload করা file scale calibration, tracing এবং area calculation-এর engineering source হিসেবে ব্যবহৃত হয়।",
        steps: [
          "Open the Upload Your Pattern screen.",
          "Select the required fabric or pattern category when available.",
          "Choose a PDF, JPG, JPEG or PNG file.",
          "Review the AI photo-quality guidance.",
          "Confirm that the correct file has been selected.",
          "Continue to the tracing workflow.",
        ],
        stepsBangla: [
          "Upload Your Pattern screen খুলুন।",
          "প্রয়োজন হলে fabric অথবা pattern category নির্বাচন করুন।",
          "PDF, JPG, JPEG অথবা PNG file নির্বাচন করুন।",
          "AI photo-quality guidance পড়ুন।",
          "সঠিক file নির্বাচন করা হয়েছে কি না নিশ্চিত করুন।",
          "Tracing workflow-তে এগিয়ে যান।",
        ],
        expectedResult:
          "The selected pattern is loaded and ready for engineering review.",
        expectedResultBangla:
          "নির্বাচিত প্যাটার্ন load হবে এবং engineering review-এর জন্য প্রস্তুত হবে।",
        commonMistakes: [
          "Uploading the wrong pattern piece.",
          "Uploading a blurred or compressed image.",
          "Using an unsupported file format.",
          "Continuing without checking the ruler.",
        ],
        commonMistakesBangla: [
          "ভুল pattern piece upload করা।",
          "Blurred অথবা অতিরিক্ত compressed ছবি upload করা।",
          "Unsupported file format ব্যবহার করা।",
          "Ruler পরীক্ষা না করে পরবর্তী ধাপে যাওয়া।",
        ],
        bestPractices: [
          "Use clear file names such as Shirt-Front-Medium.",
          "Keep the original image safely stored.",
          "Confirm the style number and pattern-piece name.",
        ],
        bestPracticesBangla: [
          "Shirt-Front-Medium-এর মতো পরিষ্কার file name ব্যবহার করুন।",
          "Original image নিরাপদে সংরক্ষণ করুন।",
          "Style number এবং pattern-piece name নিশ্চিত করুন।",
        ],
      },
      {
        screenNumber: "03",
        screenTitle: "Boundary Tracing and Calibration",
        screenTitleBangla: "বাউন্ডারি ট্রেসিং ও ক্যালিব্রেশন",
        route: "/optifabric/cutting-assistant/pattern-analysis",
        purpose:
          "Mark the outer boundary of the pattern and convert image measurements into real engineering dimensions.",
        purposeBangla:
          "প্যাটার্নের বাইরের সীমানা চিহ্নিত করা এবং ছবির measurement-কে বাস্তব engineering dimension-এ রূপান্তর করা।",
        whyAiAsks:
          "AI needs boundary points to construct the pattern polygon and the ruler length to convert pixels into real measurements.",
        whyAiAsksBangla:
          "Pattern polygon তৈরির জন্য AI-এর boundary point এবং pixel-কে বাস্তব measurement-এ রূপান্তরের জন্য ruler length প্রয়োজন।",
        steps: [
          "Confirm that the pattern image is displayed correctly.",
          "Set or verify the ruler calibration.",
          "Click around the outer edge of the pattern.",
          "Add extra points around curves and corners.",
          "Avoid placing points inside the pattern.",
          "Close the polygon by connecting the final point to the starting point.",
          "Review the complete outline.",
          "Reset and trace again when the outline is incorrect.",
        ],
        stepsBangla: [
          "Pattern image সঠিকভাবে দেখা যাচ্ছে কি না নিশ্চিত করুন।",
          "Ruler calibration নির্ধারণ অথবা যাচাই করুন।",
          "প্যাটার্নের বাইরের edge বরাবর click করুন।",
          "Curve এবং corner-এর স্থানে অতিরিক্ত point দিন।",
          "প্যাটার্নের ভেতরে point দেওয়া এড়িয়ে চলুন।",
          "শেষ point-কে শুরুর point-এর সঙ্গে যুক্ত করে polygon সম্পূর্ণ করুন।",
          "সম্পূর্ণ outline পরীক্ষা করুন।",
          "Outline ভুল হলে reset করে পুনরায় trace করুন।",
        ],
        expectedResult:
          "A closed engineering polygon representing the actual pattern boundary.",
        expectedResultBangla:
          "বাস্তব প্যাটার্ন boundary-এর প্রতিনিধিত্বকারী একটি সম্পূর্ণ engineering polygon।",
        commonMistakes: [
          "Using too few points around a curved edge.",
          "Leaving the polygon open.",
          "Tracing seam lines instead of the cutting edge.",
          "Clicking outside the pattern.",
          "Using an incorrect ruler calibration value.",
        ],
        commonMistakesBangla: [
          "Curve-এর চারপাশে খুব কম point ব্যবহার করা।",
          "Polygon খোলা রেখে দেওয়া।",
          "Cutting edge-এর পরিবর্তে seam line trace করা।",
          "প্যাটার্নের বাইরে click করা।",
          "ভুল ruler calibration value ব্যবহার করা।",
        ],
        bestPractices: [
          "Use more points for complex curves.",
          "Zoom the browser when detailed tracing is required.",
          "Trace the actual cutting boundary consistently.",
          "Review the first and last point carefully.",
        ],
        bestPracticesBangla: [
          "Complex curve-এর জন্য বেশি point ব্যবহার করুন।",
          "Detail tracing প্রয়োজন হলে browser zoom ব্যবহার করুন।",
          "সবসময় actual cutting boundary trace করুন।",
          "প্রথম ও শেষ point সতর্কভাবে পরীক্ষা করুন।",
        ],
      },
      {
        screenNumber: "04",
        screenTitle: "Polygon and Area Review",
        screenTitleBangla: "পলিগন ও এরিয়া যাচাই",
        route: "/optifabric/cutting-assistant/marker-layout",
        purpose:
          "Review the constructed pattern polygon and calculated pattern area.",
        purposeBangla:
          "তৈরি করা pattern polygon এবং calculated pattern area যাচাই করা।",
        whyAiAsks:
          "Pattern area is required to estimate material use and evaluate marker efficiency.",
        whyAiAsksBangla:
          "Material use অনুমান এবং marker efficiency মূল্যায়নের জন্য pattern area প্রয়োজন।",
        steps: [
          "Review the displayed polygon shape.",
          "Compare the polygon visually with the original pattern.",
          "Check the calculated square-inch area.",
          "Confirm that the ruler calibration is correct.",
          "Return to tracing when the shape or area appears incorrect.",
        ],
        stepsBangla: [
          "Display করা polygon shape পরীক্ষা করুন।",
          "Original pattern-এর সঙ্গে polygon visually compare করুন।",
          "Calculated square-inch area পরীক্ষা করুন।",
          "Ruler calibration সঠিক কি না নিশ্চিত করুন।",
          "Shape অথবা area ভুল মনে হলে tracing screen-এ ফিরে যান।",
        ],
        expectedResult:
          "A validated pattern shape and reasonable engineering-area result.",
        expectedResultBangla:
          "যাচাইকৃত pattern shape এবং যৌক্তিক engineering-area result।",
        commonMistakes: [
          "Accepting an obviously distorted polygon.",
          "Ignoring an unrealistic area value.",
          "Using the result without comparing it with the paper pattern.",
        ],
        commonMistakesBangla: [
          "স্পষ্টভাবে distorted polygon গ্রহণ করা।",
          "অযৌক্তিক area value উপেক্ষা করা।",
          "Paper pattern-এর সঙ্গে compare না করে result ব্যবহার করা।",
        ],
        bestPractices: [
          "Compare key dimensions with the physical pattern.",
          "Repeat tracing when the area differs significantly.",
          "Record the pattern name and size with the result.",
        ],
        bestPracticesBangla: [
          "Physical pattern-এর key dimension-এর সঙ্গে compare করুন।",
          "Area উল্লেখযোগ্যভাবে ভিন্ন হলে পুনরায় tracing করুন।",
          "Result-এর সঙ্গে pattern name এবং size লিখে রাখুন।",
        ],
      },
    ],
  },
  {
    id: "cutting-supervisor",
    roleEnglish: "Cutting Supervisor",
    roleBangla: "কাটিং সুপারভাইজার",
    responsibilityEnglish:
      "Verify marker inputs, cutting-room conditions and practical execution requirements.",
    responsibilityBangla:
      "Marker input, cutting-room condition এবং practical execution requirement যাচাই করা।",
    sections: [
      {
        screenNumber: "05",
        screenTitle: "Fabric and Marker Information",
        screenTitleBangla: "কাপড় ও মার্কার তথ্য",
        route: "/optifabric/cutting-assistant/marker-layout",
        purpose:
          "Enter the available fabric width and marker information for layout evaluation.",
        purposeBangla:
          "Layout evaluation-এর জন্য available fabric width এবং marker information প্রদান করা।",
        whyAiAsks:
          "AI must know the usable fabric width and marker length to calculate available marker area and utilisation.",
        whyAiAsksBangla:
          "Available marker area এবং utilisation গণনার জন্য AI-এর usable fabric width এবং marker length জানা প্রয়োজন।",
        steps: [
          "Confirm the actual usable fabric width.",
          "Enter the marker length in the requested unit.",
          "Select the correct fabric type when the option is available.",
          "Confirm whether the fabric is solid, striped, checked or printed.",
          "Review the displayed marker area.",
          "Continue to AI nesting.",
        ],
        stepsBangla: [
          "Actual usable fabric width নিশ্চিত করুন।",
          "Requested unit অনুযায়ী marker length লিখুন।",
          "Option থাকলে সঠিক fabric type নির্বাচন করুন।",
          "Fabric solid, striped, checked অথবা printed কি না নিশ্চিত করুন।",
          "Display করা marker area পরীক্ষা করুন।",
          "AI nesting-এ এগিয়ে যান।",
        ],
        expectedResult:
          "Correct marker dimensions ready for pattern-placement analysis.",
        expectedResultBangla:
          "Pattern-placement analysis-এর জন্য সঠিক marker dimension প্রস্তুত হবে।",
        commonMistakes: [
          "Entering total fabric width instead of usable width.",
          "Mixing inches and centimetres.",
          "Ignoring selvage allowance.",
          "Selecting solid fabric for a striped style.",
        ],
        commonMistakesBangla: [
          "Usable width-এর পরিবর্তে total fabric width লেখা।",
          "Inch এবং centimetre মিশিয়ে ফেলা।",
          "Selvage allowance উপেক্ষা করা।",
          "Striped style-এর জন্য solid fabric নির্বাচন করা।",
        ],
        bestPractices: [
          "Measure usable width from the actual roll.",
          "Check shade and fabric-lot information.",
          "Confirm marker direction and grain requirements.",
          "Record any fabric restriction before nesting.",
        ],
        bestPracticesBangla: [
          "Actual roll থেকে usable width মাপুন।",
          "Shade এবং fabric-lot information পরীক্ষা করুন।",
          "Marker direction এবং grain requirement নিশ্চিত করুন।",
          "Nesting-এর আগে fabric restriction লিখে রাখুন।",
        ],
      },
      {
        screenNumber: "06",
        screenTitle: "AI Marker Layout Review",
        screenTitleBangla: "AI মার্কার লে-আউট যাচাই",
        route: "/optifabric/cutting-assistant/fabric-consumption",
        purpose:
          "Review the proposed placement of pattern pieces inside the marker.",
        purposeBangla:
          "Marker-এর মধ্যে proposed pattern-piece placement যাচাই করা।",
        whyAiAsks:
          "AI evaluates the empty spaces between pieces to estimate marker utilisation and potential fabric saving.",
        whyAiAsksBangla:
          "Marker utilisation এবং সম্ভাব্য fabric saving অনুমান করতে AI pattern piece-এর মধ্যকার empty space মূল্যায়ন করে।",
        steps: [
          "Review whether all required pattern pieces are displayed.",
          "Check that pieces remain inside the marker boundary.",
          "Verify the grain direction.",
          "Check one-way, nap, stripe and print restrictions.",
          "Review spaces between pattern pieces.",
          "Compare the AI arrangement with the existing factory marker.",
          "Reject any arrangement that cannot be cut safely.",
        ],
        stepsBangla: [
          "প্রয়োজনীয় সব pattern piece দেখানো হয়েছে কি না পরীক্ষা করুন।",
          "Piece-গুলো marker boundary-এর মধ্যে আছে কি না দেখুন।",
          "Grain direction যাচাই করুন।",
          "One-way, nap, stripe এবং print restriction পরীক্ষা করুন।",
          "Pattern piece-এর মধ্যকার space পরীক্ষা করুন।",
          "Factory-এর existing marker-এর সঙ্গে AI arrangement compare করুন।",
          "নিরাপদে কাটা সম্ভব নয় এমন arrangement বাতিল করুন।",
        ],
        expectedResult:
          "A practical marker proposal ready for engineering and production review.",
        expectedResultBangla:
          "Engineering এবং production review-এর জন্য একটি practical marker proposal।",
        commonMistakes: [
          "Accepting overlapping pieces.",
          "Ignoring grain direction.",
          "Rotating a one-way pattern incorrectly.",
          "Ignoring knife clearance.",
          "Using the demonstration layout as an automatic cutting instruction.",
        ],
        commonMistakesBangla: [
          "Overlapping piece গ্রহণ করা।",
          "Grain direction উপেক্ষা করা।",
          "One-way pattern ভুলভাবে rotate করা।",
          "Knife clearance উপেক্ষা করা।",
          "Demonstration layout-কে automatic cutting instruction হিসেবে ব্যবহার করা।",
        ],
        bestPractices: [
          "Verify every pattern piece before bulk cutting.",
          "Maintain safe spacing for the selected cutting method.",
          "Use trial cutting when the style is new.",
          "Obtain Cutting Master approval.",
        ],
        bestPracticesBangla: [
          "Bulk cutting-এর আগে প্রতিটি pattern piece যাচাই করুন।",
          "Selected cutting method অনুযায়ী safe spacing রাখুন।",
          "নতুন style হলে trial cutting করুন।",
          "Cutting Master-এর approval নিন।",
        ],
      },
      {
        screenNumber: "07",
        screenTitle: "Cutting Readiness Review",
        screenTitleBangla: "কাটিং প্রস্তুতি যাচাই",
        route: "/optifabric/pilot-dashboard",
        purpose:
          "Confirm whether the AI result is practically ready for a controlled factory trial.",
        purposeBangla:
          "AI result controlled factory trial-এর জন্য practically ready কি না নিশ্চিত করা।",
        whyAiAsks:
          "A mathematically efficient marker may still require operational checking for fabric behaviour, machine capacity and operator safety.",
        whyAiAsksBangla:
          "Mathematically efficient marker হলেও fabric behaviour, machine capacity এবং operator safety-এর জন্য operational checking প্রয়োজন হতে পারে।",
        steps: [
          "Review the pattern and marker summary.",
          "Confirm the fabric type and usable width.",
          "Check whether spreading restrictions are recorded.",
          "Confirm the expected number of layers.",
          "Review cutting-machine capacity.",
          "Check the operator skill requirement.",
          "Authorise only a controlled trial before bulk cutting.",
        ],
        stepsBangla: [
          "Pattern এবং marker summary পরীক্ষা করুন।",
          "Fabric type এবং usable width নিশ্চিত করুন।",
          "Spreading restriction record করা হয়েছে কি না দেখুন।",
          "Expected layer number নিশ্চিত করুন।",
          "Cutting-machine capacity পরীক্ষা করুন।",
          "Operator skill requirement যাচাই করুন।",
          "Bulk cutting-এর আগে শুধু controlled trial অনুমোদন করুন।",
        ],
        expectedResult:
          "A supervised trial-cutting decision with known risks and controls.",
        expectedResultBangla:
          "পরিচিত risk এবং control-সহ supervised trial-cutting decision।",
        commonMistakes: [
          "Starting bulk cutting without trial verification.",
          "Ignoring fabric slippage.",
          "Using excessive lay height.",
          "Assigning an unsuitable machine or operator.",
        ],
        commonMistakesBangla: [
          "Trial verification ছাড়া bulk cutting শুরু করা।",
          "Fabric slippage উপেক্ষা করা।",
          "অতিরিক্ত lay height ব্যবহার করা।",
          "অনুপযুক্ত machine অথবা operator নিয়োগ করা।",
        ],
        bestPractices: [
          "Use a small controlled trial lay.",
          "Check top, middle and bottom plies.",
          "Review cut accuracy before bulk approval.",
          "Record any change made after the AI recommendation.",
        ],
        bestPracticesBangla: [
          "Small controlled trial lay ব্যবহার করুন।",
          "Top, middle এবং bottom ply পরীক্ষা করুন।",
          "Bulk approval-এর আগে cut accuracy যাচাই করুন।",
          "AI recommendation-এর পরে করা পরিবর্তন record করুন।",
        ],
      },
    ],
  },
  {
    id: "production-officer",
    roleEnglish: "Production Officer",
    roleBangla: "প্রোডাকশন অফিসার",
    responsibilityEnglish:
      "Verify order, consumption and production-planning information before material commitments are made.",
    responsibilityBangla:
      "Material commitment-এর আগে order, consumption এবং production-planning information যাচাই করা।",
    sections: [
      {
        screenNumber: "08",
        screenTitle: "Fabric Consumption Review",
        screenTitleBangla: "কাপড়ের ব্যবহার যাচাই",
        route: "/optifabric/cutting-assistant/fabric-consumption",
        purpose:
          "Review estimated marker efficiency, fabric utilisation and consumption.",
        purposeBangla:
          "Estimated marker efficiency, fabric utilisation এবং consumption যাচাই করা।",
        whyAiAsks:
          "AI compares pattern area with marker area to estimate utilisation, wastage and consumption.",
        whyAiAsksBangla:
          "Utilisation, wastage এবং consumption অনুমান করতে AI pattern area-এর সঙ্গে marker area compare করে।",
        steps: [
          "Confirm the style and pattern-size information.",
          "Confirm the order quantity and size ratio when available.",
          "Review marker efficiency.",
          "Review fabric utilisation and estimated wastage.",
          "Check consumption per garment.",
          "Check total estimated fabric requirement.",
          "Compare the estimate with the factory plan.",
        ],
        stepsBangla: [
          "Style এবং pattern-size information নিশ্চিত করুন।",
          "Option থাকলে order quantity এবং size ratio নিশ্চিত করুন।",
          "Marker efficiency পরীক্ষা করুন।",
          "Fabric utilisation এবং estimated wastage পরীক্ষা করুন।",
          "প্রতি garment-এর consumption পরীক্ষা করুন।",
          "Total estimated fabric requirement পরীক্ষা করুন।",
          "Factory plan-এর সঙ্গে estimate compare করুন।",
        ],
        expectedResult:
          "A reviewed engineering estimate suitable for planning discussion.",
        expectedResultBangla:
          "Planning discussion-এর উপযোগী একটি যাচাইকৃত engineering estimate।",
        commonMistakes: [
          "Using sample quantity instead of order quantity.",
          "Ignoring size ratio.",
          "Comparing different fabric widths.",
          "Treating estimated consumption as final booking consumption.",
        ],
        commonMistakesBangla: [
          "Order quantity-এর পরিবর্তে sample quantity ব্যবহার করা।",
          "Size ratio উপেক্ষা করা।",
          "ভিন্ন fabric width compare করা।",
          "Estimated consumption-কে final booking consumption হিসেবে গ্রহণ করা।",
        ],
        bestPractices: [
          "Compare AI estimates with approved CAD or historical data.",
          "Add approved process allowances separately.",
          "Record the fabric width used in each comparison.",
          "Escalate large differences for engineering review.",
        ],
        bestPracticesBangla: [
          "Approved CAD অথবা historical data-এর সঙ্গে AI estimate compare করুন।",
          "Approved process allowance আলাদাভাবে যোগ করুন।",
          "প্রতিটি comparison-এ ব্যবহৃত fabric width record করুন।",
          "বড় পার্থক্য engineering review-এর জন্য escalate করুন।",
        ],
      },
      {
        screenNumber: "09",
        screenTitle: "Fabric Saving and ROI Review",
        screenTitleBangla: "কাপড় সাশ্রয় ও ROI যাচাই",
        route: "/optifabric/pilot-dashboard",
        purpose:
          "Evaluate potential fabric saving and its commercial effect on the order.",
        purposeBangla:
          "সম্ভাব্য fabric saving এবং order-এর ওপর এর commercial effect মূল্যায়ন করা।",
        whyAiAsks:
          "AI needs current consumption, improved consumption, order quantity and fabric price to estimate possible commercial savings.",
        whyAiAsksBangla:
          "সম্ভাব্য commercial saving অনুমান করতে AI-এর current consumption, improved consumption, order quantity এবং fabric price প্রয়োজন।",
        steps: [
          "Verify the current factory-consumption baseline.",
          "Review the AI-improved consumption estimate.",
          "Confirm the order quantity.",
          "Confirm the fabric purchase price and currency.",
          "Review the estimated total saving.",
          "Separate estimated saving from confirmed saving.",
          "Submit the result for management review.",
        ],
        stepsBangla: [
          "Current factory-consumption baseline যাচাই করুন।",
          "AI-improved consumption estimate পরীক্ষা করুন।",
          "Order quantity নিশ্চিত করুন।",
          "Fabric purchase price এবং currency নিশ্চিত করুন।",
          "Estimated total saving পরীক্ষা করুন।",
          "Estimated saving এবং confirmed saving আলাদা রাখুন।",
          "Management review-এর জন্য result submit করুন।",
        ],
        expectedResult:
          "A transparent savings estimate supported by verified commercial inputs.",
        expectedResultBangla:
          "যাচাইকৃত commercial input-সহ একটি transparent savings estimate।",
        commonMistakes: [
          "Using an outdated fabric price.",
          "Using unverified factory consumption.",
          "Presenting projected savings as already achieved.",
          "Ignoring additional process losses.",
        ],
        commonMistakesBangla: [
          "পুরোনো fabric price ব্যবহার করা।",
          "Unverified factory consumption ব্যবহার করা।",
          "Projected saving-কে already achieved হিসেবে উপস্থাপন করা।",
          "Additional process loss উপেক্ষা করা।",
        ],
        bestPractices: [
          "Use the latest approved fabric price.",
          "Clearly label all assumptions.",
          "Verify savings through an actual production trial.",
          "Report both percentage and financial value.",
        ],
        bestPracticesBangla: [
          "সর্বশেষ approved fabric price ব্যবহার করুন।",
          "সব assumption পরিষ্কারভাবে উল্লেখ করুন।",
          "Actual production trial-এর মাধ্যমে saving যাচাই করুন।",
          "Percentage এবং financial value উভয়ভাবে report করুন।",
        ],
      },
    ],
  },
  {
    id: "factory-manager",
    roleEnglish: "Factory Manager",
    roleBangla: "ফ্যাক্টরি ম্যানেজার",
    responsibilityEnglish:
      "Approve pilots, evaluate commercial benefits and ensure controlled implementation.",
    responsibilityBangla:
      "Pilot approve করা, commercial benefit মূল্যায়ন করা এবং controlled implementation নিশ্চিত করা।",
    sections: [
      {
        screenNumber: "10",
        screenTitle: "Complete Pilot Result",
        screenTitleBangla: "সম্পূর্ণ পাইলট ফলাফল",
        route: "/optifabric/pilot-dashboard",
        purpose:
          "Review the complete engineering and commercial outcome of the OptiFabric trial.",
        purposeBangla:
          "OptiFabric trial-এর সম্পূর্ণ engineering এবং commercial outcome যাচাই করা।",
        whyAiAsks:
          "Management needs a combined view of marker performance, consumption, saving potential and operational risk before approving expansion.",
        whyAiAsksBangla:
          "Expansion approve করার আগে management-এর marker performance, consumption, saving potential এবং operational risk-এর combined view প্রয়োজন।",
        steps: [
          "Review the style and factory information.",
          "Review the pattern and marker results.",
          "Check marker efficiency and estimated wastage.",
          "Review consumption and financial saving.",
          "Confirm that trial cutting was completed.",
          "Review any difference between AI estimate and actual result.",
          "Approve, revise or reject the proposed implementation.",
        ],
        stepsBangla: [
          "Style এবং factory information পরীক্ষা করুন।",
          "Pattern এবং marker result পরীক্ষা করুন।",
          "Marker efficiency এবং estimated wastage যাচাই করুন।",
          "Consumption এবং financial saving পরীক্ষা করুন।",
          "Trial cutting সম্পন্ন হয়েছে কি না নিশ্চিত করুন।",
          "AI estimate এবং actual result-এর পার্থক্য পরীক্ষা করুন।",
          "Proposed implementation approve, revise অথবা reject করুন।",
        ],
        expectedResult:
          "A management decision based on engineering evidence and verified trial results.",
        expectedResultBangla:
          "Engineering evidence এবং verified trial result-এর ভিত্তিতে management decision।",
        commonMistakes: [
          "Approving expansion using demonstration data only.",
          "Ignoring operational feedback from the cutting room.",
          "Reviewing only financial saving and not quality risk.",
          "Failing to assign responsibility for implementation.",
        ],
        commonMistakesBangla: [
          "শুধু demonstration data ব্যবহার করে expansion approve করা।",
          "Cutting room-এর operational feedback উপেক্ষা করা।",
          "Quality risk বাদ দিয়ে শুধু financial saving দেখা।",
          "Implementation-এর দায়িত্ব নির্ধারণ না করা।",
        ],
        bestPractices: [
          "Require one verified pilot before wider rollout.",
          "Include Cutting, Production, Quality and Industrial Engineering.",
          "Approve measurable targets.",
          "Review actual savings after production completion.",
        ],
        bestPracticesBangla: [
          "Wider rollout-এর আগে একটি verified pilot বাধ্যতামূলক করুন।",
          "Cutting, Production, Quality এবং Industrial Engineering-কে অন্তর্ভুক্ত করুন।",
          "Measurable target approve করুন।",
          "Production completion-এর পরে actual saving review করুন।",
        ],
      },
      {
        screenNumber: "11",
        screenTitle: "Factory Pilot Approval",
        screenTitleBangla: "ফ্যাক্টরি পাইলট অনুমোদন",
        route: "/optifabric/pilot-dashboard",
        purpose:
          "Control how OptiFabric AI is introduced into factory operations.",
        purposeBangla:
          "Factory operation-এ OptiFabric AI কীভাবে চালু হবে তা নিয়ন্ত্রণ করা।",
        whyAiAsks:
          "Controlled implementation protects fabric, production quality, delivery performance and customer commitments.",
        whyAiAsksBangla:
          "Controlled implementation fabric, production quality, delivery performance এবং customer commitment রক্ষা করে।",
        steps: [
          "Select one suitable pilot style.",
          "Assign a responsible Cutting Master.",
          "Assign a Cutting Supervisor and Production Officer.",
          "Record the existing marker and consumption baseline.",
          "Run OptiFabric analysis.",
          "Complete a controlled trial cut.",
          "Measure the actual outcome.",
          "Approve the next pilot only after documented review.",
        ],
        stepsBangla: [
          "একটি উপযুক্ত pilot style নির্বাচন করুন।",
          "একজন responsible Cutting Master নিয়োগ করুন।",
          "একজন Cutting Supervisor এবং Production Officer নিয়োগ করুন।",
          "Existing marker এবং consumption baseline record করুন।",
          "OptiFabric analysis সম্পন্ন করুন।",
          "Controlled trial cut করুন।",
          "Actual outcome measure করুন।",
          "Documented review-এর পরে পরবর্তী pilot approve করুন।",
        ],
        expectedResult:
          "A controlled, measurable and commercially accountable factory pilot.",
        expectedResultBangla:
          "একটি controlled, measurable এবং commercially accountable factory pilot।",
        commonMistakes: [
          "Selecting a highly complex style for the first pilot.",
          "Failing to record the original baseline.",
          "Changing multiple production conditions during comparison.",
          "Rolling out before the pilot report is approved.",
        ],
        commonMistakesBangla: [
          "প্রথম pilot-এর জন্য অত্যন্ত complex style নির্বাচন করা।",
          "Original baseline record না করা।",
          "Comparison-এর সময় একাধিক production condition পরিবর্তন করা।",
          "Pilot report approve হওয়ার আগে rollout করা।",
        ],
        bestPractices: [
          "Begin with a simple solid-fabric style.",
          "Use the same fabric width for comparison.",
          "Keep signed pilot records.",
          "Review quality, productivity and saving together.",
        ],
        bestPracticesBangla: [
          "Simple solid-fabric style দিয়ে শুরু করুন।",
          "Comparison-এর জন্য একই fabric width ব্যবহার করুন।",
          "Signed pilot record সংরক্ষণ করুন।",
          "Quality, productivity এবং saving একসঙ্গে review করুন।",
        ],
      },
    ],
  },
];

export const pilotChecklist = [
  {
    english: "Approved pilot style selected",
    bangla: "Approved pilot style নির্বাচন করা হয়েছে",
  },
  {
    english: "Pattern images prepared correctly",
    bangla: "Pattern image সঠিকভাবে প্রস্তুত করা হয়েছে",
  },
  {
    english: "12-inch ruler or 30-centimetre scale visible",
    bangla: "১২ ইঞ্চি ruler অথবা ৩০ centimetre scale দেখা যাচ্ছে",
  },
  {
    english: "Pattern boundary checked by Cutting Master",
    bangla: "Cutting Master pattern boundary যাচাই করেছেন",
  },
  {
    english: "Usable fabric width confirmed",
    bangla: "Usable fabric width নিশ্চিত করা হয়েছে",
  },
  {
    english: "Existing factory marker recorded",
    bangla: "Existing factory marker record করা হয়েছে",
  },
  {
    english: "Current consumption baseline approved",
    bangla: "Current consumption baseline approve করা হয়েছে",
  },
  {
    english: "AI marker result reviewed",
    bangla: "AI marker result review করা হয়েছে",
  },
  {
    english: "Controlled trial cutting completed",
    bangla: "Controlled trial cutting সম্পন্ন হয়েছে",
  },
  {
    english: "Actual result compared with AI estimate",
    bangla: "Actual result AI estimate-এর সঙ্গে compare করা হয়েছে",
  },
  {
    english: "Factory Manager approval recorded",
    bangla: "Factory Manager approval record করা হয়েছে",
  },
];
