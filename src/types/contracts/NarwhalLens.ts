/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";
import type BN from "bn.js";
import type { EventEmitter } from "events";
import type { EventLog } from "web3-core";
import type { ContractOptions } from "web3-eth-contract";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface NarwhalLens extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): NarwhalLens;
  clone(): NarwhalLens;
  methods: {
    BLOCKS_PER_DAY(): NonPayableTransactionObject<string>;

    getAccountLimits(
      comptroller: string,
      account: string
    ): NonPayableTransactionObject<[string[], string, string]>;

    getDailyNWL(
      account: string,
      comptrollerAddress: string
    ): NonPayableTransactionObject<string>;

    getGovProposals(
      governor: string,
      proposalIds: (number | string | BN)[]
    ): NonPayableTransactionObject<
      [
        string,
        string,
        string,
        string[],
        string[],
        string[],
        string[],
        string,
        string,
        string,
        string,
        boolean,
        boolean
      ][]
    >;

    getGovReceipts(
      governor: string,
      voter: string,
      proposalIds: (number | string | BN)[]
    ): NonPayableTransactionObject<[string, boolean, boolean, string][]>;

    getNWLBalanceMetadata(
      nwl: string,
      account: string
    ): NonPayableTransactionObject<[string, string, string]>;

    getNWLBalanceMetadataExt(
      nwl: string,
      comptroller: string,
      account: string
    ): NonPayableTransactionObject<[string, string, string, string]>;

    getNarwhalVotes(
      nwl: string,
      account: string,
      blockNumbers: (number | string | BN)[]
    ): NonPayableTransactionObject<[string, string][]>;

    nTokenBalances(
      nToken: string,
      account: string
    ): NonPayableTransactionObject<
      [string, string, string, string, string, string]
    >;

    nTokenBalancesAll(
      nTokens: string[],
      account: string
    ): NonPayableTransactionObject<
      [string, string, string, string, string, string][]
    >;

    nTokenMetadata(
      nToken: string
    ): NonPayableTransactionObject<
      [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        boolean,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    >;

    nTokenMetadataAll(
      nTokens: string[]
    ): NonPayableTransactionObject<
      [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        boolean,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ][]
    >;

    nTokenUnderlyingPrice(
      nToken: string
    ): NonPayableTransactionObject<[string, string]>;

    nTokenUnderlyingPriceAll(
      nTokens: string[]
    ): NonPayableTransactionObject<[string, string][]>;

    pendingNarwhal(
      holder: string,
      comptroller: string
    ): NonPayableTransactionObject<string>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}