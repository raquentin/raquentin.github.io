import { getNote, getNotes } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return getNotes().map((n) => ({ slug: n.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const note = await getNote(params.slug);
	if (!note) throw error(404, 'Note not found');
	return note;
};
