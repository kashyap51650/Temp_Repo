import { useQuery } from "@tanstack/react-query";

const useFetch = <T>(key: string, fetchFunction: () => Promise<T>) => {
  return useQuery<T>({ queryKey: [key], queryFn: fetchFunction });
};

export default useFetch;
