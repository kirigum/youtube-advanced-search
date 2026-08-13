export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
