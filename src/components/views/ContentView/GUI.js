import React, {useState} from "react";

import FlexBox from "../../FlexBox.js";
import Button from "../../controls/Button.js";
import IntegerTextField from "../../controls/IntegerTextField.js";
import SelectMenu from "../../controls/SelectMenu.js";
import {useComponentDidMount, useMedia} from "../../../hooks.js";

const styles = {
    root: {
        width: "100%"
    },
    controlPanel: {
        padding: "12px 0"
    },
    control: {
        width: 240,
        margin: 12
    },
    bijectionDescription: {
        margin: 0
    },
    button: {
        margin: 12
    },
    canvas: {
        backgroundColor: "white",
        border: "2px solid black",
        marginTop: 12
    }
};

const bijections = {
    "Strike-slip": {
        description: (
            "Works on most partitions."
        ),
        validatePartitionSize: (n) => true
    },
    "Shred-and-stretch": {
        description: (
            "Even partition ↦ Even partition"
        ),
        validatePartitionSize: (n) => n % 2 === 0
    },
    "Cut-and-stretch": {
        description: (
            "Self-conjugate partition ↦ Partition with distinct odd parts"
        ),
        validatePartitionSize: (n) => n !== 2
    },
    "Sylvester/Glaisher": {
        description: (
            "Odd partition ↦ Partition with distinct parts"
        ),
        validatePartitionSize: (n) => true
    }
};

function GUI() {

    const [partitionSizeString, setPartitionSizeString] = useState("");
    const [bijectionName, setBijectionName] = useState(null);

    const windowWidthIsExtraSmall = useMedia("(min-width: 600px)") === false;
    const windowWidthIsAtLeastMedium = useMedia("(min-width: 960px)");
    const bijectionDescriptionIsInControlPanel = (
        windowWidthIsExtraSmall
        || windowWidthIsAtLeastMedium
    );

    const partitionSize = parseInt(partitionSizeString, 10);
    const bijection = bijections[bijectionName];
    const buttonIsDisabled = (
        isNaN(partitionSize)
        || bijectionName === null
        || bijection.validatePartitionSize(partitionSize) === false
    );

    const setCanvasWidth = () => {
        const context = document.querySelector("canvas").getContext("2d");
        context.canvas.width = document.querySelector(".gui").clientWidth - 4;
    };

    function BijectionDescriptionView() {
        const style = {
            width: (windowWidthIsAtLeastMedium) ? 240 : undefined,
            margin: 12
        };
        return (
            <div style={style}>
                <p
                    className="mdc-typography--body1"
                    style={styles.bijectionDescription}
                >
                    {bijection?.description ?? ""}
                </p>
            </div>
        );
    }

    useComponentDidMount(
        () => {
            setCanvasWidth();
            window.addEventListener("resize", setCanvasWidth);
            return () => {
                window.removeEventListener("resize", setCanvasWidth);
            };
        }
    );

    return (
        <div className="gui" style={styles.root}>
            <FlexBox
                direction={windowWidthIsExtraSmall ? "column" : "row"}
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
                    value={bijectionName}
                    options={Object.keys(bijections)}
                    setValue={setBijectionName}
                    width={240}
                />
                {(bijectionDescriptionIsInControlPanel) && (
                    <BijectionDescriptionView/>
                )}
                <Button
                    style={styles.button}
                    label="Animate"
                    disabled={buttonIsDisabled}
                />
            </FlexBox>
            {(bijectionDescriptionIsInControlPanel === false) && (
                <FlexBox justifyContent="center" alignItems="center">
                    <BijectionDescriptionView/>
                </FlexBox>
            )}
            <canvas height="1000" style={styles.canvas}></canvas>
        </div>
    );
}

export default GUI;
