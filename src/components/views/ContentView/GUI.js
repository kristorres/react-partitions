import React, {useState} from "react";

import FlexBox from "../../FlexBox.js";
import IntegerTextField from "../../controls/IntegerTextField.js";
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
    }
};

function GUI() {
    const [partitionSizeString, setPartitionSizeString] = useState("");
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
            </FlexBox>
        </div>
    );
}

export default GUI;
