(element) @tag.outer
(element (start_tag) . (_) @tag.inner . (end_tag))
(_ (tpl_start_tag)) @function.outer
(
 (_ (tpl_start_tag) . (_) @_start @_end (_)? @_end . (tpl_end_tag))
 (#make-range! "function.inner" @_start @_end)
)
(tpl_block (tpl_start_tag)) @block.outer
((tpl_block (tpl_start_tag) . (_) @_start @_end (_)? @_end . (tpl_end_tag))
 (#make-range! "block.inner" @_start @_end))

(
 (tpl_if (tpl_start_tag) . (_) @_start @_end (_)? @_end . (tpl_branch))
 (#make-range! "condition.inner" @_start @_end)
)
(
 (tpl_if (tpl_start_tag) @_start @_end (_)? @_end . (tpl_branch))
 (#make-range! "condition.outer" @_start @_end)
)
(
 ((tpl_branch) . (_) @_start @_end (_)? @_end . (tpl_branch))
 (#make-range! "condition.inner" @_start @_end)
)
(
 ((tpl_branch) @_start @_end (_)? @_end . (tpl_branch))
 (#make-range! "condition.outer" @_start @_end)
)
(
 ((tpl_branch) . (_) @_start @_end (_)? @_end . (tpl_end_tag))
 (#make-range! "condition.inner" @_start @_end)
)
(
 ((tpl_branch) @_start @_end (_)? @_end . (tpl_end_tag))
 (#make-range! "condition.outer" @_start @_end)
)
(
 ("{%" @_start "%}" @_end)
 (#make-range! "call.outer" @_start @_end)
)
(
 ("{%" . (_) @_start @_end (_)? @_end . "%}" )
 (#make-range! "call.inner" @_start @_end)
)
(
 ("{{" @_start "}}" @_end)
 (#make-range! "call.outer" @_start @_end)
)
(
 ("{{" . (_) @_start @_end (_)? @_end . "}}" )
 (#make-range! "call.inner" @_start @_end)
)
(tpl_js_expression) @parameter.outer
(tpl_js_expression) @parameter.inner
(tpl_tag_attributes) @parameter.outer
(tpl_tag_attributes) @parameter.inner
(tpl_foreach (tpl_start_tag (variable_name) @parameter.inner))
(tpl_foreach (tpl_start_tag (variable_name) @parameter.outer))
