import React, { useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./App.css";

const particlesInit = async (main) => {
  await loadFull(main);
};

const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + (R * percent) / 100));
  G = Math.min(255, Math.max(0, G + (G * percent) / 100));
  B = Math.min(255, Math.max(0, B + (B * percent) / 100));

  return (
    "#" +
    [R, G, B]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const generateColorsFromBase = (baseColor) => {
  const shades = [-60, -30, 0, 30, 60]; // Percentages for lighter and darker shades
  return shades.map((percent) => shadeColor(baseColor, percent));
};

function App() {
  const [baseColors, setBaseColors] = useState([]);
  const [generatedPalette, setGeneratedPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [paletteName, setPaletteName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#00ff00");

  const addBaseColor = (color) => {
    if (!baseColors.includes(color)) {
      setBaseColors([...baseColors, color]);
    }
  };

  const deleteAllBaseColors = () => {
    setBaseColors([]);
    setGeneratedPalette([]);
  };

  const generatePalette = () => {
    const newPalettes = baseColors.map((baseColor) => {
      return generateColorsFromBase(baseColor); // Generate a palette for each base color
    });
    setGeneratedPalette(newPalettes);
  };

  const savePalette = () => {
    if (paletteName && generatedPalette.length > 0) {
      const newPalette = { name: paletteName, colors: generatedPalette };
      setSavedPalettes([...savedPalettes, newPalette]);
      setPaletteName("");
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard`);
  };

  const deleteSavedPalette = (index) => {
    const updatedPalettes = savedPalettes.filter((_, idx) => idx !== index);
    setSavedPalettes(updatedPalettes);
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: "#f7f7f7" },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#000000" },
            links: {
              color: "#000000",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              speed: 2,
            },
            number: {
              value: 40,
              density: { enable: true, area: 800 },
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />

      <div className="container">
        <h1>Color Palette Generator</h1>

        <div className="layout">
          {/* LEFT SECTION */}
          <div className="left-panel">
            <div className="color-controls">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <button onClick={() => addBaseColor(selectedColor)}>Add Color</button>
              <button onClick={deleteAllBaseColors}>Delete All Base Colors</button>
              <button onClick={generatePalette}>Generate Palette</button>
            </div>

            <div>
              <h2>Base Colors</h2>
              <div className="swatches">
                {baseColors.map((color, idx) => (
                  <div key={idx} className="swatch" style={{ backgroundColor: color }}>
                    <span>{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="right-panel">
            <h2>Generated Palette</h2>
            <div className="generated-palettes">
              {Array.isArray(generatedPalette) &&
                generatedPalette.map((palette, idx) => (
                  Array.isArray(palette) && (
                    <div key={idx} className="palette-row">
                      {palette.map((color, index) => (
                        <div
                          key={index}
                          className="swatch"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color)}
                        >
                          <span>{color}</span>
                        </div>
                      ))}
                    </div>
                  )
                ))}
            </div>
          </div>
        </div>

        {/* SAVED PALETTES */}
        <div className="saved-section">
          <div className="save-controls">
            <input
              type="text"
              placeholder="Palette Name"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
            />
            <button onClick={savePalette}>Save Palette</button>
          </div>

          <div className="saved-palettes">
            <h2>Saved Palettes</h2>
            {savedPalettes.map((palette, idx) => (
              <div key={idx} className="saved-palette">
                <div className="palette-header">
                  <h3>{palette.name}</h3>
                  <button onClick={() => deleteSavedPalette(idx)}>Delete</button>
                </div>
                <div className="swatches">
                  {palette.colors.flat().map((color, index) => ( // Flatten the nested array
                    <div
                      key={index}
                      className="swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                    >
                      <span>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
