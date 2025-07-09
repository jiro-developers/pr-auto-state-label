import type { ActionInputKey, OptionalActionInputKey, RequiredActionInputKey } from '@/types';

/**
 * 액션에서 필수적으로 사용되는 입력되어야 할 키 값입니다.
 * **/
const REQUIRED_ACTION_INPUT_KEY_LIST: RequiredActionInputKey[] = [
  'token', // GitHub Token
  /**
   *  label:{
   *     comment: string[] | string
   *     requestChange: string[] | string
   *     approve: string[] | string
   *   },
   **/
  'label',
];

const OPTIONAL_ACTION_INPUT_KEY_LIST: OptionalActionInputKey[] = [
  'deleteLabelPattern', // globPattern -> 삭제하지 않을 라벨 목록
  'skipReviewerNamePattern', // globPattern -> 해당 액션을 실행 시키지 않을 리뷰어 이름 패턴
] as const;

const ACTION_INPUT_KEY_LIST: ActionInputKey[] = [...REQUIRED_ACTION_INPUT_KEY_LIST, ...OPTIONAL_ACTION_INPUT_KEY_LIST];

const REVIEW_STATE = {
  approve: 'APPROVED',
  requestChange: 'CHANGES_REQUESTED',
  comment: 'COMMENTED',
} as const;

const REVIEW_STATE_LIST = Object.values(REVIEW_STATE);

const DEFAULT_REVIEW_STATE = 'unknown';

export {
  REQUIRED_ACTION_INPUT_KEY_LIST,
  ACTION_INPUT_KEY_LIST,
  OPTIONAL_ACTION_INPUT_KEY_LIST,
  REVIEW_STATE,
  DEFAULT_REVIEW_STATE,
  REVIEW_STATE_LIST,
};
