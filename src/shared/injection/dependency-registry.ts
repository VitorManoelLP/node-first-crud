export default class DependencyRegistry {

  private static registry: DependencyRegistry;
  private dependencies: Map<string, any>;

  constructor() {
    this.dependencies = new Map();
  }

  register(name: string, dependency: any) {
    this.dependencies.set(name, dependency);
  }

  inject(name: string) {
    if (!this.dependencies.has(name)) throw new Error("Dependency not found");
    return this.dependencies.get(name);
  }

  public static getInstance() {
    if (!DependencyRegistry.registry) {
      DependencyRegistry.registry = new DependencyRegistry();
    }
    return DependencyRegistry.registry;
  }

}

export function inject(name: string) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = new Proxy({}, {
      get(target: any, propertyKey: string) {
        const dependency = DependencyRegistry.getInstance().inject(name);
        return dependency[propertyKey];
      }
    });
  }
}