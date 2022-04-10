import SigilContract_ABI from "../contracts/SigilContract.json";
import type { SigilContract } from "../contracts/types";
import useContract from "./useContract";

export default function useSigilContract(tokenAddress?: string) {
  return useContract<SigilContract>(tokenAddress, SigilContract_ABI);
}
