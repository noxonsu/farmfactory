const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const fsExtra = require('fs-extra')

const root_folder = './build'
const _extenstions = ['*.js']


fsExtra.remove('../reactwidget/', (err) => {
  fsExtra.copy(root_folder + '/static/js/', '../reactwidget/static/js/', err => {
    fsExtra.copy(root_folder + '/assets/css/rainbow.css', '../reactwidget/rainbow.css', err => {
      _extenstions.forEach((ext) => {
        glob('../reactwidget/' + '/**/' + ext, (err, files) => {
          if (err) {
            console.log('Error', err)
          } else {
            files.forEach((file) => {
              const content = readFileSync(file, 'utf8');

              const newContent = content.replaceAll('"FARM_ROOT_URL/"', 'window.SO_FARM_FACTORY_ROOT + "/reactwidget/"');

              console.log(file);
              writeFileSync(file, newContent);
            })
          }
        })
      })
    })
  })
})