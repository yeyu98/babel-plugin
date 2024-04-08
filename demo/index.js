/*
 * @Author: yeyu98
 * @Date: 2024-04-07 17:55:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-04-08 09:57:21
 * @FilePath: \babel-plugin\demo\index.js
 * @Description: 
 */
const path = require('path')
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default
const t = require('@babel/types')
const fs = require('fs')

const baseUrl = path.resolve(__dirname, 'base.js')

const code = fs.readFileSync(baseUrl, 'utf8')
const ast = parser.parse(code, {
  sourceType: 'module'
})
// console.log('🥳🥳🥳 ~~ code--->>>', code)

// 修改
// traverse(ast, {
//   enter(path) {
//     if (path.node.type === 'NumericLiteral' && path.node.value === 1) {
//       path.node.value = 100;
//     }
//   }
// })

// 增
// traverse(ast, {
//   VariableDeclaration: {
//     enter(path) {
//       console.log('🥳🥳🥳 ~~ enter ~~ path--->>>', path.node)
//       const newNode = t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('log')), [t.identifier('a')])
//       path.insertAfter(newNode)
//       path.stop()
//     }
//   }
// })

// 替换
/*
将 es6 语法的 let 改为 var
按需引入组件： import { Button } from 'antd' -> import Button form 'antd/lib/Button'
*/ 

traverse(ast, {
  VariableDeclaration(path) {
    if(path.node.kind === 'let') {
      path.node.kind === 'var'
    }
    path.stop()
  },
  ImportDeclaration(path) {
    // specifiers：import 中间部分
    // source：import 源
    // 这里只针对Button暂时
    const {source, specifiers} = path.node
    if(source.value === 'antd' && !t.isImportDefaultSpecifier(path.node)) {
      
      const newNodes = specifiers.map(specifier => {
        const name = specifier.imported.name
        const source = `antd/lib/${name}`
        return t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(source))
      })
      path.replaceWithMultiple(newNodes)
      path.stop()
    } 
  }
})



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
fs.writeFile(baseUrl, result.code, 'utf8', (err) => {
  console.log(err)
})