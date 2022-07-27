import { authority } from "koinos-as-sdk";
import { governance } from "./proto/governance";

export class Governance {
  submit_proposal(
    args: governance.submit_proposal_arguments
  ): governance.submit_proposal_result {
    // const proposal = args.proposal;
    // const fee = args.fee;

    // YOUR CODE HERE

    const res = new governance.submit_proposal_result();
    // res.value = ;

    return res;
  }

  get_proposal_by_id(
    args: governance.get_proposal_by_id_arguments
  ): governance.get_proposal_by_id_result {
    // const proposal_id = args.proposal_id;

    // YOUR CODE HERE

    const res = new governance.get_proposal_by_id_result();
    // res.value = ;

    return res;
  }

  get_proposals_by_status(
    args: governance.get_proposals_by_status_arguments
  ): governance.get_proposals_by_status_result {
    // const start_proposal = args.start_proposal;
    // const limit = args.limit;
    // const status = args.status;

    // YOUR CODE HERE

    const res = new governance.get_proposals_by_status_result();
    // res.value = ;

    return res;
  }

  get_proposals(
    args: governance.get_proposals_arguments
  ): governance.get_proposals_result {
    // const start_proposal = args.start_proposal;
    // const limit = args.limit;

    // YOUR CODE HERE

    const res = new governance.get_proposals_result();
    // res.value = ;

    return res;
  }

  block_callback(
    args: governance.block_callback_arguments
  ): governance.block_callback_result {
    // YOUR CODE HERE

    const res = new governance.block_callback_result();

    return res;
  }
}
