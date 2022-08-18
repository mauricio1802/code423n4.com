import clsx from "clsx";
import React, { ReactNode, useState } from "react";

import * as styles from "./Input.module.scss";

// @todo: replace TextField widgets with this component

interface InputProps {
  name: string;
  value: string;
  label?: string | ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string | ReactNode;
  canRemove?: boolean;
  toggleEdit?: boolean;
  // optional button to show after the input
  button?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveInputField?: (name: string) => void;
  handleButtonClick?: (value: string) => void;
  handleSaveInputValue?: (name: string, value: string) => void;
  // returns an array of error messages
  validator?: (value: string) => (string | ReactNode)[];
}

export function Input({
  name,
  value,
  label,
  required,
  placeholder,
  disabled,
  helpText,
  canRemove = false,
  toggleEdit,
  button,
  handleChange,
  handleRemoveInputField,
  handleButtonClick,
  handleSaveInputValue,
  validator,
}: InputProps) {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    (string | ReactNode)[]
  >([]);

  const validate = (): (string | ReactNode)[] => {
    let errorMessages: (string | ReactNode)[] = [];
    if (validator) {
      const validationErrors = validator(value);
      if (validationErrors.length > 0) {
        errorMessages = errorMessages.concat(validationErrors);
      }
    }
    if (required && (value === "" || value === undefined)) {
      errorMessages.push("This field is required");
    }
    if (errorMessages.length > 0) {
      setIsInvalid(true);
      setValidationErrors(errorMessages);
    } else {
      setIsInvalid(false);
      setValidationErrors([]);
    }
    return errorMessages;
  };

  const handleEditOrSaveClick = () => {
    if (!isEditing) {
      setIsEditing((prevState) => !prevState);
      return;
    }

    if (handleSaveInputValue) {
      const errorMessages = validate();
      if (errorMessages.length > 0) {
        return;
      }
      handleSaveInputValue(name, value);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {label && (
        <label className={styles.Label} htmlFor={name}>
          {required ? label + " *" : label}
        </label>
      )}
      {helpText && <p className={styles.Help}>{helpText}</p>}
      <div className={styles.InputWrapper}>
        <input
          className={clsx(
            styles.Control,
            styles.Text,
            isInvalid && styles.InputError
          )}
          name={name}
          placeholder={placeholder || ""}
          type="text"
          value={value}
          autoComplete="off"
          onBlur={validate}
          onChange={handleChange}
          disabled={disabled || (toggleEdit && !isEditing)}
        />
        {canRemove && handleRemoveInputField && (
          <button
            className={styles.DeleteButton}
            type="button"
            onClick={() => handleRemoveInputField(name)}
            aria-label="Remove this field"
          >
            &#x2715;
          </button>
        )}
        {toggleEdit && handleSaveInputValue && (
          <button
            type="button"
            onClick={handleEditOrSaveClick}
            aria-label="Edit this field"
            className={clsx(
              styles.SmallButton,
              isEditing ? styles.SaveButton : styles.EditButton
            )}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        )}
        {button && handleButtonClick && (
          <button
            className={styles.DeleteButton}
            type="button"
            onClick={() => handleButtonClick(value)}
          >
            {button}
          </button>
        )}
      </div>
      {isInvalid &&
        validationErrors.map((validationError) => (
          <label htmlFor={name} className={styles.ErrorMessage}>
            {validationError}
          </label>
        ))}
    </div>
  );
}
