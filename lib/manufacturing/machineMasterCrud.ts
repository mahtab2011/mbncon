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

export type MachineMasterInput = {
  machineCode: string;
  machineName: string;
  machineType: string;
  factoryCode: string;
  departmentCode: string;
  lineCode: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  status: "ACTIVE" | "INACTIVE";
};

export type MachineMasterRecord =
  MachineMasterInput & {
    id: string;
  };

const MACHINE_COLLECTION =
  "manufacturingMachines";

export async function createMachineMaster(
  input: MachineMasterInput,
  userName = "SYSTEM"
) {
  const ref = collection(
    db,
    MACHINE_COLLECTION
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

export async function getMachineMasters(): Promise<
  MachineMasterRecord[]
> {
  const ref = collection(
    db,
    MACHINE_COLLECTION
  );

  const q = query(
    ref,
    orderBy("machineCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data =
      document.data() as MachineMasterInput;

    return {
      id: document.id,

      machineCode: data.machineCode,
      machineName: data.machineName,
      machineType: data.machineType,

      factoryCode: data.factoryCode,
      departmentCode: data.departmentCode,
      lineCode: data.lineCode,

      manufacturer: data.manufacturer,
      model: data.model,
      serialNumber: data.serialNumber,

      purchaseDate: data.purchaseDate,

      status: data.status,
    };
  });
}

export async function updateMachineMaster(
  machineId: string,
  input: Partial<MachineMasterInput>,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    MACHINE_COLLECTION,
    machineId
  );

  return updateDoc(ref, {
    ...input,

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}

export async function deactivateMachineMaster(
  machineId: string,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    MACHINE_COLLECTION,
    machineId
  );

  return updateDoc(ref, {
    status: "INACTIVE",

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}