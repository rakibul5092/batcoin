'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.batcoinModuleSchematic = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const core_1 = require('@angular-devkit/core');
const batcoin_schematics_service_1 = require('../batcoin.schematics.service');
function batcoinModuleSchematic(options) {
  return (tree) =>
    __awaiter(this, void 0, void 0, function* () {
      const host = (0, batcoin_schematics_service_1.createHost)(tree);
      const { workspace } = yield core_1.workspaces.readWorkspace('/', host);
      if (!options.project && typeof workspace.extensions.defaultProject === 'string') {
        options.project = workspace.extensions.defaultProject;
      }
      const project = options.project !== null ? workspace.projects.get(options.project) : null;
      if (!project) {
        throw new schematics_1.SchematicsException(`Invalid project name: ${options.project}`);
      }
      const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';
      if (options.path === undefined) {
        options.path = `${project.sourceRoot}/${projectType}`;
      }
      const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
        (0, schematics_1.applyTemplates)({
          classify: core_1.strings.classify,
          dasherize: core_1.strings.dasherize,
          name: options.name,
        }),
        (0, schematics_1.move)('./src/app/' + (0, core_1.normalize)(options.path)),
      ]);
      addEntityMetadata(tree, options);
      addAdminRouting(tree, options);
      addAdminMenuItem(tree, options);
      console.log(`----------- Batcoin Module ${options.name} Created Successfully ----------`);
      return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(templateSource)]);
    });
}
exports.batcoinModuleSchematic = batcoinModuleSchematic;
function addEntityMetadata(tree, options) {
  let entityMetadataContent = (0, batcoin_schematics_service_1.readFileContent)(tree, './src/app/store/entity-metadata.ts');
  let selectKey = 'const entityMetadata: EntityMetadataMap = {';
  let content2Append = `\n  ${options.name}: {selectId},`;
  let updatedContent = (0, batcoin_schematics_service_1.appendContent)(selectKey, content2Append, entityMetadataContent);
  selectKey = 'const pluralNames = {';
  content2Append = `\n  ${options.name}: '${options.name}',`;
  tree.overwrite('./src/app/store/entity-metadata.ts', (0, batcoin_schematics_service_1.appendContent)(selectKey, content2Append, updatedContent));
}
function addAdminRouting(tree, options) {
  let adminRoutingContent = (0, batcoin_schematics_service_1.readFileContent)(tree, './src/app/modules/admin/admin-routing.module.ts');
  const content2Append = `
  {
    path: '${options.name}',
    loadChildren: () => import('../${options.name}/${options.name}.module').then(m => m.${core_1.strings.classify(options.name)}Module)
  },`;
  tree.overwrite(
    './src/app/modules/admin/admin-routing.module.ts',
    (0, batcoin_schematics_service_1.appendContent)('const routes: Routes = [', content2Append, adminRoutingContent),
  );
}
function addAdminMenuItem(tree, options) {
  let adminMenuContent = (0, batcoin_schematics_service_1.readFileContent)(tree, './src/app/modules/admin/admin.page.ts');
  const content2Append = `
        {
          name: "${core_1.strings.classify(options.name)}",
          link: "/admin/${options.name}"
        },`;
  tree.overwrite('./src/app/modules/admin/admin.page.ts', (0, batcoin_schematics_service_1.appendContent)('this.menuItems.push(', content2Append, adminMenuContent));
}
//# sourceMappingURL=index.js.map
