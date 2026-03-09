# Docs Search

Docs search uses [Algolia](https://www.algolia.com/) via their autocomplete library. The Algolia crawler periodically indexes the site and populates the search index.

## Language/Version Filtering

Search results are filtered by the user's selected SDK language and version. This works through two mechanisms:

**Indexing** (`Layout.tsx`): Each page renders `<meta>` tags that the Algolia crawler reads:
```html
<meta name="docsearch:sdkLanguage" content="typescript" />
<meta name="docsearch:sdkVersion" content="v3" />
```
Pages not tied to a specific language/version use `"all"` (the `SDK_ALL` constant from `LanguageStore.ts`).

**Querying** (`Search.tsx`): `buildSearchFilters` constructs an Algolia facet filter from the user's current language selection:
```
(sdkLanguage:typescript OR sdkLanguage:all) AND (sdkVersion:v3 OR sdkVersion:all)
```
The `OR sdkLanguage:all` clause ensures language-agnostic pages (guides, learn) always appear.

## Deployment

The indexing and querying sides must stay in sync. If you add new facet attributes:
1. Deploy the meta tag changes first
2. Wait for the Algolia crawler to re-index
3. Then deploy the filtering changes

Deploying filters before the crawler indexes the new attributes will cause search to return zero results.
