import type { LabelInput } from '@/types';
import { safeJsonParse } from '@/utils/common';
import { getGithubCoreInput } from '@/utils/github/getGithubCoreInput';
import { logger } from '@/utils/github/logger';

/**
 * GitHub Action 입력값을 검증하는 함수입니다.
 * @returns 검증된 입력값 객체 또는 검증 실패 시 null
 */
const validateGithubInputList = () => {
  // GitHub Action 입력값을 가져옵니다.
  const inputList = getGithubCoreInput();

  // 필수 입력값이 없는 경우 오류를 기록하고 null을 반환합니다.
  if (!inputList) {
    logger.error('Required inputs are missing. Action cannot proceed.');
    return null;
  }

  // 입력값에서 필요한 항목을 추출합니다.
  const { token, label, deleteLabelPattern } = inputList;
  // 라벨 JSON 문자열을 파싱합니다.
  const parseLabel = safeJsonParse<LabelInput>(label);

  // 라벨 파싱이 실패한 경우 오류를 기록하고 null을 반환합니다.
  if (!parseLabel) {
    logger.error('Label input is not valid JSON. Action cannot proceed.');
    return null;
  }

  // 입력값을 성공적으로 받았음을 로깅합니다.
  logger.info({
    message: 'Inputs received successfully.',
    label,
    deleteLabelPattern,
  });

  // 검증된 입력값을 반환합니다.
  return { token, parseLabel, deleteLabelPattern };
};

export { validateGithubInputList };
