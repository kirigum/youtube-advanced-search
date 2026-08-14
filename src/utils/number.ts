export const formatToCompactNumber = (num: number | string) => {
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(parsedNum)) {
    return num;
  }

  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(parsedNum);
};
