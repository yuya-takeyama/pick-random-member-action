import { parse } from '../src/messageParser';

describe('messageParser', () => {
  describe('#parse', () => {
    describe('when success', () => {
      describe('with "/random @org/team1"', () => {
        it('returns success result with count is 1', () => {
          const result = parse('/random @org/team1', { org: 'org' });
          expect(result).toEqual({
            type: 'success',
            team: 'team1',
            count: 1,
          });
        });
      });

      describe('with "/random 1 @org/team2"', () => {
        it('returns success result with count is 1', () => {
          const result = parse('/random 1 @org/team2', { org: 'org' });
          expect(result).toEqual({
            type: 'success',
            team: 'team2',
            count: 1,
          });
        });
      });

      describe('with "/random 42 @org/team3"', () => {
        it('returns success result with count is 42', () => {
          const result = parse('/random 42 @org/team3', { org: 'org' });
          expect(result).toEqual({
            type: 'success',
            team: 'team3',
            count: 42,
          });
        });
      });
    });

    describe('when failure', () => {
      describe('with invalid message', () => {
        it('returns failure', () => {
          const result = parse('/random foo', { org: 'org' });
          expect(result).toEqual({
            type: 'failure',
            message: 'invalid message format',
          });
        });
      });

      describe('with the other org', () => {
        it('returns failure', () => {
          const result = parse('/random @org2/team', { org: 'org' });
          expect(result).toEqual({
            type: 'failure',
            message: 'the team must belong to org organization',
          });
        });
      });
    });
  });
});
