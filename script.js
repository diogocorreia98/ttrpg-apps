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

let actions = 0;
let freeInteraction = 0;
let inCombat = false;

combatToggle.addEventListener('change', () => {
    inCombat = combatToggle.checked;
    startTurnBtn.disabled = !inCombat;
    endTurnBtn.disabled = !inCombat;
    leftHandInput.disabled = inCombat;
    rightHandInput.disabled = inCombat;

    if (!inCombat) {
        actions = 0;
        freeInteraction = 0;
        updateCounts();
        attackSection.style.display = 'none';
    }
});

startTurnBtn.addEventListener('click', () => {
    actions = 1;
    freeInteraction = 1;
    updateCounts();
    startTurnBtn.disabled = true;
});

endTurnBtn.addEventListener('click', () => {
    actions = 0;
    freeInteraction = 0;
    updateCounts();
    startTurnBtn.disabled = !inCombat;
    attackBtn.disabled = true;
    utilizeBtn.disabled = true;
    freeInteractBtn.disabled = true;
    attackSection.style.display = 'none';
});

function updateCounts() {
    actionCountSpan.textContent = actions;
    interactionCountSpan.textContent = freeInteraction;
    attackBtn.disabled = actions === 0;
    utilizeBtn.disabled = actions === 0;
    freeInteractBtn.disabled = freeInteraction === 0;
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
        const choice = prompt(
            'Describe your utilize action.\n' +
            "Type 'L <item>' or 'R <item>' to change a hand's equipment, or describe your interaction." 
        );
        if (choice) {
            const trimmed = choice.trim();
            if (trimmed.toLowerCase().startsWith('l ')) {
                leftHandInput.value = trimmed.slice(2);
            } else if (trimmed.toLowerCase().startsWith('r ')) {
                rightHandInput.value = trimmed.slice(2);
            } else {
                alert(`Interaction noted: ${trimmed}`);
            }
        }
    }
});

freeInteractBtn.addEventListener('click', () => {
    if (freeInteraction > 0) {
        freeInteraction -= 1;
        updateCounts();
        alert('Free Interaction used.');
    }
});
