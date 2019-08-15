
let objWindow = document.getElementById("text-adventure-display");
let textInputBox = document.getElementById("text-input");

let monsterWarningTimer1, monsterWarningTimer2, monsterWarningTimer3, endMonsterTimer;

let gameMap = {
  roomDescription: [["You are in a small thicket of trees. There is a woodcutter's loghouse within the clearing of trees. There is a path to the south.", "You are in a woodland park. You feel pleasent, but otherwise you can't shake the feeling that this was put here for no purpose other than to fill space. There is a path to the north, south, and east.", "You are in a meadow. Aside from the blowing flowers, there is a small clearing indicating a patch of disturbed dirt. There is a path to the north and east."], ["You are in the main chamber of a majestic castle, with stained glass windows and tall stone pillars surrounding you. A princess sits on a throne before you. The only exit is to the south.", "You are at a crossroads. A castle stands to the north, a park to the west, a forest to the south, and a well to the east.", "You are in a thick, majestic forest. To the east is a gloomy looking set of caves, to the west is a large meadow, and to the north is a winding path."], ["You are at a small armory with a gate in the entrance. There is a path to the south.", "You are in a small wooded area with a large well in the center. The well has a bucket and rope attached to a small wheel. There is a path to the north, south, and west.", "You are at the entrance to a large cave. There is a path to the north and west leading away from the caves."]],
  roomInventory: [["", "", ""], ["", "", ""], ["", "", ""]],
  roomPaths: [["s", "nes", "ne"], ["s", "nesw", "wne"], ["s", "nws", "nw"]],
  woodcutterLoghouseUnlocked: false,
  bucketRaised: false,
  meadowDugUp: false,
  armoryGateOpen: false,
  monsterSleep: false,
  princessTalkedTo: false,
}

