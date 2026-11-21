export const sceneSize = [400, 270];

export const scenes = {
  office: {
    titles: ["Rysunek Frani", "Rysunek Fistaszka"],
    places: [
      ["moon", 188, 65],
      ["clock", 67, 52, "Wskazówka zegara pokazuje inną godzinę."],
      ["lamp", 325, 85, "Klosz lampy zmienił kolor."],
      ["books", 63, 178],
      ["key", 185, 207, "Klucz leży w drugą stronę."],
      ["mug", 292, 194, "Na kubku pojawiła się gwiazdka."],
      ["plant", 350, 169],
    ],
  },
  port: {
    titles: ["Kartka z rana", "Kartka z południa"],
    places: [
      ["sun", 63, 53],
      ["cloud", 287, 45, "Chmura ma o jedną wypukłość więcej."],
      ["sail", 188, 127, "Żagiel zmienił kolor."],
      ["bird", 109, 104],
      ["buoy", 322, 165, "Na boi pojawił się dodatkowy pasek."],
      ["box", 59, 208, "Wieko skrzyni jest otwarte."],
      ["fish", 220, 214, "Ryba płynie w przeciwnym kierunku."],
    ],
  },
  roof: {
    titles: ["Widok z lornetki", "Widok z aparatu"],
    places: [
      ["moon", 308, 53, "Księżyc odwrócił się w drugą stronę."],
      ["star", 69, 59, "Zamiast jednej gwiazdy są dwie małe."],
      ["cloud", 168, 48],
      ["window", 66, 155, "W dodatkowej szybie pali się światło."],
      ["bird", 180, 118, "Na antenie jest jeszcze jeden ptak."],
      ["plant", 340, 170, "W doniczce zakwitł kwiat."],
      ["mug", 107, 223],
      ["key", 274, 224],
      ["chimney", 203, 210, "Na kominie jest o jeden rząd cegieł więcej."],
    ],
  },
};

const ink = "#392541";
const gold = "#ffcb66";
const coral = "#dc705f";
const teal = "#5caa9b";
const cream = "#fff1cc";

const descriptions = {
  moon: ["sierp otwarty w prawo", "sierp otwarty w lewo"],
  clock: ["zegar wskazuje trzecią", "zegar wskazuje szóstą"],
  lamp: ["lampa z zielonym kloszem", "lampa z czerwonym kloszem"],
  books: ["stos książek"],
  key: ["klucz skierowany w prawo", "klucz skierowany w lewo"],
  mug: ["gładki kubek", "kubek z gwiazdką"],
  plant: ["doniczka z liśćmi", "doniczka z kwiatem"],
  sun: ["słońce"],
  cloud: ["chmura z trzema wypukłościami", "chmura z czterema wypukłościami"],
  sail: ["łódka z czerwonym żaglem", "łódka z zielonym żaglem"],
  bird: ["jeden ptak", "dwa ptaki"],
  buoy: ["boja z jednym paskiem", "boja z dwoma paskami"],
  box: ["zamknięta skrzynia", "otwarta skrzynia"],
  fish: ["ryba płynąca w prawo", "ryba płynąca w lewo"],
  star: ["jedna gwiazda", "dwie gwiazdy"],
  window: ["w oknie świeci jedna szyba", "w oknie świecą dwie szyby"],
  chimney: ["komin z dwoma rzędami cegieł", "komin z trzema rzędami cegieł"],
};

export function sceneDescription(place, variant) {
  return descriptions[place[0]][variant && place[3] ? 1 : 0];
}

