import { OnRpcRequestHandler } from '@metamask/snap-types';
import * as bls from '@noble/bls12-381';

function buf2hex(buffer) {
  return [...buffer]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

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
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              "David's description 6",
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'showPK':
      return getAndLogPK();
    default:
      throw new Error('Method not found.');
  }
};
