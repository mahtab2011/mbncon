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

export type ProductionLineMasterInput = {
  lineCode: string;
  lineName: string;
  factoryCode: string;
  departmentCode: string;
  floor: string;
  supervisorName: string;
  machineCount: number;
  operatorCount: number;
  targetEfficiency: number;
  status: "ACTIVE" | "INACTIVE";
};

export type ProductionLineMasterRecord =
  ProductionLineMasterInput & {
    id: string;
  };

const PRODUCTION_LINE_COLLECTION =
  "manufacturingProductionLines";

export async function createProductionLineMaster(
  input: ProductionLineMasterInput
) {
  const ref = collection(
    db,
    PRODUCTION_LINE_COLLECTION
  );

  return addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getProductionLineMasters(): Promise<
  ProductionLineMasterRecord[]
> {
  const ref = collection(
    db,
    PRODUCTION_LINE_COLLECTION
  );

  const q = query(
    ref,
    orderBy("lineCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data =
      document.data() as ProductionLineMasterInput;

    return {
      id: document.id,
      lineCode: data.lineCode,
      lineName: data.lineName,
      factoryCode: data.factoryCode,
      departmentCode: data.departmentCode,
      floor: data.floor,
      supervisorName: data.supervisorName,
      machineCount: data.machineCount,
      operatorCount: data.operatorCount,
      targetEfficiency: data.targetEfficiency,
      status: data.status,
    };
  });
}

export async function updateProductionLineMaster(
  lineId: string,
  input: Partial<ProductionLineMasterInput>
) {
  const ref = doc(
    db,
    PRODUCTION_LINE_COLLECTION,
    lineId
  );

  return updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deactivateProductionLineMaster(
  lineId: string
) {
  const ref = doc(
    db,
    PRODUCTION_LINE_COLLECTION,
    lineId
  );

  return updateDoc(ref, {
    status: "INACTIVE",
    updatedAt: serverTimestamp(),
  });
}