import { useState, useCallback } from 'react';







export function useApi(
apiFunction,
options)
{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (err) {
        const _error = err;
        setError(_error);
        if (options?.onError) {
          options.onError(_error);
        }
        throw _error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { execute, data, loading, error, setData };
}