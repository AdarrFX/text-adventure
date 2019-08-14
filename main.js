
let objWindow = document.getElementById("text-adventure-display");
let textInputBox = document.getElementById("text-input");

let gameMap = {
    roomDescription: [["You are in a small thicket of trees. There is a woodcutter's loghouse within the clearing of trees. There is a path to the south.", "You are in a woodland park. You feel pleasent, but otherwise you can't shake the feeling that this was put here for no purpose other than to fill space. There is a path to the north, south, and east.", "You are in a meadow. Aside from the blowing flowers, there is a small clearing indicating a patch of disturbed dirt. There is a path to the north and east."],["You are in the main chamber of a majestic castle, with stained glass windows and tall stone pillars surrounding you. A princess sits on a throne before you. The only exit is to the south.", "You are at a crossroads. A castle stands to the north, a park to the west, a forest to the south, and a well to the east.", "You are in a thick, majestic forest. To the east is a gloomy looking set of caves, to the west is a large meadow, and to the north is a winding path."],["You are at a small armory with a gate in the entrance. There is a path to the south.", "You are in a small wooded area with a large well in the center. The well has a bucket and rope attached to a small wheel. There is a path to the north, south, and west.", "You are at the entrance to a large cave. There is a path to the north and west leading away from the caves."]],
    roomInventory: [["shovel","","crank"],["","",""],["sword","key","crystal"]],
    roomPaths: [["s", "nes", "ne"],["s","nesw","wne"],["s","nws","nw"]],
    woodcutterLoghouseUnlocked: false,
    bucketRaised: false,
    meadowDugUp: false,
    armoryGateOpen: false,
    monsterDead: false,
    princessTalkedTo: false,
  }

  let objectDescriptions = {
    room: [[ {
      CABIN: "The cabin door is locked."
    }, {}, {DIRT: "The dirt patch looks strange. It seems like there's something hidden underneath the heavily compacted dirt. It doesn't seem like you can use your hands to dig it up.",
            MEADOW: "The meadow is absolutely lovely."}],
             [{PRINCESS: "The princess stands before you. She doesn't seem like she's that interested to see you. In fact, you get the impression she just wants you to go away."}, {},
              {TREES: "Yep, those are trees."}], [{GATE: "The gate to the armory is locked. There's a slot where it looks like a crank can be used to open it.", ARMORY: "The armory appears to have at least one weapon in it, a sword."}, {WELL: "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket.", WHEEL: "The wheel can be used to raise or lower the bucket."}, {MONSTER: "It's big, looks like a vastly oversized komodo dragon, and is angry as hell. It also looks pretty hungry. Like, really hungry."}]],
    items: {
      shovel: "A shovel. It looks like it can be used to dig up some dirt.",
      crank: "A crank, the kind that could be used to raise or lower something really heavy. Like a gate.",
      sword: "A sharp sword that looks like it could really do some damage.",
      key: "A key that looks like it could open a rather simple door.",
      crystal: "A crystal that a someone fancy like a princess might like."
    }
  }
  
let player = {
    xPosition: 1,
    yPosition: 2,
    inventory: []
  }


function printOut(textToPrint){
  objWindow.innerHTML += '<p>' + textToPrint + '</p>';
}

// Ensure that the direction the player wants to walk is possible
function pathwayCheck(playerX, playerY, desiredDirection) {
  let regexTest = new RegExp(desiredDirection, "g");
  return regexTest.test(gameMap.roomPaths[playerX][playerY])
}

function printRoomDescription() {
  printOut(gameMap.roomDescription[player.xPosition][player.yPosition]);
}

function parseInput(textInput){
  textInput = textInput.toUpperCase();

  if(textInput.substring(0,4) === 'WALK'){
    walk(textInput.substring(5,textInput.length));
  }

  if(textInput.substring(0,4) === 'LOOK'){
    look(textInput.substring(5,textInput.length));
  }
  
}

function walk(direction) {

  let directionCheck = "";

  switch(direction){
    case 'WEST':
      directionCheck = "w";
      if (pathwayCheck(player.xPosition, player.yPosition, directionCheck)) {
        player.xPosition -= 1;
        printOut("You walk to the west.");
        printRoomDescription();
      } else {
        printOut("You can't go that way.");
      }
    break;

    case 'EAST':
      directionCheck = "e";
      if (pathwayCheck(player.xPosition, player.yPosition, directionCheck)) {
        player.xPosition += 1;
        printOut("You walk to the east.");
        printRoomDescription();
      } else {
        printOut("You can't go that way.");
      }
    break;

    case 'NORTH':
      directionCheck = "n";
        if (pathwayCheck(player.xPosition, player.yPosition, directionCheck)) {
          player.yPosition -= 1;
          printOut("You walk to the north.");
          printRoomDescription();
        } else {
          printOut("You can't go that way.");
        }
    break;

    case 'SOUTH':
      directionCheck = "s";
        if (pathwayCheck(player.xPosition, player.yPosition, directionCheck)) {
          player.yPosition += 1;
          printOut("You walk to the south.");
          printRoomDescription();
        } else{
          printOut("You can't go that way.");
        }
    break;
  }
}

function look(object) {
  if(object in objectDescriptions.room[player.xPosition][player.yPosition]) {
    printOut(objectDescriptions.room[player.xPosition][player.yPosition][object]);
  } else {
    if(object.toLowerCase() === gameMap.roomInventory[player.xPosition][player.yPosition])
  }
}

function handleKeyDownText(event){

  if(event.code === "Enter"){
    event.preventDefault();

    let inputtedText = textInputBox.value;
    inputtedText = inputtedText.toUpperCase();
    objWindow.innerHTML += '<p>' + inputtedText + '</p>';
    textInputBox.value = "";
    parseInput(inputtedText);
    objWindow.scrollTop = objWindow.scrollHeight;

  }
}

printRoomDescription();