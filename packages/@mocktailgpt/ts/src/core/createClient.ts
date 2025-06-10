// createClient.ts : Wrapper specsData-like
export const createClient = () => {
  return {
    call: async <In, Out>(endpoint: string, data: In): Promise<Out> => {
      // TODO: Implémenter la logique (prod/dev, swap)
      return {} as Out;
    }
  };
};
