import type { LabelInput } from '@/types';
import { safeJsonParse } from '@/utils/common';
import { getGithubCoreInput } from '@/utils/github/getGithubCoreInput';
import { logger } from '@/utils/github/logger';

const validateGithubInputList = () => {
  const inputList = getGithubCoreInput();

  if (!inputList) {
    logger.error('Required inputs are missing. Action cannot proceed.');
    return null;
  }

  const { token, label, deleteLabelPattern } = inputList;
  const parseLabel = safeJsonParse<LabelInput>(label);

  if (!parseLabel) {
    logger.error('Label input is not valid JSON. Action cannot proceed.');
    return null;
  }

  logger.info({
    message: 'Inputs received successfully.',
    label,
    deleteLabelPattern,
  });

  return { token, parseLabel, deleteLabelPattern };
};

export { validateGithubInputList };
