// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/jquery/jquery.js',
  'app/components/angular-unstable/angular.js',
  'app/components/angular-mocks/angular-mocks.js',
  'app/components/angular-bootstrap/ui-bootstrap.js',
  'app/components/angular-bootstrap/ui-bootstrap-tpls.js',
  'app/components/angular-strap/dist/angular-strap.js',
  'app/components/jStorage/jstorage.js',

  // app
  'app/scripts/*.js',
  'app/lib/**/*.js',
  'app/scripts/**/*.js',

  // mocks
  'test/mock/*.js',
  'test/mock/**/*.js',

  //additional matchers (from https://raw.github.com/angular/angular.js/master/test/matchers.js)
  'test/matchers.js',

  // custom helpers shared by tests
  'test/helpers.js',

  //tests
  'test/spec/**/*.js',

  // templates
  '.tmp/scripts/templates.js'
  //app/templates/*.tpl.html'
];

// list of files to exclude
exclude = [];

// not using html2js as can't specificy output template path to match app.
//  'app/templates/*.tpl.html': 'html2js',

preprocessors = {
  'app/scripts/*.js': 'coverage',
  'test/mock/**/*.js': 'coverage',
  'app/scripts/**/*.js': 'coverage'
};

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress','coverage'];


// coverage options
coverageReporter = {
  type : 'html',
  dir : 'coverage/'
}

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
