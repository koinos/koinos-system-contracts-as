import { authority, chain, protocol, system_call_ids, System, Protobuf,
  Base58, value, error, system_calls, Token, SafeMath, token, Crypto } from "koinos-sdk-as";

System.MAX_BUFFER_SIZE = 1024 * 1024; // 1 MB

namespace Constants {
  export const NAME = "Virtual Hash Power"
  export const SYMBOL = "VHP";
  export const DECIMALS: u32 = 8;
  export const SUPPLY_ID: u32 = 0;
  export const BALANCE_ID: u32 = 1;
  export const SUPPLY_KEY = new Uint8Array(0);
  export var   CONTRACT_ID: Uint8Array;
}

namespace State {
  export namespace Space {
    export var SUPPLY: chain.object_space;
    export var BALANCE: chain.object_space;
  }
}

export class Vhp {

  constructor() {
    Constants.CONTRACT_ID = System.getContractId();
    State.Space.SUPPLY = new chain.object_space(true, Constants.CONTRACT_ID, Constants.SUPPLY_ID);
    State.Space.BALANCE = new chain.object_space(true, Constants.CONTRACT_ID, Constants.BALANCE_ID);
  }

  name(args?: token.name_arguments): token.name_result {
    let result = new token.name_result();
    result.value = Constants.NAME;
    return result;
  }

  symbol(args?: token.symbol_arguments): token.symbol_result {
    let result = new token.symbol_result();
    result.value = Constants.SYMBOL;
    return result;
  }

  decimals(args?: token.decimals_arguments): token.decimals_result {
    let result = new token.decimals_result();
    result.value = Constants.DECIMALS;
    return result;
  }

  total_supply(args?: token.total_supply_arguments): token.total_supply_result {
    let result = new token.total_supply_result();

    let supplyObject = System.getObject<Uint8Array, token.balance_object>(State.Space.SUPPLY, Constants.SUPPLY_KEY, token.balance_object.decode);

    if (!supplyObject) {
      result.value = 0;
    }
    else {
      result.value = supplyObject.value;
    }

    return result;
  }

  balance_of(args: token.balance_of_arguments): token.balance_of_result {
    let result = new token.balance_of_result();

    System.require(args.owner != null, 'owner cannot be null');

    let fromBalanceObj = System.getObject<Uint8Array, token.balance_object>(State.Space.BALANCE, args.owner!, token.balance_object.decode);

    if (!fromBalanceObj) {
      result.value = 0;
    }
    else {
      result.value = fromBalanceObj.value;
    }

    return result;
  }

  transfer(args: token.transfer_arguments): token.transfer_result {
    System.require(args.to != null, 'to cannot be null');
    System.require(args.from != null, 'from cannot be null');
    System.require(args.to != args.from, 'cannot transfer to yourself');

    let callerData = System.getCaller();
    System.require(
      callerData.caller == args.from || System.checkAuthority(authority.authorization_type.contract_call, args.from!),
      'from has not authorized transfer',
      error.error_code.authorization_failure
    );

    let fromBalanceObj = System.getObject<Uint8Array, token.balance_object>(State.Space.BALANCE, args.from!, token.balance_object.decode);

    if (!fromBalanceObj) {
      fromBalanceObj = new token.balance_object();
      fromBalanceObj.value = 0;
    }

    System.require(fromBalanceObj.value >= args.value, "account 'from' has insufficient balance", error.error_code.failure);

    let toBalanceObj = System.getObject<Uint8Array, token.balance_object>(State.Space.BALANCE, args.to!, token.balance_object.decode);

    if (!toBalanceObj) {
      toBalanceObj = new token.balance_object();
      toBalanceObj.value = 0;
    }

    fromBalanceObj.value -= args.value;
    toBalanceObj.value += args.value;

    System.putObject(State.Space.BALANCE, args.from!, fromBalanceObj, token.balance_object.encode);
    System.putObject(State.Space.BALANCE, args.to!, toBalanceObj, token.balance_object.encode);

    let event = new token.transfer_event();
    event.from = args.from;
    event.to = args.to;
    event.value = args.value;

    let impacted: Uint8Array[] = [];
    impacted.push(args.to!);
    impacted.push(args.from!);

    System.event('vhp.transfer', Protobuf.encode(event, token.transfer_event.encode), impacted);

    return new token.transfer_result();
  }

