import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import * as bls from '@noble/bls12-381';

function buf2hex(buffer) {
  return [...buffer]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

const getAndLogPK = async () => {
  const coinTypeNode = await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      "coinType": 60
    }
  });
  const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);
  const addressKey0 = await addressKeyDeriver(0);
  const privKey0 = addressKey0.privateKey;
  return await wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: "Showing Account 0",
        description:
          "Private key to be displayed...",
        textAreaContent:
           `
             PK0:  ${JSON.stringify(privKey0)}
           `,
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
      return await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt:
              `Saying Hello from ${origin}`,
            description:
              'Hello incoming...',
            textAreaContent:
              'Hello!',
          },
        ],
      });
    case 'showPK':
      return getAndLogPK();
    default:
      throw new Error('Method not found.');
  }
};
