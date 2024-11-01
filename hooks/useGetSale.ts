
import DI from "@/di-container";
import { RootState } from "@/store";
import { CategoryType } from "@/types/category";
import { ISale } from "@/types/sale";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingSale: boolean;
  saleResponse: ISale | null;
  error: any;
}

export default function useGetSale(
  id: string
): [() => void, boolean, ISale | null, any] {
  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingSale: false,
      saleResponse: null,
      error: null,
    }
  );
  async function getSale() {
    updateState({ loadingSale: true });
    if (!id) {
      toast.error("Invalid sale id");
      return;
    }
    try {
      const res = await DI.saleService.getSale(id);
      updateState({ loadingSale: false, saleResponse: res.data });
      return res;
    } catch (error: any) {
      updateState({ loadingSale: false });
      toast.error(error.message);
    } finally {
      updateState({ loadingSale: false });
    }
  }

  useEffect(() => {
    getSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return [getSale, state.loadingSale, state.saleResponse, state.error];
}
