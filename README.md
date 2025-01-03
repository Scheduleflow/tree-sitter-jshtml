# tree-sitter-jshtml

JSHTML grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

## Using with nvim

[Install nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/wiki/Installation)

Clone the repo:
```
cd ~
git clone git@github.com:Scheduleflow/tree-sitter-jshtml.git
```

Install dependencies and build the parser:
```
cd ~/tree-sitter-jshtml
npm ci
npm run build
```

Install scm queries:
```
mkdir -p ~/.config/nvim/after/queries
ln -s ~/tree-sitter-jshtml/queries ~/.config/nvim/after/queries/jshtml
```

Register the parser in your nvim config. For example configuration see [ruwaiting-nvim-config](https://github.com/Scheduleflow/ruwaiting-nvim-config).

Launch vim and run:
```
TSInstall jshtml
```
