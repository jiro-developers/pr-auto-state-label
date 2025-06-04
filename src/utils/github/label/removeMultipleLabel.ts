import { getAllLabel } from '@/utils/github/label/getAllLabel';
import { removeSpecificLabel } from '@/utils/github/label/removeSpecificLabel';
import { logger } from '@/utils/github/logger';

interface RemoveLabelProps {
  token: string; // GitHub 토큰
  deleteLabelPattern?: string; // 삭제할 라벨 패턴 (선택사항)
  additionalRemoveLabelList?: string[]; // 추가로 삭제할 라벨 목록 (선택사항)
}

const removeMultipleLabel = async ({ token, deleteLabelPattern, additionalRemoveLabelList = [] }: RemoveLabelProps) => {
  const removeLabel = removeSpecificLabel(token);

  // 패턴이 제공된 경우, 해당 패턴에 맞는 라벨을 모두 찾아 제거합니다.
  if (deleteLabelPattern) {
    // 패턴에 맞는 라벨 목록을 가져옵니다.
    const filteredLabelList = await getAllLabel({ token, filterPattern: deleteLabelPattern });
    logger.info({
      message: `Filtered labels to remove: ${filteredLabelList.join(', ')}`,
    });

    // 필터된 라벨과 추가 라벨을 합쳐서 제거 목록을 만듭니다.
    const labelsToRemove = [...filteredLabelList, ...additionalRemoveLabelList];

    // 제거할 라벨이 없는 경우 종료합니다.
    if (labelsToRemove.length === 0) {
      logger.info({
        message: 'No labels to remove',
      });

      return;
    }

    // 각 라벨에 대해 제거 작업을 준비합니다.
    const buildRemoveMultipleLabel = labelsToRemove.map((label) => {
      return removeLabel(label);
    });

    // 모든 라벨 제거 작업을 병렬로 실행합니다.
    return Promise.allSettled(buildRemoveMultipleLabel);
  }

  // 패턴이 없는 경우, 추가 라벨 목록만 제거합니다.
  const buildRemoveMultipleLabel = additionalRemoveLabelList.map((label) => {
    return removeSpecificLabel(label);
  });

  // 모든 라벨 제거 작업을 병렬로 실행합니다.
  return Promise.allSettled(buildRemoveMultipleLabel);
};

export { removeMultipleLabel };
