var clone= require('clone');
var paths = require('./build/paths');
var webpackConfig = clone(require('./webpack.config.js'));


// Add istanbul-instrumenter to webpack configuration
webpackConfig.module.loaders.push(
    {
        test: /\.js$/,
        exclude: /(node_modules|test)/,
        loader: 'babel-istanbul-loader'
    }
);

webpackConfig.output.filename += '.test';
webpackConfig.plugins = [];
webpackConfig.externals = [];


function ConfigException(message) {
   this.message = message;
   this.name = 'ConfigException';
}


// The main configuration
module.exports = function(config) {
    if (process.env.CI && (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)) {
        throw ConfigException('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
    }

    // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 10',
            version: '59.0'
        },
        sl_chrome_2: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 10',
            version: '58.0'
        },
        sl_edge: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10',
            version: '15.15063'
        },
        sl_edge_2: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10',
            version: '14.14393'
        },
        sl_safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'macOS 10.12',
            version: '10.0'
        },
        sl_safari_2: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.11',
            version: '9.0'
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 10',
            version: '54'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        sl_safari_mobile: {
            base: 'SauceLabs',
            browserName: "Safari",
            appiumVersion: "1.6.4",
            deviceName: "iPhone Simulator",
            deviceOrientation: "portrait",
            platformVersion: "10.3",
            platformName: "iOS"
        },
        sl_safari_mobile_2: {
            base: 'SauceLabs',
            browserName: "Safari",
            appiumVersion: "1.6.4",
            deviceName: "iPhone Simulator",
            deviceOrientation: "portrait",
            platformVersion: "9.3",
            platformName: "iOS"
        },
        sl_chrome_mobile: {
            base: 'SauceLabs',
            browserName: "Chrome",
            appiumVersion: "1.6.4",
            deviceName: "Android Emulator",
            deviceOrientation: "portrait",
            platformVersion: "6.0",
            platformName: "Android"
        },
        sl_chrome_mobile_2: {
            base: 'SauceLabs',
            browserName: "Browser",
            appiumVersion: "1.6.4",
            deviceName: "Android Emulator",
            deviceOrientation: "portrait",
            platformVersion: "5.1",
            platformName: "Android"
        }
    }

    config.set({
        frameworks: [
            'jasmine-jquery',
            'jasmine-ajax',
            'jasmine'
        ],

        files: [
            'test/*.spec.js'
        ],

        preprocessors: {
            'test/*.spec.js': [
                'webpack'
            ]
        },

        coverageReporter: {
            reporters: [
                { type: 'lcov', dir: paths.coverageDir },
                { type: 'text' }
            ]
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },
        colors: true,
        recordScreenshots: false,
        reporters: (process.env.TRAVIS) ? ['spec', 'coverage', 'coveralls', 'saucelabs'] : ['spec', 'coverage', 'saucelabs'],

        sauceLabs: {
            testName: 'Dual listbox browser testing',
            public: 'public'
        },
        customLaunchers: customLaunchers,
        captureTimeout: 120000,
        browsers: Object.keys(customLaunchers),
        singleRun: true
    });
}
