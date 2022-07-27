import { System, Protobuf, authority, system_calls, token } from "koinos-sdk-as";
import { Vhp as ContractClass } from "../../vhp/assembly/Vhp";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x82a3537f: {
      const args = Protobuf.decode<token.name_arguments>(
        contractArgs.args,
        token.name_arguments.decode
      );
      const res = c.name(args);
      retbuf = Protobuf.encode(
        res,
        token.name_result.encode
      );
      break;
    }

    case 0xb76a7ca1: {
      const args = Protobuf.decode<token.symbol_arguments>(
        contractArgs.args,
        token.symbol_arguments.decode
      );
      const res = c.symbol(args);
      retbuf = Protobuf.encode(
        res,
        token.symbol_result.encode
      );
      break;
    }

    case 0xee80fd2f: {
      const args =
        Protobuf.decode<token.decimals_arguments>(
          contractArgs.args,
          token.decimals_arguments.decode
        );
      const res = c.decimals(args);
      retbuf = Protobuf.encode(
        res,
        token.decimals_result.encode
      );
      break;
    }

    case 0xb0da3934: {
      const args = Protobuf.decode<token.total_supply_arguments>(
        contractArgs.args,
        token.total_supply_arguments.decode
      );
      const res = c.total_supply(args);
      retbuf = Protobuf.encode(res, token.total_supply_result.encode);
      break;
    }
    case 0x5c721497: {
      const args = Protobuf.decode<token.balance_of_arguments>(
        contractArgs.args,
        token.balance_of_arguments.decode
      );
      const res = c.balance_of(args);
      retbuf = Protobuf.encode(
        res,
        token.balance_of_result.encode
      );
      break;
    }
    case 0x27f576ca: {
      const args = Protobuf.decode<token.transfer_arguments>(
        contractArgs.args,
        token.transfer_arguments.decode
      );
      const res = c.transfer(args);
      retbuf = Protobuf.encode(
        res,
        token.transfer_result.encode
      );
      break;
    }
    case 0xdc6f17bb: {
      const args = Protobuf.decode<token.mint_arguments>(
        contractArgs.args,
        token.mint_arguments.decode
      );
      const res = c.mint(args);
      retbuf = Protobuf.encode(
        res,
        token.mint_result.encode
      );
      break;
    }
    case 0x859facc5: {
      const args = Protobuf.decode<token.burn_arguments>(
        contractArgs.args,
        token.burn_arguments.decode
      );
      const res = c.burn(args);
      retbuf = Protobuf.encode(
        res,
        token.burn_result.encode
      );
      break;
    }
    default:
      System.exit(1);
      break;
  }

  System.exit(0, retbuf);
  return 0;
}

main();
