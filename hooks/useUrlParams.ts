// hooks/useUrlParams.ts
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const useUrlParams = () => {
  const router = useRouter();

  const setUrlParam = useCallback((key: string, value: string | undefined) => {
    const { pathname, query } = router;
    
    if (value === undefined) {
      delete query[key];
    } else {
      query[key] = value;
    }

    router.push({
      pathname,
      query,
    }, undefined, { shallow: true });
  }, [router]);

  return { setUrlParam };
};

export default useUrlParams;
