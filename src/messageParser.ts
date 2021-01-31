type ParserContext = {
  org: string;
};

type Result = SuccessResult | FailureResult;

type SuccessResult = {
  type: 'success';
  team: string;
  count: number;
};

type FailureResult = {
  type: 'failure';
  message: string;
};

export const parse = (message: string, context: ParserContext): Result => {
  const matches = message.match(
    /^\/random(?:\s+(\d+))?\s+@([a-zA-Z0-9\-_]+)\/([a-zA-Z0-9\-_]+)/,
  );
  if (matches) {
    const count = typeof matches[1] !== 'undefined' ? Number(matches[1]) : 1;

    if (matches[2] !== context.org) {
      return {
        type: 'failure',
        message: `the team must belong to ${context.org} organization`,
      };
    }

    return {
      type: 'success',
      team: matches[3],
      count,
    };
  } else {
    return {
      type: 'failure',
      message: 'invalid message format',
    };
  }
};
