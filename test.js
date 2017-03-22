import Process from './Languages/English';

let passed = 0;
const tests = [
  {
    input: 'add 1 2 3',
    result: '6'
  },
  {
    input: 'multiply 1 2 10',
    result: '20'
  },
  {
    input: '1 multiply 2 10',
    result: '1 20'
  },
  {
    input: '11 2 10 add',
    result: '11 2 10 add'
  },
  {
    input: 'add 1 and 3 and 4',
    result: '8'
  },
  {
    input: '1 + 3 + 4',
    result: '8'
  },
  {
    input: '1 * 30 * 4',
    result: '120'
  },
  {
    input: '1+3*3',
    result: '12'
  },
  {
    input: '1 plus 4* 5',
    result: '25'
  }
];

for (let i = 0; i < tests.length; i++) {
  const ans = Process(tests[i].input);

  if (ans === tests[i].result) {
    passed = passed + 1;
  }
}

console.log(passed + ' out of ' + tests.length + ' test cases passed!\n');
