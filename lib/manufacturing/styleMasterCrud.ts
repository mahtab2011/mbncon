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

export type StyleMasterInput = {
  styleCode: string;
  styleName: string;
  buyer: string;
  season: string;
  garmentType: string;
  smv: number;
  targetEfficiency: number;
  plannedQuantity: number;
  status: "ACTIVE" | "INACTIVE";
};

export type StyleMasterRecord = StyleMasterInput & {
  id: string;
};

const STYLE_COLLECTION = "manufacturingStyles";

export async function createStyleMaster(
  input: StyleMasterInput
) {
  const ref = collection(db, STYLE_COLLECTION);

  return addDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getStyleMasters(): Promise<
  StyleMasterRecord[]
> {
  const ref = collection(db, STYLE_COLLECTION);

  const q = query(
    ref,
    orderBy("styleCode", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data() as StyleMasterInput;

    return {
      id: document.id,
      styleCode: data.styleCode,
      styleName: data.styleName,
      buyer: data.buyer,
      season: data.season,
      garmentType: data.garmentType,
      smv: data.smv,
      targetEfficiency: data.targetEfficiency,
      plannedQuantity: data.plannedQuantity,
      status: data.status,
    };
  });
}

export async function updateStyleMaster(
  styleId: string,
  input: Partial<StyleMasterInput>
) {
  const ref = doc(db, STYLE_COLLECTION, styleId);

  return updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deactivateStyleMaster(
  styleId: string
) {
  const ref = doc(db, STYLE_COLLECTION, styleId);

  return updateDoc(ref, {
    status: "INACTIVE",
    updatedAt: serverTimestamp(),
  });
}
