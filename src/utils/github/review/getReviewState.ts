import { DEFAULT_REVIEW_STATE, REVIEW_STATE_LIST } from '@/constants/common';
import type { FinalReviewState, Review, ReviewState } from '@/types';

const getFinalReviewStatePerUser = (reviews: Review[]): FinalReviewState[] => {
  // REVIEW_STATE_LIST에 포함된 상태와 유효한 사용자만 필터링
  const validReviewList = reviews.filter((review) => {
    return review.user?.login && review.submitted_at && REVIEW_STATE_LIST.includes(review.state as ReviewState);
  });

  // 고유한 사용자 목록 생성
  const uniqueUserList = Array.from(new Set(validReviewList.map((review) => review.user!.login)));

  // 각 사용자별로 최신 리뷰 찾기
  return uniqueUserList.map((userLogin) => {
    const userReviewList = validReviewList
      .filter((review) => review.user!.login === userLogin)
      .sort(
        (firstReview, secondReview) =>
          new Date(secondReview.submitted_at).getTime() - new Date(firstReview.submitted_at).getTime()
      );

    const latestReview = userReviewList[0];

    return {
      user: latestReview.user?.login,
      state: latestReview.state,
      comment: latestReview.body_text,
    };
  });
};

// PR 전체 상태 결정 (우선순위 적용)
const getFinalPRState = (reviewList: Review[]): ReviewState => {
  const finalReviewList = getFinalReviewStatePerUser(reviewList);

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
