import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/raquentin/",
      LinkedIn: "https://linkedin.com/in/raquentin",
      YouTube: "https://youtube.com/@raquentin/",
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
        limit: 2,
        filter: (f) =>
          f.slug!.startsWith("posts/") && (f.slug! !== "posts/index") && (f.slug! !== "posts/the-booklist") && !f.frontmatter?.noindex,
        linkToMore: "posts/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
        Component.RecentNotes({
            title: "Recent Notes",
            limit: 1,
            filter: (f) =>
              f.slug!.startsWith("notes/") && (f.slug! !== "notes/index") && !f.frontmatter?.noindex,
            linkToMore: "notes/" as SimpleSlug,
          }),
    ),

    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false,
      },
      globalGraph: {
        showTags: false,
      },
    }),
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
    Component.Explorer(),
  ],
  right: [],
}
