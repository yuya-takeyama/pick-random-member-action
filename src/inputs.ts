import { getInput } from '@actions/core';

export interface Inputs {
  githubToken: string;
  ignoredMembers: string[];
}

export const getInputs = (): Inputs => {
  const githubToken = getInput('github-token', { required: true });
  const ignoredMembers = getInput('ignored-members').split(',');

  return {
    githubToken,
    ignoredMembers,
  };
};