let objectDescriptions = {
  room: [[{
    CABIN: "The cabin door is locked.", DOOR: "The door is locked."
  }, {}, {
    DIRT: "The dirt patch looks strange. It seems like there's something hidden underneath the heavily compacted dirt. It doesn't seem like you can use your hands to dig it up.",
    MEADOW: "The meadow is absolutely lovely."
  }], [{ PRINCESS: "The princess stands before you. She doesn't seem like she's that interested to see you. In fact, you get the impression she just wants you to go away." }, {},
  { TREES: "Yep, those are trees." }], [{ GATE: "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.", ARMORY: "The armory appears to have at least something of use in it, but from here, you can't tell what." }, { WELL: "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is lowered right now.", WHEEL: "The wheel can be used to raise or lower the bucket.", BUCKET: "The bucket is lowered right now... you can't see it." }, { MONSTER: "She's big, looks like a vastly oversized komodo dragon, and is angry as hell. She also looks pretty hungry. Like, really hungry." }]],
  items: {
    shovel: "A shovel. It looks like it can be used to dig up some dirt.",
    crank: "A crank, the kind that could be used to raise or lower something really heavy. Like a gate.",
    spray: "A sleeping spray that looks like it could really put something big to sleep.",
    key: "A key that looks like it could open a rather simple door.",
    crystal: "A crystal that a someone fancy like a princess might like."
  },
  itemUses: {
    shovel: function() {
      if(player.xPosition === 0 && player.yPosition === 2 && gameMap.meadowDugUp === false) {
        gameMap.meadowDugUp = true;
        player.inventory.push("crank");
        objectDescriptions.room[0][2].DIRT = "The dirt lies scattered around a small hole where the crank was buried.";
        printOut("You start to dig with the shovel in your inventory and before long, you find a strange metal crank buried in the ground, the kind that looks like it could be used to crank open something very large and heavy. You place the crank in your inventory.");
      } else {
        printOut("You see no practical place to use a shovel here.")
      }
    },
    spray: function() {
      if(player.xPosition === 2 && player.yPosition === 2 && gameMap.monsterSleep === false) {
        gameMap.monsterSleep = true;
        gameMap.roomInventory[2][2] = "crystal";
        objectDescriptions.room[2][2].MONSTER = "The fearsome beast is now sleeping peacefully. She gives a snort every now and then. A small crystal is lying beside her.";
        printOut("Acting fast, you quickly spray the monster with the sleeping spray. She stops, sniffs curiously, then teeters about, finally falling down, sound asleep. The crash makes a crystal tumble down, landing beside her.");
      } else if (player.xPosition === 1 && player.yPosition === 0) {
        printOut("You whip out the spray, blasting the princess in the face with the sleeping spray. She sneezes, then loses conciousness, collapsing onto the glass table beside her throne, which promptly smashes as she falls through it. The guards rush in and seize you, throwing you into the dungeon. Needless to say, when the princess wakes up, she won't be happy. Game over!");
        endGame();
      } else {
        printOut("You don't see any practical use for the spray here.")
      }
    },
    key: function() {
      if(player.xPosition === 0 && player.yPosition === 0 && gameMap.woodcutterLoghouseUnlocked === false){
        gameMap.woodcutterLoghouseUnlocked = true;
        gameMap.roomInventory[0][0] = "shovel";
        objectDescriptions.room[0][0].DOOR = "The door is open.";
        objectDescriptions.room[0][0].CABIN = "The cabin door is open. There is a shovel in the corner.";
        printOut("You unlock the door with the key in your inventory.");
      } else {
        printOut("You don't see any use for this key here.");
      }
    },
    crystal: function() {
      if(player.xPosition === 1 && player.yPosition === 0) {
        printOut("You hand the crystal to the princess, who shrugs and throws it into a bin behind her, also full of crystals. She tosses you a bag of gold, a salary to cover your expenses for the next 30 years. Not a bad haul, all in all. You won!");
        endGame();
      }
    },
    crank: function() {
      if(player.xPosition === 2 && player.yPosition === 0) {
        if (playerHas("crank")) {
          if (gameMap.armoryGateOpen && playerHas("spray")) {
            gameMap.armoryGateOpen = false;
            objectDescriptions.room[2][0].GATE = "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.";
            objectDescriptions.room[2][0].ARMORY = "The armory appears to no longer have anything of interest in it.";
            printOut("You lower the armory gate using the crank in your inventory.");
          } else if (gameMap.armoryGateOpen && playerHas("spray") === false){
            gameMap.armoryGateOpen = false;
            gameMap.roomInventory[2][0] = "";
            objectDescriptions.room[2][0].GATE = "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.";
            objectDescriptions.room[2][0].ARMORY = "The armory appears to have at least something of use in it, but from here, you can't tell what.";
            printOut("You lower the armory gate using the crank in your inventory.");
          } else if (gameMap.armoryGateOpen === false && playerHas("spray") === false){
            gameMap.armoryGateOpen = true;
            gameMap.roomInventory[2][0] = "spray";
            objectDescriptions.room[2][0].GATE = "The gate to the armory is open.";
            objectDescriptions.room[2][0].ARMORY = "The armory appears to have a spray bottle inside.";
            printOut("You raise the armory gate using the crank in your inventory.");
          } else if (gameMap.armoryGateOpen === false && playerHas("spray")){
            gameMap.armoryGateOpen = true;
            objectDescriptions.room[2][0].GATE = "The gate to the armory is open.";
            objectDescriptions.room[2][0].ARMORY = "The armory appears to no longer have anything of interest in it.";
            printOut("You raise the armory gate using the crank in your inventory.");
          } 
        }
      }
    }
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
        gameMap.roomInventory[0][0] = "shovel";
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
        printOut("You start to dig with the shovel in your inventory and before long, you find a strange metal crank buried in the ground, the kind that looks like it could be used to crank open something very large and heavy. You place the crank in your inventory.");
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
        if (gameMap.armoryGateOpen && playerHas("spray")) {
          gameMap.armoryGateOpen = false;
          objectDescriptions.room[2][0].GATE = "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.";
          objectDescriptions.room[2][0].ARMORY = "The armory appears to no longer have anything of interest in it.";
          printOut("You lower the armory gate using the crank in your inventory.");
        } else if (gameMap.armoryGateOpen && playerHas("spray") === false){
          gameMap.armoryGateOpen = false;
          gameMap.roomInventory[2][0] = "";
          objectDescriptions.room[2][0].GATE = "The gate to the armory is down. There's a slot where it looks like a crank can be used to open it.";
          objectDescriptions.room[2][0].ARMORY = "The armory appears to have at least something of use in it, but from here, you can't tell what.";
          printOut("You lower the armory gate using the crank in your inventory.");
        } else if (gameMap.armoryGateOpen === false && playerHas("spray") === false){
          gameMap.armoryGateOpen = true;
          gameMap.roomInventory[2][0] = "spray";
          objectDescriptions.room[2][0].GATE = "The gate to the armory is open.";
          objectDescriptions.room[2][0].ARMORY = "The armory appears to have a spray bottle inside.";
          printOut("You raise the armory gate using the crank in your inventory.");
        } else if (gameMap.armoryGateOpen === false && playerHas("spray")){
          gameMap.armoryGateOpen = true;
          objectDescriptions.room[2][0].GATE = "The gate to the armory is open.";
          objectDescriptions.room[2][0].ARMORY = "The armory appears to no longer have anything of interest in it.";
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
        gameMap.roomInventory[2][1] = "";
        printOut("You lower the bucket in the well by turning the wheel.");
      } else if (gameMap.bucketRaised === false && playerHas("key") === false) {
        gameMap.bucketRaised = true;
        objectDescriptions.room[2][1].BUCKET = "The bucket appears to have a key inside it. How did it get there?";
        objectDescriptions.room[2][1].WELL = "There seems to be a deep well. There's a wheel attached to a bucket and rope that looks like it can be used to lower or raise the bucket. The bucket is raised right now.";
        gameMap.roomInventory[2][1] = "key";
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
  },
  onItemPickup: {
    shovel: function() {
      objectDescriptions.room[0][0].CABIN = "The cabin door is open. There is nothing else of interest to you.";
    },
    spray: function() {
      objectDescriptions.room[2][0].ARMORY = "The armory appears to no longer have anything of interest in it. You don't need any swords, after all.";
    },
    key: function() {
      objectDescriptions.room[2][1].BUCKET = "The bucket appears to be empty.";
    },
    crystal: function() {
      objectDescriptions.room[2][2].MONSTER = "The fearsome beast is now sleeping peacefully. She gives a snort every now and then.";
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
  objWindow.scrollTop = objWindow.scrollHeight;

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

   else if (textInput.substring(0, 4) === 'LOOK') {
    look(textInput.substring(5, textInput.length));
  }

  else if (textInput.substring(0, 3) === 'USE') {
    use(textInput.substring(4, textInput.length));
  }

  else if (textInput.substring(0, 4) === 'TAKE') {
    take(textInput.substring(5, textInput.length));
  }

  else if (textInput.substring(0, 4) === 'TALK'){
    talk(textInput.substring(5, textInput.length));
  }

  else {
    printOut("I don't understand.");
  }

}

function walk(direction) {

  let directionCheck = "";
  let originalLocation = [player.xPosition, player.yPosition];

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

      default:
        printOut("That's not a valid direction.");
  }
  triggerMonsterTimerCheck();
}

function look(object) {
  if (object in objectDescriptions.room[player.xPosition][player.yPosition]) {
    printOut(objectDescriptions.room[player.xPosition][player.yPosition][object]);
  } else if (object.toLowerCase() === gameMap.roomInventory[player.xPosition][player.yPosition]) {
    printOut(objectDescriptions.items[object.toLowerCase()]);
  } else if (object === "AROUND"){
    printOut(gameMap.roomDescription[player.xPosition][player.yPosition]);
  } else {
    printOut("Not sure what you want me to look at.");
  }
}

function use(object) {
  if (object in objectDescriptions.room[player.xPosition][player.yPosition]) {
    objectDescriptions.objectUses[object]();
  } else if (playerHas(object.toLowerCase())) {
    objectDescriptions.itemUses[object.toLowerCase()]();
  } else {
    printOut("You can't use that.");
  }
}

function take(object) {
  let item = object.toLowerCase();
  if (gameMap.roomInventory[player.xPosition][player.yPosition].indexOf(item) > -1 && object !== "") {
    let itemToTake = gameMap.roomInventory[player.xPosition][player.yPosition];
    player.inventory.push(itemToTake);
    gameMap.roomInventory[player.xPosition][player.yPosition] = "";
    objectDescriptions.onItemPickup[object.toLowerCase()]();
    printOut(`You take the ${itemToTake} and place it in your inventory.`);
  } else {
    printOut("You can't pick that up.");
  }
}

function talk(object) {
  if (player.xPosition === 1 && player.yPosition === 0 && gameMap.princessTalkedTo === false && object === "PRINCESS"){
    printOut("The princess groans, looking at you. 'Great, another adventurer. Listen, if you want to make yourself useful, go and like, defeat this big ugly monster that lives in a cave not far from here... it's got some sort of crystal that's like, really powerful? And would let me rule the kingdom, or something? Like, is that too much for you to understand? Can you like, go away now?' She sighs and returns to playing with her tablet. Like, a stone tablet, not an electronic one.");
    gameMap.princessTalkedTo = true;
  } else if (player.xPosition === 1 && player.yPosition === 0 && gameMap.princessTalkedTo && object === "PRINCESS"){
    printOut("The princess ignores you, having already talked to you. You should probably get outta there.");
  } else if (player.xPosition === 2 && player.yPosition === 2 && object === "MONSTER") {
    printOut("She's not in the mood. Talking here won't sort out any relationship problems.");
  } else {
    printOut("You vaguely mumble some nonsense to yourself, since there's no one here like that to talk to.");
  }
}

function triggerMonsterTimerCheck() {
  window.clearTimeout(monsterWarningTimer1);
  window.clearTimeout(monsterWarningTimer2);
  window.clearTimeout(monsterWarningTimer3);
  window.clearTimeout(endMonsterTimer);

  if (player.xPosition === 2 && player.xPosition === 2 && gameMap.monsterSleep === false){
    monsterWarningTimer1 = setTimeout(() => {
      if (playerIsStillInCave()) {
        printOut("You see a large monster raise her head from the cave and look towards you.");
      }
    }, 1000);
    monsterWarningTimer2 = setTimeout(() => {
      if (playerIsStillInCave()) {
        printOut("The monster begins to walk towards you, lumbering along.");
      }
    }, 7000);
    monsterWarningTimer3 = setTimeout(() => {
      if (playerIsStillInCave()) {
        printOut("The monster is almost upon you!");
      }
    }, 13000);
    endMonsterTimer = setTimeout(() => {
      if (playerIsStillInCave()) {
        printOut("With a swift grab, the monster snatches you up in her jaws, tossing her head back and swallowing you whole. Looks like you didn't act fast enough! Game over.");
        endGame();
      }
    }, 16000);
  }

}

function playerIsStillInCave() {
  return (player.xPosition === 2 && player.yPosition === 2 && gameMap.monsterSleep === false);
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

function endGame() {
  printOut("Refresh to begin a new game.");
  textInputBox.disabled = true;
}

printRoomDescription();