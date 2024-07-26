import { Buffer } from "buffer";

export const lineDataFromChunk = (chunk: Buffer) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  const data = [];
  for (let i = 0; i < chunkLength; i++) {
    data.push({ value: chunkArray[i] });
  }
  return data;
}

export const rpmFromChunk = (chunk: Buffer) => {
  const chunkLength = chunk.length;
  const chunkArray = new Uint8Array(chunk);
  let rpm = 0;
  for (let i = 0; i < chunkLength; i++) {
    rpm += chunkArray[i] ** 2
  }
  return Math.sqrt(rpm) / chunkLength;
}
