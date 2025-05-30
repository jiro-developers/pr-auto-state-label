interface CheckAlreadyHasLabelProps {
  labelList: string[];
  compareLabel: string;
}

const checkAlreadyHasLabel = ({ labelList, compareLabel }: CheckAlreadyHasLabelProps) => {
  return labelList.some((label) => label === compareLabel);
};

export { checkAlreadyHasLabel };
