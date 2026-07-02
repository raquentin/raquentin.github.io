// @ts-nocheck
import { getEssays, getIntro } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load = async () => {
	return { essays: getEssays(), intro: await getIntro() };
};
;null as any as PageServerLoad;