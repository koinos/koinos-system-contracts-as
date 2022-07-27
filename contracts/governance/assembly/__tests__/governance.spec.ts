import { Base58, chain, protocol, System, Arrays, MockVM } from "koinos-sdk-as";

const CONTRACT_ID = Base58.decode("1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe");
const SPACE = new chain.object_space(false, CONTRACT_ID, 0);

describe("governance", () => {
  beforeEach(() => {
    MockVM.reset();
    MockVM.setContractId(CONTRACT_ID);
  });

});
