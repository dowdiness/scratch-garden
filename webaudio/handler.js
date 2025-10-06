// WIP: WebAssembly AudioWorklet example
import workletUrl from "./worklet.js?url"

let started = false
let node
const context = new AudioContext()

export const handleClick = async () => {
  if (!started) {
    await context.resume()
    await context.audioWorklet.addModule(workletUrl)
    node = new AudioWorkletNode(context, "wasm-processor");
    let res = await fetch("out.wasm"); //
    const buffer = await res.arrayBuffer();
    node.port.postMessage({ webassembly: buffer });
    node.connect(context.destination);
    started = true;
  } else {
    node.port.postMessage({ stop: true });
    node.disconnect();
    started = false;
  }
};
