class Node {
  constructor(letter = null) {
    this.letter = letter;
    this.completeWord = false;
    this.children = {};
    this.popularity = 0;
  }
}

module.exports = Node;