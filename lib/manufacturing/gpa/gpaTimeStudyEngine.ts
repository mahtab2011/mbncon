export type GPATimeStudyObservation = {
  observationNo: number;
  observedTime: number;
};

export type GPATimeStudyInput = {
  operationId: string;
  operationName: string;
  operatorName: string;

  observations: GPATimeStudyObservation[];

  performanceRating: number;

  allowancePercent: number;
};

export type GPATimeStudyResult = {
  operationId: string;
  operationName: string;
  operatorName: string;

  averageObservedTime: number;

  normalTime: number;

  standardTime: number;

  observations: number;

  executiveComment: string;

  bnExecutiveComment: string;
};

export function analyzeTimeStudy(
  studies: GPATimeStudyInput[]
): GPATimeStudyResult[] {

  return studies.map((study) => {

    const totalObserved =
      study.observations.reduce(
        (sum, item) => sum + item.observedTime,
        0
      );

    const averageObservedTime =
      study.observations.length === 0
        ? 0
        : totalObserved /
          study.observations.length;

    const normalTime =
      averageObservedTime *
      (study.performanceRating / 100);

    const standardTime =
      normalTime *
      (1 + study.allowancePercent / 100);

    let executiveComment =
      "Operation is within acceptable limits.";

    let bnExecutiveComment =
      "অপারেশন গ্রহণযোগ্য সীমার মধ্যে রয়েছে।";

    if (
      standardTime >
      averageObservedTime * 1.15
    ) {
      executiveComment =
        "Review work method and remove unnecessary delays.";

      bnExecutiveComment =
        "কাজের পদ্ধতি পর্যালোচনা করুন এবং অপ্রয়োজনীয় বিলম্ব দূর করুন।";
    }

    return {

      operationId: study.operationId,

      operationName: study.operationName,

      operatorName: study.operatorName,

      averageObservedTime:
        Number(
          averageObservedTime.toFixed(2)
        ),

      normalTime:
        Number(
          normalTime.toFixed(2)
        ),

      standardTime:
        Number(
          standardTime.toFixed(2)
        ),

      observations:
        study.observations.length,

      executiveComment,

      bnExecutiveComment,

    };

  });

}