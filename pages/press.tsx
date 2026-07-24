import React from "react";
import styles from "../styles/Press.module.css";

const ASSETS = [];

const Press = () => {
  return (
    <div>
      <h1>Inngest Press Kit</h1>
      <h4>When referencing us on the web, feel free to use these assets.</h4>
      <div>
        {ASSETS.map((asset) => (
          <div>
            <a href={asset.src} download>
              <img src={asset.src} />
            </a>
            <div>{asset.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Press;
