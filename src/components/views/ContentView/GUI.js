import React, {useState} from "react";

import FlexBox from "../../FlexBox.js";
import IntegerTextField from "../../controls/IntegerTextField.js";
import SelectMenu from "../../controls/SelectMenu.js";
import {useMedia} from "../../../hooks.js";

const styles = {
    root: {
        backgroundColor: "#F5F5F5",
        width: "100%",
        minHeight: 1000
    },
    controlPanel: {
        padding: "24px 0"
    },
    control: {
        width: 240,
        margin: 12
    },
    bijectionDescription: {
        margin: 0
    }
};

const bijectionDescriptions = {
    "Strike-slip": (
        "Works on most partitions."
    ),
    "Shred-and-stretch": (
        "Even partition ↦ Even partition"
    ),
    "Cut-and-stretch": (
        "Self-conjugate partition ↦ Partition with distinct odd parts"
    ),
    "Sylvester/Glaisher": (
        "Odd partition ↦ Partition with distinct parts"
    )
};

function GUI() {
    const [partitionSizeString, setPartitionSizeString] = useState("");
    const [bijection, setBijection] = useState(null);
    const windowWidthIsAtLeastSmall = useMedia("(min-width: 600px)");
    return (
        <div style={styles.root}>
            <FlexBox
                direction={windowWidthIsAtLeastSmall ? "row" : "column"}
                justifyContent="center"
                alignItems="center"
                style={styles.controlPanel}
            >
                <IntegerTextField
                    style={styles.control}
                    label="Partition Size"
                    value={partitionSizeString}
                    setValue={setPartitionSizeString}
                    min={1}
                />
                <SelectMenu
                    style={styles.control}
                    label="Bijection"
                    value={bijection}
                    options={Object.keys(bijectionDescriptions)}
                    setValue={setBijection}
                    width={240}
                />
                <div style={styles.control}>
                    <p
                        className="mdc-typography--body1"
                        style={styles.bijectionDescription}
                    >
                        {bijectionDescriptions[bijection] || ""}
                    </p>
                </div>
            </FlexBox>
        </div>
    );
}

export default GUI;
