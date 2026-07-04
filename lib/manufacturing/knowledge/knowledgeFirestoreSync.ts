import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  manufacturingKnowledgeRegistry,
} from "./knowledgeRegistry";

export async function syncKnowledgeToFirestore() {
  for (const [libraryName, library] of Object.entries(
    manufacturingKnowledgeRegistry
  )) {
    if (!Array.isArray(library)) continue;

    for (const item of library as any[]) {
      if (!item.code) continue;

      await setDoc(
        doc(
          collection(db, "manufacturingKnowledge"),
          `${libraryName}_${item.code}`
        ),
        {
          library: libraryName,
          ...item,
          syncedAt: new Date().toISOString(),
        }
      );
    }
  }
}