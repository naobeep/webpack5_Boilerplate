export const fuga = () => {
  // 非同期処理
  asyncFunc();

  // asyncFuncの結果を待たずに実行
  console.log(3);
};

// polyfill の確認
const asyncFunc = async () => {
  const sleep = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 2000);
    });
  };

  const x = await sleep();

  // sleepの結果を待ってから実行
  console.log(x);
  console.log(2);
};

// null/undefined safe の確認
const hoge: HTMLElement | null = document.querySelector('.hoge');
export const hogeClientHight = hoge?.clientHeight ?? 0;

// Tree shaking の確認
// どこにもインポートされていないため、デッドコード
const moduleA = () => {
  console.log('moduleA');
  document.getElementById('targetA')!.textContent =
    'moduleAでテキスト書き換え（意図しない動作）';
};

const moduleB = () => {
  console.log('moduleB');
  document.getElementById('targetB')!.textContent =
    'moduleBでテキスト書き換え（正常な動作）';
};

export { moduleA, moduleB };
