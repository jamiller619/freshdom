'use strict'
/**
 * Our packages really should come from the packages
 * directory, but since it curently includes some projects
 * I don't want to yet commit, we're statically defining
 * them here
 */
const packages = {}
packages.core = 'freshdom'
packages.router = 'freshdom-router'
packages.proptypes = 'freshdom-proptypes'
packages.utils = 'freshdom-utils'

module.exports = packages
