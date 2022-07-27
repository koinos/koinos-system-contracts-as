import { System, Protobuf, authority, system_calls, pob } from "koinos-sdk-as";
import { Pob as ContractClass } from "./Pob";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x859facc5: {
      const args = Protobuf.decode<pob.burn_arguments>(
        contractArgs.args,
        pob.burn_arguments.decode
      );
      const res = c.burn(args);
      retbuf = Protobuf.encode(
        res,
        pob.burn_result.encode
      );
      break;
    }

    case 0x5fd7ac0f: {
      const args = Protobuf.decode<pob.get_consensus_parameters_arguments>(
        contractArgs.args,
        pob.get_consensus_parameters_arguments.decode
      );
      const res = c.get_consensus_parameters(args);
      retbuf = Protobuf.encode(
        res,
        pob.get_consensus_parameters_result.encode
      );
      break;
    }

    case 0xfcf7a68f: {
      const args = Protobuf.decode<pob.get_metadata_arguments>(
        contractArgs.args,
        pob.get_metadata_arguments.decode
      );
      const res = c.get_metadata(args);
      retbuf = Protobuf.encode(
        res,
        pob.get_metadata_result.encode
      );
      break;
    }

    case 0x96634f68: {
      const args = Protobuf.decode<pob.get_public_key_arguments>(
        contractArgs.args,
        pob.get_public_key_arguments.decode
      );
      const res = c.get_public_key(args);
      retbuf = Protobuf.encode(
        res,
        pob.get_public_key_result.encode
      );
      break;
    }

    case 0x53192be1: {
      const args =
        Protobuf.decode<pob.register_public_key_arguments>(
          contractArgs.args,
          pob.register_public_key_arguments.decode
        );
      const res = c.register_public_key(args);
      retbuf = Protobuf.encode(
        res,
        pob.register_public_key_result.encode
      );
      break;
    }

    case 0xe0adbeab: {
      const args = Protobuf.decode<system_calls.process_block_signature_arguments>(
        contractArgs.args,
        system_calls.process_block_signature_arguments.decode
      );
      const res = c.process_block_signature(args);
      retbuf = Protobuf.encode(res, system_calls.process_block_signature_result.encode);
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
