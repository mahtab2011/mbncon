import {
  EnterpriseFactoryRecord,
  getDemoEnterpriseFactories,
} from "./enterpriseFactoryRepository";

export async function getEnterpriseFactories(): Promise<
  EnterpriseFactoryRecord[]
> {
  // RC1 Demo implementation.
  // RC2 will replace this with Firestore queries.

  return Promise.resolve(
    getDemoEnterpriseFactories()
  );
}