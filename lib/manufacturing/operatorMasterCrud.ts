import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export type OperatorMasterInput = {
  operatorCode: string;
  employeeId: string;
  operatorName: string;
  factoryCode: string;
  departmentCode: string;
  lineCode: string;
  designation: string;
  skillGrade: string;
  joiningDate: string;
  mobile: string;
  status: "ACTIVE" | "INACTIVE";
};

export type OperatorMasterRecord =
  OperatorMasterInput & {
    id: string;
  };

const OPERATOR_COLLECTION =
  "manufacturingOperators";

export async function createOperatorMaster(
  input: OperatorMasterInput,
  userName = "SYSTEM"
) {
  const ref = collection(
    db,
    OPERATOR_COLLECTION
  );

  return addDoc(ref, {
    ...input,

    version: 1,

    createdBy: userName,
    updatedBy: userName,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getOperatorMasters(): Promise<
  OperatorMasterRecord[]
> {
  const ref = collection(
    db,
    OPERATOR_COLLECTION
  );

  const q = query(
    ref,
    orderBy("operatorCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data =
      document.data() as OperatorMasterInput;

    return {
      id: document.id,

      operatorCode: data.operatorCode,
      employeeId: data.employeeId,
      operatorName: data.operatorName,

      factoryCode: data.factoryCode,
      departmentCode: data.departmentCode,
      lineCode: data.lineCode,

      designation: data.designation,
      skillGrade: data.skillGrade,

      joiningDate: data.joiningDate,
      mobile: data.mobile,

      status: data.status,
    };
  });
}

export async function updateOperatorMaster(
  operatorId: string,
  input: Partial<OperatorMasterInput>,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    OPERATOR_COLLECTION,
    operatorId
  );

  return updateDoc(ref, {
    ...input,

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}

export async function deactivateOperatorMaster(
  operatorId: string,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    OPERATOR_COLLECTION,
    operatorId
  );

  return updateDoc(ref, {
    status: "INACTIVE",

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}