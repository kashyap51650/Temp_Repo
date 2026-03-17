import { useMutation } from "@tanstack/react-query";

import { mouseGroupApi } from "@/api";

export const useUpdateMouseGroupNoOfMice = () => {
  return useMutation({
    mutationFn: ({
      mouseGroupId,
      no_of_mice,
    }: {
      mouseGroupId: number;
      no_of_mice: number;
    }) => mouseGroupApi.updateMouseGroupNoOfMice(mouseGroupId, { no_of_mice }),
  });
};
