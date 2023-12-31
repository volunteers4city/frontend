import Select from 'react-select';
import './SelectOption.scss';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

function SelectOption({
	label,
	placeholder,
	options,
	handleChange,
	handleClear,
	error,
	value,
	isMulti,
	addCloseButton,
	required,
	...props
}) {
	const customStyles = {
		control: (baseStyles) => ({
			...baseStyles,
			fontFamily: 'Fira Sans',
			fontSize: '20px',
			fontStyle: 'normal',
			fontWeight: '400',
			lineHeight: '23px',
			borderRadius: '5px',
			borderColor: error ? '#f78254' : '#3f3f3f',
			borderWidth: '1px',
			minHeight: '50px',
			padding: '2px 5px',
			'&:hover': {
				borderColor: '#3f3f3f',
			},
		}),
		dropdownIndicator: (baseStyles) => ({
			...baseStyles,
			padding: '11px 12px',
			color: '#3f3f3f',
			'&:hover': {
				color: '#3f3f3f',
			},
		}),
		placeholder: (baseStyles) => ({
			...baseStyles,
			fontFamily: 'Fira Sans',
			fontSize: '20px',
			fontStyle: 'normal',
			fontWeight: '400',
			lineHeight: '23px',
			color: '#c5c5c5',
		}),
		menu: (baseStyles) => ({
			...baseStyles,
		}),
		option: (baseStyles) => ({
			...baseStyles,
			fontFamily: 'Fira Sans',
			fontSize: '20px',
			fontStyle: 'normal',
			fontWeight: '400',
			lineHeight: '23px',
			padding: '8px 16px',
		}),
	};

	const changeOption = useCallback(
		(option) => {
			handleChange(option);
		},
		[handleChange]
	);

	const clearValue = (e) => {
		e.stopPropagation();
		handleClear();
	};

	return (
		<div className="select-option__container">
			<label className="select-option__label" htmlFor="select-option">
				{required ? `${label}*` : label}
			</label>
			<Select
				className="select-option"
				placeholder={placeholder}
				options={options}
				value={value}
				onChange={changeOption}
				components={{
					IndicatorSeparator: () => null,
				}}
				styles={customStyles}
				theme={(theme) => ({
					...theme,
					borderRadius: 5,
					colors: {
						...theme.colors,
						primary25: '#a6c94f',
						primary: '#a6c94f',
					},
				})}
				isMulti={isMulti}
				{...props}
			/>
			{value.length > 0 && !isMulti && addCloseButton && (
				<button
					className="select-option__close-icon"
					type="button"
					aria-label="Закрыть"
					defaultValue=""
					onClick={clearValue}
				/>
			)}
			<span className="select-option__error-message">
				{error && props.helperText}
			</span>
		</div>
	);
}

SelectOption.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	handleChange: PropTypes.func,
	addCloseButton: PropTypes.bool,
	handleClear: PropTypes.func,
	error: PropTypes.bool,
	isMulti: PropTypes.bool,
	required: PropTypes.bool,
	value: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			name: PropTypes.string,
		})
	),
	helperText: PropTypes.string,
};

SelectOption.defaultProps = {
	label: 'Город',
	placeholder: 'Выберите город',
	options: [
		{ label: 'Москва', value: 'moscow' },
		{ label: 'Воронеж', value: 'voronezh' },
		{ label: 'Тула', value: 'tula' },
		{ label: 'Санкт-Петербург', value: 'sankt-petersburg' },
		{ label: 'Екатеринбург', value: 'yekaterinburg' },
		{ label: 'Курск', value: 'kursk' },
		{ label: 'Белгород', value: 'belgorod' },
		{ label: 'Казань', value: 'kazan' },
	],
	handleChange: () => {},
	handleClear: () => {},
	error: false,
	isMulti: false,
	required: false,
	value: [],
	addCloseButton: false,
	helperText: '',
};

export default SelectOption;
