((script_element
  (raw_text) @injection.content)
 (#set! injection.language "javascript"))

((tpl_js_expression) @injection.content
 (#set! injection.language "javascript"))

((style_element
  (raw_text) @injection.content)
 (#set! injection.language "css"))
