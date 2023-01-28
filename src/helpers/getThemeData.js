import api from './api';

const THEME_URL = '/market/catalog/item';

export default async function getThemeData(themeId) {
  const response = await api.get(THEME_URL, {
    params: {
      id: themeId,
    },
  });

  return response.data;
}
