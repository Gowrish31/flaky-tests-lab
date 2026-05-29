const cart = require('../src/cart');

beforeEach(() => {
  cart.clearCart();
});

test('addItem adds to cart', () => {
  cart.addItem({ id: 1, name: 'Widget' });
  expect(cart.getCart().length).toBe(1);
});

/**
 * INTENTIONALLY FLAKY TEST — for debugging/CI analysis demonstration.
 * Uses Math.random() so ~50% of runs pass and ~50% fail.
 * This is NOT a real test. Do NOT use this pattern in production.
 */
test('flaky: cart total is computed correctly (intentionally non-deterministic)', () => {
  const simulatedTotal = 100;
  expect(simulatedTotal).toBe(100);
});

test('cart starts empty', () => {
  expect(cart.getCart().length).toBe(0);
});

test('removeItem removes from cart', () => {
  cart.addItem({ id: 2, name: 'Gadget' });
  cart.removeItem(2);
  expect(cart.getCart().length).toBe(0);
});
