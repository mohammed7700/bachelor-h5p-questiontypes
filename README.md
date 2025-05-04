[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# Prerequisites for Development

1. node 22.x.x or higher 
2. h5p-cli [https://github.com/h5p/h5p-cli/tree/master]


# Development Enviroment
1. follow the quick start guide of h5p-cli and create your H5P development enviroment 
2. put the library you want to develop in the libraries folder of your development enviroment 
3. install package manager dependencies within the library folder
    - ```npm install```
4. in the libraries folder, run the build script defined in package.json:
    - ```npm run build``` - to build once
    - ```npm run watch``` - rebuilds when ever a file changes
5. in the root of your development enviroment run:
    - ```h5p server```
