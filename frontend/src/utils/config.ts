const private_key = process.env.PRIVATE_KEY ?? "";
const network = process.env.NETWORK ?? "";
const thirdweb_secretkey = process.env.THIRDWEB_SECRET ?? "";

export { private_key, network, thirdweb_secretkey };
