let overlayScale = 1;

/* ESCONDE MENU DOS PLAYERS */
OBR.onReady(() => {
  if (!OBR.player.isGM()) {
    document.getElementById("menu").style.display = "none";
  }

  const slider = document.getElementById("overlaySize");
  slider.oninput = () => {
    overlayScale = slider.value / 100;
  };
});

/* ADICIONAR HP AO TOKEN */
document.getElementById("addHp").onclick = async () => {
  const selection = await OBR.player.getSelection();
  if (!selection.length) return;

  const token = selection[0];

  token.metadata.hp = {
    current: 10,
    max: Number(document.getElementById("maxHp").value),
    min: Number(document.getElementById("minHp").value),
    overlaySize: overlayScale
  };

  await OBR.scene.items.updateItems([token]);
};

/* DESENHAR HP */
function drawHP(token) {
  if (!token.metadata.hp) return;

  const hp = token.metadata.hp;
  const pct = hp.current / hp.max;
  const scale = hp.overlaySize ?? overlayScale;

  const box = document.createElement("div");
  box.className = "hp-box";

  const frame = document.createElement("img");
  frame.src = "assets/hp_frame.png";
  frame.className = "hp-frame";

  const bar = document.createElement("div");
  bar.className = "hp-bar";
  bar.style.width = `${pct * 52}px`;

  box.append(frame, bar);

  if (hp.current <= hp.max / 2 && hp.current > 0) {
    const ferido = document.createElement("img");
    ferido.src = "assets/ferido.png";
    ferido.className = "status";
    ferido.style.transform = `scale(${scale})`;
    box.appendChild(ferido);
  }

  if (hp.current === 0) {
    const morrendo = document.createElement("img");
    morrendo.src = "assets/morrendo.png";
    morrendo.className = "status";
    morrendo.style.transform = `scale(${scale})`;
    box.appendChild(morrendo);
  }

  document.getElementById("overlay").appendChild(box);
}

/* EFEITO DE DANO */
function hitFX(el) {
  el.classList.add("hit");
  setTimeout(() => el.classList.remove("hit"), 300);
}

/* EFEITO DE CURA */
function healFX(el) {
  el.classList.add("greenFlash");

  const heal = document.createElement("img");
  heal.src = "assets/heal.png";
  heal.className = "heal";
  heal.style.transform = `scale(${overlayScale})`;

  el.appendChild(heal);

  setTimeout(() => {
    el.classList.remove("greenFlash");
    heal.remove();
  }, 1000);
}
