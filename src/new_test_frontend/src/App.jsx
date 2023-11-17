import React from "react";
import { AuthClient } from "@dfinity/auth-client";
import { test_backend } from "../../declarations/new_test_backend";
import html2canvas from "html2canvas";
import "../assets/main.css"
import Gallery from "./gallery";

export default function App() {
    const [userKey, setUserKey] = React.useState("");
    const [pixels, setPixels] = React.useState([]);
    const [mouseDown, setMouseDown] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState("red");
    const [gridSize, setGridSize] = React.useState(25);
    const [art64, setArt64] = React.useState("");
    const [showGallery, setShowGallery] = React.useState(false);

    React.useEffect(() => {
        const t = []
        for (let i = 0; i < gridSize; i++) {
            const row = []
            for (let j = 0; j < gridSize; j++)
                row.push({ color: "none" })
            t.push(row)
        }
        setPixels(t)
    }, [])

    async function addArt(data) {
        const id = await test_backend.setArt(userKey, data);
        console.log(id);
        alert("Congrats! Your Pixel Art has been saved on the blockchain! Checkout your Gallery to see it!")
    }

    React.useEffect(() => {
        const userKey = sessionStorage.getItem("dfx-identity");
        if (userKey) {
            setUserKey(userKey);
        }
    }, [])

    async function connect() {
        const authClient = await AuthClient.create();
        function handleAuthenticated(authClient) {
            console.log(authClient)
            const pubKey = authClient._chain.publicKey
            // convert pubKey array buffer to string
            const pubKeyStr = Array.from(new Uint8Array(pubKey)).map(val => val.toString(16).padStart(2, '0')).join('');
            setUserKey(pubKeyStr);
            sessionStorage.setItem("dfx-identity", pubKeyStr);
        }
        authClient.login({
            // 1 day
            maxTimeToLive: BigInt(1 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            onSuccess: async () => { handleAuthenticated(authClient) },
        });
    }

    async function disconnect() {
        const authClient = await AuthClient.create();
        authClient.logout();
        setUserKey("");
        sessionStorage.removeItem("dfx-identity");
    }

    const Pixel = ({ x, y, color }) => {
        const pixelSize = 20; // or any size that fits your design
        return (
            <div
                className="pixel"
                style={{
                    backgroundColor: color,
                    width: `${pixelSize}px`,
                    height: `${pixelSize}px`
                }}
                onMouseOver={() => {
                    if (mouseDown) {
                        setPixels(prev => {
                            const t = [...prev];
                            t[y][x].color = selectedColor;
                            return t;
                        });
                    }
                }}
            />
        );
    };
    
    const ColorButton = ({ color }) => {
        return <div className="color" style={{ backgroundColor: color }}
            onClick={() => {
                setSelectedColor(color)
                console.log("color set:", color)
            }}
        ></div>
    }

    return (
        <div>
          <nav className="nav-header">
            <div style={{ fontWeight: "bold", fontSize: "25px", flex: 1, textAlign: "center" }}>LittlePicasso</div>
            <div>
              {userKey ? (
                <>
                  {userKey.substring(0, 5)}...{userKey.substring(userKey.length - 5)}
                  <button onClick={disconnect}>disconnect</button>
                </>
              ) : (
                <button onClick={connect}>connect</button>
              )}
            </div>
          </nav>
          <div className="intro-text">
            <h2>Welcome to LittlePicasso! 🎨</h2>
            <p>
            Embark on an 🎨 <span className="highlight">artistic quest</span> with <span className="highlightt">LittlePicasso</span>, where your
            <span className="highlighttt">imagination</span> is the canvas and the <span className="highlightttt">Internet Computer</span> is your playground! 🌈
            </p>
            <p>
            Create, play, and explore a world of colors and shapes that bring your dreams to life. 🚀 Let's paint a
            masterpiece that's uniquely yours and will last forever! 🌟👾
            </p>
          </div>
          {/* GRID */}
          {showGallery ? (
            <>
              <Gallery />
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <button onClick={() => setShowGallery(false)}>back</button>
              </div>
            </>
          ) : (
            <div className="row">
              <div
                className="col"
                id="artwork"
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
                style={{ border: "1px black solid" }}
              >
                {pixels.map((row, y) => (
                  <div className="row" key={y}>
                    {row.map((pixel, x) => (
                      <Pixel key={`${x}-${y}`} x={x} y={y} color={pixel.color} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="col" style={{ marginLeft: "25px" }}>
                <div className="row" style={{ marginBottom: "10px" }}>
                  <ColorButton color="red" />
                  <ColorButton color="green" />
                  <ColorButton color="blue" />
                  <ColorButton color="yellow" />
                  <ColorButton color="black" />
                  <ColorButton color="white" />
                </div>
                <div>
                  <button
                    onClick={() => {
                      setPixels((prev) =>
                        prev.map((row) => row.map((cell) => ({ ...cell, color: "none" })))
                      );
                    }}
                  >
                    clear
                  </button>
                  <button
                    onClick={() => {
                      if (userKey === "") {
                        alert("Connect to ICP first");
                        return;
                      }
                      html2canvas(document.querySelector("#artwork")).then((canvas) => {
                        document.body.appendChild(canvas).style.display = "none";
                        const dataURL = canvas.toDataURL();
                        console.log(dataURL);
                        setArt64(dataURL);
                        addArt(dataURL);
                      });
                    }}
                  >
                    Save the Image
                  </button>
                  <br />
                  <button onClick={() => setShowGallery(true)}>visit gallery</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
}