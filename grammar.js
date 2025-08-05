/**
 * @file Must grammar for tree-sitter
 * @author Dominik Muc <git@dominikmuc.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "must",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [[$.expr, $.block]],

  rules: {
    source_file: ($) => repeat($.module_item),

    comment: (_) =>
      token(
        choice(
          seq("//", /[^\r\n\u2028\u2029]*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        ),
      ),

    visibility: (_) => "pub",

    identifier: (_) => /[a-zA-Z][a-zA-Z0-9]*/,

    path: ($) =>
      prec.right(
        seq(
          field("head", $.identifier),
          repeat(seq(".", field("tail", $.identifier))),
        ),
      ),

    module_item: ($) =>
      choice($.function, $.module, $.module_decl, $.import, $.struct, $.impl),

    module: ($) =>
      seq(
        optional($.visibility),
        "mod",
        field("name", $.identifier),
        "{",
        repeat($.module_item),
        "}",
      ),

    module_decl: ($) =>
      seq(optional($.visibility), "mod", field("name", $.identifier), ";"),

    import: ($) =>
      seq(
        optional($.visibility),
        "import",
        $.path,
        optional(seq("as", $.identifier)),
        ";",
      ),

    struct: ($) =>
      seq(
        optional($.visibility),
        "struct",
        field("name", $.identifier),
        "{",
        optional(sepBy(",", $.field)),
        optional(","),
        "}",
      ),

    field: ($) =>
      seq(optional($.visibility), field("name", $.identifier), ":", $.type),

    impl: ($) => seq("impl", $.type, "{", repeat($.impl_item), "}"),

    impl_item: ($) => $.function,

    function: ($) =>
      seq(
        optional($.visibility),
        "fn",
        field("name", $.identifier),
        "(",
        optional(sepBy(",", $.arg)),
        optional(","),
        ")",
        optional(seq("->", $.type)),
        $.block,
      ),

    arg: ($) => seq(field("name", $.identifier), ":", $.type),

    type: ($) => choice(seq("[]", $.type), seq("[]", "mut", $.type), $.path),

    stmt: ($) =>
      choice(
        seq("return", optional($.expr), ";"),
        seq(
          "let",
          optional("mut"),
          $.identifier,
          ":",
          $.type,
          "=",
          $.expr,
          ";",
        ),
        seq($.expr, ";"),
      ),

    expr: ($) =>
      choice($.block, $.if_expr, $.fun_call, $.struct_cons, $.number, $.path),

    number: (_) => /\d+/,

    block: ($) => seq("{", repeat($.stmt), "}"),

    if_expr: ($) => seq("if", $.expr, $.block),

    struct_cons: ($) =>
      seq($.path, ".{", sepBy(",", $.field_cons), optional(","), "}"),

    field_cons: ($) => seq($.identifier, "=", $.expr),
  },
});

function sepBy(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}
