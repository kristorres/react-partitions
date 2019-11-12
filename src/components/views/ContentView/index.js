import React from "react";

import GUI from "./GUI.js";
import FlexBox from "../../FlexBox.js";

const styles = {
    root: {
        padding: 16
    }
};

function ContentView() {
    return (
        <FlexBox
            component="main"
            level={1}
            justifyContent="center"
            alignItems="center"
            className="mdc-theme--background"
            style={styles.root}
        >
            <GUI/>
        </FlexBox>
    );
}

export default ContentView;
