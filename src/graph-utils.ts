import {
  ManifestDependencyFieldNames,
  PackageManifest,
} from '@metamask/action-utils';
import { DepGraph } from 'dependency-graph';
import { IntermediatePackageMetadata } from './package-operations';

/**
 * Gets the dependency graph of the monorepo's packages. In the graph, each
 * monorepo package is a node, and there is a directed edge from PackageA
 * to PackageB if PackageA lists PackageB in any of the dependency fields in its
 * `package.json`.
 *
 * @param intermediatePackageMetadata - The intermediate package metadata of all
 * monorepo packages.
 * @returns The internal dependency graph of the monorepo.
 */
export function getMonorepoDependencyGraph(
  intermediatePackageMetadata: ReadonlyMap<string, IntermediatePackageMetadata>,
): DepGraph<string> {
  // Initialize the dependency graph object. Before we can record dependencies,
  // we have to add every package as a node.
  const dependencyGraph = new DepGraph<string>({ circular: true });
  for (const packageName of intermediatePackageMetadata.keys()) {
    dependencyGraph.addNode(packageName);
  }

  // Next, iterate over every dependency field of every `package.json` file in
  // the monorepo, and record the internal dependencies for each package. Then
  // return the complete graph.
  for (const [packageName, { manifest }] of intermediatePackageMetadata) {
    getInternalDependencies(manifest, intermediatePackageMetadata).forEach(
      (dependencyName) => {
        dependencyGraph.addDependency(packageName, dependencyName);
      },
    );
  }
  return dependencyGraph;
}

/**
 * Gets the list of monorepo packages depended on by a particular monorepo
 * package.
 *
 * @param manifest - The `package.json` file of the package.
 * @param intermediatePackageMetadata - The intermediate package metadata of all
 * monorepo packages.
 * @returns The dependencies internal to the monorepo of the specified package.
 */
export function getInternalDependencies(
  manifest: PackageManifest,
  intermediatePackageMetadata: ReadonlyMap<string, IntermediatePackageMetadata>,
): string[] {
  return Object.values(ManifestDependencyFieldNames).reduce<string[]>(
    (internalDependencies, fieldName) => {
      if (Object.hasOwnProperty.call(manifest, fieldName)) {
        for (const packageName of intermediatePackageMetadata.keys()) {
          if (Object.hasOwnProperty.call(manifest[fieldName], packageName)) {
            internalDependencies.push(packageName);
          }
        }
      }

      return internalDependencies;
    },
    [],
  );
}
