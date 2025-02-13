import prettier from 'prettier'
import * as parserBabel from 'prettier/plugins/babel'
import * as parserHtml from 'prettier/plugins/html'
import * as parserCss from 'prettier/plugins/postcss'

export const formatCode = async (code, language = 'javascript') => {
  try {
    const plugins = [parserBabel, parserHtml, parserCss]
    const parser = getParserByLanguage(language)
    
    const formattedCode = await prettier.format(code, {
      parser,
      plugins,
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 80,
      tabWidth: 2,
      bracketSpacing: true,
      arrowParens: 'avoid'
    })
    return formattedCode
  } catch (error) {
    console.error('代码格式化失败:', error)
    return code
  }
}

function getParserByLanguage(language) {
  const parserMap = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    vue: 'vue'
  }
  return parserMap[language] || 'babel'
}