const Utils = require('./utils');

const { genListener } = Utils;

const flagListeners: (() => void)[] = [];
const noFlagListeners: (() => void)[] = [];

function subscribeWithoutFlag(listeners: (() => void)[], fn: () => void): () => void {
  listeners.push(fn);
  return function unSubscribe() {
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
  };
}

function subscribeWithFlag(listeners: (() => void)[], fn: () => void): () => void {
  listeners.push(fn);
  let isSubscribed = true;
  return function unSubscribe() {
    if (!isSubscribed) return;

    isSubscribed = false;
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
  };
}

function dispatch(withSlice = true, listeners: (() => void)[]) {
  const queue: (() => void)[] = withSlice ? listeners.slice() : listeners;
  queue.forEach(fn => fn());
}

function run(withFlag = true) {
  let subscribeFn: {(listener: (() => void)[], fn: () => void): () => void} = subscribeWithFlag;
  let listeners: (() => void)[] = flagListeners;
  if (!withFlag) {
    subscribeFn = subscribeWithoutFlag;
    listeners = noFlagListeners;
  }
  const listenerA = genListener('A');
  subscribeFn(listeners, listenerA)
  subscribeFn(listeners, genListener('B'));
  const unSubscribeC = subscribeFn(listeners, listenerA);

  unSubscribeC();
  unSubscribeC();

  dispatch(withFlag, listeners);
}

// ⚠️ Below test cases cannot run at the same time;
// result: B, A
console.log('==== With Flag ====');
run(true);

console.log('==== Without Flag ====');
// result: B
run(false);