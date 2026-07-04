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

export type FactoryMasterInput = {
  factoryCode: string;
  factoryName: string;
  groupName: string;
  country: string;
  city: string;
  totalLines: number;
  totalEmployees: number;
  status: "ACTIVE" | "INACTIVE";
};

export type FactoryMasterRecord = FactoryMasterInput & {
  id: string;
};

const FACTORY_COLLECTION = "manufacturingFactories";

export async function createFactoryMaster(
  input: FactoryMasterInput
) {
  const ref = collection(db, FACTORY_COLLECTION);

  return addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getFactoryMasters(): Promise<
  FactoryMasterRecord[]
> {
  const ref = collection(db, FACTORY_COLLECTION);

  const q = query(ref, orderBy("factoryCode", "asc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data() as FactoryMasterInput;

    return {
      id: document.id,
      factoryCode: data.factoryCode,
      factoryName: data.factoryName,
      groupName: data.groupName,
      country: data.country,
      city: data.city,
      totalLines: data.totalLines,
      totalEmployees: data.totalEmployees,
      status: data.status,
    };
  });
}

export async function updateFactoryMaster(
  factoryId: string,
  input: Partial<FactoryMasterInput>
) {
  const ref = doc(db, FACTORY_COLLECTION, factoryId);

  return updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deactivateFactoryMaster(
  factoryId: string
) {
  const ref = doc(db, FACTORY_COLLECTION, factoryId);

  return updateDoc(ref, {
    status: "INACTIVE",
    updatedAt: serverTimestamp(),
  });
}