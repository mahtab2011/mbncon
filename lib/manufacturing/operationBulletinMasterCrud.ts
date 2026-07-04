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

export type OperationBulletinMasterInput = {
  bulletinCode: string;
  styleCode: string;
  operationCode: string;
  operationName: string;
  machineType: string;
  smv: number;
  sequence: number;
  status: "ACTIVE" | "INACTIVE";
};

export type OperationBulletinMasterRecord =
  OperationBulletinMasterInput & {
    id: string;
  };

const OPERATION_BULLETIN_COLLECTION =
  "manufacturingOperationBulletins";

export async function createOperationBulletinMaster(
  input: OperationBulletinMasterInput,
  userName = "SYSTEM"
) {
  const ref = collection(
    db,
    OPERATION_BULLETIN_COLLECTION
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

export async function getOperationBulletinMasters(): Promise<
  OperationBulletinMasterRecord[]
> {
  const ref = collection(
    db,
    OPERATION_BULLETIN_COLLECTION
  );

  const q = query(
    ref,
    orderBy("bulletinCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data =
      document.data() as OperationBulletinMasterInput;

    return {
      id: document.id,

      bulletinCode: data.bulletinCode,
      styleCode: data.styleCode,

      operationCode: data.operationCode,
      operationName: data.operationName,

      machineType: data.machineType,

      smv: data.smv,

      sequence: data.sequence,

      status: data.status,
    };
  });
}

export async function updateOperationBulletinMaster(
  bulletinId: string,
  input: Partial<OperationBulletinMasterInput>,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    OPERATION_BULLETIN_COLLECTION,
    bulletinId
  );

  return updateDoc(ref, {
    ...input,

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}

export async function deactivateOperationBulletinMaster(
  bulletinId: string,
  userName = "SYSTEM",
  currentVersion = 1
) {
  const ref = doc(
    db,
    OPERATION_BULLETIN_COLLECTION,
    bulletinId
  );

  return updateDoc(ref, {
    status: "INACTIVE",

    version: currentVersion + 1,

    updatedBy: userName,

    updatedAt: serverTimestamp(),
  });
}