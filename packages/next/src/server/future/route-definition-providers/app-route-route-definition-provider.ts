import type {
  Manifest,
  ManifestLoader,
} from '../helpers/manifest-loaders/manifest-loader'
import type { AppRouteRouteDefinition } from '../route-definitions/app-route-route-definition'

import { isAppRouteRoute } from '../../../lib/is-app-route-route'
import { APP_PATHS_MANIFEST } from '../../../shared/lib/constants'
import { AppFilenameNormalizer } from '../normalizers/built/app/app-filename-normalizer'
import { AppRouteRouteDefinitionBuilder } from '../route-definition-builders/app-route-route-definition-builder'
import { ManifestRouteDefinitionProvider } from './manifest-route-definition-provider'
import { RouteKind } from '../route-kind'

export class AppRouteRouteDefinitionProvider extends ManifestRouteDefinitionProvider<AppRouteRouteDefinition> {
  public readonly kind = RouteKind.APP_ROUTE
  private readonly normalizer: AppFilenameNormalizer

  constructor(appDir: string, manifestLoader: ManifestLoader) {
    super(APP_PATHS_MANIFEST, manifestLoader)

    this.normalizer = new AppFilenameNormalizer(appDir)
  }

  protected transform(
    manifest: Manifest
  ): ReadonlyArray<AppRouteRouteDefinition> {
    // The manifest consists of a map of all the pages to their bundles. Let's
    // filter out all the pages that are not app routes.
    const pages = Object.keys(manifest).filter((page) => isAppRouteRoute(page))

    const builder = new AppRouteRouteDefinitionBuilder()
    for (const page of pages) {
      const filename = this.normalizer.normalize(manifest[page])

      builder.add({ page, filename })
    }

    return builder.build()
  }
}
