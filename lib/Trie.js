import Node from './Node';

export default class Trie {
  constructor() {
    this.wordCount = 0;
    this.children = {};
  }

  insert(word) {
    let letters = [...word];
    let currentNode = this.children;

    while (letters.length) {
      let firstLetter = letters.shift();

      if (!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }

      if (!letters.length && !currentNode[firstLetter].completeWord) {
        this.wordCount++;
        currentNode[firstLetter].completeWord = true;
      }

      currentNode = currentNode[firstLetter].children;
    }  
  }

  suggest(prefix) { 

    // Prepare an array of suggested words
    // Keep track of the prefix index
    // Keep track of the current node
    let suggestions = [];
    let index = 0;
    let currentNode = this;

    // While prefix still contains length
    // If children node contains the letter of that prefix
    // Establish each letter as the current node each time
    // Increment to the next letter of the prefix
    while (index < prefix.length) {
      if (currentNode.children[prefix[index]]) {
        currentNode = currentNode.children[prefix[index]];
      }
      index++;
    }

    const addSuggestions = (node, prefix) => {

      // Check if that letter node makes a complete word yet
      // And if the word has yet been populated
      // If the word has not been populated, the existing prefix will be suggested last
      // Else the existing prefix will be suggested first
      if (node.completeWord) {
        if (node.popularity === 0) {
          suggestions.push(prefix);
        } else {
          suggestions.unshift(prefix);
        }
      }

      // Access children node object to find matching key
      // Iterate through children node
      // Add a new letter of a child node to the prefix
      // Add children node containing the key and add new prefix to generate new suggestion
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

  findChildren(letters) {
    let currentLevel = this.children;

    while (letters.length > 1) {
      let currentLetter = letters.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;

      }
    }
    return currentLevel;
  }

  select(word) {
    let letters = [...word];
    let currentLevel = this.findChildren(letters);

    currentLevel[letters[0]].popularity++;
  }

  delete(word) {
    let letters = [...word];
    let currentLevel = this.findChildren(letters);

    currentLevel[letters[0]].completeWord = false; 
  }
}