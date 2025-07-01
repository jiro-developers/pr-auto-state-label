import { minimatch } from 'minimatch';

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

    const { token, parseLabel, deleteLabelPattern, skipReviewerNamePattern } = inputList;

    const reviewList = await getReviewListWithPaginate({ token });

    if (!reviewList?.length) {
      logger.info('No reviews found for this PR. No action needed.');

      return;
    }

    const [previousReview, lastReview] = reviewList.slice(-2).map((review) => ({
      user: review?.user?.login,
      state: review.state as ReviewState,
    }));

    const previousReviewer = previousReview.user;
    const lastReviewer = lastReview.user;

    const previousReviewState = previousReview?.state;
    const lastReviewState = lastReview?.state;

    const reviewerName = lastReviewer ?? previousReviewer;

    if (skipReviewerNamePattern && reviewerName) {
      const isMatch = minimatch(reviewerName, skipReviewerNamePattern);

      const message = `Reviewer name "${reviewerName}" ${isMatch ? 'matches' : 'does not match'} the skip pattern "${skipReviewerNamePattern}".`;

      logger.info(`${message} ${isMatch ? 'Action will not proceed.' : 'Proceeding with action.'}`);

      if (isMatch) {
        return;
      }
    }

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
