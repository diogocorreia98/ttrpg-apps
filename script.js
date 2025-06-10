const combatToggle = document.getElementById('combatToggle');
const newTurnBtn = document.getElementById('newTurn');
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
const equipmentPopup = document.getElementById('equipmentPopup');
const equipmentOptions = document.getElementById('equipmentOptions');
const cancelPopup = document.getElementById('cancelPopup');

function getHandValue(el) {
    return el.textContent === 'empty' ? '' : el.textContent;
}

function setHandValue(el, value) {
    el.textContent = value || 'empty';
}

function isMirroredPair(a, b) {
    return a && b && (a === `same ${b}` || b === `same ${a}`);
}

const optionList = [
    'item',
    'environment',
    'weapon',
    'shield',
    'empty'
];

let editTarget = null;

optionList.forEach(opt => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.dataset.value = opt;
    equipmentOptions.appendChild(li);
});

let actions = 0;
let freeInteraction = 0;
let inCombat = false;

function updateEquipButtons() {
    const states = [
        {input: leftHandInput, btn: editLeftBtn},
        {input: rightHandInput, btn: editRightBtn}
    ];
    states.forEach(({input, btn}) => {
        if (inCombat && getHandValue(input)) {
            btn.textContent = 'Unequip';
        } else {
            btn.textContent = 'Equip';
        }
    });
}

combatToggle.addEventListener('change', () => {
    inCombat = combatToggle.checked;
    newTurnBtn.disabled = !inCombat;
    if (!inCombat) {
        endTurn();
        attackSection.style.display = 'none';
    }
    updateEquipButtons();
    checkHands();
});

function startTurn() {
    actions = 1;
    freeInteraction = 1;
    updateCounts();
    checkHands();
}

function endTurn() {
    actions = 0;
    freeInteraction = 0;
    updateCounts();
    attackBtn.disabled = true;
    utilizeBtn.disabled = true;
    freeInteractBtn.disabled = true;
    checkHands();
}

// Start a new turn regardless of remaining resources
newTurnBtn.addEventListener('click', () => {
    endTurn();
    startTurn();
});

function updateCounts() {
    actionCountSpan.textContent = actions;
    interactionCountSpan.textContent = freeInteraction;
    attackBtn.disabled = actions === 0;
    utilizeBtn.disabled = actions === 0;
    freeInteractBtn.disabled = freeInteraction === 0;
}

function checkHands() {
    const leftEmpty = getHandValue(leftHandInput) === '';
    const rightEmpty = getHandValue(rightHandInput) === '';
    mirrorBtn.style.display = (leftEmpty !== rightEmpty) ? 'inline-block' : 'none';
    updateEquipButtons();
}

function editHand(handId) {
    editTarget = document.getElementById(handId);
    document.getElementById('popupPrompt').textContent = `Choose equipment for your ${handId.replace('Hand', '')} hand:`;
    equipmentPopup.style.display = 'block';
}

function handleEquipButton(handId) {
    const input = document.getElementById(handId);
    const current = getHandValue(input);
    if (inCombat && current) {
        if (current === 'shield') {
            if (actions > 0) {
                actions -= 1;
                updateCounts();
            } else {
                alert('No actions left to unequip a shield.');
                return;
            }
        }
        const otherInput = handId === 'leftHand' ? rightHandInput : leftHandInput;
        const otherVal = getHandValue(otherInput);
        if (isMirroredPair(current, otherVal)) {
            setHandValue(otherInput, '');
        }
        setHandValue(input, '');
        checkHands();
    } else {
        editHand(handId);
    }
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
    const current = getHandValue(hand) || 'empty';
    const equip = prompt(`You attacked with your ${handInput.replace('Hand', '')} hand holding '${current}'.\nWould you like to change what's equipped? If yes, type the new item. Leave blank to keep the same.`);
    if (equip !== null && equip !== '') {
        setHandValue(hand, equip);
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

equipmentOptions.addEventListener('click', (e) => {
    if (!editTarget) return;
    const li = e.target.closest('li');
    if (!li) return;
    const choice = li.dataset.value;
    const current = getHandValue(editTarget) || 'empty';
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
    const otherInput = editTarget.id === 'leftHand' ? rightHandInput : leftHandInput;
    const otherVal = getHandValue(otherInput);
    if (newItem === '' && isMirroredPair(current, otherVal)) {
        setHandValue(otherInput, '');
    }
    setHandValue(editTarget, newItem);
    equipmentPopup.style.display = 'none';
    editTarget = null;
    checkHands();
});

cancelPopup.addEventListener('click', () => {
    equipmentPopup.style.display = 'none';
    editTarget = null;
});

editLeftBtn.addEventListener('click', () => handleEquipButton('leftHand'));
editRightBtn.addEventListener('click', () => handleEquipButton('rightHand'));

mirrorBtn.addEventListener('click', () => {
    const leftVal = getHandValue(leftHandInput);
    const rightVal = getHandValue(rightHandInput);
    if (leftVal && !rightVal) {
        setHandValue(rightHandInput, `same ${leftVal}`);
    } else if (rightVal && !leftVal) {
        setHandValue(leftHandInput, `same ${rightVal}`);
    }
    checkHands();
});

checkHands();
