import React from "react";
import { test_backend } from "../../declarations/new_test_backend";

export default function Gallery() {
    const [artClean, setArtClean] = React.useState([]);
    const galleryImageSize = '200px'; // Adjust this size to match your design

    React.useEffect(() => {
        async function getArt() {
            const art = await test_backend.getKeyValuePair();
            const a = art.split(")(");
            const b = a.map(val => val.replace("(", "").replace(")", "").split(","));
            console.log(b);
            setArtClean(b);
        }
        getArt();
    }, []);

    return (
        <div style={{ margin: 5 }}>
            <div className="gallery-header">
                <h1>Gallery</h1>
            </div>
            <div className="col" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                {artClean.length > 0 && artClean.map((val, i) => {
                    return (
                        <div key={i} className="gallery-item">
                            <img src={val[1] + "," + val[2]} style={{ width: galleryImageSize, height: galleryImageSize }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
