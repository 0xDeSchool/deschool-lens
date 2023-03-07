function arrayBuffer2Hex(buffer: ArrayBuffer) {
  return (
    `0x${ 
    Array.prototype.map
      .call(new Uint8Array(buffer), (x) => (`00${  x.toString(16)}`).slice(-2))
      .join("")}`
  );
}

function arrayBuffer2String(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer) as any);
}

// ⚠️ Here is an example of generating ECDSA P256 signing key by using Web Crypto API.
// You can use other ways to generate it if you are using other programming language
export async function generateSigningKey() {
  const algorithm = {
    name: "ECDSA",
    namedCurve: "P-256",
  };
  const extractable = false;
  const keyUsages: KeyUsage[] = ["sign", "verify"];

  const signingKey = await window.crypto.subtle.generateKey(
    algorithm,
    extractable,
    keyUsages,
  );

  console.log("signingKey: ", signingKey);

  return signingKey;
}

export async function getPublicKey(signingKey: CryptoKeyPair) {
  const exported = await window.crypto.subtle.exportKey(
    "spki",
    signingKey.publicKey,
  );

  return window.btoa(arrayBuffer2String(exported));
}

export async function signWithSigningKey(
  input: string,
  signingKey: CryptoKeyPair,
) {
  const algorithm = {
    name: "ECDSA",
    hash: {
      name: "SHA-256",
    },
  };
  const enc = new TextEncoder();
  const encodedMessage = enc.encode(input);

  const signature = await window.crypto.subtle.sign(
    algorithm,
    signingKey.privateKey,
    encodedMessage,
  );

  return arrayBuffer2Hex(signature);
}