  mint(args: token.mint_arguments): token.mint_result {
    System.require(args.to != null, "mint argument 'to' cannot be null");
    System.require(args.value != 0, "mint argument 'value' cannot be zero");

    if (System.getCaller().caller_privilege != chain.privilege.kernel_mode) {
      if (BUILD_FOR_TESTING) {
        System.requireAuthority(authority.authorization_type.contract_call, Constants.CONTRACT_ID);
      }
      else {
        System.fail('insufficient privileges to mint', error.error_code.authorization_failure);
      }
    }

    let supplyObject = System.getObject<Uint8Array, token.balance_object>(State.Space.SUPPLY, Constants.SUPPLY_KEY, token.balance_object.decode);

    if (!supplyObject) {
      supplyObject = new token.balance_object();
      supplyObject.value = 0;
    }

    System.require(supplyObject.value <= u64.MAX_VALUE - args.value, 'mint would overflow supply', error.error_code.failure);

    let balanceObject = System.getObject<Uint8Array, token.balance_object>(State.Space.BALANCE, args.to!, token.balance_object.decode);

    if (!balanceObject) {
      balanceObject = new token.balance_object();
      balanceObject.value = 0;
    }

    balanceObject.value += args.value;
    supplyObject.value += args.value;

    System.putObject(State.Space.SUPPLY, Constants.SUPPLY_KEY, supplyObject, token.balance_object.encode);
    System.putObject(State.Space.BALANCE, args.to!, balanceObject, token.balance_object.encode);

    let event = new token.mint_event();
    event.to = args.to;
    event.value = args.value;

    let impacted: Uint8Array[] = [];
    impacted.push(args.to!);

    System.event('vhp.mint', Protobuf.encode(event, token.mint_event.encode), impacted);

    return new token.mint_result();;
  }

  burn(args: token.burn_arguments): token.burn_result {
    System.require(args.from != null, "burn argument 'from' cannot be null");

    let callerData = System.getCaller();
    System.require(
      callerData.caller_privilege == chain.privilege.kernel_mode || callerData.caller == args.from || System.checkAuthority(authority.authorization_type.contract_call, args.from!),
      'from has not authorized burn',
      error.error_code.authorization_failure
    );

    let fromBalanceObject = System.getObject<Uint8Array, token.balance_object>(State.Space.BALANCE, args.from!, token.balance_object.decode);

    if (fromBalanceObject == null) {
      fromBalanceObject = new token.balance_object();
      fromBalanceObject.value = 0;
    }

    System.require(fromBalanceObject.value >= args.value, "account 'from' has insufficient balance", error.error_code.failure);

    let supplyObject = System.getObject<Uint8Array, token.balance_object>(State.Space.SUPPLY, Constants.SUPPLY_KEY, token.balance_object.decode);

    if (!supplyObject) {
      supplyObject = new token.balance_object();
      supplyObject.value = 0;
    }

    System.require(supplyObject.value >= args.value, 'burn would underflow supply', error.error_code.failure);

    supplyObject.value -= args.value;
    fromBalanceObject.value -= args.value;

    System.putObject(State.Space.SUPPLY, Constants.SUPPLY_KEY, supplyObject, token.balance_object.encode);
    System.putObject(State.Space.BALANCE, args.from!, fromBalanceObject, token.balance_object.encode);

    let event = new token.burn_event();
    event.from = args.from;
    event.value = args.value;

    let impacted: Uint8Array[] = [];
    impacted.push(args.from!);

    System.event('vhp.burn', Protobuf.encode(event, token.burn_event.encode), impacted);

    return new token.burn_result();
  }
}
