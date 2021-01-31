import { randomPick } from '../src/randomPick';

describe('randomPick', () => {
  describe('#randomPick', () => {
    const members = ['member1', 'member2', 'member3', 'member4', 'member5'];

    describe('with count is 1', () => {
      it('returns one element', () => {
        const result = randomPick(1, members);
        expect(result.length).toEqual(1);
      });
    });

    describe('with count is 3', () => {
      it('returns one element', () => {
        const result = randomPick(3, members);
        expect(result.length).toEqual(3);
      });
    });

    describe('with count is 5', () => {
      it('returns one element', () => {
        const result = randomPick(5, members);
        expect(result.length).toEqual(5);
      });
    });

    describe('with count is larger than the number of members', () => {
      it('throws an error', () => {
        expect(() => {
          const result = randomPick(6, members);
        }).toThrow('the number of members are insufficient');
      });
    });
  });
});
