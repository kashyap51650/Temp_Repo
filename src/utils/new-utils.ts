export const newUtils = {
  // Example utility function
  formatDate: (date: Date): string | null => {
    return date.toISOString().split("T")[0];
  },
};
