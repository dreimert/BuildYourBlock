// Ce fichier contient du code de support.
// Vous n'avez pas à le comprendre
// ni à le modifier

const util = require('util');

class BlockTool {
  // Pour l'affichage dans la console
  [util.inspect.custom](depth, options){
    if (depth < 0) {
      return options.stylize('[Block]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1
    });

    const padding = ' '.repeat(7);
    const format = function(value) {
      return util.inspect(value, newOptions)
          .replace(/\n/g, `\n${padding}`);
    };
    const inner = `\n${padding}index: ${format(this.index)}\n${padding}id: ${format(this.id)}\n${padding}previous: ${format(this.previous)}\n${padding}data: ${format(this.data)}`
    return `${options.stylize('Block', 'special')}< ${inner} >`;
  }
}

class BlockchainTool {
  [util.inspect.custom](depth, options){
    if (depth < 0) {
      return options.stylize('[Blockchain]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1
    });

    const chain = this.chain.map((block) => {
      const boxLine = util.inspect(block, newOptions).split('\n');
      const maxLengthLine = boxLine.reduce((max, line) => {
        return Math.max(max, line.length);
      }, 0);
      const boxWrap = boxLine.map((line) => {
        return `| ${line} ${' '.repeat(maxLengthLine - line.length + 6)}|`;
      }).join('\n');
      const border = '-'.repeat(maxLengthLine);
      return `\n${border}\n${boxWrap}\n${border}`;
    }).join('\n  /\\\n  ||');

    return `${options.stylize('Blockchain', 'special')} < ${chain} >`;
  }
}

module.exports = {
  BlockTool,
  BlockchainTool
}
