// 引用
import JSEncrypt from 'jsencrypt'

// 公钥
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1L6clBdj8TMNTGpyTfNJTmpPI\n' +
  'JgVNcre1I5r5zT05CvDQU4syuJE5AJGGpmABwhfaORhGvFVsBs8x7l71J1T5FlA4\n' +
  '/vQptf+7Ph3K5GhMt0qr7MkQ1IxANPDJIWM6OjxEowAk8XIl6xsq81SlVUmOjjPY\n' +
  'QRSKQx0425mRGNviJQIDAQAB'

// 私钥
const privateKey =
  'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALUvpyUF2PxMw1Ma\n' +
  'nJN80lOak8gmBU1yt7UjmvnNPTkK8NBTizK4kTkAkYamYAHCF9o5GEa8VWwGzzHu\n' +
  'XvUnVPkWUDj+9Cm1/7s+HcrkaEy3SqvsyRDUjEA08MkhYzo6PESjACTxciXrGyrz\n' +
  'VKVVSY6OM9hBFIpDHTjbmZEY2+IlAgMBAAECgYAiPXQn0fgUjeknrlLCqIcS15Zv\n' +
  '74d3AGPpLmZeKMQWIJQrum4G0sxW6l2WBaEFFAnv6nRFAdhextanB/YX/CvZaONB\n' +
  '6OUvUt/IbZqyaVZ565x5XwPmSZVbTUGeMLS4QoXDe7nBHdlFyWRv7i2C0MjL3XED\n' +
  '0Ogo77u6GbGqvws7DQJBAO6T6CXm+ipOvBVt3QRyRHjIaKWZAM7Rarvssa2uqSZM\n' +
  'tBK8nRftj7/FRR3qJgjO1kLwKr4kRHeoXwDH8TLDYs8CQQDCataUpue8fc+moMHI\n' +
  '3/N9UTvJDYQ4VnZA1gzHi56sgHZijqDuSIwcHh99nuVx0VXLthTyVKEouilX8K7J\n' +
  'jPjLAkARHQDw/xGAyWcKbngFIqEwvMds4X3CWBk846yXFclCWwwrr+Xg2oSOL/tW\n' +
  'Ov6BcTzDTnDydK2Im8Y8yxrNFmDXAkAFKWkBEV1dt8lnlyUN/EQus5VuxRkZldIV\n' +
  '7pjwQ1i3I8IA4+CJ8wslQ/d6ElntJ62rdu4fcPfGaQrn9s/tMfz5AkEAyTYncfa7\n' +
  'P1zq3vhMPG9DQUKK3gtMVLF47r4mHaI1HuhNCILAG4JIPnmOvKOcw7/PrpCIVir3\n' +
  'Wc2UizowAb6w3g=='

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt() // 创建加密对象实例
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const decryptor = new JSEncrypt() // 创建解密对象实例
  decryptor.setPrivateKey(privateKey) // 设置私钥
  return decryptor.decrypt(txt) // 对数据进行解密
}
