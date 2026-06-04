import fs from 'fs';

const filePath = 'src/components/ArticleDetailView.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

function countBrackets() {
  let curly = 0;
  let paren = 0;
  let square = 0;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') curly++;
    else if (char === '}') curly--;
    else if (char === '(') paren++;
    else if (char === ')') paren--;
    else if (char === '[') square++;
    else if (char === ']') square--;
    
    if (curly < 0) {
      console.log(`Curly brace closed too early at index ${i}`);
      break;
    }
    if (paren < 0) {
      console.log(`Parenthesis closed too early at index ${i}`);
      break;
    }
  }
  console.log(`Bracket state: Curlies=${curly}, Parens=${paren}, Squares=${square}`);
}

countBrackets();
