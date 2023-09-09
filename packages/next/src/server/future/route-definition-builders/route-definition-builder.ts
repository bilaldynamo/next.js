import type { RouteDefinition } from '../route-definitions/route-definition'

export abstract class RouteDefinitionBuilder<
  D extends RouteDefinition = RouteDefinition,
  I extends Partial<D> = Partial<D>
> {
  protected readonly definitions = new Array<D>()

  /**
   * Add a new route definition to the builder.
   *
   * @param input The input to use to create the definition.
   */
  public abstract add(input: I): void

  /**
   * Build the definitions that have been added to the builder and return a
   * sorted array of them. First sorted by pathname, then by page.
   *
   * @returns A read-only array of the definitions that have been added to the
   * builder.
   */
  public build(): ReadonlyArray<D> {
    return this.definitions.sort((a, b) => {
      if (a.pathname === b.pathname) {
        return a.page.localeCompare(b.page)
      }

      return a.pathname.localeCompare(b.pathname)
    })
  }
}
