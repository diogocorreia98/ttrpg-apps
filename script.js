const combatToggle = document.getElementById('combatToggle');
const startTurnBtn = document.getElementById('startTurn');
const endTurnBtn = document.getElementById('endTurn');
const attackBtn = document.getElementById('attackAction');
const utilizeBtn = document.getElementById('utilizeAction');
const freeInteractBtn = document.getElementById('freeInteract');
const attackSection = document.getElementById('attackSection');
const attackLeftBtn = document.getElementById('attackLeft');
const attackRightBtn = document.getElementById('attackRight');
const actionCountSpan = document.getElementById('actionCount');
const interactionCountSpan = document.getElementById('interactionCount');
const leftHandInput = document.getElementById('leftHand');
const rightHandInput = document.getElementById('rightHand');
const editLeftBtn = document.getElementById('editLeft');
const editRightBtn = document.getElementById('editRight');
const mirrorBtn = document.getElementById('mirrorHand');
const equipChooser = document.getElementById('equipChooser');
const equipPrompt = document.getElementById('equipPrompt');
const equipOptionsDiv = document.getElementById('equipOptions');
const equipCancel = document.getElementById('equipCancel');

let currentHand = null;
const equipmentChoices = [
    'lighting source',
    'shield',
    'spellcasting focus',
    'two-handed weapon',
    'one-handed weapon',
    'another item',
    'empty'
];

let actions = 0;
let freeInteraction = 0;
let inCombat = false;

combatToggle.addEventListener('change', () => {
    inCombat = combatToggle.checked;
    startTurnBtn.disabled = !inCombat;
    endTurnBtn.disabled = !inCombat;
});

startTurnBtn.addEventListener('click', () => {
    actions = 1;
    freeInteraction = 1;
    updateCounts();
    startTurnBtn.disabled = true;
    checkHands();
});

endTurnBtn.addEventListener('click', () => {
    actions = 0;
    freeInteraction = 0;
    updateCounts();
    startTurnBtn.disabled = !inCombat;
    attackBtn.disabled = true;
    utilizeBtn.disabled = true;
    freeInteractBtn.disabled = true;
    checkHands();
});

function updateCounts() {
    actionCountSpan.textContent = actions;
    interactionCountSpan.textContent = freeInteraction;
    attackBtn.disabled = actions === 0;
    utilizeBtn.disabled = actions === 0;
    freeInteractBtn.disabled = freeInteraction === 0;
}

function checkHands() {
    const leftEmpty = leftHandInput.value === '';
    const rightEmpty = rightHandInput.value === '';
    mirrorBtn.style.display = (leftEmpty !== rightEmpty) ? 'inline-block' : 'none';
}

function editHand(handId) {
    currentHand = handId;
    equipPrompt.textContent = `Choose equipment for your ${handId.replace('Hand', '')} hand:`;
    equipOptionsDiv.innerHTML = '';
    equipmentChoices.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => applyEquipment(opt));
        equipOptionsDiv.appendChild(btn);
    });
    equipChooser.style.display = 'block';
}

function applyEquipment(choice) {
    if (!currentHand) return;
    const hand = document.getElementById(currentHand);
    const current = hand.value || 'empty';
    const newItem = choice === 'empty' ? '' : choice;
    const wasShield = current === 'shield';
    const isShield = newItem === 'shield';
    if (wasShield !== isShield) {
        if (actions > 0) {
            actions -= 1;
            updateCounts();
        } else {
            alert('No actions left to equip or unequip a shield.');
            return;
        }
    }
    hand.value = newItem;
    equipChooser.style.display = 'none';
    currentHand = null;
    checkHands();
}

attackBtn.addEventListener('click', () => {
    if (actions > 0) {
        actions -= 1;
        updateCounts();
        attackSection.style.display = 'block';
    }
});

function handleAttack(handInput) {
    const hand = document.getElementById(handInput);
    const current = hand.value || 'empty';
    const equip = prompt(`You attacked with your ${handInput.replace('Hand', '')} hand holding '${current}'.\nWould you like to change what's equipped? If yes, type the new item. Leave blank to keep the same.`);
    if (equip !== null && equip !== '') {
        hand.value = equip;
        checkHands();
    }
    const more = confirm('Do you have more attacks?');
    if (!more) {
        attackSection.style.display = 'none';
    }
}

attackLeftBtn.addEventListener('click', () => handleAttack('leftHand'));
attackRightBtn.addEventListener('click', () => handleAttack('rightHand'));

utilizeBtn.addEventListener('click', () => {
    if (actions > 0) {
        actions -= 1;
        updateCounts();
        alert('Utilize Action used for object interaction or weapon management.');
    }
});

freeInteractBtn.addEventListener('click', () => {
    if (freeInteraction > 0) {
        freeInteraction -= 1;
        updateCounts();
        alert('Free Interaction used.');
    }
});

editLeftBtn.addEventListener('click', () => editHand('leftHand'));
editRightBtn.addEventListener('click', () => editHand('rightHand'));

equipCancel.addEventListener('click', () => {
    equipChooser.style.display = 'none';
    currentHand = null;
});

mirrorBtn.addEventListener('click', () => {
    if (leftHandInput.value && !rightHandInput.value) {
        rightHandInput.value = leftHandInput.value;
    } else if (rightHandInput.value && !leftHandInput.value) {
        leftHandInput.value = rightHandInput.value;
    }
    checkHands();
});

checkHands();
