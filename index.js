/*
 * @Author: yeyu98
 * @Date: 2024-03-19 15:21:23
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-04-07 14:49:55
 * @FilePath: \babel\index.js
 * @Description: 
 */
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default
const t = require('@babel/types')
const fs = require('fs')

const code = fs.readFileSync('./base.js', 'utf8')
const ast = parser.parse(code)
console.log('🥳🥳🥳 ~~ code--->>>', code)

// 修改
// traverse(ast, {
//   enter(path) {
//     if (path.node.type === 'NumericLiteral' && path.node.value === 1) {
//       path.node.value = 100;
//     }
//   }
// })

// 增
traverse(ast, {
  VariableDeclaration: {
    enter(path) {
      console.log('🥳🥳🥳 ~~ enter ~~ path--->>>', path.node)
      const newNode = t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('log')), [t.identifier('a')])
      path.insertAfter(newNode)
      path.stop()
    }
  }
})

// 替换

// 删除
// traverse(ast, {
//   enter(path) {
//     console.log('---',path.node)
//     if(path.node.type === 'CallExpression') {
//       path.remove()
//     }
//   }
// })

const result = generator(ast, {}, code)
fs.writeFile('./base.js', result.code, 'utf8', (err) => {
  console.log(err)
})