import { createMockHooks, type HookMocks } from "./hooks";
import { createMockNavigation, type NavigationMocks } from "./next/navigation";
import { createMockServices, type ServiceMocks } from "./services";

let mocksInstance: SearchMocks | null = null;

export function createSearchMocks(): SearchMocks {
  const hooks = createMockHooks();
  const services = createMockServices();
  const navigation = createMockNavigation();

  return {
    hooks,
    services,
    navigation,
  };
}

export function getSearchMocks(): SearchMocks {
  if (!mocksInstance) {
    mocksInstance = createSearchMocks();
  }
  return mocksInstance;
}

interface SearchMocks {
  hooks: HookMocks;
  services: ServiceMocks;
  navigation: NavigationMocks;
}
