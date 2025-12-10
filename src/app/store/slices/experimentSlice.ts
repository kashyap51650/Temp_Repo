import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ExperimentCreatedPayload {
  experimentId: number;
  experimentName: string;
}

interface ProjectChangedPayload {
  newProjectId: number;
  specialization: string;
  studyType: string;
}

interface ExperimentState {
  lastCreatedExperiment: ExperimentCreatedPayload | null;
  lastProjectChange: ProjectChangedPayload | null;
  experimentEventCounter: number;
  projectEventCounter: number;
}

const initialState: ExperimentState = {
  lastCreatedExperiment: null,
  lastProjectChange: null,
  experimentEventCounter: 0,
  projectEventCounter: 0,
};

const experimentSlice = createSlice({
  name: "experiment",
  initialState,
  reducers: {
    experimentCreated(state, action: PayloadAction<ExperimentCreatedPayload>) {
      state.lastCreatedExperiment = action.payload;
      state.experimentEventCounter += 1;
    },

    projectChanged(state, action: PayloadAction<ProjectChangedPayload>) {
      state.lastProjectChange = action.payload;
      state.projectEventCounter += 1;
    },

    clearExperimentEvents(state) {
      state.lastCreatedExperiment = null;
    },

    clearProjectEvents(state) {
      state.lastProjectChange = null;
    },

    resetExperimentState(_state) {
      return initialState;
    },
  },
});

export const {
  experimentCreated,
  projectChanged,
  clearExperimentEvents,
  clearProjectEvents,
  resetExperimentState,
} = experimentSlice.actions;

export default experimentSlice.reducer;
