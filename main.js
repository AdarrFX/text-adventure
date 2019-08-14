
let objWindow = document.getElementById("text-adventure-display");
let textInputBox = document.getElementById("text-input");

let gameMap = {
  roomDescription: [["You are in a small thicket of trees. There is a woodcutter's loghouse within the clearing of trees. There is a path to the south.", "You are in a woodland park. You feel pleasent, but otherwise you can't shake the feeling that this was put here for no purpose other than to fill space. There is a path to the north, south, and east.", "You are in a meadow. Aside from the blowing flowers, there is a small clearing indicating a patch of disturbed dirt. There is a path to the north and east."], ["You are in the main chamber of a majestic castle, with stained glass windows and tall stone pillars surrounding you. A princess sits on a throne before you. The only exit is to the south.", "You are at a crossroads. A castle stands to the north, a park to the west, a forest to the south, and a well to the east.", "You are in a thick, majestic forest. To the east is a gloomy looking set of caves, to the west is a large meadow, and to the north is a winding path."], ["You are at a small armory with a gate in the entrance. There is a path to the south.", "You are in a small wooded area with a large well in the center. The well has a bucket and rope attached to a small wheel. There is a path to the north, south, and west.", "You are at the entrance to a large cave. There is a path to the north and west leading away from the caves."]],
  roomInventory: [["shovel", "", ""], ["", "", ""], ["spray", "key", "crystal"]],
  roomPaths: [["s", "nes", "ne"], ["s", "nesw", "wne"], ["s", "nws", "nw"]],
  woodcutterLoghouseUnlocked: false,
  bucketRaised: false,
  meadowDugUp: false,
  armoryGateOpen: false,
  monsterDead: false,
  princessTalkedTo: false,
}

let objectDescriptions = {
  room: [[{
    CABIN: "The cabin door is locked.", DOOR: "The door is locked."
  }, {}, {
    DIRT: "The dirt patch looks strange. It seems like there's something hidden underneath the heavily compacted dirt. It doesn't seem like you can use your hands to dig it up.",
    MEADOW: "The meadow is absolutely lovely."
  }], [{ PRINCESS: "The princess stands before you. She doesn't seem like she's that interested to see you. In fact, you get the impression she just wants you to go away." }, {},
  { TREES: "Yep, those are trees." }], [{ GATE: "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.", ARMORY: "The armory appears to have at least one item in it, a spray bottle." }, { WELL: "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is lowered right now.", WHEEL: "The wheel can be used to raise or lower the bucket.", BUCKET: "The bucket is lowered right now... you can't see it." }, { MONSTER: "She's big, looks like a vastly oversized komodo dragon, and is angry as hell. She also looks pretty hungry. Like, really hungry." }]],
  items: {
    shovel: "A shovel. It looks like it can be used to dig up some dirt.",
    crank: "A crank, the kind that could be used to raise or lower something really heavy. Like a gate.",
    spray: "A sleeping spray that looks like it could really put something big to sleep.",
    key: "A key that looks like it could open a rather simple door.",
    crystal: "A crystal that a someone fancy like a princess might like."
  },
  objectUses: {
    CABIN: function () {
      printOut("You can't 'use' the whole cabin...");
    },
    DOOR: function () {
      if (gameMap.woodcutterLoghouseUnlocked) {
        printOut("The door is already unlocked and open.");
      } else if (gameMap.woodcutterLoghouseUnlocked === false && playerHas("key")) {
        gameMap.woodcutterLoghouseUnlocked = true;
        objectDescriptions.room[0][0].DOOR = "The door is open.";
        objectDescriptions.room[0][0].CABIN = "The cabin door is open. There is a shovel in the corner.";
        printOut("You unlock the door with the key in your inventory.");
      } else {
        printOut("The door is locked.");
      }
    },
    DIRT: function () {
      if (gameMap.meadowDugUp) {
        printOut("You've already dug up this dirt and gotten the crank.");
      } else if (gameMap.meadowDugUp === false && playerHas("shovel")) {
        gameMap.meadowDugUp = true;
        player.inventory.push("crank");
        objectDescriptions.room[0][2].DIRT = "The dirt lies scattered around a small hole where the crank was buried.";
        printOut("You start to dig and before long, you find a strange metal crank buried in the ground, the kind that looks like it could be used to crank open something very large and heavy. You place the crank in your inventory.");
      } else {
        printOut("You can't dig in this with your bare hands.");
      }
    },
    MEADOW: function () {
      printOut("Only a farmer has use for the entire meadow.");
    },
    PRINCESS: function () {
      printOut("This would be an extremely bad idea.");
    },
    TREES: function () {
      printOut("You relieve yourself on the trees.");
    },
    GATE: function () {
      if (playerHas("crank")) {
        if (gameMap.armoryGateOpen) {
          gameMap.armoryGateOpen = false;
          objectDescriptions.room[2][0].GATE = "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.";
          printOut("You lower the armory gate using the crank in your inventory.");
        } else {
          gameMap.armoryGateOpen = true;
          objectDescriptions.room[2][0].GATE = "The gate to the armory is open.";
          printOut("You raise the armory gate using the crank in your inventory.");
        }
      } else {
        printOut("The gate is much too heavy to operate with only your own strength. You'll need to find something to open it with.");
      }
    },
    ARMORY: function () {
      printOut("You have no use for the entire structure.");
    },
    WELL: function () {
      printOut("You're not thirsty.");
    },
    WHEEL: function () {
      if (gameMap.bucketRaised) {
        gameMap.bucketRaised = false;
        objectDescriptions.room[2][1].BUCKET = "The bucket is lowered right now... you can't see it.";
        objectDescriptions.room[2][1].WELL = "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is lowered right now.";
        printOut("You lower the bucket in the well by turning the wheel.");
      } else if (gameMap.bucketRaised === false && playerHas("key") === false) {
        objectDescriptions.room[2][1].BUCKET = "The bucket appears to have a key inside it. How did it get there?";
        objectDescriptions.room[2][1].WELL = "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is raised right now.";
        printOut("You raise the bucket in the well by turning the wheel. There's something shiny in it...");
      } else {
        gameMap.bucketRaised = true;
        objectDescriptions.room[2][1].BUCKET = "The bucket appears to be empty.";
        objectDescriptions.room[2][1].WELL = "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is raised right now.";
        printOut("You raise the bucket in the well by turning the wheel.");
      }
    },
    BUCKET: function () {
      if (gameMap.bucketRaised && playerHas("key") === false) {
        player.inventory.push("key");
        printOut("You look in the bucket. Score! There's a key. You snag it and put it in your inventory.");
        objectDescriptions.room[2][1].BUCKET = "The bucket appears to be empty.";
      } else if (gameMap.bucketRaised && playerHas("key")) {
        printOut("You can't do any more with the bucket.");
      } else {
        printOut("The bucket's down below in the well.");
      }
    },
    MONSTER: function () {
      printOut("She might be attractive, but this invariably will end in disaster. You'd better not.");
    }
  }
}

