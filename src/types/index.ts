import type { Endpoints } from '@octokit/types';
import type { REVIEW_STATE } from '@/constants/common';

type RequiredActionInputKey =
  | 'token' // GitHub Token
  | 'label';

type OptionalActionInputKey =
  | 'deleteLabelPattern' // globPattern -> 삭제하지 않을 태그 목록
  | 'skipReviewerNamePattern'; // globPattern -> 해당 액션을 실행 시키지 않을 리뷰어 이름 패턴

type ActionInputKey = RequiredActionInputKey | OptionalActionInputKey;

type LabelInput = Record<'comment' | 'requestChange' | 'approve', string>;

type ReviewState = (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE];

// GitHub API 원본 타입
type GitHubReview = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['response']['data'][0];

// GitHub 원본 타입을 기반으로 필요한 필드들만 오버라이딩
type Review = Omit<GitHubReview, 'state' | 'submitted_at'> & {
  state: ReviewState;
  submitted_at: string;
};

// 최종 리뷰 상태 타입
type FinalReviewState = {
  user?: string;
  state: ReviewState;
  comment?: string | null;
};

export type { 
  ActionInputKey, 
  RequiredActionInputKey, 
  OptionalActionInputKey, 
  LabelInput, 
  ReviewState,
  GitHubReview,
  Review,
  FinalReviewState
};
