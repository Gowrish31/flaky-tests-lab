const { calculateDiscount } = require('../src/pricing');

test('calculateDiscount returns a number', () => {
  expect(typeof calculateDiscount()).toBe('number');
});

test('discount is above minimum threshold', () => {
  const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.8);
  const discount = calculateDiscount();
  expect(discount).toBeGreaterThan(0.05);
  randomSpy.mockRestore();
});
