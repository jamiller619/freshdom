'use strict';

var np = require('path');
var path = {};

// Object.defineProperty(module.exports, '__esModule', {
//   value: true
// });

path.ROOT = np.join(__dirname, '../');
path.ROOT_DIST = np.join(path.ROOT, 'dist');
path.ROOT_DEV = np.join(path.ROOT, 'src');

path.dev = function (file) {
  return np.join(path.ROOT_DEV, file);
};

path.dist = function (file) {
  return np.join(path.ROOT_DIST, file);
};

module.exports = path;

// module.exports['default']
// module.exports = path