let player = {
  xPosition: 1,
  yPosition: 2,
  inventory: []
}


function printOut(textToPrint) {
  objWindow.innerHTML += '<p>' + textToPrint + '</p>';
}

function playerHas(objectToTest) {
  return (player.inventory.indexOf(objectToTest) > -1);
}

// Ensure that the direction the player wants to walk is possible
function pathwayCheck(playerX, playerY, desiredDirection) {
  let regexTest = new RegExp(desiredDirection, "g");
  return regexTest.test(gameMap.roomPaths[playerX][playerY])
}

function printRoomDescription() {
  printOut(gameMap.roomDescription[player.xPosition][player.yPosition]);
}

function parseInput(textInput) {
  textInput = textInput.toUpperCase();

  if (textInput.substring(0, 4) === 'WALK') {
    walk(textInput.substring(5, textInput.length));
  }

  if (textInput.substring(0, 4) === 'LOOK') {
    look(textInput.substring(5, textInput.length));
  }

  if (textInput.substring(0, 3) === 'USE') {
    use(textInput.substring(4, textInput.length));
  }

}

function walk(direction) {

  let directionCheck = "";

  switch (direction) {
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
      } else {
        printOut("You can't go that way.");
      }
      break;
  }
}

function look(object) {
  if (object in objectDescriptions.room[player.xPosition][player.yPosition]) {
    printOut(objectDescriptions.room[player.xPosition][player.yPosition][object]);
  } else if (object.toLowerCase() === gameMap.roomInventory[player.xPosition][player.yPosition]) {
    printOut(objectDescriptions.items[object.toLowerCase()]);
  } else {
    printOut("Not sure what you want me to look at.");
  }
}

function use(object) {
  if (object in objectDescriptions.room[player.xPosition][player.yPosition]) {
    console.log("Yep, its here")
    objectDescriptions.objectUses[object]();
  }
}

function handleKeyDownText(event) {

  if (event.code === "Enter") {
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