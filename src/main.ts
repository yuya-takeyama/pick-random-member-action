import { getInputs } from './inputs';
import { setFailed } from '@actions/core';
import { pickAndPostRandomMember } from './pickRandomMember';

(async () => {
  try {
    await pickAndPostRandomMember(getInputs());
  } catch (err) {
    setFailed(err);
  }
})();
