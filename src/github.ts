import { Octokit } from '@octokit/core';

type getTeamMembersParams = {
  octokit: Octokit;
  org: string;
  teamSlug: string;
};
export const getTeamMembers = async ({
  octokit,
  org,
  teamSlug,
}: getTeamMembersParams): Promise<string[]> => {
  const res = await octokit.request(
    'GET /orgs/{org}/teams/{team_slug}/members',
    {
      org,
      team_slug: teamSlug,
    },
  );
  return res.data
    .map(d => d?.login)
    .filter(login => typeof login === 'string') as string[];
};

type postTeamMembersToCommentParams = {
  octokit: Octokit;
  members: string[];
  owner: string;
  team: string;
  repo: string;
  issueNumber: number;
};
export const postTeamMembersToComment = async ({
  octokit,
  members,
  owner,
  team,
  repo,
  issueNumber,
}: postTeamMembersToCommentParams): Promise<void> => {
  const memberNum =
    members.length === 1 ? 'a member' : `${members.length} members`;
  const memberList = members.map(m => `* ${m}`).join('\n');
  const body = `Picked ${memberNum} from @${owner}/${team}

${memberList}`;
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner,
      repo,
      issue_number: issueNumber,
      body,
    },
  );
};

type postErrorMessageToCommentParams = {
  octokit: Octokit;
  message: string;
  owner: string;
  repo: string;
  issueNumber: number;
};
export const postErrorMessageToComment = async ({
  octokit,
  message,
  owner,
  repo,
  issueNumber,
}: postErrorMessageToCommentParams) => {
  const body = `Error: ${message}`;
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner,
      repo,
      issue_number: issueNumber,
      body,
    },
  );
};
