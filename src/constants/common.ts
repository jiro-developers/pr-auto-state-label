import type { ActionInputKey, OptionalActionInputKey, RequiredActionInputKey } from '@/types';

/**
 * 액션에서 필수적으로 사용되는 입력되어야 할 키 값입니다.
 * **/
const ACTION_REQUIRED_INPUT_KEY_LIST: RequiredActionInputKey[] = [
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

const ACTION_OPTIONAL_INPUT_KEY_LIST: OptionalActionInputKey[] = [
  'deleteLabelPattern', // globPattern -> 삭제하지 않을 라벨 목록
] as const;

const ACTION_INPUT_KEY_LIST: ActionInputKey[] = [...ACTION_REQUIRED_INPUT_KEY_LIST, ...ACTION_OPTIONAL_INPUT_KEY_LIST];

const REVIEW_STATE = {
  approve: 'APPROVED',
  requestChange: 'CHANGES_REQUESTED',
  comment: 'COMMENTED',
} as const;

const DEFAULT_REVIEW_STATE = 'unknown';

export {
  ACTION_REQUIRED_INPUT_KEY_LIST,
  ACTION_INPUT_KEY_LIST,
  ACTION_OPTIONAL_INPUT_KEY_LIST,
  REVIEW_STATE,
  DEFAULT_REVIEW_STATE,
};
