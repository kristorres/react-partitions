import {MDCTextField} from "@material/textfield";
import PropTypes from "prop-types";
import React from "react";

import {useComponentDidMount} from "../../hooks.js";

const styles = {
    input: {
        textAlign: "right"
    }
};

function IntegerTextField({label, value, setValue, min, max, style}) {

    const id = label.replace(/ /g, "-").toLowerCase();

    const integerValueCanBeNegative = (
        (min !== undefined && min < 0) || (max !== undefined && max < 0)
    );

    const validInputRegex = (integerValueCanBeNegative) ? /^[-]?\d*$/ : /^\d*$/;

    const handleChange = (event) => {
        const newStringValue = event.target.value;
        if (
            validInputRegex.test(newStringValue) === false
            || newStringValue.startsWith("-0")
            || (newStringValue.startsWith("0") && newStringValue.length > 1)
        ) {
            return;
        }
        const newIntegerValue = parseInt(newStringValue, 10);
        if (isNaN(newIntegerValue)) {
            setValue(newStringValue);
            return;
        }
        if (
            (min !== undefined && newIntegerValue < min)
            || (max !== undefined && newIntegerValue > max)
        ) {
            return;
        }
        setValue(newStringValue);
    };

    const handleKeyPress = (event) => {
        const {key, target} = event;
        if (key !== "ArrowUp" && key !== "ArrowDown") {
            return;
        }
        event.preventDefault();
        const currentIntegerValue = parseInt(target.value, 10) || min || 0;
        const increment = (key === "ArrowUp") ? 1 : -1;
        const newIntegerValue = currentIntegerValue + increment;
        if (min !== undefined && newIntegerValue < min) {
            setValue(min.toString());
            return;
        }
        if (max !== undefined && newIntegerValue > max) {
            setValue(max.toString());
            return;
        }
        setValue(newIntegerValue.toString());
    };

    useComponentDidMount(
        () => {
            new MDCTextField(document.querySelector(`.${id}`));
        }
    );

    return (
        <div
            className={`mdc-text-field mdc-text-field--outlined ${id}`}
            style={style}
        >
            <input
                type="text"
                id={id}
                className="mdc-text-field__input"
                style={styles.input}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
            />
            <div className="mdc-notched-outline">
                <div className="mdc-notched-outline__leading"></div>
                <div className="mdc-notched-outline__notch">
                    <label htmlFor={id} className="mdc-floating-label">
                        {label}
                    </label>
                </div>
                <div className="mdc-notched-outline__trailing"></div>
            </div>
        </div>
    );
}

IntegerTextField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    style: PropTypes.object.isRequired
};

IntegerTextField.defaultProps = {
    style: {}
};

export default IntegerTextField;
