import { DEFAULT_REVIEW_STATE, REVIEW_STATE, REVIEW_STATE_LIST } from '@/constants/common';
import type { FinalReviewState, Review, ReviewState } from '@/types';
import { logger } from '@/utils/github/logger';

const getFinalReviewStatePerUser = (reviews: Review[]): FinalReviewState[] => {
  // REVIEW_STATE_LIST에 포함된 상태와 유효한 사용자만 필터링
  const validReviewList = reviews.filter((review) => {
    return review.user?.login && review.submitted_at && REVIEW_STATE_LIST.includes(review.state as ReviewState);
  });

  // 고유한 사용자 목록 생성
  const uniqueUserList = Array.from(new Set(validReviewList.map((review) => review.user!.login)));

  // 각 사용자별로 최종 상태 결정
  return uniqueUserList.map((userLogin) => {
    const userReviewList = validReviewList
      .filter((review) => review.user!.login === userLogin)
      .sort(
        (firstReview, secondReview) =>
          new Date(secondReview.submitted_at).getTime() - new Date(firstReview.submitted_at).getTime()
      );

    // 최신 meaningful 상태 찾기 (APPROVED 또는 CHANGES_REQUESTED)
    const latestDecisiveReview = userReviewList.find(
      (review) => review.state === REVIEW_STATE.approve || review.state === REVIEW_STATE.requestChange
    );

    // meaningful 상태가 있으면 그것을 사용, 없으면 최신 COMMENTED 사용
    const finalReview = latestDecisiveReview || userReviewList[0];

    logger.info({
      message: 'Latest decisive review for user',
      user: userLogin,
      latestDecisiveReview,
      userReviewList,
      finalReview,
    });

    return {
      user: finalReview.user?.login,
      state: finalReview.state,
      comment: userReviewList[0].body_text, // 최신 코멘트 사용
    };
  });
};

// PR 전체 상태 결정 (우선순위 적용)
const getFinalPRState = (reviewList: Review[]): ReviewState => {
  const finalReviewList = getFinalReviewStatePerUser(reviewList);

  logger.info({
    message: 'Final review state per user',
    finalReviewList,
  });

  // 1순위: CHANGES_REQUESTED가 하나라도 있으면
  if (finalReviewList.some((review) => review.state === 'CHANGES_REQUESTED')) {
    return 'CHANGES_REQUESTED';
  }

  // 2순위: APPROVED가 하나라도 있으면 (CHANGES_REQUESTED가 없는 상태에서)
  if (finalReviewList.some((review) => review.state === 'APPROVED')) {
    return 'APPROVED';
  }

  // 3순위: COMMENTED만 있으면
  if (finalReviewList.some((review) => review.state === 'COMMENTED')) {
    return 'COMMENTED';
  }

  // 리뷰가 없는 상태
  return DEFAULT_REVIEW_STATE as ReviewState;
};

export { getFinalReviewStatePerUser, getFinalPRState };
