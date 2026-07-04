import {
  EnterpriseFactoryRecord,
  getDemoEnterpriseFactories,
} from "./enterpriseFactoryRepository";

type Listener = (
  factories: EnterpriseFactoryRecord[]
) => void;

let listeners: Listener[] = [];

let factories =
  getDemoEnterpriseFactories();

export function subscribeEnterpriseFactories(
  listener: Listener
) {
  listeners.push(listener);

  listener(factories);

  return () => {
    listeners = listeners.filter(
      (item) => item !== listener
    );
  };
}

export function updateEnterpriseFactories(
  data: EnterpriseFactoryRecord[]
) {
  factories = data;

  listeners.forEach((listener) =>
    listener(factories)
  );
}