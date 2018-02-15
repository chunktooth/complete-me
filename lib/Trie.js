import Node from './Node';

export default class Trie {
  constructor() {
    this.wordCount = 0;
    this.children = {};
  }

  insert(word) {
    this.wordCount++;
    let splitWord = [...word];
    let currentNode = this.children;

    while (splitWord.length) {
      let firstLetter = splitWord.shift();

      if (!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if (!splitWord.length) {
        currentNode[firstLetter].completeWord = true;
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    let suggestions = [];
    let index = 0;
    let currentNode = this;

    while (index < prefix.length) {
      if (currentNode.children[prefix[index]]) {
        currentNode = currentNode.children[prefix[index]];
      }
      index++;
    }

    const addSuggestions = (node, prefix) => {
      if (node.completeWord) {
        if (node.popularity === 0) {
          suggestions.push(prefix);
        } else {
          suggestions.unshift(prefix);
        }
      }

      const childNodes = Object.keys(node.children);

      childNodes.forEach(child => {
        const newPrefix = prefix + child;

        addSuggestions(node.children[child], newPrefix);
      });
    };

    addSuggestions(currentNode, prefix);
    return suggestions;
  }

  populate(words) {
    words.forEach(word => {
      this.insert(word);
    });
  }

  select(word) {
    let letters = [...word];
    let currentLevel = this.children;

    while (letters.length > 1) {
      let currentLetter = letters.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;

      }
    }
    currentLevel[letters[0]].popularity++;
  }

  delete(word) {
    let letters = [...word];
    let currentLevel = this.children;

    while (letters.length > 1) {
      let currentLetter = letters.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    currentLevel[letters[0]].completeWord = false; 
  }  
}
