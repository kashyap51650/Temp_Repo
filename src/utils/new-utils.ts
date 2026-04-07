export const newUtils = {
  // Example utility function
  formatDate: (date: Date): string => {
    return date.toISOString().split("T")[0];
  },
};
