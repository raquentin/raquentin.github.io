import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

// Convert Quartz-style [[url|text]] wikilinks to standard markdown before parsing.
// [[#anchor|text]] internal links become plain text since we have no anchors to link to.
function preprocessWikiLinks(src: string): string {
	return src
		.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, target: string, text: string) =>
			target.startsWith('#') ? text : `[${text}](${target})`
		)
		.replace(/\[\[([^\]]+)\]\]/g, (_, target: string) =>
			target.startsWith('#') ? target.slice(1) : `[${target}](${target})`
		);
}

// Split remark-gfm's single footnotes <section> into two: one for [^1] notes and
// one for [^src-N] sources. remark-gfm puts everything in one <ol>; we partition
// the <li> items by id prefix and rebuild as separate sections.
function postProcessFootnotes(html: string): string {
	const start = html.indexOf('<section data-footnotes');
	if (start === -1) return html;
	const end = html.indexOf('</section>', start) + '</section>'.length;
	const section = html.slice(start, end);

	// Extract the raw <ol> content (remark-gfm footnote items never nest lists)
	const olInner = section.replace(/[\s\S]*?<ol>/, '').replace(/<\/ol>[\s\S]*/, '');

	const notes: string[] = [];
	const sources: string[] = [];

	// Split on <li boundaries; each chunk belongs to one item
	for (const chunk of olInner.split(/(?=<li[\s>])/)) {
		if (!chunk.trim()) continue;
		const idMatch = chunk.match(/id="user-content-fn-([^"]+)"/);
		if (!idMatch) continue;
		(idMatch[1].startsWith('src-') ? sources : notes).push(chunk);
	}

	const buildSection = (label: string, cls: string, items: string[]) =>
		`<section class="footnotes ${cls}">` +
		`<h2 class="footnote-label">${label}</h2>` +
		`<ol>${items.join('')}</ol>` +
		`</section>`;

	const replacement =
		(notes.length ? buildSection('Footnotes', 'footnotes-notes', notes) : '') +
		(sources.length ? buildSection('Sources', 'footnotes-sources', sources) : '');

	return html.slice(0, start) + replacement + html.slice(end);
}

const CONTENT_ROOT: string = __CONTENT_ROOT__;

// Handles both YYYY-MM-DD and MM-DD-YYYY
function parseDate(s: string): Date {
	const mmddyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
	if (mmddyyyy) return new Date(`${mmddyyyy[3]}-${mmddyyyy[1]}-${mmddyyyy[2]}`);
	return new Date(s);
}

// Normalize to YYYY-MM-DD for display
function normalizeDate(s: string): string {
	const d = parseDate(s);
	if (isNaN(d.getTime())) return s;
	return d.toISOString().slice(0, 10);
}

// Git commit count and GitHub URL for a file, resolved at build time.
function getGitInfo(filepath: string): { editCount: number; commitsUrl: string } {
	try {
		const cwd = path.dirname(filepath);
		const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8', cwd }).trim();
		const relPath = path.relative(repoRoot, filepath);

		const log = execSync(`git log --follow --oneline -- "${relPath}"`, {
			encoding: 'utf-8',
			cwd: repoRoot,
		});
		const editCount = log.trim().split('\n').filter(Boolean).length;

		const remote = execSync('git remote get-url origin', { encoding: 'utf-8', cwd: repoRoot })
			.trim()
			.replace(/^git@github\.com:/, 'https://github.com/')
			.replace(/\.git$/, '');
		const branch = execSync('git rev-parse --abbrev-ref HEAD', {
			encoding: 'utf-8',
			cwd: repoRoot,
		}).trim();

		return { editCount, commitsUrl: `${remote}/commits/${branch}/${relPath}` };
	} catch {
		return { editCount: 0, commitsUrl: '#' };
	}
}

export interface EssayMeta {
	slug: string;
	title: string;
	date: string;
	confidence: number | null; // 0–100
	importance: number | null; // 1–10
}

export interface EssayDetail extends EssayMeta {
	editCount: number;
	commitsUrl: string;
}

export interface NoteMeta {
	slug: string;
	title: string;
	date: string;
}

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeKatex)
	.use(rehypeStringify, { allowDangerousHtml: true });

async function renderMarkdown(raw: string): Promise<string> {
	const src = preprocessWikiLinks(raw);
	const result = await processor.process(src);
	return postProcessFootnotes(String(result));
}

export async function getIntro(): Promise<string> {
	const filepath = path.join(CONTENT_ROOT, 'intro.md');
	if (!fs.existsSync(filepath)) return '';
	return renderMarkdown(fs.readFileSync(filepath, 'utf-8'));
}

export function getEssays(): EssayMeta[] {
	const dir = path.join(CONTENT_ROOT, 'essays');
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => {
			const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
			const { data } = matter(raw);
			return {
				slug: f.replace('.md', ''),
				title: String(data.title ?? ''),
				date: normalizeDate(String(data.date ?? '')),
				confidence: data.confidence != null ? Number(data.confidence) : null,
				importance: data.importance != null ? Number(data.importance) : null,
				draft: Boolean(data.draft),
			};
		})
		.filter((e) => e.title && e.date && !e.draft)
		.map(({ draft: _draft, ...rest }) => rest)
		.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
}

export async function getEssay(
	slug: string
): Promise<{ meta: EssayDetail; html: string } | null> {
	const filepath = path.join(CONTENT_ROOT, 'essays', `${slug}.md`);
	if (!fs.existsSync(filepath)) return null;
	const raw = fs.readFileSync(filepath, 'utf-8');
	const { data, content } = matter(raw);
	const html = await renderMarkdown(content);
	const { editCount, commitsUrl } = getGitInfo(filepath);
	return {
		meta: {
			slug,
			title: String(data.title ?? ''),
			date: normalizeDate(String(data.date ?? '')),
			confidence: data.confidence != null ? Number(data.confidence) : null,
			importance: data.importance != null ? Number(data.importance) : null,
			editCount,
			commitsUrl,
		},
		html,
	};
}

export function getNotes(): NoteMeta[] {
	const dir = path.join(CONTENT_ROOT, 'notes');
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => {
			const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
			const { data } = matter(raw);
			return {
				slug: f.replace('.md', ''),
				title: String(data.title ?? ''),
				date: normalizeDate(String(data.date ?? '')),
				draft: Boolean(data.draft),
			};
		})
		.filter((n) => n.title && n.date && !n.draft)
		.map(({ draft: _draft, ...rest }) => rest)
		.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
}

export async function getNote(
	slug: string
): Promise<{ meta: NoteMeta; html: string } | null> {
	const filepath = path.join(CONTENT_ROOT, 'notes', `${slug}.md`);
	if (!fs.existsSync(filepath)) return null;
	const raw = fs.readFileSync(filepath, 'utf-8');
	const { data, content } = matter(raw);
	const html = await renderMarkdown(content);
	return {
		meta: {
			slug,
			title: String(data.title ?? ''),
			date: normalizeDate(String(data.date ?? '')),
		},
		html,
	};
}
