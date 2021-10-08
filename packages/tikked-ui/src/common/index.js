import { inject } from 'vue';
import { envSymbol } from '@/plugins/env';
export * from '@/utils';

export function useENv() {
  const env = inject(envSymbol);
  if (!env) throw new Error('No env provided!!!');

  return env;
}
