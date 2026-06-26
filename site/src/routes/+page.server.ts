import { getEssays, getIntro } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { essays: getEssays(), intro: await getIntro() };
};
