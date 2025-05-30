import { addLabel } from '@/utils/github/label/addLabel';
import { checkAlreadyHasLabel } from '@/utils/github/label/checkAlreadyHasLabel';
import { removeMultipleLabel } from '@/utils/github/label/removeMultipleLabel';
import { logger } from '@/utils/github/logger';

interface HandleLabelStateProps {
  token: string;
  labelName: string;
  allLabelList: string[];
  labelsToRemove: string[];
  deleteLabelPattern?: string;
}

const handleLabelState = async ({
  token,
  labelName,
  allLabelList,
  labelsToRemove,
  deleteLabelPattern,
}: HandleLabelStateProps) => {
  const hasLabel = checkAlreadyHasLabel({
    compareLabel: labelName,
    labelList: allLabelList,
  });

  await removeMultipleLabel({
    token,
    deleteLabelPattern,
    additionalRemoveLabelList: labelsToRemove,
  });

  if (!hasLabel) {
    await addLabel({
      token,
      labelList: [labelName],
    });

    logger.info({
      message: `Label "${labelName}" added successfully`,
      removedLabels: labelsToRemove,
    });
  }
};

export { handleLabelState };
