export interface YouTubeRegionOption {
  lang: string;
  langCode: string;
  regionCode: string;
}

export const YOUTUBE_REGIONS: YouTubeRegionOption[] = [
  { lang: 'English (US)', langCode: 'en', regionCode: 'US' },
  { lang: 'English (UK)', langCode: 'en', regionCode: 'GB' },
  { lang: 'English (Canada)', langCode: 'en', regionCode: 'CA' },
  { lang: 'English (Australia)', langCode: 'en', regionCode: 'AU' },
  { lang: 'English (India)', langCode: 'en', regionCode: 'IN' },
  { lang: 'Spanish (Spain)', langCode: 'es', regionCode: 'ES' },
  { lang: 'Spanish (Mexico)', langCode: 'es', regionCode: 'MX' },
  { lang: 'Spanish (Argentina)', langCode: 'es', regionCode: 'AR' },
  { lang: 'Spanish (Colombia)', langCode: 'es', regionCode: 'CO' },
  { lang: 'French (France)', langCode: 'fr', regionCode: 'FR' },
  { lang: 'French (Canada)', langCode: 'fr', regionCode: 'CA' },
  { lang: 'German (Germany)', langCode: 'de', regionCode: 'DE' },
  { lang: 'German (Switzerland)', langCode: 'de', regionCode: 'CH' },
  { lang: 'German (Austria)', langCode: 'de', regionCode: 'AT' },
  { lang: 'Portuguese (Brazil)', langCode: 'pt', regionCode: 'BR' },
  { lang: 'Portuguese (Portugal)', langCode: 'pt', regionCode: 'PT' },
  { lang: 'Russian (Russia)', langCode: 'ru', regionCode: 'RU' },
  { lang: 'Ukrainian (Ukraine)', langCode: 'uk', regionCode: 'UA' },
  { lang: 'Hindi (India)', langCode: 'hi', regionCode: 'IN' },
  { lang: 'Chinese (Simplified, China)', langCode: 'zh', regionCode: 'CN' },
  { lang: 'Chinese (Traditional, Taiwan)', langCode: 'zh', regionCode: 'TW' },
  { lang: 'Chinese (Traditional, Hong Kong)', langCode: 'zh', regionCode: 'HK' },
  { lang: 'Japanese (Japan)', langCode: 'ja', regionCode: 'JP' },
  { lang: 'Korean (South Korea)', langCode: 'ko', regionCode: 'KR' },
  { lang: 'Italian (Italy)', langCode: 'it', regionCode: 'IT' },
  { lang: 'Dutch (Netherlands)', langCode: 'nl', regionCode: 'NL' },
  { lang: 'Polish (Poland)', langCode: 'pl', regionCode: 'PL' },
  { lang: 'Turkish (Turkey)', langCode: 'tr', regionCode: 'TR' },
  { lang: 'Arabic (Saudi Arabia)', langCode: 'ar', regionCode: 'SA' },
  { lang: 'Arabic (United Arab Emirates)', langCode: 'ar', regionCode: 'AE' },
  { lang: 'Arabic (Egypt)', langCode: 'ar', regionCode: 'EG' },
  { lang: 'Indonesian (Indonesia)', langCode: 'id', regionCode: 'ID' },
  { lang: 'Vietnamese (Vietnam)', langCode: 'vi', regionCode: 'VN' },
  { lang: 'Thai (Thailand)', langCode: 'th', regionCode: 'TH' },
  { lang: 'Swedish (Sweden)', langCode: 'sv', regionCode: 'SE' },
];

export const UNIQUE_LANGUAGES = Array.from(
  new Map(YOUTUBE_REGIONS.map((item) => [item.langCode, item])).values(),
).map((item) => ({
  value: item.langCode,
  // Extracts just the language name (e.g., "English" from "English (US)")
  label: item.lang.split(' (')[0],
}));

export const UNIQUE_REGIONS = Array.from(
  new Map(YOUTUBE_REGIONS.map((item) => [item.regionCode, item])).values(),
).map((item) => ({
  value: item.regionCode,
  // Extracts the country name (e.g., "US" or "United States" depending on how you want to format it)
  // Here we use the text inside the parentheses as the label
  label: item.lang.match(/\(([^)]+)\)/)?.[1] || item.regionCode,
}));
