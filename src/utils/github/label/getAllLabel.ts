import * as github from '@actions/github';
import { minimatch } from 'minimatch';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

interface GetAllLabelProps {
  token: string; // GitHub 토큰
  filterPattern?: string; // 라벨 필터링을 위한 패턴 (선택사항)
}

const getAllLabel = async ({ token, filterPattern }: GetAllLabelProps) => {
  const octokit = github.getOctokit(token);
  const context = getGithubContext();
  const { owner, repo, number } = context.issue;

  logger.info({
    message: `Getting all labels${filterPattern ? ` with filter: ${filterPattern}` : ''}`,
  });

  // PR에 있는 모든 라벨을 페이지네이션을 통해 가져옵니다.
  const allLabelList = await octokit.paginate(octokit.rest.issues.listLabelsOnIssue, {
    owner,
    repo,
    issue_number: number,
  });

  // 필터 패턴이 없는 경우 모든 라벨 이름을 반환합니다.
  if (!filterPattern) {
    return allLabelList.map((label) => label.name);
  }

  // 필터 패턴이 있는 경우, 패턴에 맞는 라벨만 필터링합니다.
  const filteredLabelList = allLabelList.filter((label) => {
    return minimatch(label.name, filterPattern, {
      nobrace: false,
    });
  });

  // 필터링된 라벨 이름을 반환합니다.
  return filteredLabelList.map((label) => label.name);
};

export { getAllLabel };
