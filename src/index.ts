import { minimatch } from 'minimatch';

import { REVIEW_STATE_LIST } from '@/constants/common';
import type { Review } from '@/types';
import { getAllLabel } from '@/utils/github/label/getAllLabel';
import { logger } from '@/utils/github/logger';
import { getReviewListWithPaginate } from '@/utils/github/review/getReviewListWithPaginate';
import { getFinalPRState } from '@/utils/github/review/getReviewState';
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

    // 최신 리뷰어 정보 (skipReviewerNamePattern 검사용)
    const latestReview = reviewList[reviewList.length - 1];
    const currentReviewerName = latestReview?.user?.login;

    // 리뷰어 이름 패턴 검사
    if (skipReviewerNamePattern && currentReviewerName) {
      const isSkipPatternMatch = minimatch(currentReviewerName, skipReviewerNamePattern);

      const patternMatchMessage = `Reviewer name "${currentReviewerName}" ${
        isSkipPatternMatch ? 'matches' : 'does not match'
      } the skip pattern "${skipReviewerNamePattern}".`;

      logger.info(
        `${patternMatchMessage} ${isSkipPatternMatch ? 'Action will not proceed.' : 'Proceeding with action.'}`
      );

      if (isSkipPatternMatch) {
        return;
      }
    }

    // 전체 리뷰 히스토리를 고려한 상태 결정
    const currentReviewState = getFinalPRState(reviewList as Review[]);

    if (!currentReviewState || !REVIEW_STATE_LIST.includes(currentReviewState)) {
      logger.info({
        message: 'No current review state to process',
        reviewState: currentReviewState,
      });

      return;
    }

    logger.info({
      message: 'Review states retrieved successfully.',
      reviewState: currentReviewState,
      reviewComment: latestReview?.body_text,
      totalReviewCount: reviewList.length,
    });

    // 모든 라벨 조회
    const allLabelList = await getAllLabel({ token });

    // 리뷰 상태 처리 실행
    await processReviewState({
      token,
      reviewState: currentReviewState,
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
