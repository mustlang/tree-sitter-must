package tree_sitter_must_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_must "github.com/mustlang/tree-sitter-must/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_must.Language())
	if language == nil {
		t.Errorf("Error loading Must grammar")
	}
}
