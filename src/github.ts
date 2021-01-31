import { Octokit } from '@octokit/core';

const usage =
  '<details>\n' +
  '<summary>Usage</summary>\n\n' +
  '### Pick a member from a team\n\n' +
  '```\n' +
  '/random @org/team\n' +
  '```\n\n' +
  '### Pick multiple members from a team\n\n' +
  '```\n' +
  '/random 3 @org/team\n' +
  '```\n\n' +
  'Details: https://github.com/yuya-takeyama/pick-random-member-action\n' +
  '</details>\n';

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
  org: string;
  team: string;
  repo: string;
  issueNumber: number;
};
export const postTeamMembersToComment = async ({
  octokit,
  members,
  org,
  team,
  repo,
  issueNumber,
}: postTeamMembersToCommentParams): Promise<void> => {
  const memberNum =
    members.length === 1 ? 'a member' : `${members.length} members`;
  const memberList = members.map(m => `* @${m}`).join('\n');
  const body = `Picked ${memberNum} from @${org}/${team}

${memberList}
${usage}`;
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: org,
      repo,
      issue_number: issueNumber,
      body,
    },
  );
};

type postErrorMessageToCommentParams = {
  octokit: Octokit;
  message: string;
  org: string;
  repo: string;
  issueNumber: number;
};
export const postErrorMessageToComment = async ({
  octokit,
  message,
  org,
  repo,
  issueNumber,
}: postErrorMessageToCommentParams): Promise<void> => {
  const body = `Error: ${message}
${usage}`;
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: org,
      repo,
      issue_number: issueNumber,
      body,
    },
  );
};
