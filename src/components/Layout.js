import React from "react";

import FlexBox from "./FlexBox.js";
import Footer from "./Footer.js";
import NavigationBar from "./NavigationBar.js";
import ContentView from "./views/ContentView/index.js";

function Layout() {
    return (
        <FlexBox style={{minHeight: "100vh"}}>
            <NavigationBar/>
            <ContentView/>
            <Footer/>
        </FlexBox>
    );
}

export default Layout;
