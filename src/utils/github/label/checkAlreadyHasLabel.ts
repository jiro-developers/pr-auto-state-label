interface CheckAlreadyHasLabelProps {
  labelList: string[]; // 검사할 라벨 목록
  compareLabel: string; // 비교할 라벨
}

/**
 *
 * **/
const checkAlreadyHasLabel = ({ labelList, compareLabel }: CheckAlreadyHasLabelProps) => {
  // 라벨 목록에 비교 라벨이 존재하는지 확인합니다.
  return labelList.some((label) => label === compareLabel);
};

export { checkAlreadyHasLabel };
