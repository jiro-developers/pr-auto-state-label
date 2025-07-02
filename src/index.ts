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

    const recentReviewList: {
      user?: string;
      state: ReviewState;
    }[] = reviewList.slice(-2).map((review) => ({
      user: review?.user?.login,
      state: review.state as ReviewState,
    }));

    const [previousReview, currentReview] = recentReviewList;

    // 리뷰어 정보 추출
    const previousReviewerName = previousReview?.user;
    const currentReviewerName = currentReview?.user;

    // 리뷰 상태 추출
    const previousReviewState = previousReview?.state;
    const currentReviewState = currentReview?.state;

    // 현재 리뷰어 우선, 없으면 이전 리뷰어 사용
    const activeReviewerName = currentReviewerName ?? previousReviewerName;

    // 리뷰어 이름 패턴 검사
    if (skipReviewerNamePattern && activeReviewerName) {
      const isSkipPatternMatch = minimatch(activeReviewerName, skipReviewerNamePattern);

      const patternMatchMessage = `Reviewer name "${activeReviewerName}" ${
        isSkipPatternMatch ? 'matches' : 'does not match'
      } the skip pattern "${skipReviewerNamePattern}".`;

      logger.info(
        `${patternMatchMessage} ${isSkipPatternMatch ? 'Action will not proceed.' : 'Proceeding with action.'}`
      );

      if (isSkipPatternMatch) {
        return;
      }
    }

    if (!currentReviewState) {
      logger.info({
        message: 'No current review state to process',
        previousReviewState,
      });

      return;
    }

    // 현재 리뷰 상태와 이전 리뷰 상태가 동일한지 확인
    if (currentReviewState === previousReviewState) {
      logger.info({
        message: 'Review state unchanged since last processing',
        reviewState: currentReviewState,
      });

      return;
    }

    logger.info({
      message: 'Review states retrieved successfully.',
      reviewState: currentReviewState,
      previousReviewState: previousReviewState ?? DEFAULT_REVIEW_STATE,
      totalReviewCount: reviewList.length,
    });

    // 모든 라벨 조회
    const allLabelList = await getAllLabel({ token });

    // 리뷰 상태 처리 실행
    await processReviewState({
      token,
      reviewState: currentReviewState,
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
