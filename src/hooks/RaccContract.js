import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractCall, useContractFunction, useCall } from '@usedapp/core';
import RaccContractABI from '../abi/RaccContractABI.json';
import { RaccContractAddress } from '../contracts';

const RaccContractInterface = new ethers.utils.Interface(RaccContractABI);

const RaccContract = new Contract(
  RaccContractAddress,
  RaccContractInterface
);

export const useSetMerkleRoot = () => {
  const { state, send, event } = useContractFunction(
    RaccContract,
    'setMerkleRoot',
    {}
  );
  return { state, send, event };
};

export const useSetMintStep = () => {
  const { state, send, event } = useContractFunction(
    RaccContract,
    'setMintStep',
    {}
  );
  return { state, send, event };
};

export const useGetTotalSupply = () => {
  const { value, error } = useCall({
    contract: new Contract(RaccContractAddress, RaccContractInterface),
    method: 'totalSupply',
    args: []
  }) ?? {}
  if(error) {
    return undefined
  }
  return value;
};


export const useGetSetting = () => {
  const { value, error } = useCall({
    contract: new Contract(RaccContractAddress, RaccContractInterface),
    method: 'getSetting',
    args: []
  }) ?? {}
  if(error) {
    return undefined
  }
  console.log("value", value);
  return value;
};



export const useMintFree = () => {
  const { state, send, event } = useContractFunction(
    RaccContract,
    'mintFree',
    {}
  );
  return { state, send, event };
};

export const useMintPresale = () => {
  const { state, send, event } = useContractFunction(
    RaccContract,
    'mintPresale',
    {}
  );
  return { state, send, event };
};

export const useMintPublic = () => {
  const { state, send, event } = useContractFunction(
    RaccContract,
    'mintPublic',
    {}
  );
  return { state, send, event };
};


export const useWhitelist = (address) => {
  const [whitelist] =
    useContractCall(
      address && {
        abi: RaccContractInterface,
        address: RaccContractAddress,
        method: 'whitelist',
        args: [address],
      }
    ) ?? [];
  return whitelist;
};
