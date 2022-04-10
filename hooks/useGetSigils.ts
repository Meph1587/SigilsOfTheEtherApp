import useSWR from "swr";
import type { SigilContract } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useSigilContract from "./useSigilContract";

function useGetSigilsImg(contract: SigilContract) {
  return async (_: string, input: string, color: string) => {
  
    const art = await contract.generateSVG(input.toUpperCase(), color);

    return art;
  };
}

export default function useGetSigils(
  input: string,
  color: string,
  address: string,
  suspense = false
){
  const contract = useSigilContract(address);

  const shouldFetch =
    typeof input === "string" &&
    typeof color === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["GetSigilsImg", input, color] : null,
    useGetSigilsImg(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
