var secureRandom = require('secure-random')

const getIntBetween = (lowerBoundInclusive, upperBoundInclusive) =>
  getInt(upperBoundInclusive - lowerBoundInclusive + 1) + lowerBoundInclusive;

const getInt = (upperBoundExclusive) => {
  if (upperBoundExclusive === 1) {
    return 0; // short-circuit to avoid calling secureRandom with `0`
  }

  const numBytes = Math.ceil(Math.log(upperBoundExclusive) / Math.log(256));
  const startOfBias = Math.pow(2, 8*numBytes) - Math.pow(2, 8*numBytes) % upperBoundExclusive;
  let randomNumber;
  do
  {
    randomNumber = byteArrayToInt(secureRandom(numBytes));
  } while (randomNumber >= startOfBias);
  return randomNumber % upperBoundExclusive;
};
const byteArrayToInt = (bytes=[]) => {
  let result = 0;
  let power = 1;
  for (let i = bytes.length - 1; i >= 0; i--) {
    result += bytes[i]*power;
    power *= 256;
  }
  return result;
};

describe("Random string tests", () => {
    test('non secure', () => {
        var str = Math.random()
        console.log(`Math.random() = ` + str)
        expect(str).toBeGreaterThan(-1);
        expect(str).toBeLessThan(1);
    });

    test('secured', () => {
        var str = getIntBetween(0, 1000000)/1000000
        console.log(`secured random() = ` + str)
        expect(str).toBeGreaterThan(-1);
        expect(str).toBeLessThan(1);
    });
})