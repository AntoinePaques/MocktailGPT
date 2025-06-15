declare module 'tsx' {
  export function tsImport(
    specifier: string,
    options: string | { parentURL: string },
  ): Promise<unknown>;
}

declare module 'tsx/esm/api' {
  export function tsImport(
    specifier: string,
    options: string | { parentURL: string },
  ): Promise<unknown>;
}
