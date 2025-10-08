const fs = require("fs");
const path = require("path");

const componentMappings = [
  // Atoms - Basic building blocks
  { ui: "button", folder: "Button", level: "atoms" },
  { ui: "input", folder: "Input", level: "atoms" },
  { ui: "label", folder: "Label", level: "atoms" },
  { ui: "card", folder: "Card", level: "atoms" },
  { ui: "avatar", folder: "Avatar", level: "atoms" },
  { ui: "badge", folder: "Badge", level: "atoms" },
  
  // Molecules - Simple groups of atoms
  { ui: "dialog", folder: "Dialog", level: "molecules" },
  { ui: "dropdown-menu", folder: "DropdownMenu", level: "molecules" },
  { ui: "popover", folder: "Popover", level: "molecules" },
  { ui: "tooltip", folder: "Tooltip", level: "molecules" },
  
  // Organisms - Complex UI components
  { ui: "form", folder: "Form", level: "organisms" },
  { ui: "table", folder: "Table", level: "organisms" },
  { ui: "calendar", folder: "Calendar", level: "organisms" },
];

const moveComponent = (componentName, targetFolder, atomicLevel) => {
  const sourcePath = `src/components/ui/${componentName}.tsx`;
  const targetDir = `src/components/${atomicLevel}/${targetFolder}`;
  const targetPath = `${targetDir}/${targetFolder}.tsx`;

  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.renameSync(sourcePath, targetPath);
    console.log(`Moved ${componentName} to ${atomicLevel}/${targetFolder}`);
  }
};

const updateBarrelExports = () => {
  const levels = ["atoms", "molecules", "organisms", "templates"];
  
  levels.forEach(level => {
    const levelPath = `src/components/${level}`;
    if (!fs.existsSync(levelPath)) {
      fs.mkdirSync(levelPath, { recursive: true });
    }

    const components = fs.readdirSync(levelPath)
      .filter(item => fs.statSync(path.join(levelPath, item)).isDirectory());

    const exports = components
      .map(component => `export { ${component} } from "./${component}/${component}";`)
      .join("\n");

    fs.writeFileSync(`${levelPath}/index.ts`, exports);
    console.log(`Updated barrel exports for ${level}: ${components.length} components`);
  });

  // Create other barrel exports
  ["pages", "hooks"].forEach(folder => {
    const folderPath = `src/${folder}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    if (!fs.existsSync(`${folderPath}/index.ts`)) {
      fs.writeFileSync(`${folderPath}/index.ts`, "// Barrel exports\n");
    }
  });
};

// Execute organization
componentMappings.forEach(({ ui, folder, level }) => {
  moveComponent(ui, folder, level);
});

updateBarrelExports();

// Clean up empty ui folder
if (
  fs.existsSync("src/components/ui") &&
  fs.readdirSync("src/components/ui").length === 0
) {
  fs.rmdirSync("src/components/ui");
  console.log("Removed empty ui folder");
}

console.log("Component organization complete!");