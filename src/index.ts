import { DEFAULT_REVIEW_STATE } from '@/constants/common';
import type { ReviewState } from '@/types';
import { getAllLabel } from '@/utils/github/label/getAllLabel';
import { logger } from '@/utils/github/logger';
import { getReviewListWithPaginate } from '@/utils/github/review/getReviewListWithPaginate';
import { processReviewState } from '@/utils/github/review/processReviewState';
import { validateGithubInputList } from '@/utils/github/validateGithubInputList';

const run = async (): Promise<void> => {
  try {
    logger.info('Start to run the action.');

    const inputList = validateGithubInputList();

    if (!inputList) {
      return;
    }

    const { token, parseLabel, deleteLabelPattern } = inputList;

    const reviewList = await getReviewListWithPaginate({ token });

    if (!reviewList?.length) {
      logger.info('No reviews found for this PR. No action needed.');

      return;
    }

    const [previousReviewState, lastReviewState] = reviewList.slice(-2).map((review) => review.state as ReviewState);

    if (!previousReviewState && !lastReviewState) {
      logger.error('Last review state is undefined. Action cannot proceed.');

      return;
    }

    logger.info({
      message: 'Review states retrieved.',
      lastReviewState,
      beforeReviewState: previousReviewState ?? DEFAULT_REVIEW_STATE,
      reviewCount: reviewList.length,
    });

    const allLabelList = await getAllLabel({ token });

    await processReviewState({
      token,
      reviewState: lastReviewState ?? previousReviewState,
      previousReviewState: previousReviewState ?? DEFAULT_REVIEW_STATE,
      parseLabel,
      allLabelList,
      deleteLabelPattern,
    });
  } catch (error) {
    logger.error({
      message: 'An error occurred while running the action.',
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    logger.info({
      message: 'Action execution completed.',
    });
  }
};

run();
