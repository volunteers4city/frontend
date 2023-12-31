import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = forwardRef(
	(
		{
			name,
			label,
			type,
			placeholder,
			value,
			handleChange,
			inputSize,
			disabled,
			required,
			error,
			submitCount,
			...restProps
		},
		ref
	) => {
		const [isFocus, setIsFocus] = React.useState(true);
		// классы
		let inputClass = '';
		let labelClass = '';
		let errorClass = '';

		if (inputSize === 'mini') {
			inputClass = 'mini';
			labelClass = 'mini';
			errorClass = 'mini';
		} else if (inputSize === 'small') {
			inputClass = 'small';
			labelClass = 'small';
			errorClass = 'small';
		} else if (inputSize === 'medium') {
			inputClass = 'medium';
			labelClass = 'medium';
			errorClass = 'medium';
		} else if (inputSize === 'large') {
			inputClass = 'large';
			labelClass = 'large';
			errorClass = 'large';
		} else if (inputSize === 'extra-large') {
			inputClass = 'extra-large';
			labelClass = 'extra-large';
			errorClass = 'extra-large';
		}

		return (
			<div>
				{label.length > 0 && (
					<label htmlFor={name} className={`label label_type-${labelClass}`}>
						{required ? `${label}*` : label}
					</label>
				)}

				<input
					ref={ref}
					name={name}
					type={type}
					value={value}
					placeholder={placeholder}
					className={`input input_type-${inputClass} ${
						(!isFocus && error) || (submitCount === 1 && error)
							? 'input_error'
							: ''
					}`}
					style={{ marginTop: label?.length === 0 && '0' }}
					required={required}
					onChange={(e) => {
						setIsFocus(true);
						handleChange(e);
					}}
					onBlur={(e) => {
						setIsFocus(false);
						const trimmedValue = e.target.value.trim();
						handleChange(e.target.name)(trimmedValue);
					}}
					{...restProps}
				/>

				<span className={`error-message error-message_type-${errorClass}`}>
					{(!isFocus && error) || (submitCount === 1 && error && error)}
				</span>
			</div>
		);
	}
);

Input.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	handleChange: PropTypes.func,
	label: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	inputSize: PropTypes.oneOf(['mini', 'small', 'medium', 'large', 'photo']),
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	error: PropTypes.string,
	submitCount: PropTypes.number,
};

Input.defaultProps = {
	placeholder: null,
	inputSize: 'medium',
	disabled: false,
	required: false,
	error: '',
	submitCount: 0,
	handleChange: () => {},
	value: '',
};

export default Input;
