module.exports = {
  name: 'okreads-browser',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/okreads/browser',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};