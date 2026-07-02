// @ts-nocheck
import { getNotes } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load = () => {
	return { notes: getNotes() };
};
;null as any as PageServerLoad;