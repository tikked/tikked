const path = require('path');
const fs = require('fs');
const express = require('express');

const INDEX_FILE_PATH = '/';
const ENV_FILE_PATH = '/env.js';
const DIST_FOLDER = 'dist';
const INDEX_FILE_NAME = 'index.html';

const DEFAULT_OPTIONS = {
  adminApiUrl: 'http://localhost:3000'
};

module.exports = options => {
  return (req, res, next) => {
    options = {
      ...options,
      ...DEFAULT_OPTIONS
    };

    switch (req.path) {
      case INDEX_FILE_PATH:
        injectBaseHrefAndServeIndexFile(req, res, next);
        break;
      case ENV_FILE_PATH:
        generateAndServeEnvFile(req, res, next);
        break;
      default:
        return express.static(path.join(__dirname, DIST_FOLDER))(req, res, next);
    }
  };

  function injectBaseHrefAndServeIndexFile(req, res, next) {
    const indexFilePath = path.join(__dirname, DIST_FOLDER, INDEX_FILE_NAME);

    if (fs.existsSync(indexFilePath)) {
      let indexFileContent = fs.readFileSync(indexFilePath).toString();
      indexFileContent = indexFileContent.replace(
        '<base href="">',
        `<base href="${req.baseUrl.replace('/', '')}">`
      );
      res.type(path.extname(INDEX_FILE_NAME));
      res.send(indexFileContent);
    }

    next();
  }

  function generateAndServeEnvFile(req, res, next) {
    const envFileString = `const serverConfig = {
      TIKKED_ADMIN_API_URL: '${options.adminApiUrl}'
  };`;
    res.type('.js');
    res.send(envFileString);
    next();
  }
};
