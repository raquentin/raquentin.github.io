// @ts-nocheck
import { getEssay, getEssays } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return getEssays().map((e) => ({ slug: e.slug }));
};

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	const essay = await getEssay(params.slug);
	if (!essay) throw error(404, 'Essay not found');
	return essay;
};
