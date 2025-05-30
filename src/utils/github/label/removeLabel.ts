import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

const removeLabel = (token: string) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo },
    payload: { pull_request: { number: pullRequestNumber } = {} },
  } = getGithubContext();

  const removeSpecificLabel = (label: string) => {
    if (!pullRequestNumber) {
      logger.error({
        message: `Missing pull request number in the context > ${pullRequestNumber}`,
      });

      return;
    }

    return octokit.rest.issues.removeLabel({
      owner,
      repo,
      issue_number: pullRequestNumber,
      name: label,
    });
  };

  return { removeSpecificLabel };
};

export { removeLabel };
