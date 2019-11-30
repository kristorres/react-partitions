import {MDCRipple} from "@material/ripple";
import PropTypes from "prop-types";
import React from "react";

import {useComponentDidMount} from "../../hooks.js";

function Button({label, onPress, disabled, style}) {
    const id = label.replace(/ /g, "-").toLowerCase();
    useComponentDidMount(
        () => {
            new MDCRipple(document.querySelector(`.${id}`));
        }
    );
    return (
        <button
            className={`mdc-button mdc-button--raised ${id}`}
            style={style}
            onClick={onPress}
            disabled={(disabled) ? "disabled" : null}
        >
            <div className="mdc-button__ripple"></div>
            <span className="mdc-button__label">{label}</span>
        </button>
    );
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired
};

Button.defaultProps = {
    disabled: false,
    style: {}
};

export default Button;
