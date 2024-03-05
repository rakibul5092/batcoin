import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { normalize, strings, workspaces } from '@angular-devkit/core';
import { Schema as ModuleSchema } from './Schema';
import { appendContent, createHost, readFileContent } from '../batcoin.schematics.service';

export function batcoinModuleSchematic(options: ModuleSchema): Rule {
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

    addEntityMetadata(tree, options);
    addAdminRouting(tree, options);
    addAdminMenuItem(tree, options);
    console.log(`----------- Batcoin Module ${options.name} Created Successfully ----------`);
    return chain([mergeWith(templateSource)]);
  };
}

function addEntityMetadata(tree: Tree, options: ModuleSchema) {
  let entityMetadataContent: string = readFileContent(tree, './src/app/store/entity-metadata.ts');
  let selectKey = 'const entityMetadata: EntityMetadataMap = {';
  let content2Append = `\n  ${options.name}: {selectId},`;
  let updatedContent = appendContent(selectKey, content2Append, entityMetadataContent);
  selectKey = 'const pluralNames = {';
  content2Append = `\n  ${options.name}: '${options.name}',`;
  tree.overwrite('./src/app/store/entity-metadata.ts', appendContent(selectKey, content2Append, updatedContent));
}

function addAdminRouting(tree: Tree, options: ModuleSchema) {
  let adminRoutingContent: string = readFileContent(tree, './src/app/modules/admin/admin-routing.module.ts');
  const content2Append = `
  {
    path: '${options.name}',
    loadChildren: () => import('../${options.name}/${options.name}.module').then(m => m.${strings.classify(options.name)}Module)
  },`;
  tree.overwrite('./src/app/modules/admin/admin-routing.module.ts', appendContent('const routes: Routes = [', content2Append, adminRoutingContent));
}

function addAdminMenuItem(tree: Tree, options: ModuleSchema) {
  let adminMenuContent: string = readFileContent(tree, './src/app/modules/admin/admin.page.ts');
  const content2Append = `
        {
          name: "${strings.classify(options.name)}",
          link: "/admin/${options.name}"
        },`;
  tree.overwrite('./src/app/modules/admin/admin.page.ts', appendContent('this.menuItems.push(', content2Append, adminMenuContent));
}
