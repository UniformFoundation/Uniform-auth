import Task from '@uniform-foundation/node-crunz';
import fetch from 'node-fetch-commonjs';

const task = new Task('example-task-periodic', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const json = await response.json();
    console.log(json);
})
    .getTimeBuilder()
    .every(30, 'minutes')
    .build();
console.log(task);

export default task;
