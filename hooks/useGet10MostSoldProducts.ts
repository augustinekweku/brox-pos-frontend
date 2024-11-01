import DI from "@/di-container";
import { RootState } from "@/store";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface StateType {
  loadingMostSoldProducts: boolean;
  mostSoldProducts: any;
  error: any;
}

export default function useGet10MostSoldProducts(): [
  () => void,
  boolean,
  any,
  any
] {
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: StateType, newState: Partial<StateType>) => {
      const update = { ...state, ...newState };
      return update;
    },
    {
      loadingMostSoldProducts: false,
      mostSoldProducts: {} as any,
      error: null,
    }
  );
  async function getMostSoldProducts() {
    updateState({ loadingMostSoldProducts: true });
    console.log(
      "userFromRedux?.activeOrganization in getMostSoldProducts",
      userFromRedux?.activeOrganization
    );
    try {
      const res = await DI.saleService.get10MostSoldProductsByOrg(
        userFromRedux?.activeOrganization
      );
      console.log("res", res);
      updateState({
        loadingMostSoldProducts: false,
        mostSoldProducts: res.data.products,
      });
      return res;
    } catch (error) {
      console.log("error", error);
      updateState({ loadingMostSoldProducts: false });
      toast.error("Error fetching most sold products");
    }
  }

  useEffect(() => {
    getMostSoldProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromRedux?.activeOrganization]);

  return [
    getMostSoldProducts,
    state.loadingMostSoldProducts,
    state.mostSoldProducts,
    state.error,
  ];
}
