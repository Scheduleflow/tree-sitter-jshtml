# tree-sitter-jshtml

JSHTML grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

## Using with nvim

[Install nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/wiki/Installation)

Clone the repo:
```
cd ~
git clone git@github.com:Scheduleflow/tree-sitter-jshtml.git
```

Append to your vim config:
```vim
autocmd BufRead,BufNewFile */sf/web/client/js/*.html set filetype=jshtml syntax=jshtml

lua << EOF
local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
parser_config.jshtml = {
  install_info = {
    url = "~/tree-sitter-jshtml", -- local path or git repo
    files = {"src/parser.c", "src/scanner.c"},
    -- optional entries:
    generate_requires_npm = false, -- if stand-alone parser without npm dependencies
    requires_generate_from_grammar = false, -- if folder contains pre-generated src/parser.c
  },
  filetype = "jshtml", -- if filetype does not match the parser name
}

vim.api.nvim_create_autocmd('FileType', {
    pattern = "jshtml",
    callback = function()
        vim.opt_local.indentkeys = 'o,O,<Return>,<>>,{,},!^F';
        vim.opt_local.matchpairs = '<:>';
    end,
})
EOF
```

Install scm queries:
```
mkdir -p ~/.config/nvim/after/queries
ln -s ~/tree-sitter-jshtml/queries ~/.config/nvim/after/queries/jshtml
```

Launch vim and run:
```
TSInstall jshtml
```
