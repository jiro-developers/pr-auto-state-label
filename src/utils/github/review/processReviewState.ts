import { REVIEW_STATE } from '@/constants/common';
import type { LabelInput, ReviewState } from '@/types';
import { logger } from '@/utils/github/logger';
import { handleLabelState } from '@/utils/github/review/handleLabelState';

interface ProcessReviewStateProps {
  token: string;
  reviewState: ReviewState;
  parseLabel: LabelInput;
  allLabelList: string[];
  deleteLabelPattern?: string;
}

const processReviewState = async ({
  token,
  reviewState,
  parseLabel,
  allLabelList,
  deleteLabelPattern,
}: ProcessReviewStateProps) => {
  const baseArguments = {
    token,
    allLabelList,
    deleteLabelPattern,
  };

  // Request Change 상태 처리
  if (reviewState === REVIEW_STATE.requestChange) {
    await handleLabelState({
      ...baseArguments,
      labelName: parseLabel.requestChange,
      labelsToRemove: [parseLabel.approve, parseLabel.comment],
    });

    return true;
  }

  // Approve 상태 처리
  if (reviewState === REVIEW_STATE.approve) {
    await handleLabelState({
      ...baseArguments,
      labelName: parseLabel.approve,
      labelsToRemove: [parseLabel.requestChange, parseLabel.comment],
    });

    return;
  }

  // Comment 상태 처리
  if (reviewState === REVIEW_STATE.comment) {
    await handleLabelState({
      ...baseArguments,
      labelName: parseLabel.comment,
      labelsToRemove: [parseLabel.requestChange, parseLabel.approve],
    });

    return;
  }

  return;
};

export { processReviewState };
