import useSWR from "swr";
import type { SigilContract } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useSigilContract from "./useSigilContract";

function useGetNonceCall(contract: SigilContract) {
  return async (_: string) => {
  
    const nonce = await contract.nonce();

    return nonce;
  };
}

export default function useGetSigils(
  address: string,
  suspense = false
){
  const contract = useSigilContract(address);

  const shouldFetch =
    !!contract;

  const result = useSWR(
    shouldFetch ? ["GetNonce",] : null,
    useGetNonceCall(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
