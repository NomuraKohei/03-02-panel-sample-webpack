const { selection, Text, Color } = require('scenegraph');
const clipboard = require('clipboard');

let panel;

const getText = (selection) => {
  console.log(selection.children);
  selection.items.forEach(item => {
    const node = new Text();
    node.text = item.name;
    node.styleRanges = [{
      length: 3,
      fill: new Color("Purple")
    },
    {
      length: 5,
      fill: new Color("Red")
    },
    {
      length: 2,
      fill: new Color("Blue")
    },
  ];

    node.fontSize = 40;
    
    selection.insertionParent.addChild(node);
    node.moveInParentCoordinates(20, 50);
  })

}

function createStyledTextHandlerFunction(selection) {
  const node = new Text();

  const textData = [                                     // [1]
      {text: "This ", color: "red"},
      {text: "is ",   color: "orange"},
      {text: "some ", color: "yellow"},
      {text: "ra",    color: "green"},
      {text: "in",    color: "blue"},
      {text: "bow ",  color: "indigo"},
      {text: "text",  color: "violet"}
  ];

  node.text = textData.map(item => item.text).join("");   // [2]

  node.styleRanges = textData.map(item => ({              // [3]
      length: item.text.length,
      fill: new Color(item.color)
  }));

  node.fontSize = 24;                                     // [4]

  selection.insertionParent.addChild(node);
  node.moveInParentCoordinates(20, 50);
}

// panelの作成
function create() {
  panel = document.createElement('div');
  panel.setAttribute('id', 'textContainers');

  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

function hide(event) {}

function extractAndAddText(sceneNode) {
  const textContainers = document.querySelector('#textContainers');
  sceneNode.forEach(item => {
    if (item instanceof Text) {
      const textBoxContainer = document.createElement('div');
      const textLabel = document.createElement('div');
      textLabel.innerHTML = `${item.name}`;
      const textForm = document.createElement('form');
      const textInput = document.createElement('textarea');
      const copyButton = document.createElement('button');
      textInput.setAttribute('readonly', 'true');
      textInput.textContent = `${item.text}`;
      copyButton.innerHTML = 'copy';
      textBoxContainer.appendChild(textLabel);
      textForm.appendChild(textInput);
      textForm.appendChild(copyButton);
      textBoxContainer.appendChild(textLabel);
      textBoxContainer.appendChild(textForm);

      copyButton.addEventListener('click', function(e) {
        (function(ev, ti) {
          clipboard.copyText(ti.textContent);
        })(e, textInput);
      });

      textContainers.appendChild(textBoxContainer);
    } else if (item.children) {
      extractAndAddText(item.children);
    }
  });
}

async function update() {
  const textContainers = document.querySelector('#textContainers');
  //console.log(textContainers);

  while (textContainers.firstChild) {
    textContainers.removeChild(textContainers.firstChild);
  }

  if (selection.items.length) {
    extractAndAddText(selection.items);
    //getText();
    //onsole.log(selection.items);
    //console.log(selection.items);
  } else {
    console.log('no item');
    const message = document.createElement('div');
    message.innerHTML = `Select Objects with text`;
    textContainers.appendChild(message);
  }
}

module.exports = {
  panels: {
    example: {
      show,
      hide,
      update,
    },
  },
  commands: {
    consoleCommand: getText,
    rainbowCommand: createStyledTextHandlerFunction
  }
};
