import React, {useState} from "react";

import FlexBox from "../../FlexBox.js";
import Button from "../../controls/Button.js";
import IntegerTextField from "../../controls/IntegerTextField.js";
import SelectMenu from "../../controls/SelectMenu.js";
import {useComponentDidMount, useMedia} from "../../../hooks.js";
import IntegerPartition from "../../../math/IntegerPartition.js";
import DotCanvas from "../../../models/DotCanvas.js";

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

const pause = (numberOfSeconds) => {
    return new Promise(
        (resolve) => setTimeout(resolve, numberOfSeconds * 1000)
    );
};

const partitionColor = "rgb(40, 40, 204)";

const bijections = {
    "Strike-slip": {
        description: (
            "Works on most partitions."
        ),
        validatePartitionSize: (n) => true,
        generateRandomPartition: (n) => {
            return IntegerPartition.generateRandom(n);
        },
        animate: async (canvas) => {
            const color1 = "rgb(126, 48, 177)";
            const color2 = "rgb(102, 152, 255)";
            canvas.cut(-1, 1, 0, color1, color2);
            await pause(0.5);
            canvas.move(color1, 0, 1);
            canvas.move(color2, -1, 0);
            await pause(1);
            canvas.paste(color1, color2, partitionColor);
        }
    },
    "Shred-and-stretch": {
        description: (
            "Even partition ↦ Even partition"
        ),
        validatePartitionSize: (n) => n % 2 === 0,
        generateRandomPartition: (n) => {
            return IntegerPartition.generateRandom(n, "even");
        },
        animate: async (canvas) => {
            const color1 = "rgba(154, 29, 125, 0.5)";
            const color2 = "rgba(102, 255, 204, 0.5)";
            canvas.shred(partitionColor, color1, color2);
            await pause(0.5);
            canvas.move(color1, 1, 0);
            await pause(1);
            canvas.stretch(color1, 0.5, 0.5);
            canvas.stretch(color2, 0.5, 0.5);
            await pause(1);
            canvas.move(color1, 0, 1);
            await pause(1);
            canvas.paste(color1, color2, partitionColor);
            await pause(0.5);
            canvas.transpose(partitionColor);
            await pause(1);
        }
    },
    "Cut-and-stretch": {
        description: (
            "Self-conjugate partition ↦ Partition with distinct odd parts"
        ),
        validatePartitionSize: (n) => n !== 2,
        generateRandomPartition: (n) => {
            return IntegerPartition.generateRandomSelfConjugate(n);
        },
        animate: async (canvas) => {
            const color1 = "rgba(168, 32, 133, 0.5)";
            const color2 = "rgba(73, 146, 184, 0.5)";
            canvas.cut(-1, 1, 1, color1, color2);
            await pause(0.5);
            canvas.shift(color2, 1, -1, 0, 1);
            canvas.shift(color1, 1, 0, -1, 1);
            await pause(1);
            canvas.move(color1, 0, -1);
            await pause(1);
            canvas.transpose(color1);
            await pause(1);
            canvas.stretch(color2, 2, 1);
            canvas.stretch(color1, 2, 1);
            await pause(1);
            canvas.move(color1, 1, 0);
            await pause(1);
            canvas.paste(color1, color2, partitionColor);
        }
    },
    "Sylvester/Glaisher": {
        description: (
            "Odd partition ↦ Partition with distinct parts"
        ),
        validatePartitionSize: (n) => true,
        generateRandomPartition: (n) => {
            return IntegerPartition.generateRandom(n, "odd");
        },
        animate: async (canvas) => {
            const upperColor1 = "rgba(204, 204, 1, 0.5)";
            const upperColor2 = "rgba(50, 51, 255, 0.5)";
            const upperColor3 = "rgba(1, 204, 52, 0.5)";
            const lowerColor1 = "rgba(167, 0, 0, 0.5)";
            const lowerColor2 = "rgba(204, 0, 0, 0.5)";
            const lowerColor3 = "rgba(52, 255, 204, 0.5)";
            canvas.cut(-1, 2, 0, lowerColor1, upperColor1);
            await pause(0.5);
            canvas.move(upperColor1, -1, 0);
            await pause(1);
            canvas.shift(upperColor1, 1, -2, 0, 1);
            await pause(1);
            canvas.shred(upperColor1, upperColor2, upperColor3);
            await pause(0.5);
            canvas.move(upperColor2, 1, 0);
            await pause(1);
            canvas.stretch(upperColor2, 0.5, 0.5);
            canvas.stretch(upperColor3, 0.5, 0.5);
            await pause(1);
            canvas.move(upperColor3, 0, 1);
            await pause(1);
            canvas.paste(upperColor2, upperColor3, upperColor1);
            await pause(0.5);
            canvas.shred(lowerColor1, lowerColor2, lowerColor3);
            await pause(0.5);
            canvas.move(lowerColor2, 1, 0);
            await pause(1);
            canvas.stretch(lowerColor2, 0.5, 1);
            canvas.stretch(lowerColor3, 0.5, 1);
            await pause(1);
            canvas.move(lowerColor3, 0, -1);
            await pause(1);
            canvas.shift(lowerColor2, 1, 0, -1, 1);
            canvas.shift(lowerColor3, 1, 0, -1, 1);
            await pause(1);
            canvas.transpose(lowerColor2);
            canvas.transpose(lowerColor3);
            await pause(1);
            canvas.stretch(lowerColor2, 1, 0.5);
            canvas.stretch(lowerColor3, 1, 0.5);
            await pause(1);
            canvas.move(lowerColor3, 0, 1);
            await pause(1);
            canvas.paste(lowerColor2, lowerColor3, lowerColor1);
            await pause(0.5);
            canvas.add(upperColor1, lowerColor1);
            await pause(1);
            canvas.paste(upperColor1, lowerColor1, partitionColor);
        }
    }
};

function GUI() {

    const [partitionSizeString, setPartitionSizeString] = useState("");
    const [bijectionName, setBijectionName] = useState(null);
    const [canvasIsAnimating, setCanvasIsAnimating] = useState(false);

    const windowWidthIsExtraSmall = useMedia("(min-width: 600px)") === false;
    const windowWidthIsAtLeastMedium = useMedia("(min-width: 960px)");
    const bijectionDescriptionIsInControlPanel = (
        windowWidthIsExtraSmall || windowWidthIsAtLeastMedium
    );

    const partitionSize = parseInt(partitionSizeString, 10);
    const bijection = bijections[bijectionName];
    const buttonIsDisabled = (
        canvasIsAnimating
        || isNaN(partitionSize)
        || bijectionName === null
        || bijection.validatePartitionSize(partitionSize) === false
    );

    const createFerrersDiagram = () => {
        const partition = bijection.generateRandomPartition(partitionSize);
        const dots = [];
        for (let i = 0; i < partition.length; i += 1) {
            for (let j = 0; j < partition[i]; j += 1) {
                dots.push({
                    x: j,
                    y: i,
                    color: partitionColor
                });
            }
        }
        return dots;
    };

    const animateBijection = async () => {
        const ferrersDiagram = createFerrersDiagram();
        const canvas = DotCanvas("canvas", 5);
        canvas.insertDots(ferrersDiagram);
        canvas.draw();
        setCanvasIsAnimating(true);
        await pause(0.5);
        await bijection.animate(canvas);
        setCanvasIsAnimating(false);
    };

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
                direction={(windowWidthIsExtraSmall) ? "column" : "row"}
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
                    onPress={animateBijection}
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
