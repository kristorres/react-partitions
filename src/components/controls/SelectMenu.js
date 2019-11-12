import {MDCSelect} from "@material/select";
import PropTypes from "prop-types";
import React from "react";

import {useComponentDidMount} from "../../hooks.js";

function MenuItem({value, onSelect, isSelected}) {
    let className = "mdc-list-item";
    if (isSelected) {
        className += " mdc-list-item--selected";
    }
    return (
        <li className={className} data-value={value} onClick={onSelect}>
            {value}
        </li>
    );
}

function SelectMenu({label, value, options, setValue, width, style}) {

    const styles = {
        width: {
            width
        }
    };

    const id = label.replace(/ /g, "-").toLowerCase();
    const currentValue = (options.includes(value)) ? value : "";

    const menuItems = options.map(
        (option, index) => (
            <MenuItem
                key={index.toString()}
                value={option}
                onSelect={() => setValue(option)}
                isSelected={option === currentValue}
            />
        )
    );

    useComponentDidMount(
        () => {
            new MDCSelect(document.querySelector(`.${id}`));
        }
    );

    return (
        <div
            className={`mdc-select mdc-select--outlined ${id}`}
            style={{...styles.width, ...style}}
        >
            <input type="hidden" name="enhanced-select"/>
            <i className="mdc-select__dropdown-icon"></i>
            <div className="mdc-select__selected-text">{currentValue}</div>
            <div
                className="mdc-select__menu mdc-menu mdc-menu-surface"
                style={styles.width}
            >
                <ul className="mdc-list">
                    {menuItems}
                </ul>
            </div>
            <div className="mdc-notched-outline">
                <div className="mdc-notched-outline__leading"></div>
                <div className="mdc-notched-outline__notch">
                    <label className="mdc-floating-label">{label}</label>
                </div>
                <div className="mdc-notched-outline__trailing"></div>
            </div>
        </div>
    );
}

SelectMenu.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    setValue: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired
};

SelectMenu.defaultProps = {
    value: null,
    style: {}
};

export default SelectMenu;
