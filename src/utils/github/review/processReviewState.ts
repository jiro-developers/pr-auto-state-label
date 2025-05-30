import { REVIEW_STATE } from '@/constants/common';
import type { LabelInput, ReviewState } from '@/types';
import { logger } from '@/utils/github/logger';
import { handleLabelState } from '@/utils/github/review/handleLabelState';

const REVIEW_DECIDED_STATE: Exclude<ReviewState, 'COMMENTED'>[] = [REVIEW_STATE.approve, REVIEW_STATE.requestChange];

interface ProcessReviewStateProps {
  token: string;
  reviewState: ReviewState;
  previousReviewState?: ReviewState;
  parseLabel: LabelInput;
  allLabelList: string[];
  deleteLabelPattern?: string;
}

const processReviewState = async ({
  token,
  reviewState,
  previousReviewState,
  parseLabel,
  allLabelList,
  deleteLabelPattern,
}: ProcessReviewStateProps) => {
  const baseArgs = {
    token,
    allLabelList,
    deleteLabelPattern,
  };

  // Request Change 상태 처리
  if (reviewState === REVIEW_STATE.requestChange) {
    await handleLabelState({
      ...baseArgs,
      labelName: parseLabel.requestChange,
      labelsToRemove: [parseLabel.approve, parseLabel.comment],
    });

    return true;
  }

  // Approve 상태 처리
  if (reviewState === REVIEW_STATE.approve) {
    await handleLabelState({
      ...baseArgs,
      labelName: parseLabel.approve,
      labelsToRemove: [parseLabel.requestChange, parseLabel.comment],
    });

    return;
  }

  // Comment 상태 처리
  if (reviewState === REVIEW_STATE.comment) {
    const hasAlreadyBeenReviewed = REVIEW_DECIDED_STATE.includes(
      previousReviewState as Exclude<ReviewState, 'COMMENTED'>
    );

    if (hasAlreadyBeenReviewed) {
      logger.info({
        message: `Last review state was ${previousReviewState}. No action needed.`,
        currentState: reviewState,
      });

      return;
    }

    await handleLabelState({
      ...baseArgs,
      labelName: parseLabel.comment,
      labelsToRemove: [parseLabel.requestChange, parseLabel.approve],
    });

    return;
  }

  return;
};

export { processReviewState };
