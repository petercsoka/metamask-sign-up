var ethUtil = require('ethereumjs-util');

export default function handler(req, res) {
    let msg = "Hello Prezi!"

    const signature = req.query['sig']
    const publicAddress = req.query['addr']

    msg = ethUtil.fromUtf8(msg);
    const msgBuffer = ethUtil.toBuffer(msg);
    // keccak-256 hash
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

    // Elliptic Curve Digital Signature Algorithm (ECDSA)
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v, // signature value
      signatureParams.r, // reference value
      signatureParams.s // signature number
    );

    // Transform public key to address
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);

    if (address.toLowerCase() === publicAddress.toLowerCase()) {
        return res
          .status(200)
          .send({ 
            success: true,
          });
    } else {
        return res
          .status(401)
          .send({
            success: false,
            error: 'Signature verification failed'
          });
      }
}
  
