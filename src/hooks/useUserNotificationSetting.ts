import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { profileApi } from "@/api/ProfileApi";
import { handleApiError } from "@/lib";

export const useUserNotificationSetting = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["user-notification-setting"],
    queryFn: profileApi.getUserNotificationSetting,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: profileApi.updateUserNotificationSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-notification-setting"],
      });

      toast.success("Notification settings updated successfully");
    },
    onError: (error) => {
      const message = handleApiError(
        error,
        "Failed to update notification settings. Please try again."
      );
      toast.error(message);
    },
  });

  return {
    notificationSetting: data?.data?.validate_notification ?? false,
    updateNotificationSetting: mutate,
    isLoading,
    isUpdating: isPending,
  };
};
