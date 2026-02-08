import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/`
});