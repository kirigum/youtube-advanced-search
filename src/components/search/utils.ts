export const validateMinMax = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) {
    return min <= max;
  }

  return true;
};


