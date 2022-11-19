import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import * as bls from '@noble/bls12-381';

const getAndLogPK = async () => {
  const result = await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      "coinType": 60
    }
  });
  return wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: getMessage(origin),
        description:
          "Doing the PK stuff",
        textAreaContent:
          `Private Key: ${result.privateKey}
          
          BLS public key ${buf2hex(bls.getPublicKey(result.privateKey))}
          
          Put some info here ${JSON.stringify(result)}`,
      },
    ],
  });
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
    switch (request.method) {
    case 'hello':
      const coinTypeNode = await wallet.request({
        method: 'snap_getBip44Entropy',
        params: {
          "coinType": 60
        }
      });

      const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);
      const addressKey0 = await addressKeyDeriver(0);

      return await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: "Hi there this is a prompt",
            description:
              "Doing the PK stuff",
            textAreaContent:
               `
                 Address key 0: ${JSON.stringify(addressKey0)}
                 ${JSON.stringify({ coinTypeNode })}
               `,
          },
        ],
      });
    case 'showPK':
      return getAndLogPK();
    default:
      throw new Error('Method not found.');
  }
};
