; inherits: html

(_ (tpl_start_tag)) @indent.begin
(_ (tpl_end_tag ["%}"] @indent.end))
(_ (tpl_end_tag) @indent.branch)

(tpl_branch) @indent.branch


(ERROR) @indent.auto
