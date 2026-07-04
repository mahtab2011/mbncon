import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export type CuttingCommandInput = {
  factory: string;
  line: string;
  marker: string;
  efficiency: number;
  bundlesPending: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
};

export async function writeCuttingCommand(
  input: CuttingCommandInput
) {
  await addDoc(
    collection(db, "cuttingCommandFeed"),
    {
      ...input,
      createdAt: Date.now(),
      serverTime: serverTimestamp(),
    }
  );
}