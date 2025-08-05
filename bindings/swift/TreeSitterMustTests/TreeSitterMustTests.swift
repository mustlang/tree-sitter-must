import XCTest
import SwiftTreeSitter
import TreeSitterMust

final class TreeSitterMustTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_must())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Must grammar")
    }
}
