import { Inputs } from './inputs';
import { context, getOctokit } from '@actions/github';
import { parse } from './messageParser';
import {
  getTeamMembers,
  postErrorMessageToComment,
  postTeamMembersToComment,
} from './github';
import { randomPick } from './randomPick';

export const pickAndPostRandomMember = async (
  inputs: Inputs,
): Promise<void> => {
  const octokit = getOctokit(inputs.githubToken);
  const org = context.repo.owner;
  const repo = context.repo.repo;
  const issueNumber = context.payload.issue?.number;
  if (typeof issueNumber === 'undefined') {
    throw new Error('issue number is empty');
  }

  const commonParams = {
    octokit,
    org,
    repo,
    issueNumber,
  };

  try {
    const parseResult = parse(context.payload.comment?.body as string, { org });
    if (parseResult.type === 'success') {
      const targetMembers = rejectIgnoredMembers({
        members: await getTeamMembers({
          octokit,
          org,
          teamSlug: parseResult.team,
        }),
        ignoredMembers: inputs.ignoredMembers,
      });
      const members = randomPick(parseResult.count, targetMembers);
      if (members.length === 0) {
        // No members are found
        const message = 'no members are found from the team';
        await postErrorMessageToComment({
          message,
          ...commonParams,
        });
        throw new Error(message);
      } else {
        // Success
        await postTeamMembersToComment({
          members,
          team: parseResult.team,
          ...commonParams,
        });
      }
    } else {
      // Invalid message format
      await postErrorMessageToComment({
        message: parseResult.message,
        ...commonParams,
      });
      throw new Error(parseResult.message);
    }
  } catch (err) {
    // Unknown errors
    await postErrorMessageToComment({
      message: err.message,
      ...commonParams,
    });
    throw err;
  }
};

type rejectIgnoredMembersParams = {
  members: string[];
  ignoredMembers: string[];
};
const rejectIgnoredMembers = ({
  members,
  ignoredMembers,
}: rejectIgnoredMembersParams): string[] => {
  const ignoredMembersHash = ignoredMembers.reduce(
    (acc: { [member: string]: true }, m) => {
      acc[m] = true;
      return acc;
    },
    {},
  );
  return members.reduce((acc: string[], member) => {
    if (ignoredMembersHash[member]) {
      return acc;
    } else {
      return [...acc, member];
    }
  }, []);
};
