import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

const removeSpecificLabel = (token: string) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo },
    payload: { pull_request: { number: pullRequestNumber } = {} },
  } = getGithubContext();

  return (label: string) => {
    // PR 번호가 없는 경우 오류를 기록하고 종료합니다.
    if (!pullRequestNumber) {
      logger.error({
        message: `Missing pull request number in the context > ${pullRequestNumber}`,
      });

      return;
    }

    // Octokit API를 사용하여 라벨을 제거합니다.
    return octokit.rest.issues.removeLabel({
      owner,
      repo,
      issue_number: pullRequestNumber,
      name: label,
    });
  };
};

export { removeSpecificLabel };
