import React, {useState} from "react";

import FlexBox from "../../FlexBox.js";
import Button from "../../controls/Button.js";
import IntegerTextField from "../../controls/IntegerTextField.js";
import SelectMenu from "../../controls/SelectMenu.js";
import {useComponentDidMount, useMedia} from "../../../hooks.js";
import Color from "../../../graphics/Color.js";
import DotCanvas from "../../../graphics/DotCanvas.js";
import IntegerPartition from "../../../math/IntegerPartition.js";

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
            canvas.cut(-1, 1, 0, Color.Purple, Color.Azure);
            await pause(0.5);
            canvas.move(Color.Purple, 0, 1);
            canvas.move(Color.Azure, -1, 0);
            await pause(1);
            canvas.paste(Color.Purple, Color.Azure, Color.CobaltBlue);
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
            canvas.shred(Color.CobaltBlue, Color.Purple, Color.Aquamarine);
            await pause(0.5);
            canvas.move(Color.Purple, 1, 0);
            await pause(1);
            canvas.stretch(Color.Purple, 0.5, 0.5);
            canvas.stretch(Color.Aquamarine, 0.5, 0.5);
            await pause(1);
            canvas.move(Color.Purple, 0, 1);
            await pause(1);
            canvas.paste(Color.Purple, Color.Aquamarine, Color.CobaltBlue);
            await pause(0.5);
            canvas.transpose(Color.CobaltBlue);
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
            canvas.cut(-1, 1, 1, Color.Purple, Color.DarkCyan);
            await pause(0.5);
            canvas.shift(Color.DarkCyan, 1, -1, 0, 1);
            canvas.shift(Color.Purple, 1, 0, -1, 1);
            await pause(1);
            canvas.move(Color.Purple, 0, -1);
            await pause(1);
            canvas.transpose(Color.Purple);
            await pause(1);
            canvas.stretch(Color.DarkCyan, 2, 1);
            canvas.stretch(Color.Purple, 2, 1);
            await pause(1);
            canvas.move(Color.Purple, 1, 0);
            await pause(1);
            canvas.paste(Color.Purple, Color.DarkCyan, Color.CobaltBlue);
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
            canvas.cut(-1, 2, 0, Color.Carnelian, Color.CobaltBlue);
            await pause(0.5);
            canvas.move(Color.CobaltBlue, -1, 0);
            await pause(1);
            canvas.shift(Color.CobaltBlue, 1, -2, 0, 1);
            await pause(1);
            canvas.shred(Color.CobaltBlue, Color.CobaltBlue, Color.KellyGreen);
            await pause(0.5);
            canvas.move(Color.CobaltBlue, 1, 0);
            await pause(1);
            canvas.stretch(Color.CobaltBlue, 0.5, 0.5);
            canvas.stretch(Color.KellyGreen, 0.5, 0.5);
            await pause(1);
            canvas.move(Color.KellyGreen, 0, 1);
            await pause(1);
            canvas.paste(Color.CobaltBlue, Color.KellyGreen, Color.Gold);
            await pause(0.5);
            canvas.shred(Color.Carnelian, Color.Carnelian, Color.Aquamarine);
            await pause(0.5);
            canvas.move(Color.Carnelian, 1, 0);
            await pause(1);
            canvas.stretch(Color.Carnelian, 0.5, 1);
            canvas.stretch(Color.Aquamarine, 0.5, 1);
            await pause(1);
            canvas.move(Color.Aquamarine, 0, -1);
            await pause(1);
            canvas.shift(Color.Carnelian, 1, 0, -1, 1);
            canvas.shift(Color.Aquamarine, 1, 0, -1, 1);
            await pause(1);
            canvas.transpose(Color.Carnelian);
            canvas.transpose(Color.Aquamarine);
            await pause(1);
            canvas.stretch(Color.Carnelian, 1, 0.5);
            canvas.stretch(Color.Aquamarine, 1, 0.5);
            await pause(1);
            canvas.move(Color.Aquamarine, 0, 1);
            await pause(1);
            canvas.paste(Color.Carnelian, Color.Aquamarine, Color.Carnelian);
            await pause(0.5);
            canvas.add(Color.Gold, Color.Carnelian);
            await pause(1);
            canvas.paste(Color.Gold, Color.Carnelian, Color.CobaltBlue);
        }
    }
};

function GUI() {

    const [partitionSizeString, setPartitionSizeString] = useState("");
    const [bijectionName, setBijectionName] = useState(null);

    const windowWidthIsExtraSmall = useMedia("(min-width: 600px)") === false;
    const windowWidthIsAtLeastMedium = useMedia("(min-width: 960px)");
    const bijectionDescriptionIsInControlPanel = (
        windowWidthIsExtraSmall || windowWidthIsAtLeastMedium
    );

    const partitionSize = parseInt(partitionSizeString, 10);
    const bijection = bijections[bijectionName];
    const buttonIsDisabled = (
        isNaN(partitionSize)
        || bijectionName === null
        || bijection.validatePartitionSize(partitionSize) === false
    );

    const dotRadius = 5;
    const latticeUnit = dotRadius * 3;

    const createFerrersDiagram = () => {
        const partition = bijection.generateRandomPartition(partitionSize);
        const dots = [];
        const offset = dotRadius * 2;
        for (let i = 0; i < partition.length; i += 1) {
            for (let j = 0; j < partition[i]; j += 1) {
                dots.push({
                    x: j * latticeUnit + offset,
                    y: i * latticeUnit + offset,
                    radius: dotRadius,
                    color: Color.CobaltBlue
                });
            }
        }
        return dots;
    };

    const animateBijection = async () => {
        const ferrersDiagram = createFerrersDiagram();
        const canvas = DotCanvas("canvas", latticeUnit);
        canvas.addDots(ferrersDiagram);
        canvas.draw();
        await pause(0.5);
        await bijection.animate(canvas);
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
