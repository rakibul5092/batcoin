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
exports.batcoinModelSchematic = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const core_1 = require('@angular-devkit/core');
const batcoin_schematics_service_1 = require('../batcoin.schematics.service');
function batcoinModelSchematic(options) {
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
      console.log(`----------- Batcoin Model ${options.name} Created Successfully ----------`);
      return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(templateSource)]);
    });
}
exports.batcoinModelSchematic = batcoinModelSchematic;
//# sourceMappingURL=index.js.map
