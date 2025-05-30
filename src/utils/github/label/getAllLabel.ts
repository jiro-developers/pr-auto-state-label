import * as github from '@actions/github';
import { minimatch } from 'minimatch';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

interface GetAllLabelProps {
  token: string;
  filterPattern?: string;
}

const getAllLabel = async ({ token, filterPattern }: GetAllLabelProps) => {
  const octokit = github.getOctokit(token);
  const context = getGithubContext();
  const { owner, repo, number } = context.issue;

  logger.info({
    message: `Getting all labels${filterPattern ? ` with filter: ${filterPattern}` : ''}`,
  });

  const allLabelList = await octokit.paginate(octokit.rest.issues.listLabelsOnIssue, {
    owner,
    repo,
    issue_number: number,
  });

  if (!filterPattern) {
    return allLabelList.map((label) => label.name);
  }

  const filteredLabelList = allLabelList.filter((label) => {
    return minimatch(label.name, filterPattern, {
      nobrace: false,
    });
  });

  return filteredLabelList.map((label) => label.name);
};

export { getAllLabel };
