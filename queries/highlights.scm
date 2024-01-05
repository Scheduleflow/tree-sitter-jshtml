(tag_name) @tag
(erroneous_end_tag_name) @tag.error
(doctype) @constant
(attribute_name) @attribute
(attribute_value) @string
(comment) @comment

[
  "<"
  ">"
  "</"
  "/>"
  "{{"
  "}}"
  "{%"
  "%}"
] @punctuation.bracket

(tpl_tag_name) @function
(tpl_tag_attributes) @string

(keyword) @keyword
(variable_name) @variable
