'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

const path = require('path');
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if(!generatedConfiguration.resolve.alias){
      generatedConfiguration.resolve.alias = {};
    }

    // shared components
    generatedConfiguration.resolve.alias['@components'] = path.resolve( __dirname, 'lib/components/');

    //root src folder
    generatedConfiguration.resolve.alias['@src'] = path.resolve( __dirname, 'lib');

    //root src folder
    generatedConfiguration.resolve.alias['@'] = path.resolve( __dirname, 'lib');
    
    //api src folder
    generatedConfiguration.resolve.alias['@api'] = path.resolve( __dirname, 'lib/api/');

    if (generatedConfiguration.mode === 'development') {
      // add alias for the react-dom profiler
      generatedConfiguration.resolve.alias['react-dom$'] = 'react-dom/profiling';
      
      // remove externalization of react & react-dom
      generatedConfiguration.externals = generatedConfiguration.externals.filter((external) => {
        return ((external !== 'react') && (external !== 'react-dom'));
      });
    }

    return generatedConfiguration;
  }
});

build.tslintCmd.enabled = false;
build.initialize(require('gulp'));
