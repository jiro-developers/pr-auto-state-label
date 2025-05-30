import * as core from '@actions/core';

import { ACTION_INPUT_KEY_LIST, ACTION_REQUIRED_INPUT_KEY_LIST } from '@/constants/common';
import type { OptionalActionInputKey, RequiredActionInputKey } from '@/types';
import { logger } from '@/utils/github/logger';

/**
 * GitHub Action의 입력값을 가져오는 함수입니다.
 * @returns 필수 및 선택적 입력값을 포함한 객체 또는 필수 입력값이 없는 경우 null
 */
const getGithubCoreInput = () => {
  const result = Object.fromEntries(ACTION_INPUT_KEY_LIST.map((key) => [key, core.getInput(key)]));

  logger.info(result);

  // 필수 입력값 중 빠진 것이 있는지 확인합니다.
  const missingInputKeyList = ACTION_REQUIRED_INPUT_KEY_LIST.filter((key) => !result[key]);

  // 필수 입력값이 빠진 경우 오류를 기록하고 null을 반환합니다.
  if (missingInputKeyList.length) {
    logger.error(`Missing required inputs: ${missingInputKeyList.join(', ')}`);
    return null;
  }

  // 모든 필수 및 선택적 입력값을 포함한 객체를 반환합니다.
  return result as {
    [key in RequiredActionInputKey]: string;
  } & {
    [key in OptionalActionInputKey]?: string;
  };
};

export { getGithubCoreInput };
