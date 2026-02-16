import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { toast } from "sonner";

import { hotlabApi } from "@/api";
import { Button, Input, Label } from "@/components/atoms";
import type { CreateHotlabExperimentPayload } from "@/types/hotlab";

interface HotlabExperimentFormProps {
  projectId?: number;
  specialization?: string;
}

const HotlabExperimentForm: FC<HotlabExperimentFormProps> = ({
  projectId,
  specialization,
}) => {
  const [experimentName, setExperimentName] = useState("");

  const { mutate: createHotlab, isPending } = useMutation({
    mutationFn: (payload: CreateHotlabExperimentPayload) =>
      hotlabApi.createExperiment(payload),
  });

  const handleSave = () => {
    if (projectId === undefined || specialization === undefined) {
      toast.error("Project ID or Specialization is undefined");
      return;
    }

    const payload: CreateHotlabExperimentPayload = {
      project_id: projectId, // Replace with actual project ID
      experiment_name: experimentName.trim(), // Replace with actual experiment name
      specialization: specialization.toUpperCase(), // Replace with actual specialization
    };
    createHotlab(payload);
  };

  return (
    <div>
      <Label className="mb-3">Experiment Name</Label>
      <Input
        value={experimentName}
        onChange={(e) => setExperimentName(e.target.value)}
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" size="lg" disabled={false}>
          Cancel
        </Button>
        <Button size="lg" type="submit" disabled={false} onClick={handleSave}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default HotlabExperimentForm;
