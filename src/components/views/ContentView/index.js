import React from "react";

import GUI from "./GUI.js";
import FlexBox from "../../FlexBox.js";

const styles = {
    root: {
        padding: 16
    },
    about: {
        padding: "64px 32px"
    },
    title: {
        textAlign: "center",
        color: "black",
        marginTop: 0
    },
    text: {
        color: "black"
    }
};

const URLs = Object.freeze({
    Issues: "https://github.com/kristorres/react-partitions/issues",
    Paper: "https://www.math.ucla.edu/~pak/papers/stab5.pdf"
});

function ContentView() {
    return (
        <FlexBox
            component="main"
            level={1}
            className="mdc-theme--background"
            style={styles.root}
        >
            <FlexBox level={1} style={styles.about}>
                <h1 className="mdc-typography--headline2" style={styles.title}>
                    React Partitions
                </h1>
                <p className="mdc-typography--body1" style={styles.text}>
                    <b>NOTE:</b> This web app works best in a wide browser
                    window (at least 1,280 px wide).
                </p>
                <p className="mdc-typography--body1" style={styles.text}>
                    {"The web app features four integer partition bijections "}
                    {"that are documented in Igor Pak’s "}
                    <a href={URLs.Paper}>
                        <i>The Nature of Partition Bijections II</i>
                    </a>
                    {":"}
                </p>
                <ul>
                    <li className="mdc-typography--body1" style={styles.text}>
                        “Strike-slip” bijection (p. 7)
                    </li>
                    <li className="mdc-typography--body1" style={styles.text}>
                        “Shred-and-stretch” bijection (p. 14)
                    </li>
                    <li className="mdc-typography--body1" style={styles.text}>
                        “Cut-and-stretch” bijection (p. 18)
                    </li>
                    <li className="mdc-typography--body1" style={styles.text}>
                        Sylvester’s/Glaisher’s bijection (p. 20)
                    </li>
                </ul>
                <p className="mdc-typography--body1" style={styles.text}>
                    Please <a href={URLs.Issues}>file issues</a> if there are
                    any bugs or other bijections that are not mentioned above.
                    I’ll be more than happy to implement and add them as soon as
                    possible.
                </p>
            </FlexBox>
            <GUI/>
        </FlexBox>
    );
}

export default ContentView;
