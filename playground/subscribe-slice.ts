const Utils = require('./utils');

const { genListener } = Utils;
const listeners: (() => void)[] = [];

function subscribe(fn: () => void) {
  listeners.push(fn);
  let isSubscribed = true;
  return function unSubscribe() {
    if (!isSubscribed) return;

    isSubscribed = false;
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
  };
}
function dispatch(withSlice = true) {
  const queue = withSlice ? listeners.slice() : listeners;
  queue.forEach(fn => fn());
}

// Case 1: unSubscribe later listener when subscribe
function registerCase1() {
  function A() {
    console.log('A');
    unSubscribeC();
  }
  subscribe(A);
  subscribe(genListener('B'));
  const unSubscribeC = subscribe(genListener('C'));
}

// Case 2: unSubscribe self when subscribe
function registerCase2() {
  function E() {
    console.log('E');
    unSubscribeE();
  }
  subscribe(genListener('D'));
  const unSubscribeE = subscribe(E);
  subscribe(genListener('F'));
}

// Case 3: unSubscribe previous when subscribe
function registerCase3() {
  function I() {
    console.log('I');
    unSubscribeG();
  }
  const unSubscribeG = subscribe(genListener('G'));
  subscribe(genListener('H'));
  subscribe(I);
}

// ⚠️ Below test cases cannot run at the same time;
/**
 * 1️⃣ Test Case 1.1:
 *  1. withSlice === true
 *  2. unSubscribe later listener when subscribe
 * Result: log: A, B, C, A, B
*/
// registerCase1();
// dispatch();
// dispatch();

/**
 * 2️⃣ Test Case 1.2:
 *  1. withSlice === false
 *  2. unSubscribe later listener when subscribe
 * Result: log: A, B, A, B
*/
// registerCase1();
// dispatch(false);
// dispatch(false);


/**
 * 3️⃣ Test Case 2.1:
 * Condition:
 *  1. withSlice === true
 *  2. unSubscribe self when subscribe
 * Result: log:  D, E, F, D, F
*/
// registerCase2();
// dispatch();
// dispatch();

/**
 * 4️⃣ Test Case 2.2:
 * Condition:
 *  1. withSlice === false
 *  2. unSubscribe self when subscribe
 * Result: log: D, E, D, F
*/
// registerCase2();
// dispatch(false);
// dispatch(false);


/**
 * 5️⃣ Test Case 3.1:
 * Condition:
 *  1. withSlice === true
 *  2. unSubscribe previous when subscribe
 * Result: log: G, H, I, H, I
*/
// registerCase3();
// dispatch();
// dispatch();

/**
 * 6️⃣ Test Case 3.2:
 * Condition:
 *  1. withSlice === false
 *  2. unSubscribe previous when subscribe
 * Result: log: G, H, I, H, I
*/
// registerCase3();
// dispatch(false);
// dispatch(false);
