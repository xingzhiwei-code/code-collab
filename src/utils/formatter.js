import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserCss from 'prettier/parser-postcss'

export const formatCode = async (code, language = 'javascript') => {
  try {
    const parser = getParserByLanguage(language)
    if (!parser) {
      throw new Error(`不支持的语言类型: ${language}`)
    }

    const plugins = {
      babel: [parserBabel],
      html: [parserHtml],
      css: [parserCss]
    }

    if (!plugins[parser]) {
      throw new Error(`找不到对应的解析器插件: ${parser}`)
    }
    
    const formattedCode = await prettier.format(code, {
      parser,
      plugins: plugins[parser],
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
    console.error('代码格式化失败:', error.message)
    throw new Error(`代码格式化失败: ${error.message}`)
  }
}

function getParserByLanguage(language) {
  const parserMap = {
    javascript: 'babel',
    html: 'html',
    css: 'css',
    vue: 'babel'
  }
  return parserMap[language] || 'babel'
}