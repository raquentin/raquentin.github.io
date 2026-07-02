
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/essays" | "/essays/[slug]" | "/notes" | "/notes/[slug]" | "/search";
		RouteParams(): {
			"/essays/[slug]": { slug: string };
			"/notes/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined };
			"/essays": { slug?: string | undefined };
			"/essays/[slug]": { slug: string };
			"/notes": { slug?: string | undefined };
			"/notes/[slug]": { slug: string };
			"/search": Record<string, never>
		};
		Pathname(): "/" | `/essays/${string}` & {} | `/essays/${string}/` & {} | "/notes" | `/notes/${string}` & {} | `/notes/${string}/` & {} | "/search";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}