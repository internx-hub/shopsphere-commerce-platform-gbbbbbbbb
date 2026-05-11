import useSWR from 'swr';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const fetcher = (url) => {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  });
};

export default function useProducts({ category = '', search = '', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  params.set('page', page.toString());
  params.set('limit', limit.toString());

  const queryString = params.toString();
  const key = `/api/products${queryString ? `?${queryString}` : ''}`;
  const fullUrl = `${API_BASE}${key}`;

  const { data, error, isLoading, mutate } = useSWR(fullUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    products: data || { items: [], total: 0, page: 1 },
    loading: isLoading,
    error: error
      ? { message: error.message }
      : null,
    mutate,
  };
}