export function drawScene(canvas, id, variant) {
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  context.lineWidth = 2.6;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = ink;

  function rect(x, y, w, h, fill, stroke = true, radius = 0) {
    context.beginPath();
    context.roundRect(x, y, w, h, radius);
    paint(fill, stroke);
  }
  function oval(x, y, rx, ry, fill, stroke = true) {
    context.beginPath();
    context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    paint(fill, stroke);
  }
  function line(points, fill) {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    if (fill) context.closePath();
    paint(fill, true);
  }
  function paint(fill, stroke) {
    if (fill) {
      context.fillStyle = fill;
      context.fill();
    }
    if (stroke) context.stroke();
  }
  function sparkle(x, y, scale, fill = gold) {
    line([[x, y - scale], [x + scale / 3, y - scale / 3], [x + scale, y],
      [x + scale / 3, y + scale / 3], [x, y + scale], [x - scale / 3, y + scale / 3],
      [x - scale, y], [x - scale / 3, y - scale / 3]], fill);
  }
  function dots(yMax, color) {
    for (let i = 1; i < 150; i++) {
      const x = (i * 149) % 400;
      const y = (i * i * 37 + i * 29) % yMax;
      oval(x, y, 0.8, 0.8, color, false);
    }
  }

  const backgrounds = {
    office() {
      rect(0, 0, 400, 270, "#a36a87", false);
      for (let x = 4; x < 400; x += 28) rect(x, 0, 11, 160, "#b57b96", false);
      rect(122, 12, 135, 119, gold, true, 12);
      rect(129, 19, 121, 105, "#726390", true, 7);
      line([[130, 99], [149, 81], [169, 104], [183, 95], [204, 111], [231, 89], [248, 100], [248, 123], [130, 123]], "#423658");
      rect(115, 121, 150, 10, "#d99657", true, 3);
      rect(0, 136, 400, 34, "#794d56");
      for (let x = 12; x < 400; x += 67) rect(x, 143, 50, 20, "#a46155", true, 3);
      rect(-4, 165, 408, 108, "#d49a6b", true);
      rect(-3, 165, 406, 8, "#eab981");
      line([[0, 229], [400, 234]]);
      line([[0, 253], [400, 249]]);
      rect(120, 181, 135, 58, "#897c9e", true, 7);
      dots(164, "#d098ab");
    },
    port() {
      rect(0, 0, 400, 270, "#f1b88f", false);
      dots(110, "#fbd2a8");
      line([[0, 112], [41, 97], [72, 110], [115, 95], [132, 109], [249, 112],
        [285, 94], [315, 99], [359, 85], [400, 105], [400, 150], [0, 150]], "#a07a87");
      rect(-3, 116, 406, 154, "#6eaaa6");
      for (let y = 134; y < 270; y += 21) {
        for (let x = y % 40 - 10; x < 400; x += 59) {
          rect(x, y, 18 + x % 13, 2, "#a2cec0", false, 1);
        }
      }
      line([[0, 183], [102, 186], [144, 270], [0, 270]], "#bc7c63");
      line([[0, 220], [121, 223]]);
      line([[0, 249], [135, 250]]);
      rect(116, 205, 11, 33, "#e3a475", true, 3);
      rect(0, 173, 14, 34, "#e3a475", true, 3);
    },
    roof() {
      rect(0, 0, 400, 270, "#726591", false);
      rect(0, 91, 400, 57, "#8878a0", false);
      dots(126, "#beacc3");
      for (let x = 0; x < 400; x += 48) {
        const y = 128 - x % 30;
        rect(x, y, 45, 97, "#585071");
        for (let offset = 6; offset < 41; offset += 12) rect(x + offset, y + 12, 5, 9, "#c0939a", false);
      }
      line([[0, 131], [109, 131], [109, 181], [0, 181]], "#ab716f");
      line([[146, 181], [146, 131], [211, 131]]);
      line([[162, 137], [162, 123]]);
      line([[196, 137], [196, 123]]);
      line([[225, 179], [312, 120], [392, 177], [400, 177], [400, 222], [225, 222]], "#805477");
      rect(-2, 182, 404, 90, "#9a6575");
      rect(-2, 182, 404, 10, "#cc898c");
      rect(-2, 246, 404, 26, "#b97b7f");
      for (let x = 0; x < 400; x += 42) line([[x, 246], [x + 17, 270]]);
    },
  };

  const props = {
    moon(changed) {
      context.scale(changed ? -1 : 1, 1);
      context.beginPath();
      context.arc(0, 0, 20, 0.9, Math.PI * 1.65);
      context.quadraticCurveTo(-15, 5, 12.43, 15.67);
      context.closePath();
      paint(gold, true);
    },
    clock(changed) {
      oval(0, 0, 25, 25, "#e8ab72");
      oval(0, 0, 19, 19, cream);
      line([[0, -12], [0, 0], changed ? [0, 12] : [12, 0]]);
      oval(0, 0, 2.6, 2.6, ink, false);
    },
    lamp(changed) {
      line([[-21, -1], [-25, 40], [-5, 42]]);
      rect(-34, 40, 42, 7, gold, true, 3);
      oval(0, 0, 17, 9, cream);
      line([[-15, -27], [11, -30], [27, 1], [-26, 1]], changed ? coral : teal);
      oval(-1, -31, 4.5, 4.5, gold);
    },
    books() {
      rect(-32, 4, 60, 15, "#8a719c", true, 3);
      rect(-27, 7, 47, 7, cream, false, 2);
      rect(-34, -8, 63, 12, teal, true, 3);
      rect(-28, -5, 47, 5, cream, false);
      rect(-23, -22, 49, 14, coral, true, 3);
      rect(-18, -19, 39, 8, cream, false, 1);
    },
    key(changed) {
      context.scale(changed ? -1 : 1, 1);
      oval(-16, 0, 11, 11, gold);
      oval(-16, 0, 4, 5, "#897c9e");
      line([[-6, -4], [27, -4], [27, 8], [20, 8], [20, 4], [15, 4], [15, 9], [10, 9], [10, 4], [-6, 4]], gold);
    },
    mug(changed) {
      oval(17, -2, 12, 11, gold);
      oval(17, -2, 6, 5, "#af846b");
      rect(-19, -15, 36, 32, gold, true, 8);
      oval(-1, -12, 18, 6, "#c68c5f");
      if (changed) sparkle(-1, 4, 7, cream);
    },
    plant(changed) {
      line([[0, 12], [1, -20]]);
      oval(-8, -12, 12, 6, teal);
      oval(10, -5, 12, 6, teal);
      if (changed) {
        for (const [x, y] of [[0, -33], [-10, -27], [10, -27], [-6, -18], [6, -18]]) {
          oval(x, y, 5.8, 5.8, coral);
        }
        oval(0, -26, 5.5, 5.5, gold);
      }
      line([[-17, 5], [17, 5], [13, 26], [-13, 26]], "#e3946e");
      rect(-20, 1, 40, 8, "#f1ae83", true, 3);
    },
    sun() {
      for (let i = 0; i < 8; i++) {
        context.save();
        context.rotate(i * Math.PI / 4);
        line([[0, -19], [0, -24]]);
        context.restore();
      }
      oval(0, 0, 15, 15, gold);
    },
    cloud(changed) {
      context.beginPath();
      context.moveTo(-30, 9);
      context.bezierCurveTo(-38, 5, -36, -8, -24, -8);
      context.bezierCurveTo(-25, -23, -4, -24, 2, -12);
      if (changed) context.bezierCurveTo(12, -26, 26, -18, 23, -7);
      context.bezierCurveTo(32, -12, 40, 6, 29, 9);
      context.closePath();
      paint("#fff0d3", true);
    },
    sail(changed) {
      line([[-40, 17], [43, 17], [29, 33], [-25, 33]], "#e3a15c");
      line([[0, 17], [0, -38]]);
      line([[-5, -37], [-5, 12], [-41, 12]], changed ? teal : coral);
      line([[4, -26], [28, 12], [4, 12]], cream);
    },
    bird(changed) {
      function birdAt(x, y) {
        context.beginPath();
        context.moveTo(x - 13, y - 2);
        context.quadraticCurveTo(x - 5, y - 5, x, y + 4);
        context.quadraticCurveTo(x + 6, y - 5, x + 13, y - 2);
        context.stroke();
      }
      birdAt(changed ? -10 : 0, 0);
      if (changed) birdAt(19, -10);
    },
    buoy(changed) {
      oval(0, 9, 24, 9, "#e88f71");
      line([[-15, 8], [-10, -22], [10, -22], [15, 8]], coral);
      rect(-11, -12, 22, 4, cream, false);
      if (changed) rect(-13, -2, 26, 4, cream, false);
      oval(0, -24, 4, 4, gold);
    },
    box(changed) {
      if (changed) line([[-26, -10], [-21, -31], [24, -31], [26, -10]], "#e1a167");
      rect(-26, -9, 52, 29, "#a36253", true, 3);
      rect(-28, -11, 56, changed ? 5 : 10, "#dda173", true, 3);
      rect(-5, 2, 10, 9, gold, true, 2);
    },
    fish(changed) {
      context.scale(changed ? -1 : 1, 1);
      line([[-11, 0], [-27, -12], [-27, 12]], "#ffae82");
      oval(1, 0, 17, 10, "#f5c081");
      oval(10, -2, 2.6, 2.6, ink, false);
    },
    star(changed) {
      if (changed) {
        sparkle(-11, 0, 8);
        sparkle(11, -5, 8);
      } else sparkle(0, 0, 13);
    },
    window(changed) {
      rect(-22, -18, 44, 36, "#d2a581", true, 3);
      rect(-17, -13, 34, 26, "#5a4b70");
      rect(-16, -12, 15, 12, gold, false);
      if (changed) rect(1, -12, 15, 12, gold, false);
      line([[0, -13], [0, 13]]);
      line([[-17, 0], [17, 0]]);
    },
    chimney(changed) {
      rect(-17, changed ? -26 : -14, 34, changed ? 45 : 33, "#e39484");
      rect(-21, changed ? -31 : -19, 42, 7, cream, true, 2);
      line([[-17, 0], [17, 0]]);
      line([[6, 0], [6, 19]]);
      line([[-5, -13], [-5, 0]]);
      if (changed) line([[-17, -13], [17, -13]]);
    },
  };

  backgrounds[id]();
  for (const [shape, x, y, clue] of scenes[id].places) {
    context.save();
    context.translate(x, y);
    props[shape](Boolean(variant && clue));
    context.restore();
  }
}
