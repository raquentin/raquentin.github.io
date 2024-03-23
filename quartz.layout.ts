import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/r4c3/",
      YouTube: "https://youtube.com/@raquentin/",
      LinkedIn: "https://linkedin.com/in/r4c3/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Posts",
        limit: 3,
        filter: (f) =>
          f.slug!.startsWith("posts/") && (f.slug! !== "posts/index") && !f.frontmatter?.noindex,
        linkToMore: "posts/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Notes",
        limit: 2,
        filter: (f) => f.slug!.startsWith("notes/") && (f.slug! !== "notes/index") && !f.frontmatter?.noindex,
        linkToMore: "notes/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.Graph(),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
