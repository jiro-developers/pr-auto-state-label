import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

interface AddLabelProps {
  token: string; // GitHub 토큰
  labelList: string[]; // 추가할 라벨 목록
}

const addLabel = async ({ token, labelList }: AddLabelProps) => {
  const octokit = github.getOctokit(token);
  const {
    issue: { owner, repo, number },
  } = getGithubContext();

  logger.info({
    message: `Adding label: ${labelList.join(', ')}`,
  });

  return octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: number,
    labels: labelList,
  });
};

export { addLabel };
