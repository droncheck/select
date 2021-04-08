import {Select} from "./select";

document.addEventListener('DOMContentLoaded', function() {

  new Select(document.getElementById('test'), {
    items: [
      {
        value: 'Option 1',
        text: 'Option 1',
        // selected: true,
      },
      {
        value: 'Option 2',
        text: 'Option 2',
        // selected: true,
      },
      {
        value: 'Option 3',
        text: 'Option 3',
        // selected: true,
      },
      {
        value: 'Option 4',
        text: 'Option 4',
        // selected: true,
      },
      {
        value: 'Option 5',
        text: 'Option 5',
        // selected: true,
      },
      {
        value: 'Option 6',
        text: 'Option 6',
        // selected: true,
      },
      {
        value: 'Option 7',
        text: 'Option 7',
        // selected: true,
      },
      {
        value: 'Option 8',
        text: 'Option 8',
        // selected: true,
      },
    ]
  });

});
