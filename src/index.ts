  document.addEventListener('DOMContentLoaded', () => {
    console.log('searched!')
    const btn: HTMLButtonElement = document.getElementById('testerino') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      console.log('clicked!')
    });
  });
