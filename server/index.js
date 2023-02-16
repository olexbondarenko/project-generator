const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs/promises');
const ejs = require('ejs');
const cors = require("cors");
const app = express();
const {toCamelCase, toKebablCase, upperCaseFirstLetter} = require('./utils');
const corsOptions = {
  origin: "http://localhost:8080"
};

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')

app.post("/", async (req, res) => {
  await generateProject(req, res);
})

const createDirectory = async (path) => {  
  await fs.mkdir(path, { recursive: true })
}

const createEmptyFile = async (filePath) => { 
  await fs.writeFile(filePath, '')
}

const createFile = async (filePath, templatePath, data) => { 
  ejs.renderFile(templatePath, data, null, async (err, str) => {
    await fs.writeFile(filePath, str);
  })
}

const generateProject = async (req, res) => {
  const globalName = toCamelCase(req.body.globalName);
  const globalFolderPath = `./${globalName}`;
  const globalProjectId = toKebablCase(req.body.globalName);
  const globalStylesName = toKebablCase(req.body.globalName);
  const globalClassName = toKebablCase(req.body.globalName);
  const components = req.body.components;
  const useBanner = req.body.useBanner;

  const globalFolders = [
    '__mocks',
    'hooks',
    'components',
    'composables',
    'constants',
    'styles'
  ];

  try { 
    // create project folder
    await createDirectory(`./${globalName}`).catch((err) => {console.log(err)});
  
    // generate base project structure
    for(let folderName of globalFolders) {
      await createDirectory(`${globalFolderPath}/${folderName}`).catch((err) => {console.log(err)});
    }
  
    // create files for main component
    await createFile(
      `${globalFolderPath}/${upperCaseFirstLetter(globalName)}.vue`, 
      `${__dirname}/templates/views/main.ejs`, 
      {
        globalFolderName: globalName,
        componentName: upperCaseFirstLetter(globalName),
        className: globalClassName,
        useBanner: useBanner
      }
    ).catch((err) => {console.log(err)});
  
    await createFile(
      `${globalFolderPath}/styles/${globalStylesName}.scss`, 
      `${__dirname}/templates/styles/main.ejs`, 
      {
        className: globalClassName
      }
    ).catch((err) => {console.log(err)});
  
    await createFile(
      `${globalFolderPath}/styles/component.scss`, 
      `${__dirname}/templates/styles/component.ejs`, 
      {
        fileName: globalStylesName
      }
    ).catch((err) => {console.log(err)});
  
    // create global helpers directory and helper files
    await createDirectory(`${globalFolderPath}/styles/helpers`).then(async () => {
      await createEmptyFile(`${globalFolderPath}/styles/helpers/variables.scss`);
      await createEmptyFile(`${globalFolderPath}/styles/helpers/animations.scss`);
    }).catch((err) => {console.log(err)});


    // create folder and files for banner component(is selected)
    if(useBanner) {
      await createDirectory(`${globalFolderPath}/components/banners/`).then(async () => {
        await createFile(
          `${globalFolderPath}/components/banners/${upperCaseFirstLetter(toCamelCase(`${globalName} banner`))}.vue`, 
          `${__dirname}/templates/views/banner.ejs`, 
          {
            globalFolderName: globalName,
            componentName: upperCaseFirstLetter(toCamelCase(`${globalName} banner`)),
            className:  `${globalClassName}-banner`
          }
        );
      }).catch((err) => {console.log(err)});
    
      await createDirectory(`${globalFolderPath}/components/banners/styles`).then(async () => {
        await createFile(
          `${globalFolderPath}/components/banners/styles/${globalClassName}-banner.scss`, 
          `${__dirname}/templates/styles/default.ejs`, 
          {
            className: `${globalClassName}-banner`
          }
        );
  
        await createFile(
          `${globalFolderPath}/components/banners/styles/component.scss`, 
          `${__dirname}/templates/styles/component.ejs`, 
          {
            fileName: `${globalStylesName}-banner`
          }
        ).catch((err) => {console.log(err)});
      }).catch((err) => {console.log(err)});
    }
  
    // create components directories
    for(let i = 0; i < components.length; i++) {
      let componentName = components[i].field.value;
      let templateName = components[i].options.filter((option) => option.checked === true)[0].template;

      // create componetns with default template
      if(templateName === 'default' || templateName === 'mainModal') {
        await createFile(
          `${globalFolderPath}/components/${upperCaseFirstLetter(toCamelCase(`${globalName} ${componentName}`))}.vue`, 
          `${__dirname}/templates/views/${templateName === 'mainModal' ? 'mainModal' : 'default'}.ejs`, 
          {
            globalFolderName: globalName,
            folderName: toCamelCase(`${globalName} ${componentName}`),
            componentName: upperCaseFirstLetter(toCamelCase(`${globalName} ${componentName}`)),
            className:  `${toKebablCase(`${globalStylesName} ${componentName}`)}`
          }
        ).catch((err) => {console.log(err)});
    
        // create style files
        await createDirectory(`${globalFolderPath}/components/styles/${toCamelCase(`${globalName} ${componentName}`)}`).catch((err) => {console.log(err)});
    
        await createFile(
          `${globalFolderPath}/components/styles/${toCamelCase(`${globalName} ${componentName}`)}/${toKebablCase(`${globalStylesName} ${componentName}`)}.scss`, 
          `${__dirname}/templates/styles/default.ejs`, 
          {
            className: `${toKebablCase(`${globalStylesName} ${componentName}`)}`
          }
        ).catch((err) => {console.log(err)});
        
        await createFile(
          `${globalFolderPath}/components/styles/${toCamelCase(`${globalName} ${componentName}`)}/component.scss`, 
          `${__dirname}/templates/styles/component.ejs`, 
          {
            fileName: `${toKebablCase(`${globalStylesName} ${componentName}`)}`
          }
        ).catch((err) => {console.log(err)});
      }

      // create default modal template and default file styles
      if(templateName === 'defaultModal') {
        let modalFolder = `${globalFolderPath}/components/modals`;
        let modalStylesFolder = `${globalFolderPath}/components/modals/styles`;

        await createDirectory(`${modalFolder}`).then(async () => {
          await createFile(
            `${modalFolder}/${upperCaseFirstLetter(toCamelCase(`${globalName} ${componentName}`))}.vue`, 
            `${__dirname}/templates/views/defaultModal.ejs`, 
            {
              globalFolderName: globalName,
              folderName: toCamelCase(`${globalName} ${componentName}`),
              componentName: upperCaseFirstLetter(toCamelCase(`${globalName} ${componentName}`)),
              parentComponentName: upperCaseFirstLetter(toCamelCase(`${globalName} modal`)),
              className:  `${globalClassName}-${toKebablCase(componentName)}`
            }
          ).catch((err) => {console.log(err)});

          await createDirectory(`${modalStylesFolder}`).catch((err) => {console.log(err)});
          await createDirectory(`${modalStylesFolder}/${toCamelCase(`${globalName} ${componentName}`)}`).catch((err) => {console.log(err)});
          
          await createFile(
            `${modalStylesFolder}/${toCamelCase(`${globalName} ${componentName}`)}/${toKebablCase(`${globalStylesName} ${componentName}`)}.scss`, 
            `${__dirname}/templates/styles/default.ejs`, 
            {
              className: `${toKebablCase(`${globalStylesName} ${componentName}`)}`
            }
          ).catch((err) => {console.log(err)});
          
          await createFile(
            `${modalStylesFolder}/${toCamelCase(`${globalName} ${componentName}`)}/component.scss`, 
            `${__dirname}/templates/styles/component.ejs`, 
            {
              fileName: `${toKebablCase(`${globalStylesName} ${componentName}`)}`
            }
          ).catch((err) => {console.log(err)});
        }).catch((err) => {console.log(err)});
      }
    }

    // create breadcrumbs list constant
    await createFile(
      `${globalFolderPath}/constants/breadcrumbsList.js`, 
      `${__dirname}/templates/constants/breadcrumbs.ejs`, 
      {
        projectName: `${upperCaseFirstLetter(req.body.globalName)}`,
        projectId: globalProjectId
      }
    ).catch((err) => {console.log(err)});

    // create modal list constant
    let defaultModals = [];
    components.forEach((component) => {
        if(component.options.find(({ template, checked }) => template === "defaultModal" && checked === true)) {
          defaultModals.push({
            globalFolderName: globalName,
            componentName: upperCaseFirstLetter(toCamelCase(`${globalName} ${component.field.value}`)),
            labelName: upperCaseFirstLetter(component.field.value)
          });
        } 
    });

    await createFile(
      `${globalFolderPath}/constants/modalsList.js`, 
      `${__dirname}/templates/constants/modals.ejs`, 
      {
        modals: defaultModals,
      }
    ).catch((err) => {console.log(err)});

    return res.send({message: '\u2705 Project has been successfully created.'});
  }

  catch(err) {
    return res.send({message: `\u274c ${err}`});
  }
}