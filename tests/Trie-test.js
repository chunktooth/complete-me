import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n');

describe('TRIE', () => {
	let trie;

	beforeEach(() => {
		trie = new Trie();
	});

	it('should instantiate our good friend Trie', () => {
		expect(trie).to.exist;
	});

	it('should track a number of words', () => {
		expect(trie.wordCount).to.eq(0);
	});

	it('should store nodes', () => {
		expect(trie.children).to.deep.eq({});
	});

	describe('INSERT', () => {

		it('should be able to increment count', () => {
			expect(trie.wordCount).to.eq(0)

			trie.insert('pizza');
			expect(trie.wordCount).to.eq(1);
		});

		it('should create keys in children object of first letter', () => {
			trie.insert('tacocat');
			trie.insert('pizza');
			trie.insert('cat');

			// console.log(JSON.stringify(trie, null, 4));
			expect(Object.keys(trie.children)).to.deep.eq(['t', 'p', 'c']);
		});

	});

	describe('SUGGEST', () => {

		beforeEach(() => {
			trie.insert('pizza');
			trie.insert('pizzas');
			trie.insert('piano');
			trie.insert('dog');
		})

		it('should return an array of suggested words', () => {
			let results = trie.suggest('pi');

			let check1 = results.some(result => result === 'pizza');
			let check2 = results.some(result => result === 'pizzas');
			let check3 = results.some(result => result === 'piano');
			let check4 = results.some(result => result === 'dog');

			expect(check1).to.be.true;
			expect(check2).to.be.true;
			expect(check3).to.be.true;
			expect(check4).to.be.false;
		});

	});

	describe('POPULATE', () => {

		it('should populate a dictionary', () => {
			expect(trie.wordCount).to.eq(0);
			trie.populate(dictionary);
			expect(trie.wordCount).to.eq(235886);
		});

		it('should suggest a word from the dictionary', () => {
			trie.populate(dictionary);
			expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
		});

	});

	describe('SELECT', () => {

    it('should prioritize ', () => {
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);

      trie.select('pizzeria');
      expect(trie.suggest('piz')).to.deep.equal([ 'pizzeria', 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });

  });
  
  describe('DELETE', () => {

    it('should delete the word ', () => {
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
      
      trie.delete('pizzeria');
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });

  });

});