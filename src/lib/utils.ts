export function getFormattedRateAndTheme(value: number) {
  const percentage = (value / 10) * 100;
  const decimalPart = percentage - Math.floor(percentage);

  const result =
    decimalPart < 0.5 ? Math.floor(percentage) : Math.ceil(percentage);
  const theme =
    result >= 70
      ? "great_movie"
      : result <= 45
      ? "bad_movie"
      : "medium_movie";

  return [result, theme];
}