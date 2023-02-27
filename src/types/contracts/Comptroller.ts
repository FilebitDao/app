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

export type ActionPausedMarket = ContractEventLog<{
  nToken: string;
  action: string;
  pauseState: boolean;
  0: string;
  1: string;
  2: boolean;
}>;
export type ActionProtocolPaused = ContractEventLog<{
  state: boolean;
  0: boolean;
}>;
export type DistributedBorrowerNarwhal = ContractEventLog<{
  nToken: string;
  borrower: string;
  narwhalDelta: string;
  narwhalBorrowIndex: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type DistributedNAIVaultNarwhal = ContractEventLog<{
  amount: string;
  0: string;
}>;
export type DistributedSupplierNarwhal = ContractEventLog<{
  nToken: string;
  supplier: string;
  narwhalDelta: string;
  narwhalSupplyIndex: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type Failure = ContractEventLog<{
  error: string;
  info: string;
  detail: string;
  0: string;
  1: string;
  2: string;
}>;
export type MarketEntered = ContractEventLog<{
  nToken: string;
  account: string;
  0: string;
  1: string;
}>;
export type MarketExited = ContractEventLog<{
  nToken: string;
  account: string;
  0: string;
  1: string;
}>;
export type MarketListed = ContractEventLog<{
  nToken: string;
  0: string;
}>;
export type NarwhalGranted = ContractEventLog<{
  recipient: string;
  amount: string;
  0: string;
  1: string;
}>;
export type NarwhalSpeedUpdated = ContractEventLog<{
  nToken: string;
  newSpeed: string;
  0: string;
  1: string;
}>;
export type NewAccessControl = ContractEventLog<{
  oldAccessControlAddress: string;
  newAccessControlAddress: string;
  0: string;
  1: string;
}>;
export type NewBorrowCap = ContractEventLog<{
  nToken: string;
  newBorrowCap: string;
  0: string;
  1: string;
}>;
export type NewCloseFactor = ContractEventLog<{
  oldCloseFactorMantissa: string;
  newCloseFactorMantissa: string;
  0: string;
  1: string;
}>;
export type NewCollateralFactor = ContractEventLog<{
  nToken: string;
  oldCollateralFactorMantissa: string;
  newCollateralFactorMantissa: string;
  0: string;
  1: string;
  2: string;
}>;
export type NewComptrollerLens = ContractEventLog<{
  oldComptrollerLens: string;
  newComptrollerLens: string;
  0: string;
  1: string;
}>;
export type NewLiquidationIncentive = ContractEventLog<{
  oldLiquidationIncentiveMantissa: string;
  newLiquidationIncentiveMantissa: string;
  0: string;
  1: string;
}>;
export type NewLiquidatorContract = ContractEventLog<{
  oldLiquidatorContract: string;
  newLiquidatorContract: string;
  0: string;
  1: string;
}>;
export type NewNAIController = ContractEventLog<{
  oldNAIController: string;
  newNAIController: string;
  0: string;
  1: string;
}>;
export type NewNAIMintRate = ContractEventLog<{
  oldNAIMintRate: string;
  newNAIMintRate: string;
  0: string;
  1: string;
}>;
export type NewNAIVaultInfo = ContractEventLog<{
  vault_: string;
  releaseStartBlock_: string;
  releaseInterval_: string;
  0: string;
  1: string;
  2: string;
}>;
export type NewNarwhalNAIVaultRate = ContractEventLog<{
  oldNarwhalNAIVaultRate: string;
  newNarwhalNAIVaultRate: string;
  0: string;
  1: string;
}>;
export type NewPauseGuardian = ContractEventLog<{
  oldPauseGuardian: string;
  newPauseGuardian: string;
  0: string;
  1: string;
}>;
export type NewPriceOracle = ContractEventLog<{
  oldPriceOracle: string;
  newPriceOracle: string;
  0: string;
  1: string;
}>;
export type NewSupplyCap = ContractEventLog<{
  nToken: string;
  newSupplyCap: string;
  0: string;
  1: string;
}>;
export type NewTreasuryAddress = ContractEventLog<{
  oldTreasuryAddress: string;
  newTreasuryAddress: string;
  0: string;
  1: string;
}>;
export type NewTreasuryGuardian = ContractEventLog<{
  oldTreasuryGuardian: string;
  newTreasuryGuardian: string;
  0: string;
  1: string;
}>;
export type NewTreasuryPercent = ContractEventLog<{
  oldTreasuryPercent: string;
  newTreasuryPercent: string;
  0: string;
  1: string;
}>;

export interface Comptroller extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Comptroller;
  clone(): Comptroller;
  methods: {
    _become(unitroller: string): NonPayableTransactionObject<void>;

    _grantNWL(
      recipient: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    _setAccessControl(
      newAccessControlAddress: string
    ): NonPayableTransactionObject<string>;

    _setActionsPaused(
      markets: string[],
      actions: (number | string | BN)[],
      paused: boolean
    ): NonPayableTransactionObject<void>;

    _setCloseFactor(
      newCloseFactorMantissa: number | string | BN
    ): NonPayableTransactionObject<string>;

    _setCollateralFactor(
      nToken: string,
      newCollateralFactorMantissa: number | string | BN
    ): NonPayableTransactionObject<string>;

    _setComptrollerLens(
      comptrollerLens_: string
    ): NonPayableTransactionObject<string>;

    _setLiquidationIncentive(
      newLiquidationIncentiveMantissa: number | string | BN
    ): NonPayableTransactionObject<string>;

    _setLiquidatorContract(
      newLiquidatorContract_: string
    ): NonPayableTransactionObject<void>;

    _setMarketBorrowCaps(
      nTokens: string[],
      newBorrowCaps: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    _setMarketSupplyCaps(
      nTokens: string[],
      newSupplyCaps: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    _setNAIController(
      naiController_: string
    ): NonPayableTransactionObject<string>;

    _setNAIMintRate(
      newNAIMintRate: number | string | BN
    ): NonPayableTransactionObject<string>;

    _setNAIVaultInfo(
      vault_: string,
      releaseStartBlock_: number | string | BN,
      minReleaseAmount_: number | string | BN
    ): NonPayableTransactionObject<void>;

    _setNarwhalNAIVaultRate(
      narwhalNAIVaultRate_: number | string | BN
    ): NonPayableTransactionObject<void>;

    _setNarwhalSpeed(
      nToken: string,
      narwhalSpeed: number | string | BN
    ): NonPayableTransactionObject<void>;

    _setPauseGuardian(
      newPauseGuardian: string
    ): NonPayableTransactionObject<string>;

    _setPriceOracle(newOracle: string): NonPayableTransactionObject<string>;

    _setProtocolPaused(state: boolean): NonPayableTransactionObject<boolean>;

    _setTreasuryData(
      newTreasuryGuardian: string,
      newTreasuryAddress: string,
      newTreasuryPercent: number | string | BN
    ): NonPayableTransactionObject<string>;

    _supportMarket(nToken: string): NonPayableTransactionObject<string>;

    accountAssets(
      arg0: string,
      arg1: number | string | BN
    ): NonPayableTransactionObject<string>;

    actionPaused(
      market: string,
      action: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    admin(): NonPayableTransactionObject<string>;

    allMarkets(arg0: number | string | BN): NonPayableTransactionObject<string>;

    borrowAllowed(
      nToken: string,
      borrower: string,
      borrowAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    borrowCapGuardian(): NonPayableTransactionObject<string>;

    borrowCaps(arg0: string): NonPayableTransactionObject<string>;

    borrowVerify(
      nToken: string,
      borrower: string,
      borrowAmount: number | string | BN
    ): NonPayableTransactionObject<void>;

    checkMembership(
      account: string,
      nToken: string
    ): NonPayableTransactionObject<boolean>;

    "claimNarwhal(address)"(holder: string): NonPayableTransactionObject<void>;

    "claimNarwhal(address[],address[],bool,bool)"(
      holders: string[],
      nTokens: string[],
      borrowers: boolean,
      suppliers: boolean
    ): NonPayableTransactionObject<void>;

    "claimNarwhal(address,address[])"(
      holder: string,
      nTokens: string[]
    ): NonPayableTransactionObject<void>;

    "claimNarwhal(address[],address[],bool,bool,bool)"(
      holders: string[],
      nTokens: string[],
      borrowers: boolean,
      suppliers: boolean,
      collateral: boolean
    ): NonPayableTransactionObject<void>;

    claimNarwhalAsCollateral(holder: string): NonPayableTransactionObject<void>;

    closeFactorMantissa(): NonPayableTransactionObject<string>;

    comptrollerImplementation(): NonPayableTransactionObject<string>;

    comptrollerLens(): NonPayableTransactionObject<string>;

    enterMarkets(nTokens: string[]): NonPayableTransactionObject<string[]>;

    exitMarket(nTokenAddress: string): NonPayableTransactionObject<string>;

    getAccountLiquidity(account: string): NonPayableTransactionObject<{
      0: string;
      1: string;
      2: string;
    }>;

    getAllMarkets(): NonPayableTransactionObject<string[]>;

    getAssetsIn(account: string): NonPayableTransactionObject<string[]>;

    getBlockNumber(): NonPayableTransactionObject<string>;

    getHypotheticalAccountLiquidity(
      account: string,
      nTokenModify: string,
      redeemTokens: number | string | BN,
      borrowAmount: number | string | BN
    ): NonPayableTransactionObject<{
      0: string;
      1: string;
      2: string;
    }>;

    getNWLAddress(): NonPayableTransactionObject<string>;

    getNWLNTokenAddress(): NonPayableTransactionObject<string>;

    isComptroller(): NonPayableTransactionObject<boolean>;

    liquidateBorrowAllowed(
      nTokenBorrowed: string,
      nTokenCollateral: string,
      liquidator: string,
      borrower: string,
      repayAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    liquidateBorrowVerify(
      nTokenBorrowed: string,
      nTokenCollateral: string,
      liquidator: string,
      borrower: string,
      actualRepayAmount: number | string | BN,
      seizeTokens: number | string | BN
    ): NonPayableTransactionObject<void>;

    liquidateCalculateSeizeTokens(
      nTokenBorrowed: string,
      nTokenCollateral: string,
      actualRepayAmount: number | string | BN
    ): NonPayableTransactionObject<{
      0: string;
      1: string;
    }>;

    liquidateNAICalculateSeizeTokens(
      nTokenCollateral: string,
      actualRepayAmount: number | string | BN
    ): NonPayableTransactionObject<{
      0: string;
      1: string;
    }>;

    liquidationIncentiveMantissa(): NonPayableTransactionObject<string>;

    liquidatorContract(): NonPayableTransactionObject<string>;

    markets(arg0: string): NonPayableTransactionObject<{
      isListed: boolean;
      collateralFactorMantissa: string;
      isNarwhal: boolean;
      0: boolean;
      1: string;
      2: boolean;
    }>;

    maxAssets(): NonPayableTransactionObject<string>;

    minReleaseAmount(): NonPayableTransactionObject<string>;

    mintAllowed(
      nToken: string,
      minter: string,
      mintAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    mintNAIGuardianPaused(): NonPayableTransactionObject<boolean>;

    mintVerify(
      nToken: string,
      minter: string,
      actualMintAmount: number | string | BN,
      mintTokens: number | string | BN
    ): NonPayableTransactionObject<void>;

    mintedNAIs(arg0: string): NonPayableTransactionObject<string>;

    naiController(): NonPayableTransactionObject<string>;

    naiMintRate(): NonPayableTransactionObject<string>;

    naiVaultAddress(): NonPayableTransactionObject<string>;

    narwhalAccrued(arg0: string): NonPayableTransactionObject<string>;

    narwhalBorrowState(arg0: string): NonPayableTransactionObject<{
      index: string;
      block: string;
      0: string;
      1: string;
    }>;

    narwhalBorrowerIndex(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    narwhalInitialIndex(): NonPayableTransactionObject<string>;

    narwhalNAIVaultRate(): NonPayableTransactionObject<string>;

    narwhalRate(): NonPayableTransactionObject<string>;

    narwhalSpeeds(arg0: string): NonPayableTransactionObject<string>;

    narwhalSupplierIndex(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    narwhalSupplyState(arg0: string): NonPayableTransactionObject<{
      index: string;
      block: string;
      0: string;
      1: string;
    }>;

    oracle(): NonPayableTransactionObject<string>;

    pauseGuardian(): NonPayableTransactionObject<string>;

    pendingAdmin(): NonPayableTransactionObject<string>;

    pendingComptrollerImplementation(): NonPayableTransactionObject<string>;

    protocolPaused(): NonPayableTransactionObject<boolean>;

    redeemAllowed(
      nToken: string,
      redeemer: string,
      redeemTokens: number | string | BN
    ): NonPayableTransactionObject<string>;

    redeemVerify(
      nToken: string,
      redeemer: string,
      redeemAmount: number | string | BN,
      redeemTokens: number | string | BN
    ): NonPayableTransactionObject<void>;

    releaseStartBlock(): NonPayableTransactionObject<string>;

    releaseToVault(): NonPayableTransactionObject<void>;

    repayBorrowAllowed(
      nToken: string,
      payer: string,
      borrower: string,
      repayAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    repayBorrowVerify(
      nToken: string,
      payer: string,
      borrower: string,
      actualRepayAmount: number | string | BN,
      borrowerIndex: number | string | BN
    ): NonPayableTransactionObject<void>;

    repayNAIGuardianPaused(): NonPayableTransactionObject<boolean>;

    seizeAllowed(
      nTokenCollateral: string,
      nTokenBorrowed: string,
      liquidator: string,
      borrower: string,
      seizeTokens: number | string | BN
    ): NonPayableTransactionObject<string>;

    seizeVerify(
      nTokenCollateral: string,
      nTokenBorrowed: string,
      liquidator: string,
      borrower: string,
      seizeTokens: number | string | BN
    ): NonPayableTransactionObject<void>;

    setMintedNAIOf(
      owner: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<string>;

    supplyCaps(arg0: string): NonPayableTransactionObject<string>;

    transferAllowed(
      nToken: string,
      src: string,
      dst: string,
      transferTokens: number | string | BN
    ): NonPayableTransactionObject<string>;

    transferVerify(
      nToken: string,
      src: string,
      dst: string,
      transferTokens: number | string | BN
    ): NonPayableTransactionObject<void>;

    treasuryAddress(): NonPayableTransactionObject<string>;

    treasuryGuardian(): NonPayableTransactionObject<string>;

    treasuryPercent(): NonPayableTransactionObject<string>;
  };
  events: {
    ActionPausedMarket(cb?: Callback<ActionPausedMarket>): EventEmitter;
    ActionPausedMarket(
      options?: EventOptions,
      cb?: Callback<ActionPausedMarket>
    ): EventEmitter;

    ActionProtocolPaused(cb?: Callback<ActionProtocolPaused>): EventEmitter;
    ActionProtocolPaused(
      options?: EventOptions,
      cb?: Callback<ActionProtocolPaused>
    ): EventEmitter;

    DistributedBorrowerNarwhal(
      cb?: Callback<DistributedBorrowerNarwhal>
    ): EventEmitter;
    DistributedBorrowerNarwhal(
      options?: EventOptions,
      cb?: Callback<DistributedBorrowerNarwhal>
    ): EventEmitter;

    DistributedNAIVaultNarwhal(
      cb?: Callback<DistributedNAIVaultNarwhal>
    ): EventEmitter;
    DistributedNAIVaultNarwhal(
      options?: EventOptions,
      cb?: Callback<DistributedNAIVaultNarwhal>
    ): EventEmitter;

    DistributedSupplierNarwhal(
      cb?: Callback<DistributedSupplierNarwhal>
    ): EventEmitter;
    DistributedSupplierNarwhal(
      options?: EventOptions,
      cb?: Callback<DistributedSupplierNarwhal>
    ): EventEmitter;

    Failure(cb?: Callback<Failure>): EventEmitter;
    Failure(options?: EventOptions, cb?: Callback<Failure>): EventEmitter;

    MarketEntered(cb?: Callback<MarketEntered>): EventEmitter;
    MarketEntered(
      options?: EventOptions,
      cb?: Callback<MarketEntered>
    ): EventEmitter;

    MarketExited(cb?: Callback<MarketExited>): EventEmitter;
    MarketExited(
      options?: EventOptions,
      cb?: Callback<MarketExited>
    ): EventEmitter;

    MarketListed(cb?: Callback<MarketListed>): EventEmitter;
    MarketListed(
      options?: EventOptions,
      cb?: Callback<MarketListed>
    ): EventEmitter;

    NarwhalGranted(cb?: Callback<NarwhalGranted>): EventEmitter;
    NarwhalGranted(
      options?: EventOptions,
      cb?: Callback<NarwhalGranted>
    ): EventEmitter;

    NarwhalSpeedUpdated(cb?: Callback<NarwhalSpeedUpdated>): EventEmitter;
    NarwhalSpeedUpdated(
      options?: EventOptions,
      cb?: Callback<NarwhalSpeedUpdated>
    ): EventEmitter;

    NewAccessControl(cb?: Callback<NewAccessControl>): EventEmitter;
    NewAccessControl(
      options?: EventOptions,
      cb?: Callback<NewAccessControl>
    ): EventEmitter;

    NewBorrowCap(cb?: Callback<NewBorrowCap>): EventEmitter;
    NewBorrowCap(
      options?: EventOptions,
      cb?: Callback<NewBorrowCap>
    ): EventEmitter;

    NewCloseFactor(cb?: Callback<NewCloseFactor>): EventEmitter;
    NewCloseFactor(
      options?: EventOptions,
      cb?: Callback<NewCloseFactor>
    ): EventEmitter;

    NewCollateralFactor(cb?: Callback<NewCollateralFactor>): EventEmitter;
    NewCollateralFactor(
      options?: EventOptions,
      cb?: Callback<NewCollateralFactor>
    ): EventEmitter;

    NewComptrollerLens(cb?: Callback<NewComptrollerLens>): EventEmitter;
    NewComptrollerLens(
      options?: EventOptions,
      cb?: Callback<NewComptrollerLens>
    ): EventEmitter;

    NewLiquidationIncentive(
      cb?: Callback<NewLiquidationIncentive>
    ): EventEmitter;
    NewLiquidationIncentive(
      options?: EventOptions,
      cb?: Callback<NewLiquidationIncentive>
    ): EventEmitter;

    NewLiquidatorContract(cb?: Callback<NewLiquidatorContract>): EventEmitter;
    NewLiquidatorContract(
      options?: EventOptions,
      cb?: Callback<NewLiquidatorContract>
    ): EventEmitter;

    NewNAIController(cb?: Callback<NewNAIController>): EventEmitter;
    NewNAIController(
      options?: EventOptions,
      cb?: Callback<NewNAIController>
    ): EventEmitter;

    NewNAIMintRate(cb?: Callback<NewNAIMintRate>): EventEmitter;
    NewNAIMintRate(
      options?: EventOptions,
      cb?: Callback<NewNAIMintRate>
    ): EventEmitter;

    NewNAIVaultInfo(cb?: Callback<NewNAIVaultInfo>): EventEmitter;
    NewNAIVaultInfo(
      options?: EventOptions,
      cb?: Callback<NewNAIVaultInfo>
    ): EventEmitter;

    NewNarwhalNAIVaultRate(cb?: Callback<NewNarwhalNAIVaultRate>): EventEmitter;
    NewNarwhalNAIVaultRate(
      options?: EventOptions,
      cb?: Callback<NewNarwhalNAIVaultRate>
    ): EventEmitter;

    NewPauseGuardian(cb?: Callback<NewPauseGuardian>): EventEmitter;
    NewPauseGuardian(
      options?: EventOptions,
      cb?: Callback<NewPauseGuardian>
    ): EventEmitter;

    NewPriceOracle(cb?: Callback<NewPriceOracle>): EventEmitter;
    NewPriceOracle(
      options?: EventOptions,
      cb?: Callback<NewPriceOracle>
    ): EventEmitter;

    NewSupplyCap(cb?: Callback<NewSupplyCap>): EventEmitter;
    NewSupplyCap(
      options?: EventOptions,
      cb?: Callback<NewSupplyCap>
    ): EventEmitter;

    NewTreasuryAddress(cb?: Callback<NewTreasuryAddress>): EventEmitter;
    NewTreasuryAddress(
      options?: EventOptions,
      cb?: Callback<NewTreasuryAddress>
    ): EventEmitter;

    NewTreasuryGuardian(cb?: Callback<NewTreasuryGuardian>): EventEmitter;
    NewTreasuryGuardian(
      options?: EventOptions,
      cb?: Callback<NewTreasuryGuardian>
    ): EventEmitter;

    NewTreasuryPercent(cb?: Callback<NewTreasuryPercent>): EventEmitter;
    NewTreasuryPercent(
      options?: EventOptions,
      cb?: Callback<NewTreasuryPercent>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "ActionPausedMarket", cb: Callback<ActionPausedMarket>): void;
  once(
    event: "ActionPausedMarket",
    options: EventOptions,
    cb: Callback<ActionPausedMarket>
  ): void;

  once(event: "ActionProtocolPaused", cb: Callback<ActionProtocolPaused>): void;
  once(
    event: "ActionProtocolPaused",
    options: EventOptions,
    cb: Callback<ActionProtocolPaused>
  ): void;

  once(
    event: "DistributedBorrowerNarwhal",
    cb: Callback<DistributedBorrowerNarwhal>
  ): void;
  once(
    event: "DistributedBorrowerNarwhal",
    options: EventOptions,
    cb: Callback<DistributedBorrowerNarwhal>
  ): void;

  once(
    event: "DistributedNAIVaultNarwhal",
    cb: Callback<DistributedNAIVaultNarwhal>
  ): void;
  once(
    event: "DistributedNAIVaultNarwhal",
    options: EventOptions,
    cb: Callback<DistributedNAIVaultNarwhal>
  ): void;

  once(
    event: "DistributedSupplierNarwhal",
    cb: Callback<DistributedSupplierNarwhal>
  ): void;
  once(
    event: "DistributedSupplierNarwhal",
    options: EventOptions,
    cb: Callback<DistributedSupplierNarwhal>
  ): void;

  once(event: "Failure", cb: Callback<Failure>): void;
  once(event: "Failure", options: EventOptions, cb: Callback<Failure>): void;

  once(event: "MarketEntered", cb: Callback<MarketEntered>): void;
  once(
    event: "MarketEntered",
    options: EventOptions,
    cb: Callback<MarketEntered>
  ): void;

  once(event: "MarketExited", cb: Callback<MarketExited>): void;
  once(
    event: "MarketExited",
    options: EventOptions,
    cb: Callback<MarketExited>
  ): void;

  once(event: "MarketListed", cb: Callback<MarketListed>): void;
  once(
    event: "MarketListed",
    options: EventOptions,
    cb: Callback<MarketListed>
  ): void;

  once(event: "NarwhalGranted", cb: Callback<NarwhalGranted>): void;
  once(
    event: "NarwhalGranted",
    options: EventOptions,
    cb: Callback<NarwhalGranted>
  ): void;

  once(event: "NarwhalSpeedUpdated", cb: Callback<NarwhalSpeedUpdated>): void;
  once(
    event: "NarwhalSpeedUpdated",
    options: EventOptions,
    cb: Callback<NarwhalSpeedUpdated>
  ): void;

  once(event: "NewAccessControl", cb: Callback<NewAccessControl>): void;
  once(
    event: "NewAccessControl",
    options: EventOptions,
    cb: Callback<NewAccessControl>
  ): void;

  once(event: "NewBorrowCap", cb: Callback<NewBorrowCap>): void;
  once(
    event: "NewBorrowCap",
    options: EventOptions,
    cb: Callback<NewBorrowCap>
  ): void;

  once(event: "NewCloseFactor", cb: Callback<NewCloseFactor>): void;
  once(
    event: "NewCloseFactor",
    options: EventOptions,
    cb: Callback<NewCloseFactor>
  ): void;

  once(event: "NewCollateralFactor", cb: Callback<NewCollateralFactor>): void;
  once(
    event: "NewCollateralFactor",
    options: EventOptions,
    cb: Callback<NewCollateralFactor>
  ): void;

  once(event: "NewComptrollerLens", cb: Callback<NewComptrollerLens>): void;
  once(
    event: "NewComptrollerLens",
    options: EventOptions,
    cb: Callback<NewComptrollerLens>
  ): void;

  once(
    event: "NewLiquidationIncentive",
    cb: Callback<NewLiquidationIncentive>
  ): void;
  once(
    event: "NewLiquidationIncentive",
    options: EventOptions,
    cb: Callback<NewLiquidationIncentive>
  ): void;

  once(
    event: "NewLiquidatorContract",
    cb: Callback<NewLiquidatorContract>
  ): void;
  once(
    event: "NewLiquidatorContract",
    options: EventOptions,
    cb: Callback<NewLiquidatorContract>
  ): void;

  once(event: "NewNAIController", cb: Callback<NewNAIController>): void;
  once(
    event: "NewNAIController",
    options: EventOptions,
    cb: Callback<NewNAIController>
  ): void;

  once(event: "NewNAIMintRate", cb: Callback<NewNAIMintRate>): void;
  once(
    event: "NewNAIMintRate",
    options: EventOptions,
    cb: Callback<NewNAIMintRate>
  ): void;

  once(event: "NewNAIVaultInfo", cb: Callback<NewNAIVaultInfo>): void;
  once(
    event: "NewNAIVaultInfo",
    options: EventOptions,
    cb: Callback<NewNAIVaultInfo>
  ): void;

  once(
    event: "NewNarwhalNAIVaultRate",
    cb: Callback<NewNarwhalNAIVaultRate>
  ): void;
  once(
    event: "NewNarwhalNAIVaultRate",
    options: EventOptions,
    cb: Callback<NewNarwhalNAIVaultRate>
  ): void;

  once(event: "NewPauseGuardian", cb: Callback<NewPauseGuardian>): void;
  once(
    event: "NewPauseGuardian",
    options: EventOptions,
    cb: Callback<NewPauseGuardian>
  ): void;

  once(event: "NewPriceOracle", cb: Callback<NewPriceOracle>): void;
  once(
    event: "NewPriceOracle",
    options: EventOptions,
    cb: Callback<NewPriceOracle>
  ): void;

  once(event: "NewSupplyCap", cb: Callback<NewSupplyCap>): void;
  once(
    event: "NewSupplyCap",
    options: EventOptions,
    cb: Callback<NewSupplyCap>
  ): void;

  once(event: "NewTreasuryAddress", cb: Callback<NewTreasuryAddress>): void;
  once(
    event: "NewTreasuryAddress",
    options: EventOptions,
    cb: Callback<NewTreasuryAddress>
  ): void;

  once(event: "NewTreasuryGuardian", cb: Callback<NewTreasuryGuardian>): void;
  once(
    event: "NewTreasuryGuardian",
    options: EventOptions,
    cb: Callback<NewTreasuryGuardian>
  ): void;

  once(event: "NewTreasuryPercent", cb: Callback<NewTreasuryPercent>): void;
  once(
    event: "NewTreasuryPercent",
    options: EventOptions,
    cb: Callback<NewTreasuryPercent>
  ): void;
}