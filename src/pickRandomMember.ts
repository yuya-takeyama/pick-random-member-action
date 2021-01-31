import { Inputs } from './inputs';
import { context, getOctokit } from '@actions/github';
import { parse } from './messageParser';
import {
  getTeamMembers,
  postErrorMessageToComment,
  postTeamMembersToComment,
} from './github';

export const pickAndPostRandomMember = async (
  inputs: Inputs,
): Promise<void> => {
  const octokit = getOctokit(inputs.githubToken);
  const org = context.repo.owner;
  const repo = context.repo.repo;
  const issueNumber = context.payload.issue?.number!;
  const parseResult = parse(context.payload.comment?.body as string, { org });
  if (parseResult.type === 'success') {
    const members = rejectIgnoredMembers({
      members: await getTeamMembers({
        octokit,
        org,
        teamSlug: parseResult.team,
      }),
      ignoredMembers: inputs.ignoredMembers,
    });
    await postTeamMembersToComment({
      octokit,
      members,
      owner: org,
      team: parseResult.team,
      repo,
      issueNumber,
    });
  } else {
    await postErrorMessageToComment({
      octokit,
      owner: org,
      repo,
      message: parseResult.message,
      issueNumber,
    });
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
