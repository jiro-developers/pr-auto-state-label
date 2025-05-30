import * as github from '@actions/github';

import { getGithubContext } from '@/utils/github/context/getGithubContext';
import { logger } from '@/utils/github/logger';

const MAXIMUM_REVIEW_LIST_COUNT = 100 as const;
interface GetReviewListWithPaginateProps {
  token: string;
}
const getReviewListWithPaginate = async ({ token }: GetReviewListWithPaginateProps) => {
  const octokit = github.getOctokit(token);
  const {
    payload: { pull_request: { number: pullRequestNumber } = {} },
    issue: { owner, repo },
  } = getGithubContext();

  if (!pullRequestNumber) {
    logger.error({
      message: `Missing pull request number in the context > ${pullRequestNumber}`,
    });
    return;
  }

  return await octokit.paginate(octokit.rest.pulls.listReviews, {
    owner,
    repo,
    pull_number: pullRequestNumber,
    per_page: MAXIMUM_REVIEW_LIST_COUNT,
  });
};

export { getReviewListWithPaginate };
