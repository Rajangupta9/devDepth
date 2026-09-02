import { useState, useEffect } from 'react';

const STORAGE_KEY = 'devdepth_anonymous_id';

export function getOrGenerateAnonymousId(): string {
  let anonId = localStorage.getItem(STORAGE_KEY);
  if (!anonId) {
    const randomHex = Math.random().toString(36).substring(2, 10);
    anonId = `anon_${Date.now().toString(36)}_${randomHex}`;
    localStorage.setItem(STORAGE_KEY, anonId);
  }
  return anonId;
}

export function useAnonymousUser() {
  const [anonymousId, setAnonymousId] = useState<string>('');

  useEffect(() => {
    const id = getOrGenerateAnonymousId();
    setAnonymousId(id);
  }, []);

  return {
    anonymousId,
    headers: {
      'X-Anonymous-ID': anonymousId,
    },
  };
}
