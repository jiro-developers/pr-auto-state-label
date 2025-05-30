import { getAllLabel } from '@/utils/github/label/getAllLabel';
import { removeLabel } from '@/utils/github/label/removeLabel';
import { logger } from '@/utils/github/logger';

interface RemoveLabelProps {
  token: string;
  deleteLabelPattern?: string;
  additionalRemoveLabelList?: string[];
}

const removeMultipleLabel = async ({ token, deleteLabelPattern, additionalRemoveLabelList = [] }: RemoveLabelProps) => {
  const { removeSpecificLabel } = removeLabel(token);

  if (deleteLabelPattern) {
    const filteredLabelList = await getAllLabel({ token, filterPattern: deleteLabelPattern });
    logger.info({
      message: `Filtered labels to remove: ${filteredLabelList.join(', ')}`,
    });

    const labelsToRemove = [...filteredLabelList, ...additionalRemoveLabelList];

    if (labelsToRemove.length === 0) {
      logger.info({
        message: 'No labels to remove',
      });

      return;
    }

    const buildRemoveMultipleLabel = labelsToRemove.map((label) => {
      return removeSpecificLabel(label);
    });

    return Promise.allSettled(buildRemoveMultipleLabel);
  }

  const buildRemoveMultipleLabel = additionalRemoveLabelList.map((label) => {
    return removeSpecificLabel(label);
  });

  return Promise.allSettled(buildRemoveMultipleLabel);
};

export { removeMultipleLabel };
