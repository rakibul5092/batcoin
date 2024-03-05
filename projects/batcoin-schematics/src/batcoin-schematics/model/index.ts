import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { normalize, strings, workspaces } from '@angular-devkit/core';
import { Schema as MyModuleSchema } from './Schema';
import { createHost } from '../batcoin.schematics.service';

export function batcoinModelSchematic(options: MyModuleSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);
    if (!options.project && typeof workspace.extensions.defaultProject === 'string') {
      options.project = workspace.extensions.defaultProject;
    }

    const project = options.project !== null ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    }
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name,
      }),
      move('./src/app/' + normalize(options.path as string)),
    ]);
    console.log(`----------- Batcoin Model ${options.name} Created Successfully ----------`);
    return chain([mergeWith(templateSource)]);
  };
}
