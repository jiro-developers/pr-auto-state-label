import type { REVIEW_STATE } from '@/constants/common';

type RequiredActionInputKey =
  | 'token' // GitHub Token
  | 'label';

type OptionalActionInputKey = 'deleteLabelPattern'; // globPattern -> 삭제하지 않을 태그 목록

type ActionInputKey = RequiredActionInputKey | OptionalActionInputKey;

type LabelInput = Record<'comment' | 'requestChange' | 'approve', string>;

type ReviewState = (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE];

export type { ActionInputKey, RequiredActionInputKey, OptionalActionInputKey, LabelInput, ReviewState };
