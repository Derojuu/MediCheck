import { Client } from "@hashgraph/sdk";

export const mirrorClient = Client.forTestnet();

mirrorClient.setOperator(
    process.env.HEDERA_OPERATOR_ID!,
    process.env.HEDERA_OPERATOR_KEY!
);
