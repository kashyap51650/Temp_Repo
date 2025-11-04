import { useCallback, useEffect, useState } from "react";

import {
  cellLineData,
  doseValuesData,
  isotopeData,
  type MasterDataItem,
  type MasterDataType,
  organListData,
  vehiclesData,
} from "@/components/organisms/DataTable/tableData";

const MOCK_DATA: Record<MasterDataType, MasterDataItem[]> = {
  isotope: isotopeData,
  "organ-list": organListData,
  "cell-line": cellLineData,
  "dose-values": doseValuesData,
  vehicles: vehiclesData,
};

export interface UseMasterDataResult {
  data: MasterDataItem[];
  loading: boolean;
  error: string | null;
  addItem: (item: Partial<MasterDataItem>) => Promise<void>;
  updateItem: (id: string, item: Partial<MasterDataItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshData: () => void;
}

export function useMasterData(
  dataType: MasterDataType | null
): UseMasterDataResult {
  const [data, setData] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (type: MasterDataType) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockData = MOCK_DATA[type] || [];
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (item: Partial<MasterDataItem>): Promise<void> => {
    if (!dataType) return;

    setLoading(true);
    setError(null);

    try {
      const idFields = [
        "isotopeId",
        "organId",
        "cellLineId",
        "doseId",
        "vehicleId",
      ];
      const relevantIdField = idFields.find((field) => field in item);

      if (relevantIdField && item[relevantIdField as keyof MasterDataItem]) {
        const duplicate = data.find(
          (existing) =>
            existing[relevantIdField as keyof MasterDataItem] ===
            item[relevantIdField as keyof MasterDataItem]
        );

        if (duplicate) {
          throw new Error("Record already exists.");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const newItem: MasterDataItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdBy: "admin@oranomed.com",
        updatedBy: "admin@oranomed.com",
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      } as MasterDataItem;

      setData((prev) => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (
    id: string,
    updatedItem: Partial<MasterDataItem>
  ): Promise<void> => {
    if (!dataType) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatedItem,
                updatedBy: "admin@oranomed.com",
                updatedAt: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
              }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    if (!dataType) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(() => {
    if (dataType) {
      fetchData(dataType);
    }
  }, [dataType, fetchData]);

  useEffect(() => {
    if (dataType) {
      fetchData(dataType);
    } else {
      setData([]);
    }
  }, [dataType, fetchData]);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refreshData,
  };
}
