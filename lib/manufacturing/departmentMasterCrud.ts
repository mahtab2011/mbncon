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

export type DepartmentMasterInput = {
  departmentCode: string;
  departmentName: string;
  factoryCode: string;
  managerName: string;
  totalEmployees: number;
  status: "ACTIVE" | "INACTIVE";
};

export type DepartmentMasterRecord =
  DepartmentMasterInput & {
    id: string;
  };

const DEPARTMENT_COLLECTION =
  "manufacturingDepartments";

export async function createDepartmentMaster(
  input: DepartmentMasterInput
) {
  const ref = collection(
    db,
    DEPARTMENT_COLLECTION
  );

  return addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getDepartmentMasters(): Promise<
  DepartmentMasterRecord[]
> {
  const ref = collection(
    db,
    DEPARTMENT_COLLECTION
  );

  const q = query(
    ref,
    orderBy("departmentCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data =
      document.data() as DepartmentMasterInput;

    return {
      id: document.id,
      departmentCode: data.departmentCode,
      departmentName: data.departmentName,
      factoryCode: data.factoryCode,
      managerName: data.managerName,
      totalEmployees: data.totalEmployees,
      status: data.status,
    };
  });
}

export async function updateDepartmentMaster(
  departmentId: string,
  input: Partial<DepartmentMasterInput>
) {
  const ref = doc(
    db,
    DEPARTMENT_COLLECTION,
    departmentId
  );

  return updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deactivateDepartmentMaster(
  departmentId: string
) {
  const ref = doc(
    db,
    DEPARTMENT_COLLECTION,
    departmentId
  );

  return updateDoc(ref, {
    status: "INACTIVE",
    updatedAt: serverTimestamp(),
  });
}