/**
 * @file HTML grammar for tree-sitter
 * @author Max Brunsfeld, Vadim Pavlov
 * @license MIT
 */

module.exports = grammar({
  name: 'jshtml',

  extras: ($) => [
    $.comment,
    /\s+/,
  ],

  externals: ($) => [
    $._start_tag_name,
    $._script_start_tag_name,
    $._style_start_tag_name,
    $._end_tag_name,
    $.erroneous_end_tag_name,
    '/>',
    $._implicit_end_tag,
    $.raw_text,
    $.text,
    $._single_quoted_value_fragment,
    $._double_quoted_value_fragment,
    $._tag_arg,
    $.comment,
  ],

  rules: {
    fragment: ($) => repeat($._node),

    doctype: ($) => seq(
      '<!',
      alias($._doctype, 'doctype'),
      /[^>]+/,
      '>',
    ),

    _doctype: (_) => /[Dd][Oo][Cc][Tt][Yy][Pp][Ee]/,

    _node: ($) => choice(
      $.doctype,
      $.text,
      $.element,
      $.script_element,
      $.style_element,
      $.erroneous_end_tag,
      $.tpl_variable,
      $.tpl_tag,
      $.tpl_block,
      $.tpl_use,
      $.tpl_section,
      $.tpl_if,
      $.tpl_foreach,
    ),

    element: ($) => choice(
      seq(
        $.start_tag,
        repeat($._node),
        choice($.end_tag, $._implicit_end_tag),
      ),
      $.self_closing_tag,
    ),

    script_element: ($) => seq(
      alias($.script_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    style_element: ($) => seq(
      alias($.style_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    start_tag: ($) => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat($._attribute_area),
      '>',
    ),

    script_start_tag: ($) => seq(
      '<',
      alias($._script_start_tag_name, $.tag_name),
      repeat($._attribute_area),
      '>',
    ),

    style_start_tag: ($) => seq(
      '<',
      alias($._style_start_tag_name, $.tag_name),
      repeat($._attribute_area),
      '>',
    ),

    self_closing_tag: ($) => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat($._attribute_area),
      '/>',
    ),

    end_tag: ($) => seq(
      '</',
      alias($._end_tag_name, $.tag_name),
      '>',
    ),

    erroneous_end_tag: ($) => seq(
      '</',
      $.erroneous_end_tag_name,
      '>',
    ),

    _attribute_area: ($) => choice(
      $.attribute,
      $.tpl_tag,
      alias($._tpl_if_in_attr_area, $.tpl_if),
      alias($._tpl_foreach_in_attr_area, $.tpl_foreach),
      alias($._tpl_use_in_attr_area, $.tpl_use),
      alias($._tpl_section_in_attr_area, $.tpl_section),
    ),

    attribute: ($) => seq(
      $.attribute_name,
      optional(seq(
        '=',
        choice(
          $.attribute_value,
          $.quoted_attribute_value,
        ),
      )),
    ),

    attribute_name: ($) => choice(
      $.tpl_variable,
      /[^<>"'/=\s]+/,
    ),

    attribute_value: ($) => choice(
      $.tpl_variable,
      $.tpl_tag,
      /[^<>"'=\s]+/,
    ),

    quoted_attribute_value: ($) => choice(
      seq(
        '\'',
        optional(alias($._single_quoted_attribute_value, $.attribute_value)),
        '\'',
      ),
      seq(
        '"',
        optional(alias($._double_quoted_attribute_value, $.attribute_value)),
        '"',
      ),
    ),

    _single_quoted_attribute_value: ($) => repeat1(
      $._single_quoted_attribute_value_node,
    ),

    _single_quoted_attribute_value_node: ($) => choice(
      $._attribute_value_nodes,
      alias($._tpl_if_in_single_quoted_attr, $.tpl_if),
      alias($._tpl_foreach_in_single_quoted_attr, $.tpl_foreach),
      alias($._tpl_use_in_single_quoted_attr, $.tpl_use),
      alias($._tpl_section_in_single_quoted_attr, $.tpl_section),
      alias($._single_quoted_value_fragment, $.value_fragment),
    ),

    _double_quoted_attribute_value: ($) => repeat1(
      $._double_quoted_attribute_value_node,
    ),

    _double_quoted_attribute_value_node: ($) => choice(
      $._attribute_value_nodes,
      alias($._tpl_if_in_double_quoted_attr, $.tpl_if),
      alias($._tpl_foreach_in_double_quoted_attr, $.tpl_foreach),
      alias($._tpl_use_in_double_quoted_attr, $.tpl_use),
      alias($._tpl_section_in_double_quoted_attr, $.tpl_section),
      alias($._double_quoted_value_fragment, $.value_fragment),
    ),

    _attribute_value_nodes: ($) => choice(
      $.tpl_variable,
      $.tpl_tag,
    ),

    tpl_variable: ($) => seq(
      '{{',
      optional($._ws),
      alias($._tag_arg, $.tpl_js_expression),
      optional($._ws),
      '}}',
    ),

    tpl_tag: ($) => buildTplTag(
      $, /\w+/, optional(alias($._tag_arg, $.tpl_tag_attributes)),
    ),

    /* block statement */
    tpl_block: ($) => buildTplBlock($, $._node),
    _tpl_block_start: ($) => buildTplTag(
      $, 'block', alias(/[-\w]+/, $.tpl_tag_attributes),
    ),
    _tpl_block_end: ($) => buildTplEndTag($, 'block'),

    /* use statement */
    tpl_use: ($) => buildTplUse($, $._node),
    _tpl_use_in_attr_area: ($) => buildTplUse($, $._attribute_area),
    _tpl_use_in_double_quoted_attr: ($) => buildTplUse(
      $, $._double_quoted_attribute_value_node,
    ),
    _tpl_use_in_single_quoted_attr: ($) => buildTplUse(
      $, $._single_quoted_attribute_value_node,
    ),
    _tpl_use_start: ($) => buildTplTag(
      $, 'use', alias($._tag_arg, $.tpl_tag_attributes),
    ),
    _tpl_use_end: ($) => buildTplEndTag($, 'use'),

    /* section statement */
    tpl_section: ($) => buildTplSection($, $._node),
    _tpl_section_in_attr_area: ($) => buildTplSection($, $._attribute_area),
    _tpl_section_in_double_quoted_attr: ($) => buildTplSection(
      $, $._double_quoted_attribute_value_node,
    ),
    _tpl_section_in_single_quoted_attr: ($) => buildTplSection(
      $, $._single_quoted_attribute_value_node,
    ),
    _tpl_section_start: ($) => buildTplTag(
      $, 'section', alias(/[-\w]+/, $.tpl_tag_attributes),
    ),
    _tpl_section_end: ($) => buildTplEndTag($, 'section'),

    /* if statement */
    tpl_if: ($) => buildTplIf($, $._node),
    _tpl_if_in_attr_area: ($) => buildTplIf($, $._attribute_area),
    _tpl_if_in_single_quoted_attr: ($) => buildTplIf(
      $, $._single_quoted_attribute_value_node,
    ),
    _tpl_if_in_double_quoted_attr: ($) => buildTplIf(
      $, $._double_quoted_attribute_value_node,
    ),
    _tpl_if_start: ($) => buildTplTag(
      $, 'if', alias($._tag_arg, $.tpl_js_expression),
    ),
    _tpl_elseif: ($) => buildTplTag(
      $, 'elseif', alias($._tag_arg, $.tpl_js_expression),
    ),
    _tpl_else: ($) => buildTplTag($, 'else'),
    _tpl_endif: ($) => buildTplEndTag($, 'if'),

    /* foreach statement */
    tpl_foreach: ($) => buildTplForeach($, $._node),
    _tpl_foreach_in_attr_area: ($) => buildTplForeach($, $._attribute_area),
    _tpl_foreach_in_double_quoted_attr: ($) => buildTplForeach(
      $, $._double_quoted_attribute_value_node,
    ),
    _tpl_foreach_in_single_quoted_attr: ($) => buildTplForeach(
      $, $._single_quoted_attribute_value_node,
    ),
    _tpl_foreach_start: ($) => buildTplTag(
      $,
      'foreach',
      seq(
        alias(/([^\s%]|%[^}])+/, $.tpl_js_expression),
        $._ws,
        alias('as', $.keyword),
        $._ws,
        alias(/\w+/, $.variable_name),
      ),
    ),
    _tpl_foreach_end: ($) => buildTplEndTag($, 'foreach'),

    _ws: (_) => repeat1(/\s/),

  },
});

function buildTplBlock($, content) {
  return seq(
    alias($._tpl_block_start, $.tpl_start_tag),
    repeat(content),
    alias($._tpl_block_end, $.tpl_end_tag),
  );
}

function buildTplUse($, content) {
  return seq(
    alias($._tpl_use_start, $.tpl_start_tag),
    repeat(content),
    alias($._tpl_use_end, $.tpl_end_tag),
  );
}

function buildTplSection($, content) {
  return seq(
    alias($._tpl_section_start, $.tpl_start_tag),
    repeat(content),
    alias($._tpl_section_end, $.tpl_end_tag),
  );
}

function buildTplForeach($, content) {
  return seq(
    alias($._tpl_foreach_start, $.tpl_start_tag),
    repeat(content),
    alias($._tpl_foreach_end, $.tpl_end_tag),
  );
}

function buildTplIf($, content) {
  return seq(
    alias($._tpl_if_start, $.tpl_start_tag),
    repeat(content),
    repeat(
      prec.left(
        seq(
          alias($._tpl_elseif, $.tpl_branch),
          repeat($._node),
        ),
      ),
    ),
    optional(
      seq(
        alias($._tpl_else, $.tpl_branch),
        repeat($._node),
      ),
    ),
    alias($._tpl_endif, $.tpl_end_tag),
  );
}

function buildTplEndTag($, name) {
  return buildTplTag($, 'end' + name);
}

function buildTplTag($, name, tagArg) {
  return seq(
    '{%',
    optional($._ws),
    alias(name, $.tpl_tag_name),
    tagArg ? seq($._ws, tagArg) : optional($._ws),
    '%}',
  );
}
