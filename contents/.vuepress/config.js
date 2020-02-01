const fs = require('fs');
const path = require('path');

var dirpath = "./contents"
var exTopArray = ['readme.md'];
var exBottomArray = ['01-01.md'];

var dirs = fs.readdirSync(dirpath).filter((f) => {
  return fs.existsSync(dirpath + "/" + f) && fs.statSync(dirpath + "/" + f).isDirectory() && f != '.vuepress'
})
var sidebarArray = ["/"].concat(dirs.map((dir) => {
  let title = dir;
  let m = dir.match(/^Week-([0-9~]+)$/);
  if (m) {
    if (m[1] == '0') {
      title = '出産前日〜生後0週間';
    } else {
      title = '生後' + m[1] + '週間';
    }
  } else {
    m = dir.match(/^Month-([0-9~]+)$/);
    if (m) {
      title = '生後' + m[1] + 'ヶ月';
    }
  }
  return {
    title: title,
    collapsable: true,
    children: fs.readdirSync(dirpath + "/" + dir).sort((a, b) => {
      for (let i=0; i<exTopArray.length; i++) {
        let ex = exTopArray[i];
        if (a.toLowerCase() == ex) return -1;
        if (b.toLowerCase() == ex) return 1;
      }
      for (let i=0; i<exBottomArray.length; i++) {
        let ex = exBottomArray[i];
        if (a.toLowerCase() == ex) return 1;
        if (b.toLowerCase() == ex) return -1;
      }
      if (a.match(/^Month-([0-9~]+)$/) && b.match(/^Week-([0-9~]+)$/)) return -1;
      if (b.match(/^Month-([0-9~]+)$/) && a.match(/^Week-([0-9~]+)$/)) return 1;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }).map((child) => {
      if (child.toLowerCase() == 'readme.md') return '/' + dir + '/';
      return '/' + dir + '/' + child;
    })
  }
}))

sidebarArray[sidebarArray.length-1].collapsable = false;

module.exports = {
  title: 'エンジニア育休記録',
  meta: [
    { charset: 'utf-8' }
  ],
  base: '/ChildcareLeaveDiary/',
  dest: 'docs',
  themeConfig: {
    sidebar: sidebarArray
  }
}
